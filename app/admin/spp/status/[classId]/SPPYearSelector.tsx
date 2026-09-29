"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface SelectorsProps {
  academicYears: { id: number; name: string }[];
  selectedYearId?: number;
  classId: number;
}

export default function SPPYearSelector({
  academicYears,
  selectedYearId,
  classId,
}: SelectorsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleYearChange = (yearId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (yearId) {
      params.set("yearId", yearId);
    } else {
      params.delete("yearId");
    }
    router.push(`/admin/spp/status/${classId}?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-6 shadow-sm">
      <label className="block text-xs font-semibold text-stone-500 uppercase mb-2">Filter Tahun Ajaran</label>
      <select
        value={selectedYearId || ""}
        onChange={(e) => handleYearChange(e.target.value)}
        className="w-full md:w-64 p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500"
      >
        <option value="">Pilih Tahun Ajaran</option>
        {academicYears.map((y) => (
          <option key={y.id} value={y.id}>
            {y.name}
          </option>
        ))}
      </select>
    </div>
  );
}
