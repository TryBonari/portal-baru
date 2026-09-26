"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";
import * as XLSX from "xlsx";

function parseDateInput(raw: string): Date | null {
  const v = raw.trim();
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    const [, dd, mm, yyyy] = m;
    const day = Number(dd);
    const month = Number(mm);
    const year = Number(yyyy);
    if (month < 1 || month > 12) return null;
    const d = new Date(year, month - 1, day);
    if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
    return d;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export async function createAcademicYearAction(prevState: any, formData: FormData) {
  try {
    await checkAdminAuth();
    const name = formData.get("name") as string;
    const startDateRaw = formData.get("startDate") as string;
    const endDateRaw = formData.get("endDate") as string;

    if (!name || !startDateRaw || !endDateRaw) {
      return { success: false, message: "Semua field harus diisi." };
    }

    if (!/^\d{4}\/\d{4}$/.test(name)) {
      return { success: false, message: "Format tahun ajaran harus YYYY/YYYY (misal: 2025/2026)." };
    }

    const startDate = parseDateInput(startDateRaw);
    const endDate = parseDateInput(endDateRaw);

    if (!startDate || !endDate) {
      return { success: false, message: "Tanggal tidak valid. Gunakan dd/mm/yyyy." };
    }

    if (startDate >= endDate) {
      return { success: false, message: "Tanggal mulai harus sebelum tanggal selesai." };
    }

    const existing = await prisma.academicYear.findUnique({ where: { name } });
    if (existing) {
      return { success: false, message: "Tahun ajaran sudah ada." };
    }

    const newAY = await prisma.academicYear.create({
      data: {
        name,
        startDate,
        endDate,
        isActive: false,
        semesters: {
          create: [
            { name: "Semester 1", number: 1, isActive: true },
            { name: "Semester 2", number: 2, isActive: false },
          ],
        },
      },
    });

    revalidatePath("/admin/nilai");
    return { success: true, message: `Tahun ajaran ${name} berhasil dibuat.` };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal membuat tahun ajaran." };
  }
}

export async function updateAcademicYearAction(prevState: any, formData: FormData) {
  try {
    await checkAdminAuth();
    const id = Number(formData.get("id"));
    const name = formData.get("name") as string;
    const startDateRaw = formData.get("startDate") as string;
    const endDateRaw = formData.get("endDate") as string;

    if (!id || !name || !startDateRaw || !endDateRaw) {
      return { success: false, message: "Semua field harus diisi." };
    }

    if (!/^\d{4}\/\d{4}$/.test(name)) {
      return { success: false, message: "Format tahun ajaran harus YYYY/YYYY (misal: 2025/2026)." };
    }

    const startDate = parseDateInput(startDateRaw);
    const endDate = parseDateInput(endDateRaw);

    if (!startDate || !endDate) {
      return { success: false, message: "Tanggal tidak valid. Gunakan dd/mm/yyyy." };
    }

    if (startDate >= endDate) {
      return { success: false, message: "Tanggal mulai harus sebelum tanggal selesai." };
    }

    const existing = await prisma.academicYear.findFirst({
      where: { name, NOT: { id } },
    });
    if (existing) {
      return { success: false, message: "Tahun ajaran dengan nama ini sudah ada." };
    }

    await prisma.academicYear.update({
      where: { id },
      data: {
        name,
        startDate,
        endDate,
      },
    });

    revalidatePath("/admin/nilai");
    return { success: true, message: `Tahun ajaran ${name} berhasil diperbarui.` };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal memperbarui tahun ajaran." };
  }
}

export async function deleteAcademicYearAction(prevState: any, formData: FormData) {
  try {
    await checkAdminAuth();
    const id = Number(formData.get("id"));
    const confirmText = formData.get("confirmText") as string;
    if (confirmText !== "HAPUS") {
      return { success: false, message: "Konfirmasi salah. Ketik 'HAPUS' untuk melanjutkan." };
    }
    const ay = await prisma.academicYear.findUnique({ where: { id }, include: { classes: true, grades: true } });
    if (!ay) return { success: false, message: "Tahun ajaran tidak ditemukan." };
    if (ay.classes.length > 0 || ay.grades.length > 0) {
      return { success: false, message: "Tidak dapat menghapus tahun ajaran yang masih memiliki data (kelas/nilai)." };
    }
    await prisma.academicYear.delete({ where: { id } });
    revalidatePath("/admin/nilai");
    return { success: true, message: "Tahun ajaran berhasil dihapus." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal menghapus tahun ajaran." };
  }
}

export async function upsertGradesAction(
  subjectId: number,
  semesterId: number,
  academicYearId: number,
  payload: {
    studentId: number;
    assignmentScore: number | null;
    utsScore: number | null;
    uasScore: number | null;
  }[]
) {
  try {
    await checkAdminAuth();
    for (const item of payload) {
      const scores = [item.assignmentScore, item.utsScore, item.uasScore].filter((v): v is number => v !== null);
      const finalScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

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
          finalScore,
        },
        create: {
          studentId: item.studentId,
          subjectId,
          academicYearId,
          semesterId,
          assignmentScore: item.assignmentScore,
          utsScore: item.utsScore,
          uasScore: item.uasScore,
          finalScore,
        },
      });
    }
    revalidatePath("/admin/nilai");
    return { success: true, message: "Berhasil menyimpan nilai." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal menyimpan nilai." };
  }
}

export async function exportGradeExcel(classId: number, subjectId: number) {
  await checkAdminAuth();

  const [targetClass, subject] = await Promise.all([
    prisma.schoolClass.findUnique({
      where: { id: classId },
      include: { department: true },
    }),
    prisma.subject.findUnique({ where: { id: subjectId } }),
  ]);

  if (!targetClass) throw new Error("Kelas tidak ditemukan");

  const students = await prisma.student.findMany({
    where: { classId },
    orderBy: { name: "asc" },
  });

  const data = students.map((s, idx) => ({
    No: idx + 1,
    NIS: s.nis || "-",
    "Nama Siswa": s.name,
    Tugas: "",
    UTS: "",
    UAS: "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Nilai Siswa");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const classNameParts = [targetClass.grade, targetClass.department?.code, targetClass.number].filter(Boolean);
  const classNameStr = classNameParts.join(" ");
  const subjectName = subject?.name.replace(/\s+/g, "_") || "Mapel";

  return {
    base64: buffer.toString("base64"),
    filename: `Nilai_Kelas_${classNameStr.replace(/\s+/g, "_")}_${subjectName}.xlsx`,
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
  }[] = [];
  const debugNotRegistered: string[] = [];

  for (const row of rows) {
    const rawName = row["Nama Siswa"] ? String(row["Nama Siswa"]).trim() : "";
    const rawNis = row["NIS"] ? String(row["NIS"]).trim() : "";
    
    const parseScore = (val: unknown) => {
      if (val === undefined || val === null || val === "" || val === "-") return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    };

    const assignmentScore = parseScore(row["Tugas"]);
    const utsScore = parseScore(row["UTS"]);
    const uasScore = parseScore(row["UAS"]);

    // Strict validation: wajib NIS cocok dengan database kelas
    const matchedStudent = rawNis && rawNis !== "-" ? nisMap.get(rawNis) : undefined;

    if (!matchedStudent) {
      if (rawNis && rawNis !== "-") {
        notRegistered.push(`NIS: ${rawNis} (${rawName || 'Tanpa Nama'})`);
      }
      continue;
    }

    // Jika NIS ada di kelas tapi tidak cocok, atau ada siswa kelas yang NIS-nya tidak ada di excel, nilainya dikosongkan (null)
    validUpdates.push({
      studentId: matchedStudent.id,
      assignmentScore: assignmentScore ?? undefined,
      utsScore: utsScore ?? undefined,
      uasScore: uasScore ?? undefined,
    });
  }

  // Jika ada siswa di kelas yang NIS-nya tidak ada dalam file excel, kita kosongkan nilainya
  const processedStudentIds = new Set(validUpdates.map((u) => u.studentId));
  for (const s of studentsInClass) {
    if (!processedStudentIds.has(s.id)) {
      validUpdates.push({
        studentId: s.id,
        assignmentScore: undefined,
        utsScore: undefined,
        uasScore: undefined,
      });
    }
  }

  const deduped = new Map<number, typeof validUpdates[0]>();
  for (const u of validUpdates) deduped.set(u.studentId, u);

  for (const item of deduped.values()) {
    if (item.assignmentScore !== undefined && (item.assignmentScore < 0 || item.assignmentScore > 100)) continue;
    if (item.utsScore !== undefined && (item.utsScore < 0 || item.utsScore > 100)) continue;
    if (item.uasScore !== undefined && (item.uasScore < 0 || item.uasScore > 100)) continue;
    const scores = [item.assignmentScore, item.utsScore, item.uasScore].filter((v): v is number => v !== undefined);
    const finalScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
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
        assignmentScore: item.assignmentScore ?? null,
        utsScore: item.utsScore ?? null,
        uasScore: item.uasScore ?? null,
        finalScore,
      },
      create: {
        studentId: item.studentId,
        subjectId,
        academicYearId,
        semesterId,
        assignmentScore: item.assignmentScore ?? null,
        utsScore: item.utsScore ?? null,
        uasScore: item.uasScore ?? null,
        finalScore,
      },
    });
  }

  revalidatePath("/admin/nilai");

  return {
    success: true,
    message: `Berhasil memperbarui nilai untuk ${validUpdates.length} siswa.`,
    notRegistered: Array.from(new Set(notRegistered)),
  };
}
