"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteMember } from "./actions";

type Member = {
  id: string;
  name: string;
  role: string;
  image: string | null;
  order: number;
  status: string;
};

// ── Icon SVGs ──
const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="3" />
    <path d="M2 12C4.5 7 8 4.5 12 4.5S19.5 7 22 12c-2.5 5-6 7.5-10 7.5S4.5 17 2 12z" />
  </svg>
);
const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/20">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

export default function AdminTeamList({ members: initial }: { members: Member[] }) {
  const [members, setMembers] = useState(initial);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const router = useRouter();

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (!confirm("Hapus member ini?")) return;
    startTransition(async () => {
      const res = await deleteMember(id);
      if (res.success) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        showToast("Member berhasil dihapus.");
      } else {
        showToast("Gagal menghapus.", "err");
      }
    });
  };

  // ── Foto thumbnail ──
const Avatar = ({ m, size = "sm" }: { m: Member; size?: "sm" | "md" }) => {
  const cls = size === "md" ? "w-10 h-12 rounded-lg" : "w-8 h-10 rounded-md";
  return (
    <div className={`${cls} overflow-hidden bg-zinc-800 shrink-0 flex items-center justify-center`}>
      {m.image ? (
        <Image
          src={m.image}
          alt={m.name}
          width={40}
          height={48}
          loading="eager"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
        />
      ) : <IconUser />}
    </div>
  );
};

  // ── Tombol aksi ──
  const Actions = ({ m }: { m: Member }) => (
    <div className="flex items-center gap-0.5 shrink-0">
      <button onClick={() => router.push(`/admin/team/${m.id}`)}
        className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
        aria-label="Lihat">
        <IconEye />
      </button>
      <button onClick={() => router.push(`/admin/team/${m.id}/edit`)}
        className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
        aria-label="Edit">
        <IconEdit />
      </button>
      <button onClick={() => handleDelete(m.id)} disabled={isPending}
        className="p-2 rounded-lg text-red-500/50 hover:text-red-400 hover:bg-red-500/10 active:scale-95 disabled:opacity-30 transition-all"
        aria-label="Hapus">
        <IconTrash />
      </button>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl
          ${toast.type === "ok" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <div className="border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 bg-black">

        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Our Team</h1>
          <p className="text-white/40 text-sm mt-1">Put your amazing Team</p>
        </div>

        {/* Search + Add */}
        <div className="flex gap-2 sm:gap-3 items-center mb-5 sm:mb-6">
          <div className="flex items-center gap-2 border border-white/15 rounded-full px-3.5 py-2.5 flex-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" className="text-white/40 shrink-0">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your team"
              className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-full"
            />
          </div>
          <Link
            href="/admin/team/add"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-white/90 transition-all shrink-0 min-w-[140px]"
          >
            {/* Plus icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Add Member</span>
          </Link>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="border border-white/10 rounded-xl py-16 flex flex-col items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.2" className="text-white/15">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <p className="text-white/25 text-sm">
              {search ? "Tidak ada hasil pencarian." : "Belum ada member."}
            </p>
          </div>
        ) : (
          <>
            {/* ── MOBILE: Card list ── */}
            <div className="flex flex-col gap-2 sm:hidden">
              {filtered.map((m) => (
                <div key={m.id}
                  className="flex items-center gap-3 border border-white/[0.07] rounded-xl px-3 py-3 bg-zinc-900/30">
                  <Avatar m={m} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/90 truncate">{m.name}</p>
                    <p className="text-xs text-white/40 mt-0.5 truncate">{m.role}</p>
                  </div>
                  <Actions m={m} />
                </div>
              ))}
            </div>

            {/* ── DESKTOP: Tabel ── */}
            <div className="hidden sm:block border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-900 border-b border-white/10">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider w-16">Foto</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Name of Member</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider w-32">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr key={m.id}
                      className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.015] transition-colors">
                      <td className="px-4 py-3"><Avatar m={m} /></td>
                      <td className="px-4 py-3 text-sm text-white/85">{m.name}</td>
                      <td className="px-4 py-3 text-sm text-white/55">{m.role}</td>
                      <td className="px-4 py-3"><Actions m={m} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>
    </div>
  );
}