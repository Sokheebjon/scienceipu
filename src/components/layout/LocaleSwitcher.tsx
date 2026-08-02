"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { locales, localeLabels, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

type Props = { label: string };

function SwitcherLinks({ label, query }: Props & { query?: Record<string, string> }) {
  const pathname = usePathname();
  const active = useLocale() as Locale;

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label={label}
    >
      {locales.map((locale) => {
        const isActive = locale === active;
        return (
          <Link
            key={locale}
            href={query ? { pathname, query } : pathname}
            locale={locale}
            hrefLang={locale}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "rounded px-2 py-1 text-sm font-semibold transition-colors",
              isActive
                ? "bg-accent-500 text-primary-900"
                : "text-primary-100 hover:bg-primary-700 hover:text-white",
            )}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}

/** Reads the query string so `?conference=` survives a language switch. */
function SwitcherWithQuery({ label }: Props) {
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());
  return (
    <SwitcherLinks
      label={label}
      query={Object.keys(query).length ? query : undefined}
    />
  );
}

/**
 * Keeps the visitor on the same page when switching language. The query string
 * is read inside a Suspense boundary so pages stay statically renderable.
 */
export function LocaleSwitcher({ label }: Props) {
  return (
    <Suspense fallback={<SwitcherLinks label={label} />}>
      <SwitcherWithQuery label={label} />
    </Suspense>
  );
}
