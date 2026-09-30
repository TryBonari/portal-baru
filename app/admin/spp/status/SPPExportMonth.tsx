"use client";

import { useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react";

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
          <DownloadSimple size={16} weight="regular" />
          Ekspor CSV
        </a>
      ) : (
        <span className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-stone-400 bg-stone-100 border border-stone-200 rounded-lg cursor-not-allowed whitespace-nowrap">
          <DownloadSimple size={16} weight="regular" />
          Ekspor CSV
        </span>
      )}
    </div>
  );
}
