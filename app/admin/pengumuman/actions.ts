"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function createAnnouncementAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const rawTitle = formData.get("title");
    const rawContent = formData.get("content");
    const rawImage = formData.get("image");

    if (typeof rawTitle !== "string" || typeof rawContent !== "string") {
      return { success: false, message: "Input tidak valid." };
    }

    const title = rawTitle.trim();
    const content = rawContent.trim();

    if (!title) return { success: false, message: "Judul pengumuman wajib diisi." };
    if (title.length > 150) return { success: false, message: "Judul pengumuman maksimal 150 karakter." };
    if (!content) return { success: false, message: "Pesan pengumuman wajib diisi." };
    if (content.length > 5000) return { success: false, message: "Pesan pengumuman maksimal 5000 karakter." };

    let imageUrl: string | null = null;

    if (rawImage && rawImage instanceof File && rawImage.size > 0 && rawImage.name) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(rawImage.type)) {
        return { success: false, message: "Tipe file tidak didukung. Harap gunakan gambar (JPG, PNG, WebP)." };
      }
      if (rawImage.size > 2 * 1024 * 1024) {
        return { success: false, message: "Ukuran file terlalu besar. Maksimal 2MB." };
      }
      try {
        const bytes = await rawImage.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const header = buffer.toString("hex", 0, 4);
        const isJpeg = header === "ffd8ffe0" || header === "ffd8ffe1" || header === "ffd8ffdb";
        const isPng = header === "89504e47";
        const isWebp = header.startsWith("52494646") && buffer.toString("hex", 8, 12) === "57454250";
        if (!isJpeg && !isPng && !isWebp) {
          return { success: false, message: "Konten file tidak valid atau rusak." };
        }
        const base64Image = buffer.toString("base64");
        imageUrl = `data:${rawImage.type};base64,${base64Image}`;
      } catch (err: unknown) {
        console.error("[Announcement File Processing Error]:", err);
        return { success: false, message: "Gagal memproses file. Silakan coba lagi." };
      }
    }

    await prisma.announcement.create({
      data: { title, content, imageUrl, isPublished: true, publishedAt: new Date() },
    });

    revalidatePath("/admin/pengumuman");
    revalidatePath("/admin/dashboard");
    revalidatePath("/user/dashboard");
    return { success: true, message: "Pengumuman berhasil dibuat." };
  } catch (e) {
    console.error("[createAnnouncementAction]", e);
    return { success: false, message: "Terjadi kesalahan sistem. Silakan coba lagi." };
  }
}

export async function deleteAnnouncementAction(prevState: any, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdminAuth();
    const rawId = formData.get("id");
    if (typeof rawId !== "string" || !rawId.trim()) return { success: false, message: "ID tidak valid." };
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) return { success: false, message: "ID tidak valid." };
    await prisma.announcement.delete({ where: { id } });
    revalidatePath("/admin/pengumuman");
    revalidatePath("/user/dashboard");
    return { success: true, message: "Pengumuman berhasil dihapus." };
  } catch (e) {
    console.error("[deleteAnnouncementAction]", e);
    return { success: false, message: "Gagal menghapus pengumuman. Silakan coba lagi." };
  }
}
