import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export const metadata = {
  title: "About Us — Suba Daily",
  description: "Kenali lebih dekat Suba Daily.",
};

const DEFAULT_VALUES = [
  {
    number: "01",
    title: "Quality First",
    desc: "Kami hanya menggunakan biji kopi single origin pilihan yang dipanen dengan metode berkelanjutan.",
  },
  {
    number: "02",
    title: "Honest Space",
    desc: "Ruang yang kami ciptakan adalah tempat di mana siapapun bisa merasa nyaman dan menjadi dirinya sendiri.",
  },
  {
    number: "03",
    title: "Daily Ritual",
    desc: "Kopi bukan sekadar minuman. Ini adalah ritual pagi, jeda siang, dan penutup hari yang sempurna.",
  },
];

export default async function AboutPage() {
  const [hero, content, values, team] = await Promise.all([
    prisma.heroBanner.findFirst({
      where: { page: "about", status: "Active" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.aboutContent.findFirst(),
    prisma.aboutValue.findMany({ orderBy: { order: "asc" } }),
    prisma.team.findMany({ orderBy: { order: "asc" }, take: 4 }),
  ]);

  const displayValues = values.length > 0 ? values : DEFAULT_VALUES;

  const stats = content
    ? [
        { number: content.stat1Number, label: content.stat1Label },
        { number: content.stat2Number, label: content.stat2Label },
        { number: content.stat3Number, label: content.stat3Label },
        { number: content.stat4Number, label: content.stat4Label },
      ]
    : [
        { number: "2019", label: "Tahun Berdiri" },
        { number: "50+", label: "Menu Tersedia" },
        { number: "10K+", label: "Pelanggan Setia" },
        { number: "1", label: "Lokasi, Penuh Cinta" },
      ];

  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[320px] w-full overflow-hidden">
        {hero ? (
          <Image
            src={`/images/hero/${hero.image}`}
            alt="About Suba Daily"
            fill
            className="object-cover brightness-50"
            priority
          />
        ) : (
          <div className="h-full w-full bg-zinc-900" />
        )}
        <div className="absolute inset-0 flex flex-col items-start justify-end px-6 pb-10 sm:px-12 lg:px-20">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Our Story
          </p>
          <h1 className="text-5xl font-black uppercase leading-none tracking-tight sm:text-7xl lg:text-8xl">
            About Us
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-screen-xl px-6 py-20 sm:px-12 lg:px-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="text-3xl font-black uppercase leading-tight sm:text-4xl">
              {content?.tagline ?? "More Than Just\na Coffee Shop."}
            </h2>
          </div>
          <div className="flex flex-col gap-5 text-white/60">
            <p className="text-base leading-relaxed">
              {content?.intro1 ??
                "Suba Daily lahir dari kecintaan mendalam terhadap kopi dan kebersamaan. Kami percaya bahwa secangkir kopi yang baik bukan hanya soal rasa — tetapi tentang momen, ruang, dan orang-orang di dalamnya."}
            </p>
            <p className="text-base leading-relaxed">
              {content?.intro2 ??
                "Setiap detail di Suba Daily dirancang untuk menghadirkan pengalaman yang jujur: biji kopi pilihan, proses seduh yang teliti, dan suasana yang terasa seperti rumah."}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-screen-xl px-6 sm:px-12 lg:px-20">
        <div className="h-px w-full bg-white/10" />
      </div>

      {/* Values */}
      <section className="mx-auto max-w-screen-xl px-6 py-20 sm:px-12 lg:px-20">
        <p className="mb-12 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
          What We Stand For
        </p>
        <div className="grid grid-cols-1 gap-px border border-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {displayValues.map((val) => (
            <div
              key={val.number}
              className="flex flex-col gap-4 border border-white/10 p-8 transition hover:bg-white/[0.03]">
              <span className="text-xs font-bold text-white/20">
                {val.number}
              </span>
              <h3 className="text-lg font-black uppercase tracking-tight">
                {val.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/50">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10">
        <div className="mx-auto max-w-screen-xl px-6 sm:px-12 lg:px-20">
          <div className="grid grid-cols-2 divide-x divide-white/10 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`flex flex-col gap-1 px-6 py-10 sm:px-10 ${i >= 2 ? "border-t border-white/10 lg:border-t-0" : ""}`}>
                <span className="text-4xl font-black tracking-tight sm:text-5xl">
                  {stat.number}
                </span>
                <span className="text-sm text-white/40">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Break */}
      <section className="mx-auto max-w-screen-xl px-6 py-20 sm:px-12 lg:px-20">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-900">
              {content?.photo1 ? (
                <Image
                  src={`/images/about/${content.photo1}`}
                  alt="Suba Daily"
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg,#1a1a1a 25%,transparent 25%),linear-gradient(-45deg,#1a1a1a 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#1a1a1a 75%),linear-gradient(-45deg,transparent 75%,#1a1a1a 75%)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0,0 10px,10px -10px,-10px 0",
                    backgroundColor: "#111",
                  }}
                />
              )}
            </div>
          </div>
          <div className="col-span-12 flex flex-col justify-end gap-4 lg:col-span-5">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-900">
              {content?.photo2 ? (
                <Image
                  src={`/images/about/${content.photo2}`}
                  alt="Suba Daily"
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg,#1a1a1a 25%,transparent 25%),linear-gradient(-45deg,#1a1a1a 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#1a1a1a 75%),linear-gradient(-45deg,transparent 75%,#1a1a1a 75%)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0,0 10px,10px -10px,-10px 0",
                    backgroundColor: "#111",
                  }}
                />
              )}
            </div>
            <p className="text-sm leading-relaxed text-white/40">
              Setiap sudut Suba Daily dirancang untuk menciptakan pengalaman
              yang terasa intim namun terbuka untuk semua.
            </p>
          </div>
        </div>
      </section>

      {/* Team Preview */}
      {team.length > 0 && (
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-screen-xl px-6 py-20 sm:px-12 lg:px-20">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                  The People
                </p>
                <h2 className="text-3xl font-black uppercase sm:text-4xl">
                  Our Team
                </h2>
              </div>
              <a
                href="/team"
                className="hidden text-sm text-white/40 underline-offset-4 hover:text-white hover:underline transition sm:block">
                Lihat Semua →
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {team.map((member) => (
                <div key={member.id} className="group flex flex-col gap-3">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-zinc-900">
                    {member.image ? (
                      <Image
                        src={
                          member.image.startsWith("/")
                            ? member.image
                            : `/images/team/${member.image}`
                        }
                        alt={member.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-white/10">
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="currentColor">
                          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {member.name}
                    </p>
                    <p className="text-xs text-white/40">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="/team"
              className="mt-8 block text-center text-sm text-white/40 hover:text-white transition sm:hidden">
              Lihat Semua Tim →
            </a>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-screen-xl px-6 py-20 sm:px-12 lg:px-20">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl">
              Come Visit
              <br />
              Us Today.
            </h2>
            <div className="flex flex-col gap-3 sm:items-end">
              <a
                href="/menu"
                className="rounded-full bg-white px-8 py-3 text-sm font-bold text-black transition hover:bg-white/90">
                Lihat Menu
              </a>
              <a
                href="/contact"
                className="rounded-full border border-white/20 px-8 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
