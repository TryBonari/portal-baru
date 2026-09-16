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
      <button type="submit" disabled={isPending} className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50">
        {isPending ? "..." : "Hapus"}
      </button>
    </form>
  );
}
