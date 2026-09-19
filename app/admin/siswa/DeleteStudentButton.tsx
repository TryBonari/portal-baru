"use client";

import { useActionState, useEffect } from "react";
import { deleteStudentAction } from "../accescode/actions";
import { useToast } from "@/lib/ToastContext";

export function DeleteStudentButton({ id }: { id: number }) {
  const { showError, showSuccess } = useToast();
  const [state, formAction, isPending] = useActionState(
    async (prev: any, fd: FormData) => deleteStudentAction(prev, fd),
    { success: false, message: "" }
  );

  useEffect(() => {
    if (state.message) {
      if (state.success) showSuccess(state.message);
      else showError(state.message);
    }
  }, [state, showSuccess, showError]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={isPending} className="w-full py-1.5 bg-red-50 text-xs font-semibold text-red-700 hover:bg-red-100 rounded-md transition text-center disabled:opacity-50">
        {isPending ? "Memproses..." : "Hapus"}
      </button>
    </form>
  );
}
