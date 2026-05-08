"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/layout/Navbar";

type MenuItem = {
  id: string | number;
  name: string;
  price: number;
  image: string | null;
  category: string;
  slug: string;
  status: string;
};

const CATEGORIES = ["All", "Coffee", "Manual Brew", "Tea", "Snack"];

function formatRupiah(n: number) {
  return "Rp. " + n.toLocaleString("id-ID");
}

// ← MenuCard tidak boleh ada Navbar di dalamnya
function MenuCard({ item }: { item: MenuItem }) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-black overflow-hidden transition hover:border-white/25">
      {/* Image */}
      <div
        className="relative aspect-square w-full bg-white/5 m-3 rounded-xl overflow-hidden"
        style={{ maxHeight: 140 }}>
        {item.image ? (
          <Image
            src={`/images/menu/${item.image}`}
            alt={item.name}
            fill
            className="object-cover"
            sizes="200px"
          />
        ) : (
          <div className="w-full h-full bg-white rounded-xl" />
        )}
      </div>

      {/* Info */}
      <div className="px-3 pb-1">
        <p className="text-sm font-semibold text-white truncate">{item.name}</p>
        <p className="text-sm text-white/60 mt-0.5">
          {formatRupiah(item.price)}
        </p>
      </div>

      {/* Action */}
      <div className="px-3 pb-3 mt-auto pt-2">
        <Link
          href={`/menu/${item.slug}`}
          className="block text-right text-xs text-white/40 hover:text-white transition">
          More Detail
        </Link>
      </div>
    </div>
  );
}

export default function MenuPageClient({ items }: { items: MenuItem[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchCategory =
        activeCategory === "All" || item.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [items, search, activeCategory]);

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10">
        {/* ← Tambahkan ini */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition mb-6">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Kembali ke Beranda
        </Link>
        {/* Search */}
        <div className="flex items-center gap-3 rounded-full border border-white/20 bg-transparent px-5 py-3 mb-6 focus-within:border-white/40 transition">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0 text-white/40">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Title, Author, Date"
            className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-5 py-1.5 text-sm font-medium transition
                ${
                  activeCategory === cat
                    ? "border-white bg-white text-black"
                    : "border-white/20 text-white hover:border-white/50"
                }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/20">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <p className="mt-3 text-sm">Tidak ada menu ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
