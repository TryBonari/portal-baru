import { prisma } from "@/lib/prisma";
import AdminLayout from "../components/AdminLayout";
import { createStudentAction } from "../accescode/actions";

export const dynamic = "force-dynamic";

export default async function AdminSiswaPage() {
  const students = await prisma.student.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const unusedCodes = await prisma.studentAccessCode.findMany({
    where: { status: "UNUSED" },
    orderBy: { code: "asc" },
  });

  return (
    <AdminLayout activePath="/admin/siswa">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Kelola Data Siswa</h1>
        <p className="text-sm text-stone-600 mt-1">
          Tambah siswa dan kaitkan dengan kode akses yang telah digenerate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Tambah Siswa */}
        <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 lg:col-span-1">
          <h2 className="text-base font-semibold text-stone-900 mb-4">Tambah Siswa Baru</h2>
          {unusedCodes.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
              Tidak ada access code yang tersedia. Silakan generate terlebih dahulu di menu{" "}
              <a href="/admin/accescode" className="underline font-semibold">Access Code</a>.
            </div>
          ) : (
            <form action={createStudentAction} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase mb-1">
                  Pilih Access Code
                </label>
                <select
                  name="accessCodeId"
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-900"
                >
                  <option value="">-- Pilih Kode Akses --</option>
                  {unusedCodes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.code}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-2 bg-emerald-900 text-white rounded-md text-sm font-medium hover:bg-emerald-800 transition"
              >
                Daftarkan Siswa
              </button>
            </form>
          )}
        </div>

        {/* Tabel Siswa */}
        <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-stone-200">
            <h2 className="text-base font-semibold text-stone-900">Daftar Siswa Terdaftar</h2>
          </div>

          {students.length === 0 ? (
            <div className="p-8 text-center text-sm text-stone-500">
              Belum ada data siswa. Tambahkan melalui form di samping.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-stone-600">
                <thead className="bg-stone-50 text-xs font-semibold uppercase text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-3">Nama Siswa</th>
                    <th className="px-6 py-3">Access Code</th>
                    <th className="px-6 py-3">Tanggal Daftar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-stone-50">
                      <td className="px-6 py-4 font-medium text-stone-900">{student.name}</td>
                      <td className="px-6 py-4 font-mono font-semibold text-emerald-900">
                        {student.user.accessCode}
                      </td>
                      <td className="px-6 py-4">{new Date(student.createdAt).toLocaleString("id-ID")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

