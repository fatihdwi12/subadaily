import { prisma } from "@/lib/prisma";
import Footer from "@/app/components/layout/Footer";
import AtmosphereCard from "@/app/components/AtmosphereCard";
import Link from "next/link";

export const dynamic = "force-dynamic"; // ← tambahkan ini

export default async function AtmospherePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  const [items, heroBanner] = await Promise.all([
    prisma.atmosphere.findMany({
      where: {
        status: "Active",
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { date: "desc" },
    }),
    prisma.heroBanner.findFirst({
      where: { page: "atmosphere", status: "Active" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const bannerImage = heroBanner?.image ?? "/images/hero-1.jpg";


  return (
    <>
      {/* Hero Banner — dinamis dari DB */}
      <div className="relative w-full h-[35vh] sm:h-[45vh] md:h-[50vh] bg-zinc-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url('${bannerImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black" />
      </div>

      <main className="bg-black min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
          {/* Heading */}
          <div className="text-right mb-8 sm:mb-10">
            <p className="text-white/60 text-xs sm:text-sm md:text-base italic mb-2 sm:mb-3 leading-relaxed">
              At Suba Daily, it&apos;s never just about coffee.
              <br className="hidden sm:block" /> It&apos;s about how the space
              makes you feel.
            </p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight">
              //OUR ATMOSPHERE
            </h1>
          </div>

          {/* Search */}
          <form method="GET" className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3 border border-white/25 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 max-w-lg">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white/40 shrink-0 sm:w-[18px] sm:h-[18px]">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                name="q"
                defaultValue={q}
                placeholder="Search Title, Author, Date"
                className="bg-transparent text-xs sm:text-sm text-white placeholder:text-white/30 outline-none w-full"
              />
            </div>
          </form>

          {/* Grid */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-3">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                className="text-white/20">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <p className="text-center text-white/30 text-sm">
                Tidak ada atmosphere ditemukan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {items.map((item) => (
                <AtmosphereCard key={item.id} {...item} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="inline-flex min-w-[200px] items-center justify-between gap-6 rounded-full border border-white/25 px-7 py-3.5 text-sm text-white transition-all duration-300 hover:bg-white hover:text-black">
            <span>Kembali ke Home</span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </span>
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
