"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export type Banner = {
  id: string;
  page: string;
  image: string;
  status: string;
  createdAt: Date;
};

export default function HeroBannerSection({
  initialBanners,
  page = "our-team", // ← tambah prop ini
}: {
  initialBanners: Banner[];
  page?: string; // ← tambah type ini
}) {
  const [banners, setBanners] = useState(initialBanners);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = file ? URL.createObjectURL(file) : null;
  const activeBanner = banners.find((b) => b.status === "Active") ?? null;

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return showToast("Pilih file terlebih dahulu.", false);
    setLoading(true);
    try {
      const form = new FormData();
      form.append("page", page); // ← ganti "our-team" dengan prop page
      form.append("file", file);
      const res = await fetch("/api/hero-banner", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBanners((prev) => [
        data.banner,
        ...prev.map((b) => ({ ...b, status: "Inactive" })),
      ]);
      setFile(null);
      showToast("Banner berhasil diupload!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal upload.", false);
    } finally {
      setLoading(false);
    }
  }

  // ─── Semua fungsi di bawah ini TIDAK BERUBAH ─────────────────────────────

  async function handleDelete(id: string) {
    if (!confirm("Hapus banner ini?")) return;
    const res = await fetch("/api/hero-banner", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      showToast("Banner dihapus.");
    } else {
      showToast("Gagal menghapus.", false);
    }
  }

  async function handleSetActive(id: string) {
    const res = await fetch(`/api/hero-banner/${id}/activate`, {
      method: "PATCH",
    });
    if (res.ok) {
      setBanners((prev) =>
        prev.map((b) => ({
          ...b,
          status: b.id === id ? "Active" : "Inactive",
        })),
      );
      showToast("Banner diaktifkan.");
    } else {
      showToast("Gagal mengaktifkan.", false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl
          ${toast.ok ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Preview banner aktif */}
      <div className="rounded-2xl border border-white/10 bg-black p-5 sm:p-6">
        <p className="mb-3 text-xs uppercase tracking-widest text-white/30">
          Banner Aktif Saat Ini
        </p>
        <div className="relative h-48 w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900 sm:h-56">
          {activeBanner ? (
            <>
              <Image
                src={activeBanner.image}
                alt="Active banner"
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="rounded-full bg-emerald-900/80 px-3 py-1 text-xs font-medium text-emerald-400">
                  Active
                </span>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-white/20">
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
              <p className="text-sm">Belum ada banner aktif</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload form */}
      <div className="rounded-2xl border border-white/10 bg-black p-5 sm:p-6">
        <p className="mb-4 text-xs uppercase tracking-widest text-white/30">
          Upload Banner Baru
        </p>
        <form onSubmit={handleUpload} className="space-y-4">
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
            className="flex min-h-[160px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-white/15 transition hover:border-white/40">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="preview"
                className="max-h-40 rounded-lg object-contain"
              />
            ) : (
              <div className="text-center">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mx-auto mb-2 text-white/20">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="text-sm text-white/40">Klik untuk pilih gambar</p>
                <p className="mt-1 text-xs text-white/20">
                  JPG, PNG, WEBP — disarankan 1440×400px
                </p>
              </div>
            )}
          </div>

          {file && (
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-2.5">
              <span className="truncate text-sm text-white/60">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="ml-3 shrink-0 text-xs text-white/30 hover:text-white/60 transition-colors">
                Batal
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full rounded-xl bg-white py-2.5 text-sm font-bold text-black transition hover:bg-white/90 disabled:opacity-40">
            {loading ? "Mengupload..." : "Upload & Aktifkan"}
          </button>
        </form>
      </div>

      {/* Riwayat */}
      {banners.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-black p-5 sm:p-6">
          <p className="mb-4 text-xs uppercase tracking-widest text-white/30">
            Riwayat Banner
          </p>
          <div className="flex flex-col gap-3">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors
                  ${banner.status === "Active" ? "border-emerald-900/50 bg-emerald-950/20" : "border-white/[0.07] bg-zinc-900/30"}`}>
                <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                  <Image
                    src={banner.image}
                    alt="banner"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${banner.status === "Active" ? "bg-emerald-900/60 text-emerald-400" : "bg-zinc-800 text-white/30"}`}>
                    {banner.status}
                  </span>
                  <p className="mt-1 text-xs text-white/25">
                    {new Date(banner.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {banner.status === "Inactive" && (
                    <button
                      onClick={() => handleSetActive(banner.id)}
                      title="Aktifkan"
                      className="rounded-lg p-2 text-white/30 transition hover:bg-white/10 hover:text-white">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(banner.id)}
                    title="Hapus"
                    className="rounded-lg p-2 text-red-500/40 transition hover:bg-red-500/10 hover:text-red-400">
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
        </div>
      )}
    </div>
  );
}
