"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Coffee", "Manual Brew", "Tea", "Snack"];

export default function CreateMenuForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Coffee");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("Active");
  const [order, setOrder] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  // Auto-generate slug dari name
  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Nama menu wajib diisi.");
    if (!price) return setError("Harga wajib diisi.");
    if (!slug.trim()) return setError("Slug wajib diisi.");

    try {
      setLoading(true);
      const form = new FormData();
      form.append("name", name);
      form.append("price", price);
      form.append("category", category);
      form.append("slug", slug);
      form.append("status", status);
      form.append("description", description);
      if (order) form.append("order", order);
      if (file) form.append("file", file);

      const res = await fetch("/api/admin/menu", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambahkan.");

      router.push("/admin/menu");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-2xl rounded-[28px] border border-neutral-700 bg-black px-6 py-8 md:px-10 md:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Tambah Menu</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Tambahkan item menu baru
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama */}
          <div>
            <label className="mb-2 block text-sm text-white">Nama Menu</label>
            <input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="contoh: Americano Hot"
              className="h-12 w-full rounded-2xl border border-neutral-600 bg-transparent px-4 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-400"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-2 block text-sm text-white">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="americano-hot"
              className="h-12 w-full rounded-2xl border border-neutral-600 bg-transparent px-4 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-400"
            />
          </div>

          {/* Harga */}
          <div>
            <label className="mb-2 block text-sm text-white">Harga (Rp)</label>
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="15000"
              className="h-12 w-full rounded-2xl border border-neutral-600 bg-transparent px-4 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-400"
            />
          </div>

          {/* Kategori & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm text-white">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12 w-full rounded-2xl border border-neutral-600 bg-neutral-900 px-4 text-sm text-white outline-none focus:border-neutral-400">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-white">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-12 w-full rounded-2xl border border-neutral-600 bg-neutral-900 px-4 text-sm text-white outline-none focus:border-neutral-400">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Order */}
          <div>
            <label className="mb-2 block text-sm text-white">
              Order (opsional)
            </label>
            <input
              type="number"
              min="0"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="Urutan tampil"
              className="h-12 w-full rounded-2xl border border-neutral-600 bg-transparent px-4 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-400"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="mb-2 block text-sm text-white">
              Deskripsi (opsional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Deskripsi singkat menu..."
              className="w-full rounded-2xl border border-neutral-600 bg-transparent px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-400 resize-none"
            />
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="mb-2 block text-sm text-white">
              Gambar (opsional)
            </label>
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
              className="flex min-h-[180px] cursor-pointer items-center justify-center rounded-2xl border border-neutral-600 bg-transparent p-4 transition hover:border-neutral-400">
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
                  alt="Preview"
                  className="max-h-48 rounded-xl object-contain"
                />
              ) : (
                <div className="text-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="mx-auto mb-3 text-neutral-500">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className="text-sm text-neutral-400">
                    Klik untuk upload gambar
                  </p>
                  <p className="mt-1 text-xs text-neutral-600">
                    JPG, PNG, WEBP
                  </p>
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-neutral-100 disabled:opacity-50 transition">
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/menu")}
              className="rounded-xl border border-neutral-600 px-6 py-2.5 text-sm text-white hover:bg-neutral-900 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
