import { prisma } from "@/lib/prisma";
import MediaGalleryManager from "./MediaGalleryManager"; // ← tambah huruf 'a'

export const dynamic = "force-dynamic";

export default async function AdminMediaGalleryPage() {
  const items = await prisma.media.findMany({
    orderBy: { order: "asc" },
  });

  return <MediaGalleryManager initialItems={items} />;
}
