"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import type { MediaItem } from "@/app/types";

const mediaItems: MediaItem[] = [
  {
    id: 1,
    type: "image",
    src: "/images/hero-1.jpg",
    alt: "Suba Daily Atmosphere",
  },
  { id: 2, type: "video", src: "/videos/banner-1.mp4" },
  {
    id: 3,
    type: "image",
    src: "/images/hero-3.jpg",
    alt: "Suba Daily Coffee",
  },
];

export default function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: false, align: "center" },
    [Autoplay({ delay: 3000, stopOnInteraction: false })],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  return (
    /*
      Breakpoint height:
      - mobile (default) : aspect-ratio 7/3 ≈ 412×176
      - sm (640px+)       : aspect-ratio 16/7
      - md (768px+)       : aspect-ratio 16/6
      - lg (1024px+)      : full screen height (100svh)
    */
    <section className="relative w-full aspect-[7/3] sm:aspect-[16/7] md:aspect-[16/6] lg:aspect-auto lg:h-[100svh] overflow-hidden">
      {/* Carousel Viewport */}
      <div ref={emblaRef} className="w-full h-full touch-pan-y">
        <div className="flex h-full">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="relative flex-[0_0_100%] min-w-0 h-full">
              {item.type === "image" ? (
                <Image
                  src={item.src}
                  alt={item.alt ?? "Suba Daily"}
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                  priority={item.id === 1}
                />
              ) : (
                <video
                  src={item.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover object-center"
                />
              )}
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 sm:bottom-5 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
        {mediaItems.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-1 sm:h-1.5 lg:h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-white w-4 sm:w-5 lg:w-6"
                : "bg-white/40 w-1 sm:w-1.5 lg:w-2"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
