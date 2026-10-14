"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createComplaintAction(
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("student_session")?.value;
    
    if (!sessionUserId) {
      return { success: false, message: "Sesi tidak valid. Silakan login kembali." };
    }

    const userId = parseInt(sessionUserId, 10);
    const user = await prisma.user.findFirst({
      where: { id: userId, role: "STUDENT" },
      include: { student: true }
    });

    if (!user || !user.student) {
      return { success: false, message: "Otorisasi gagal." };
    }

    const rawTeacherId = formData.get("teacherId");
    const rawSubject = formData.get("subject");
    const rawMessage = formData.get("message");

    if (!rawTeacherId) {
      return { success: false, message: "Data pengaduan tidak lengkap." };
    }

    const teacherId = Number(rawTeacherId);
    const studentId = user.student.id; // Use ID from session, not from formData
    const subject = typeof rawSubject === "string" ? rawSubject.trim() : "";
    const message = typeof rawMessage === "string" ? rawMessage.trim() : "";

    if (!subject) return { success: false, message: "Subjek pengaduan wajib diisi." };
    if (!message) return { success: false, message: "Pesan pengaduan wajib diisi." };

    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
    if (!teacher) return { success: false, message: "Guru tidak ditemukan." };

    await prisma.teacherComplaint.create({
      data: {
        teacherId,
        studentId,
        subject,
        message,
      },
    });

    revalidatePath("/user/pengaduan");
    return { success: true, message: "Pengaduan berhasil dikirim ke guru." };
  } catch (error) {
    console.error("[createComplaintAction error]:", error);
    return { success: false, message: "Gagal mengirim pengaduan. Silakan coba lagi." };
  }
}
