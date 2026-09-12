"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function HalamanUtama() {
  const [logoSrc, setLogoSrc] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoSrc(url);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="relative w-9 h-9 rounded-md bg-emerald-900 flex items-center justify-center text-white font-bold text-sm cursor-pointer overflow-hidden border border-emerald-800 hover:opacity-90 transition">
              {logoSrc ? (
                <Image src={logoSrc} alt="Logo Sekolah" fill className="object-cover" />
              ) : (
                <span>SMA</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                title="Ganti logo sekolah"
              />
            </label>
            <span className="font-semibold text-lg tracking-tight">Portal SMA N 1 Tarutung</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-md text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition"
            >
              Login Siswa
            </Link>
            <Link
              href="/admin/login"
              className="text-sm font-medium px-4 py-2 rounded-md bg-emerald-900 text-white hover:bg-emerald-800 transition"
            >
              Login Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium w-fit">
              Sistem Informasi Akademik & Administrasi Terpadu
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-stone-900">
              Portal Akademik & Administrasi Sekolah Terpusat
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Kelola data akademik, jadwal, absensi, nilai, pengumuman, dan pembayaran SPP dalam satu platform yang aman, terstruktur, dan mudah diakses.
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm flex flex-col gap-6">
            <h2 className="text-xl font-semibold border-b border-stone-100 pb-3">Informasi Sistem</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded bg-stone-50 border border-stone-100">
                <div className="text-xs text-stone-500 font-medium uppercase">Akses Siswa</div>
                <div className="text-sm font-semibold text-stone-800 mt-1">Kode Akses & Password</div>
              </div>
              <div className="p-4 rounded bg-stone-50 border border-stone-100">
                <div className="text-xs text-stone-500 font-medium uppercase">Pembayaran SPP</div>
                <div className="text-sm font-semibold text-stone-800 mt-1">Terintegrasi Offline</div>
              </div>
              <div className="p-4 rounded bg-stone-50 border border-stone-100">
                <div className="text-xs text-stone-500 font-medium uppercase">Absensi Harian</div>
                <div className="text-sm font-semibold text-stone-800 mt-1">Hadir, Sakit, Izin, Alpa</div>
              </div>
              <div className="p-4 rounded bg-stone-50 border border-stone-100">
                <div className="text-xs text-stone-500 font-medium uppercase">Penilaian Akademik</div>
                <div className="text-sm font-semibold text-stone-800 mt-1">Tugas, UTS, UAS, Praktik</div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-stone-200 bg-white py-16 px-6">
          <div className="max-w-7xl mx-auto flex flex-col gap-12">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold tracking-tight">Fitur Utama Portal</h2>
              <p className="text-stone-600 mt-2">Dirancang khusus untuk kebutuhan pengelolaan data sekolah tingkat SMA/SMK.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg border border-stone-200 bg-stone-50 flex flex-col gap-3">
                <h3 className="font-semibold text-lg text-stone-900">Akademik Terstruktur</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Pengelolaan mata pelajaran, jadwal pelajaran, riwayat kelas siswa, absensi harian, dan komponen nilai secara berkala.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-stone-200 bg-stone-50 flex flex-col gap-3">
                <h3 className="font-semibold text-lg text-stone-900">Administrasi SPP</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Pengaturan nominal SPP, keringanan atau beasiswa khusus siswa, serta pencatatan riwayat pembayaran secara transparan.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-stone-200 bg-stone-50 flex flex-col gap-3">
                <h3 className="font-semibold text-lg text-stone-900">Pengumuman Sekolah</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Penyampaian informasi dan pengumuman resmi dari pihak sekolah secara langsung kepada seluruh siswa yang aktif.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white py-8 px-6 text-center text-sm text-stone-500">
        <div className="max-w-7xl mx-auto">
          &copy; {new Date().getFullYear()} Portal Sekolah SMA N 1 Tarutung. Hak Cipta Dilindungi.
        </div>
      </footer>
    </div>
  );
}
