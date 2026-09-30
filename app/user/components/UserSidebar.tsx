"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  SquaresFour, 
  User, 
  CalendarBlank, 
  CheckSquare, 
  GraduationCap, 
  Megaphone, 
  Wallet, 
  ChatTeardropText 
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

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-stone-200 bg-white p-6 flex flex-col gap-1 md:sticky md:top-16 md:h-[calc(100vh-64px)] md:overflow-y-auto shrink-0">
      <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Menu</div>
      {MENU.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
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
    </aside>
  );
}
