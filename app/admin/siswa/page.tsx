import { prisma } from "@/lib/prisma";
import AdminLayout from "../components/AdminLayout";
import StudentForm from "./StudentForm";
import StudentList from "./StudentList";

export const dynamic = "force-dynamic";

export default async function AdminSiswaPage() {
  const [students, availableClasses, unusedCodes] = await Promise.all([
    prisma.student.findMany({
      include: {
        user: true,
        class: { include: { department: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.schoolClass.findMany({
      where: { isActive: true },
      include: { department: true },
      orderBy: [{ grade: "asc" }, { number: "asc" }],
    }),
    prisma.studentAccessCode.findMany({
      where: { status: "UNUSED" },
      orderBy: { code: "asc" },
    }),
  ]);

  return (
    <AdminLayout activePath="/admin/siswa">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Kelola Data Siswa</h1>
        <p className="text-sm text-stone-600 mt-1">Tambah siswa dan kaitkan dengan kode akses yang telah digenerate.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 lg:col-span-1">
          <h2 className="text-base font-semibold text-stone-900 mb-4">Tambah Siswa Baru</h2>
          {unusedCodes.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
              Tidak ada access code yang tersedia. Silakan generate terlebih dahulu di menu{" "}
              <a href="/admin/accescode" className="underline font-semibold">Access Code</a>.
            </div>
          ) : (
            <StudentForm unusedCodes={unusedCodes} availableClasses={availableClasses} />
          )}
        </div>

        <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-stone-200">
            <h2 className="text-base font-semibold text-stone-900">Daftar Siswa Terdaftar</h2>
          </div>

          {students.length === 0 ? (
            <div className="p-8 text-center text-sm text-stone-500">Belum ada data siswa. Tambahkan melalui form di samping.</div>
          ) : (
            <StudentList students={students} availableClasses={availableClasses} />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}


