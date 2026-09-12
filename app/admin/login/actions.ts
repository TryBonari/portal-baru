"use server";

export async function loginAdmin(prevState: any, formData: FormData) {
  const accessCode = formData.get("accessCode");
  const password = formData.get("password");

  const adminAccessCode = process.env.ADMIN_ACCESS_CODE;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (accessCode === adminAccessCode && password === adminPassword) {
    // Session/cookie setting logic here
    return { success: true };
  }

  return { success: false, message: "Kredensial admin salah." };
}
