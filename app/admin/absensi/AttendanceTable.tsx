"use client";

import { useActionState, useState, useEffect } from "react";
import { saveAttendances } from "./absensi-actions";
import { useToast } from "@/lib/ToastContext";

type StudentRow = {
  id: number;
  name: string;
  nis: string | null;
  avatarUrl: string | null;
  existing: { status: string; note: string | null } | null;
};

export default function AttendanceTable({
  classId,
  students,
  selectedDate,
}: {
  classId: number;
  students: StudentRow[];
  selectedDate: string;
}) {
  const { showError, showSuccess } = useToast();
  const [editingRows, setEditingRows] = useState<Record<number, { status: string; note: string }>>({});

  const statusOptions = [
    { value: "HADIR", label: "Hadir", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    { value: "SAKIT", label: "Sakit", color: "bg-amber-50 text-amber-600 border-amber-200" },
    { value: "IZIN", label: "Absen / Izin", color: "bg-blue-50 text-blue-600 border-blue-200" },
    { value: "ALPA", label: "Alpa", color: "bg-red-50 text-red-600 border-red-200" },
  ];

  const [state, formAction, isPending] = useActionState(saveAttendances, { success: false, message: "" });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        showSuccess(state.message);
        setEditingRows({});
      } else {
        showError(state.message);
      }
    }
  }, [state, showSuccess, showError]);

  const startEdit = (s: StudentRow) => {
    const defaultStatus = s.existing?.status ?? "HADIR";
    setEditingRows(prev => ({ ...prev, [s.id]: { status: defaultStatus, note: s.existing?.note ?? "" } }));
  };

  const handleChange = (studentId: number, field: "status" | "note", value: string) => {
    setEditingRows(prev => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status ?? "",
        note: prev[studentId]?.note ?? "",
        [field]: value,
      },
    }));
  };

  return (
    <form action={formAction}>
      <input type="hidden" name="classId" value={classId} />
      <input type="hidden" name="dateStr" value={selectedDate} />
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Siswa</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">NIS</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Status Kehadiran</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-stone-400">
                    Tidak ada siswa di kelas ini.
                  </td>
                </tr>
              ) : students.map((s) => {
                const existing = s.existing;
                const isEditing = !!editingRows[s.id];
                const currentStatus = isEditing ? editingRows[s.id].status : (existing?.status ?? "");
                const currentNote = isEditing ? editingRows[s.id].note : (existing?.note ?? "");

                return (
                  <tr key={s.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {s.avatarUrl ? (
                          <img src={s.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold">
                            {s.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-medium text-stone-900 text-sm">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-500">{s.nis ?? "-"}</td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          name={`status_${s.id}`}
                          value={currentStatus}
                          onChange={(e) => handleChange(s.id, "status", e.target.value)}
                          className="w-full px-2 py-1.5 border border-stone-300 rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold border cursor-pointer ${
                            existing?.status === "HADIR"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : existing?.status === "SAKIT"
                              ? "bg-amber-50 text-amber-600 border-amber-200"
                              : existing?.status === "IZIN"
                              ? "bg-blue-50 text-blue-600 border-blue-200"
                              : existing?.status === "ALPA"
                              ? "bg-red-50 text-red-600 border-red-200"
                              : "bg-stone-100 text-stone-500 border-stone-200"
                          }`}
                          onClick={() => startEdit(s)}
                        >
                          {existing?.status || "Belum ditetapkan"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          name={`note_${s.id}`}
                          value={currentNote}
                          onChange={(e) => handleChange(s.id, "note", e.target.value)}
                          placeholder="Catatan..."
                          className="w-full px-2 py-1.5 border border-stone-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          maxLength={500}
                        />
                      ) : (
                        <div 
                          className="text-xs text-stone-600 cursor-pointer min-h-[1.5rem]"
                          onClick={() => startEdit(s)}
                        >
                          {existing?.note || "-"}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-emerald-900 text-white rounded-md text-xs font-semibold hover:bg-emerald-800 disabled:opacity-50 transition shadow-sm"
          >
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </form>
  );
}