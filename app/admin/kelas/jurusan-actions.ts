"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";

function validateDepartmentInput(code: string, name: string) {
  if (!code) throw new Error("Kode jurusan wajib diisi.");
  if (code.length > 10) throw new Error("Kode maksimal 10 karakter.");
  if (!name) throw new Error("Nama jurusan wajib diisi.");
  if (name.length > 100) throw new Error("Nama maksimal 100 karakter.");
}

function isSafeError(msg: string) {
  return msg.startsWith("Kode") || msg.startsWith("Nama") || msg.startsWith("ID") || msg.startsWith("Input") || msg.startsWith("Jurusan") || msg.startsWith("Tidak dapat");
}

export async function createDepartmentAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const rawCode = formData.get("code");
    const rawName = formData.get("name");
    const rawIsActive = formData.get("isActive");
    if (typeof rawCode !== "string" || typeof rawName !== "string") return { success: false, message: "Input tidak valid." };
    const code = rawCode.trim().toUpperCase();
    const name = rawName.trim();
    const isActive = rawIsActive === "false" ? false : true;
    validateDepartmentInput(code, name);
    const existing = await prisma.department.findUnique({ where: { code } });
    if (existing) return { success: false, message: "Kode jurusan sudah digunakan." };
    await prisma.department.create({ data: { code, name, isActive } });
    revalidatePath("/admin/kelas");
    return { success: true, message: "Jurusan berhasil dibuat." };
  } catch (e) {
    console.error("[createDepartmentAction]", e);
    const m = e instanceof Error ? e.message : "";
    if (isSafeError(m)) return { success: false, message: m };
    return { success: false, message: "Data jurusan gagal disimpan. Silakan coba lagi." };
  }
}

export async function updateDepartmentAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const rawId = formData.get("id");
    const rawCode = formData.get("code");
    const rawName = formData.get("name");
    const rawIsActive = formData.get("isActive");
    if (typeof rawId !== "string" || typeof rawCode !== "string" || typeof rawName !== "string") return { success: false, message: "Input tidak valid." };
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) return { success: false, message: "ID tidak valid." };
    const code = rawCode.trim().toUpperCase();
    const name = rawName.trim();
    const isActive = rawIsActive === "false" ? false : true;
    validateDepartmentInput(code, name);
    const conflict = await prisma.department.findUnique({ where: { code } });
    if (conflict && conflict.id !== id) return { success: false, message: "Kode jurusan sudah digunakan." };
    await prisma.department.update({ where: { id }, data: { code, name, isActive } });
    revalidatePath("/admin/kelas");
    return { success: true, message: "Jurusan berhasil diperbarui." };
  } catch (e) {
    console.error("[updateDepartmentAction]", e);
    const m = e instanceof Error ? e.message : "";
    if (isSafeError(m)) return { success: false, message: m };
    return { success: false, message: "Data jurusan gagal diperbarui. Silakan coba lagi." };
  }
}

export async function deleteDepartmentAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const rawId = formData.get("id");
    if (typeof rawId !== "string" || !rawId.trim()) return { success: false, message: "ID tidak valid." };
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) return { success: false, message: "ID tidak valid." };
    const countClass = await prisma.schoolClass.count({ where: { departmentId: id } });
    if (countClass > 0) return { success: false, message: "Tidak dapat menghapus jurusan yang masih memiliki kelas." };
    await prisma.department.delete({ where: { id } });
    revalidatePath("/admin/kelas");
    return { success: true, message: "Jurusan berhasil dihapus." };
  } catch (e) {
    console.error("[deleteDepartmentAction]", e);
    const m = e instanceof Error ? e.message : "";
    if (isSafeError(m)) return { success: false, message: m };
    return { success: false, message: "Gagal menghapus jurusan. Silakan coba lagi." };
  }
}

export async function toggleDepartmentStatusAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const rawId = formData.get("id");
    if (typeof rawId !== "string" || !rawId.trim()) return { success: false, message: "ID tidak valid." };
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) return { success: false, message: "ID tidak valid." };
    const current = await prisma.department.findUnique({ where: { id } });
    if (!current) return { success: false, message: "Jurusan tidak ditemukan." };
    await prisma.department.update({ where: { id }, data: { isActive: !current.isActive } });
    revalidatePath("/admin/kelas");
    return { success: true, message: "Status jurusan diperbarui." };
  } catch (e) {
    console.error("[toggleDepartmentStatusAction]", e);
    const m = e instanceof Error ? e.message : "";
    if (isSafeError(m)) return { success: false, message: m };
    return { success: false, message: "Gagal memperbarui status. Silakan coba lagi." };
  }
}
