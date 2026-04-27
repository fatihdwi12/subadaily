import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await prisma.team.findUnique({ where: { id } });
  if (!member) notFound();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link
          href="/admin/team"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Our Team
        </Link>

        {/* Card */}
        <div className="border border-white/10 rounded-2xl bg-black overflow-hidden">

          {/* Top: Foto + Nama */}
          <div className="flex items-start gap-5 p-6 border-b border-white/[0.07]">

            {/* Foto — kecil, tidak full screen */}
            <div
              className="relative shrink-0 rounded-xl overflow-hidden bg-zinc-900"
              style={{ width: "96px", paddingBottom: "120px" }}
            >
              <div className="absolute inset-0">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="96px"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.2" className="text-white/20">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Nama + Role + Status */}
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="text-xl font-bold text-white leading-snug mb-1">
                {member.name}
              </h1>
              <p className="text-white/50 text-sm mb-3">{member.role}</p>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium
                ${member.status === "Active"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-zinc-500/15 text-zinc-400"}`}>
                {member.status}
              </span>
            </div>
          </div>

          {/* Detail rows */}
          <div className="divide-y divide-white/[0.05]">
            {[
              { label: "Nama Lengkap", value: member.name },
              { label: "Role / Jabatan", value: member.role },
              { label: "Urutan Tampil", value: `#${member.order}` },
              { label: "Status", value: member.status },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-6 py-3.5">
                <span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
                <span className="text-sm text-white/80 font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-white/[0.07]">
            <Link
              href={`/admin/team/${member.id}/edit`}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-white/90 transition-all"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Member
            </Link>
            <Link
              href="/admin/team"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-white/15 text-white/50 text-sm rounded-full hover:border-white/30 hover:text-white transition-all"
            >
              Kembali
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}