import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AtmosphereCard from "@/app/components/ui/AtmosphereCard";

export default async function OurAtmosphere() {
  const atmospheres = await prisma.atmosphere.findMany({
    orderBy: { date: "desc" },
    take: 4,
  });

  return (
    <section className="bg-black py-12 sm:py-16 lg:py-20">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Judul */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-8 sm:mb-12">
          <span className="text-white/50">//</span>OUR ATMOSPHERE
        </h2>

        {/* Grid 4 Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {atmospheres.map((item) => (
            <AtmosphereCard
              key={item.id}
              image={item.image}
              title={item.title}
              description={item.description}
              date={item.date}
              slug={item.slug}
            />
          ))}
        </div>

        {/* Tombol More Atmosphere */}
        <div className="flex justify-center mt-10 sm:mt-14">
          <Link
            href="/atmosphere"
            className="flex items-center gap-3 border border-white/40 rounded-full px-8 py-3 text-white text-sm sm:text-base font-normal hover:bg-white hover:text-black transition-all duration-300">
            More Atmosphere
            <span className="flex items-center justify-center w-6 h-6 rounded-full border border-current text-xs">
              ›
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
