"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function bulkUpdateClassAction(
  studentIds: number[],
  targetClassId: number
): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    
    if (studentIds.length === 0) return { success: false, message: "Tidak ada siswa yang dipilih." };
    
    const schoolClass = await prisma.schoolClass.findUnique({ where: { id: targetClassId } });
    if (!schoolClass) return { success: false, message: "Kelas tujuan tidak ditemukan." };

    await prisma.student.updateMany({
      where: { id: { in: studentIds } },
      data: { classId: targetClassId },
    });

    revalidatePath("/admin/kelolasiswa");
    return { success: true, message: `${studentIds.length} siswa berhasil dipindah ke kelas ${schoolClass.grade} ${schoolClass.number}.` };
  } catch (error) {
    console.error("[Bulk Update Class Error]:", error);
    return { success: false, message: "Gagal memperbarui data siswa." };
  }
}