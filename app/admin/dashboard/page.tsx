import AdminLayout from "../components/AdminLayout";
import { checkAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await checkAdminAuth();

  const totalSiswa = await prisma.student.count();
  const announcements = await prisma.announcement.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: 5,
  });
  
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
          {announcements.length > 0 ? (
            <ul className="divide-y divide-stone-100">
              {announcements.map((announcement) => (
                <li key={announcement.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-900">{announcement.title}</p>
                    <p className="text-xs text-stone-600 whitespace-pre-line mt-1">{announcement.content}</p>
                    <p className="text-xs text-stone-400 mt-1">
                      {announcement.publishedAt?.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  {announcement.imageUrl && (
                    <img
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      className="w-full h-auto max-h-96 rounded-md object-contain bg-stone-900 border border-stone-200"
                    />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 bg-stone-50 border border-stone-100 rounded-md text-sm text-stone-600">
              Belum ada pengumuman yang dipublikasikan.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
