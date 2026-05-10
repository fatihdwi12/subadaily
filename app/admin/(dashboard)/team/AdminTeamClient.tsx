"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { createMember, updateMember, deleteMember } from "./actions";

type Member = {
  id: string;
  name: string;
  role: string;
  image: string | null;
  order: number;
  status: string;
};

type ModalMode = "add" | "edit" | "view" | null;

export default function AdminTeamClient({
  members: initial,
}: {
  members: Member[];
}) {
  const [members, setMembers] = useState(initial);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Member | null>(null);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err";
  } | null>(null);

  // Form state
  const [form, setForm] = useState({ name: "", role: "", image: "" });

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setForm({ name: "", role: "", image: "" });
    setSelected(null);
    setModal("add");
  };

  const openEdit = (m: Member) => {
    setForm({ name: m.name, role: m.role, image: m.image ?? "" });
    setSelected(m);
    setModal("edit");
  };

  const openView = (m: Member) => {
    setSelected(m);
    setModal("view");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  // Upload foto
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
      e.target.value = "";
    }
  };

  // Save (Add / Edit)
  const handleSave = () => {
    if (!form.name.trim() || !form.role.trim()) {
      showToast("Nama dan role wajib diisi.", "err");
      return;
    }
    startTransition(async () => {
      if (modal === "add") {
        const res = await createMember({
          name: form.name,
          role: form.role,
          image: form.image || null,
          order: members.length + 1,
        });
        if (res.success && res.member) {
          setMembers((prev) => [...prev, res.member as Member]);
          showToast("Member berhasil ditambahkan.");
          closeModal();
        } else showToast("Gagal menambahkan member.", "err");
      } else if (modal === "edit" && selected) {
        const res = await updateMember(selected.id, {
          name: form.name,
          role: form.role,
          image: form.image || null,
        });
        if (res.success && res.member) {
          setMembers((prev) =>
            prev.map((m) =>
              m.id === selected.id ? (res.member as Member) : m,
            ),
          );
          showToast("Member berhasil diperbarui.");
          closeModal();
        } else showToast("Gagal memperbarui member.", "err");
      }
    });
  };

  // Delete
  const handleDelete = (id: string) => {
    if (!confirm("Hapus member ini?")) return;
    startTransition(async () => {
      const res = await deleteMember(id);
      if (res.success) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        showToast("Member dihapus.");
      } else showToast("Gagal menghapus member.", "err");
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6 lg:p-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg
          ${toast.type === "ok" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Card Container */}
      <div className="max-w-5xl mx-auto border border-white/10 rounded-2xl p-6 sm:p-8 bg-black">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Our Team
          </h1>
          <p className="text-white/40 text-sm mt-1">Put your amazing Team</p>
        </div>

        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-full px-4 py-2.5 w-full sm:max-w-xs">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white/40 shrink-0">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your team"
              className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-full"
            />
          </div>

          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-white/90 transition-all shrink-0">
            Add Member
          </button>
        </div>

        {/* Table */}
        <div className="border border-white/10 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[80px_1fr_1fr_120px] bg-zinc-900 border-b border-white/10">
            {["Foto", "Name of Member", "Role", "Action"].map((h) => (
              <div
                key={h}
                className="px-4 py-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-white/30 text-sm">
              {search
                ? "Tidak ada hasil pencarian."
                : "Belum ada member. Klik Add Member."}
            </div>
          ) : (
            filtered.map((m) => (
              <div
                key={m.id}
                className="grid grid-cols-[80px_1fr_1fr_120px] items-center border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02] transition-colors">
                {/* Foto */}
                <div className="px-4 py-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage:
                            "linear-gradient(45deg,#333 25%,transparent 25%)," +
                            "linear-gradient(-45deg,#333 25%,transparent 25%)," +
                            "linear-gradient(45deg,transparent 75%,#333 75%)," +
                            "linear-gradient(-45deg,transparent 75%,#333 75%)",
                          backgroundSize: "8px 8px",
                          backgroundPosition: "0 0,0 4px,4px -4px,-4px 0px",
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Name */}
                <div className="px-4 py-3 text-sm text-white/90 truncate">
                  {m.name}
                </div>

                {/* Role */}
                <div className="px-4 py-3 text-sm text-white/60 truncate">
                  {m.role}
                </div>

                {/* Actions */}
                <div className="px-4 py-3 flex items-center gap-2">
                  {/* View */}
                  <button
                    onClick={() => openView(m)}
                    className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Lihat">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M2 12C4.5 7 8 4.5 12 4.5S19.5 7 22 12c-2.5 5-6 7.5-10 7.5S4.5 17 2 12z" />
                    </svg>
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEdit(m)}
                    className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Edit">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(m.id)}
                    disabled={isPending}
                    className="p-1.5 rounded-lg text-red-500/60 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 transition-all"
                    aria-label="Hapus">
                    <svg
                      width="16"
                      height="16"
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
            ))
          )}
        </div>
      </div>

      {/* Modal Add / Edit / View */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">
                {modal === "add"
                  ? "Add Member"
                  : modal === "edit"
                    ? "Edit Member"
                    : "Detail Member"}
              </h2>
              <button
                onClick={closeModal}
                className="text-white/40 hover:text-white transition-colors">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {modal === "view" && selected ? (
              /* View Mode */
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-800">
                  {selected.image ? (
                    <Image
                      src={selected.image}
                      alt={selected.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-white/20">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg">
                    {selected.name}
                  </p>
                  <p className="text-white/50 text-sm mt-1">{selected.role}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${selected.status === "Active" ? "bg-emerald-500/15 text-emerald-400" : "bg-white/10 text-white/40"}`}>
                  {selected.status}
                </span>
              </div>
            ) : (
              /* Add / Edit Form */
              <div className="flex flex-col gap-4">
                {/* Foto Upload */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider">
                    Foto
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                      {form.image ? (
                        <Image
                          src={form.image}
                          alt="preview"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <label
                      className={`text-sm px-4 py-2 rounded-full border border-white/20 cursor-pointer
                      hover:bg-white/10 transition-all ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                      {uploading ? "Mengupload..." : "Pilih Foto"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/50 uppercase tracking-wider">
                    Nama
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Nama lengkap"
                    className="bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                {/* Role */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/50 uppercase tracking-wider">
                    Role
                  </label>
                  <input
                    value={form.role}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, role: e.target.value }))
                    }
                    placeholder="Barista, Manager, dll."
                    className="bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-2.5 rounded-full border border-white/15 text-sm text-white/60 hover:text-white hover:border-white/30 transition-all">
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isPending || uploading}
                    className="flex-1 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-white/90 disabled:opacity-50 transition-all">
                    {isPending ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
