"use client";

import { useActionState } from "react";
import { createSchoolClassAction, toggleSchoolClassStatusAction, deleteSchoolClassAction } from "./kelas-actions";
import { createDepartmentAction, toggleDepartmentStatusAction, deleteDepartmentAction } from "./jurusan-actions";

export function CreateClassForm({ departments }: { departments: { id: number; code: string; name: string }[] }) {
  const [state, formAction, isPending] = useActionState(createSchoolClassAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Tingkat *</label>
        <select name="grade" required className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white" disabled={isPending}>
          <option value="X">X</option>
          <option value="XI">XI</option>
          <option value="XII">XII</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Jurusan</label>
        <select name="departmentId" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white" disabled={isPending}>
          <option value="">-- Tanpa Jurusan --</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.code} - {d.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Nomor Rombel *</label>
        <input
          type="number"
          name="number"
          required
          defaultValue={1}
          min={1}
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
          disabled={isPending}
        />
      </div>

      {state?.message && (
        <p className={`text-xs ${state.success ? "text-emerald-600" : "text-red-600"}`}>
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 bg-emerald-900 text-white rounded-md text-sm font-medium hover:bg-emerald-800 disabled:opacity-50"
      >
        {isPending ? "Menyimpan..." : "Simpan Kelas"}
      </button>
    </form>
  );
}

export function ToggleStatusForm({ id, isActive }: { id: number; isActive: boolean }) {
  const [state, formAction, isPending] = useActionState(toggleSchoolClassStatusAction, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isPending}
        className={`px-2 py-1 text-xs rounded-full disabled:opacity-50 ${
          isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"
        }`}
      >
        {isActive ? "Aktif" : "Nonaktif"}
      </button>
      {state?.message && !state.success && (
        <p className="text-[10px] text-red-600 mt-1">{state.message}</p>
      )}
    </form>
  );
}

export function DeleteClassForm({ id }: { id: number }) {
  const [state, formAction, isPending] = useActionState(deleteSchoolClassAction, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isPending}
        className="text-red-600 font-medium disabled:opacity-50"
      >
        {isPending ? "Menghapus..." : "Hapus"}
      </button>
      {state?.message && !state.success && (
        <p className="text-[10px] text-red-600 mt-1">{state.message}</p>
      )}
    </form>
  );
}

export function CreateDepartmentForm() {
  const [state, formAction, isPending] = useActionState(createDepartmentAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Kode Jurusan *</label>
        <input
          type="text"
          name="code"
          required
          maxLength={10}
          placeholder="Contoh: IPA"
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm uppercase"
          disabled={isPending}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Nama Jurusan *</label>
        <input
          type="text"
          name="name"
          required
          maxLength={100}
          placeholder="Contoh: Ilmu Pengetahuan Alam"
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
          disabled={isPending}
        />
      </div>

      {state?.message && (
        <p className={`text-xs ${state.success ? "text-emerald-600" : "text-red-600"}`}>
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 bg-emerald-900 text-white rounded-md text-sm font-medium hover:bg-emerald-800 disabled:opacity-50"
      >
        {isPending ? "Menyimpan..." : "Simpan Jurusan"}
      </button>
    </form>
  );
}

export function ToggleDepartmentStatusForm({ id, isActive }: { id: number; isActive: boolean }) {
  const [state, formAction, isPending] = useActionState(toggleDepartmentStatusAction, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isPending}
        className={`px-2 py-1 text-xs rounded-full disabled:opacity-50 ${
          isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"
        }`}
      >
        {isActive ? "Aktif" : "Nonaktif"}
      </button>
      {state?.message && !state.success && (
        <p className="text-[10px] text-red-600 mt-1">{state.message}</p>
      )}
    </form>
  );
}

export function DeleteDepartmentForm({ id }: { id: number }) {
  const [state, formAction, isPending] = useActionState(deleteDepartmentAction, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isPending}
        className="text-red-600 font-medium disabled:opacity-50"
      >
        {isPending ? "Menghapus..." : "Hapus"}
      </button>
      {state?.message && !state.success && (
        <p className="text-[10px] text-red-600 mt-1">{state.message}</p>
      )}
    </form>
  );
}
