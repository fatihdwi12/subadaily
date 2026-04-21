import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Suba Daily Hero"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay gelap tipis jika perlu */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Konten tengah (opsional jika ada teks di hero) */}
      {/* Berdasarkan desain, hero tampak full image tanpa teks overlay */}
    </section>
  );
}
