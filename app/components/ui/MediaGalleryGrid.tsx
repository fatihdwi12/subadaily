"use client";

import { useState } from "react";
import Image from "next/image";

type PhotoItem = {
  id: string;
  src: string;
  alt: string;
  title?: string;
  date?: string;
};

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
}: {
  item: PhotoItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="relative mx-4 w-full max-w-4xl overflow-hidden rounded-2xl bg-black"
        onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Prev */}
        <button
          onClick={onPrev}
          aria-label="Sebelumnya"
          className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          aria-label="Berikutnya"
          className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        {/* Image */}
        <Image
          src={item.src}
          alt={item.alt}
          width={1200}
          height={800}
          className="max-h-[80vh] w-full object-contain"
        />

        {/* Caption */}
        {(item.title || item.date) && (
          <div className="flex items-center justify-between gap-4 bg-black/70 px-4 py-3 text-white">
            {item.title && (
              <span className="truncate text-sm font-medium">{item.title}</span>
            )}
            {item.date && (
              <span className="shrink-0 text-xs text-white/50">
                {item.date}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Grid ────────────────────────────────────────────────────────────────
export default function MediaGalleryGrid({ items }: { items: PhotoItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const goPrev = () =>
    activeIndex !== null &&
    setActiveIndex((activeIndex - 1 + items.length) % items.length);

  const goNext = () =>
    activeIndex !== null && setActiveIndex((activeIndex + 1) % items.length);

  // Empty state
  if (items.length === 0) {
    return (
      <div className="rounded-[1.25rem] bg-white p-5">
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-neutral-400">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <p className="text-sm">Belum ada foto tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* White card + horizontal scroll */}
      <div className="rounded-[1.25rem] bg-white p-5">
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {items.map((item, i) => (
            // Wrapper div dengan ukuran eksplisit agar fill Image punya height
            <div
              key={item.id}
              className="relative aspect-square w-48 shrink-0 sm:w-56 lg:w-64">
              <button
                onClick={() => setActiveIndex(i)}
                aria-label={`Buka ${item.alt}`}
                className="group absolute inset-0 overflow-hidden rounded-xl bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 256px, (min-width: 640px) 224px, 192px"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/20" />
                {item.title && (
                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/75 to-transparent px-3 py-2.5 transition-transform duration-200 group-hover:translate-y-0">
                    <p className="truncate text-xs font-medium text-white">
                      {item.title}
                    </p>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {activeIndex !== null && (
        <Lightbox
          item={items[activeIndex]}
          onClose={() => setActiveIndex(null)}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </>
  );
}
