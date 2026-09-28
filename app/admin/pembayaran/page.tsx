import AdminLayout from "../components/AdminLayout";
import { checkAdminAuth } from "@/lib/admin-auth";

export default async function AdminPembayaranPage() {
  await checkAdminAuth();

  return (
    <AdminLayout activePath="/admin/pembayaran">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Pembayaran</h1>
          <p className="text-sm text-stone-600 mt-1">Kelola data pembayaran siswa.</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-lg p-8 shadow-sm">
          <p className="text-stone-500 text-center">Halaman pembayaran dalam pengembangan.</p>
        </div>
      </div>
    </AdminLayout>
  );
}