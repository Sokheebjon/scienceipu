import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Hero } from "@/components/home/Hero";
import { ConferenceCard } from "@/components/home/ConferenceCard";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { PartnersStrip } from "@/components/home/PartnersStrip";
import { QuickLinksBar } from "@/components/layout/QuickLinksBar";
import { conferences } from "@/data/conferences";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return buildMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

/**
 * Mirrors the reference home page top to bottom: hero image → fastnav →
 * event boxes (with a visually hidden h1, as on the reference) → newsletter
 * box → partners sheet.
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <Hero />
      <QuickLinksBar />

      <Container>
        <section
          aria-label={t("home.conferencesHeading")}
          className="mb-5"
          id="conferences"
        >
          <h1 className="sr-only">{t("home.conferencesHeading")}</h1>
          <ul className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
            {conferences.map((conference) => (
              <li key={conference.slug} className="h-full">
                <ConferenceCard
                  conference={conference}
                  locale={locale}
                  labels={{
                    register: t("home.register"),
                    learnMore: t("home.learnMore"),
                  }}
                />
              </li>
            ))}
          </ul>
        </section>

        {/* The reference newsletter: a compact dark box, text left, form right. */}
        <div className="bg-primary-900 mb-5 flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-primary-300 text-sm font-bold tracking-wide uppercase">
              {t("newsletter.heading")}
            </h2>
            <p className="text-primary-200 mt-1.5 text-sm leading-relaxed">
              {t("newsletter.body")}
            </p>
          </div>
          <div className="w-full lg:max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </Container>

      <Section heading={t("home.partnersHeading")}>
        <PartnersStrip locale={locale} />
      </Section>
    </>
  );
}
