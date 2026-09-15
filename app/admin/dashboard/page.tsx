import AdminLayout from "../components/AdminLayout";
import { checkAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await checkAdminAuth();

  const totalSiswa = await prisma.student.count();
  
  return (
    <AdminLayout activePath="/admin/dashboard">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Dashboard Overview</h1>
        <p className="text-sm text-stone-600 mt-1">Ringkasan data akademik dan administrasi sekolah.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col gap-1">
          <span className="text-xs font-medium text-stone-500 uppercase">Total Siswa</span>
          <span className="text-3xl font-bold text-stone-900">{totalSiswa}</span>
          <span className="text-xs text-stone-500 mt-1">Siswa aktif terdaftar</span>
        </div>
        <div className="p-6 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col gap-1">
          <span className="text-xs font-medium text-stone-500 uppercase">Total Guru</span>
          <span className="text-3xl font-bold text-stone-900">0</span>
          <span className="text-xs text-stone-500 mt-1">Guru pengajar</span>
        </div>
        <div className="p-6 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col gap-1">
          <span className="text-xs font-medium text-stone-500 uppercase">Total Kelas</span>
          <span className="text-3xl font-bold text-stone-900">0</span>
          <span className="text-xs text-stone-500 mt-1">Kelas aktif</span>
        </div>
        <div className="p-6 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col gap-1">
          <span className="text-xs font-medium text-stone-500 uppercase">Tahun Ajaran</span>
          <span className="text-xl font-bold text-emerald-900">2025/2026</span>
          <span className="text-xs text-stone-500 mt-1">Semester 1 (Aktif)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-stone-900">Absensi Hari Ini</h2>
          <div className="p-4 bg-stone-50 border border-stone-100 rounded-md text-sm text-stone-600">
            Belum ada data absensi yang dicatat untuk hari ini.
          </div>
        </div>
        <div className="p-6 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-stone-900">Pengumuman Terbaru</h2>
          <div className="p-4 bg-stone-50 border border-stone-100 rounded-md text-sm text-stone-600">
            Belum ada pengumuman yang dipublikasikan.
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
