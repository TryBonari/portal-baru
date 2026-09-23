"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSchedule(formData: FormData) {
  const classId = parseInt(formData.get("classId") as string);
  const subjectId = parseInt(formData.get("subjectId") as string);
  const teacherId = parseInt(formData.get("teacherId") as string);
  const day = formData.get("day") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;

  await (prisma as any).schedule.create({
    data: {
      classId,
      subjectId,
      teacherId,
      day,
      startTime,
      endTime,
    },
  });

  revalidatePath("/admin/jadwal");
}

export async function deleteSchedule(id: number) {
  await (prisma as any).schedule.delete({
    where: { id },
  });

  revalidatePath("/admin/jadwal");
}

export async function createSubject(formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;

  try {
    await (prisma as any).subject.create({
      data: { name, code },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "Mata pelajaran dengan kode tersebut sudah ada." };
    }
    return { error: "Gagal menambahkan mata pelajaran." };
  }

  revalidatePath("/admin/jadwal");
  return { success: true };
}

