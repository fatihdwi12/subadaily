"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AtmosphereItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  slug: string;
  date: Date;
  status: string;
};

export default function EditAtmosphereForm({ item }: { item: AtmosphereItem }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: item.title,
    description: item.description,
    image: item.image,
    slug: item.slug,
    date: new Date(item.date).toISOString().split("T")[0],
    status: item.status,
  });
  const [preview, setPreview] = useState<string | null>(item.image || null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/atmosphere/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/atmosphere");
      router.refresh();
    } else {
      alert("Gagal menyimpan perubahan.");
    }

    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setForm({ ...form, title, slug });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const data = new FormData();
    data.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: data });
    const json = await res.json();

    setForm((prev) => ({ ...prev, image: json.path }));
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="Judul">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleTitleChange}
          className={inputClass}
          required
        />
      </Field>

      <Field label="Slug">
        <input
          type="text"
          name="slug"
          value={form.slug}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </Field>

      {/* Upload Gambar */}
      <Field label="Foto">
        <label className="flex flex-col items-center justify-center border border-dashed border-white/20 rounded-xl p-4 cursor-pointer hover:border-white/40 transition group">
          {preview ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <p className="text-white text-xs">Klik untuk ganti foto</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white/30">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-white/40 text-sm">Klik untuk upload foto</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {uploading && (
          <p className="text-white/40 text-xs mt-1.5 animate-pulse">
            Mengupload foto...
          </p>
        )}
        {form.image && !uploading && (
          <p className="text-green-400/70 text-xs mt-1.5">✓ {form.image}</p>
        )}
      </Field>

      <Field label="Tanggal">
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </Field>

      <Field label="Status">
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className={inputClass}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </Field>

      <Field label="Deskripsi">
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className={`${inputClass} resize-none`}
          required
        />
      </Field>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-white text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-white/90 transition disabled:opacity-50">
          {loading ? "Menyimpan..." : "Update"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg border border-white/20 text-sm hover:border-white/50 transition">
          Batal
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "bg-zinc-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 transition w-full";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-white/60">{label}</label>
      {children}
    </div>
  );
}
