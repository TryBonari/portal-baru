"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";

const VALID_GRADES = ["X", "XI", "XII"] as const;

function validateClassInput(grade: string, number: number) {
  if (!VALID_GRADES.includes(grade as typeof VALID_GRADES[number])) {
    throw new Error("Tingkat tidak valid. Harus X, XI, atau XII.");
  }
  if (!Number.isInteger(number) || number < 1 || number > 20) {
    throw new Error("Nomor kelas harus angka 1-20.");
  }
}

export async function createSchoolClassAction(formData: FormData) {
  await checkAdminAuth();

  const rawGrade = formData.get("grade");
  const rawNumber = formData.get("number");
  const rawDepartmentId = formData.get("departmentId");
  const rawIsActive = formData.get("isActive");

  if (typeof rawGrade !== "string" || typeof rawNumber !== "string") {
    throw new Error("Input tidak valid.");
  }

  const grade = rawGrade.trim().toUpperCase();
  const number = Number(rawNumber);
  const isActive = rawIsActive === "false" ? false : true;

  validateClassInput(grade, number);

  let departmentId: number | null = null;
  if (rawDepartmentId && typeof rawDepartmentId === "string" && rawDepartmentId.trim() !== "" && rawDepartmentId !== "null") {
    const parsed = Number(rawDepartmentId);
    if (!Number.isInteger(parsed) || parsed <= 0) throw new Error("Jurusan tidak valid.");
    const dept = await prisma.department.findUnique({ where: { id: parsed } });
    if (!dept) throw new Error("Jurusan tidak ditemukan.");
    departmentId = parsed;
  }

  const duplicate = await prisma.schoolClass.findFirst({
    where: { grade, number, departmentId },
  });
  if (duplicate) throw new Error("Kombinasi kelas sudah ada (Tingkat + Nomor + Jurusan duplikat).");

  await prisma.schoolClass.create({ data: { grade, number, departmentId, isActive } });
  revalidatePath("/admin/kelas");
}

export async function updateSchoolClassAction(formData: FormData) {
  await checkAdminAuth();

  const rawId = formData.get("id");
  const rawGrade = formData.get("grade");
  const rawNumber = formData.get("number");
  const rawDepartmentId = formData.get("departmentId");
  const rawIsActive = formData.get("isActive");

  if (typeof rawId !== "string" || typeof rawGrade !== "string" || typeof rawNumber !== "string") {
    throw new Error("Input tidak valid.");
  }

  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) throw new Error("ID tidak valid.");

  const grade = rawGrade.trim().toUpperCase();
  const number = Number(rawNumber);
  const isActive = rawIsActive === "false" ? false : true;

  validateClassInput(grade, number);

  let departmentId: number | null = null;
  if (rawDepartmentId && typeof rawDepartmentId === "string" && rawDepartmentId.trim() !== "" && rawDepartmentId !== "null") {
    const parsed = Number(rawDepartmentId);
    if (!Number.isInteger(parsed) || parsed <= 0) throw new Error("Jurusan tidak valid.");
    const dept = await prisma.department.findUnique({ where: { id: parsed } });
    if (!dept) throw new Error("Jurusan tidak ditemukan.");
    departmentId = parsed;
  }

  const existing = await prisma.schoolClass.findUnique({ where: { id } });
  if (!existing) throw new Error("Kelas tidak ditemukan.");

  const conflict = await prisma.schoolClass.findFirst({
    where: { grade, number, departmentId, id: { not: id } },
  });
  if (conflict) throw new Error("Kombinasi kelas sudah ada (Tingkat + Nomor + Jurusan duplikat).");

  await prisma.schoolClass.update({ where: { id }, data: { grade, number, departmentId, isActive } });
  revalidatePath("/admin/kelas");
}

export async function deleteSchoolClassAction(formData: FormData) {
  await checkAdminAuth();

  const rawId = formData.get("id");
  if (typeof rawId !== "string" || !rawId.trim()) throw new Error("ID tidak valid.");
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) throw new Error("ID tidak valid.");

  const hasStudents = await prisma.student.count({ where: { classId: id } });
  if (hasStudents > 0) throw new Error("Tidak dapat menghapus kelas yang masih memiliki siswa.");

  await prisma.schoolClass.delete({ where: { id } });
  revalidatePath("/admin/kelas");
}

export async function toggleSchoolClassStatusAction(formData: FormData) {
  await checkAdminAuth();

  const rawId = formData.get("id");
  if (typeof rawId !== "string" || !rawId.trim()) throw new Error("ID tidak valid.");
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) throw new Error("ID tidak valid.");

  const current = await prisma.schoolClass.findUnique({ where: { id } });
  if (!current) throw new Error("Kelas tidak ditemukan.");

  await prisma.schoolClass.update({ where: { id }, data: { isActive: !current.isActive } });
  revalidatePath("/admin/kelas");
}
