import AdminLayout from "../components/AdminLayout";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/lib/admin-auth";
import Link from "next/link";
import { JadwalForm, SubjectForm } from "./jadwal-forms";
import { ScheduleTimetable } from "./ScheduleTimetable";

export const dynamic = "force-dynamic";

export default async function AdminJadwalPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string }>;
}) {
  await checkAdminAuth();

  const params = await searchParams;
  const selectedClassId = params.classId ? parseInt(params.classId) : null;

  const classes = await prisma.schoolClass.findMany({
    include: { department: true },
    where: { isActive: true },
    orderBy: [{ grade: "asc" }, { number: "asc" }],
  });

  if (classes.length === 0) {
    return (
      <AdminLayout activePath="/admin/jadwal">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Jadwal Pelajaran</h1>
          <p className="text-sm text-stone-600 mt-1">Halaman pengelolaan jadwal pelajaran.</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-lg p-12 text-center shadow-sm flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Belum Ada Kelas</h2>
            <p className="text-stone-500 max-w-sm mt-1">Buat kelas dulu sebelum mengatur jadwal.</p>
          </div>
          <Link href="/admin/kelas" className="inline-flex items-center gap-2 bg-emerald-900 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-emerald-800 transition">
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-sm">+</span>
            Tambah Kelas
          </Link>
        </div>
      </AdminLayout>
    );
  }

  if (!selectedClassId) {
    return (
      <AdminLayout activePath="/admin/jadwal">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Jadwal Pelajaran</h1>
          <p className="text-sm text-stone-600 mt-1">Pilih kelas untuk melihat atau menambah jadwal.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((c) => (
            <Link
              key={c.id}
              href={`/admin/jadwal?classId=${c.id}`}
              className="bg-white border border-stone-200 rounded-lg p-5 hover:border-emerald-600 hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <div className="font-mono font-bold text-emerald-900 text-lg">
                  {c.grade} {c.department?.code ?? ""} {c.number}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">{c.department?.name ?? "Tanpa jurusan"}</div>
              </div>
              <span className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-emerald-900 group-hover:text-white flex items-center justify-center text-stone-500 transition">→</span>
            </Link>
          ))}
        </div>
      </AdminLayout>
    );
  }

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  if (!selectedClass) {
    return (
      <AdminLayout activePath="/admin/jadwal">
        <div className="bg-white border border-stone-200 rounded-lg p-8 text-center text-sm text-stone-500">
          Kelas tidak ditemukan. <Link href="/admin/jadwal" className="text-emerald-700 underline">Kembali pilih kelas</Link>
        </div>
      </AdminLayout>
    );
  }

  const subjects = await (prisma as any).subject.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const teachers = await prisma.teacher.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const schedules = await (prisma as any).schedule.findMany({
    where: { classId: selectedClassId },
    include: {
      class: { include: { department: true } },
      subject: true,
      teacher: true,
    },
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });

  return (
    <AdminLayout activePath="/admin/jadwal">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">Jadwal Pelajaran</h1>
            <p className="text-sm text-stone-600 mt-1">
              Kelas: <span className="font-mono font-bold text-emerald-900">{selectedClass.grade} {selectedClass.department?.code ?? ""} {selectedClass.number}</span>
            </p>
          </div>
          <Link href="/admin/jadwal" className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 w-fit">
            ← Ganti kelas
          </Link>
        </div>

        <ScheduleTimetable schedules={schedules} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-4">Tambah Jadwal — {selectedClass.grade} {selectedClass.department?.code ?? ""} {selectedClass.number}</h2>
            <JadwalForm classes={[selectedClass]} subjects={subjects} teachers={teachers} />
          </div>
          <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-4">Tambah Mata Pelajaran</h2>
            <SubjectForm />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
