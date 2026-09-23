import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserScheduleTimetable } from "./UserScheduleTimetable";

export const dynamic = "force-dynamic";

export default async function UserJadwalPage() {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("student_session")?.value;
  if (!sessionUserId) redirect("/login");

  const userId = parseInt(sessionUserId, 10);

  const user = await prisma.user.findFirst({
    where: { id: userId, role: "STUDENT" },
    include: { student: { include: { class: { include: { department: true } } } } },
  });

  if (!user || !user.student) redirect("/login");

  const student = user.student;

  if (!student.classId || !student.class) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">Jadwal Pelajaran</h1>
          <p className="text-sm text-stone-600">Jadwal yang terdaftar untuk kelas Anda.</p>
        </div>
        <div className="rounded-none border border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
          Anda belum terdaftar di kelas mana pun. Silakan hubungi admin.
        </div>
      </div>
    );
  }

  const classNameText =
    `${student.class.grade} ${student.class.department?.code ?? ""} ${student.class.number}`.trim();

  const schedules = await (prisma as any).schedule.findMany({
    where: { classId: student.classId },
    include: { subject: true, teacher: true },
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });

  if (schedules.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">Jadwal Pelajaran</h1>
          <p className="text-sm text-stone-600">
            Kelas <span className="font-mono font-bold text-emerald-900">{classNameText}</span>
          </p>
        </div>
        <div className="rounded-none border border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
          Belum ada jadwal untuk kelas Anda.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-stone-900">Jadwal Pelajaran</h1>
        <p className="text-sm text-stone-600">
          Kelas <span className="font-mono font-bold text-emerald-900">{classNameText}</span> — total {schedules.length} jadwal.
        </p>
      </div>

      <UserScheduleTimetable schedules={schedules} classNameText={classNameText} />
    </div>
  );
}
