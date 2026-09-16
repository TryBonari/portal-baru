"use client";

import { useActionState, useEffect } from "react";
import { createSchoolClassAction, deleteSchoolClassAction, toggleSchoolClassStatusAction } from "./kelas-actions";
import { useToast } from "@/lib/ToastContext";

export function ClassForms({ initialDepartments, initialClasses }: { initialDepartments: any[]; initialClasses: any[] }) {
  const { showError, showSuccess } = useToast();
  const [state, formAction, isPending] = useActionState(
    async (prev: any, fd: FormData) => createSchoolClassAction(prev, fd),
    { success: false, message: "" }
  );

  const [deleteState, deleteAction, deletePending] = useActionState(
    async (prev: any, fd: FormData) => deleteSchoolClassAction(prev, fd),
    { success: false, message: "" }
  );

  const [toggleState, toggleAction, togglePending] = useActionState(
    async (prev: any, fd: FormData) => toggleSchoolClassStatusAction(prev, fd),
    { success: false, message: "" }
  );

  useEffect(() => {
    if (state.message) {
      if (state.success) showSuccess(state.message);
      else showError(state.message);
    }
  }, [state, showError, showSuccess]);
  useEffect(() => {
    if (deleteState.message) {
      if (deleteState.success) showSuccess(deleteState.message);
      else showError(deleteState.message);
    }
  }, [deleteState, showError, showSuccess]);
  useEffect(() => {
    if (toggleState.message) {
      if (toggleState.success) showSuccess(toggleState.message);
      else showError(toggleState.message);
    }
  }, [toggleState, showError, showSuccess]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 lg:col-span-1">
        <h2 className="text-base font-semibold text-stone-900 mb-4">Tambah Kelas</h2>
        <form action={formAction} className="flex flex-col gap-4">
          <fieldset disabled={isPending} className="flex flex-col gap-4 contents">
            <div>
              <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Tingkat *</label>
              <select name="grade" required className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white">
                <option value="X">X</option>
                <option value="XI">XI</option>
                <option value="XII">XII</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Nomor Kelas *</label>
              <input type="number" name="number" required min="1" max="20" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Jurusan (Opsional)</label>
              <select name="departmentId" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white">
                <option value="">-- Tanpa Jurusan --</option>
                {initialDepartments.map((d) => (
                  <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="isActive" defaultChecked className="rounded border-stone-300 text-emerald-900 focus:ring-emerald-900" />
              <label className="text-xs font-medium text-stone-700 uppercase">Kelas Aktif</label>
            </div>
            <button type="submit" disabled={isPending} className="w-full py-2 bg-emerald-900 text-white rounded-md text-sm font-medium hover:bg-emerald-800 transition disabled:opacity-50">
              {isPending ? "Memproses..." : "Tambah Kelas"}
            </button>
          </fieldset>
        </form>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden lg:col-span-2">
        <div className="px-6 py-4 border-b border-stone-200 font-semibold text-stone-900">Daftar Kelas</div>
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 uppercase text-xs text-stone-500">
            <tr>
              <th className="px-6 py-3">Nama Rombel</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {initialClasses.map((c: any) => (
              <tr key={c.id}>
                <td className="px-6 py-4 font-mono font-bold text-emerald-900">{c.grade} {c.department?.code} {c.number}</td>
                <td className="px-6 py-4">
                  <form action={toggleAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" disabled={togglePending} className={`px-2 py-1 text-xs rounded-full disabled:opacity-50 ${c.isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>
                      {c.isActive ? "Aktif" : "Nonaktif"}
                    </button>
                  </form>
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" disabled={deletePending} className="text-red-600 font-medium disabled:opacity-50">Hapus</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
