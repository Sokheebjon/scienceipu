"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import type { ConferenceLink } from "./ConferencesMenu";

type NavItem = { href: string; label: string };

type Props = {
  openLabel: string;
  closeLabel: string;
  primaryLabel: string;
  conferencesLabel: string;
  quickLinksLabel: string;
  items: NavItem[];
  conferences: ConferenceLink[];
  quickLinks: NavItem[];
};

export function MobileNav({
  openLabel,
  closeLabel,
  primaryLabel,
  conferencesLabel,
  quickLinksLabel,
  items,
  conferences,
  quickLinks,
}: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const linkClass = (href: string) =>
    cn(
      "block border-l-2 px-4 py-3 text-sm transition-colors",
      pathname === href
        ? "border-accent-500 bg-primary-800 text-white"
        : "border-transparent text-primary-100 hover:bg-primary-800 hover:text-white",
    );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="text-primary-100 hover:bg-primary-700 inline-flex items-center gap-2 rounded p-2 hover:text-white lg:hidden"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none">
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="sr-only">{openLabel}</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label={closeLabel}
            onClick={() => setOpen(false)}
            className="bg-primary-950/70 absolute inset-0 h-full w-full"
          />
          <div
            id="mobile-nav"
            className="bg-primary-900 absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col overflow-y-auto shadow-2xl"
          >
            <div className="border-primary-700 flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-semibold text-white">
                {primaryLabel}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-primary-100 hover:bg-primary-700 rounded p-2 hover:text-white"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                >
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="sr-only">{closeLabel}</span>
              </button>
            </div>

            <nav aria-label={primaryLabel} className="py-2">
              <ul>
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass(item.href)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-primary-700 border-t py-2">
              <p className="text-accent-400 px-4 py-2 text-xs font-semibold tracking-wide uppercase">
                {conferencesLabel}
              </p>
              <ul>
                {conferences.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass(item.href)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-primary-700 border-t py-2">
              <p className="text-accent-400 px-4 py-2 text-xs font-semibold tracking-wide uppercase">
                {quickLinksLabel}
              </p>
              <ul className="pb-4">
                {quickLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass(item.href)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
