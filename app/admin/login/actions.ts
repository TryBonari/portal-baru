"use server";

import { cookies } from "next/headers";

export async function loginAdmin(prevState: any, formData: FormData) {
  const accessCode = formData.get("accessCode");
  const password = formData.get("password");

  const adminAccessCode = process.env.ADMIN_ACCESS_CODE;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (accessCode === adminAccessCode && password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
    return { success: true };
  }

  return { success: false, message: "Kredensial admin salah." };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
