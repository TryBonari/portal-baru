"use client";

import { useActionState, useEffect } from "react";
import { updateTeacherAction } from "./teacher-actions";
import { useToast } from "@/lib/ToastContext";

type Teacher = {
  id: number;
  name: string;
  teacherCode: string | null;
  subjects: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
};

export function TeacherEditForm({ teacher, onClose }: { teacher: Teacher; onClose: () => void }) {
  const { showError, showSuccess } = useToast();
  const [state, formAction, isPending] = useActionState(updateTeacherAction, { success: false, message: "" });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        showSuccess(state.message);
        onClose();
      } else {
        showError(state.message);
      }
    }
  }, [state, showError, showSuccess, onClose]);

  return (
    <form action={formAction} className="flex flex-col gap-4 bg-white border border-stone-200 rounded-lg p-6 shadow-lg">
      <input type="hidden" name="id" value={teacher.id} />
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-stone-900">Edit Guru</h3>
        <button type="button" onClick={onClose} disabled={isPending} className="text-sm text-stone-500 hover:text-stone-700">
          Tutup
        </button>
      </div>

      <fieldset disabled={isPending} className="flex flex-col gap-4 contents">
        <div>
          <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Nama Guru *</label>
          <input type="text" name="name" required defaultValue={teacher.name} className="w-full px-3 py-2 border rounded-md text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Kode / NIP</label>
          <input type="text" name="teacherCode" defaultValue={teacher.teacherCode ?? ""} className="w-full px-3 py-2 border rounded-md text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Mata Pelajaran *</label>
          <input type="text" name="subjects" required defaultValue={teacher.subjects ?? ""} placeholder="Pisahkan dengan koma" className="w-full px-3 py-2 border rounded-md text-sm" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">No. HP</label>
            <input type="text" name="phone" defaultValue={teacher.phone ?? ""} className="w-full px-3 py-2 border rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Email</label>
            <input type="email" name="email" defaultValue={teacher.email ?? ""} className="w-full px-3 py-2 border rounded-md text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Status</label>
          <select name="isActive" defaultValue={String(teacher.isActive)} className="w-full px-3 py-2 border rounded-md text-sm bg-white">
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 bg-emerald-900 text-white rounded-md text-sm font-medium hover:bg-emerald-800 disabled:opacity-50"
        >
          {isPending ? "Memproses..." : "Simpan Perubahan"}
        </button>
      </fieldset>
    </form>
  );
}
