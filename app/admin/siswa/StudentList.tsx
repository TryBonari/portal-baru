"use client";
import { useState } from "react";
import { DeleteStudentButton } from "./DeleteStudentButton";
import StudentEditForm from "./StudentEditForm";

type Cls = { id: number; grade: string; number: number; departmentId: number | null; department: { code: string; name: string } | null };
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
  class?: { grade: string; number: number; department: { code: string; name: string } | null } | null;
};

export default function StudentList({ students }: { students: Student[] }) {
  return (
    <>
      <div className="overflow-auto max-h-[55vh] lg:max-h-[600px]">
        <table className="w-full text-left text-sm text-stone-600">
          <thead className="sticky top-0 z-10 bg-stone-50 text-xs font-semibold uppercase text-stone-500 border-b border-stone-200 shadow-sm">
            <tr>
              <th className="px-6 py-3 whitespace-nowrap">Avatar</th>
              <th className="px-6 py-3 whitespace-nowrap">Nama</th>
              <th className="px-6 py-3 whitespace-nowrap">NIS / NISN</th>
              <th className="px-6 py-3 whitespace-nowrap">Kelas</th>
              <th className="px-6 py-3 whitespace-nowrap">Jurusan</th>
              <th className="px-6 py-3 whitespace-nowrap">Tingkat</th>
              <th className="px-6 py-3 whitespace-nowrap">Tahun Masuk</th>
              <th className="px-6 py-3 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-stone-50">
                <td className="px-6 py-4">
                  {s.avatarUrl ? <img src={s.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover border" /> : <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold uppercase">{s.name.charAt(0)}</div>}
                </td>
                <td className="px-6 py-4 font-medium text-stone-900 whitespace-nowrap">{s.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{s.nis || "-"}<br /><span className="text-xs text-stone-400">{s.nisn || "-"}</span></td>
                <td className="px-6 py-4 whitespace-nowrap">{s.class ? s.class.number : "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{s.class?.department?.name || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{s.class?.grade || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{s.admissionYear || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.status === "AKTIF" ? "bg-emerald-100 text-emerald-800" : s.status === "LULUS" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
