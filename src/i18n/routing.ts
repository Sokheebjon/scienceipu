import { defineRouting } from "next-intl/routing";

export const locales = ["uz", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "uz";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Both locales are always prefixed: /uz/... and /en/...
  localePrefix: "always",
});

/**
 * `uz` resolves to Uzbek Latin in ICU, which is what we want — Node formats
 * 2026-08-19 as "19-avgust, 2026". No script subtag needed.
 */
export const htmlLang: Record<Locale, string> = {
  uz: "uz",
  en: "en",
};

/** OpenGraph requires an underscored territory-qualified tag. */
export const ogLocales: Record<Locale, string> = {
  uz: "uz_UZ",
  en: "en_GB",
};

/** Label shown in the language switcher. */
export const localeLabels: Record<Locale, string> = {
  uz: "UZ",
  en: "EN",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
