"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { getSafeErrorMessage } from "./error-helper";

interface ToastContextType {
  showError: (error: unknown) => void;
  showSuccess: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const showError = useCallback((error: unknown) => {
    console.error("[Logged Server Error]:", error);
    setToast({ message: getSafeErrorMessage(error), type: "error" });
  }, []);

  const showSuccess = useCallback((message: string) => {
    setToast({ message, type: "success" });
  }, []);

  const closeToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showError, showSuccess }}>
      {children}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white border border-stone-200 rounded-lg shadow-lg p-4 flex flex-col gap-2 transition-all animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${toast.type === "error" ? "bg-red-600" : "bg-emerald-600"}`} />
              <h4 className="text-sm font-semibold text-stone-900">
                {toast.type === "error" ? "Pemberitahuan Kesalahan" : "Berhasil"}
              </h4>
            </div>
            <button onClick={closeToast} className="text-xs text-stone-400 hover:text-stone-600 font-bold px-1">
              ✕
            </button>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">{toast.message}</p>
          <div className="flex justify-end mt-1">
            <button
              onClick={closeToast}
              className="text-xs font-medium px-3 py-1 bg-stone-100 text-stone-700 rounded hover:bg-stone-200 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast harus digunakan di dalam ToastProvider");
  return context;
}
