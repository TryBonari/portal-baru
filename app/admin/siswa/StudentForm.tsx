"use client";

import { useActionState } from "react";
import { createStudentAction } from "../accescode/actions";
import { useToast } from "@/lib/ToastContext";
import { useEffect, useState, useRef } from "react";

type Dept = { id: number; code: string; name: string };
type Cls = { id: number; grade: string; number: number; departmentId: number | null; department: Dept | null };
type Code = { id: number; code: string };

export default function StudentForm({
  unusedCodes,
  availableClasses,
}: {
  unusedCodes: Code[];
  availableClasses: Cls[];
}) {
  const { showError, showSuccess } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    createStudentAction,
    { success: false, message: "" }
  );

  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        showSuccess(state.message);
        setFormValues({});
        formRef.current?.reset();
      } else {
        showError(state.message);
        if (state.values) setFormValues(state.values);
      }
    }
  }, [state, showError, showSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form action={formAction} ref={formRef} className="flex flex-col gap-4">
      <fieldset disabled={isPending} className="flex flex-col gap-4 contents">
        <div>
          <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Avatar</label>
          <input type="file" name="avatar" accept="image/jpeg,image/png,image/webp" className="w-full text-sm text-stone-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200" />
          <p className="text-xs text-stone-400 mt-1">JPG/PNG/WebP, max 2MB.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Nama Lengkap *</label>
            <input type="text" name="name" required value={formValues.name || ""} onChange={handleChange} placeholder="Contoh: Budi Santoso" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">NIS</label>
            <input type="text" name="nis" maxLength={20} value={formValues.nis || ""} onChange={handleChange} placeholder="Nomor Induk Siswa" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">NISN</label>
            <input type="text" name="nisn" maxLength={20} value={formValues.nisn || ""} onChange={handleChange} placeholder="10 digit" pattern="\d{10}" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Jenis Kelamin</label>
            <select name="gender" value={formValues.gender || ""} onChange={handleChange} className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-900">
              <option value="">-- Pilih --</option>
              <option value="LAKI_LAKI">Laki-laki</option>
              <option value="PEREMPUAN">Perempuan</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Status Siswa</label>
            <select name="status" value={formValues.status || "AKTIF"} onChange={handleChange} className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-900">
              <option value="AKTIF">Aktif</option>
              <option value="LULUS">Lulus</option>
              <option value="NONAKTIF">Tidak Aktif</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Tempat Lahir</label>
            <input type="text" name="birthPlace" maxLength={100} value={formValues.birthPlace || ""} onChange={handleChange} placeholder="Contoh: Jakarta" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Tanggal Lahir</label>
            <input type="date" name="birthDate" value={formValues.birthDate || ""} onChange={handleChange} className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Tahun Masuk</label>
            <input type="number" name="admissionYear" min={2000} max={2100} value={formValues.admissionYear || ""} onChange={handleChange} placeholder="2025" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Access Code *</label>
            <select name="accessCodeId" required value={formValues.accessCodeId || ""} onChange={handleChange} className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-900">
              <option value="">-- Pilih Kode Akses --</option>
              {unusedCodes.map((item) => (
                <option key={item.id} value={item.id}>{item.code}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-stone-200 pt-4 mt-1">
          <label className="block text-xs font-medium text-stone-700 uppercase mb-2">Kelas</label>
          {availableClasses.length === 0 ? (
            <div className="px-3 py-2 border border-amber-200 bg-amber-50 rounded-md text-sm text-amber-800">
              Belum ada kelas terdaftar.
            </div>
          ) : (
            <select name="classId" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-900">
              <option value="">-- Pilih Kelas --</option>
              {availableClasses.map((c) => {
                const letter = c.number >= 1 && c.number <= 26 ? String.fromCharCode(64 + c.number) : String(c.number);
                const label = [c.grade, letter, c.department?.code].filter(Boolean).join(" ");
                return <option key={c.id} value={c.id}>{label}</option>;
              })}
            </select>
          )}
        </div>

        <button type="submit" disabled={isPending} className="mt-2 w-full py-2 bg-emerald-900 text-white rounded-md text-sm font-medium hover:bg-emerald-800 transition disabled:opacity-50">
          {isPending ? "Memproses..." : "Daftarkan Siswa"}
        </button>
      </fieldset>
    </form>
  );
}
