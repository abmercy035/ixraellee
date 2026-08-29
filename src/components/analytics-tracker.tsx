"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    // Skip admin panel tracking
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    const fullUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    // Prevent duplicate firing on same path
    if (lastPath.current === fullUrl) return;
    lastPath.current = fullUrl;

    const payload = {
      eventType: pathname.startsWith("/posts/") ? "post_read" : "pageview",
      path: pathname,
      referrer: typeof document !== "undefined" ? document.referrer : "",
    };

    // Use sendBeacon if available, otherwise fetch
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track", blob);
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname, searchParams]);

  return null;
}
