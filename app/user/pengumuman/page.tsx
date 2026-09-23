import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function UserPengumumanPage() {
  const announcements = await prisma.announcement.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Pengumuman Sekolah</h1>
        <p className="text-sm text-stone-600 mt-1">Daftar seluruh pengumuman dan informasi resmi dari sekolah.</p>
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm">
          <p className="text-stone-500 text-sm">Belum ada pengumuman.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-stone-900">{a.title}</h2>
                <span className="text-xs text-stone-400">
                  {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("id-ID", { dateStyle: "long" }) : ""}
                </span>
              </div>
              <p className="text-sm text-stone-600 whitespace-pre-line">{a.content}</p>
              {a.imageUrl && (
                <img
                  src={a.imageUrl}
                  alt={a.title}
                  className="mt-2 rounded-md h-auto max-h-96 object-contain bg-stone-900 w-full border border-stone-200"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
