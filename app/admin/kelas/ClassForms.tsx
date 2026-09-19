"use client";

import { useActionState, useEffect } from "react";
import { createSchoolClassAction, deleteSchoolClassAction, toggleSchoolClassStatusAction } from "./kelas-actions";
import { createDepartmentAction, deleteDepartmentAction, toggleDepartmentStatusAction } from "./jurusan-actions";
import { useToast } from "@/lib/ToastContext";

export function ClassForms({ initialDepartments, initialClasses }: { initialDepartments: any[]; initialClasses: any[] }) {
  const { showError, showSuccess } = useToast();
  const [state, formAction, isPending] = useActionState(
    createSchoolClassAction,
    { success: false, message: "" }
  );

  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteSchoolClassAction,
    { success: false, message: "" }
  );

  const [toggleState, toggleAction, togglePending] = useActionState(
    toggleSchoolClassStatusAction,
    { success: false, message: "" }
  );

  const [deptState, deptAction, deptPending] = useActionState(
    createDepartmentAction,
    { success: false, message: "" }
  );

  const [delDeptState, delDeptAction, delDeptPending] = useActionState(
    deleteDepartmentAction,
    { success: false, message: "" }
  );

  const [toggleDeptState, toggleDeptAction, toggleDeptPending] = useActionState(
    toggleDepartmentStatusAction,
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
  useEffect(() => {
    if (deptState.message) {
      if (deptState.success) showSuccess(deptState.message);
      else showError(deptState.message);
    }
  }, [deptState, showError, showSuccess]);
  useEffect(() => {
    if (delDeptState.message) {
      if (delDeptState.success) showSuccess(delDeptState.message);
      else showError(delDeptState.message);
    }
  }, [delDeptState, showError, showSuccess]);
  useEffect(() => {
    if (toggleDeptState.message) {
      if (toggleDeptState.success) showSuccess(toggleDeptState.message);
      else showError(toggleDeptState.message);
    }
  }, [toggleDeptState, showError, showSuccess]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="flex flex-col gap-6 lg:col-span-1">
        <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6">
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

        <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6">
          <h2 className="text-base font-semibold text-stone-900 mb-4">Tambah Jurusan</h2>
          <form action={deptAction} className="flex flex-col gap-4">
            <fieldset disabled={deptPending} className="flex flex-col gap-4 contents">
              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Kode Jurusan *</label>
                <input type="text" name="code" required maxLength={10} placeholder="Contoh: IPA" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm uppercase" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Nama Jurusan *</label>
                <input type="text" name="name" required maxLength={100} placeholder="Contoh: Ilmu Pengetahuan Alam" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isActive" defaultChecked className="rounded border-stone-300 text-emerald-900 focus:ring-emerald-900" />
                <label className="text-xs font-medium text-stone-700 uppercase">Jurusan Aktif</label>
              </div>
              <button type="submit" disabled={deptPending} className="w-full py-2 bg-emerald-900 text-white rounded-md text-sm font-medium hover:bg-emerald-800 transition disabled:opacity-50">
                {deptPending ? "Memproses..." : "Tambah Jurusan"}
              </button>
            </fieldset>
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:col-span-2">
        <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
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
              {initialClasses.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-stone-400">Belum ada data kelas.</td>
                </tr>
              ) : (
                initialClasses.map((c: any) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 font-semibold text-stone-900">Daftar Jurusan</div>
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 uppercase text-xs text-stone-500">
              <tr>
                <th className="px-6 py-3">Kode</th>
                <th className="px-6 py-3">Nama Jurusan</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {initialDepartments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-stone-400">Belum ada data jurusan.</td>
                </tr>
              ) : (
                initialDepartments.map((d: any) => (
                  <tr key={d.id}>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-900">{d.code}</td>
                    <td className="px-6 py-4">{d.name}</td>
                    <td className="px-6 py-4">
                      <form action={toggleDeptAction}>
                        <input type="hidden" name="id" value={d.id} />
                        <button type="submit" disabled={toggleDeptPending} className={`px-2 py-1 text-xs rounded-full disabled:opacity-50 ${d.isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>
                          {d.isActive ? "Aktif" : "Nonaktif"}
                        </button>
                      </form>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={delDeptAction}>
                        <input type="hidden" name="id" value={d.id} />
                        <button type="submit" disabled={delDeptPending} className="text-red-600 font-medium disabled:opacity-50">Hapus</button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
