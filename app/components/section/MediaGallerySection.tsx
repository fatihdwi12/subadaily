// app/components/section/MediaGallerySection.tsx

import { prisma } from "@/lib/prisma";
import MediaGalleryGrid from "@/app/components/ui/MediaGalleryGrid";

export const dynamic = "force-dynamic"; // ← tambahkan ini

export default async function MediaGallerySection() {
  const photos = await prisma.media.findMany({
    where: { status: "Active", type: "image" },
    orderBy: { order: "asc" },
    take: 12,
  });

  const items = photos.map((p) => ({
    id: p.id,
    src: `/images/media/${p.filename}`,
    alt: p.title ?? p.filename,
    title: p.title ?? undefined,
    date: p.createdAt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }));

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">
            Koleksi
          </p>
          <h2 className="text-2xl font-bold text-white">Media Gallery</h2>
        </div>
        <MediaGalleryGrid items={items} />
      </div>
    </section>
  );
}
