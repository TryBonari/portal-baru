import AdminLayout from "../components/AdminLayout";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/lib/admin-auth";
import { 
  CreateClassForm, 
  ToggleStatusForm, 
  DeleteClassForm, 
  CreateDepartmentForm, 
  ToggleDepartmentStatusForm, 
  DeleteDepartmentForm 
} from "./kelas-forms";

export const dynamic = "force-dynamic";

export default async function AdminKelasPage() {
  await checkAdminAuth();

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
          <div className="flex flex-col gap-8 lg:col-span-1">
            {/* Form Kelas */}
            <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6">
              <h2 className="text-base font-semibold text-stone-900 mb-4">Tambah Kelas</h2>
              <CreateClassForm departments={departments} />
            </div>

            {/* Form Jurusan */}
            <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6">
              <h2 className="text-base font-semibold text-stone-900 mb-4">Tambah Jurusan</h2>
              <CreateDepartmentForm />
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* Tabel Kelas */}
            <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
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
                        <ToggleStatusForm id={c.id} isActive={c.isActive} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DeleteClassForm id={c.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tabel Jurusan */}
            <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-200 font-semibold text-stone-900">Daftar Jurusan</div>
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 uppercase text-xs text-stone-500">
                  <tr>
                    <th className="px-6 py-3">Kode</th>
                    <th className="px-6 py-3">Nama</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {departments.map((d) => (
                    <tr key={d.id}>
                      <td className="px-6 py-4 font-mono font-bold text-emerald-900">{d.code}</td>
                      <td className="px-6 py-4">{d.name}</td>
                      <td className="px-6 py-4">
                        <ToggleDepartmentStatusForm id={d.id} isActive={d.isActive} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DeleteDepartmentForm id={d.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
