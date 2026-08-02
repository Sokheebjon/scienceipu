import type { Metadata } from "next";
import { site } from "@/data/site";
import { defaultLocale, locales, ogLocales, type Locale } from "@/i18n/routing";

type BuildMetadataOptions = {
  locale: Locale;
  title: string;
  description: string;
  /** Path without the locale prefix, e.g. "/register". "" for the home page. */
  path?: string;
};

/**
 * Canonical URL, hreflang alternates for both locales plus x-default, and
 * localised OpenGraph. Every page builds its metadata through this.
 */
export function buildMetadata({
  locale,
  title,
  description,
  path = "",
}: BuildMetadataOptions): Metadata {
  const canonical = `${site.url}/${locale}${path}`;

  const languages: Record<string, string> = {};
  for (const candidate of locales) {
    languages[candidate] = `${site.url}/${candidate}${path}`;
  }
  languages["x-default"] = `${site.url}/${defaultLocale}${path}`;

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: site.name[locale],
      locale: ogLocales[locale],
      alternateLocale: locales
        .filter((candidate) => candidate !== locale)
        .map((candidate) => ogLocales[candidate]),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
