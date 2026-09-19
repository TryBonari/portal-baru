"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createTeacherAction } from "./teacher-actions";
import { useToast } from "@/lib/ToastContext";

export function TeacherForm() {
  const { showError, showSuccess } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(createTeacherAction, { success: false, message: "" });
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        showSuccess(state.message);
        setFormValues({});
        formRef.current?.reset();
      } else {
        showError(state.message);
      }
    }
  }, [state, showError, showSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form action={formAction} ref={formRef} className="flex flex-col gap-4">
      <fieldset disabled={isPending} className="flex flex-col gap-4 contents">
        <div>
          <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Nama Guru *</label>
          <input
            type="text"
            name="name"
            required
            value={formValues.name || ""}
            onChange={handleChange}
            placeholder="Contoh: Budi Santoso, S.Pd"
            className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Kode / NIP</label>
          <input
            type="text"
            name="teacherCode"
            value={formValues.teacherCode || ""}
            onChange={handleChange}
            placeholder="Contoh: 198501012010011001"
            className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Mata Pelajaran *</label>
          <input
            type="text"
            name="subjects"
            required
            value={formValues.subjects || ""}
            onChange={handleChange}
            placeholder="Contoh: Matematika, Fisika"
            className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900"
          />
          <p className="text-xs text-stone-400 mt-1">Pisahkan dengan koma jika lebih dari satu.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">No. HP</label>
            <input
              type="text"
              name="phone"
              value={formValues.phone || ""}
              onChange={handleChange}
              placeholder="0812..."
              className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formValues.email || ""}
              onChange={handleChange}
              placeholder="guru@sekolah.sch.id"
              className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked
            className="rounded border-stone-300 text-emerald-900 focus:ring-emerald-900"
          />
          <label className="text-xs font-medium text-stone-700 uppercase">Guru Aktif</label>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 bg-emerald-900 text-white rounded-md text-sm font-medium hover:bg-emerald-800 transition disabled:opacity-50"
        >
          {isPending ? "Memproses..." : "Tambah Guru"}
        </button>
      </fieldset>
    </form>
  );
}
