import { cookies } from "next/headers";
import { prisma } from "./prisma";

// Menggunakan Prisma client untuk role dari models/client
import { Role } from "../app/generated/prisma/client";

export type AuthResult<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function requireRole(roles: Role[]) {
  const cookieStore = await cookies();
  
  // Admin Check
  if (roles.includes("ADMIN")) {
    const adminSession = cookieStore.get("admin_session");
    if (adminSession?.value === "authenticated") {
      return { id: 0, role: "ADMIN" as Role };
    }
  }

  // Student Check
  if (roles.includes("STUDENT")) {
    const studentSession = cookieStore.get("student_session");
    if (studentSession?.value) {
      const userId = parseInt(studentSession.value, 10);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { student: true }
      });

      if (user && user.role === "STUDENT" && user.student) {
        return user;
      }
    }
  }

  throw new Error("Unauthorized: Insufficient permissions or not logged in.");
}
