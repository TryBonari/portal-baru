"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function generateAccessCodes(count: number = 10) {
  // Find latest access code starting with A
  const lastCodeRecord = await prisma.studentAccessCode.findFirst({
    orderBy: { code: "desc" },
  });

  let nextNum = 1;
  if (lastCodeRecord && lastCodeRecord.code.startsWith("A")) {
    const numPart = parseInt(lastCodeRecord.code.slice(1), 10);
    if (!isNaN(numPart)) {
      nextNum = numPart + 1;
    }
  }

  const codesToCreate = [];
  for (let i = 0; i < count; i++) {
    const numStr = String(nextNum + i).padStart(4, "0");
    const code = `A${numStr}`;
    codesToCreate.push({ code, status: "UNUSED" as const });
  }

  // Insert many, skip duplicates if any
  for (const item of codesToCreate) {
    try {
      await prisma.studentAccessCode.create({
        data: item,
      });
    } catch {
      // Ignore unique constraint errors if already exists
    }
  }

  revalidatePath("/admin/accescode");
}

export async function createStudentAction(formData: FormData) {
  const name = formData.get("name") as string;
  const accessCodeIdStr = formData.get("accessCodeId") as string;

  if (!name || !accessCodeIdStr) {
    throw new Error("Semua field wajib diisi");
  }

  const accessCodeId = parseInt(accessCodeIdStr, 10);
  const accessCodeRecord = await prisma.studentAccessCode.findUnique({
    where: { id: accessCodeId },
  });

  if (!accessCodeRecord || accessCodeRecord.status === "USED") {
    throw new Error("Kode akses tidak valid atau sudah digunakan");
  }

  // Create empty hash, to be filled by student later
  const passwordHash = "$2a$12$PLACEHOLDER_FOR_STUDENT_ACTIVATION";

  // Transaction to create User, Student, and update AccessCode
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        accessCode: accessCodeRecord.code,
        passwordHash,
        role: "STUDENT",
      },
    });

    await tx.student.create({
      data: {
        name,
        userId: user.id,
        accessCode: accessCodeRecord.code,
        passwordHash: "", // Placeholder for student activation
      },
    });

    await tx.studentAccessCode.update({
      where: { id: accessCodeId },
      data: {
        status: "USED",
        usedAt: new Date(),
      },
    });
  });

  revalidatePath("/admin/siswa");
  revalidatePath("/admin/accescode");
}

export async function deleteAccessCode(id: number) {
  const codeRecord = await prisma.studentAccessCode.findUnique({
    where: { id },
  });
  if (!codeRecord || codeRecord.status === "USED") {
    throw new Error("Kode akses tidak dapat dihapus karena sudah digunakan");
  }

  await prisma.studentAccessCode.delete({
    where: { id },
  });

  revalidatePath("/admin/accescode");
  return { success: true };
}
