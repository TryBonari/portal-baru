import AdminLayout from "../components/AdminLayout";
import { checkAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AttendanceTable from "./AttendanceTable";
import ExcelControls from "./ExcelControls";

export const dynamic = "force-dynamic";

function todayStr() { return new Date().toISOString().slice(0, 10); }

export default async function AdminAbsensiPage({ searchParams }: { searchParams: Promise<{ classId?: string; date?: string; d?: string; m?: string; y?: string }> }) {
  await checkAdminAuth();
  const params = await searchParams;
  const selectedClassId = params.classId ? parseInt(params.classId, 10) : null;
  
  let selectedDate = params.date || todayStr();
  if (params.d && params.m && params.y) {
    selectedDate = `${params.y}-${params.m.padStart(2, '0')}-${params.d.padStart(2, '0')}`;
  }

  const classes = await prisma.schoolClass.findMany({ include: { department: true }, where: { isActive: true }, orderBy: [{ grade: "asc" }, { number: "asc" }] });

  if (classes.length === 0) {
    return (
      <AdminLayout activePath="/admin/absensi">
        <div><h1 className="text-2xl font-bold tracking-tight text-stone-900">Absensi</h1><p className="text-sm text-stone-600 mt-1">Pilih kelas untuk mengelola absensi harian.</p></div>
        <div className="bg-white border border-stone-200 rounded-lg p-12 text-center shadow-sm flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">?</div>
          <div><h2 className="text-lg font-semibold text-stone-900">Belum Ada Kelas</h2><p className="text-stone-500 max-w-sm mt-1">Buat kelas sebelum mengelola absensi.</p></div>
          <Link href="/admin/kelas" className="inline-flex items-center gap-2 bg-emerald-900 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-emerald-800">+ Tambah Kelas</Link>
        </div>
      </AdminLayout>
    );
  }

  if (!selectedClassId) {
    return (
      <AdminLayout activePath="/admin/absensi">
        <div><h1 className="text-2xl font-bold tracking-tight text-stone-900">Absensi</h1><p className="text-sm text-stone-600 mt-1">Pilih kelas untuk mengelola absensi.</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((c) => (
            <Link key={c.id} href={`/admin/absensi?classId=${c.id}&date=${selectedDate}`} className="bg-white border border-stone-200 rounded-lg p-5 hover:border-emerald-600 hover:shadow-md transition flex items-center justify-between group">
              <div><div className="font-mono font-bold text-emerald-900 text-lg">{c.grade} {c.department?.code ?? ""} {c.number}</div><div className="text-xs text-stone-500">{c.department?.name ?? "Tanpa jurusan"}</div></div>
              <span className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-emerald-900 group-hover:text-white flex items-center justify-center">→</span>
            </Link>
          ))}
        </div>
      </AdminLayout>
    );
  }

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  if (!selectedClass) return <AdminLayout activePath="/admin/absensi"><div className="bg-white border border-stone-200 rounded-lg p-8 text-center text-sm text-stone-500">Kelas tidak ditemukan. <Link href="/admin/absensi" className="text-emerald-700 underline">Kembali</Link></div></AdminLayout>;

  const students = await prisma.student.findMany({ where: { classId: selectedClassId }, orderBy: { name: "asc" }, select: { id: true, name: true, nis: true, avatarUrl: true } });

  const [yy, mm, dd] = selectedDate.split("-").map(Number);
  const dateObj = new Date(yy, mm - 1, dd, 12, 0, 0, 0);

  const daysArr = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const monthsArr = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const formattedDate = `${daysArr[dateObj.getDay()]}, ${dateObj.getDate()} ${monthsArr[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

  const attendances = await (prisma as any).attendance.findMany({ 
    where: { 
      date: dateObj, 
      studentId: { in: students.map((s: any) => s.id) } 
    } 
  });
  const attMap = new Map(attendances.map((a: any) => [a.studentId, { status: a.status, note: a.note }]));
  const rows = students.map((s: any) => ({ ...s, existing: attMap.get(s.id) ?? null }));
  const label = `${selectedClass.grade} ${selectedClass.department?.code ?? ""} ${selectedClass.number}`.trim();

  // Create date selection options
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
  const currentDay = dateObj.getDate();
  const currentMonth = dateObj.getMonth() + 1;
  const currentYear = dateObj.getFullYear();

  return (
    <AdminLayout activePath="/admin/absensi">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">Absensi</h1>
            <p className="text-sm text-stone-600 mt-1">
              Kelas <span className="font-mono font-bold text-emerald-900">{label}</span>
              <span className="mx-2 text-stone-300">|</span>
              <span className="font-medium text-stone-800">{formattedDate}</span>
            </p>
          </div>
          <Link href="/admin/absensi" className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 w-fit">← Ganti kelas</Link>
        </div>

        <form className="flex flex-wrap items-center gap-3 bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
          <label className="text-xs font-semibold text-stone-500 uppercase">Pilih Tanggal</label>
          <input type="hidden" name="classId" value={String(selectedClassId)} />
          
          <div className="flex gap-2">
            <select name="d" defaultValue={currentDay} className="px-3 py-2 border border-stone-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {days.map(d => <option key={d} value={d}>{String(d).padStart(2, '0')}</option>)}
            </select>
            
            <select name="m" defaultValue={currentMonth} className="px-3 py-2 border border-stone-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {monthsArr.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
            
            <select name="y" defaultValue={currentYear} className="px-3 py-2 border border-stone-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <button type="submit" className="px-4 py-2 bg-stone-900 text-white rounded-md text-xs font-semibold hover:bg-stone-800 transition shadow-sm">
            Tampilkan
          </button>
        </form>

        <AttendanceTable classId={selectedClassId} students={rows} selectedDate={selectedDate} />

        <ExcelControls classId={selectedClassId} dateStr={selectedDate} />
      </div>
    </AdminLayout>
  );
}
