"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string | null;
};

// ─── Hero Banner ─────────────────────────────────────────────────────────────
function HeroBanner({ src }: { src: string | null }) {
  return (
    <div className="relative h-[280px] sm:h-[340px] w-full overflow-hidden">
      {src ? (
        <Image
          src={src}
          alt="Hero Banner"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      ) : (
        // Fallback checkerboard jika belum ada banner di DB
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(45deg,#e5e5e5 25%,transparent 25%)," +
              "linear-gradient(-45deg,#e5e5e5 25%,transparent 25%)," +
              "linear-gradient(45deg,transparent 75%,#e5e5e5 75%)," +
              "linear-gradient(-45deg,transparent 75%,#e5e5e5 75%)",
            backgroundSize: "48px 48px",
            backgroundPosition: "0 0,0 24px,24px -24px,-24px 0",
            backgroundColor: "#f5f5f5",
          }}
        />
      )}
      {/* Fade to black di bawah */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent to-black" />
    </div>
  );
}

// ─── Team Card (tidak berubah) ────────────────────────────────────────────────
function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="group flex cursor-pointer flex-col rounded-2xl border border-white/15 bg-black p-3 transition-all duration-300 hover:border-white/40 hover:bg-zinc-900/40 sm:rounded-3xl sm:p-4">
      <div
        className="relative mb-4 w-full overflow-hidden rounded-xl bg-zinc-900 sm:rounded-2xl"
        style={{ paddingBottom: "133.33%" }}>
        <div className="absolute inset-0">
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div
              className="h-full w-full"
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
          <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/15 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
        </div>
      </div>
      <div className="px-1 pb-1">
        <p className="truncate text-sm font-bold leading-snug text-white transition-colors duration-200 group-hover:text-white/90 sm:text-base">
          {member.name}
        </p>
        <p className="mt-1 text-xs text-white/45 transition-colors duration-200 group-hover:text-white/65 sm:text-sm">
          {member.role}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OurTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [heroBanner, setHeroBanner] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/team").then((r) => r.json()),
      fetch("/api/hero-banner?page=our-team")
        .then((r) => {
          if (!r.ok) return { image: null }; // ← guard jika 404/500
          return r.json();
        })
        .catch(() => ({ image: null })), // ← guard jika network error
    ])
      .then(([membersData, bannerData]) => {
        setMembers(Array.isArray(membersData) ? membersData : []);
        setHeroBanner(bannerData?.image ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-dvh bg-black">
      {/* Hero — sekarang dinamis dari DB */}
      <HeroBanner src={heroBanner} />

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 pb-28 sm:px-8">
        {/* Search bar */}
        <div className="mb-10 -mt-6 relative z-10">
          <div className="flex items-center gap-3 rounded-full border border-white/20 bg-black px-5 py-3.5 focus-within:border-white/50 transition-colors">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0 text-white/40">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Name, Role"
              className="w-full bg-transparent text-sm text-white placeholder-white/35 outline-none"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl border border-white/10 bg-zinc-900/30 p-3 sm:rounded-3xl sm:p-4">
                <div
                  className="mb-4 w-full animate-pulse rounded-xl bg-zinc-800"
                  style={{ paddingBottom: "133.33%" }}
                />
                <div className="space-y-2 px-1 pb-1">
                  <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-zinc-800" />
                  <div className="h-3 w-1/2 animate-pulse rounded-full bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-28 text-white/30">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p className="text-sm">
              {search
                ? `Tidak ada hasil untuk "${search}"`
                : "Belum ada anggota tim"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
            {filtered.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        )}

        {/* Back button */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="inline-flex min-w-[200px] items-center justify-between gap-6 rounded-full border border-white/25 px-7 py-3.5 text-sm text-white transition-all duration-300 hover:bg-white hover:text-black">
            <span>Kembali ke Home</span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
