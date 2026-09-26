import AdminLayout from "../components/AdminLayout";
import { checkAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import KelolaSiswaClient from "./KelolaSiswaClient";

export const dynamic = "force-dynamic";

export default async function KelolaSiswaPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; grade?: string; departmentId?: string }>;
}) {
  await checkAdminAuth();
  const params = await searchParams;
  const selectedClassId = params.classId ? parseInt(params.classId, 10) : null;

  const [classes, availableClasses] = await Promise.all([
    prisma.schoolClass.findMany({
      include: { department: true },
      orderBy: [{ grade: "asc" }, { number: "asc" }],
    }),
    prisma.schoolClass.findMany({
      include: { department: true },
      orderBy: [{ grade: "asc" }, { number: "asc" }],
    }),
  ]);

  const selectedClass = selectedClassId
    ? await prisma.schoolClass.findUnique({
        where: { id: selectedClassId },
        include: { department: true, students: { orderBy: { name: "asc" } } },
      })
    : null;

  return (
    <AdminLayout activePath="/admin/kelola-siswa">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Kelola Siswa Berdasarkan Kelas</h1>
        <p className="text-sm text-stone-600 mt-1">Pilih filter di sebelah kiri untuk melihat dan mengelola daftar siswa.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Form Filter di Kiri */}
        <div className="md:col-span-1 bg-white border border-stone-200 rounded-lg p-5 shadow-sm sticky top-20">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">Filter Kelas & Rombel</h2>
          
          <form method="GET" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-700">Pilih Kelas / Rombel</label>
              <select
                name="classId"
                defaultValue={selectedClassId ?? ""}
                className="px-3 py-2 border border-stone-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Pilih Kelas --</option>
                {classes.map((c) => {
                  const label = `${c.grade} ${c.department?.code ?? ""} ${c.number}`.trim();
                  return (
                    <option key={c.id} value={c.id}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-900 text-white text-xs font-bold rounded-md hover:bg-emerald-800 transition shadow-sm"
            >
              Tampilkan Siswa
            </button>
          </form>
        </div>

        {/* Tabel / Konten di Kanan */}
        <div className="md:col-span-3 bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
          {selectedClass ? (
            <div>
              <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    Kelas {selectedClass.grade} {selectedClass.department?.code ?? ""} • Rombel {selectedClass.number}
                  </h3>
                  <p className="text-xs text-stone-500">Total: {selectedClass.students.length} siswa</p>
                </div>
              </div>

              <KelolaSiswaClient students={selectedClass.students} availableClasses={availableClasses} />
            </div>
          ) : (
            <div className="p-12 text-center text-stone-400 text-sm">
              Silakan pilih kelas dan rombel di sebelah kiri lalu klik <strong className="text-stone-700">Tampilkan Siswa</strong>.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
