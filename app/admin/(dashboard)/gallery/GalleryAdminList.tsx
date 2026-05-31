"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ tambah import
import Image from "next/image";

type GalleryItem = {
  id: string;
  type: string;
  filename: string;
  thumbnail: string | null;
  title: string | null;
  order: number;
  status: string;
};

export default function GalleryAdminList({
  initialItems,
}: {
  initialItems: GalleryItem[];
}) {
  const router = useRouter(); // ✅ tambah ini
  const [items, setItems] = useState(initialItems);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  async function handleDelete(id: string) {
    if (!confirm("Hapus item ini?")) return;
    const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast("Item dihapus.");
      router.refresh(); // ✅ tambah ini
    } else {
      showToast("Gagal menghapus.", false);
    }
  }

  async function handleToggleStatus(id: string, current: string) {
    const status = current === "Active" ? "Inactive" : "Active";
    const res = await fetch(`/api/admin/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
      showToast(`Status diubah ke ${status}.`);
      router.refresh(); // ✅ tambah ini
    } else {
      showToast("Gagal mengubah status.", false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/20">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        <p className="text-sm">Belum ada item gallery</p>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl
          ${toast.ok ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`group relative rounded-2xl border overflow-hidden bg-zinc-900
              ${item.status === "Active" ? "border-white/10" : "border-white/[0.04] opacity-50"}`}>
            {/* Thumbnail */}
            <div className="relative aspect-video w-full bg-zinc-800">
              {item.type === "video" ? (
                <>
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.title ?? ""}
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/20">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="rounded-full bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                      VIDEO
                    </span>
                  </div>
                </>
              ) : (
                <Image
                  src={`/images/gallery/${item.filename}`}
                  alt={item.title ?? ""}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              )}
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="truncate text-sm font-medium text-white">
                {item.title || (
                  <span className="text-white/30">Tanpa judul</span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-white/30">
                Order: {item.order}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-white/[0.07] px-3 py-2">
              <button
                onClick={() => handleToggleStatus(item.id, item.status)}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition
                  ${
                    item.status === "Active"
                      ? "bg-emerald-900/60 text-emerald-400 hover:bg-emerald-900"
                      : "bg-zinc-800 text-white/30 hover:bg-zinc-700"
                  }`}>
                {item.status}
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="rounded-lg p-1.5 text-red-500/40 transition hover:bg-red-500/10 hover:text-red-400">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
