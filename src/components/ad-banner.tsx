"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

type AdBannerProps = {
  page: "home" | "article" | "category" | "all";
  section: "mid_article" | "sidebar" | "hero_banner" | "category_top" | "header";
  className?: string;
};

type AdData = {
  _id: string;
  title?: string;
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

  const hasTitle = Boolean(currentAd.title && currentAd.title.trim().length > 0);
  const hasDesc = Boolean(currentAd.description && currentAd.description.trim().length > 0);
  const hasBtn = Boolean(currentAd.buttonText && currentAd.buttonText.trim().length > 0);
  const hasTextOverlay = hasTitle || hasDesc || hasBtn;
  const adLink = currentAd._id ? `/ad/${currentAd._id}` : (currentAd.targetUrl || "#");

  // Per-placement height
  const heightClass: Record<typeof section, string> = {
    header:       "h-16 sm:h-20 min-h-[64px] sm:min-h-[80px]", // header ad — half width
    hero_banner:  "min-h-[380px] sm:min-h-[280px]", // home — tall
    mid_article:  "min-h-[220px] sm:min-h-[220px]", // in-article — compact
    category_top: "min-h-[220px] sm:min-h-[220px]", // before Keep Reading — compact
    sidebar:      "min-h-[200px] sm:min-h-[200px]", // sidebar — smallest
  };
  const hClass = heightClass[section];

  // Special sleek header layout
  if (section === "header") {
    return (
      <a
        href={adLink}
        target="_blank"
        rel="noreferrer"
        className={`group relative block ${hClass} w-full overflow-hidden cursor-pointer rounded-sm transition-all duration-300 ${className}`}
      >
        {/* Background Image */}
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <img
            src={currentAd.imageUrl}
            alt={currentAd.altText || currentAd.title || "Sponsored Advertisement"}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {hasTextOverlay && (
            <div className="absolute inset-0 bg-linear-to-r from-slate-950/85 via-slate-950/60 to-black/30" />
          )}
        </div>

        {/* Content (only shown if at least one text field is filled) */}
        {hasTextOverlay ? (
          <div className="relative z-10 flex h-full items-center justify-between px-4 sm:px-6 py-2 gap-4">
            <div className="min-w-0 space-y-0.5">
              {hasTitle && (
                <h3 className="font-serif text-xs sm:text-sm font-black leading-snug text-white tracking-tight drop-shadow truncate">
                  {currentAd.title}
                </h3>
              )}
              {hasDesc && (
                <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium truncate max-w-sm drop-shadow-sm">
                  {currentAd.description}
                </p>
              )}
            </div>

            {hasBtn && (
              <span className="shrink-0 inline-flex items-center gap-1.5 rounded-sm bg-white px-3.5 py-1.5 text-[10px] sm:text-xs font-extrabold text-slate-950 shadow-md">
                {currentAd.buttonText} <ExternalLink className="h-3 w-3 text-slate-900" />
              </span>
            )}
          </div>
        ) : null}
      </a>
    );
  }

  return (
    <a
      href={adLink}
      target="_blank"
      rel="noreferrer"
      className={`group relative my-10 block ${hClass} w-full overflow-hidden cursor-pointer transition-all duration-300 ${className}`}
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <img
          src={currentAd.imageUrl}
          alt={currentAd.altText || currentAd.title || "Sponsored Advertisement"}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Only overlay gradient if text overlay is present */}
        {hasTextOverlay && (
          <>
            <div className="absolute inset-0 bg-linear-to-r from-slate-950/70 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-black/20" />
          </>
        )}
      </div>

      {/* Floating Foreground Content Layer */}
      <div className={`relative z-10 flex h-full ${hClass} flex-col justify-between p-6 sm:p-10 md:p-12`}>
        {/* Center Title & Summary Note */}
        {hasTextOverlay ? (
          <div className="my-auto max-w-2xl space-y-3 py-4">
            {hasTitle && (
              <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black leading-tight text-white tracking-tight drop-shadow-md">
                {currentAd.title}
              </h3>
            )}

            {hasDesc && (
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium max-w-xl drop-shadow-sm">
                {currentAd.description}
              </p>
            )}

            {hasBtn && (
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-2 text-xs sm:text-sm font-extrabold text-slate-950 shadow-2xl">
                  {currentAd.buttonText} <ExternalLink className="h-4 w-4 text-slate-900" />
                </span>
              </div>
            )}
          </div>
        ) : (
          <div />
        )}

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
