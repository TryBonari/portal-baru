"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole, AuthResult } from "@/lib/auth-guard";
import { z } from "zod";

const AttendanceStatusEnum = z.enum(["HADIR", "SAKIT", "IZIN", "ALPA"]);

const SaveAttendancesSchema = z.object({
  classId: z.coerce.number().int().positive(),
  dateStr: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  items: z.array(z.object({
    studentId: z.coerce.number().int().positive(),
    status: AttendanceStatusEnum,
    note: z.string().max(500).optional().nullable(),
  })).min(1, "Pilih status untuk minimal satu siswa"),
});

export async function saveAttendances(
  prevState: AuthResult<{ message: string }>,
  formData: FormData
): Promise<AuthResult<{ message: string }>> {
  try {
    await requireRole(["ADMIN"]);
    
    // Parse initial form values
    const classId = formData.get("classId");
    const dateStr = formData.get("dateStr");
    
    // Extract dynamic items from FormData
    const itemsRaw: Array<{ studentId: unknown; status: unknown; note: unknown }> = [];
    formData.forEach((value, key) => {
      if (key.startsWith("status_")) {
        const studentId = key.replace("status_", "");
        const note = formData.get(`note_${studentId}`);
        if (value) {
          itemsRaw.push({ 
            studentId, 
            status: value, 
            note: note || null 
          });
        }
      }
    });

    // Validate with Zod
    const validated = SaveAttendancesSchema.safeParse({
      classId,
      dateStr,
      items: itemsRaw,
    });

    if (!validated.success) {
      return { 
        success: false, 
        error: validated.error.issues[0].message 
      };
    }

    const { dateStr: validDateStr, items } = validated.data;
    const [yy, mm, dd] = validDateStr.split("-").map(Number);
    const date = new Date(yy, mm - 1, dd, 12, 0, 0, 0);
    
    // Perform upserts in a transaction for consistency
    await prisma.$transaction(
      items.map((it) => 
        prisma.attendance.upsert({
          where: { studentId_date: { studentId: it.studentId, date } },
          update: { 
            status: it.status, 
            note: it.note?.trim() || null 
          },
          create: { 
            studentId: it.studentId, 
            date, 
            status: it.status, 
            note: it.note?.trim() || null 
          },
        })
      )
    );

    revalidatePath("/admin/absensi");
    return { success: true, data: { message: "Absensi berhasil disimpan." } };
  } catch (e) {
    console.error("[saveAttendances]", e);
    const msg = e instanceof Error ? e.message : "Gagal menyimpan absensi.";
    return { success: false, error: msg };
  }
}
