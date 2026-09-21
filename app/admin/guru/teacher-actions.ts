"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";

function isSafeError(msg: string) {
  return msg.startsWith("Nama") || msg.startsWith("Kode") || msg.startsWith("Mata pelajaran") || msg.startsWith("ID") || msg.startsWith("Guru") || msg.startsWith("Tidak dapat");
}

export async function createTeacherAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const rawName = formData.get("name");
    const rawTeacherCode = formData.get("teacherCode");
    const rawSubjects = formData.get("subjects");
    const rawPhone = formData.get("phone");
    const rawEmail = formData.get("email");
    const rawIsActive = formData.get("isActive");

    if (typeof rawName !== "string" || !rawName.trim()) {
      return { success: false, message: "Nama guru wajib diisi." };
    }

    const name = rawName.trim();
    const teacherCode = typeof rawTeacherCode === "string" && rawTeacherCode.trim() ? rawTeacherCode.trim().toUpperCase() : null;
    const subjects = typeof rawSubjects === "string" && rawSubjects.trim() ? rawSubjects.trim() : null;
    const phone = typeof rawPhone === "string" && rawPhone.trim() ? rawPhone.trim() : null;
    const email = typeof rawEmail === "string" && rawEmail.trim() ? rawEmail.trim() : null;
    const isActive = rawIsActive === "false" ? false : true;

    if (name.length < 2 || name.length > 100) {
      return { success: false, message: "Nama harus 2-100 karakter." };
    }

    if (teacherCode) {
      const existing = await prisma.teacher.findUnique({ where: { teacherCode } });
      if (existing) {
        return { success: false, message: "Kode/NIP guru sudah digunakan." };
      }
    }

    await prisma.teacher.create({
      data: {
        name,
        teacherCode,
        subjects,
        phone,
        email,
        isActive,
      },
    });

    revalidatePath("/admin/guru");
    return { success: true, message: "Data guru berhasil ditambahkan." };
  } catch (e) {
    console.error("[createTeacherAction]", e);
    const m = e instanceof Error ? e.message : "";
    if (isSafeError(m)) return { success: false, message: m };
    return { success: false, message: "Gagal menambahkan data guru. Silakan coba lagi." };
  }
}

export async function updateTeacherAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const rawId = formData.get("id");
    const rawName = formData.get("name");
    const rawTeacherCode = formData.get("teacherCode");
    const rawSubjects = formData.get("subjects");
    const rawPhone = formData.get("phone");
    const rawEmail = formData.get("email");
    const rawIsActive = formData.get("isActive");

    if (typeof rawId !== "string" || !rawId.trim()) return { success: false, message: "ID guru tidak valid." };
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) return { success: false, message: "ID guru tidak valid." };

    if (typeof rawName !== "string" || !rawName.trim()) {
      return { success: false, message: "Nama guru wajib diisi." };
    }

    const name = rawName.trim();
    const teacherCode = typeof rawTeacherCode === "string" && rawTeacherCode.trim() ? rawTeacherCode.trim().toUpperCase() : null;
    const subjects = typeof rawSubjects === "string" && rawSubjects.trim() ? rawSubjects.trim() : null;
    const phone = typeof rawPhone === "string" && rawPhone.trim() ? rawPhone.trim() : null;
    const email = typeof rawEmail === "string" && rawEmail.trim() ? rawEmail.trim() : null;
    const isActive = rawIsActive === "false" ? false : true;

    if (name.length < 2 || name.length > 100) {
      return { success: false, message: "Nama harus 2-100 karakter." };
    }

    const existing = await prisma.teacher.findUnique({ where: { id } });
    if (!existing) return { success: false, message: "Data guru tidak ditemukan." };

    if (teacherCode) {
      const conflict = await prisma.teacher.findUnique({ where: { teacherCode } });
      if (conflict && conflict.id !== id) {
        return { success: false, message: "Kode/NIP guru sudah digunakan." };
      }
    }

    await prisma.teacher.update({
      where: { id },
      data: {
        name,
        teacherCode,
        subjects,
        phone,
        email,
        isActive,
      },
    });

    revalidatePath("/admin/guru");
    return { success: true, message: "Data guru berhasil diperbarui." };
  } catch (e) {
    console.error("[updateTeacherAction]", e);
    const m = e instanceof Error ? e.message : "";
    if (isSafeError(m)) return { success: false, message: m };
    return { success: false, message: "Gagal memperbarui data guru. Silakan coba lagi." };
  }
}

export async function deleteTeacherAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const rawId = formData.get("id");
    if (typeof rawId !== "string" || !rawId.trim()) return { success: false, message: "ID tidak valid." };
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) return { success: false, message: "ID tidak valid." };

    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) return { success: false, message: "Data guru tidak ditemukan." };

    await prisma.teacher.delete({ where: { id } });
    revalidatePath("/admin/guru");
    return { success: true, message: "Data guru berhasil dihapus." };
  } catch (e) {
    console.error("[deleteTeacherAction]", e);
    const m = e instanceof Error ? e.message : "";
    if (isSafeError(m)) return { success: false, message: m };
    return { success: false, message: "Gagal menghapus guru. Silakan coba lagi." };
  }
}

export async function markComplaintsAsReadAction(teacherId: number): Promise<{ success: boolean }> {
  try {
    await checkAdminAuth();
    if (!Number.isInteger(teacherId) || teacherId <= 0) return { success: false };

    await prisma.teacherComplaint.updateMany({
      where: { teacherId },
      data: { isRead: true },
    });

    revalidatePath("/admin/guru");
    return { success: true };
  } catch (e) {
    console.error("[markComplaintsAsReadAction]", e);
    return { success: false };
  }
}

export async function toggleTeacherStatusAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const rawId = formData.get("id");
    if (typeof rawId !== "string" || !rawId.trim()) return { success: false, message: "ID tidak valid." };
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) return { success: false, message: "ID tidak valid." };

    const current = await prisma.teacher.findUnique({ where: { id } });
    if (!current) return { success: false, message: "Data guru tidak ditemukan." };

    await prisma.teacher.update({
      where: { id },
      data: { isActive: !current.isActive },
    });

    revalidatePath("/admin/guru");
    return { success: true, message: "Status guru berhasil diperbarui." };
  } catch (e) {
    console.error("[toggleTeacherStatusAction]", e);
    const m = e instanceof Error ? e.message : "";
    if (isSafeError(m)) return { success: false, message: m };
    return { success: false, message: "Gagal memperbarui status. Silakan coba lagi." };
  }
}
