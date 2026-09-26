import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserNilaiFilter from "./UserNilaiFilter";

export const dynamic = "force-dynamic";

export default async function UserNilaiPage({
  searchParams,
}: {
  searchParams: Promise<{ academicYearId?: string; semesterId?: string }>;
}) {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("student_session")?.value;
  if (!sessionUserId) redirect("/login");
  const userId = parseInt(sessionUserId, 10);

  const user = await prisma.user.findFirst({
    where: { id: userId, role: "STUDENT" },
    include: { student: true },
  });

  if (!user || !user.student) redirect("/login");

  const params = await searchParams;
  const selectedAYId = params.academicYearId ? parseInt(params.academicYearId, 10) : null;
  const selectedSemId = params.semesterId ? parseInt(params.semesterId, 10) : null;

  const [academicYears, semesters] = await Promise.all([
    prisma.academicYear.findMany({ orderBy: { startDate: "desc" } }),
    prisma.semester.findMany({ orderBy: [{ academicYearId: "asc" }, { number: "asc" }] }),
  ]);

  const grades = selectedAYId && selectedSemId
    ? await prisma.grade.findMany({
        where: {
          studentId: user.student.id,
          academicYearId: selectedAYId,
          semesterId: selectedSemId,
        },
        include: { subject: true },
        orderBy: { subject: { name: "asc" } },
      })
    : [];

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Nilai Akademik</h1>
        <p className="text-sm text-stone-600 mt-1">Pilih Tahun Ajaran dan Semester untuk melihat hasil nilai akademik Anda.</p>
      </div>

      <UserNilaiFilter
        academicYears={academicYears}
        semesters={semesters}
        selectedAYId={selectedAYId}
        selectedSemId={selectedSemId}
      />

      {selectedAYId && selectedSemId && (
        <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-stone-700">Mata Pelajaran</th>
                  <th className="px-3 py-3 text-center text-stone-700">Tugas</th>
                  <th className="px-3 py-3 text-center text-stone-700">UTS</th>
                  <th className="px-3 py-3 text-center text-stone-700">UAS</th>
                  <th className="px-3 py-3 text-center text-stone-700">Nilai Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {grades.map((g) => {
                  const scores = [g.assignmentScore, g.utsScore, g.uasScore].filter((v) => v != null) as number[];
                  const final =
                    scores.length
                      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2).replace(/\.00$/, "")
                      : g.finalScore != null
                        ? String(g.finalScore)
                        : "-";
                  return (
                    <tr key={g.id}>
                      <td className="px-4 py-3 font-medium text-stone-900">{g.subject.name}</td>
                      <td className="px-3 py-3 text-center">{g.assignmentScore ?? "-"}</td>
                      <td className="px-3 py-3 text-center">{g.utsScore ?? "-"}</td>
                      <td className="px-3 py-3 text-center">{g.uasScore ?? "-"}</td>
                      <td className="px-3 py-3 text-center font-mono font-bold text-emerald-900">{final}</td>
                    </tr>
                  );
                })}
                {grades.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-stone-400">
                      Belum ada nilai untuk periode ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
