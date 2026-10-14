"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { logoutAdmin } from "../login/actions";
import { 
  SquaresFour, 
  Users, 
  UserCheck, 
  Key, 
  ChalkboardTeacher, 
  Buildings, 
  CalendarBlank, 
  CheckSquare, 
  GraduationCap, 
  Wallet, 
  CreditCard, 
  ChartPieSlice, 
  Megaphone,
  CaretDown,
  List,
  X
} from "@phosphor-icons/react";

interface AdminLayoutProps {
  children: ReactNode;
  activePath: string;
}

export default function AdminLayout({ children, activePath }: AdminLayoutProps) {
  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: SquaresFour },
    { label: "Data Siswa", href: "/admin/siswa", icon: Users },
    { label: "Kelola Siswa", href: "/admin/kelolasiswa", icon: UserCheck },
    { label: "Access Code", href: "/admin/accescode", icon: Key },
    { label: "Guru", href: "/admin/guru", icon: ChalkboardTeacher },
    { label: "Kelas & Jurusan", href: "/admin/kelas", icon: Buildings },
    { label: "Jadwal Pelajaran", href: "/admin/jadwal", icon: CalendarBlank },
    { label: "Absensi", href: "/admin/absensi", icon: CheckSquare },
    { label: "Nilai", href: "/admin/nilai", icon: GraduationCap },
    { label: "Keuangan", href: "/admin/spp", icon: Wallet, children: [
      { label: "SPP", href: "/admin/spp", icon: Wallet },
      { label: "Pembayaran", href: "/admin/pembayaran", icon: CreditCard },
      { label: "Status", href: "/admin/spp/status", icon: ChartPieSlice },
    ]},
    { label: "Pengumuman", href: "/admin/pengumuman", icon: Megaphone },
  ];

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    "/admin/spp": true,
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMenu = (href: string) => {
    setOpenMenus(prev => ({ ...prev, [href]: !prev[href] }));
  };

  const sidebarContent = (
    <>
      <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 px-3">Menu Utama</div>
      {menuItems.map((item) => {
        const isParentActive = activePath === item.href || (item.children && item.children.some(c => c.href === activePath));
        const hasChildren = !!item.children;
        const isOpen = openMenus[item.href] ?? false;
        const Icon = item.icon;
        
        if (hasChildren) {
          return (
            <div key={item.href} className="flex flex-col">
              <button
                onClick={() => toggleMenu(item.href)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-md font-medium text-sm transition ${
                  isParentActive
                    ? "bg-emerald-50 text-emerald-900 font-semibold"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} weight={isParentActive ? "fill" : "regular"} />
                  <span>{item.label}</span>
                </div>
                <CaretDown size={16} className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-stone-200 pl-3">
                  {item.children.map((child) => {
                    const isChildActive = activePath === child.href;
                    const ChildIcon = child.icon;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-sm transition ${
                          isChildActive
                            ? "bg-emerald-50 text-emerald-900 font-semibold"
                            : "text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        <ChildIcon size={16} weight={isChildActive ? "fill" : "regular"} />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }
        
        const isActive = activePath === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition ${
              isActive
                ? "bg-emerald-50 text-emerald-900 font-semibold"
                : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            <Icon size={20} weight={isActive ? "fill" : "regular"} />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col relative">
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
        {/* Hamburger Button - Mobile Area */}
        <div className="md:hidden sticky top-0 z-40 px-4 pt-4 pb-2 bg-stone-50/80 backdrop-blur-sm">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg bg-white/80 backdrop-blur-md border border-stone-200/60 shadow-sm text-emerald-900 hover:bg-white transition-all flex items-center justify-center"
            aria-label="Open Menu"
          >
            <List size={22} weight="bold" />
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        <div 
          className={`fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[55] transition-opacity duration-300 md:hidden ${
            isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileOpen(false)}
        />

        {/* Mobile Sidebar Drawer */}
        <aside 
          className={`fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white/90 backdrop-blur-md z-[60] p-6 shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8 px-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-emerald-900 flex items-center justify-center text-white font-bold text-xs tracking-wide">ADM</div>
                <span className="font-semibold text-base tracking-tight">Portal Admin</span>
              </div>
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100"
              >
                <X size={20} weight="bold" />
              </button>
            </div>
            <div className="flex flex-col gap-1 overflow-y-auto">
              {sidebarContent}
            </div>
          </div>
        </aside>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 border-r border-stone-200 bg-white p-6 flex-col gap-1 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto shrink-0">
          {sidebarContent}
        </aside>

        <main className="flex-1 p-4 sm:p-8 flex flex-col gap-6 min-w-0 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}
