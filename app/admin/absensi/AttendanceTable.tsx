"use client";

type StudentRow = {
  id: number;
  name: string;
  nis: string | null;
  avatarUrl: string | null;
  existing: { status: string; note: string | null } | null;
};

export default function AttendanceTable({
  students,
}: {
  classId: number;
  students: StudentRow[];
  selectedDate: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Siswa</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">NIS</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Status Kehadiran</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {students.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-stone-400">Tidak ada siswa di kelas ini.</td></tr>
              ) : students.map((s) => {
                const status = s.existing?.status;
                let badgeStyle = "bg-stone-100 text-stone-600 border-stone-200";
                if (status === "HADIR") badgeStyle = "bg-emerald-50 text-emerald-600 border-emerald-200";
                else if (status === "SAKIT") badgeStyle = "bg-amber-50 text-amber-600 border-amber-200";
                else if (status === "IZIN") badgeStyle = "bg-blue-50 text-blue-600 border-blue-200";
                else if (status === "ALPA") badgeStyle = "bg-red-50 text-red-600 border-red-200";

                return (
                  <tr key={s.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {s.avatarUrl ? <img src={s.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold">{s.name.charAt(0)}</div>}
                        <span className="font-medium text-stone-900 text-sm">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-500">{s.nis ?? "-"}</td>
                    <td className="px-4 py-3">
                      {status ? (
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold border ${badgeStyle}`}>
                          {status}
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold border bg-stone-100 text-stone-500 border-stone-200">
                          Belum ditetapkan
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-600">
                      {s.existing?.note || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
