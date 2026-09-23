"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";
import * as XLSX from "xlsx";

export async function exportAttendanceExcel(classId: number, dateStr: string) {
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

  const [eyy, emm, edd] = dateStr.split("-").map(Number);
  const dateObj = new Date(eyy, emm - 1, edd, 12, 0, 0, 0);

  const attendances = await (prisma as any).attendance.findMany({
    where: {
      date: dateObj,
      studentId: { in: students.map((s) => s.id) },
    },
  });

  const attMap = new Map(attendances.map((a: any) => [a.studentId, a.status]));

  const data = students.map((s, idx) => ({
    No: idx + 1,
    NIS: s.nis || "-",
    "Nama Siswa": s.name,
    Status: attMap.get(s.id) || "",
    Catatan: "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Absensi");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const classNameParts = [targetClass.grade, targetClass.department?.code, targetClass.number].filter(Boolean);
  const classNameStr = classNameParts.join(" ");

  return {
    base64: buffer.toString("base64"),
    filename: `absensi ${classNameStr}.xlsx`,
  };
}

export async function importAttendanceExcel(
  classId: number,
  dateStr: string,
  base64Data: string
) {
  await checkAdminAuth();

  const buffer = Buffer.from(base64Data, "base64");
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

  const [iyy, imm, idd] = dateStr.split("-").map(Number);
  const dateObj = new Date(iyy, imm - 1, idd, 12, 0, 0, 0);

  const studentsInClass = await prisma.student.findMany({
    where: { classId },
  });
  const classStudentMap = new Map(studentsInClass.map((s) => [s.name.trim().toLowerCase(), s]));
  const nisMap = new Map(studentsInClass.filter((s) => s.nis).map((s) => [s.nis!.trim(), s]));

  const notInClass: string[] = [];
  const validUpdates: { studentId: number; status: string; note?: string }[] = [];

  for (const row of rows) {
    const rawName = row["Nama Siswa"] ? String(row["Nama Siswa"]).trim() : "";
    const rawNis = row["NIS"] ? String(row["NIS"]).trim() : "";
    const status = row["Status"] ? String(row["Status"]).trim().toUpperCase() : "";
    const note = row["Catatan"] ? String(row["Catatan"]).trim() : "";

    if (!rawName || !status) continue;

    let matchedStudent = rawNis ? nisMap.get(rawNis) : undefined;
    if (!matchedStudent) {
      matchedStudent = classStudentMap.get(rawName.toLowerCase());
    }

    if (!matchedStudent) {
      // Find if student exists globally in another class or unassigned
      const globalStudent = await prisma.student.findFirst({
        where: {
          OR: [
            { name: { equals: rawName, mode: "insensitive" } },
            rawNis ? { nis: rawNis } : {},
          ],
        },
      });

      if (globalStudent) {
        notInClass.push(`${rawName} (Terdaftar di sistem, bukan di kelas ini)`);
      } else {
        notInClass.push(`${rawName} (Belum terdaftar sebagai siswa)`);
      }
      continue;
    }

    const validStatus = ["HADIR", "SAKIT", "IZIN", "ALPA"].includes(status) ? status : null;
    if (!validStatus) continue;

    validUpdates.push({
      studentId: matchedStudent.id,
      status: validStatus,
      note,
    });
  }

  for (const item of validUpdates) {
    await (prisma as any).attendance.upsert({
      where: {
        studentId_date: {
          studentId: item.studentId,
          date: dateObj,
        },
      },
      update: {
        status: item.status,
        note: item.note || null,
      },
      create: {
        studentId: item.studentId,
        date: dateObj,
        status: item.status,
        note: item.note || null,
      },
    });
  }

  revalidatePath("/admin/absensi");

  return {
    success: true,
    message: `Berhasil mengimpor ${validUpdates.length} data absensi.`,
    notInClass,
  };
}
