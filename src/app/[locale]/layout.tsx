import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, htmlLang, type Locale } from "@/i18n/routing";
import { site } from "@/data/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CookieConsent } from "@/components/layout/CookieConsent";
import "../globals.css";

/** latin-ext carries the Uzbek Latin letters oʻ, gʻ, ʼ and the ʻ modifier. */
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "home" });

  return {
    metadataBase: new URL(site.url),
    title: {
      default: t("metaTitle"),
      template: `%s — ${site.name[locale as Locale]}`,
    },
    description: t("metaDescription"),
    icons: { icon: "/img/mark.svg" },
    other: { "theme-color": "#18174a" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <html lang={htmlLang[locale]} className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <a
            href="#main"
            className="bg-primary-800 sr-only rounded-br-md px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50"
          >
            {t("common.skipToContent")}
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <CookieConsent
            title={t("cookies.title")}
            body={t("cookies.body")}
            accept={t("cookies.accept")}
            decline={t("cookies.decline")}
            policy={t("cookies.policy")}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
