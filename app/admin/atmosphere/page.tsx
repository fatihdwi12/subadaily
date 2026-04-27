import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AtmosphereTable from "@/app/admin/components/AtmosphereTable";

export default async function AtmosphereAdmin({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  const items = await prisma.atmosphere.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { date: "desc" },
  });

  return (
    <div className="p-1">
      <div className="border border-white/15 mt-10 rounded-2xl p-6 sm:p-8 bg-zinc-950/60">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Atmosphere
        </h1>
        <p className="text-white/40 text-sm mb-6">
          Make your amazing atmosphere
        </p>

        <div className="flex items-center justify-between gap-4 mb-6">
          <form method="GET" className="flex-1 max-w-xs">
            <div className="flex items-center gap-2 bg-transparent border border-white/20 rounded-full px-4 py-2">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white/40 shrink-0">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                name="q"
                defaultValue={q}
                placeholder="Search Atmosphere"
                className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-full"
              />
            </div>
          </form>
          <Link
            href="/admin/atmosphere/create"
            className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-white/90 transition whitespace-nowrap">
            Add Content
          </Link>
        </div>

        <AtmosphereTable items={items} />
      </div>
    </div>
  );
}
