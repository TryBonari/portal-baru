"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function generateAccessCodes(count: number = 10) {
  // Find latest access code starting with A
  const lastCodeRecord = await prisma.studentAccessCode.findFirst({
    orderBy: { code: "desc" },
  });

  let nextNum = 1;
  if (lastCodeRecord && lastCodeRecord.code.startsWith("A")) {
    const numPart = parseInt(lastCodeRecord.code.slice(1), 10);
    if (!isNaN(numPart)) {
      nextNum = numPart + 1;
    }
  }

  const codesToCreate = [];
  for (let i = 0; i < count; i++) {
    const numStr = String(nextNum + i).padStart(4, "0");
    const code = `A${numStr}`;
    codesToCreate.push({ code, status: "UNUSED" as const });
  }

  // Insert many, skip duplicates if any
  for (const item of codesToCreate) {
    try {
      await prisma.studentAccessCode.create({
        data: item,
      });
    } catch {
      // Ignore unique constraint errors if already exists
    }
  }

  revalidatePath("/admin/accescode");
}

function getFormValues(formData: FormData) {
  return {
    name: (formData.get("name") as string) || "",
    nis: (formData.get("nis") as string) || "",
    nisn: (formData.get("nisn") as string) || "",
    gender: (formData.get("gender") as string) || "",
    status: (formData.get("status") as string) || "AKTIF",
    birthPlace: (formData.get("birthPlace") as string) || "",
    birthDate: (formData.get("birthDate") as string) || "",
    admissionYear: (formData.get("admissionYear") as string) || "",
    accessCodeId: (formData.get("accessCodeId") as string) || "",
    classId: (formData.get("classId") as string) || "",
  };
}

export async function createStudentAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string; values?: Record<string, string> }> {
  const values = getFormValues(formData);
  try {
    await checkAdminAuth();
    const name = formData.get("name") as string;
    const accessCodeIdStr = formData.get("accessCodeId") as string;
    const classIdStr = formData.get("classId") as string;
    const nis = formData.get("nis") as string;
    const nisn = formData.get("nisn") as string;
    const gender = formData.get("gender") as "LAKI_LAKI" | "PEREMPUAN" | null;
    const birthPlace = formData.get("birthPlace") as string;
    const birthDateStr = formData.get("birthDate") as string;
    const admissionYearStr = formData.get("admissionYear") as string;
    const status = formData.get("status") as string;
    const avatarFile = formData.get("avatar") as File | null;

    const validStatuses = ["AKTIF", "LULUS", "NONAKTIF"];

    const trimmedName = (name || "").trim();
    if (!trimmedName) return { success: false, message: "Nama wajib diisi.", values };
    if (trimmedName.length < 2 || trimmedName.length > 100) return { success: false, message: "Nama harus 2-100 karakter.", values };

    if (!accessCodeIdStr || !accessCodeIdStr.trim()) return { success: false, message: "Kode akses wajib dipilih.", values };

    if (status && !validStatuses.includes(status)) return { success: false, message: "Status tidak valid.", values };

    let admissionYear: number | null = null;
    if (admissionYearStr && admissionYearStr.trim() !== "") {
      admissionYear = parseInt(admissionYearStr, 10);
      const currentYear = new Date().getFullYear();
      if (isNaN(admissionYear) || admissionYear < 2000 || admissionYear > currentYear + 5) return { success: false, message: "Tahun masuk tidak valid.", values };
    }

    let avatarUrl: string | null = null;
    if (avatarFile && avatarFile instanceof File && avatarFile.size > 0 && avatarFile.name) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(avatarFile.type)) return { success: false, message: "Format file tidak didukung. Harap gunakan JPG, PNG, atau WebP.", values };
      if (avatarFile.size > 2 * 1024 * 1024) return { success: false, message: "Ukuran file terlalu besar. Maksimal 2MB.", values };
      
      try {
        const bytes = await avatarFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const header = buffer.toString("hex", 0, 4);
        const isJpeg = header === "ffd8ffe0" || header === "ffd8ffe1" || header === "ffd8ffdb";
        const isPng = header === "89504e47";
        const isWebp = header.startsWith("52494646") && buffer.toString("hex", 8, 12) === "57454250";
        if (!isJpeg && !isPng && !isWebp) return { success: false, message: "File tidak valid atau rusak.", values };
        avatarUrl = `data:${avatarFile.type};base64,${buffer.toString("base64")}`;
      } catch (err) {
        console.error("[Student Avatar Upload Error]:", err);
        return { success: false, message: "Penyimpanan gagal. Silakan coba lagi.", values };
      }
    }

    const validGenders = ["LAKI_LAKI", "PEREMPUAN"];
    if (gender && !validGenders.includes(gender)) return { success: false, message: "Jenis kelamin tidak valid.", values };

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
        if (mo < 1 || mo > 12 || d < 1 || d > 31) return { success: false, message: "Tanggal lahir tidak valid. Gunakan format DD/MM/YYYY.", values };
        birthDate = new Date(y, mo - 1, d);
        if (birthDate.getFullYear() !== y || birthDate.getMonth() !== mo - 1 || birthDate.getDate() !== d) return { success: false, message: "Tanggal lahir tidak valid.", values };
      } else if (yyyymmdd) {
        const y = parseInt(yyyymmdd[1], 10);
        const mo = parseInt(yyyymmdd[2], 10);
        const d = parseInt(yyyymmdd[3], 10);
        birthDate = new Date(y, mo - 1, d);
        if (isNaN(birthDate.getTime()) || birthDate.getFullYear() !== y || birthDate.getMonth() !== mo - 1 || birthDate.getDate() !== d) return { success: false, message: "Tanggal lahir tidak valid.", values };
      } else {
        return { success: false, message: "Format tanggal lahir harus DD/MM/YYYY.", values };
      }
      if (birthDate > new Date()) return { success: false, message: "Tanggal lahir tidak boleh di masa depan.", values };
      if (birthDate.getFullYear() < 1900) return { success: false, message: "Tanggal lahir tidak valid.", values };
    }

    const birthPlaceTrim = (birthPlace || "").trim();
    if (birthPlaceTrim && birthPlaceTrim.length > 100) return { success: false, message: "Tempat lahir maksimal 100 karakter.", values };

    let classId: number | null = null;
    if (classIdStr && classIdStr.trim() !== "") {
      classId = parseInt(classIdStr, 10);
      if (isNaN(classId) || classId <= 0) return { success: false, message: "Kelas tidak valid.", values };
      const schoolClass = await prisma.schoolClass.findUnique({ where: { id: classId } });
      if (!schoolClass) return { success: false, message: "Kelas tidak ditemukan.", values };
    }

    const nisTrim = (nis || "").trim() || null;
    if (nisTrim) {
      if (!/^[0-9A-Za-z-]{3,20}$/.test(nisTrim)) return { success: false, message: "NIS harus 3-20 karakter alfanumerik.", values };
      const dupNis = await prisma.student.findFirst({ where: { nis: nisTrim } });
      if (dupNis) return { success: false, message: "NIS sudah terdaftar.", values };
    }

    const nisnTrim = (nisn || "").trim() || null;
    if (nisnTrim) {
      if (!/^\d{10}$/.test(nisnTrim)) return { success: false, message: "NISN harus 10 digit angka.", values };
      const dupNisn = await prisma.student.findFirst({ where: { nisn: nisnTrim } });
      if (dupNisn) return { success: false, message: "NISN sudah terdaftar.", values };
    }

    const accessCodeId = parseInt(accessCodeIdStr, 10);
    if (isNaN(accessCodeId) || accessCodeId <= 0) return { success: false, message: "Kode akses tidak valid.", values };
    const accessCodeRecord = await prisma.studentAccessCode.findUnique({ where: { id: accessCodeId } });
    if (!accessCodeRecord || accessCodeRecord.status === "USED") return { success: false, message: "Kode akses tidak valid.", values };

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { accessCode: accessCodeRecord.code, passwordHash: "$2a$12$PLACEHOLDER", role: "STUDENT" },
      });

      await tx.student.create({
        data: {
          name: trimmedName,
          userId: user.id,
          accessCode: accessCodeRecord.code,
          passwordHash: "",
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

      await tx.studentAccessCode.update({
        where: { id: accessCodeId },
        data: { status: "USED", usedAt: new Date() },
      });
    });

    revalidatePath("/admin/siswa");
    revalidatePath("/admin/accescode");
    return { success: true, message: "Siswa berhasil didaftarkan." };
  } catch (error) {
    console.error("[Create Student Error]:", error);
    return { success: false, message: "Terjadi kesalahan sistem. Silakan coba lagi.", values };
  }
}


export async function deleteStudentAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const idStr = formData.get("id") as string;
    const id = parseInt(idStr, 10);
    if (!id || isNaN(id)) return { success: false, message: "ID siswa tidak valid." };
    const student = await prisma.student.findUnique({ where: { id }, include: { user: true } });
    if (!student) return { success: false, message: "Data siswa tidak ditemukan." };
    await prisma.$transaction(async (tx) => {
      await tx.student.delete({ where: { id } });
      await tx.user.delete({ where: { id: student.userId } });
    });
    revalidatePath("/admin/siswa");
    return { success: true, message: "Siswa berhasil dihapus." };
  } catch (e) {
    console.error("[deleteStudentAction]", e);
    return { success: false, message: "Gagal menghapus data siswa. Silakan coba lagi." };
  }
}

export async function deleteAccessCode(id: number): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const codeRecord = await prisma.studentAccessCode.findUnique({ where: { id } });
    if (!codeRecord || codeRecord.status === "USED") return { success: false, message: "Kode akses tidak dapat dihapus karena sudah digunakan." };
    await prisma.studentAccessCode.delete({ where: { id } });
    revalidatePath("/admin/accescode");
    return { success: true, message: "Kode akses berhasil dihapus." };
  } catch (e) {
    console.error("[deleteAccessCode]", e);
    return { success: false, message: "Gagal menghapus kode akses. Silakan coba lagi." };
  }
}
