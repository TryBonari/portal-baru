"use client";

import { useState } from "react";

const months = [
  { number: 6, name: "Juni" },
  { number: 7, name: "Juli" },
  { number: 8, name: "Agustus" },
  { number: 9, name: "September" },
  { number: 10, name: "Oktober" },
  { number: 11, name: "November" },
  { number: 12, name: "Desember" },
  { number: 1, name: "Januari" },
  { number: 2, name: "Februari" },
  { number: 3, name: "Maret" },
  { number: 4, name: "April" },
  { number: 5, name: "Mei" },
];

export default function SPPExportMonth({ classId, yearId }: { classId: number; yearId: number }) {
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const exportHref =
    selectedMonth
      ? `/admin/spp/status/export?classId=${classId}&yearId=${yearId}&month=${selectedMonth}`
      : undefined;

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500"
      >
        <option value="">Pilih Bulan</option>
        {months.map((m) => (
          <option key={m.number} value={m.number}>
            {m.name}
          </option>
        ))}
      </select>
      {exportHref ? (
        <a
          href={exportHref}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Ekspor CSV
        </a>
      ) : (
        <span className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-stone-400 bg-stone-100 border border-stone-200 rounded-lg cursor-not-allowed whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Ekspor CSV
        </span>
      )}
    </div>
  );
}
