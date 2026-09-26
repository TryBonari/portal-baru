"use client";

import { useState, useRef } from "react";
import { exportGradeExcel, importGradeExcel } from "./grade-actions";
import { useToast } from "@/lib/ToastContext";

interface GradeExcelControlsProps {
  classId: number;
  subjectId?: number | null;
  semesterId?: number | null;
  academicYearId?: number | null;
}

export default function GradeExcelControls({
  classId,
  subjectId = null,
  semesterId = null,
  academicYearId = null,
}: GradeExcelControlsProps) {
  const { showSuccess, showError } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [unregisteredStudents, setUnregisteredStudents] = useState<string[]>([]);

  async function handleExport() {
    if (!subjectId) {
      showError("Mata pelajaran belum dipilih.");
      return;
    }
    setIsExporting(true);
    try {
      const { base64, filename } = await exportGradeExcel(classId, subjectId);
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
      showSuccess("File nilai berhasil diunduh.");
    } catch (err: unknown) {
      const error = err as Error;
      showError(error.message || "Gagal mengekspor data.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!subjectId || !semesterId || !academicYearId) {
      showError("Pilih Mata Pelajaran, Semester, dan Tahun Ajaran terlebih dahulu sebelum mengimpor nilai.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const buffer = event.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(buffer);
        let binary = '';
        uint8Array.forEach((byte) => binary += String.fromCharCode(byte));
        const base64Data = btoa(binary);

        const result = await importGradeExcel(
          classId,
          subjectId,
          semesterId,
          academicYearId,
          base64Data
        );

        if (result.success) {
          showSuccess(result.message);
          const notReg = result.notRegistered || [];
          setUnregisteredStudents(notReg);
          if (notReg.length > 0) {
            setTimeout(() => {
              showError(`Ditemukan ${notReg.length} data tidak terdaftar di kelas ini.`);
            }, 100);
          }
        } else {
          showError(result.message);
          setUnregisteredStudents(result.notRegistered || []);
        }
      } catch (err: unknown) {
        const error = err as Error;
        showError(error.message || "Gagal mengimpor file. Pastikan format sesuai.");
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isExporting}
          onClick={handleExport}
          className="text-sm font-medium px-4 py-2 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-50"
        >
          {isExporting ? "Menyiapkan file..." : "Export Excel"}
        </button>

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
          className="text-sm font-medium px-4 py-2 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-50"
        >
          {isImporting ? "Mengimpor..." : "Import Excel"}
        </button>
      </div>

      {unregisteredStudents.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h4 className="text-xs font-bold text-amber-800 uppercase mb-2">
            Siswa Belum Terdaftar di Kelas Ini:
          </h4>
          <ul className="text-xs text-amber-700 list-disc list-inside space-y-1">
            {unregisteredStudents.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
          <p className="text-xs text-amber-600 mt-2">
            Pastikan nama siswa sesuai dengan daftar siswa yang ada di kelas ini.
          </p>
        </div>
      )}
    </div>
  );
}
