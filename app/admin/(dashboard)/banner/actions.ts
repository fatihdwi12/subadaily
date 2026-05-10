"use server";

import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export async function createBanner(filename: string, order: number) {
  try {
    const banner = await prisma.banner.create({
      data: { filename, order, status: "Active" },
    });
    revalidatePath("/");
    revalidatePath("/admin/banner");
    return { success: true, banner };
  } catch {
    return { success: false, banner: null };
  }
}

export async function deleteBanner(id: string, filename: string) {
  try {
    await prisma.banner.delete({ where: { id } });
    const filePath = path.join(process.cwd(), "public", "videos", filename);
    await unlink(filePath).catch(() => {});
    revalidatePath("/");
    revalidatePath("/admin/banner");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function toggleBannerStatus(id: string) {
  try {
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) return { success: false, banner: null };
    const updated = await prisma.banner.update({
      where: { id },
      data: { status: banner.status === "Active" ? "Inactive" : "Active" },
    });
    revalidatePath("/");
    revalidatePath("/admin/banner");
    return { success: true, banner: updated };
  } catch {
    return { success: false, banner: null };
  }
}

export async function reorderBanner(items: { id: string; order: number }[]) {
  try {
    await Promise.all(
      items.map((item) =>
        prisma.banner.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    revalidatePath("/");
    revalidatePath("/admin/banner");
    return { success: true };
  } catch {
    return { success: false };
  }
}
