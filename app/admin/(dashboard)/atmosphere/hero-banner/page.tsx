import { prisma } from "@/lib/prisma";
import HeroBannerSection from "@/app/admin/(dashboard)/team/HeroBannerSection";

export const dynamic = "force-dynamic";

export default async function AtmosphereHeroBannerPage() {
  const banners = await prisma.heroBanner.findMany({
    where: { page: "atmosphere" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Hero Banner
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Kelola banner untuk halaman{" "}
          <span className="text-white/60">/atmosphere</span>
        </p>
      </div>
      <HeroBannerSection initialBanners={banners} page="atmosphere" />
    </div>
  );
}
