"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";
import { z } from "zod";

const CreateScheduleSchema = z.object({
  classId: z.coerce.number().int().positive(),
  subjectId: z.coerce.number().int().positive(),
  teacherId: z.coerce.number().int().positive(),
  day: z.string().min(1),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export async function createSchedule(formData: FormData) {
  await requireRole(["ADMIN"]);
  const parsed = CreateScheduleSchema.safeParse({
    classId: formData.get("classId"),
    subjectId: formData.get("subjectId"),
    teacherId: formData.get("teacherId"),
    day: formData.get("day"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { classId, subjectId, teacherId, day, startTime, endTime } = parsed.data;

  await prisma.schedule.create({
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
  await requireRole(["ADMIN"]);
  const validatedId = z.coerce.number().int().positive().safeParse(id);
  if (!validatedId.success) throw new Error("ID tidak valid");
  
  const existing = await prisma.schedule.findUnique({ where: { id: validatedId.data } });
  if (!existing) throw new Error("Jadwal tidak ditemukan");

  await prisma.schedule.delete({
    where: { id: validatedId.data },
  });

  revalidatePath("/admin/jadwal");
}

const CreateSubjectSchema = z.object({
  name: z.string().min(2).max(100),
  code: z.string().min(1).max(10).transform(val => val.toUpperCase()),
});

export async function createSubject(formData: FormData) {
  await requireRole(["ADMIN"]);
  const parsed = CreateSubjectSchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, code } = parsed.data;

  try {
    await prisma.subject.create({
      data: { name, code },
    });
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === 'P2002') {
      return { error: "Mata pelajaran dengan kode tersebut sudah ada." };
    }
    return { error: "Gagal menambahkan mata pelajaran." };
  }

  revalidatePath("/admin/jadwal");
  return { success: true };
}

