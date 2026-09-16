import AdminLayout from "../components/AdminLayout";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/lib/admin-auth";
import { ClassForms } from "./ClassForms";

export const dynamic = "force-dynamic";

export default async function AdminKelasPage() {
  await checkAdminAuth();

  const deptCount = await prisma.department.count();
  if (deptCount === 0) {
    await prisma.department.createMany({
      data: [
        { code: "BI", name: "Bahasa Indonesia", isActive: true },
        { code: "BIN", name: "Bahasa Inggris", isActive: true },
        { code: "MTK", name: "Matematika", isActive: true },
      ],
      skipDuplicates: true,
    });
  }

  const departments = await prisma.department.findMany({ orderBy: { code: "asc" } });
  const classes = await prisma.schoolClass.findMany({
    include: { department: true },
    orderBy: [{ grade: "asc" }, { number: "asc" }],
  });

  return (
    <AdminLayout activePath="/admin/kelas">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Kelas & Jurusan</h1>
          <p className="text-sm text-stone-600 mt-1">Kelola rombongan belajar dan data program keahlian.</p>
        </div>

        <ClassForms initialDepartments={departments} initialClasses={classes} />
      </div>
    </AdminLayout>
  );
}
