"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function getSPPInitialData() {
  await checkAdminAuth();
  
  const departments = await prisma.department.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const classes = await prisma.schoolClass.findMany({
    where: { isActive: true },
    include: {
      department: true,
      sppSetting: true,
    },
    orderBy: [
      { grade: "asc" },
      { number: "asc" },
    ],
  });

  return { departments, classes };
}

export async function saveSPPSetting(
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();

    const classId = parseInt(formData.get("classId") as string, 10);
    const amount = parseFloat(formData.get("amount") as string);

    if (!classId || isNaN(classId)) return { success: false, message: "Kelas tidak valid." };
    if (isNaN(amount) || amount < 0) return { success: false, message: "Nominal SPP tidak valid." };

    await prisma.sPPSetting.upsert({
      where: { classId },
      update: { amount },
      create: { classId, amount },
    });

    revalidatePath("/admin/spp");
    return { success: true, message: "Pengaturan SPP berhasil disimpan." };
  } catch (e) {
    console.error("[saveSPPSetting]", e);
    return { success: false, message: "Gagal menyimpan pengaturan SPP." };
  }
}