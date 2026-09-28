"use client";

import { useState, useTransition } from "react";
import { saveSPPSetting } from "./actions";
import { useToast } from "@/lib/ToastContext";

interface SPPFormProps {
  classes: any[];
}

export default function SPPForm({ classes }: SPPFormProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const { showSuccess, showError } = useToast();

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    const selectedClass = classes.find((c) => c.id.toString() === classId);
    if (selectedClass?.sppSetting) {
      setAmount(selectedClass.sppSetting.amount.toString());
    } else {
      setAmount("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await saveSPPSetting(null, formData);
      if (result.success) {
        showSuccess(result.message);
      } else {
        showError(result.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700">Kelas</label>
        <select
          name="classId"
          required
          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={selectedClassId}
          onChange={(e) => handleClassChange(e.target.value)}
        >
          <option value="">Pilih Kelas</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id.toString()}>
              {c.grade} - {c.number} {c.department?.code}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700">Jumlah SPP (Rp)</label>
        <input
          type="number"
          name="amount"
          required
          min="0"
          step="1000"
          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Contoh: 250000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending || !selectedClassId}
          className="w-full bg-emerald-900 text-white font-medium py-2 px-4 rounded-md hover:bg-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Menyimpan..." : "Simpan Pengaturan SPP"}
        </button>
      </div>
    </form>
  );
}
