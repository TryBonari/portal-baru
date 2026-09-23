"use client";

import { createSchedule, createSubject } from "./jadwal-actions";
import { useState } from "react";

export function JadwalForm({ 
  classes, 
  subjects, 
  teachers 
}: { 
  classes: any[], 
  subjects: any[], 
  teachers: any[] 
}) {
  return (
    <form action={createSchedule} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Kelas</label>
          <select 
            name="classId" 
            required
            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.grade} {c.department?.code} {c.number}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Mata Pelajaran</label>
          <select 
            name="subjectId" 
            required
            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name} {s.code ? `(${s.code})` : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Guru</label>
          <select 
            name="teacherId" 
            required
            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Hari</label>
          <select 
            name="day" 
            required
            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="Senin">Senin</option>
            <option value="Selasa">Selasa</option>
            <option value="Rabu">Rabu</option>
            <option value="Kamis">Kamis</option>
            <option value="Jumat">Jumat</option>
            <option value="Sabtu">Sabtu</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Jam Mulai</label>
          <input 
            type="time" 
            name="startTime" 
            required 
            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Jam Selesai</label>
          <input 
            type="time" 
            name="endTime" 
            required 
            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>
      <button 
        type="submit"
        className="bg-emerald-900 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-emerald-800 transition shadow-sm"
      >
        Tambah Jadwal
      </button>
    </form>
  );
}

export function SubjectForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const result = await createSubject(formData);
    setLoading(false);
    
    if (result?.error) {
      setError(result.error);
    } else {
      (document.getElementById('subject-form') as HTMLFormElement).reset();
    }
  }

  return (
    <form id="subject-form" action={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Kode Mapel</label>
          <input 
            type="text" 
            name="code" 
            required
            placeholder="Contoh: MTK"
            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Mata Pelajaran</label>
          <input 
            type="text" 
            name="name" 
            required
            placeholder="Contoh: Matematika"
            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>
      <button 
        type="submit"
        disabled={loading}
        className="bg-emerald-900 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-emerald-800 transition shadow-sm disabled:opacity-50"
      >
        {loading ? 'Menambahkan...' : 'Tambah Mata Pelajaran'}
      </button>
    </form>
  );
}
