import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UserDashboardPage() {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("student_session")?.value;

  if (!sessionUserId) {
    redirect("/login");
  }

  const userId = parseInt(sessionUserId, 10);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      student: {
        include: {
          class: {
            include: { department: true },
          },
        },
      },
    },
  });

  if (!user || user.role !== "STUDENT" || !user.student) {
    redirect("/login");
  }

  const student = user.student;

  const announcements = await prisma.announcement.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-emerald-900 flex items-center justify-center text-white font-bold text-sm tracking-wide">
              PS
            </div>
            <span className="font-semibold text-lg tracking-tight">Portal Siswa</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-stone-600 hidden sm:inline">
              {student.name} <span className="font-mono text-xs bg-stone-100 px-2 py-0.5 rounded border border-stone-200 ml-1">{user.accessCode}</span>
            </span>
            <form action={async () => {
              "use server";
              const { logoutStudentAction } = await import("../login/actions");
              await logoutStudentAction();
              redirect("/");
            }}>
              <button
                type="submit"
                className="text-sm font-medium px-3 py-1.5 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-stone-200 bg-white p-6 flex flex-col gap-1">
          <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Menu Siswa</div>
          <Link href="/user/dashboard" className="px-3 py-2 rounded-md bg-emerald-50 text-emerald-900 font-semibold text-sm">
            Dashboard
          </Link>
          <Link href="/user/dashboard" className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100 font-medium text-sm transition">
            Profil Saya
          </Link>
          <Link href="/user/dashboard" className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100 font-medium text-sm transition">
            Jadwal Pelajaran
          </Link>
          <Link href="/user/dashboard" className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100 font-medium text-sm transition">
            Absensi
          </Link>
          <Link href="/user/dashboard" className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100 font-medium text-sm transition">
            Nilai Akademik
          </Link>
          <Link href="/user/dashboard" className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100 font-medium text-sm transition">
            Pengumuman
          </Link>
          <Link href="/user/dashboard" className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100 font-medium text-sm transition">
            Status SPP
          </Link>
        </aside>

        <main className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-7xl">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">Dashboard Siswa</h1>
            <p className="text-sm text-stone-600 mt-1">Selamat datang kembali, {student.name}.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col gap-1">
              <span className="text-xs font-medium text-stone-500 uppercase">Nama Siswa</span>
              <span className="text-xl font-bold text-stone-900">{student.name}</span>
            </div>
            <div className="p-6 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col gap-1">
              <span className="text-xs font-medium text-stone-500 uppercase">Kelas</span>
              <span className="text-xl font-bold text-emerald-900">
                {student.class 
                  ? `${student.class.grade} ${student.class.department?.code || ""} ${student.class.number}` 
                  : "-"}
              </span>
            </div>
            <div className="p-6 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col gap-1">
              <span className="text-xs font-medium text-stone-500 uppercase">Jurusan</span>
              <span className="text-xl font-bold text-stone-900">{student.class?.department?.name || "-"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-stone-900">Pengumuman Terbaru</h2>
              {announcements.length === 0 ? (
                <div className="p-4 bg-stone-50 border border-stone-100 rounded-md text-sm text-stone-600">
                  Belum ada pengumuman baru dari sekolah.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {announcements.map((a) => (
                    <div key={a.id} className="p-4 bg-stone-50 border border-stone-100 rounded-md text-sm text-stone-700 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-stone-900">{a.title}</h3>
                        <span className="text-xs text-stone-400">
                          {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("id-ID") : ""}
                        </span>
                      </div>
                      <p className="whitespace-pre-line text-stone-600">{a.content}</p>
                      {a.imageUrl && (
                        <img src={a.imageUrl} alt={a.title} className="mt-1 rounded-md max-h-48 object-cover w-full" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-stone-900">Status SPP Bulan Ini</h2>
              <div className="p-4 bg-stone-50 border border-stone-100 rounded-md text-sm text-stone-600">
                Tagihan SPP bulan ini belum tercatat lunas.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
