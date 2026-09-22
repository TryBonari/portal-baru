"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(prevState: unknown, formData: FormData) {
  try {
    const accessCode = formData.get("accessCode")?.toString().trim();
    const password = formData.get("password")?.toString()?.trim();

    const adminAccessCode = process.env.ADMIN_ACCESS_CODE?.trim();
    const adminPassword = process.env.ADMIN_PASSWORD?.trim();

    if (!adminAccessCode || !adminPassword) {
      return { success: false, message: "Konfigurasi server bermasalah. Hubungi administrator." };
    }

    if (accessCode === adminAccessCode && password === adminPassword) {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "strict",
      });
      // Tidak menghapus student_session secara paksa untuk menghindari konflik session silang
      redirect("/admin/dashboard");
    }

    return { success: false, message: "Kredensial admin tidak valid." };
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    console.error("[Login Admin Error]:", error);
    return { success: false, message: "Terjadi kesalahan sistem saat login." };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  // Tetap hapus untuk keamanan saat admin logout
  cookieStore.delete("student_session");
  redirect("/");
}
