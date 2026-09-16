import Link from "next/link";
import { ReactNode } from "react";
import { logoutAdmin } from "../login/actions";

interface AdminLayoutProps {
  children: ReactNode;
  activePath: string;
}

export default function AdminLayout({ children, activePath }: AdminLayoutProps) {
  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Data Siswa", href: "/admin/siswa" },
    { label: "Access Code", href: "/admin/accescode" },
    { label: "Guru", href: "/admin/guru" },
    { label: "Kelas & Jurusan", href: "/admin/kelas" },
    { label: "Jadwal Pelajaran", href: "/admin/jadwal" },
    { label: "Absensi", href: "/admin/absensi" },
    { label: "Nilai", href: "/admin/nilai" },
    { label: "SPP & Pembayaran", href: "/admin/spp" },
    { label: "Pengumuman", href: "/admin/pengumuman" },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-emerald-900 flex items-center justify-center text-white font-bold text-sm tracking-wide">
              ADM
            </div>
            <span className="font-semibold text-lg tracking-tight text-stone-900">Portal Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-stone-600 hidden sm:inline">Administrator</span>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="text-sm font-medium px-3 py-1.5 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 transition"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-stone-200 bg-white p-4 sm:p-6 flex flex-col gap-1 md:sticky md:top-16 md:h-[calc(100vh-64px)] md:overflow-y-auto">
          <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 px-3">Menu Utama</div>
          {menuItems.map((item) => {
            const isActive = activePath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md font-medium text-sm transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-900 font-semibold"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </aside>

        <main className="flex-1 p-4 sm:p-8 flex flex-col gap-6 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}
