"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { updateAcademicYearAction, deleteAcademicYearAction } from "./grade-actions";

function formatDDMMYYYY(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

interface AcademicYearCardProps {
  ay: {
    id: number;
    name: string;
    startDate: string; 
    endDate: string;
    startDateFormatted: string;
    endDateFormatted: string;
  };
}

export default function AcademicYearCard({ ay }: AcademicYearCardProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "edit" | "delete">("idle");
  const [updateState, updateAction, isUpdatePending] = useActionState(updateAcademicYearAction, null);
  const [deleteState, deleteAction, isDeletePending] = useActionState(deleteAcademicYearAction, null);
  const [confirmInput, setConfirmInput] = useState("");
  const [start, setStart] = useState(ay.startDateFormatted);
  const [end, setEnd] = useState(ay.endDateFormatted);

  if (mode === "edit") {
    return (
      <div className="bg-white border border-emerald-500 ring-2 ring-emerald-500/20 rounded-lg p-5 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">Edit Tahun Ajaran</span>
          <button
            type="button"
            onClick={() => setMode("idle")}
            className="text-xs text-stone-400 hover:text-stone-700 font-medium"
          >
            Tutup
          </button>
        </div>

        <form action={updateAction} className="flex flex-col gap-2.5">
          <input type="hidden" name="id" value={ay.id} />
          
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-stone-600">Nama (Contoh: 2025/2026)</label>
            <input
              name="name"
              defaultValue={ay.name}
              placeholder="2025/2026"
              required
              className="px-2.5 py-1.5 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-stone-600">Mulai</label>
              <input
                type="text"
                name="startDate"
                value={start}
                onChange={(e) => setStart(formatDDMMYYYY(e.target.value))}
                placeholder="dd/mm/yyyy"
                inputMode="numeric"
                maxLength={10}
                required
                className="px-2 py-1 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-stone-600">Selesai</label>
              <input
                type="text"
                name="endDate"
                value={end}
                onChange={(e) => setEnd(formatDDMMYYYY(e.target.value))}
                placeholder="dd/mm/yyyy"
                inputMode="numeric"
                maxLength={10}
                required
                className="px-2 py-1 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {updateState?.message && (
            <p className={`text-xs ${updateState.success ? "text-emerald-600" : "text-rose-600"}`}>
              {updateState.message}
            </p>
          )}

          <div className="flex gap-2 mt-1">
            <button
              type="submit"
              disabled={isUpdatePending}
              className="flex-1 bg-emerald-900 text-white text-xs font-semibold py-1.5 rounded hover:bg-emerald-800 disabled:opacity-50 transition"
            >
              {isUpdatePending ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => setMode("idle")}
              className="px-3 py-1.5 bg-stone-100 text-stone-700 text-xs font-semibold rounded hover:bg-stone-200 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (mode === "delete") {
    return (
      <div className="bg-white border border-rose-500 ring-2 ring-rose-500/20 rounded-lg p-5 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Hapus Tahun Ajaran</span>
          <button
            type="button"
            onClick={() => setMode("idle")}
            className="text-xs text-stone-400 hover:text-stone-700 font-medium"
          >
            Tutup
          </button>
        </div>

        <p className="text-xs text-stone-600">
          Ketik <strong className="text-rose-700 font-mono">HAPUS</strong> untuk mengonfirmasi penghapusan <span className="font-semibold">{ay.name}</span>.
        </p>

        <form action={deleteAction} className="flex flex-col gap-2.5">
          <input type="hidden" name="id" value={ay.id} />
          <input type="hidden" name="confirmText" value={confirmInput} />

          <input
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder="Ketik HAPUS di sini"
            className="px-2.5 py-1.5 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-rose-500 outline-none font-mono"
            required
          />

          {deleteState?.message && (
            <p className={`text-xs ${deleteState.success ? "text-emerald-600" : "text-rose-600"}`}>
              {deleteState.message}
            </p>
          )}

          <div className="flex gap-2 mt-1">
            <button
              type="submit"
              disabled={isDeletePending || confirmInput !== "HAPUS"}
              className="flex-1 bg-rose-700 text-white text-xs font-semibold py-1.5 rounded hover:bg-rose-800 disabled:opacity-50 transition"
            >
              {isDeletePending ? "Menghapus..." : "Konfirmasi Hapus"}
            </button>
            <button
              type="button"
              onClick={() => setMode("idle")}
              className="px-3 py-1.5 bg-stone-100 text-stone-700 text-xs font-semibold rounded hover:bg-stone-200 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      onClick={() => router.push(`/admin/nilai?academicYearId=${ay.id}`)}
      className="bg-white border border-stone-200 rounded-lg p-5 hover:border-emerald-600 hover:shadow-md transition flex items-center justify-between cursor-pointer group select-none"
    >
      <div>
        <div className="font-mono font-bold text-emerald-900 text-lg group-hover:text-emerald-700 transition">
          {ay.name}
        </div>
        <div className="text-xs text-stone-500 mt-0.5">
          {ay.startDateFormatted} - {ay.endDateFormatted}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 z-10">
        <button
          type="button"
          title="Edit Tahun Ajaran"
          onClick={(e) => {
            e.stopPropagation();
            setMode("edit");
          }}
          className="px-3 py-1 text-xs font-bold bg-white text-emerald-900 border border-emerald-900 rounded hover:bg-emerald-900 hover:text-white transition shadow-sm text-center"
        >
          EDIT
        </button>
        <button
          type="button"
          title="Hapus Tahun Ajaran"
          onClick={(e) => {
            e.stopPropagation();
            setConfirmInput("");
            setMode("delete");
          }}
          className="px-3 py-1 text-xs font-bold bg-white text-rose-700 border border-rose-300 rounded hover:bg-rose-700 hover:text-white transition shadow-sm text-center"
        >
          HAPUS
        </button>
      </div>
    </div>
  );
}
