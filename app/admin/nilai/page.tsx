import AdminLayout from "../components/AdminLayout";
import { checkAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminNilaiPage({ searchParams }: { searchParams: Promise<{ classId?: string }> }) {
  await checkAdminAuth();
  const params = await searchParams;
  const selectedClassId = params.classId ? parseInt(params.classId, 10) : null;

  const classes = await prisma.schoolClass.findMany({ 
    include: { department: true }, 
    where: { isActive: true }, 
    orderBy: [{ grade: "asc" }, { number: "asc" }] 
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
            <Link key={c.id} href={`/admin/nilai?classId=${c.id}`} className="bg-white border border-stone-200 rounded-lg p-5 hover:border-emerald-600 hover:shadow-md transition flex items-center justify-between group">
              <div><div className="font-mono font-bold text-emerald-900 text-lg">{c.grade} {c.department?.code ?? ""} {c.number}</div><div className="text-xs text-stone-500">{c.department?.name ?? "Tanpa jurusan"}</div></div>
              <span className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-emerald-900 group-hover:text-white flex items-center justify-center">→</span>
            </Link>
          ))}
        </div>
      </AdminLayout>
    );
  }

  const selectedClass = await prisma.schoolClass.findUnique({
    where: { id: selectedClassId },
    include: { students: { orderBy: { name: "asc" } } }
  });

  return (
    <AdminLayout activePath="/admin/nilai">
      <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">Nilai Siswa</h1>
            <p className="text-sm text-stone-600 mt-1">Kelas {selectedClass?.grade} {selectedClass?.department?.code} {selectedClass?.number}</p>
          </div>
          <Link href="/admin/nilai" className="text-sm font-medium px-4 py-2 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100">← Ganti kelas</Link>
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
              {selectedClass?.students.map(s => (
                <tr key={s.id}>
                  <td className="px-6 py-4 font-medium text-stone-900">{s.name}</td>
                  <td className="px-6 py-4 text-center">-</td>
                  <td className="px-6 py-4 text-center">-</td>
                  <td className="px-6 py-4 text-center">-</td>
                  <td className="px-6 py-4 text-center">-</td>
                  <td className="px-6 py-4 text-center">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
