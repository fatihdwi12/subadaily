"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type MediaItem = {
  id: string;
  type: string;
  filename: string;
  thumbnail: string | null;
  title: string | null;
  status: string;
};

const IMAGE_DURATION = 5000;

// ─── MediaSlide ───────────────────────────────────────────────
function MediaSlide({
  item,
  onVideoEnded,
}: {
  item: MediaItem;
  onVideoEnded: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (item.type !== "video") return;
    const v = videoRef.current;
    if (!v) return;
    setMuted(true);
    v.currentTime = 0;
    v.muted = true;
    v.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [item]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  };

  if (item.type === "video") {
    return (
      <div className="relative w-full h-full bg-zinc-100 rounded-2xl overflow-hidden">
        <video
          ref={videoRef}
          src={`/videos/${item.filename}`}
          className="w-full h-full object-cover"
          playsInline
          muted={muted}
          onEnded={onVideoEnded}
          onClick={togglePlay}
        />

        {!playing && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/10 transition hover:bg-black/20">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </button>
        )}

        {playing && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            </div>
          </button>
        )}

        <button
          onClick={toggleMute}
          className="absolute bottom-3 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
          aria-label={muted ? "Unmute" : "Mute"}>
          {muted ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>

        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            VIDEO
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-zinc-100 rounded-2xl overflow-hidden">
      <Image
        src={`/images/gallery/${item.filename}`}
        alt={item.title ?? "Gallery"}
        fill
        className="object-cover"
        sizes="90vw"
      />
    </div>
  );
}

// ─── GallerySection ───────────────────────────────────────────
export default function GallerySection() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef<number | null>(null);

  // ✅ PERUBAHAN: tambah cache: "no-store" agar tidak cache di browser
  useEffect(() => {
    fetch("/api/gallery", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const active = Array.isArray(data)
          ? data.filter((d: MediaItem) => d.status === "Active")
          : [];
        setItems(active);
      })
      .finally(() => setLoading(false));
  }, []);

  const next = () => setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));
  const prev = () => setCurrent((c) => (c === 0 ? items.length - 1 : c - 1));

  useEffect(() => {
    if (items.length === 0) return;
    if (items[current]?.type === "video") return;
    const t = setTimeout(next, IMAGE_DURATION);
    return () => clearTimeout(t);
  }, [current, items]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <section className="bg-black py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl">
          //OUR GALLERY
        </h2>

        {loading ? (
          <div className="h-[300px] sm:h-[420px] lg:h-[500px] w-full animate-pulse rounded-2xl bg-zinc-900" />
        ) : items.length === 0 ? (
          <div
            className="h-[300px] sm:h-[420px] lg:h-[500px] w-full rounded-2xl"
            style={{
              backgroundImage:
                "linear-gradient(45deg,#e5e5e5 25%,transparent 25%)," +
                "linear-gradient(-45deg,#e5e5e5 25%,transparent 25%)," +
                "linear-gradient(45deg,transparent 75%,#e5e5e5 75%)," +
                "linear-gradient(-45deg,transparent 75%,#e5e5e5 75%)",
              backgroundSize: "40px 40px",
              backgroundPosition: "0 0,0 20px,20px -20px,-20px 0",
              backgroundColor: "#f0f0f0",
            }}
          />
        ) : (
          <div className="relative">
            <div
              className="h-[300px] sm:h-[420px] lg:h-[500px] w-full overflow-hidden rounded-2xl"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}>
              {items[current] && (
                <MediaSlide item={items[current]} onVideoEnded={next} />
              )}
            </div>

            <button
              onClick={prev}
              className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:scale-105 hover:bg-zinc-800 sm:h-12 sm:w-12"
              aria-label="Previous">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={next}
              className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:scale-105 hover:bg-zinc-800 sm:h-12 sm:w-12"
              aria-label="Next">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {items.length > 1 && (
              <div className="mt-4 flex justify-center gap-1.5">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all duration-200
                      ${i === current ? "w-6 bg-white" : "w-1.5 bg-white/25"}`}
                  />
                ))}
              </div>
            )}

            <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {current + 1} / {items.length}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
