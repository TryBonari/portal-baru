import AdminLayout from "../components/AdminLayout";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/lib/admin-auth";
import { createSchoolClassAction, deleteSchoolClassAction, toggleSchoolClassStatusAction } from "./kelas-actions";

export const dynamic = "force-dynamic";

export default async function AdminKelasPage() {
  await checkAdminAuth();

  // Inisialisasi jurusan dasar jika tabel Department masih kosong
  const deptCount = await prisma.department.count();
  if (deptCount === 0) {
    await prisma.department.createMany({
      data: [
        { code: "BI", name: "Bahasa Indonesia", isActive: true },
        { code: "BIN", name: "Bahasa Inggris", isActive: true },
        { code: "MTK", name: "Matematika", isActive: true },
      ],
      skipDuplicates: true,
    });
  }

  const departments = await prisma.department.findMany({ orderBy: { code: "asc" } });
  const classes = await prisma.schoolClass.findMany({
    include: { department: true },
    orderBy: [{ grade: "asc" }, { number: "asc" }],
  });

  return (
    <AdminLayout activePath="/admin/kelas">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Kelas & Jurusan</h1>
          <p className="text-sm text-stone-600 mt-1">Kelola rombongan belajar dan data program keahlian.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Kelas */}
          <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 lg:col-span-1">
            <h2 className="text-base font-semibold text-stone-900 mb-4">Tambah Kelas</h2>
            <form action={createSchoolClassAction} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Tingkat *</label>
                <select name="grade" required className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white">
                  <option value="X">X</option>
                  <option value="XI">XI</option>
                  <option value="XII">XII</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Jurusan</label>
                <select name="departmentId" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white">
                  <option value="">-- Tanpa Jurusan --</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.code} - {d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Nomor Rombel *</label>
                <input type="number" name="number" required defaultValue={1} min={1} className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm" />
              </div>
              <button type="submit" className="w-full py-2 bg-emerald-900 text-white rounded-md text-sm font-medium hover:bg-emerald-800">Simpan Kelas</button>
            </form>
          </div>

          {/* Tabel Kelas */}
          <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden lg:col-span-2">
            <div className="px-6 py-4 border-b border-stone-200 font-semibold text-stone-900">Daftar Kelas</div>
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 uppercase text-xs text-stone-500">
                <tr>
                  <th className="px-6 py-3">Nama Rombel</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {classes.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-900">{c.grade} {c.department?.code} {c.number}</td>
                    <td className="px-6 py-4">
                      <form action={toggleSchoolClassStatusAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className={`px-2 py-1 text-xs rounded-full ${c.isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>
                          {c.isActive ? "Aktif" : "Nonaktif"}
                        </button>
                      </form>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={deleteSchoolClassAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className="text-red-600 font-medium">Hapus</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
