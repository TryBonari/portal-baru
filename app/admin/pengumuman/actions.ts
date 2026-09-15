"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function createAnnouncementAction(formData: FormData) {
  await checkAdminAuth();
  
  const rawTitle = formData.get("title");
  const rawContent = formData.get("content");
  const rawImage = formData.get("image");

  if (typeof rawTitle !== "string" || typeof rawContent !== "string") {
    throw new Error("Input tidak valid.");
  }

  const title = rawTitle.trim();
  const content = rawContent.trim();

  if (!title) {
    throw new Error("Judul pengumuman wajib diisi.");
  }

  if (title.length > 150) {
    throw new Error("Judul pengumuman maksimal 150 karakter.");
  }

  if (!content) {
    throw new Error("Pesan pengumuman wajib diisi.");
  }

  if (content.length > 5000) {
    throw new Error("Pesan pengumuman maksimal 5000 karakter.");
  }

  let imageUrl: string | null = null;

  if (rawImage && rawImage instanceof File && rawImage.size > 0 && rawImage.name) {
    // Validate file type (MIME)
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(rawImage.type)) {
      throw new Error("Tipe file tidak didukung. Harap gunakan gambar (JPG, PNG, WebP).");
    }

    // Validate size (max 2MB)
    if (rawImage.size > 2 * 1024 * 1024) {
      throw new Error("Ukuran gambar maksimal 2MB.");
    }

    try {
      // Use buffer for safer handling
      const bytes = await rawImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Basic check for file header (Magic Numbers) to prevent disguised scripts
      const header = buffer.toString("hex", 0, 4);
      const isJpeg = header === "ffd8ffe0" || header === "ffd8ffe1" || header === "ffd8ffdb";
      const isPng = header === "89504e47";
      const isWebp = header.startsWith("52494646") && buffer.toString("hex", 8, 12) === "57454250";

      if (!isJpeg && !isPng && !isWebp) {
        throw new Error("Konten file tidak valid.");
      }

      const base64Image = buffer.toString("base64");
      imageUrl = `data:${rawImage.type};base64,${base64Image}`;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memproses gambar.";
      throw new Error(message);
    }
  }

  try {
    await prisma.announcement.create({
      data: {
        title,
        content,
        imageUrl,
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  } catch {
    throw new Error("Gagal menyimpan pengumuman.");
  }

  revalidatePath("/admin/pengumuman");
  revalidatePath("/user/dashboard");
}

export async function deleteAnnouncementAction(formData: FormData) {
  await checkAdminAuth();
  
  const rawId = formData.get("id");
  if (typeof rawId !== "string" || !rawId.trim()) {
    throw new Error("ID tidak valid.");
  }

  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID tidak valid.");
  }

  try {
    await prisma.announcement.delete({
      where: { id },
    });
  } catch {
    throw new Error("Gagal menghapus pengumuman.");
  }

  revalidatePath("/admin/pengumuman");
  revalidatePath("/user/dashboard");
}

