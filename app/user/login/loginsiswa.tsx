"use client";

import { useState } from "react";
import Link from "next/link";

interface LoginSiswaProps {
  onSwitchToRegister?: () => void;
}

export default function LoginSiswa({ onSwitchToRegister }: LoginSiswaProps) {
  const [accessCode, setAccessCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!accessCode.trim()) {
      setError("Kode akses tidak boleh kosong.");
      return;
    }
    if (!password) {
      setError("Password tidak boleh kosong.");
      return;
    }

    setIsLoading(true);
    // Submit login logic (to be connected with auth action/API)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white border border-stone-200 rounded-lg shadow-sm">
      <div className="flex flex-col gap-2 text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Login Siswa</h1>
        <p className="text-sm text-stone-600">
          Masukkan kode akses dan password yang diberikan oleh sekolah.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="accessCode" className="text-sm font-medium text-stone-700">
            Kode Akses (Access Code)
          </label>
          <input
            id="accessCode"
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            placeholder="Contoh: A7K92"
            maxLength={10}
            className="px-3.5 py-2 rounded-md border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:border-transparent text-sm tracking-widest font-mono uppercase"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-stone-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="px-3.5 py-2 rounded-md border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:border-transparent text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full py-2.5 px-4 rounded-md bg-emerald-900 text-white font-medium text-sm hover:bg-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      {onSwitchToRegister ? (
        <div className="mt-6 text-center text-sm text-stone-600 border-t border-stone-100 pt-4">
          Belum punya akses?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-emerald-900 hover:underline cursor-pointer"
          >
            Aktivasi / Registrasi Akun
          </button>
        </div>
      ) : (
        <div className="mt-6 text-center text-sm text-stone-500 border-t border-stone-100 pt-4">
          <Link href="/" className="hover:text-stone-800 transition">
            &larr; Kembali ke Halaman Utama
          </Link>
        </div>
      )}
    </div>
  );
}
