import AdminLayout from "../../components/AdminLayout";
import { checkAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import GradeTable from "../GradeTable";

export const dynamic = "force-dynamic";

export default async function EditNilaiPage({
  searchParams,
}: {
  searchParams: Promise<{
    classId?: string;
    subjectId?: string;
    semesterId?: string;
    academicYearId?: string;
  }>;
}) {
  await checkAdminAuth();
  const params = await searchParams;
  const ayId = params.academicYearId ? parseInt(params.academicYearId, 10) : null;
  const classId = params.classId ? parseInt(params.classId, 10) : null;
  const subId = params.subjectId ? parseInt(params.subjectId, 10) : null;
  const semId = params.semesterId ? parseInt(params.semesterId, 10) : null;

  if (!ayId || !classId || !subId || !semId) {
    return (
      <AdminLayout activePath="/admin/nilai">
        <div className="p-8 text-center text-stone-500 bg-white border rounded-lg">
          Parameter tidak lengkap. Silakan pilih kembali dari halaman utama Nilai.
          <div className="mt-4">
            <Link href="/admin/nilai" className="text-emerald-700 underline">Kembali</Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const [cls, sub, sem, ay, students] = await Promise.all([
    prisma.schoolClass.findUnique({ where: { id: classId }, include: { department: true } }),
    prisma.subject.findUnique({ where: { id: subId } }),
    prisma.semester.findUnique({ where: { id: semId } }),
    prisma.academicYear.findUnique({ where: { id: ayId } }),
    prisma.student.findMany({ where: { classId }, orderBy: { name: "asc" } })
  ]);

  const grades = await prisma.grade.findMany({
    where: { studentId: { in: students.map(s => s.id) }, subjectId: subId, semesterId: semId, academicYearId: ayId }
  });

  const gradeMap = new Map(grades.map(g => [g.studentId, g]));
  const initialRows = students.map(s => {
    const g = gradeMap.get(s.id);
    return {
      studentId: s.id,
      name: s.name,
      assignmentScore: g?.assignmentScore != null ? String(g.assignmentScore) : "",
      utsScore: g?.utsScore != null ? String(g.utsScore) : "",
      uasScore: g?.uasScore != null ? String(g.uasScore) : "",
    };
  });

  const className = `${cls?.grade} ${cls?.department?.code ?? ""} ${cls?.number}`.trim();

  return (
    <AdminLayout activePath="/admin/nilai">
      <div className="flex flex-col gap-6">
        <div>
          <Link 
            href={`/admin/nilai?academicYearId=${ayId}&classId=${classId}&subjectId=${subId}&semesterId=${semId}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-md hover:bg-stone-50 transition mb-3"
          >
            ← Kembali ke Preview
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">Edit Nilai: {sub?.name}</h1>
          <p className="text-sm text-stone-600">Kelas {className} • {sem?.name} • {ay?.name}</p>
        </div>

        <GradeTable
          initialRows={initialRows}
          subjectId={subId}
          semesterId={semId}
          academicYearId={ayId}
        />
      </div>
    </AdminLayout>
  );
}
