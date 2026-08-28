"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type AdBannerProps = {
  page: "home" | "article" | "category";
  section: "mid_article" | "sidebar" | "hero_banner" | "category_top";
  className?: string;
};

type AdData = {
  _id: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  altText?: string;
};

export function AdBanner({ page, section, className = "" }: AdBannerProps) {
  const [ad, setAd] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/admin/ads?page=${page}&section=${section}&active=true`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          // Pick a random active ad or the latest active ad for this section
          const selected = data[Math.floor(Math.random() * data.length)];
          setAd(selected);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, section]);

  function handleAdClick() {
    if (ad && ad._id) {
      fetch(`/api/admin/ads/${ad._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "click" }),
      }).catch(() => {});
    }
  }

  if (loading) {
    return (
      <div className={`my-8 h-40 w-full animate-pulse rounded-2xl bg-white/5 border border-white/10 ${className}`} />
    );
  }

  // Fallback sponsored ad if no active custom ad is found
  const bannerImage = ad?.imageUrl || "/images/welcome-journal.jpg";
  const bannerTitle = ad?.title || "Bella Hair — Premium Luxury Wigs & Extensions";
  const bannerTarget = ad?.targetUrl || "https://bellahair.com";

  return (
    <div className={`my-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-[#0b0f19] to-slate-950 p-6 shadow-2xl ${className}`}>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2 max-w-lg">
          <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/30">
            Sponsored
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            {bannerTitle}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Discover curated beauty, lifestyle products, and exclusive premium offers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
          <div className="relative h-24 w-full sm:w-36 overflow-hidden rounded-xl border border-white/10">
            <img src={bannerImage} alt={bannerTitle} className="h-full w-full object-cover" />
          </div>

          <a
            href={bannerTarget}
            target="_blank"
            rel="noreferrer"
            onClick={handleAdClick}
            className="flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-blue-500 shadow-md cursor-pointer"
          >
            Visit Sponsor →
          </a>
        </div>
      </div>
    </div>
  );
}
