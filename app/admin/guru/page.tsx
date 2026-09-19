import { prisma } from "@/lib/prisma";
import AdminLayout from "../components/AdminLayout";
import { TeacherForm } from "./TeacherForm";
import { TeacherList } from "./TeacherList";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminGuruPage() {
  await checkAdminAuth();

  const teachers = await prisma.teacher.findMany({
    include: {
      complaints: {
        include: {
          student: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminLayout activePath="/admin/guru">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Kelola Data Guru</h1>
        <p className="text-sm text-stone-600 mt-1">Kelola informasi guru dan mata pelajaran yang diajarkan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 lg:col-span-1">
          <h2 className="text-base font-semibold text-stone-900 mb-4">Tambah Guru Baru</h2>
          <TeacherForm />
        </div>

        <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-stone-200">
            <h2 className="text-base font-semibold text-stone-900">Daftar Guru Terdaftar</h2>
          </div>

          {teachers.length === 0 ? (
            <div className="p-8 text-center text-sm text-stone-500">
              Belum ada data guru. Tambahkan melalui form di samping.
            </div>
          ) : (
            <TeacherList teachers={teachers} />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
