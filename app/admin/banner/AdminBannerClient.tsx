"use client";

import { useState, useTransition } from "react";
import {
  createBanner,
  deleteBanner,
  reorderBanner,
  toggleBannerStatus,
} from "./actions";

type Banner = {
  id: string;
  filename: string;
  order: number;
  status: "Active" | "Inactive";
};

export default function AdminBannerClient({
  banners: initialBanners,
}: {
  banners: Banner[];
}) {
  const [banners, setBanners] = useState(initialBanners);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err";
  } | null>(null);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Upload & Create
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["video/mp4", "video/webm", "video/ogg"];
    if (!allowed.includes(file.type)) {
      showToast(
        "Format video tidak didukung. Gunakan MP4, WebM, atau OGG.",
        "err",
      );
      return;
    }
    if (banners.length >= 6) {
      showToast("Maksimal 6 banner video.", "err");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-banner", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      startTransition(async () => {
        const result = await createBanner(data.filename, banners.length + 1);
        if (result.success && result.banner) {
          setBanners((prev) => [...prev, result.banner as Banner]);
          showToast("Banner berhasil ditambahkan.");
        }
      });
    } catch {
      showToast("Gagal mengupload video.", "err");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Delete
  const handleDelete = (id: string, filename: string) => {
    if (!confirm("Hapus banner ini?")) return;
    startTransition(async () => {
      const result = await deleteBanner(id, filename);
      if (result.success) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        showToast("Banner dihapus.");
      } else {
        showToast("Gagal menghapus banner.", "err");
      }
    });
  };

  // Toggle status
  const handleToggle = (id: string) => {
    startTransition(async () => {
      const result = await toggleBannerStatus(id);
      if (result.success && result.banner) {
        setBanners((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, status: result.banner!.status } : b,
          ),
        );
      }
    });
  };

  // Move order
  const handleMove = (index: number, direction: "up" | "down") => {
    const newBanners = [...banners];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newBanners.length) return;

    [newBanners[index], newBanners[swapIndex]] = [
      newBanners[swapIndex],
      newBanners[index],
    ];
    const updated = newBanners.map((b, i) => ({ ...b, order: i + 1 }));
    setBanners(updated);

    startTransition(async () => {
      await reorderBanner(updated.map((b) => ({ id: b.id, order: b.order })));
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300
            ${toast.type === "ok" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
              Admin
            </p>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Video Banner
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {banners.length}/6 banner aktif
            </p>
          </div>

          {/* Upload Button */}
          <label
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200
              ${
                banners.length >= 6 || uploading
                  ? "bg-white/10 text-white/30 cursor-not-allowed"
                  : "bg-white text-black hover:bg-white/90"
              }`}>
            {uploading ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  />
                </svg>
                Mengupload...
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload Video
              </>
            )}
            <input
              type="file"
              accept="video/mp4,video/webm,video/ogg"
              className="hidden"
              disabled={banners.length >= 6 || uploading}
              onChange={handleUpload}
            />
          </label>
        </div>

        {/* Banner List */}
        {banners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 border border-dashed border-white/10 rounded-2xl">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-white/20">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="m10 8 5 3-5 3V8z" fill="currentColor" stroke="none" />
              <path d="M8 21h8M12 17v4" />
            </svg>
            <p className="text-white/30 text-sm">
              Belum ada banner. Upload video pertama.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className="flex items-center gap-3 sm:gap-4 bg-zinc-900 border border-white/[0.07] rounded-xl px-4 py-3 sm:px-5 sm:py-4">
                {/* Order Badge */}
                <span className="w-7 h-7 rounded-full bg-white/10 text-white/50 text-xs font-bold flex items-center justify-center shrink-0">
                  {banner.order}
                </span>

                {/* Video Preview */}
                <div className="w-24 sm:w-32 aspect-video rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                  <video
                    src={`/videos/${banner.filename}`}
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {banner.filename}
                  </p>
                  <button
                    onClick={() => handleToggle(banner.id)}
                    disabled={isPending}
                    className={`mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all
                      ${
                        banner.status === "Active"
                          ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                          : "bg-white/10 text-white/40 hover:bg-white/15"
                      }`}>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${banner.status === "Active" ? "bg-emerald-400" : "bg-white/30"}`}
                    />
                    {banner.status}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Move Up */}
                  <button
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0 || isPending}
                    className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    aria-label="Pindah ke atas">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5">
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => handleMove(index, "down")}
                    disabled={index === banners.length - 1 || isPending}
                    className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    aria-label="Pindah ke bawah">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(banner.id, banner.filename)}
                    disabled={isPending}
                    className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20 transition-all"
                    aria-label="Hapus banner">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <p className="text-white/20 text-xs mt-6 text-center">
          Urutan banner menentukan urutan tampil. Format: MP4, WebM, OGG. Maks.
          6 video.
        </p>
      </div>
    </div>
  );
}
