"use client";

import { useState } from "react";
import StudentEditForm from "../siswa/StudentEditForm";
import { DeleteStudentButton } from "../siswa/DeleteStudentButton";

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

export default function KelolaSiswaClient({
  students,
  availableClasses,
}: {
  students: Student[];
  availableClasses: Cls[];
}) {
  const [editing, setEditing] = useState<Student | null>(null);

  return (
    <>
      <table className="w-full text-sm">
        <thead className="bg-stone-50/50 border-b border-stone-200">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-stone-700">No</th>
            <th className="px-6 py-3 text-left font-semibold text-stone-700">NIS</th>
            <th className="px-6 py-3 text-left font-semibold text-stone-700">Nama Siswa</th>
            <th className="px-6 py-3 text-center font-semibold text-stone-700">Jenis Kelamin</th>
            <th className="px-6 py-3 text-center font-semibold text-stone-700">Status</th>
            <th className="px-6 py-3 text-center font-semibold text-stone-700">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {students.map((s, idx) => (
            <tr key={s.id}>
              <td className="px-6 py-3 text-stone-500">{idx + 1}</td>
              <td className="px-6 py-3 font-mono">{s.nis || "-"}</td>
              <td className="px-6 py-3 font-medium text-stone-900">{s.name}</td>
              <td className="px-6 py-3 text-center">{s.gender === "LAKI_LAKI" ? "Laki-laki" : s.gender === "PEREMPUAN" ? "Perempuan" : "-"}</td>
              <td className="px-6 py-3 text-center">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${s.status === "AKTIF" ? "bg-emerald-50 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>
                  {s.status}
                </span>
              </td>
              <td className="px-6 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setEditing(s)}
                    className="px-3 py-1 text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-md transition"
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
              <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
                Belum ada siswa terdaftar di kelas/rombel ini.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <StudentEditForm student={editing} availableClasses={availableClasses} onClose={() => setEditing(null)} />
          </div>
        </div>
      )}
    </>
  );
}
