import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-emerald-900 flex items-center justify-center text-white font-bold text-sm">
              ADM
            </div>
            <span className="font-semibold text-lg tracking-tight">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-stone-600">Administrator</span>
            <Link
              href="/"
              className="text-sm font-medium px-3 py-1.5 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 transition"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 border-r border-stone-200 bg-white p-6 hidden md:flex flex-col gap-2">
          <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Menu Utama</div>
          <Link href="/admin/dashboard" className="px-3 py-2 rounded-md bg-emerald-50 text-emerald-900 font-medium text-sm">
            Dashboard
          </Link>
          <Link href="/admin/siswa" className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100 font-medium text-sm transition">
            Siswa & Access Code
          </Link>
          <Link href="/admin/guru" className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100 font-medium text-sm transition">
            Guru
          </Link>
          <Link href="/admin/kelas" className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100 font-medium text-sm transition">
            Kelas & Jurusan
          </Link>
          <Link href="/admin/jadwal" className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100 font-medium text-sm transition">
            Jadwal Pelajaran
          </Link>
          <Link href="/admin/absensi" className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100 font-medium text-sm transition">
            Absensi
          </Link>
          <Link href="/admin/nilai" className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100 font-medium text-sm transition">
            Nilai
          </Link>
          <Link href="/admin/spp" className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100 font-medium text-sm transition">
            SPP & Pembayaran
          </Link>
          <Link href="/admin/pengumuman" className="px-3 py-2 rounded-md text-stone-700 hover:bg-stone-100 font-medium text-sm transition">
            Pengumuman
          </Link>
        </aside>

        <main className="flex-1 p-8 flex flex-col gap-8 max-w-7xl">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">Dashboard Overview</h1>
            <p className="text-sm text-stone-600 mt-1">Ringkasan data akademik dan administrasi sekolah.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col gap-1">
              <span className="text-xs font-medium text-stone-500 uppercase">Total Siswa</span>
              <span className="text-3xl font-bold text-stone-900">0</span>
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
        </main>
      </div>
    </div>
  );
}
