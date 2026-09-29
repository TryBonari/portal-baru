import AdminLayout from "../../components/AdminLayout";
import { checkAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

import SPPYearSelector from "./SPPYearSelector";
import SPPExportMonth from "./SPPExportMonth";

interface PageProps {
  searchParams: Promise<{ classId?: string; yearId?: string }>;
}

export default async function SPPStatusIndexPage({ searchParams }: PageProps) {
  await checkAdminAuth();
  const resolvedSearchParams = await searchParams;
  const classIdStr = resolvedSearchParams.classId;
  const classId = classIdStr ? parseInt(classIdStr, 10) : undefined;

  const classes = await prisma.schoolClass.findMany({
    include: {
      department: true,
      academicYear: true,
      sppSetting: true,
    },
    orderBy: [{ grade: "asc" }, { number: "asc" }],
  });

  let detailData = null;
  if (classId) {
    const selectedClass = classes.find((c) => c.id === classId);
    if (selectedClass) {
      const academicYears = await prisma.academicYear.findMany({
        orderBy: { startDate: "desc" },
      });

      const rawYearId = resolvedSearchParams.yearId ? parseInt(resolvedSearchParams.yearId, 10) : undefined;
      const selectedYearId = rawYearId && !isNaN(rawYearId) ? rawYearId : undefined;
      const currentYearObj = selectedYearId ? academicYears.find((y) => y.id === selectedYearId) : undefined;

      const students = await prisma.student.findMany({
        where: { classId: classId, status: "AKTIF" },
        orderBy: { name: "asc" },
      });

      let paymentsMap: Record<string, boolean> = {};
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

      detailData = {
        selectedClass,
        academicYears,
        selectedYearId,
        currentYearObj,
        students,
        paymentsMap,
        months,
      };
    }
  }

  return (
    <AdminLayout activePath="/admin/spp/status">
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
        {!classId ? (
          <>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-stone-900">Status Pembayaran SPP</h1>
              <p className="text-sm text-stone-600 mt-1">
                Pilih kelas untuk melihat rekapitulasi status pembayaran SPP siswa.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-stone-200 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wider mb-4">Daftar Kelas</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {classes.map((cls: any) => {
                  const className = `${cls.grade} ${cls.department?.code || ""} ${cls.number}`;
                  return (
                    <Link
                      key={cls.id}
                      href={`/admin/spp/status?classId=${cls.id}`}
                      className="p-4 rounded-lg border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 transition flex flex-col items-center justify-center gap-1 text-center"
                    >
                      <span className="font-bold text-base text-stone-900">{className}</span>
                      <span className="text-xs text-stone-500">
                        SPP: {cls.sppSetting ? `Rp ${cls.sppSetting.amount.toLocaleString("id-ID")}` : "Belum diatur"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          detailData && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Link
                      href="/admin/spp/status"
                      className="inline-flex items-center justify-center w-10 h-10 text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition"
                      title="Kembali ke Daftar Kelas"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    </Link>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-stone-900">
                    Status SPP Kelas {detailData.selectedClass.grade} {detailData.selectedClass.department?.name || ""}{" "}
                    {detailData.selectedClass.number}
                  </h1>
                  <p className="text-sm text-stone-600 mt-1">
                    Nominal SPP:{" "}
                    <span className="font-semibold text-stone-800">
                      {detailData.selectedClass.sppSetting
                        ? `Rp ${detailData.selectedClass.sppSetting.amount.toLocaleString("id-ID")}`
                        : "Belum diatur"}
                    </span>
                  </p>
                </div>
              </div>

              <SPPYearSelector
                academicYears={detailData.academicYears}
                selectedYearId={detailData.selectedYearId}
                classId={classId}
              />

              {detailData.selectedYearId ? (
                <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">Rekapitulasi Pembayaran Siswa</h2>
                      <p className="text-sm text-stone-500">
                        Tahun Ajaran:{" "}
                        <span className="font-semibold text-stone-700">
                          {detailData.currentYearObj ? detailData.currentYearObj.name : "-"}
                        </span>
                      </p>
                    </div>
                    <SPPExportMonth classId={classId} yearId={detailData.selectedYearId} />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm min-w-[700px]">
                      <thead>
                        <tr className="bg-stone-100 text-stone-700 border-b border-stone-200 font-semibold">
                          <th className="p-3 pl-6 w-12 text-center">No</th>
                          <th className="p-3 min-w-[200px]">Nama Siswa</th>
                          <th className="p-3 w-32">NIS</th>
                          {detailData.months.map((m) => (
                            <th key={m.number} className="p-3 text-center min-w-[80px]">
                              {m.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {detailData.students.length === 0 ? (
                          <tr>
                            <td colSpan={15} className="p-8 text-center text-stone-500">
                              Tidak ada siswa aktif di kelas ini.
                            </td>
                          </tr>
                        ) : (
                          detailData.students.map((student: any, idx: number) => (
                            <tr key={student.id} className="hover:bg-stone-50/80 transition">
                              <td className="p-3 pl-6 text-center text-stone-500 font-medium">{idx + 1}</td>
                              <td className="p-3 font-semibold text-stone-900">{student.name}</td>
                              <td className="p-3 text-stone-600">{student.nis || "-"}</td>
                              {detailData.months.map((m) => {
                                const isPaid = detailData.paymentsMap[`${student.id}-${m.number}`] ?? false;
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
              ) : (
                <div className="bg-white border border-stone-200 rounded-lg p-12 shadow-sm text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-100">
                      <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold text-stone-900 mb-2">Pilih Tahun Ajaran</h2>
                    <p className="text-stone-500">Pilih tahun ajaran untuk menampilkan rekapitulasi pembayaran siswa.</p>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </AdminLayout>
  );
}

