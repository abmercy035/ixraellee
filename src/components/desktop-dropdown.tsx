"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type DropdownChild = {
  label: string;
  href: string;
};

type DesktopDropdownProps = {
  label: string;
  dropdownItems: DropdownChild[];
};

export function DesktopDropdown({ label, dropdownItems }: DesktopDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  return (
    <details ref={dropdownRef} open={open} className="group relative">
      <summary
        onClick={(event) => {
          event.preventDefault();
          setOpen((current) => !current);
        }}
        className="flex cursor-pointer list-none items-center gap-1 border-b-2 border-transparent py-6 transition group-open:border-blue-400 hover:text-blue-300"
      >
        {label}
      </summary>
      <div className="absolute left-1/2 top-full z-50 min-w-56 -translate-x-1/2 border border-white/15 bg-[#0b0f18] p-2 shadow-2xl">
        {dropdownItems.map((child) => (
          <Link
            key={child.label}
            href={child.href}
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-[11px] font-semibold normal-case tracking-normal text-white/75 transition hover:bg-blue-500/15 hover:text-blue-200"
          >
            {child.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
