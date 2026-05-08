import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await prisma.menuItem.findUnique({ where: { slug } });
  if (!item) return { title: "Menu Not Found" };
  return {
    title: `${item.name} — Suba Daily`,
    description: item.description ?? `${item.name} tersedia di Suba Daily`,
  };
}

function formatRupiah(n: number) {
  return "Rp. " + n.toLocaleString("id-ID");
}

export default async function MenuDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [item, related] = await Promise.all([
    prisma.menuItem.findUnique({ where: { slug } }),
    prisma.menuItem.findMany({
      where: { status: "Active", slug: { not: slug } },
      orderBy: { order: "asc" },
      take: 4,
    }),
  ]);

  if (!item || item.status !== "Active") notFound();

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Back */}
      <div className="mx-auto mt-10 max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Kembali ke Menu
        </Link>
      </div>

      {/* Detail */}
      <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          {/* Gambar */}
          <div className="w-full lg:w-2/5">
            <div
              className="relative w-full max-w-xs sm:max-w-sm mx-auto lg:mx-0 overflow-hidden rounded-3xl bg-white/5"
              style={{ aspectRatio: "1 / 1" }}>
              {item.image ? (
                <Image
                  src={`/images/menu/${item.image}`}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 320px"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-white/10 flex items-center justify-center">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-white/20">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex w-full flex-col gap-6 lg:w-1/2 lg:pt-4">
            {/* Badge kategori */}
            <span className="w-fit rounded-full border mt-10 border-white/20 px-3 py-1 text-xs font-medium text-white/60 capitalize">
              {item.category}
            </span>

            {/* Nama */}
            <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
              {item.name}
            </h1>

            {/* Harga */}
            <p className="text-3xl font-bold text-white">
              {formatRupiah(item.price)}
            </p>

            {/* Divider */}
            <div className="h-px w-full bg-white/10" />

            {/* Deskripsi */}
            {item.description ? (
              <p className="text-base leading-relaxed text-white/60">
                {item.description}
              </p>
            ) : (
              <p className="text-base text-white/30 italic">
                Tidak ada deskripsi tersedia.
              </p>
            )}

            {/* Info tambahan */}
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Kategori</span>
                <span className="font-medium capitalize">{item.category}</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Ketersediaan</span>
                <span
                  className={`font-medium ${item.status === "Active" ? "text-emerald-400" : "text-red-400"}`}>
                  {item.status === "Active" ? "Tersedia" : "Tidak Tersedia"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Menu */}
      {related.length > 0 && (
        <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 border-t border-white/10">
          <h2 className="mb-6 text-xl font-black uppercase tracking-tight">
            Menu Lainnya
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/menu/${rel.slug}`}
                className="flex flex-col rounded-2xl border border-white/10 bg-black overflow-hidden transition hover:border-white/25 group">
                <div
                  className="relative aspect-square w-full bg-white/5 m-3 rounded-xl overflow-hidden"
                  style={{ maxHeight: 140 }}>
                  {rel.image ? (
                    <Image
                      src={`/images/menu/${rel.image}`}
                      alt={rel.name}
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="200px"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 rounded-xl" />
                  )}
                </div>
                <div className="px-3 pb-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {rel.name}
                  </p>
                  <p className="text-sm text-white/60 mt-0.5">
                    {formatRupiah(rel.price)}
                  </p>
                </div>
                <div className="px-3 pb-3 mt-auto pt-2">
                  <span className="block text-right text-xs text-white/40 group-hover:text-white transition">
                    More Detail →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
