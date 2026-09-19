"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function updateStudentAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const idStr = formData.get("id") as string;
    const name = formData.get("name") as string;
    const classIdStr = formData.get("classId") as string;
    const nis = formData.get("nis") as string;
    const nisn = formData.get("nisn") as string;
    const gender = formData.get("gender") as string;
    const birthPlace = formData.get("birthPlace") as string;
    const birthDateStr = formData.get("birthDate") as string;
    const admissionYearStr = formData.get("admissionYear") as string;
    const status = formData.get("status") as string;
    const avatarFile = formData.get("avatar") as File | null;

    const id = parseInt(idStr, 10);
    if (!id || isNaN(id)) return { success: false, message: "ID siswa tidak valid." };

    const existingStudent = await prisma.student.findUnique({ where: { id } });
    if (!existingStudent) return { success: false, message: "Siswa tidak ditemukan." };

    const validStatuses = ["AKTIF", "LULUS", "NONAKTIF"];
    const trimmedName = (name || "").trim();
    if (!trimmedName) return { success: false, message: "Nama wajib diisi." };
    if (trimmedName.length < 2 || trimmedName.length > 100) return { success: false, message: "Nama harus 2-100 karakter." };

    if (status && !validStatuses.includes(status)) return { success: false, message: "Status tidak valid." };

    let admissionYear: number | null = null;
    if (admissionYearStr && admissionYearStr.trim() !== "") {
      admissionYear = parseInt(admissionYearStr, 10);
      const currentYear = new Date().getFullYear();
      if (isNaN(admissionYear) || admissionYear < 2000 || admissionYear > currentYear + 5) return { success: false, message: "Tahun masuk tidak valid." };
    }

    let avatarUrl = existingStudent.avatarUrl;
    if (avatarFile && avatarFile instanceof File && avatarFile.size > 0 && avatarFile.name) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(avatarFile.type)) return { success: false, message: "Format file tidak didukung. Harap gunakan JPG, PNG, atau WebP." };
      if (avatarFile.size > 2 * 1024 * 1024) return { success: false, message: "Ukuran file terlalu besar. Maksimal 2MB." };
      
      try {
        const bytes = await avatarFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const header = buffer.toString("hex", 0, 4);
        const isJpeg = header === "ffd8ffe0" || header === "ffd8ffe1" || header === "ffd8ffdb";
        const isPng = header === "89504e47";
        const isWebp = header.startsWith("52494646") && buffer.toString("hex", 8, 12) === "57454250";
        if (!isJpeg && !isPng && !isWebp) return { success: false, message: "File tidak valid atau rusak." };
        avatarUrl = `data:${avatarFile.type};base64,${buffer.toString("base64")}`;
      } catch (err) {
        console.error("[Student Update Avatar Error]:", err);
        return { success: false, message: "Penyimpanan gagal. Silakan coba lagi." };
      }
    }

    const validGenders = ["LAKI_LAKI", "PEREMPUAN"];
    if (gender && !validGenders.includes(gender)) return { success: false, message: "Jenis kelamin tidak valid." };

    let birthDate: Date | null = null;
    if (birthDateStr && birthDateStr.trim() !== "") {
      const s = birthDateStr.trim();
      const ddmmyyyy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      const ddmmyyyyDash = !ddmmyyyy ? s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/) : null;
      const yyyymmdd = !ddmmyyyy && !ddmmyyyyDash ? s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/) : null;
      if (ddmmyyyy || ddmmyyyyDash) {
        const m = (ddmmyyyy || ddmmyyyyDash)!;
        const d = parseInt(m[1], 10);
        const mo = parseInt(m[2], 10);
        const y = parseInt(m[3], 10);
        if (mo < 1 || mo > 12 || d < 1 || d > 31) return { success: false, message: "Tanggal lahir tidak valid. Gunakan format DD/MM/YYYY." };
        birthDate = new Date(y, mo - 1, d);
        if (birthDate.getFullYear() !== y || birthDate.getMonth() !== mo - 1 || birthDate.getDate() !== d) return { success: false, message: "Tanggal lahir tidak valid." };
      } else if (yyyymmdd) {
        const y = parseInt(yyyymmdd[1], 10);
        const mo = parseInt(yyyymmdd[2], 10);
        const d = parseInt(yyyymmdd[3], 10);
        birthDate = new Date(y, mo - 1, d);
        if (isNaN(birthDate.getTime()) || birthDate.getFullYear() !== y || birthDate.getMonth() !== mo - 1 || birthDate.getDate() !== d) return { success: false, message: "Tanggal lahir tidak valid." };
      } else {
        return { success: false, message: "Format tanggal lahir harus DD/MM/YYYY." };
      }
      if (birthDate > new Date()) return { success: false, message: "Tanggal lahir tidak boleh di masa depan." };
      if (birthDate.getFullYear() < 1900) return { success: false, message: "Tanggal lahir tidak valid." };
    }

    const birthPlaceTrim = (birthPlace || "").trim();
    if (birthPlaceTrim && birthPlaceTrim.length > 100) return { success: false, message: "Tempat lahir maksimal 100 karakter." };

    let classId: number | null = null;
    if (classIdStr && classIdStr.trim() !== "") {
      classId = parseInt(classIdStr, 10);
      if (isNaN(classId) || classId <= 0) return { success: false, message: "Kelas tidak valid." };
      const schoolClass = await prisma.schoolClass.findUnique({ where: { id: classId } });
      if (!schoolClass) return { success: false, message: "Kelas tidak ditemukan." };
    }

    const nisTrim = (nis || "").trim() || null;
    if (nisTrim) {
      if (!/^[0-9A-Za-z-]{3,20}$/.test(nisTrim)) return { success: false, message: "NIS harus 3-20 karakter alfanumerik." };
      const dupNis = await prisma.student.findFirst({ where: { nis: nisTrim, NOT: { id } } });
      if (dupNis) return { success: false, message: "NIS sudah terdaftar oleh siswa lain." };
    }

    const nisnTrim = (nisn || "").trim() || null;
    if (nisnTrim) {
      if (!/^\d{10}$/.test(nisnTrim)) return { success: false, message: "NISN harus 10 digit angka." };
      const dupNisn = await prisma.student.findFirst({ where: { nisn: nisnTrim, NOT: { id } } });
      if (dupNisn) return { success: false, message: "NISN sudah terdaftar oleh siswa lain." };
    }

    await prisma.student.update({
      where: { id },
      data: {
        name: trimmedName,
        classId,
        nis: nisTrim,
        nisn: nisnTrim,
        gender: gender ? (gender as "LAKI_LAKI" | "PEREMPUAN") : null,
        birthPlace: birthPlaceTrim || null,
        birthDate,
        admissionYear,
        status: status ? (status as "AKTIF" | "LULUS" | "NONAKTIF") : "AKTIF",
        avatarUrl,
      },
    });

    revalidatePath("/admin/siswa");
    return { success: true, message: "Data siswa berhasil diperbarui." };
  } catch (error) {
    console.error("[Update Student Error]:", error);
    return { success: false, message: "Terjadi kesalahan sistem. Silakan coba lagi." };
  }
}
