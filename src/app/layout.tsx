import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ixraellee Journal | Stories, Tech & Ideas",
    template: "%s | Ixraellee Journal",
  },
  description:
    "Personal blog and publication by Igbinovia Idemudia Israel (Ixraellee) featuring writing on life, technology, civic innovation, and philosophy.",
  openGraph: {
    title: "Ixraellee Journal | Stories, Tech & Ideas",
    description:
      "Personal blog and publication by Igbinovia Idemudia Israel (Ixraellee) featuring writing on life, technology, civic innovation, and philosophy.",
    siteName: "Ixraellee Journal",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ixraellee Journal",
    description: "Personal blog and publication by Ixraelle.",
  },
};

import { Suspense } from "react";
import { AnalyticsTracker } from "../components/analytics-tracker";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
