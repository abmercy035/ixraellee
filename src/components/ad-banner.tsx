"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

type AdBannerProps = {
  page: "home" | "article" | "category";
  section: "mid_article" | "sidebar" | "hero_banner" | "category_top";
  className?: string;
};

type AdData = {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  targetUrl: string;
  buttonText?: string;
  altText?: string;
};

export function AdBanner({ page, section, className = "" }: AdBannerProps) {
  const [adsList, setAdsList] = useState<AdData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/admin/ads?page=${page}&section=${section}&active=true`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setAdsList(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [page, section]);

  // Auto-rotate ads every 6 seconds if multiple ads exist
  useEffect(() => {
    if (adsList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % adsList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [adsList.length]);

  function handleAdClick(adId?: string) {
    if (adId) {
      fetch(`/api/admin/ads/${adId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "click" }),
      }).catch(() => {});
    }
  }

  function handleNext() {
    if (adsList.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % adsList.length);
  }

  function handlePrev() {
    if (adsList.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + adsList.length) % adsList.length);
  }

  if (adsList.length === 0) {
    return null;
  }

  const currentAd = adsList[currentIndex];

  // Per-placement height — outer wrapper + inner content div must match
  const heightClass: Record<typeof section, string> = {
    hero_banner:  "min-h-[380px] sm:min-h-[480px]", // home — tall
    mid_article:  "min-h-[220px] sm:min-h-[280px]", // in-article — compact
    category_top: "min-h-[220px] sm:min-h-[280px]", // before Keep Reading — compact
    sidebar:      "min-h-[200px] sm:min-h-[240px]", // sidebar — smallest
  };
  const hClass = heightClass[section];

  return (
    <a
      href={currentAd.targetUrl}
      target="_blank"
      rel="noreferrer"
      onClick={() => handleAdClick(currentAd._id)}
      className={`group relative my-10 block ${hClass} w-full overflow-hidden cursor-pointer transition-all duration-300 ${className}`}
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <img
          src={currentAd.imageUrl}
          alt={currentAd.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Soft Transparent Gradient Overlay so Image Remains Bright */}
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/70 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-black/20" />
      </div>

      {/* Floating Foreground Content Layer */}
      <div className={`relative z-10 flex h-full ${hClass} flex-col justify-between p-6 sm:p-10 md:p-12`}>
        {/* Center Title & Summary Note */}
        <div className="my-auto max-w-2xl space-y-3 py-4">
          <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black leading-tight text-white tracking-tight drop-shadow-md">
            {currentAd.title}
          </h3>

          {currentAd.description ? (
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium max-w-xl drop-shadow-sm">
              {currentAd.description}
            </p>
          ) : null}

          {/* Button — only shown if buttonText is explicitly set and non-empty */}
          {currentAd.buttonText && String(currentAd.buttonText).trim().length > 0 ? (
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-2 text-xs sm:text-sm font-extrabold text-slate-950 shadow-2xl">
                {currentAd.buttonText} <ExternalLink className="h-4 w-4 text-slate-900" />
              </span>
            </div>
          ) : null}
        </div>

        {/* Footer Carousel Controls & Indicator Dots */}
        {adsList.length > 1 && (
          <div
            className="flex items-center justify-between border-t border-white/10 pt-4"
            onClick={(e) => e.preventDefault()}
          >
            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {adsList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex ? "w-7 bg-amber-400" : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to ad ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.preventDefault(); handlePrev(); }}
                className="rounded-full border border-white/20 bg-slate-950/60 p-2 text-white hover:bg-white/20 transition cursor-pointer backdrop-blur-md"
                aria-label="Previous advertisement"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); handleNext(); }}
                className="rounded-full border border-white/20 bg-slate-950/60 p-2 text-white hover:bg-white/20 transition cursor-pointer backdrop-blur-md"
                aria-label="Next advertisement"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </a>
  );
}
