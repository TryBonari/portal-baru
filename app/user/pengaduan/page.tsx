import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ComplaintContent } from "./ComplaintContent";

export const dynamic = "force-dynamic";

export default async function StudentPengaduanPage() {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("student_session")?.value;
  if (!sessionUserId) redirect("/login");

  const userId = parseInt(sessionUserId, 10);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { student: true },
  });

  if (!user || !user.student) redirect("/login");

  const [teachers, studentComplaints] = await Promise.all([
    prisma.teacher.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.teacherComplaint.findMany({
      where: { studentId: user.student.id },
      include: { teacher: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Pengaduan & Inbox Guru</h1>
        <p className="text-sm text-stone-600 mt-1">Cari guru dan kirimkan pengaduan atau pesan secara langsung.</p>
      </div>

      <ComplaintContent 
        teachers={teachers} 
        studentId={user.student.id} 
        initialComplaints={studentComplaints} 
      />
    </div>
  );
}
