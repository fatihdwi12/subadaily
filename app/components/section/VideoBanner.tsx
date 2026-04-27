"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

type BannerItem = {
  id: string;
  src: string;
};

type Props = {
  items: BannerItem[];
};

export default function VideoBanner({ items }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const playActiveVideo = useCallback((index: number) => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        video.currentTime = 0;
        video.play();
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    playActiveVideo(index);
  }, [emblaApi, playActiveVideo]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    playActiveVideo(0);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect, playActiveVideo]);

  const handleVideoEnded = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      if (index === selectedIndex) emblaApi.scrollNext();
    },
    [emblaApi, selectedIndex],
  );

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  // Fallback jika tidak ada banner aktif
  if (items.length === 0) return null;

  return (
    <section className="bg-black py-8 sm:py-10 lg:py-14">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="relative w-full rounded-2xl overflow-hidden">
          {/* Embla Viewport */}
          <div ref={emblaRef} className="w-full overflow-hidden rounded-2xl">
            <div className="flex">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="relative flex-[0_0_100%] min-w-0 aspect-[16/7] sm:aspect-[16/6] lg:aspect-[16/5]">
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={item.src}
                    muted
                    playsInline
                    preload="auto"
                    onEnded={() => handleVideoEnded(index)}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? "bg-white w-4 sm:w-5"
                    : "bg-white/40 w-1 sm:w-1.5"
                }`}
                aria-label={`Video ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
