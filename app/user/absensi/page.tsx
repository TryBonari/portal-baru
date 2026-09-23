import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AttendanceCalendar from "./AttendanceCalendar";

export const dynamic = "force-dynamic";

export default async function UserAbsensiPage() {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("student_session")?.value;
  if (!sessionUserId) redirect("/login");

  const userId = parseInt(sessionUserId, 10);

  const user = await prisma.user.findFirst({
    where: { id: userId, role: "STUDENT" },
    include: {
      student: {
        include: { class: { include: { department: true } } },
      },
    },
  });

  if (!user || !user.student) redirect("/login");

  const student = user.student;

  if (!student.classId) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">Kehadiran Saya</h1>
          <p className="text-sm text-stone-600">Riwayat kehadiran Anda per bulan.</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-lg p-8 text-center text-sm text-stone-500">
          Anda belum terdaftar di kelas mana pun.
        </div>
      </div>
    );
  }

  const attendances = await (prisma as any).attendance.findMany({
    where: { studentId: student.id },
    orderBy: { date: "asc" },
  });

  const classNameText = student.class
    ? `${student.class.grade} ${student.class.department?.code ?? ""} ${student.class.number}`.trim()
    : "-";

  // Serialize: Attendance.date is DateTime, need reliable string for the client filter
  const serializedAttendances = attendances.map((a: any) => {
    const d = new Date(a.date);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return {
      date: dateStr,
      status: a.status as "HADIR" | "SAKIT" | "IZIN" | "ALPA",
      note: a.note as string | null,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-stone-900">Kehadiran Saya</h1>
        <p className="text-sm text-stone-600">
          Kelas <span className="font-mono font-bold text-emerald-900">{classNameText}</span> — {student.name}
        </p>
      </div>

      {serializedAttendances.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-lg p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-xl">🗓️</div>
          <p className="text-sm font-semibold text-stone-800">Belum ada data kehadiran</p>
          <p className="text-xs text-stone-500 mt-1">Data akan muncul otomatis setelah admin mengimpor absensi dari Excel.</p>
        </div>
      ) : (
        <AttendanceCalendar attendances={serializedAttendances} />
      )}
    </div>
  );
}
