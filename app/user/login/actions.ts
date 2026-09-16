"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function loginStudentAction(formData: FormData) {
  try {
    const accessCode = (formData.get("accessCode") as string)?.trim().toUpperCase();
    const password = formData.get("password") as string;

    if (!accessCode || !password) {
      return { success: false, message: "Kode akses dan password wajib diisi." };
    }

    const accessCodeRecord = await prisma.studentAccessCode.findUnique({
      where: { code: accessCode },
    });

    if (!accessCodeRecord) {
      return { success: false, message: "Kode akses tidak ditemukan atau belum terdaftar." };
    }

    if (accessCodeRecord.status === "UNUSED") {
      return { success: false, message: "Akun belum diaktivasi oleh admin." };
    }

    const user = await prisma.user.findUnique({
      where: { accessCode },
      include: { student: true },
    });

    if (!user || user.role !== "STUDENT" || !user.student) {
      return { success: false, message: "Akun siswa tidak ditemukan." };
    }

    if (user.student.status !== "AKTIF") {
      return { success: false, message: "Akun siswa tidak aktif atau sudah lulus." };
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, message: "Kredensial atau password salah." };
    }

    const cookieStore = await cookies();
    cookieStore.set("student_session", String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
  } catch (error) {
    console.error("[Login Student Error]:", error);
    return { success: false, message: "Terjadi kesalahan sistem saat login. Silakan coba lagi." };
  }
}

export async function registerStudentAction(formData: FormData) {
  const accessCode = (formData.get("accessCode") as string)?.trim().toUpperCase();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!accessCode || !password || !confirmPassword) {
    return { success: false, message: "Semua bidang wajib diisi." };
  }

  if (password.length < 6) {
    return { success: false, message: "Password minimal 6 karakter." };
  }

  if (password !== confirmPassword) {
    return { success: false, message: "Konfirmasi password tidak cocok." };
  }

  const accessCodeRecord = await prisma.studentAccessCode.findUnique({
    where: { code: accessCode },
  });

  if (!accessCodeRecord) {
    return { success: false, message: "Kode akses tidak ditemukan." };
  }

  if (accessCodeRecord.status === "UNUSED") {
    return { success: false, message: "akun anda belum di daftarkan admin" };
  }

  const student = await prisma.student.findUnique({
    where: { accessCode },
    include: { user: true },
  });

  if (!student) {
    return { success: false, message: "akun anda belum di daftarkan admin" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Update password in both User & Student
  await prisma.$transaction([
    prisma.user.update({
      where: { id: student.userId },
      data: { passwordHash },
    }),
    prisma.student.update({
      where: { id: student.id },
      data: { passwordHash },
    }),
  ]);

  return { success: true, message: "Aktivasi/Registrasi password berhasil! Silakan login." };
}

import { redirect } from "next/navigation";

export async function logoutStudentAction() {
  const cookieStore = await cookies();
  cookieStore.delete("student_session");
  cookieStore.delete("admin_session");
  redirect("/");
}
