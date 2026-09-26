"use client";

import { useActionState, useState } from "react";
import { createAcademicYearAction } from "./grade-actions";

function formatDDMMYYYY(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export default function AcademicYearForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(createAcademicYearAction, null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm font-medium text-emerald-700 hover:text-emerald-800 underline"
      >
        + Tambah Tahun Ajaran Baru
      </button>
    );
  }

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mt-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-stone-800">Tambah Tahun Ajaran</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-xs text-stone-500 hover:text-stone-700"
        >
          Batal
        </button>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-stone-600">Nama (Contoh: 2025/2026)</label>
          <input
            name="name"
            placeholder="2025/2026"
            required
            className="px-3 py-1.5 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-stone-600">Mulai</label>
            <input
              type="text"
              name="startDate"
              value={start}
              onChange={(e) => setStart(formatDDMMYYYY(e.target.value))}
              placeholder="dd/mm/yyyy"
              inputMode="numeric"
              maxLength={10}
              required
              className="px-3 py-1.5 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-stone-600">Selesai</label>
            <input
              type="text"
              name="endDate"
              value={end}
              onChange={(e) => setEnd(formatDDMMYYYY(e.target.value))}
              placeholder="dd/mm/yyyy"
              inputMode="numeric"
              maxLength={10}
              required
              className="px-3 py-1.5 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
        <p className="text-[10px] text-stone-500 italic">
          * Format pengisian: hari/bulan/tahun (dd/mm/yyyy)
        </p>
        {state?.message && (
          <p className={`text-xs ${state.success ? "text-emerald-600" : "text-rose-600"}`}>
            {state.message}
          </p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="bg-stone-800 text-white text-xs font-bold py-2 rounded hover:bg-stone-700 disabled:opacity-50 transition"
        >
          {isPending ? "Menyimpan..." : "Simpan Tahun Ajaran"}
        </button>
      </form>
    </div>
  );
}
