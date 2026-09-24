"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";
import * as XLSX from "xlsx";

export async function exportGradeExcel(classId: number) {
  await checkAdminAuth();

  const targetClass = await prisma.schoolClass.findUnique({
    where: { id: classId },
    include: { department: true },
  });

  if (!targetClass) throw new Error("Kelas tidak ditemukan");

  const students = await prisma.student.findMany({
    where: { classId },
    orderBy: { name: "asc" },
  });

  // Since grades can be per subject, for general grade export we can export columns for students and default values or empty fields.
  // Let's create an excel format listing students and basic blank grade columns, or if subjects are selected. For now, let's include Name and default grade components.
  const data = students.map((s, idx) => ({
    No: idx + 1,
    NIS: s.nis || "-",
    "Nama Siswa": s.name,
    Tugas: "",
    UTS: "",
    UAS: "",
    Praktik: "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Nilai Siswa");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const classNameParts = [targetClass.grade, targetClass.department?.code, targetClass.number].filter(Boolean);
  const classNameStr = classNameParts.join(" ");

  return {
    base64: buffer.toString("base64"),
    filename: `Nilai_Kelas_${classNameStr.replace(/\s+/g, "_")}.xlsx`,
  };
}

export async function importGradeExcel(
  classId: number,
  subjectId: number | null,
  semesterId: number | null,
  academicYearId: number | null,
  base64Data: string
) {
  await checkAdminAuth();

  if (!subjectId || !semesterId || !academicYearId) {
    throw new Error("Mata pelajaran, semester, dan tahun ajaran harus dipilih untuk import nilai.");
  }

  const buffer = Buffer.from(base64Data, "base64");
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet);

  const studentsInClass = await prisma.student.findMany({
    where: { classId },
  });
  const classStudentMap = new Map(studentsInClass.map((s) => [s.name.trim().toLowerCase(), s]));
  const nisMap = new Map(studentsInClass.filter((s) => s.nis).map((s) => [s.nis!.trim(), s]));

  const notRegistered: string[] = [];
  const validUpdates: {
    studentId: number;
    assignmentScore?: number;
    utsScore?: number;
    uasScore?: number;
    practiceScore?: number;
  }[] = [];

  for (const row of rows) {
    const rawName = row["Nama Siswa"] ? String(row["Nama Siswa"]).trim() : "";
    const rawNis = row["NIS"] ? String(row["NIS"]).trim() : "";
    
    const parseScore = (val: unknown) => {
      if (val === undefined || val === null || val === "" || val === "-") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    };

    const assignmentScore = parseScore(row["Tugas"]);
    const utsScore = parseScore(row["UTS"]);
    const uasScore = parseScore(row["UAS"]);
    const practiceScore = parseScore(row["Praktik"]);

    if (!rawName) continue;

    let matchedStudent = rawNis ? nisMap.get(rawNis) : undefined;
    if (!matchedStudent) {
      matchedStudent = classStudentMap.get(rawName.toLowerCase());
    }

    if (!matchedStudent) {
      notRegistered.push(rawName);
      continue;
    }

    validUpdates.push({
      studentId: matchedStudent.id,
      assignmentScore,
      utsScore,
      uasScore,
      practiceScore,
    });
  }

  for (const item of validUpdates) {
    await prisma.grade.upsert({
      where: {
        studentId_subjectId_academicYearId_semesterId: {
          studentId: item.studentId,
          subjectId,
          academicYearId,
          semesterId,
        },
      },
      update: {
        assignmentScore: item.assignmentScore,
        utsScore: item.utsScore,
        uasScore: item.uasScore,
        practiceScore: item.practiceScore,
      },
      create: {
        studentId: item.studentId,
        subjectId,
        academicYearId,
        semesterId,
        assignmentScore: item.assignmentScore,
        utsScore: item.utsScore,
        uasScore: item.uasScore,
        practiceScore: item.practiceScore,
      },
    });
  }

  revalidatePath("/admin/nilai");

  return {
    success: true,
    message: `Berhasil memperbarui nilai untuk ${validUpdates.length} siswa.`,
    notRegistered,
  };
}
