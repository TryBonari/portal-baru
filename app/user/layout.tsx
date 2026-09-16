import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const MENU = [
  { label: "Dashboard", href: "/user/dashboard" },
  { label: "Profil Saya", href: "/user/profil" },
  { label: "Jadwal Pelajaran", href: "/user/jadwal" },
  { label: "Absensi", href: "/user/absensi" },
  { label: "Nilai Akademik", href: "/user/nilai" },
  { label: "Pengumuman", href: "/user/pengumuman" },
  { label: "Status SPP", href: "/user/spp" },
];

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("student_session")?.value;
  if (!sessionUserId) redirect("/login");

  const userId = parseInt(sessionUserId, 10);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { student: true },
  });

  if (!user || user.role !== "STUDENT" || !user.student) redirect("/login");

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
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-stone-200 bg-white p-6 flex flex-col gap-1 md:sticky md:top-16 md:h-[calc(100vh-64px)] md:overflow-y-auto shrink-0">
          <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Menu Siswa</div>
          {MENU.map((item) => (
            <Link key={item.label} href={item.href} className="px-3 py-2 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-100 transition">
              {item.label}
            </Link>
          ))}
        </aside>
        <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-7xl min-w-0">{children}</main>
      </div>
    </div>
  );
}
