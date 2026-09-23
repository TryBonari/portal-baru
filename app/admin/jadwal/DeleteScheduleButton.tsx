"use client";

import { deleteSchedule } from "./jadwal-actions";

export function DeleteScheduleButton({ id }: { id: number }) {
  return (
    <button 
      onClick={() => {
        if(confirm("Hapus jadwal ini?")) {
          deleteSchedule(id);
        }
      }}
      className="text-red-600 hover:text-red-800 text-sm font-medium"
    >
      Hapus
    </button>
  );
}
