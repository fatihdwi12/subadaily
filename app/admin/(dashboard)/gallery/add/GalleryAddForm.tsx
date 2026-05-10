"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function GalleryAddForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = file ? URL.createObjectURL(file) : null;
  const isVideo = file?.type.startsWith("video/");

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return showToast("Pilih file terlebih dahulu.", false);
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", title);
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast("Berhasil ditambahkan!");
      setTimeout(() => router.push("/admin/gallery"), 800);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal.", false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 sm:p-8 lg:p-10">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl
          ${toast.ok ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-xl mx-auto border border-white/10 rounded-2xl p-6 sm:p-8 bg-black">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Tambah Gallery</h1>
          <p className="text-white/40 text-sm mt-1">Upload foto atau video</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white">
              Judul (opsional)
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul"
              className="bg-transparent border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/40 transition-colors"
            />
          </div>

          {/* Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white">File</label>
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
              className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border border-white/15 transition hover:border-white/40">
              <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {previewUrl ? (
                isVideo ? (
                  <video
                    src={previewUrl}
                    className="max-h-48 rounded-lg"
                    controls
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="max-h-48 rounded-lg object-contain"
                  />
                )
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
                  <p className="text-sm text-white/40">Klik untuk pilih file</p>
                  <p className="mt-1 text-xs text-white/20">
                    JPG, PNG, WEBP, MP4, MOV
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
                  className="ml-3 shrink-0 text-xs text-white/30 hover:text-white/60">
                  Batal
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || !file}
              className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-white/90 disabled:opacity-50 transition-all">
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/gallery")}
              className="px-6 py-2.5 border border-white/20 text-white/70 text-sm font-medium rounded-lg hover:text-white hover:border-white/40 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
