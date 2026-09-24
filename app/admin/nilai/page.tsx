import AdminLayout from "../components/AdminLayout";
import { checkAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import GradeExcelControls from "./GradeExcelControls";

export const dynamic = "force-dynamic";

export default async function AdminNilaiPage({
  searchParams,
}: {
  searchParams: Promise<{
    classId?: string;
    subjectId?: string;
    semesterId?: string;
    academicYearId?: string;
  }>;
}) {
  await checkAdminAuth();
  const params = await searchParams;
  const selectedClassId = params.classId ? parseInt(params.classId, 10) : null;
  const selectedSubjectId = params.subjectId ? parseInt(params.subjectId, 10) : null;
  const selectedSemesterId = params.semesterId ? parseInt(params.semesterId, 10) : null;
  const selectedAcademicYearId = params.academicYearId ? parseInt(params.academicYearId, 10) : null;

  const classes = await prisma.schoolClass.findMany({
    include: { department: true },
    where: { isActive: true },
    orderBy: [{ grade: "asc" }, { number: "asc" }],
  });

  if (!selectedClassId) {
    return (
      <AdminLayout activePath="/admin/nilai">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Pengelolaan Nilai</h1>
          <p className="text-sm text-stone-600 mt-1">Pilih kelas untuk mengelola nilai siswa.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((c) => (
            <Link
              key={c.id}
              href={`/admin/nilai?classId=${c.id}`}
              className="bg-white border border-stone-200 rounded-lg p-5 hover:border-emerald-600 hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <div className="font-mono font-bold text-emerald-900 text-lg">
                  {c.grade} {c.department?.code ?? ""} {c.number}
                </div>
                <div className="text-xs text-stone-500">{c.department?.name ?? "Tanpa jurusan"}</div>
              </div>
              <span className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-emerald-900 group-hover:text-white flex items-center justify-center">
                →
              </span>
            </Link>
          ))}
        </div>
      </AdminLayout>
    );
  }

  const selectedClass = await prisma.schoolClass.findUnique({
    where: { id: selectedClassId },
    include: { department: true, students: { orderBy: { name: "asc" } } },
  });

  if (!selectedClass) {
    return (
      <AdminLayout activePath="/admin/nilai">
        <div className="bg-white border border-stone-200 rounded-lg p-8 text-center text-sm text-stone-500">
          Kelas tidak ditemukan.
        </div>
      </AdminLayout>
    );
  }

  if (selectedClassId && (!selectedSubjectId || !selectedSemesterId || !selectedAcademicYearId)) {
    const activeAcademicYear = await prisma.academicYear.findFirst({
      where: { isActive: true },
      orderBy: { startDate: "desc" },
    });

    const [subjects, academicYears, semesters] = await Promise.all([
      prisma.subject.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
      prisma.academicYear.findMany({ orderBy: { startDate: "desc" } }),
      prisma.semester.findMany({ orderBy: [{ academicYearId: "asc" }, { number: "asc" }] }),
    ]);

    const classNameStr = `${selectedClass.grade ?? ""} ${selectedClass.department?.code ?? ""} ${selectedClass.number ?? ""}`.trim();

    return (
      <AdminLayout activePath="/admin/nilai">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Input Nilai - {classNameStr}</h1>
          <p className="text-sm text-stone-600 mt-1">Lengkapi pilihan di bawah untuk mulai mengelola nilai.</p>
        </div>

        <form className="max-w-md bg-white border border-stone-200 rounded-lg p-6 shadow-sm flex flex-col gap-4">
          <input type="hidden" name="classId" value={String(selectedClassId)} />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-stone-700">Tahun Ajaran</label>
            <select
              name="academicYearId"
              required
              defaultValue={selectedAcademicYearId ?? activeAcademicYear?.id ?? ""}
              className="px-3 py-2 border border-stone-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Pilih Tahun Ajaran</option>
              {academicYears.map((ay) => (
                <option key={ay.id} value={ay.id}>{ay.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-stone-700">Semester</label>
            <select
              name="semesterId"
              required
              defaultValue={selectedSemesterId ?? ""}
              className="px-3 py-2 border border-stone-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Pilih Semester</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({academicYears.find(ay => ay.id === s.academicYearId)?.name})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-stone-700">Mata Pelajaran</label>
            <select
              name="subjectId"
              required
              defaultValue={selectedSubjectId ?? ""}
              className="px-3 py-2 border border-stone-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Pilih Mata Pelajaran</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-2.5 bg-emerald-900 text-white rounded-md font-semibold hover:bg-emerald-800 transition shadow-sm"
          >
            Lanjut ke Input Nilai
          </button>
        </form>
      </AdminLayout>
    );
  }

  const [subjects, academicYears, semesters] = await Promise.all([
    prisma.subject.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.academicYear.findMany({ orderBy: { startDate: "desc" } }),
    prisma.semester.findMany({ orderBy: [{ academicYearId: "asc" }, { number: "asc" }] }),
  ]);

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
  const selectedSemester = semesters.find(s => s.id === selectedSemesterId);
  const selectedAY = academicYears.find(ay => ay.id === selectedAcademicYearId);

  const studentIds = selectedClass.students.map((s) => s.id);
  const grades = await prisma.grade.findMany({
    where: {
      studentId: { in: studentIds },
      subjectId: selectedSubjectId!,
      semesterId: selectedSemesterId!,
      academicYearId: selectedAcademicYearId!,
    },
  });

  const gradeMap = new Map(grades.map((g) => [g.studentId, g]));
  const classNameStr = `${selectedClass.grade ?? ""} ${selectedClass.department?.code ?? ""} ${selectedClass.number ?? ""}`.trim();

  return (
    <AdminLayout activePath="/admin/nilai">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/admin/nilai?classId=${selectedClassId}`} className="text-xs text-emerald-700 hover:underline">← Ganti Mapel/Semester</Link>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">Nilai: {selectedSubject?.name}</h1>
            <p className="text-sm text-stone-600 mt-1">
              Kelas {classNameStr} • {selectedSemester?.name} • {selectedAY?.name}
            </p>
          </div>
          <GradeExcelControls
            classId={selectedClassId}
            subjectId={selectedSubjectId}
            semesterId={selectedSemesterId}
            academicYearId={selectedAcademicYearId}
          />
        </div>

        <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-stone-700">Nama Siswa</th>
                <th className="px-6 py-3 text-center text-stone-700">Tugas</th>
                <th className="px-6 py-3 text-center text-stone-700">UTS</th>
                <th className="px-6 py-3 text-center text-stone-700">UAS</th>
                <th className="px-6 py-3 text-center text-stone-700">Praktik</th>
                <th className="px-6 py-3 text-center text-stone-700">Nilai Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {selectedClass.students.map((s) => {
                const g = gradeMap.get(s.id);
                return (
                  <tr key={s.id}>
                    <td className="px-6 py-4 font-medium text-stone-900">{s.name}</td>
                    <td className="px-6 py-4 text-center">{g?.assignmentScore ?? "-"}</td>
                    <td className="px-6 py-4 text-center">{g?.utsScore ?? "-"}</td>
                    <td className="px-6 py-4 text-center">{g?.uasScore ?? "-"}</td>
                    <td className="px-6 py-4 text-center">{g?.practiceScore ?? "-"}</td>
                    <td className="px-6 py-4 text-center">{g?.finalScore ?? "-"}</td>
                  </tr>
                );
              })}
              {selectedClass.students.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-stone-400">
                    Belum ada siswa di kelas ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
