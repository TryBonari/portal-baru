import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Validasi session admin di level Server Component / Middleware / Server Actions.
 * Mengalihkan ke halaman login jika tidak valid.
 */
export async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "authenticated") {
    redirect("/admin/login");
  }
}

/**
 * Mengecek apakah session admin valid tanpa melakukan redirect.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  
  return !!session && session.value === "authenticated";
}

