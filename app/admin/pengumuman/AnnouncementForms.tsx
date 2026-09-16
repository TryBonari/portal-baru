"use client";

import { useActionState, useEffect } from "react";
import { createAnnouncementAction, deleteAnnouncementAction } from "./actions";
import { useToast } from "@/lib/ToastContext";

export function CreateAnnouncementForm() {
  const { showError, showSuccess } = useToast();
  const [state, formAction, isPending] = useActionState(
    async (prev: any, fd: FormData) => createAnnouncementAction(prev, fd),
    { success: false, message: "" }
  );

  useEffect(() => {
    if (state?.message) {
      if (state.success) showSuccess(state.message);
      else showError(state.message);
    }
  }, [state, showError, showSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <fieldset disabled={isPending} className="flex flex-col gap-4 contents">
        <div>
          <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Judul</label>
          <input type="text" name="title" required maxLength={150} placeholder="Maksimal 150 karakter" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Pesan</label>
          <textarea name="content" required maxLength={5000} rows={4} placeholder="Maksimal 5000 karakter" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Upload Gambar (Opsional, Max 2MB - JPG/PNG/WebP)</label>
          <input type="file" name="image" accept="image/jpeg,image/png,image/webp" className="w-full text-sm text-stone-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200" />
        </div>
        <button type="submit" disabled={isPending} className="w-full py-2 bg-emerald-900 text-white rounded-md text-sm font-medium hover:bg-emerald-800 transition disabled:opacity-50">
          {isPending ? "Memproses..." : "Post Pengumuman"}
        </button>
      </fieldset>
    </form>
  );
}

export function DeleteAnnouncementButton({ id }: { id: number }) {
  const { showError, showSuccess } = useToast();
  const [state, formAction, isPending] = useActionState(
    async (prev: any, fd: FormData) => deleteAnnouncementAction(prev, fd),
    { success: false, message: "" }
  );

  useEffect(() => {
    if (state?.message) {
      if (state.success) showSuccess(state.message);
      else showError(state.message);
    }
  }, [state, showError, showSuccess]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={isPending} className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50">
        {isPending ? "..." : "Hapus"}
      </button>
    </form>
  );
}
