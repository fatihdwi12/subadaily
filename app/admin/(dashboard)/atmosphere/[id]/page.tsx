import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AtmosphereDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idNum = parseInt(id);
  if (isNaN(idNum)) notFound();

  const item = await prisma.atmosphere.findUnique({ where: { id: idNum } });
  if (!item) notFound();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link
          href="/admin/atmosphere"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Atmosphere
        </Link>

        {/* Card */}
        <div className="border border-white/10 rounded-2xl bg-black overflow-hidden">

          {/* Gambar — landscape, seperti screenshot */}
          <div className="relative w-full bg-zinc-900" style={{ paddingBottom: "56.25%" }}>
            <div className="absolute inset-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.2" className="text-white/15">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Detail rows */}
          <div className="divide-y divide-white/[0.05]">
            {[
              { label: "Title Atmosphere", value: item.title },
              { label: "Description",      value: item.description },
              { label: "Status",           value: item.status },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between px-6 py-4 gap-6">
                <span className="text-sm text-white/40 shrink-0 w-36">{label}</span>
                <span className={`text-sm font-medium text-right flex-1
                  ${label === "Status" && value === "Active"
                    ? "text-green-400"
                    : label === "Status"
                    ? "text-white/40"
                    : "text-white/80"}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-white/[0.07]">
            <Link
              href={`/admin/atmosphere/${item.id}/edit`}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-white/90 active:scale-[0.98] transition-all"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </Link>
            <Link
              href="/admin/atmosphere"
              className="inline-flex items-center justify-center px-6 py-2.5 border border-white/15 text-white/50 text-sm rounded-full hover:border-white/30 hover:text-white active:scale-[0.98] transition-all"
            >
              Cancel
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}