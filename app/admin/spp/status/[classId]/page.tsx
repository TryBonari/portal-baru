import AdminLayout from "../../../components/AdminLayout";
import { checkAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import SPPYearSelector from "./SPPYearSelector";

interface PageProps {
  params: Promise<{ classId: string }>;
  searchParams: Promise<{ yearId?: string }>;
}

export default async function SPPStatusDetailPage({ params, searchParams }: PageProps) {
  await checkAdminAuth();
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const classId = parseInt(resolvedParams.classId, 10);

  if (isNaN(classId)) {
    notFound();
  }

  const selectedClass = await prisma.schoolClass.findUnique({
    where: { id: classId },
    include: {
      department: true,
      academicYear: true,
      sppSetting: true,
    },
  });

  if (!selectedClass) {
    notFound();
  }

  const academicYears = await prisma.academicYear.findMany({
    orderBy: { startDate: "desc" },
  });

  const activeYear = await prisma.academicYear.findFirst({
    where: { isActive: true },
  });

  const selectedYearId = resolvedSearchParams.yearId
    ? parseInt(resolvedSearchParams.yearId, 10)
    : selectedClass.academicYearId || activeYear?.id;

  const currentYearObj = academicYears.find((y) => y.id === selectedYearId);

  const students = await prisma.student.findMany({
    where: { classId: classId, status: "AKTIF" },
    orderBy: { name: "asc" },
  });

  const paymentsMap: Record<string, boolean> = {};

  if (students.length > 0 && selectedYearId) {
    const studentIds = students.map((s) => s.id);
    const payments = await prisma.payment.findMany({
      where: {
        studentId: { in: studentIds },
        academicYearId: selectedYearId,
      },
    });

    payments.forEach((p: any) => {
      paymentsMap[`${p.studentId}-${p.month}`] = p.isPaid;
    });
  }

  const months = [
    { number: 6, name: "Juni" },
    { number: 7, name: "Juli" },
    { number: 8, name: "Agustus" },
    { number: 9, name: "September" },
    { number: 10, name: "Oktober" },
    { number: 11, name: "November" },
    { number: 12, name: "Desember" },
    { number: 1, name: "Januari" },
    { number: 2, name: "Februari" },
    { number: 3, name: "Maret" },
    { number: 4, name: "April" },
    { number: 5, name: "Mei" },
  ];

  return (
    <AdminLayout activePath="/admin/spp/status">
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/admin/spp/status"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition"
              >
             Kembali ke Daftar Kelas
              </Link>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Status SPP Kelas {selectedClass.grade} {selectedClass.department?.name || ""} {selectedClass.number}
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Nominal SPP:{" "}
              <span className="font-semibold text-stone-800">
                {selectedClass.sppSetting ? `Rp ${selectedClass.sppSetting.amount.toLocaleString("id-ID")}` : "Belum diatur"}
              </span>
            </p>
          </div>
        </div>

        <SPPYearSelector
          academicYears={academicYears}
          selectedYearId={selectedYearId}
          classId={classId}
        />

        <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-200">
            <h2 className="text-lg font-bold text-stone-900">Rekapitulasi Pembayaran Siswa</h2>
            <p className="text-sm text-stone-500">
              Tahun Ajaran: <span className="font-semibold text-stone-700">{currentYearObj ? currentYearObj.name : "-"}</span>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[700px]">
              <thead>
                <tr className="bg-stone-100 text-stone-700 border-b border-stone-200 font-semibold">
                  <th className="p-3 pl-6 w-12 text-center">No</th>
                  <th className="p-3 min-w-[200px]">Nama Siswa</th>
                  <th className="p-3 w-32">NIS</th>
                  {months.map((m) => (
                    <th key={m.number} className="p-3 text-center min-w-[80px]">
                      {m.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="p-8 text-center text-stone-500">
                      Tidak ada siswa aktif di kelas ini.
                    </td>
                  </tr>
                ) : (
                  students.map((student: any, idx: number) => (
                    <tr key={student.id} className="hover:bg-stone-50/80 transition">
                      <td className="p-3 pl-6 text-center text-stone-500 font-medium">{idx + 1}</td>
                      <td className="p-3 font-semibold text-stone-900">{student.name}</td>
                      <td className="p-3 text-stone-600">{student.nis || "-"}</td>
                      {months.map((m) => {
                        const isPaid = paymentsMap[`${student.id}-${m.number}`] ?? false;
                        return (
                          <td key={m.number} className="p-3 text-center">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                isPaid ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {isPaid ? "Lunas" : "Belum"}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
