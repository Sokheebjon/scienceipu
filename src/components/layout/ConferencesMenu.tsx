"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type ConferenceLink = { href: string; label: string };

type Props = {
  label: string;
  menuLabel: string;
  items: ConferenceLink[];
};

/** Desktop "Conferences" dropdown: click or hover to open, Escape to close. */
export function ConferencesMenu({ label, menuLabel, items }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isActive = pathname.startsWith("/conferences");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex items-center gap-1.5 border-b-2 px-3 py-4 text-sm font-medium transition-colors",
          isActive
            ? "border-accent-500 text-white"
            : "border-transparent text-primary-100 hover:border-accent-500 hover:text-white",
        )}
      >
        {label}
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180",
          )}
          fill="currentColor"
        >
          <path d="M5.5 7.5 10 12l4.5-4.5H5.5Z" />
        </svg>
      </button>

      <ul
        aria-label={menuLabel}
        className={cn(
          "absolute top-full left-0 z-40 w-72 overflow-hidden rounded-b-md border border-t-0 border-primary-700 bg-primary-900 shadow-xl",
          open ? "block" : "hidden",
        )}
      >
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "block border-l-2 px-4 py-2.5 text-sm transition-colors",
                pathname === item.href
                  ? "border-accent-500 bg-primary-800 text-white"
                  : "border-transparent text-primary-100 hover:border-accent-500 hover:bg-primary-800 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
