"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [zoomed, setZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const touchStartX = useRef<number | null>(null);
  const hasImages = images.length > 0;
  const currentSrc = images[currentIndex];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && currentIndex < images.length - 1) {
        setCurrentIndex((i) => i + 1);
        setImgError(false);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
        setImgError(false);
      }
    }
    touchStartX.current = null;
  };

  return (
    <div className="w-full lg:w-1/2">
      {/* Main image with swipe gestures */}
      <div
        ref={containerRef}
        className="relative aspect-[4/5] overflow-hidden rounded-xl bg-brand-bg touch-pan-y"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {imgError || !hasImages ? (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-6xl font-bold text-brand-primary/20">
              {name.charAt(0)}
            </span>
          </div>
        ) : (
          <Image
            src={currentSrc}
            alt={name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-200"
            style={{
              transform: zoomed ? "scale(1.5)" : "scale(1)",
              transformOrigin: `${pos.x}% ${pos.y}%`,
            }}
            onError={() => setImgError(true)}
            priority
          />
        )}
      </div>

      {/* Mobile dot indicators */}
      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5 lg:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                setImgError(false);
              }}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? "w-6 bg-brand-primary" : "w-1.5 bg-brand-primary/20"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                setImgError(false);
              }}
              aria-current={i === currentIndex ? "true" : undefined}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === currentIndex
                  ? "border-brand-gold"
                  : "border-transparent hover:border-brand-primary/20"
              }`}
            >
              <Image
                src={src}
                alt={`${name} ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
