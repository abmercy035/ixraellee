"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Home, FileText, Users, Send, ExternalLink } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: Home },
    { label: "Stories", href: "/admin/posts", icon: FileText },
    { label: "Subscribers", href: "/admin/subscribers", icon: Users },
    { label: "Broadcast", href: "/admin/broadcast", icon: Send },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans antialiased">
      {/* Left Sidebar */}
      <aside className="w-60 shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between h-screen overflow-y-auto">
        <div className="p-5">
          {/* Logo */}
          <div className="flex items-center gap-3 px-1 pb-5 border-b border-slate-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 font-black text-white text-sm">
              I
            </div>
            <div>
              <span className="block font-serif text-base font-bold tracking-tight text-slate-950">Ixraellee</span>
              <span className="block text-[9px] uppercase tracking-widest text-slate-400">CMS</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-5 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
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
