"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";

type AttendanceInput = {
  studentId: number;
  status: string;
  note?: string;
};

export async function saveAttendances(
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    
    const classId = parseInt(formData.get("classId") as string, 10);
    const dateStr = formData.get("dateStr") as string;
    
    if (!dateStr) return { success: false, message: "Tanggal wajib diisi." };
    const [yy, mm, dd] = dateStr.split("-").map(Number);
    const date = new Date(yy, mm - 1, dd, 12, 0, 0, 0);
    
    const items: AttendanceInput[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith("status_")) {
        const studentId = parseInt(key.replace("status_", ""), 10);
        const note = formData.get(`note_${studentId}`) as string;
        if (value) {
          items.push({ studentId, status: value as string, note: note || undefined });
        }
      }
    });

    if (items.length === 0) return { success: false, message: "Pilih status untuk minimal satu siswa." };

    const validStatuses = ["HADIR", "SAKIT", "IZIN", "ALPA"];
    for (const it of items) {
      if (!validStatuses.includes(it.status)) return { success: false, message: "Status tidak valid." };
      if (it.note && it.note.length > 500) return { success: false, message: "Catatan terlalu panjang." };
    }

    for (const it of items) {
      await prisma.attendance.upsert({
        where: { studentId_date: { studentId: it.studentId, date } },
        update: { status: it.status as any, note: it.note?.trim() || null },
        create: { studentId: it.studentId, date, status: it.status as any, note: it.note?.trim() || null },
      });
    }

    revalidatePath("/admin/absensi");
    return { success: true, message: "Absensi berhasil disimpan." };
  } catch (e) {
    console.error("[saveAttendances]", e);
    return { success: false, message: "Gagal menyimpan absensi." };
  }
}
