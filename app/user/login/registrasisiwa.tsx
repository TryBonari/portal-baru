"use client";

import { useState } from "react";

interface RegistrasiSiswaProps {
  onSwitchToLogin?: () => void;
}

export default function RegistrasiSiswa({ onSwitchToLogin }: RegistrasiSiswaProps) {
  const [accessCode, setAccessCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!accessCode.trim()) {
      setError("Kode akses tidak boleh kosong.");
      return;
    }
    if (!password) {
      setError("Password tidak boleh kosong.");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setIsLoading(true);
    // Submit activation / registration logic
    setTimeout(() => {
      setIsLoading(false);
      setSuccess("Aktivasi akun berhasil! Silakan login.");
    }, 1000);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white border border-stone-200 rounded-lg shadow-sm">
      <div className="flex flex-col gap-2 text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Aktivasi Akun Siswa</h1>
        <p className="text-sm text-stone-600">
          Gunakan kode akses dari sekolah untuk membuat password akun Anda.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="regAccessCode" className="text-sm font-medium text-stone-700">
            Kode Akses (Access Code)
          </label>
          <input
            id="regAccessCode"
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            placeholder="Contoh: A7K92"
            maxLength={10}
            className="px-3.5 py-2 rounded-md border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:border-transparent text-sm tracking-widest font-mono uppercase"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="regPassword" className="text-sm font-medium text-stone-700">
            Password Baru
          </label>
          <input
            id="regPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="px-3.5 py-2 rounded-md border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:border-transparent text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-stone-700">
            Konfirmasi Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi password baru"
            className="px-3.5 py-2 rounded-md border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:border-transparent text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full py-2.5 px-4 rounded-md bg-emerald-900 text-white font-medium text-sm hover:bg-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Memproses..." : "Aktivasi Akun"}
        </button>
      </form>

      {onSwitchToLogin && (
        <div className="mt-6 text-center text-sm text-stone-600 border-t border-stone-100 pt-4">
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-emerald-900 hover:underline cursor-pointer"
          >
            Kembali ke Login
          </button>
        </div>
      )}
    </div>
  );
}
