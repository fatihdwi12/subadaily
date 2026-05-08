"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  slug: string;
  status: string;
  order: number;
};

export default function MenuAdminList({
  initialItems,
}: {
  initialItems: MenuItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = items.filter(
    (it) =>
      it.name.toLowerCase().includes(search.toLowerCase()) ||
      it.category.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleDelete(id: string) {
    if (!confirm("Hapus menu ini?")) return;
    const res = await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((it) => it.id !== id));
      showToast("Menu berhasil dihapus.");
    } else {
      showToast("Gagal menghapus.", false);
    }
  }

  async function handleToggleStatus(id: string, current: string) {
    const status = current === "Active" ? "Inactive" : "Active";
    const res = await fetch(`/api/admin/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, status } : it)),
      );
      showToast(`Status diubah ke ${status}.`);
    } else {
      showToast("Gagal mengubah status.", false);
    }
  }

  return (
    <>
      {/* Search */}
      <div className="flex max-w-sm items-center gap-2.5 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2.5 focus-within:border-neutral-600 transition">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="shrink-0 text-neutral-500">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau kategori..."
          className="w-full bg-transparent text-sm text-white placeholder-neutral-600 outline-none"
        />
      </div>

      <p className="text-xs text-neutral-600">
        {filtered.length} dari {items.length} item
      </p>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 py-20 text-neutral-500">
          <p className="text-sm">
            {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada menu"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-800">
          <table className="w-full text-sm text-white">
            <thead className="border-b border-neutral-800 bg-neutral-900 text-xs text-neutral-400">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Gambar</th>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Kategori</th>
                <th className="px-4 py-3 text-left">Harga</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr
                  key={item.id}
                  className="border-b border-neutral-800 bg-black hover:bg-neutral-950 transition">
                  <td className="px-4 py-3 text-neutral-500">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="relative h-10 w-14 overflow-hidden rounded-lg bg-neutral-800">
                      {item.image ? (
                        <Image
                          src={`/images/menu/${item.image}`}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="h-full w-full bg-neutral-700" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-neutral-400">
                    {item.category}
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    Rp. {item.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/menu/${item.id}/edit`}
                        className="rounded-lg px-3 py-1 text-xs border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg px-3 py-1 text-xs border border-red-900/50 text-red-500 hover:bg-red-950 transition">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
