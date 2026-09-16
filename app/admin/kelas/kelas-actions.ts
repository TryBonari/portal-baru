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

function isSafeError(msg: string) {
  return msg.startsWith("Tingkat") || msg.startsWith("Nomor") || msg.startsWith("Jurusan") || msg.startsWith("Kombinasi") || msg.startsWith("Input") || msg.startsWith("ID") || msg.startsWith("Kelas") || msg.startsWith("Tidak dapat");
}

export async function createSchoolClassAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const rawGrade = formData.get("grade");
    const rawNumber = formData.get("number");
    const rawDepartmentId = formData.get("departmentId");
    const rawIsActive = formData.get("isActive");
    if (typeof rawGrade !== "string" || typeof rawNumber !== "string") return { success: false, message: "Input tidak valid." };
    const grade = rawGrade.trim().toUpperCase();
    const number = Number(rawNumber);
    const isActive = rawIsActive === "false" ? false : true;
    validateClassInput(grade, number);
    let departmentId: number | null = null;
    if (rawDepartmentId && typeof rawDepartmentId === "string" && rawDepartmentId.trim() !== "" && rawDepartmentId !== "null") {
      const parsed = Number(rawDepartmentId);
      if (!Number.isInteger(parsed) || parsed <= 0) return { success: false, message: "Jurusan tidak valid." };
      const dept = await prisma.department.findUnique({ where: { id: parsed } });
      if (!dept) return { success: false, message: "Jurusan tidak ditemukan." };
      departmentId = parsed;
    }
    const duplicate = await prisma.schoolClass.findFirst({ where: { grade, number, departmentId } });
    if (duplicate) return { success: false, message: "Kombinasi kelas sudah ada (Tingkat + Nomor + Jurusan duplikat)." };
    await prisma.schoolClass.create({ data: { grade, number, departmentId, isActive } });
    revalidatePath("/admin/kelas");
    return { success: true, message: "Kelas berhasil dibuat." };
  } catch (e) {
    console.error("[createSchoolClassAction]", e);
    const m = e instanceof Error ? e.message : "";
    if (isSafeError(m)) return { success: false, message: m };
    return { success: false, message: "Data kelas gagal disimpan. Silakan coba lagi." };
  }
}

export async function updateSchoolClassAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const rawId = formData.get("id");
    const rawGrade = formData.get("grade");
    const rawNumber = formData.get("number");
    const rawDepartmentId = formData.get("departmentId");
    const rawIsActive = formData.get("isActive");
    if (typeof rawId !== "string" || typeof rawGrade !== "string" || typeof rawNumber !== "string") return { success: false, message: "Input tidak valid." };
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) return { success: false, message: "ID tidak valid." };
    const grade = rawGrade.trim().toUpperCase();
    const number = Number(rawNumber);
    const isActive = rawIsActive === "false" ? false : true;
    validateClassInput(grade, number);
    let departmentId: number | null = null;
    if (rawDepartmentId && typeof rawDepartmentId === "string" && rawDepartmentId.trim() !== "" && rawDepartmentId !== "null") {
      const parsed = Number(rawDepartmentId);
      if (!Number.isInteger(parsed) || parsed <= 0) return { success: false, message: "Jurusan tidak valid." };
      const dept = await prisma.department.findUnique({ where: { id: parsed } });
      if (!dept) return { success: false, message: "Jurusan tidak ditemukan." };
      departmentId = parsed;
    }
    const existing = await prisma.schoolClass.findUnique({ where: { id } });
    if (!existing) return { success: false, message: "Kelas tidak ditemukan." };
    const conflict = await prisma.schoolClass.findFirst({ where: { grade, number, departmentId, id: { not: id } } });
    if (conflict) return { success: false, message: "Kombinasi kelas sudah ada (Tingkat + Nomor + Jurusan duplikat)." };
    await prisma.schoolClass.update({ where: { id }, data: { grade, number, departmentId, isActive } });
    revalidatePath("/admin/kelas");
    return { success: true, message: "Kelas berhasil diperbarui." };
  } catch (e) {
    console.error("[updateSchoolClassAction]", e);
    const m = e instanceof Error ? e.message : "";
    if (isSafeError(m)) return { success: false, message: m };
    return { success: false, message: "Data kelas gagal diperbarui. Silakan coba lagi." };
  }
}

export async function deleteSchoolClassAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const rawId = formData.get("id");
    if (typeof rawId !== "string" || !rawId.trim()) return { success: false, message: "ID tidak valid." };
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) return { success: false, message: "ID tidak valid." };
    const hasStudents = await prisma.student.count({ where: { classId: id } });
    if (hasStudents > 0) return { success: false, message: "Tidak dapat menghapus kelas yang masih memiliki siswa." };
    await prisma.schoolClass.delete({ where: { id } });
    revalidatePath("/admin/kelas");
    return { success: true, message: "Kelas berhasil dihapus." };
  } catch (e) {
    console.error("[deleteSchoolClassAction]", e);
    const m = e instanceof Error ? e.message : "";
    if (isSafeError(m)) return { success: false, message: m };
    return { success: false, message: "Gagal menghapus kelas. Silakan coba lagi." };
  }
}

export async function toggleSchoolClassStatusAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const rawId = formData.get("id");
    if (typeof rawId !== "string" || !rawId.trim()) return { success: false, message: "ID tidak valid." };
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) return { success: false, message: "ID tidak valid." };
    const current = await prisma.schoolClass.findUnique({ where: { id } });
    if (!current) return { success: false, message: "Kelas tidak ditemukan." };
    await prisma.schoolClass.update({ where: { id }, data: { isActive: !current.isActive } });
    revalidatePath("/admin/kelas");
    return { success: true, message: "Status kelas berhasil diperbarui." };
  } catch (e) {
    console.error("[toggleSchoolClassStatusAction]", e);
    const m = e instanceof Error ? e.message : "";
    if (isSafeError(m)) return { success: false, message: m };
    return { success: false, message: "Gagal memperbarui status. Silakan coba lagi." };
  }
}
