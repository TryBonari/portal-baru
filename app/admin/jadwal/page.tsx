import AdminLayout from "../components/AdminLayout";
import { checkAdminAuth } from "@/lib/admin-auth";

export default async function AdminJadwalPage() {
  await checkAdminAuth();

  return (
    <AdminLayout activePath="/admin/jadwal">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Jadwal Pelajaran</h1>
        <p className="text-sm text-stone-600 mt-1">Halaman pengelolaan jadwal pelajaran.</p>
      </div>
      
      <div className="bg-white border border-stone-200 rounded-lg p-8 text-center text-stone-500 shadow-sm">
        Konten jadwal pelajaran akan segera hadir.
      </div>
    </AdminLayout>
  );
}
