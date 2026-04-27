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

export default function AdminTeamList({
  members: initial,
}: {
  members: Member[];
}) {
  const [members, setMembers] = useState(initial);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err";
  } | null>(null);
  const router = useRouter();

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()),
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

  return (
    <div className="p-6 sm:p-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl
          ${toast.type === "ok" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <div className="border border-white/10 rounded-2xl p-6 sm:p-8 bg-black">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Our Team
          </h1>
          <p className="text-white/40 text-sm mt-1">Put your amazing Team</p>
        </div>

        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-2 border border-white/15 rounded-full px-4 py-2.5 w-full sm:max-w-sm">
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your team"
              className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-full"
            />
          </div>
          <Link
            href="/admin/team/add"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-white/90 transition-all shrink-0">
            Add Member
          </Link>
        </div>

        {/* Table */}
        <div className="border border-white/10 rounded-xl overflow-hidden">
          {/* Table Header */}
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-900 border-b border-white/10">
                <th className="text-left px-4 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider w-20">
                  Foto
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Name of Member
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider w-32">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        className="text-white/15">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                      <p className="text-white/25 text-sm">
                        {search
                          ? "Tidak ada hasil pencarian."
                          : "Belum ada member."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.015] transition-colors">
                    {/* Foto */}
                    <td className="px-4 py-3">
                      <div className="w-8 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                        {m.image ? (
                          <Image
                            src={m.image}
                            alt={m.name}
                            width={44}
                            height={44}
                            loading="eager"
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              className="text-white/20">
                              <circle cx="12" cy="8" r="4" />
                              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3 text-sm text-white/85">
                      {m.name}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3 text-sm text-white/55">
                      {m.role}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* View */}
                        <button
                          onClick={() => router.push(`/admin/team/${m.id}`)}
                          className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                          aria-label="Lihat">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M2 12C4.5 7 8 4.5 12 4.5S19.5 7 22 12c-2.5 5-6 7.5-10 7.5S4.5 17 2 12z" />
                          </svg>
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() =>
                            router.push(`/admin/team/${m.id}/edit`)
                          }
                          className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                          aria-label="Edit">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(m.id)}
                          disabled={isPending}
                          className="p-2 rounded-lg text-red-500/50 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 transition-all"
                          aria-label="Hapus">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8">
                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
