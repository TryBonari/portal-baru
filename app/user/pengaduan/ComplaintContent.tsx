"use client";

import { useState, useActionState, useEffect } from "react";
import { useToast } from "@/lib/ToastContext";
import { createComplaintAction } from "./actions";

type Teacher = {
  id: number;
  name: string;
  subjects: string | null;
};

type Complaint = {
  id: number;
  subject: string;
  message: string;
  createdAt: Date;
  teacher: {
    name: string;
  };
};

export function ComplaintContent({ 
  teachers, 
  studentId, 
  initialComplaints 
}: { 
  teachers: Teacher[]; 
  studentId: number; 
  initialComplaints: any[] 
}) {
  const { showError, showSuccess } = useToast();
  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  
  const [state, formAction, isPending] = useActionState(createComplaintAction, { success: false, message: "" });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        showSuccess(state.message);
        setSelectedTeacher(null);
      } else {
        showError(state.message);
      }
    }
  }, [state, showSuccess, showError]);

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    (t.subjects && t.subjects.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-stone-900">Cari Guru</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama guru atau mata pelajaran..."
            className="w-full px-4 py-2 border border-stone-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-900 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2">
          {filteredTeachers.length === 0 ? (
            <p className="text-sm text-center text-stone-400 py-4">Guru tidak ditemukan.</p>
          ) : (
            filteredTeachers.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTeacher(t)}
                className={`flex flex-col text-left p-3 rounded-md border transition cursor-pointer ${
                  selectedTeacher?.id === t.id 
                  ? "bg-emerald-50 border-emerald-200" 
                  : "bg-white border-stone-200 hover:border-emerald-200"
                }`}
              >
                <span className="font-semibold text-sm text-stone-900">{t.name}</span>
                <span className="text-xs text-stone-500">{t.subjects || "-"}</span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {selectedTeacher ? (
          <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h2 className="text-base font-semibold text-stone-900">Kirim Pengaduan</h2>
              <button onClick={() => setSelectedTeacher(null)} className="text-xs text-stone-500 hover:text-stone-700 cursor-pointer">Batal</button>
            </div>
            <div className="bg-emerald-50 px-3 py-2 rounded-md text-xs text-emerald-800">
              Menghubungi: <span className="font-bold">{selectedTeacher.name}</span>
            </div>
            <form action={formAction} className="flex flex-col gap-4">
              <input type="hidden" name="teacherId" value={selectedTeacher.id} />
              <input type="hidden" name="studentId" value={studentId} />
              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Subjek *</label>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="Contoh: Pertanyaan Materi / Masalah Absensi"
                  className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Pesan *</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Tuliskan pesan atau pengaduan Anda di sini..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-900"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2 bg-emerald-900 text-white rounded-md text-sm font-medium hover:bg-emerald-800 transition disabled:opacity-50"
              >
                {isPending ? "Mengirim..." : "Kirim Pengaduan"}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 flex flex-col gap-4">
            <h2 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-2">Riwayat Pengaduan Saya</h2>
            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
              {initialComplaints.length === 0 ? (
                <p className="text-sm text-center text-stone-400 py-8">Anda belum memiliki riwayat pengaduan.</p>
              ) : (
                initialComplaints.map((c) => (
                  <div key={c.id} className="border border-stone-100 rounded-lg p-4 bg-stone-50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-xs text-emerald-800">Kepada: {c.teacher.name}</span>
                      <span className="text-[10px] text-stone-400">{new Date(c.createdAt).toLocaleDateString("id-ID")}</span>
                    </div>
                    <p className="text-sm font-bold text-stone-800">{c.subject}</p>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">{c.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
