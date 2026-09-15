"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(prevState: unknown, formData: FormData) {
  const accessCode = formData.get("accessCode")?.toString().trim();
  const password = formData.get("password")?.toString()?.trim();

  const adminAccessCode = process.env.ADMIN_ACCESS_CODE?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminAccessCode || !adminPassword) {
    return { success: false, message: "Konfigurasi server error (Env missing)." };
  }

  if (accessCode === adminAccessCode && password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "lax",
    });
    
    // Pastikan cookie terhapus untuk role student agar tidak bentrok
    cookieStore.delete("student_session");

    redirect("/admin/dashboard");
  }

  return { success: false, message: "Kredensial admin salah." };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  cookieStore.delete("student_session");
  redirect("/");
}
