import { prisma } from "@/lib/prisma";
import AdminLayout from "../components/AdminLayout";
import { createAnnouncementAction, deleteAnnouncementAction } from "./actions";
import { checkAdminAuth } from "@/lib/admin-auth";

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
          <form action={createAnnouncementAction} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Judul</label>
              <input type="text" name="title" required maxLength={150} placeholder="Maksimal 150 karakter" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Pesan</label>
              <textarea name="content" required maxLength={5000} rows={4} placeholder="Maksimal 5000 karakter" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Upload Gambar (Opsional, Max 2MB - JPG/PNG/WebP)</label>
              <input type="file" name="image" accept="image/jpeg,image/png,image/webp" className="w-full text-sm text-stone-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200" />
            </div>
            <button type="submit" className="w-full py-2 bg-emerald-900 text-white rounded-md text-sm font-medium hover:bg-emerald-800 transition">Post Pengumuman</button>
          </form>
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
                    {a.imageUrl && <img src={a.imageUrl} alt="Pengumuman" className="mt-2 h-20 w-auto rounded object-cover border border-stone-200" />}
                  </div>
                  <form action={deleteAnnouncementAction}>
                    <input type="hidden" name="id" value={a.id} />
                    <button type="submit" className="text-xs text-red-600 hover:text-red-800 font-medium">Hapus</button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
