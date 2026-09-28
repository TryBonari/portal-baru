"use client";

import { useActionState, useEffect } from "react";
import { updateStudentAction } from "../siswa/update-action";
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

export default function StudentClassEditModal({
  student,
  availableClasses,
  onClose,
}: {
  student: Student;
  availableClasses: Cls[];
  onClose: () => void;
}) {
  const { showError, showSuccess } = useToast();
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    // Kita pastikan field lain dikirimkan ulang secara tersembunyi agar update-action tidak menghapus/mengosongkan data lain
    formData.set("name", student.name);
    formData.set("nis", student.nis ?? "");
    formData.set("nisn", student.nisn ?? "");
    formData.set("gender", student.gender ?? "");
    formData.set("status", student.status);
    formData.set("birthPlace", student.birthPlace ?? "");
    formData.set("birthDate", student.birthDate ? new Date(student.birthDate).toLocaleDateString("id-ID") : "");
    formData.set("admissionYear", student.admissionYear ? String(student.admissionYear) : "");
    return await updateStudentAction(prevState, formData);
  }, { success: false, message: "" });

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        showSuccess(state.message);
        onClose();
      } else {
        showError(state.message);
      }
    }
  }, [state, showSuccess, showError, onClose]);

  return (
    <form action={formAction} className="flex flex-col gap-4 bg-white border border-stone-200 rounded-lg p-6 shadow-lg max-w-md w-full">
      <input type="hidden" name="id" value={student.id} />
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-stone-900">Pindah Kelas Siswa</h3>
        <button type="button" onClick={onClose} disabled={isPending} className="text-sm text-stone-500 hover:text-stone-700">Tutup</button>
      </div>

      <fieldset disabled={isPending} className="flex flex-col gap-4">
        <div>
          <p className="text-xs text-stone-500 mb-1">Nama Siswa:</p>
          <p className="font-semibold text-stone-900 text-sm">{student.name} <span className="font-mono font-normal text-xs text-stone-400">({student.nis || "Tanpa NIS"})</span></p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase mb-2">Pilih Kelas Baru</label>
          <select name="classId" defaultValue={student.classId ?? ""} required className="w-full px-3 py-2 border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">-- Pilih Kelas --</option>
            {availableClasses.map((c) => {
              const label = [c.grade, c.number, c.department?.code].filter(Boolean).join(" ");
              return <option key={c.id} value={c.id}>{label}</option>;
            })}
          </select>
        </div>

        <button type="submit" disabled={isPending} className="w-full py-2 bg-emerald-900 text-white rounded-md text-sm font-semibold hover:bg-emerald-800 disabled:opacity-50 transition shadow-sm">
          {isPending ? "Memproses..." : "Simpan Pindah Kelas"}
        </button>
      </fieldset>
    </form>
  );
}
