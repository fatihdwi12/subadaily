"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";

type Item = {
  id: number;
  title: string;
  description: string;
  status: string;
  slug: string;
};

export default function AtmosphereTable({ items }: { items: Item[] }) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus konten ini?")) return;
    await fetch(`/api/atmosphere/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden sm:block border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-900 border-b border-white/10">
              <th className="text-left px-6 py-3.5 font-semibold text-white text-sm rounded-tl-2xl">
                Title Atmoshphere
              </th>
              <th className="text-left px-6 py-3.5 font-semibold text-white text-sm">
                Description
              </th>
              <th className="text-left px-6 py-3.5 font-semibold text-white text-sm">
                Status
              </th>
              <th className="text-left px-6 py-3.5 font-semibold text-white text-sm rounded-tr-2xl">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-6 py-4 text-white/90">{item.title}</td>
                <td className="px-6 py-4 text-white/50 max-w-xs truncate">
                  {item.description}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      item.status === "Active"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-zinc-700 text-white/40"
                    }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/atmosphere/${item.slug}`}
                      target="_blank"
                      className="text-white/50 hover:text-white transition"
                      title="View">
                      <Eye size={17} />
                    </Link>
                    <Link
                      href={`/admin/atmosphere/${item.id}/edit`}
                      className="text-white/50 hover:text-white transition"
                      title="Edit">
                      <Pencil size={17} />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400/70 hover:text-red-400 transition"
                      title="Delete">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-16 text-center text-white/25 text-sm">
                  Belum ada data atmosphere.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden flex flex-col gap-3">
        {items.length === 0 && (
          <p className="text-center text-white/25 py-12 text-sm">
            Belum ada data atmosphere.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-white/10 rounded-xl p-4 bg-zinc-900/50">
            <div className="flex items-start justify-between mb-2">
              <p className="font-medium text-sm text-white">{item.title}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  item.status === "Active"
                    ? "bg-green-500/15 text-green-400"
                    : "bg-zinc-700 text-white/40"
                }`}>
                {item.status}
              </span>
            </div>
            <p className="text-white/40 text-xs mb-4 line-clamp-2">
              {item.description}
            </p>
            <div className="flex items-center gap-3 border-t border-white/10 pt-3">
              <Link
                href={`/atmosphere/${item.slug}`}
                target="_blank"
                className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition">
                <Eye size={14} /> View
              </Link>
              <Link
                href={`/admin/atmosphere/${item.id}/edit`}
                className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition">
                <Pencil size={14} /> Edit
              </Link>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex items-center gap-1.5 text-red-400/70 hover:text-red-400 text-xs transition">
                <Trash2 size={14} /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
