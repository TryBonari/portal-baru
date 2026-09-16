import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UserDashboardPage() {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("student_session")?.value;
  if (!sessionUserId) redirect("/login");
  const userId = parseInt(sessionUserId, 10);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { student: { include: { class: { include: { department: true } } } } },
  });
  if (!user || user.role !== "STUDENT" || !user.student) redirect("/login");
  const student = user.student;
  const announcements = await prisma.announcement.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  const activeClass = student.class ? [student.class.grade, student.class.department?.code || "", String(student.class.number)].filter(Boolean).join(" ") : "-";
  return (
    <>
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
          <span className="text-xs font-medium text-stone-500 uppercase">Kelas Aktif</span>
          <span className="text-xl font-bold text-emerald-900">{activeClass}</span>
        </div>
        <div className="p-6 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col gap-1">
          <span className="text-xs font-medium text-stone-500 uppercase">Tahun Ajaran</span>
          <span className="text-xl font-bold text-stone-900">{student.admissionYear ? String(student.admissionYear) : "-"}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-stone-900">Pengumuman Terbaru</h2>
          {announcements.length === 0 ? (
            <div className="p-4 bg-stone-50 border border-stone-100 rounded-md text-sm text-stone-600">Belum ada pengumuman baru dari sekolah.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {announcements.map((a) => (
                <div key={a.id} className="p-4 bg-stone-50 border border-stone-100 rounded-md text-sm text-stone-700 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-stone-900">{a.title}</h3>
                    <span className="text-xs text-stone-400">{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("id-ID") : ""}</span>
                  </div>
                  <p className="whitespace-pre-line text-stone-600">{a.content}</p>
                  {a.imageUrl && <img src={a.imageUrl} alt={a.title} className="mt-2 rounded-md h-auto max-h-96 object-contain bg-stone-900 w-full border border-stone-200" />}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-6 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-stone-900">Status SPP Bulan Ini</h2>
          <div className="p-4 bg-stone-50 border border-stone-100 rounded-md text-sm text-stone-600">Tagihan SPP bulan ini belum tercatat lunas.</div>
        </div>
      </div>
    </>
  );
}
