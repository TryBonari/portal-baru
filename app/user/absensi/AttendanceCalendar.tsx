"use client";

import { useState } from "react";

type AttendanceRecord = {
  date: string; // YYYY-MM-DD
  status: "HADIR" | "SAKIT" | "IZIN" | "ALPA";
  note?: string | null;
};

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DAYS_HEADER = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function AttendanceCalendar({
  attendances,
}: {
  attendances: AttendanceRecord[];
}) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  // Map attendances for quick O(1) lookup: "YYYY-MM-DD" -> AttendanceRecord
  const attMap = new Map<string, AttendanceRecord>();
  for (const item of attendances) {
    const dStr = item.date.slice(0, 10);
    attMap.set(dStr, item);
  }

  // Calculate days in the current month
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Summary counts for the selected month
  let hadirCount = 0;
  let sakitCount = 0;
  let izinCount = 0;
  let alpaCount = 0;

  for (let day = 1; day <= totalDays; day++) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const record = attMap.get(dateKey);
    if (record) {
      if (record.status === "HADIR") hadirCount++;
      else if (record.status === "SAKIT") sakitCount++;
      else if (record.status === "IZIN") izinCount++;
      else if (record.status === "ALPA") alpaCount++;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full overflow-hidden border border-stone-200 p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-stone-900 text-lg mb-2">Detail Kehadiran</h3>
            <div className="text-sm text-stone-600 mb-6 space-y-2">
              <p>Tanggal: <strong>{new Date(selectedRecord.date).toLocaleDateString("id-ID", { dateStyle: "full" })}</strong></p>
              <p>Status: <strong className={`uppercase ${selectedRecord.status === 'HADIR' ? 'text-[#16A34A]' : selectedRecord.status === 'SAKIT' ? 'text-[#D97706]' : selectedRecord.status === 'IZIN' ? 'text-[#2563EB]' : 'text-[#DC2626]'}`}>{selectedRecord.status}</strong></p>
              {selectedRecord.note && <p>Catatan: <em>{selectedRecord.note}</em></p>}
            </div>
            <button
              type="button"
              onClick={() => setSelectedRecord(null)}
              className="w-full px-4 py-2 bg-stone-100 text-stone-700 text-sm font-semibold rounded-md hover:bg-stone-200 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Hadir</span>
          <span className="text-2xl font-black text-emerald-900 mt-1">{hadirCount}</span>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Sakit</span>
          <span className="text-2xl font-black text-blue-900 mt-1">{sakitCount}</span>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Izin</span>
          <span className="text-2xl font-black text-amber-900 mt-1">{izinCount}</span>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Alpa</span>
          <span className="text-2xl font-black text-red-900 mt-1">{alpaCount}</span>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden p-6 flex flex-col gap-6">
        {/* Month Navigator */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">
            {MONTHS[currentMonth]} {currentYear}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 border border-stone-300 rounded-md hover:bg-stone-50 text-stone-700 text-sm font-semibold transition"
            >
              Bulan Lalu
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 border border-stone-300 rounded-md hover:bg-stone-50 text-stone-700 text-sm font-semibold transition"
            >
              Bulan Depan
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {DAYS_HEADER.map((day, idx) => (
            <div
              key={day}
              className={`text-xs font-bold uppercase tracking-wider py-2 ${
                idx === 0 ? "text-red-600" : "text-stone-500"
              }`}
            >
              {day}
            </div>
          ))}

          {/* Empty cells before month start */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 sm:h-20 rounded-md bg-stone-50/50 border border-transparent" />
          ))}

          {/* Actual days */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
            const record = attMap.get(dateKey);

            let bgClass = "bg-stone-50 border-stone-200 text-stone-700 cursor-default";
            let statusBadge = null;

            if (record) {
              bgClass = "cursor-pointer transition ";
              if (record.status === "HADIR") {
                bgClass += "bg-[#16A34A] text-white shadow-sm border-[#16A34A]";
                statusBadge = "Hadir";
              } else if (record.status === "SAKIT") {
                bgClass += "bg-[#D97706] text-white shadow-sm border-[#D97706]";
                statusBadge = "Sakit";
              } else if (record.status === "IZIN") {
                bgClass += "bg-[#2563EB] text-white shadow-sm border-[#2563EB]";
                statusBadge = "Izin";
              } else if (record.status === "ALPA") {
                bgClass += "bg-[#DC2626] text-white shadow-sm border-[#DC2626]";
                statusBadge = "Alpa";
              }
            }

            return (
              <div
                key={dayNum}
                onClick={() => record && setSelectedRecord(record)}
                className={`h-14 sm:h-20 border rounded-md p-1.5 sm:p-2 flex flex-col justify-between ${bgClass}`}
              >
                <span className="text-xs font-bold leading-none">{dayNum}</span>
                {statusBadge && (
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider block truncate">
                    {statusBadge}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-600 pt-4 border-t border-stone-100">
          <span className="font-bold text-stone-700">Keterangan:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#16A34A] inline-block" />
            <span>Hadir</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#D97706] inline-block" />
            <span>Sakit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#2563EB] inline-block" />
            <span>Izin</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#DC2626] inline-block" />
            <span>Alpa</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-stone-100 border border-stone-300 inline-block" />
            <span>Tidak ada data / Libur</span>
          </div>
        </div>
      </div>
    </div>
  );
}
