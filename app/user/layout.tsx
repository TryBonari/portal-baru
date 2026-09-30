import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserSidebar from "./components/UserSidebar";

export const dynamic = "force-dynamic";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("student_session")?.value;
  if (!sessionUserId) redirect("/login");

  const userId = parseInt(sessionUserId, 10);
  
  // Ensure we fetch the user and their specific associated student record
  const user = await prisma.user.findFirst({
    where: { 
      id: userId,
      role: "STUDENT"
    },
    include: { 
      student: true 
    },
  });

  if (!user || !user.student) {
    // Clear invalid session
    const cookieStoreSync = await cookies();
    cookieStoreSync.delete("student_session");
    redirect("/login");
  }

  const student = user.student;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-emerald-900 flex items-center justify-center text-white font-bold text-sm tracking-wide">PS</div>
            <span className="font-semibold text-lg tracking-tight">Portal Siswa</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-stone-600 hidden sm:inline">
              {student.name} <span className="font-mono text-xs bg-stone-100 px-2 py-0.5 rounded border border-stone-200 ml-1">{user.accessCode}</span>
            </span>
            <form
              action={async () => {
                "use server";
                const { logoutStudentAction } = await import("./login/actions");
                await logoutStudentAction();
                redirect("/");
              }}
            >
              <button type="submit" className="text-sm font-medium px-3 py-1.5 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 transition cursor-pointer">
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <UserSidebar />
        <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-7xl min-w-0">{children}</main>
      </div>
    </div>
  );
}
