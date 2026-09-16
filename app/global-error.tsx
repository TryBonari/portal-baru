"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error Boundary]:", error);
  }, [error]);

  return (
    <html>
      <body className="bg-stone-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white border border-stone-200 rounded-lg shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-3">Sistem Terkendala</h1>
          <p className="text-sm text-stone-600 mb-8 leading-relaxed">
            Terjadi kesalahan fatal pada aplikasi. Tim teknis akan segera memperbaikinya.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-stone-900 text-white rounded-md text-sm font-semibold hover:bg-stone-800 transition"
          >
            Muat Ulang Aplikasi
          </button>
        </div>
      </body>
    </html>
  );
}
