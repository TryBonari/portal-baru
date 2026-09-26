"use client";

import { useActionState, useEffect } from "react";
import { updateStudentAction } from "./update-action";
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

export default function StudentEditForm({
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
    <form action={formAction} className="flex flex-col gap-4 bg-white border border-stone-200 rounded-lg p-6 shadow-lg">
      <input type="hidden" name="id" value={student.id} />
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-stone-900">Edit Siswa</h3>
        <button type="button" onClick={onClose} disabled={isPending} className="text-sm text-stone-500 hover:text-stone-700">Tutup</button>
      </div>

      <fieldset disabled={isPending} className="flex flex-col gap-4 contents">
        <div className="flex gap-4 items-start">
          {student.avatarUrl ? <img src={student.avatarUrl} alt="avatar" className="w-14 h-14 rounded-full object-cover border" /> : <div className="w-14 h-14 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold">{student.name.charAt(0)}</div>}
          <div className="flex-1">
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Ganti Avatar</label>
            <input type="file" name="avatar" accept="image/jpeg,image/png,image/webp" className="w-full text-sm text-stone-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-stone-100" />
            <p className="text-xs text-stone-400 mt-1">Kosongkan jika tidak ingin mengubah. Max 1MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Nama Lengkap *</label>
            <input type="text" name="name" required defaultValue={student.name} className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">NIS</label>
            <input type="text" name="nis" maxLength={20} defaultValue={student.nis ?? ""} className="w-full px-3 py-2 border rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">NISN</label>
            <input type="text" name="nisn" maxLength={20} defaultValue={student.nisn ?? ""} className="w-full px-3 py-2 border rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Jenis Kelamin</label>
            <select name="gender" defaultValue={student.gender ?? ""} className="w-full px-3 py-2 border rounded-md text-sm bg-white">
              <option value="">-- Pilih --</option>
              <option value="LAKI_LAKI">Laki-laki</option>
              <option value="PEREMPUAN">Perempuan</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Status Siswa</label>
            <select name="status" defaultValue={student.status} className="w-full px-3 py-2 border rounded-md text-sm bg-white">
              <option value="AKTIF">Aktif</option>
              <option value="LULUS">Lulus</option>
              <option value="NONAKTIF">Tidak Aktif</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Tempat Lahir</label>
            <input type="text" name="birthPlace" maxLength={100} defaultValue={student.birthPlace ?? ""} className="w-full px-3 py-2 border rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Tanggal Lahir</label>
            <input type="text" name="birthDate" defaultValue={student.birthDate ? new Date(student.birthDate).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "/") : ""} placeholder="DD/MM/YYYY" className="w-full px-3 py-2 border rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Tahun Masuk</label>
            <input type="number" name="admissionYear" min={2000} max={2100} defaultValue={student.admissionYear ?? ""} className="w-full px-3 py-2 border rounded-md text-sm" />
          </div>
        </div>

        <input type="hidden" name="classId" value={student.classId ?? ""} />

        <button type="submit" disabled={isPending} className="w-full py-2 bg-emerald-900 text-white rounded-md text-sm font-medium hover:bg-emerald-800 disabled:opacity-50">
          {isPending ? "Memproses..." : "Simpan Perubahan"}
        </button>
      </fieldset>
    </form>
  );
}
