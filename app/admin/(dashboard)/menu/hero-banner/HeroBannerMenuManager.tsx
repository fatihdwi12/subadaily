"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type BannerItem = {
  id: string;
  page: string;
  image: string;
  status: string;
  createdAt: Date;
};

function useToast() {
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const show = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

export default function HeroBannerMenuManager({
  initialItems,
}: {
  initialItems: BannerItem[];
}) {
  const { toast, show } = useToast();
  const [items, setItems] = useState(initialItems);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = file ? URL.createObjectURL(file) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!file) return setError("Pilih gambar terlebih dahulu.");

    try {
      setLoading(true);
      const form = new FormData();
      form.append("page", "menu");
      form.append("status", status);
      form.append("file", file);

      const res = await fetch("/api/admin/menu/hero-banner", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambahkan.");

      setItems((prev) => [data.item, ...prev]);
      setFile(null);
      show("Banner berhasil ditambahkan.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(id: string, current: string) {
    const newStatus = current === "Active" ? "Inactive" : "Active";
    const res = await fetch(`/api/admin/menu/hero-banner/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, status: newStatus } : it)),
      );
      show(`Status diubah ke ${newStatus}.`);
    } else {
      show("Gagal mengubah status.", false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus banner ini?")) return;
    const res = await fetch(`/api/admin/menu/hero-banner/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setItems((prev) => prev.filter((it) => it.id !== id));
      show("Banner dihapus.");
    } else {
      show("Gagal menghapus.", false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-8 p-6 md:p-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Hero Banner Menu</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Kelola banner untuk halaman menu
          </p>
        </div>

        {/* Form Upload */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
          <h2 className="mb-5 text-base font-semibold text-white">
            Upload Banner Baru
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-11 w-full max-w-xs rounded-xl border border-neutral-700 bg-neutral-900 px-4 text-sm text-white outline-none focus:border-neutral-500">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white">
                Gambar Banner
              </label>
              <div
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) =>
                  e.key === "Enter" && inputRef.current?.click()
                }
                className="flex min-h-[180px] cursor-pointer items-center justify-center rounded-xl border border-neutral-700 transition hover:border-neutral-500">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                {previewUrl ? (
                  <div className="relative h-40 w-full overflow-hidden rounded-xl">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="mx-auto mb-2 text-neutral-600">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p className="text-sm text-neutral-500">
                      Klik untuk upload
                    </p>
                    <p className="mt-1 text-xs text-neutral-600">
                      JPG, PNG, WEBP — Rasio 16:9 direkomendasikan
                    </p>
                  </div>
                )}
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-neutral-100 disabled:opacity-50 transition">
              {loading ? "Menyimpan..." : "Simpan Banner"}
            </button>
          </form>
        </div>

        {/* List Banner */}
        <div>
          <h2 className="mb-4 text-base font-semibold text-white">
            Banner Tersimpan ({items.length})
          </h2>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800 py-16 text-neutral-600">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              <p className="text-sm">Belum ada banner</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 rounded-2xl border px-4 py-3 transition
                    ${
                      item.status === "Active"
                        ? "border-neutral-700 bg-neutral-900"
                        : "border-neutral-800 bg-neutral-900/30 opacity-60"
                    }`}>
                  {/* Thumbnail */}
                  <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                    <Image
                      src={`/images/hero/${item.image}`}
                      alt="banner"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      {item.image}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleStatus(item.id, item.status)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition hover:opacity-75
                        ${
                          item.status === "Active"
                            ? "bg-emerald-900/60 text-emerald-400"
                            : "bg-neutral-800 text-neutral-400"
                        }`}>
                      {item.status}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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
              ))}
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
