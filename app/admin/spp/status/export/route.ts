import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function GET(request: Request) {
  await checkAdminAuth();
  const url = new URL(request.url);
  const classIdParam = url.searchParams.get("classId");
  const yearIdParam = url.searchParams.get("yearId");
  const monthParam = url.searchParams.get("month");

  if (!classIdParam || !yearIdParam || !monthParam) {
    return new Response("Missing classId, yearId, or month", { status: 400 });
  }

  const classId = parseInt(classIdParam, 10);
  const yearId = parseInt(yearIdParam, 10);
  const monthNum = parseInt(monthParam, 10);

  const schoolClass = await prisma.schoolClass.findUnique({
    where: { id: classId },
    include: { department: true },
  });

  const academicYear = await prisma.academicYear.findUnique({
    where: { id: yearId },
  });

  const students = await prisma.student.findMany({
    where: { classId: classId, status: "AKTIF" },
    orderBy: { name: "asc" },
  });

  const studentIds = students.map((s) => s.id);
  const payments = await prisma.payment.findMany({
    where: {
      studentId: { in: studentIds },
      academicYearId: yearId,
      month: monthNum,
    },
  });

  const paymentsMap: Record<string, boolean> = {};
  payments.forEach((p: any) => {
    paymentsMap[p.studentId] = p.isPaid;
  });

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

  const monthObj = months.find((m) => m.number === monthNum);
  const monthName = monthObj ? monthObj.name : "Bulan";

  let csvRows = [];
  csvRows.push(["No", "Nama Siswa", "NIS", `Status SPP (${monthName})`].join(","));

  students.forEach((s, idx) => {
    const row = [
      idx + 1,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.nis || "-"}"`,
      paymentsMap[s.id] ? "Lunas" : "Belum",
    ];
    csvRows.push(row.join(","));
  });

  const csvContent = csvRows.join("\n");
  const className = schoolClass ? `${schoolClass.grade}_${schoolClass.department?.code || ""}_${schoolClass.number}` : "Kelas";
  const yearName = academicYear ? academicYear.name.replace(/\//g, "-") : "TahunAjaran";
  const filename = `Rekap_SPP_${className}_${monthName}_${yearName}.csv`;

  return new Response(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
