"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateMediaForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Active");
  const [order, setOrder] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Judul konten wajib diisi.");
      return;
    }

    if (!file) {
      setError("Foto wajib dipilih.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("status", status);
      formData.append("file", file);

      if (order !== "") {
        formData.append("order", order);
      }

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menambahkan foto.");
      }

      router.push("/admin/media-gallery");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-neutral-700 bg-black px-6 py-8 md:px-11 md:py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Tambah Foto!
          </h1>
          <p className="mt-2 text-base text-neutral-400">
            Tambahkan foto untuk galeri Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
          <div>
            <label className="mb-2 block text-sm text-white">
              Judul Konten
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan Nama Konten"
              className="h-12 w-full rounded-2xl border border-neutral-600 bg-transparent px-4 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-12 w-full rounded-2xl border border-neutral-600 bg-transparent px-4 text-sm text-white outline-none transition focus:border-neutral-400">
              <option value="Active" className="bg-neutral-900">
                Active
              </option>
              <option value="Inactive" className="bg-neutral-900">
                Inactive
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Order</label>
            <input
              type="number"
              min="0"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="Pilih urutan tampilan konten"
              className="h-12 w-full rounded-2xl border border-neutral-600 bg-transparent px-4 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Foto</label>
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
              className="flex min-h-[220px] w-full cursor-pointer items-center justify-center rounded-2xl border border-neutral-600 bg-transparent p-6 transition hover:border-neutral-400">
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
                  alt="Preview foto"
                  className="max-h-64 rounded-xl object-contain"
                />
              ) : (
                <div className="text-center">
                  <div className="mb-4 flex justify-center text-neutral-500">
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className="text-sm text-neutral-300">
                    Klik untuk upload foto
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    JPG, PNG, WEBP, GIF
                  </p>
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-100 disabled:opacity-50">
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/media-gallery")}
              className="rounded-xl border border-neutral-500 px-5 py-2.5 text-sm text-white transition hover:bg-neutral-900">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
