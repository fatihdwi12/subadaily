import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function OurTeam() {
  let members: Awaited<ReturnType<typeof prisma.team.findMany>> = [];
  try {
    members = await prisma.team.findMany({
      where: { status: "Active" },
      orderBy: { order: "asc" },
      take: 4,
    });
  } catch {}

  return (
    <section className="bg-black py-14 sm:py-18 lg:py-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Heading */}
        <div className="mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-4">
            //OUR TEAM
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-lg">
            Meet the people behind your daily cup. A dedicated team committed to
            quality, consistency, and great service — because good coffee starts
            with great people.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10 sm:mb-12">
          {members.length > 0
            ? members.map((member) => (
                <TeamCard
                  key={member.id}
                  name={member.name}
                  role={member.role}
                  image={member.image}
                />
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <TeamCard key={i} name="—" role="—" image={null} />
              ))}
        </div>

        {/* More Button */}
        <div className="flex justify-center">
          <Link
            href="/team"
            className="inline-flex items-center justify-between gap-6 border border-white/25 rounded-full px-7 py-3.5 text-white text-sm sm:text-base hover:bg-white hover:text-black transition-all duration-300 min-w-[220px] sm:min-w-[260px]">
            <span>More Ourteam</span>
            <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center shrink-0">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Team Card ── */
function TeamCard({
  name,
  role,
  image,
}: {
  name: string;
  role: string;
  image: string | null;
}) {
  return (
    <div
      className="group flex flex-col border border-white/15 rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-black
      hover:border-white/40 hover:bg-zinc-900/40 transition-all duration-300 cursor-pointer">
      {/* Photo — padding-bottom trick untuk portrait 3:4 */}
      <div
        className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900 mb-4 sm:mb-5"
        style={{ paddingBottom: "133.33%" }}>
        <div className="absolute inset-0">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(45deg,#2a2a2a 25%,transparent 25%)," +
                  "linear-gradient(-45deg,#2a2a2a 25%,transparent 25%)," +
                  "linear-gradient(45deg,transparent 75%,#2a2a2a 75%)," +
                  "linear-gradient(-45deg,transparent 75%,#2a2a2a 75%)",
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0,0 8px,8px -8px,-8px 0px",
              }}
            />
          )}

          {/* Overlay gelap saat hover */}
          <div
            className="absolute inset-0 bg-black/0 group-hover:bg-black/15
            transition-all duration-300 pointer-events-none"
          />

          {/* Gradient bawah foto */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2/5
            bg-gradient-to-t from-black/50 via-black/10 to-transparent
            opacity-70 group-hover:opacity-100
            transition-opacity duration-300 pointer-events-none"
          />
        </div>
      </div>

      {/* Info */}
      <div className="px-1 pb-1">
        <p
          className="text-white font-bold text-sm sm:text-base leading-snug truncate
          group-hover:text-white/90 transition-colors duration-200">
          {name}
        </p>
        <p
          className="text-white/45 text-xs sm:text-sm mt-1 truncate
          group-hover:text-white/65 transition-colors duration-200">
          {role}
        </p>
      </div>
    </div>
  );
}
