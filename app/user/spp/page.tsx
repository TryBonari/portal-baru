import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import UserPaymentMethodSelector from "./UserPaymentMethodSelector";

export const dynamic = "force-dynamic";

export default async function UserSPPPage() {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("student_session")?.value;
  if (!sessionUserId) redirect("/login");
  const userId = parseInt(sessionUserId, 10);

  const user = await prisma.user.findFirst({
    where: { id: userId, role: "STUDENT" },
    include: {
      student: {
        include: {
          class: { include: { department: true, sppSetting: true } },
        },
      },
    },
  });

  if (!user || !user.student) redirect("/login");
  const student = user.student;

  const now = new Date();

  let activeAcademicYear = await prisma.academicYear.findFirst({
    where: { isActive: true },
  });

  if (!activeAcademicYear) {
    activeAcademicYear = await prisma.academicYear.findFirst({
      where: { startDate: { lte: now }, endDate: { gte: now } },
      orderBy: { startDate: "desc" },
    });
  }

  if (!activeAcademicYear && student.class?.academicYearId) {
    activeAcademicYear = await prisma.academicYear.findUnique({
      where: { id: student.class.academicYearId },
    });
  }

  if (!activeAcademicYear) {
    activeAcademicYear = await prisma.academicYear.findFirst({
      orderBy: { startDate: "desc" },
    });
  }

  if (!activeAcademicYear) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Status SPP</h1>
          <p className="text-sm text-stone-600 mt-1">Lihat riwayat pembayaran SPP Anda.</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-lg p-12 shadow-sm text-center">
          <p className="text-stone-500">Tahun ajaran belum tersedia. Silakan hubungi pihak sekolah.</p>
        </div>
      </div>
    );
  }
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  const academicMonths = [
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

  const monthOrder: Record<number, number> = {
    6: 0,
    7: 1,
    8: 2,
    9: 3,
    10: 4,
    11: 5,
    12: 6,
    1: 7,
    2: 8,
    3: 9,
    4: 10,
    5: 11,
  };

  const currentOrder = monthOrder[currentMonth] ?? 99;
  const billedMonths = academicMonths.filter((m) => monthOrder[m.number] <= currentOrder);

  const sppAmount = student.class?.sppSetting?.amount ?? 0;

  const payments = await prisma.payment.findMany({
    where: {
      studentId: student.id,
      academicYearId: activeAcademicYear.id,
    },
  });

  const paymentMap: Record<number, boolean> = {};
  payments.forEach((p: any) => {
    paymentMap[p.month] = p.isPaid;
  });

  const unpaidBills = billedMonths
    .filter((m) => !paymentMap[m.number])
    .map((m) => ({
      ...m,
      amount: sppAmount,
      dueDate: `1 ${m.name} ${activeAcademicYear.name}`,
    }));

  const showBillSection = currentDay >= 1 && unpaidBills.length > 0;
  const currentUnpaidBill = unpaidBills[0];
  const currentMonthName = currentUnpaidBill ? currentUnpaidBill.name : academicMonths.find((m) => m.number === currentMonth)?.name || "-";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Status SPP</h1>
        <p className="text-sm text-stone-600 mt-1">
          Tahun Ajaran: <span className="font-semibold text-stone-700">{activeAcademicYear.name}</span> · Kelas:{" "}
          <span className="font-semibold text-stone-700">
            {student.class ? `${student.class.grade} ${student.class.department?.code || ""} ${student.class.number}`.trim() : "-"}
          </span>
        </p>
      </div>

      {showBillSection ? (
        <div className="flex flex-col gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-amber-900">Tagihan SPP Bulan {currentUnpaidBill.name}</h2>
                <p className="text-sm text-amber-800 mt-1">
                  Jatuh tempo: 1 {currentUnpaidBill.name} · Besaran:{" "}
                  <span className="font-bold">Rp {currentUnpaidBill.amount.toLocaleString("id-ID")}</span>
                </p>
                {unpaidBills.length > 1 && (
                  <p className="text-xs text-amber-700 mt-1">Terdapat {unpaidBills.length} bulan tunggakan (gagal bayar sebelum bulan ini).</p>
                )}
              </div>
              <div className="bg-white border border-amber-200 rounded-lg px-6 py-3 text-center">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Tagihan</div>
                <div className="text-xl font-bold text-stone-900 mt-1">
                  Rp {(sppAmount * unpaidBills.length).toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            {unpaidBills.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {unpaidBills.map((b) => (
                  <span key={b.number} className="px-2 py-1 bg-white border border-amber-200 text-amber-800 rounded text-xs font-semibold">
                    {b.name} · Rp {b.amount.toLocaleString("id-ID")}
                  </span>
                ))}
              </div>
            )}
          </div>

          <UserPaymentMethodSelector
            amount={sppAmount}
            monthName={currentMonthName}
            yearName={activeAcademicYear.name}
          />

          <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm overflow-x-auto">
            <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider mb-4">Rincian Tagihan</h3>
            <table className="w-full text-left border-collapse text-sm min-w-[400px]">
              <thead>
                <tr className="bg-stone-100 text-stone-700 border-b border-stone-200 font-semibold">
                  <th className="p-3">Bulan</th>
                  <th className="p-3">Besaran</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Jatuh Tempo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {unpaidBills.map((b) => (
                  <tr key={b.number}>
                    <td className="p-3 font-semibold text-stone-900">{b.name}</td>
                    <td className="p-3 text-stone-600">Rp {b.amount.toLocaleString("id-ID")}</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-rose-100 text-rose-800">Belum Lunas</span>
                    </td>
                    <td className="p-3 text-stone-600">{b.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-12 shadow-sm text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-white border border-emerald-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-emerald-900">Tidak Ada Tagihan</h2>
          <p className="text-sm text-emerald-800 mt-2">Semua tagihan SPP bulanan Anda sudah lunas hingga bulan saat ini.</p>
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider mb-4">Riwayat Status SPP Bulan Ini dan Sebelumnya</h3>
        <table className="w-full text-left border-collapse text-sm min-w-[500px]">
          <thead>
            <tr className="bg-stone-100 text-stone-700 border-b border-stone-200 font-semibold">
              <th className="p-3">Bulan</th>
              <th className="p-3">Besaran</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {academicMonths.map((m) => {
              const isBilled = billedMonths.some((b) => b.number === m.number);
              const isPaid = paymentMap[m.number] ?? false;
              return (
                <tr key={m.number}>
                  <td className="p-3 font-medium text-stone-900">{m.name}</td>
                  <td className="p-3 text-stone-600">{sppAmount ? `Rp ${sppAmount.toLocaleString("id-ID")}` : "-"}</td>
                  <td className="p-3">
                    {!isBilled ? (
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-stone-100 text-stone-600">Belum Jatuh Tempo</span>
                    ) : isPaid ? (
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">Lunas</span>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-rose-100 text-rose-800">Belum Lunas</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
