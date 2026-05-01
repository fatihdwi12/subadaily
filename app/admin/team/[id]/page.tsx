import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MemberDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const member = await prisma.team.findUnique({ where: { id: params.id } });
  if (!member) notFound();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-black p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Detail Member</h1>
          <Link
            href="/admin/team"
            className="text-sm text-white/40 hover:text-white transition-colors">
            ← Kembali
          </Link>
        </div>

        {/* Photo */}
        <div className="mx-auto mb-6 w-40">
          <div
            className="relative w-full overflow-hidden rounded-2xl bg-zinc-900"
            style={{ paddingBottom: "133.33%" }}>
            <div className="absolute inset-0">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="160px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/20">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          {[
            { label: "Nama", value: member.name },
            { label: "Role", value: member.role },
            { label: "Status", value: member.status },
            { label: "Order", value: String(member.order) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 px-4 py-3">
              <p className="mb-1 text-xs text-white/40">{label}</p>
              <p className="text-sm font-medium text-white">{value}</p>
            </div>
          ))}
        </div>

        <Link
          href={`/admin/team/${member.id}/edit`}
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-white py-2.5 text-sm font-bold text-black transition hover:bg-white/90">
          Edit Member
        </Link>
      </div>
    </div>
  );
}
