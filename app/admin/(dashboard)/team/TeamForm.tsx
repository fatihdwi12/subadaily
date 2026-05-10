"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createMember, updateMember } from "./actions";

type Member = {
  id: string;
  name: string;
  role: string;
  image: string | null;
};

export default function TeamForm({
  mode,
  member,
}: {
  mode: "add" | "edit";
  member?: Member;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err";
  } | null>(null);

  const [form, setForm] = useState({
    name: member?.name ?? "",
    role: member?.role ?? "",
    image: member?.image ?? "",
  });

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpload = async (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      showToast("Format tidak didukung. Gunakan JPG, PNG, atau WEBP.", "err");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Ukuran file melebihi 5MB.", "err");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload-team", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((f) => ({ ...f, image: data.url }));
    } catch {
      showToast("Gagal upload foto.", "err");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.role.trim()) {
      showToast("Nama dan role wajib diisi.", "err");
      return;
    }
    startTransition(async () => {
      if (mode === "add") {
        const res = await createMember({
          name: form.name,
          role: form.role,
          image: form.image || null,
          order: 999,
        });
        if (res.success) {
          showToast("Member berhasil ditambahkan.");
          setTimeout(() => router.push("/admin/team"), 800);
        } else showToast("Gagal menyimpan.", "err");
      } else if (member) {
        const res = await updateMember(member.id, {
          name: form.name,
          role: form.role,
          image: form.image || null,
        });
        if (res.success) {
          showToast("Member berhasil diperbarui.");
          setTimeout(() => router.push("/admin/team"), 800);
        } else showToast("Gagal memperbarui.", "err");
      }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 sm:p-8 lg:p-10">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl
          ${toast.type === "ok" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10 bg-black">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {mode === "add" ? "Tambah Our Team" : "Edit Member"}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {mode === "add"
              ? "Add your amazing members!"
              : "Perbarui informasi member."}
          </p>
        </div>

        <div className="max-w-xl flex flex-col gap-6">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Masukkan Nama"
              className="bg-transparent border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/40 transition-colors"
            />
          </div>

          {/* Role */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white">Role</label>
            <input
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              placeholder="Masukkan Role Tim Anda"
              className="bg-transparent border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/40 transition-colors"
            />
          </div>

          {/* Foto Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white">Foto</label>
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center gap-3 border rounded-xl p-10 cursor-pointer transition-all duration-200
                ${
                  dragOver
                    ? "border-white/50 bg-white/5"
                    : "border-white/20 hover:border-white/35 hover:bg-white/[0.02]"
                }
                ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
              {form.image ? (
                /* Preview foto */
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-xl overflow-hidden">
                    <Image
                      src={form.image}
                      alt="preview"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white/50 text-xs">
                    Klik untuk ganti foto
                  </span>
                </div>
              ) : (
                /* Upload placeholder */
                <>
                  {uploading ? (
                    <svg
                      className="animate-spin w-9 h-9 text-white/30"
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
                  ) : (
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-white/40">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  )}
                  <div className="text-center">
                    <p className="text-sm font-medium text-white/70">
                      {uploading ? "Mengupload..." : "klik untuk upload foto"}
                    </p>
                    <p className="text-xs text-white/35 mt-1">
                      JPG, PNG, WEBP — Maks 5MB
                    </p>
                  </div>
                </>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={handleFileInput}
              />
            </label>

            {/* Clear foto */}
            {form.image && (
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, image: "" }))}
                className="text-xs text-red-400/60 hover:text-red-400 transition-colors self-start">
                Hapus foto
              </button>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isPending || uploading}
              className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-white/90 disabled:opacity-50 transition-all">
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              onClick={() => router.push("/admin/team")}
              className="px-6 py-2.5 border border-white/20 text-white/70 text-sm font-medium rounded-lg hover:text-white hover:border-white/40 transition-all">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
