"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  SquaresFour, 
  User, 
  CalendarBlank, 
  CheckSquare, 
  GraduationCap, 
  Megaphone, 
  Wallet, 
  ChatTeardropText,
  List,
  X
} from "@phosphor-icons/react";

const MENU = [
  { label: "Dashboard", href: "/user/dashboard", icon: SquaresFour },
  { label: "Profil Saya", href: "/user/profil", icon: User },
  { label: "Jadwal Pelajaran", href: "/user/jadwal", icon: CalendarBlank },
  { label: "Absensi", href: "/user/absensi", icon: CheckSquare },
  { label: "Nilai Akademik", href: "/user/nilai", icon: GraduationCap },
  { label: "Pengumuman", href: "/user/pengumuman", icon: Megaphone },
  { label: "Status SPP", href: "/user/spp", icon: Wallet },
  { label: "Pengaduan", href: "/user/pengaduan", icon: ChatTeardropText },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sidebar on navigation
  useEffect(() => {
    if (mounted) {
      setIsOpen(false);
    }
  }, [pathname, mounted]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const sidebarContent = (
    <>
      <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 px-3">Menu</div>
      {MENU.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
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
    <>
      {/* Hamburger Button - Mobile Content Area (Transparent White, Emerald Icon) */}
      <div className="md:hidden sticky top-0 z-40 px-4 pt-4 pb-2 bg-stone-50/80 backdrop-blur-sm">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg bg-white/80 backdrop-blur-md border border-stone-200/60 shadow-sm text-emerald-900 hover:bg-white transition-all flex items-center justify-center"
          aria-label="Open Menu"
        >
          <List size={22} weight="bold" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[55] transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Sidebar Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white/90 backdrop-blur-md z-[60] p-6 shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-8 px-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-emerald-900 flex items-center justify-center text-white font-bold text-xs tracking-wide">PS</div>
              <span className="font-semibold text-base tracking-tight">Portal Siswa</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
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
    </>
  );
}
