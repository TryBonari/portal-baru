"use client";
import { useState, useTransition } from "react";
import { upsertGradesAction } from "./grade-actions";
import { useToast } from "@/lib/ToastContext";

type Row = {
  studentId: number;
  name: string;
  assignmentScore: string;
  utsScore: string;
  uasScore: string;
};

function calcFinal(a: string, b: string, c: string): string {
  const vals = [a, b, c].map(v => v.trim() === "" ? null : Number(v)).filter(v => v !== null && !isNaN(v as number)) as number[];
  if (vals.length === 0) return "-";
  const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
  return avg % 1 === 0 ? String(avg) : avg.toFixed(2);
}

export default function GradeTable({ initialRows, subjectId, semesterId, academicYearId }: {
  initialRows: Row[];
  subjectId: number;
  semesterId: number;
  academicYearId: number;
}) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [isPending, startTransition] = useTransition();
  const { showSuccess, showError } = useToast();

  function update(idx: number, field: keyof Row, value: string) {
    if (field !== "name" && field !== "studentId") {
      if (value !== "" && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 100)) return;
    }
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  }

  function save() {
    startTransition(async () => {
      try {
        const payload = rows.map(r => ({
          studentId: r.studentId,
          assignmentScore: r.assignmentScore === "" ? null : Number(r.assignmentScore),
          utsScore: r.utsScore === "" ? null : Number(r.utsScore),
          uasScore: r.uasScore === "" ? null : Number(r.uasScore),
        }));
        const res = await upsertGradesAction(subjectId, semesterId, academicYearId, payload);
        if (res.success) showSuccess(res.message);
        else showError(res.message);
      } catch (e: any) {
        showError(e.message || "Gagal menyimpan");
      }
    });
  }

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-stone-700">Nama Siswa</th>
              <th className="px-3 py-3 text-center text-stone-700 w-[90px]">Tugas</th>
              <th className="px-3 py-3 text-center text-stone-700 w-[90px]">UTS</th>
              <th className="px-3 py-3 text-center text-stone-700 w-[90px]">UAS</th>
              <th className="px-3 py-3 text-center text-stone-700 w-[90px]">Nilai Akhir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {rows.map((r, idx) => (
              <tr key={r.studentId}>
                <td className="px-4 py-2 font-medium text-stone-900">{r.name}</td>
                <td className="px-2 py-2">
                  <input value={r.assignmentScore} onChange={e => update(idx, "assignmentScore", e.target.value)} placeholder="-" inputMode="numeric" className="w-full px-2 py-1 border border-stone-300 rounded text-center text-sm focus:ring-1 focus:ring-emerald-500 outline-none" />
                </td>
                <td className="px-2 py-2">
                  <input value={r.utsScore} onChange={e => update(idx, "utsScore", e.target.value)} placeholder="-" inputMode="numeric" className="w-full px-2 py-1 border border-stone-300 rounded text-center text-sm focus:ring-1 focus:ring-emerald-500 outline-none" />
                </td>
                <td className="px-2 py-2">
                  <input value={r.uasScore} onChange={e => update(idx, "uasScore", e.target.value)} placeholder="-" inputMode="numeric" className="w-full px-2 py-1 border border-stone-300 rounded text-center text-sm focus:ring-1 focus:ring-emerald-500 outline-none" />
                </td>
                <td className="px-3 py-2 text-center font-mono font-semibold text-emerald-900 bg-stone-50">{calcFinal(r.assignmentScore, r.utsScore, r.uasScore)}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-stone-400">Belum ada siswa di kelas ini.</td></tr>}
          </tbody>
        </table>
      </div>
      {rows.length > 0 && (
        <div className="p-3 border-t border-stone-200 flex justify-end">
          <button onClick={save} disabled={isPending} className="px-6 py-2 bg-emerald-900 text-white text-sm font-semibold rounded hover:bg-emerald-800 disabled:opacity-50 transition">{isPending ? "Menyimpan..." : "Simpan Nilai"}</button>
        </div>
      )}
      <p className="text-[11px] text-stone-500 italic px-4 pb-3">* Nilai akhir = rata-rata Tugas, UTS, UAS yang terisi (0-100)</p>
    </div>
  );
}
