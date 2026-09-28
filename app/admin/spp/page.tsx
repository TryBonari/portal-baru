import AdminLayout from "../components/AdminLayout";
import { checkAdminAuth } from "@/lib/admin-auth";
import { getSPPInitialData } from "./actions";
import SPPForm from "./SPPForm";

export default async function AdminSppPage() {
  await checkAdminAuth();
  const { departments, classes } = await getSPPInitialData();

  return (
    <AdminLayout activePath="/admin/spp">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Data SPP</h1>
          <p className="text-sm text-stone-600 mt-1">Kelola data tagihan SPP siswa berdasarkan kelas.</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-lg p-8 shadow-sm">
          <SPPForm departments={departments} classes={classes} />
        </div>
      </div>
    </AdminLayout>
  );
}