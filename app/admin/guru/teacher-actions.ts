"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole, AuthResult } from "@/lib/auth-guard";
import { z } from "zod";

const TeacherSchema = z.object({
  name: z.string().min(2).max(100),
  teacherCode: z.string().min(1).max(20).optional().or(z.literal("")),
  subjects: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export async function createTeacherAction(
  prevState: AuthResult<{ message: string }>,
  formData: FormData
): Promise<AuthResult<{ message: string }>> {
  try {
    await requireRole(["ADMIN"]);
    
    const raw = {
      name: formData.get("name"),
      teacherCode: formData.get("teacherCode"),
      subjects: formData.get("subjects"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      isActive: formData.get("isActive") !== "false",
    };

    const parsed = TeacherSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { name, teacherCode, subjects, phone, email, isActive } = parsed.data;

    if (teacherCode) {
      const existing = await prisma.teacher.findUnique({ where: { teacherCode } });
      if (existing) return { success: false, error: "Kode/NIP guru sudah digunakan." };
    }

    await prisma.teacher.create({
      data: {
        name,
        teacherCode: teacherCode || null,
        subjects: subjects || null,
        phone: phone || null,
        email: email || null,
        isActive,
      },
    });

    revalidatePath("/admin/guru");
    return { success: true, data: { message: "Data guru berhasil ditambahkan." } };
  } catch (e: unknown) {
    console.error("[createTeacherAction]", e);
    return { success: false, error: "Gagal menambahkan data guru. Silakan coba lagi." };
  }
}

export async function updateTeacherAction(
  prevState: AuthResult<{ message: string }>,
  formData: FormData
): Promise<AuthResult<{ message: string }>> {
  try {
    await requireRole(["ADMIN"]);
    
    const id = Number(formData.get("id"));
    if (!id || id <= 0) return { success: false, error: "ID guru tidak valid." };

    const raw = {
      name: formData.get("name"),
      teacherCode: formData.get("teacherCode"),
      subjects: formData.get("subjects"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      isActive: formData.get("isActive") !== "false",
    };

    const parsed = TeacherSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { name, teacherCode, subjects, phone, email, isActive } = parsed.data;

    const existing = await prisma.teacher.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Data guru tidak ditemukan." };

    if (teacherCode && teacherCode !== existing.teacherCode) {
      const conflict = await prisma.teacher.findUnique({ where: { teacherCode } });
      if (conflict) return { success: false, error: "Kode/NIP guru sudah digunakan." };
    }

    await prisma.teacher.update({
      where: { id },
      data: {
        name,
        teacherCode: teacherCode || null,
        subjects: subjects || null,
        phone: phone || null,
        email: email || null,
        isActive,
      },
    });

    revalidatePath("/admin/guru");
    return { success: true, data: { message: "Data guru berhasil diperbarui." } };
  } catch (e: unknown) {
    console.error("[updateTeacherAction]", e);
    return { success: false, error: "Gagal memperbarui data guru. Silakan coba lagi." };
  }
}

export async function deleteTeacherAction(
  prevState: AuthResult<{ message: string }>,
  formData: FormData
): Promise<AuthResult<{ message: string }>> {
  try {
    await requireRole(["ADMIN"]);
    
    const id = Number(formData.get("id"));
    if (!id || id <= 0) return { success: false, error: "ID guru tidak valid." };

    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) return { success: false, error: "Data guru tidak ditemukan." };

    await prisma.teacher.delete({ where: { id } });
    revalidatePath("/admin/guru");
    return { success: true, data: { message: "Data guru berhasil dihapus." } };
  } catch (e: unknown) {
    console.error("[deleteTeacherAction]", e);
    return { success: false, error: "Gagal menghapus guru. Silakan coba lagi." };
  }
}

export async function markComplaintsAsReadAction(teacherId: number): Promise<AuthResult<void>> {
  try {
    await requireRole(["ADMIN"]);
    
    if (!Number.isInteger(teacherId) || teacherId <= 0) return { success: false, error: "ID tidak valid." };

    await prisma.teacherComplaint.updateMany({
      where: { teacherId },
      data: { isRead: true },
    });

    revalidatePath("/admin/guru");
    return { success: true, data: undefined };
  } catch (e: unknown) {
    console.error("[markComplaintsAsReadAction]", e);
    return { success: false, error: "Gagal memperbarui status pengaduan." };
  }
}

export async function toggleTeacherStatusAction(
  prevState: AuthResult<{ message: string }>,
  formData: FormData
): Promise<AuthResult<{ message: string }>> {
  try {
    await requireRole(["ADMIN"]);
    
    const id = Number(formData.get("id"));
    if (!id || id <= 0) return { success: false, error: "ID tidak valid." };

    const current = await prisma.teacher.findUnique({ where: { id } });
    if (!current) return { success: false, error: "Data guru tidak ditemukan." };

    await prisma.teacher.update({
      where: { id },
      data: { isActive: !current.isActive },
    });

    revalidatePath("/admin/guru");
    return { success: true, data: { message: "Status guru berhasil diperbarui." } };
  } catch (e: unknown) {
    console.error("[toggleTeacherStatusAction]", e);
    return { success: false, error: "Gagal memperbarui status. Silakan coba lagi." };
  }
}
