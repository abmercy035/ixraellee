"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Home, FileText, Users, Send, Megaphone, ExternalLink, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: Home },
    { label: "Stories", href: "/admin/posts", icon: FileText },
    { label: "Ads Manager", href: "/admin/ads", icon: Megaphone },
    { label: "Subscribers", href: "/admin/subscribers", icon: Users },
    { label: "Broadcast", href: "/admin/broadcast", icon: Send },
  ];

  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden bg-[#f8fafc] text-slate-900 font-sans antialiased">
      {/* Mobile Top Navigation Bar */}
      <header className="flex md:hidden items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 font-black text-white text-sm">
            I
          </div>
          <div>
            <span className="block font-serif text-sm font-bold tracking-tight text-slate-950">Ixraellee</span>
            <span className="block text-[8px] uppercase tracking-widest text-slate-400">CMS</span>
          </div>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle navigation menu"
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
        >
          {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Backdrop for Mobile Drawer */}
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar (Desktop Persistent & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white flex flex-col justify-between h-full overflow-y-auto transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 md:w-60 md:shrink-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5">
          {/* Logo & Mobile Close Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 px-1">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 font-black text-white text-sm">
                I
              </div>
              <div>
                <span className="block font-serif text-base font-bold tracking-tight text-slate-950">Ixraellee</span>
                <span className="block text-[9px] uppercase tracking-widest text-slate-400">CMS</span>
              </div>
            </div>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="md:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-slate-100 text-slate-950"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: View Site */}
        <div className="p-5 border-t border-slate-100">
          <Link
            href="/"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <ExternalLink className="h-4 w-4 text-slate-400" />
            View Site
          </Link>
          <p className="mt-3 px-3 text-[10px] text-slate-400 leading-5">
            Ixraellee Journal CMS<br />Connected to MongoDB &amp; Cloudinary
          </p>
        </div>
      </aside>

      {/* Main Canvas — scrollable per-page */}
      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
