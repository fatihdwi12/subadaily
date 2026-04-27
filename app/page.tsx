import { prisma } from "@/lib/prisma";
import Navbar from "@/app/components/layout/Navbar";
import Carousel from "@/app/components/section/Caraousel";
import OurStory from "@/app/components/section/OurStory";
import VideoBanner from "@/app/components/section/VideoBanner";
import OurAtmosphere from "@/app/components/section/OurAtmosphere";
import Footer from "@/app/components/layout/Footer";
import OurTeam from "@/app/components/section/OurTeam";

export default async function HomePage() {
  const banners = await prisma.banner.findMany({
    where: { status: "Active" },
    orderBy: { order: "asc" },
  });

  const bannerItems = banners.map((b) => ({
    id: b.id,
    src: `/videos/${b.filename}`,
  }));

  return (
    <>
      <Navbar />
      <main className="bg-black">
        <div className="pt-12 sm:pt-14 lg:pt-20">
          <Carousel />
        </div>
        <OurStory />
        <VideoBanner items={bannerItems} />
        <OurAtmosphere />
        <OurTeam />
      </main>
      <Footer />
    </>
  );
}
