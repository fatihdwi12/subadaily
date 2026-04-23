import Navbar from "@/app/components/layout/Navbar";
import Carousel from "@/app/components/section/Caraousel";
import OurStory from "@/app/components/section/OurStory";
import VideoBanner from "@/app/components/section/VideoBanner";
import OurAtmosphere from "@/app/components/section/OurAtmosphere";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-black">
        <div className="pt-12 sm:pt-14 lg:pt-20">
          <Carousel />
        </div>
        <OurStory />
        <VideoBanner />
        <OurAtmosphere />
      </main>
    </>
  );
}
