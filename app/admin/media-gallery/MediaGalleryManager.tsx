"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type MediaRecord = {
  id: string;
  type: string;
  filename: string;
  thumbnail: string | null;
  title: string | null;
  status: string;
  order: number;
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const show = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

// ─── Media Row ────────────────────────────────────────────────────────────────
function MediaRow({
  item,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
  onToggleStatus,
}: {
  item: MediaRecord;
  index: number;
  total: number;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, current: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const thumbSrc =
    item.type === "video"
      ? item.thumbnail
        ? `/images/${item.thumbnail}`
        : null
      : `/images/${item.filename}`;

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-neutral-900 border border-neutral-800 px-5 py-4 transition-colors hover:border-neutral-700">
      {/* Order number */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-700 text-xs font-semibold text-neutral-300">
        {index + 1}
      </div>

      {/* Thumbnail */}
      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
        {thumbSrc ? (
          <Image
            src={thumbSrc}
            alt={item.title ?? item.filename}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(45deg,#3a3a3a 25%,transparent 25%),linear-gradient(-45deg,#3a3a3a 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#3a3a3a 75%),linear-gradient(-45deg,transparent 75%,#3a3a3a 75%)",
              backgroundSize: "12px 12px",
              backgroundPosition: "0 0,0 6px,6px -6px,-6px 0",
              backgroundColor: "#2a2a2a",
            }}
          />
        )}
        {item.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/60">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-sm font-medium text-white">
          {item.title ?? item.filename}
        </p>
        <button
          onClick={() => onToggleStatus(item.id, item.status)}
          className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-70 ${
            item.status === "Active"
              ? "bg-emerald-900/60 text-emerald-400"
              : "bg-neutral-700 text-neutral-400"
          }`}>
          · {item.status}
        </button>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={() => onMoveDown(item.id)}
          disabled={index === total - 1}
          aria-label="Turunkan urutan"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 transition-colors">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => onMoveUp(item.id)}
          disabled={index === 0}
          aria-label="Naikkan urutan"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 transition-colors">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={async () => {
            if (!confirm("Hapus media ini?")) return;
            setDeleting(true);
            await onDelete(item.id);
            setDeleting(false);
          }}
          disabled={deleting}
          aria-label="Hapus"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-red-950 hover:text-red-400 disabled:opacity-50 transition-colors">
          {deleting ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="animate-spin">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
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
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main Manager ─────────────────────────────────────────────────────────────
export default function MediaGalleryManager({
  initialItems,
}: {
  initialItems: MediaRecord[];
}) {
  const [items, setItems] = useState<MediaRecord[]>(initialItems);
  const [search, setSearch] = useState("");
  const { toast, show } = useToast();

  const filtered = items.filter(
    (it) =>
      it.filename.toLowerCase().includes(search.toLowerCase()) ||
      (it.title ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleMoveUp = useCallback(
    async (id: string) => {
      const idx = items.findIndex((it) => it.id === id);
      if (idx <= 0) return;
      const next = [...items];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      setItems(next);
      await fetch(`/api/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", newOrder: idx - 1 }),
      });
    },
    [items],
  );

  const handleMoveDown = useCallback(
    async (id: string) => {
      const idx = items.findIndex((it) => it.id === id);
      if (idx >= items.length - 1) return;
      const next = [...items];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      setItems(next);
      await fetch(`/api/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", newOrder: idx + 1 }),
      });
    },
    [items],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((it) => it.id !== id));
        show("Media berhasil dihapus.");
      } else {
        show("Gagal menghapus media.", false);
      }
    },
    [show],
  );

  const handleToggleStatus = useCallback(
    async (id: string, current: string) => {
      const nextStatus = current === "Active" ? "Inactive" : "Active";
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", status: nextStatus }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, status: nextStatus } : it)),
        );
      }
    },
    [],
  );

  return (
    <>
      <div className="flex flex-col gap-6 p-6 md:p-8">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Media Gallery</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Put your amazing Gallery
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 max-w-sm items-center gap-2.5 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2.5 focus-within:border-neutral-600 transition-colors">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0 text-neutral-500">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your Content"
              className="w-full bg-transparent text-sm text-white placeholder-neutral-600 outline-none"
            />
          </div>

          <Link
            href="/admin/media-gallery/create"
            className="shrink-0 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-neutral-100 active:bg-neutral-200 transition-colors">
            Add Content
          </Link>
        </div>

        {/* Count */}
        <p className="text-xs text-neutral-600">
          {filtered.length} dari {items.length} item
        </p>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 py-20 text-neutral-500">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <p className="text-sm">
              {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada media"}
            </p>
            {!search && (
              <Link
                href="/admin/media-gallery/create"
                className="mt-1 text-xs text-neutral-400 hover:text-white transition-colors">
                + Tambah media pertama
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((item, i) => (
              <MediaRow
                key={item.id}
                item={item}
                index={i}
                total={filtered.length}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-xl transition-all ${
            toast.ok
              ? "bg-emerald-900 text-emerald-300"
              : "bg-red-950 text-red-400"
          }`}>
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
