"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchTrigger } from "./search-trigger";

type NavItem = {
  label: string;
  href: string;
  children?: never;
} | {
  label: string;
  children: Array<{
    label: string;
    href: string;
  }>;
};

type MobileNavProps = {
  items: NavItem[];
};

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white shadow-sm transition hover:border-blue-300 hover:text-blue-200 lg:hidden"
      >
        <span className="flex flex-col gap-1.5">
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-5 rounded-full bg-current" />
        </span>
      </button>

      <div
        className={`fixed inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-slate-950/45 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />

        <aside
          className={`absolute left-0 top-0 flex h-full w-[82vw] max-w-sm flex-col bg-[#080b12] shadow-2xl shadow-black/50 transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b border-white/15 px-5 py-5">
            <Link href="/" onClick={() => setOpen(false)} className="font-serif text-xl font-black text-white">
              Ixraellee
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/20 px-3 py-1.5 text-sm font-medium text-white/80"
            >
              Close
            </button>
          </div>

          <div className="px-5 pt-4">
            <SearchTrigger variant="full" />
          </div>

          <nav className="flex flex-1 flex-col gap-2 px-5 py-4">
            {items.map((item) =>
              "children" in item ? (
                <details key={item.label} className="group rounded-2xl border border-white/15">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 text-base font-semibold text-white/85">
                    {item.label}
                  </summary>
                  <div className="border-t border-white/10 px-3 py-2">
                    {item.children?.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="block border-b border-white/10 px-2 py-3 text-sm text-white/65 last:border-0 hover:text-blue-200"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-white/15 px-4 py-4 text-base font-semibold text-white/85 transition hover:border-blue-300/50 hover:bg-blue-500/15 hover:text-blue-200"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </aside>
      </div>
    </>
  );
}