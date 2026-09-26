"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface AcademicYear {
  id: number;
  name: string;
}

interface Semester {
  id: number;
  name: string;
  number: number;
  academicYearId: number;
}

export default function UserNilaiFilter({
  academicYears,
  semesters,
  selectedAYId,
  selectedSemId,
}: {
  academicYears: AcademicYear[];
  semesters: Semester[];
  selectedAYId: number | null;
  selectedSemId: number | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ayId, setAyId] = useState<string>(selectedAYId ? String(selectedAYId) : "");
  const [semId, setSemId] = useState<string>(selectedSemId ? String(selectedSemId) : "");
  const [isPending, startTransition] = useTransition();

  const availableSemesters = semesters.filter(
    (s) => !ayId || s.academicYearId === Number(ayId)
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ayId || !semId) return;
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("academicYearId", ayId);
      params.set("semesterId", semId);
      router.push(`/user/nilai?${params.toString()}`);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row items-end gap-4"
    >
      <div className="flex-1 w-full flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-stone-700">Tahun Ajaran</label>
        <select
          value={ayId}
          onChange={(e) => {
            setAyId(e.target.value);
            setSemId(""); // Reset semester when year changes
          }}
          required
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Pilih Tahun Ajaran</option>
          {academicYears.map((ay) => (
            <option key={ay.id} value={ay.id}>
              {ay.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 w-full flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-stone-700">Semester</label>
        <select
          value={semId}
          onChange={(e) => setSemId(e.target.value)}
          disabled={!ayId}
          required
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-stone-50 disabled:text-stone-400"
        >
          <option value="">
            {!ayId ? "Pilih Tahun Ajaran Dahulu" : "Pilih Semester"}
          </option>
          {availableSemesters.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending || !ayId || !semId}
        className="w-full sm:w-auto px-6 py-2 bg-emerald-900 text-white text-sm font-semibold rounded-md hover:bg-emerald-800 disabled:opacity-50 transition shadow-sm h-[38px]"
      >
        {isPending ? "Memuat..." : "Tampilkan Nilai"}
      </button>
    </form>
  );
}
