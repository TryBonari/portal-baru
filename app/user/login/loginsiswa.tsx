"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginStudentAction } from "./actions";

interface LoginSiswaProps {
  onSwitchToRegister?: () => void;
}

export default function LoginSiswa({ onSwitchToRegister }: LoginSiswaProps) {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
    const formData = new FormData();
    formData.append("accessCode", accessCode);
    formData.append("password", password);

    const res = await loginStudentAction(formData);
    setIsLoading(false);

    if (!res.success) {
      setError(res.message || "Gagal masuk.");
    } else {
      router.push("/user/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white border border-stone-200 rounded-lg shadow-sm">
      <div className="flex flex-col gap-2 text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Login Siswa</h1>
        <p className="text-sm text-stone-600">
          Masukkan kode akses dan password Anda.
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
            name="username"
            autoComplete="username"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            placeholder="Contoh: A0001"
            maxLength={10}
            className="px-3.5 py-2 rounded-md border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:border-transparent text-sm tracking-widest font-mono uppercase"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-stone-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-md border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:border-transparent text-sm pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800 transition p-1 focus:outline-none"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
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

