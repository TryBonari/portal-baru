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

export async function createDepartmentAction(formData: FormData) {
  await checkAdminAuth();
  
  const rawCode = formData.get("code");
  const rawName = formData.get("name");
  const rawIsActive = formData.get("isActive");

  if (typeof rawCode !== "string" || typeof rawName !== "string") {
    throw new Error("Input tidak valid.");
  }

  const code = rawCode.trim().toUpperCase();
  const name = rawName.trim();
  const isActive = rawIsActive === "false" ? false : true;

  validateDepartmentInput(code, name);

  const existing = await prisma.department.findUnique({ where: { code } });
  if (existing) throw new Error("Kode jurusan sudah digunakan.");

  await prisma.department.create({ data: { code, name, isActive } });
  revalidatePath("/admin/kelas");
}

export async function updateDepartmentAction(formData: FormData) {
  await checkAdminAuth();

  const rawId = formData.get("id");
  const rawCode = formData.get("code");
  const rawName = formData.get("name");
  const rawIsActive = formData.get("isActive");

  if (typeof rawId !== "string" || typeof rawCode !== "string" || typeof rawName !== "string") {
    throw new Error("Input tidak valid.");
  }

  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) throw new Error("ID tidak valid.");

  const code = rawCode.trim().toUpperCase();
  const name = rawName.trim();
  const isActive = rawIsActive === "false" ? false : true;

  validateDepartmentInput(code, name);

  const conflict = await prisma.department.findUnique({ where: { code } });
  if (conflict && conflict.id !== id) throw new Error("Kode jurusan sudah digunakan.");

  await prisma.department.update({ where: { id }, data: { code, name, isActive } });
  revalidatePath("/admin/kelas");
}

export async function deleteDepartmentAction(formData: FormData) {
  await checkAdminAuth();

  const rawId = formData.get("id");
  if (typeof rawId !== "string" || !rawId.trim()) throw new Error("ID tidak valid.");
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) throw new Error("ID tidak valid.");

  const countClass = await prisma.schoolClass.count({ where: { departmentId: id } });
  if (countClass > 0) throw new Error("Tidak dapat menghapus jurusan yang masih memiliki kelas.");

  await prisma.department.delete({ where: { id } });
  revalidatePath("/admin/kelas");
}

export async function toggleDepartmentStatusAction(formData: FormData) {
  await checkAdminAuth();

  const rawId = formData.get("id");
  if (typeof rawId !== "string" || !rawId.trim()) throw new Error("ID tidak valid.");
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) throw new Error("ID tidak valid.");

  const current = await prisma.department.findUnique({ where: { id } });
  if (!current) throw new Error("Jurusan tidak ditemukan.");

  await prisma.department.update({ where: { id }, data: { isActive: !current.isActive } });
  revalidatePath("/admin/kelas");
}
