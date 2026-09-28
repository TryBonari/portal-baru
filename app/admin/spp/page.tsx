import AdminLayout from "../components/AdminLayout";
import { checkAdminAuth } from "@/lib/admin-auth";
import { getSPPInitialData } from "./actions";
import SPPForm from "./SPPForm";

export const dynamic = "force-dynamic";

export default async function AdminSppPage() {
  await checkAdminAuth();
  const { classes } = await getSPPInitialData();

  return (
    <AdminLayout activePath="/admin/spp">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Data SPP</h1>
          <p className="text-sm text-stone-600 mt-1">Kelola data tagihan SPP siswa berdasarkan kelas.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-4">Pengaturan SPP</h2>
            <SPPForm classes={classes} />
          </div>

          <div className="lg:col-span-2 bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 font-semibold text-stone-900">Daftar Tagihan SPP per Kelas</div>
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 uppercase text-xs text-stone-500">
                <tr>
                  <th className="px-6 py-3">Kelas</th>
                  <th className="px-6 py-3 text-right">Nominal (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {classes.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-900">
                      {c.grade} {c.department?.code} {c.number}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {c.sppSetting ? c.sppSetting.amount.toLocaleString("id-ID") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}