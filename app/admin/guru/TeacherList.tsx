"use client";

import { useActionState, useEffect, useState } from "react";
import { toggleTeacherStatusAction, deleteTeacherAction } from "./teacher-actions";
import { TeacherEditForm } from "./TeacherEditForm";
import { useToast } from "@/lib/ToastContext";

type Complaint = {
  id: number;
  subject: string;
  message: string;
  createdAt: Date;
  student: {
    name: string;
    nis: string | null;
  };
};

type Teacher = {
  id: number;
  teacherCode: string | null;
  name: string;
  subjects: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  complaints?: Complaint[];
};

export function TeacherList({ teachers }: { teachers: Teacher[] }) {
  const { showError, showSuccess } = useToast();
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [viewingInbox, setViewingInbox] = useState<Teacher | null>(null);

  const [toggleState, toggleAction, togglePending] = useActionState(toggleTeacherStatusAction, { success: false, message: "" });
  const [deleteState, deleteAction, deletePending] = useActionState(deleteTeacherAction, { success: false, message: "" });

  useEffect(() => {
    if (toggleState.message) {
      if (toggleState.success) showSuccess(toggleState.message);
      else showError(toggleState.message);
    }
  }, [toggleState, showError, showSuccess]);
  useEffect(() => {
    if (deleteState.message) {
      if (deleteState.success) showSuccess(deleteState.message);
      else showError(deleteState.message);
    }
  }, [deleteState, showError, showSuccess]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-stone-600">
          <thead className="bg-stone-50 text-xs font-semibold uppercase text-stone-500 border-b border-stone-200">
            <tr>
              <th className="px-6 py-3 whitespace-nowrap">Inbox</th>
              <th className="px-6 py-3 whitespace-nowrap">Nama Guru</th>
              <th className="px-6 py-3 whitespace-nowrap">Kode / NIP</th>
              <th className="px-6 py-3 whitespace-nowrap">Mata Pelajaran</th>
              <th className="px-6 py-3 whitespace-nowrap">Kontak</th>
              <th className="px-6 py-3 whitespace-nowrap">Status</th>
              <th className="px-6 py-3 whitespace-nowrap text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {teachers.map((t) => (
              <tr key={t.id} className="hover:bg-stone-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setViewingInbox(t)}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md hover:bg-emerald-100 transition relative cursor-pointer"
                  >
                    Inbox
                    {t.complaints && t.complaints.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {t.complaints.length}
                      </span>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 font-medium text-stone-900 whitespace-nowrap">{t.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{t.teacherCode || "-"}</td>
                <td className="px-6 py-4">
                  {t.subjects ? (
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {t.subjects.split(",").map((s) => (
                        <span key={s.trim()} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div>{t.phone || "-"}</div>
                  <div className="text-xs text-stone-400">{t.email || ""}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <form action={toggleAction}>
                    <input type="hidden" name="id" value={t.id} />
                    <button
                      type="submit"
                      disabled={togglePending}
                      className={`px-2 py-1 rounded-full text-xs font-semibold disabled:opacity-50 ${t.isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"}`}
                    >
                      {t.isActive ? "Aktif" : "Nonaktif"}
                    </button>
                  </form>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex flex-col gap-2 items-stretch min-w-[80px]">
                    <button
                      onClick={() => setEditing(t)}
                      className="w-full py-1.5 bg-stone-100 text-xs font-semibold text-stone-700 hover:bg-stone-200 rounded-md transition text-center"
                    >
                      Edit
                    </button>
                    <form action={deleteAction}>
                      <input type="hidden" name="id" value={t.id} />
                      <button
                        type="submit"
                        disabled={deletePending}
                        className="w-full py-1.5 bg-red-50 text-xs font-semibold text-red-700 hover:bg-red-100 rounded-md transition text-center disabled:opacity-50"
                      >
                        {deletePending ? "Memproses..." : "Hapus"}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <TeacherEditForm teacher={editing} onClose={() => setEditing(null)} />
          </div>
        </div>
      )}

      {viewingInbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-stone-200 rounded-lg shadow-lg flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
              <h3 className="font-semibold text-stone-900 text-sm">
                Inbox Guru: <span className="font-bold">{viewingInbox.name}</span>
              </h3>
              <button onClick={() => setViewingInbox(null)} className="text-sm text-stone-500 hover:text-stone-700 cursor-pointer">
                Tutup
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {!viewingInbox.complaints || viewingInbox.complaints.length === 0 ? (
                <p className="text-sm text-center text-stone-400 py-8">Belum ada pesan masuk untuk guru ini.</p>
              ) : (
                viewingInbox.complaints.map((c) => (
                  <div key={c.id} className="border border-stone-200 rounded-lg p-4 bg-stone-50 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-stone-700">
                        Dari: {c.student.name} {c.student.nis && <span className="font-mono font-normal text-stone-400">({c.student.nis})</span>}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {new Date(c.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-stone-800 mt-1">Subjek: {c.subject}</p>
                    <p className="text-sm text-stone-600 whitespace-pre-wrap border-t border-stone-200 pt-2 mt-1">
                      {c.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
