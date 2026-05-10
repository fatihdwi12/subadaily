"use client";

import { useState } from "react";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date;
};

function timeAgo(date: Date) {
  const now = new Date();
  const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${diff}d ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function useToast() {
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const show = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

export default function MessagesManager({
  initialMessages,
}: {
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [selected, setSelected] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const { toast, show } = useToast();

  const unreadCount = messages.filter((m) => !m.read).length;

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.read;
    if (filter === "read") return m.read;
    return true;
  });

  async function handleMarkRead(id: string) {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    if (res.ok) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
      );
      setSelected((prev) => (prev?.id === id ? { ...prev, read: true } : prev));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus pesan ini?")) return;
    const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
      show("Pesan dihapus.");
    } else {
      show("Gagal menghapus.", false);
    }
  }

  async function handleMarkAllRead() {
    const res = await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    if (res.ok) {
      setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
      show("Semua pesan ditandai sudah dibaca.");
    }
  }

  // Auto mark as read saat dibuka
  function handleSelect(msg: Message) {
    setSelected(msg);
    if (!msg.read) handleMarkRead(msg.id);
  }

  return (
    <>
      <div className="flex h-[calc(100vh-0px)] flex-col md:flex-row">
        {/* ── Panel Kiri: List ── */}
        <div
          className={`flex flex-col border-r border-neutral-800 md:w-80 lg:w-96
          ${selected ? "hidden md:flex" : "flex"}`}>
          {/* Header */}
          <div className="border-b border-neutral-800 px-5 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">Messages</h1>
                {unreadCount > 0 && (
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {unreadCount} pesan belum dibaca
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-neutral-400 hover:text-white transition">
                  Tandai semua dibaca
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="mt-4 flex gap-1 rounded-xl bg-neutral-900 p-1">
              {(["all", "unread", "read"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition
                    ${
                      filter === f
                        ? "bg-white text-black"
                        : "text-neutral-400 hover:text-white"
                    }`}>
                  {f === "all"
                    ? `Semua (${messages.length})`
                    : f === "unread"
                      ? `Belum Dibaca (${unreadCount})`
                      : `Dibaca (${messages.length - unreadCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-20 text-neutral-600">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p className="text-sm">Tidak ada pesan</p>
              </div>
            ) : (
              filtered.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className={`w-full border-b border-neutral-800/60 px-5 py-4 text-left transition hover:bg-neutral-900
                    ${selected?.id === msg.id ? "bg-neutral-900" : ""}
                    ${!msg.read ? "bg-neutral-900/40" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Unread dot */}
                      {!msg.read && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                      <p
                        className={`truncate text-sm ${!msg.read ? "font-semibold text-white" : "font-medium text-neutral-300"}`}>
                        {msg.name}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-neutral-600">
                      {timeAgo(msg.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-neutral-500 pl-4">
                    {msg.email}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-xs text-neutral-500 pl-4">
                    {msg.message}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Panel Kanan: Detail ── */}
        <div
          className={`flex flex-1 flex-col ${!selected ? "hidden md:flex" : "flex"}`}>
          {selected ? (
            <>
              {/* Detail Header */}
              <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-5">
                <div className="flex items-center gap-3">
                  {/* Back button mobile */}
                  <button
                    onClick={() => setSelected(null)}
                    className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:text-white transition">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2">
                      <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                  </button>

                  {/* Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-sm font-bold text-white">
                    {selected.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {selected.name}
                    </p>
                    <p className="text-xs text-neutral-500">{selected.email}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!selected.read && (
                    <button
                      onClick={() => handleMarkRead(selected.id)}
                      className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:border-neutral-500 transition">
                      Tandai Dibaca
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-red-950 hover:text-red-400 transition">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Isi Pesan */}
              <div className="flex-1 overflow-y-auto px-6 py-8">
                <div className="mb-6 flex items-center justify-between">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${
                      selected.read
                        ? "bg-neutral-800 text-neutral-400"
                        : "bg-blue-900/60 text-blue-400"
                    }`}>
                    {selected.read ? "Sudah Dibaca" : "Belum Dibaca"}
                  </span>
                  <span className="text-xs text-neutral-600">
                    {new Date(selected.createdAt).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Pesan */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">
                    {selected.message}
                  </p>
                </div>

                {/* Reply via Email */}
                <a
                  href={`mailto:${selected.email}?subject=Re: Pesan dari Suba Daily`}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-white/90 transition">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2">
                    <path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6M3 10l6-6" />
                  </svg>
                  Balas via Email
                </a>
              </div>
            </>
          ) : (
            // Empty state
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-neutral-700">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p className="text-sm">Pilih pesan untuk membacanya</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-xl
          ${toast.ok ? "bg-emerald-900 text-emerald-300" : "bg-red-950 text-red-400"}`}>
          {toast.ok ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}
    </>
  );
}
