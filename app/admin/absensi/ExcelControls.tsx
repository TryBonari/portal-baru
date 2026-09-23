"use client";

import { useState, useRef } from "react";
import { exportAttendanceExcel, importAttendanceExcel } from "./excel-actions";
import { useToast } from "@/lib/ToastContext";

export default function ExcelControls({
  classId,
  dateStr,
}: {
  classId: number;
  dateStr: string;
}) {
  const { showSuccess, showError } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [externalData, setExternalData] = useState<string[]>([]);

  async function handleExport() {
    setIsExporting(true);
    try {
      const { base64, filename } = await exportAttendanceExcel(classId, dateStr);
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showSuccess("File absensi berhasil diunduh.");
    } catch (err: any) {
      showError(err.message || "Gagal mengekspor data.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as string;
        const base64 = btoa(
          new Uint8Array(event.target?.result as ArrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        
        // Alternative simple conversion for ArrayBuffer
        const buffer = event.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(buffer);
        let binary = '';
        uint8Array.forEach((byte) => binary += String.fromCharCode(byte));
        const base64Data = btoa(binary);

        const result = await importAttendanceExcel(classId, dateStr, base64Data);
        
        if (result.success) {
          showSuccess(result.message);
          if (result.notInClass.length > 0) {
            setExternalData(result.notInClass);
          } else {
            setExternalData([]);
          }
        }
      } catch (err: any) {
        showError("Gagal mengimpor file. Pastikan format sesuai.");
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="flex flex-col gap-4 bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={isExporting}
          onClick={handleExport}
          className="px-4 py-2 bg-emerald-900 text-white rounded-md text-xs font-semibold hover:bg-emerald-800 disabled:opacity-50"
        >
          {isExporting ? "Menyiapkan file..." : "Download Template (.xlsx)"}
        </button>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={isImporting}
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-md text-xs font-semibold hover:bg-stone-100 disabled:opacity-50"
          >
            {isImporting ? "Mengimpor..." : "Upload Absensi (.xlsx)"}
          </button>
        </div>
      </div>
      
      <p className="text-xs text-stone-400 leading-relaxed">
        Klik Download untuk mendapatkan template dengan daftar nama siswa dan kolom status (dropdown HADIR/SAKIT/IZIN/ALPA). Edit file lalu Upload kembali untuk menyimpan massal.
      </p>

      {externalData.length > 0 && (
        <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h4 className="text-xs font-bold text-amber-800 uppercase mb-2">Siswa Tidak Dikenali / Belum di Kelas Ini:</h4>
          <ul className="text-xs text-amber-700 list-disc list-inside space-y-1">
            {externalData.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
          <p className="text-xs text-amber-600 mt-2">Silakan daftarkan mereka melalui menu Siswa jika memang baru.</p>
        </div>
      )}
    </div>
  );
}
