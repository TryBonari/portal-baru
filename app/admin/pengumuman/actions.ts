"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function createAnnouncementAction(formData: FormData) {
  await checkAdminAuth();
  
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const imageFile = formData.get("image") as File | null;

  if (!title || !content) {
    throw new Error("Judul dan pesan pengumuman wajib diisi");
  }

  // ... (rest of code)
  // ...
  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0 && imageFile.name) {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(imageFile.type)) {
      throw new Error("Tipe file tidak didukung. Harap gunakan gambar (JPG, PNG, WebP).");
    }

    // Validate size (max 2MB)
    if (imageFile.size > 2 * 1024 * 1024) {
      throw new Error("Ukuran gambar maksimal 2MB.");
    }

    // Convert image to base64 Data URL for production/serverless safety without filesystem dependency
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    imageUrl = `data:${imageFile.type};base64,${base64Image}`;
  }

  await prisma.announcement.create({
    data: {
      title,
      content,
      imageUrl,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  revalidatePath("/admin/pengumuman");
  revalidatePath("/user/dashboard");
}

export async function deleteAnnouncementAction(formData: FormData) {
  await checkAdminAuth();
  
  const idStr = formData.get("id") as string;
  if (!idStr) return;

  const id = parseInt(idStr, 10);
  await prisma.announcement.delete({
    where: { id },
  });

  revalidatePath("/admin/pengumuman");
  revalidatePath("/user/dashboard");
}
