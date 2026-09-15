"use client";

import { useActionState } from "react";
import { loginAdmin } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-8 bg-white border border-stone-200 rounded-lg shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Admin Login</h1>
          <p className="text-sm text-stone-600 mt-1">Gunakan kredensial admin sekolah.</p>
        </div>

        {state?.message && !state?.success && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
            {state.message}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-stone-900">Username / Access Code</label>
            <input
              name="accessCode"
              type="text"
              placeholder="Masukkan access code admin"
              className="px-3.5 py-2.5 rounded-md border border-stone-300 text-stone-900 bg-white placeholder:text-stone-400 font-medium text-sm focus:ring-2 focus:ring-emerald-900 focus:border-transparent outline-none shadow-sm"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-stone-900">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="px-3.5 py-2.5 rounded-md border border-stone-300 text-stone-900 bg-white placeholder:text-stone-400 font-medium text-sm focus:ring-2 focus:ring-emerald-900 focus:border-transparent outline-none shadow-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 rounded-md bg-emerald-900 text-white font-semibold text-sm hover:bg-emerald-800 transition disabled:opacity-50 shadow-sm"
          >
            {isPending ? "Memproses..." : "Login Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}

