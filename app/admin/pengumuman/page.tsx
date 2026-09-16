import { prisma } from "@/lib/prisma";
import AdminLayout from "../components/AdminLayout";
import { checkAdminAuth } from "@/lib/admin-auth";
import { CreateAnnouncementForm, DeleteAnnouncementButton } from "./AnnouncementForms";

export const dynamic = "force-dynamic";

export default async function AdminPengumumanPage() {
  await checkAdminAuth();

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminLayout activePath="/admin/pengumuman">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Pengumuman</h1>
        <p className="text-sm text-stone-600 mt-1">Buat dan kelola pengumuman untuk siswa.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 lg:col-span-1">
          <h2 className="text-base font-semibold text-stone-900 mb-4">Buat Pengumuman</h2>
          <CreateAnnouncementForm />
        </div>

        <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-stone-200 font-semibold">Riwayat Pengumuman</div>
          {announcements.length === 0 ? (
            <div className="p-8 text-center text-sm text-stone-500">Belum ada pengumuman.</div>
          ) : (
            <div className="divide-y divide-stone-200">
              {announcements.map((a) => (
                <div key={a.id} className="p-6 flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-stone-900">{a.title}</h3>
                    <p className="text-sm text-stone-600 mt-1 whitespace-pre-line">{a.content}</p>
                    {a.imageUrl && (
                      <img
                        src={a.imageUrl}
                        alt="Pengumuman"
                        className="mt-3 w-full h-auto max-h-96 rounded-md object-contain bg-stone-900 border border-stone-200"
                      />
                    )}
                  </div>
                  <DeleteAnnouncementButton id={a.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
