"use client";

import { useState } from "react";
import StudentEditForm from "../siswa/StudentEditForm";
import { DeleteStudentButton } from "../siswa/DeleteStudentButton";
import { bulkUpdateClassAction } from "./bulk-update-action";
import { useToast } from "@/lib/ToastContext";

type Cls = { id: number; grade: string; number: number; departmentId: number | null; department: { code: string } | null };
type Student = {
  id: number;
  name: string;
  nis: string | null;
  nisn: string | null;
  gender: string | null;
  birthPlace: string | null;
  birthDate: Date | null;
  admissionYear: number | null;
  status: string;
  classId: number | null;
  avatarUrl: string | null;
};

type SelectedClass = Cls & { students: Student[] };

export default function KelolaSiswaClient({
  selectedClass,
  availableClasses,
}: {
  selectedClass: SelectedClass;
  availableClasses: Cls[];
}) {
  const students = selectedClass.students;
  const [editing, setEditing] = useState<Student | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [movingToClass, setMovingToClass] = useState(false);
  const [targetClassId, setTargetClassId] = useState<string>("");

  const toggleSelectAll = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map(s => s.id));
    }
  };

  const toggleStudentSelection = (studentId: number) => {
    setSelectedStudentIds(prev => {
      const index = prev.indexOf(studentId);
      if (index === -1) {
        return [...prev, studentId];
      } else {
        return prev.filter(id => id !== studentId);
      }
    });
  };

  const handleBulkMove = () => {
    if (selectedStudentIds.length === 0) return;
    setMovingToClass(true);
  };

  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const confirmBulkMove = async () => {
    if (!targetClassId) return;
    setLoading(true);
    const result = await bulkUpdateClassAction(selectedStudentIds, parseInt(targetClassId, 10));
    setLoading(false);

    if (result.success) {
      showSuccess(result.message);
      setMovingToClass(false);
      setIsSelecting(false);
      setSelectedStudentIds([]);
      setTargetClassId("");
    } else {
      showError(result.message);
    }
  };

  return (
    <>
      <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-stone-900 text-base">
            Kelas {selectedClass.grade} {selectedClass.department?.code ?? ""} • Rombel {selectedClass.number}
          </h3>
          <p className="text-xs text-stone-500">Total: {students.length} siswa</p>
        </div>
        <div className="flex items-center gap-3">
          {isSelecting && selectedStudentIds.length > 0 && (
            <div className="flex items-center gap-2 pr-2 border-r border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                {selectedStudentIds.length} terpilih
              </span>
              <button
                onClick={handleBulkMove}
                className="px-3 py-1.5 bg-emerald-900 text-white text-xs font-bold rounded hover:bg-emerald-800 transition shadow-sm"
              >
                Naik Kelas
              </button>
            </div>
          )}
          <button
            onClick={() => {
              setIsSelecting(!isSelecting);
              setSelectedStudentIds([]);
            }}
            className={`px-3 py-1.5 rounded text-xs font-bold transition border ${isSelecting
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"}`}
          >
            {isSelecting ? "BATAL PILIH" : "PILIH BEBERAPA"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50/50 border-b border-stone-200">
            <tr>
              {isSelecting ? (
                <th className="px-6 py-3 text-center font-semibold text-stone-700 w-12">
                  <input
                    type="checkbox"
                    checked={selectedStudentIds.length === students.length && students.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
              ) : (
                <th className="px-6 py-3 text-left font-semibold text-stone-700 w-12">No</th>
              )}
              <th className="px-6 py-3 text-left font-semibold text-stone-700">NIS</th>
              <th className="px-6 py-3 text-left font-semibold text-stone-700">Nama Siswa</th>
              <th className="px-6 py-3 text-center font-semibold text-stone-700">Jenis Kelamin</th>
              <th className="px-6 py-3 text-center font-semibold text-stone-700">Status</th>
              <th className="px-6 py-3 text-center font-semibold text-stone-700">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {students.map((s, idx) => (
              <tr key={s.id} className={selectedStudentIds.includes(s.id) ? "bg-emerald-50/30" : ""}>
                {isSelecting ? (
                  <td className="px-6 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(s.id)}
                      onChange={() => toggleStudentSelection(s.id)}
                      className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                ) : (
                  <td className="px-6 py-3 text-stone-500">{idx + 1}</td>
                )}
                <td className="px-6 py-3 font-mono text-xs">{s.nis || "-"}</td>
                <td className="px-6 py-3 font-medium text-stone-900">{s.name}</td>
                <td className="px-6 py-3 text-center text-xs">
                  {s.gender === "LAKI_LAKI" ? "Laki-laki" : s.gender === "PEREMPUAN" ? "Perempuan" : "-"}
                </td>
                <td className="px-6 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${s.status === "AKTIF" ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setEditing(s)}
                      className="px-2 py-1 text-[10px] font-bold uppercase bg-stone-100 text-stone-600 hover:bg-stone-200 rounded transition tracking-wider"
                    >
                      Edit
                    </button>
                    <DeleteStudentButton id={s.id} />
                  </div>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={isSelecting ? 7 : 6} className="px-6 py-12 text-center text-stone-400">
                  Belum ada siswa terdaftar di kelas/rombel ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <StudentEditForm student={editing} availableClasses={availableClasses} onClose={() => setEditing(null)} />
          </div>
        </div>
      )}
      
      {/* Bulk Move to Class Modal */}
      {movingToClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900">Pindah Kelas Massal</h3>
              <button onClick={() => setMovingToClass(false)} className="text-stone-400 hover:text-stone-600 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <p className="text-sm text-stone-600 mb-4">
                Memindahkan <span className="font-bold text-stone-900">{selectedStudentIds.length} siswa</span> dari kelas saat ini.
              </p>
              
              <div className="flex flex-col gap-1.5 mb-6">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Pilih Kelas Tujuan</label>
                <select
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Pilih Kelas --</option>
                  {availableClasses
                    .filter(c => c.id !== selectedClass.id)
                    .map((c) => {
                      const label = `${c.grade} ${c.department?.code ?? ""} ${c.number}`.trim();
                      return (
                        <option key={c.id} value={c.id}>
                          {label}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setMovingToClass(false)}
                  className="flex-1 px-4 py-2 border border-stone-300 rounded-md text-sm font-bold text-stone-700 hover:bg-stone-50 transition"
                >
                  BATAL
                </button>
                <button
                  type="button"
                  onClick={confirmBulkMove}
                  disabled={!targetClassId || loading}
                  className="flex-1 px-4 py-2 bg-emerald-900 text-white rounded-md text-sm font-bold hover:bg-emerald-800 disabled:opacity-50 transition shadow-sm"
                >
                  {loading ? "MEMPROSES..." : "KONFIRMASI"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}