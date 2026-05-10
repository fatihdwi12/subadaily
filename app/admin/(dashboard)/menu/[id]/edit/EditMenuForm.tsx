"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CATEGORIES = ["Coffee", "Manual Brew", "Tea", "Snack"];

type MenuItem = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  slug: string;
  status: string;
  order: number;
  description?: string | null;
};

export default function EditMenuForm({ item }: { item: MenuItem }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(String(item.price));
  const [category, setCategory] = useState(item.category);
  const [slug, setSlug] = useState(item.slug);
  const [status, setStatus] = useState(item.status);
  const [order, setOrder] = useState(String(item.order));
  const [description, setDescription] = useState(item.description ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Nama menu wajib diisi.");
    if (!price) return setError("Harga wajib diisi.");

    try {
      setLoading(true);
      const form = new FormData();
      form.append("name", name);
      form.append("price", price);
      form.append("category", category);
      form.append("slug", slug);
      form.append("status", status);
      form.append("order", order);
      form.append("description", description);
      if (file) form.append("file", file);

      const res = await fetch(`/api/admin/menu/${item.id}`, {
        method: "PATCH",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengupdate.");

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
          <h1 className="text-3xl font-bold text-white">Edit Menu</h1>
          <p className="mt-2 text-sm text-neutral-400">{item.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-white">Nama Menu</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 w-full rounded-2xl border border-neutral-600 bg-transparent px-4 text-sm text-white outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="h-12 w-full rounded-2xl border border-neutral-600 bg-transparent px-4 text-sm text-white outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Harga (Rp)</label>
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-12 w-full rounded-2xl border border-neutral-600 bg-transparent px-4 text-sm text-white outline-none focus:border-neutral-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm text-white">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12 w-full rounded-2xl border border-neutral-600 bg-neutral-900 px-4 text-sm text-white outline-none">
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
                className="h-12 w-full rounded-2xl border border-neutral-600 bg-neutral-900 px-4 text-sm text-white outline-none">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Order</label>
            <input
              type="number"
              min="0"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="h-12 w-full rounded-2xl border border-neutral-600 bg-transparent px-4 text-sm text-white outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">
              Deskripsi (opsional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-neutral-600 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-neutral-400 resize-none"
            />
          </div>

          {/* Gambar */}
          <div>
            <label className="mb-2 block text-sm text-white">
              Ganti Gambar (opsional)
            </label>
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
              className="flex min-h-[160px] cursor-pointer items-center justify-center rounded-2xl border border-neutral-600 p-4 hover:border-neutral-400 transition">
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
                  alt="Preview baru"
                  className="max-h-40 rounded-xl object-contain"
                />
              ) : item.image ? (
                <div className="relative h-36 w-48 overflow-hidden rounded-xl">
                  <Image
                    src={`/images/menu/${item.image}`}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                </div>
              ) : (
                <p className="text-sm text-neutral-500">
                  Klik untuk ganti gambar
                </p>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-neutral-100 disabled:opacity-50 transition">
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
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
