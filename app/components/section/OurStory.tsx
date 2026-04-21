import Image from "next/image";

export default function OurStory() {
  return (
    <section className="bg-black py-12 sm:py-16 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Layout: stack di mobile, side-by-side di md+ */}
        <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-10 lg:gap-16">
          {/* Gambar Kiri */}
          <div className="w-full md:w-[45%] lg:w-[40%] flex-shrink-0">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10">
              <Image
                src="/images/hero-1.jpg"
                alt="Our Story - Suba Daily"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Teks Kanan */}
          <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col gap-5 sm:gap-6">
            {/* Judul */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white tracking-tight">
              <span className="text-white/50">//</span>OUR STORY
            </h2>

            {/* Paragraf */}
            <p className="text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed text-justify">
              Suba Daily is built on a deep attention to taste, atmosphere, and
              experience. We believe that what is served on the table is just as
              important as what is felt within the space.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
