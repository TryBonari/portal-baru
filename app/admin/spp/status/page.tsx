import AdminLayout from "../../components/AdminLayout";
import { checkAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SPPStatusIndexPage() {
  await checkAdminAuth();

  const classes = await prisma.schoolClass.findMany({
    include: {
      department: true,
      academicYear: true,
      sppSetting: true,
    },
    orderBy: [{ grade: "asc" }, { number: "asc" }],
  });

  return (
    <AdminLayout activePath="/admin/spp/status">
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
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
                  href={`/admin/spp/status/${cls.id}`}
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
      </div>
    </AdminLayout>
  );
}
