import { prisma } from "@/lib/prisma";
import AdminLayout from "../components/AdminLayout";
import GenerateButton from "./GenerateButton";

export const dynamic = "force-dynamic";

export default async function AccessCodePage() {
  const accessCodes = await prisma.studentAccessCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalCount = accessCodes.length;
  const unusedCount = accessCodes.filter((c) => c.status === "UNUSED").length;
  const usedCount = accessCodes.filter((c) => c.status === "USED").length;

  return (
    <AdminLayout activePath="/admin/accescode">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Kelola Access Code</h1>
          <p className="text-sm text-stone-600 mt-1">
            Generate kode akses berurutan (mulai format A0001) untuk registrasi siswa.
          </p>
        </div>
        <GenerateButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-sm">
          <div className="text-xs font-medium text-stone-500 uppercase">Total Dibuat</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{totalCount}</div>
        </div>
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-sm">
          <div className="text-xs font-medium text-stone-500 uppercase">Belum Digunakan</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{unusedCount}</div>
        </div>
        <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-sm">
          <div className="text-xs font-medium text-stone-500 uppercase">Sudah Digunakan</div>
          <div className="text-2xl font-bold text-stone-600 mt-1">{usedCount}</div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200">
          <h2 className="text-base font-semibold text-stone-900">Daftar Access Code</h2>
        </div>

        {accessCodes.length === 0 ? (
          <div className="p-8 text-center text-sm text-stone-500">
            Belum ada access code yang digenerate. Klik tombol di atas untuk membuat kode baru.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="bg-stone-50 text-xs font-semibold uppercase text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3">Kode Akses</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Tanggal Dibuat</th>
                  <th className="px-6 py-3">Tanggal Dipakai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {accessCodes.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50">
                    <td className="px-6 py-4 font-mono font-medium text-stone-900">{item.code}</td>
                    <td className="px-6 py-4">
                      {item.status === "UNUSED" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Tersedia
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                          Digunakan
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{new Date(item.createdAt).toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4">
                      {item.usedAt ? new Date(item.usedAt).toLocaleString("id-ID") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
