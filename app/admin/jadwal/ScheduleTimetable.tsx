"use client";

import { useState } from "react";
import { deleteSchedule } from "./jadwal-actions";

interface ScheduleItem {
  id: number;
  classId: number;
  subjectId: number;
  teacherId: number;
  day: string;
  startTime: string;
  endTime: string;
  class: {
    grade: string;
    number: number;
    department?: {
      code: string;
      name: string;
    } | null;
  };
  subject: {
    name: string;
    code?: string | null;
  };
  teacher: {
    name: string;
  };
}

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export function ScheduleTimetable({ schedules }: { schedules: ScheduleItem[] }) {
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (selectedSchedule) {
      await deleteSchedule(selectedSchedule.id);
      setIsDeleting(false);
      setSelectedSchedule(null);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {DAYS.map((day) => {
          const daySchedules = schedules
            .filter((s) => s.day.toLowerCase() === day.toLowerCase())
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div key={day} className="bg-stone-50 border border-stone-200 rounded-lg flex flex-col min-h-[300px]">
              <div className="bg-white border-b border-stone-200 px-4 py-3 rounded-t-lg font-bold text-stone-800 text-center uppercase tracking-wider text-xs">
                {day}
              </div>
              <div className="p-3 flex flex-col gap-2 flex-1">
                {daySchedules.length === 0 ? (
                  <div className="text-center text-xs text-stone-400 my-auto py-8">
                    Tidak ada jadwal
                  </div>
                ) : (
                  daySchedules.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedSchedule(item)}
                      className="text-left bg-white border border-stone-200 hover:border-emerald-600 hover:shadow-sm rounded-md p-2.5 transition flex flex-col gap-1 w-full group"
                    >
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded w-fit">
                        {item.startTime} - {item.endTime}
                      </span>
                      <span className="text-sm font-bold text-stone-800 group-hover:text-emerald-900 line-clamp-2">
                        {item.subject.name}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base">Detail Jadwal Pelajaran</h3>
              <button
                type="button"
                onClick={() => setSelectedSchedule(null)}
                className="text-stone-400 hover:text-stone-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 text-sm">
              <div>
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">Mata Pelajaran</span>
                <span className="font-bold text-stone-900 text-base">
                  {selectedSchedule.subject.name} {selectedSchedule.subject.code ? `(${selectedSchedule.subject.code})` : ""}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">Hari</span>
                  <span className="font-semibold text-stone-800">{selectedSchedule.day}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">Waktu</span>
                  <span className="font-semibold text-stone-800">
                    {selectedSchedule.startTime} - {selectedSchedule.endTime}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">Guru Pengampu</span>
                <span className="font-semibold text-stone-800">{selectedSchedule.teacher.name}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">Kelas</span>
                <span className="font-semibold text-stone-800">
                  {selectedSchedule.class.grade} {selectedSchedule.class.department?.code} {selectedSchedule.class.number}
                </span>
              </div>
            </div>
            <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsDeleting(true)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
              >
                Hapus Jadwal
              </button>
              <button
                type="button"
                onClick={() => setSelectedSchedule(null)}
                className="px-4 py-2 bg-stone-200 text-stone-700 text-xs font-semibold rounded-md hover:bg-stone-300 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full overflow-hidden border border-stone-200 p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-stone-900 text-lg mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-stone-600 mb-6">Apakah Anda yakin ingin menghapus jadwal ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 text-stone-700 text-xs font-semibold rounded-md hover:bg-stone-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700 transition"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
