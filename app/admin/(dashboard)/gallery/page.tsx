import { prisma } from "@/lib/prisma";
import Link from "next/link";
import GalleryAdminList from "./GalleryAdminList";

export const dynamic = "force-dynamic";

export default async function GalleryAdminPage() {
  const items = await prisma.gallery.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="p-1">
      <div className="border border-white/15 mt-10 rounded-2xl p-6 sm:p-8 bg-zinc-950/60">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Gallery
        </h1>
        <p className="text-white/40 text-sm mb-6">
          Kelola foto dan video untuk section homepage
        </p>

        <div className="flex justify-end mb-6">
          <Link
            href="/admin/gallery/add"
            className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-white/90 transition">
            Add Media
          </Link>
        </div>

        <GalleryAdminList initialItems={items} />
      </div>
    </div>
  );
}
