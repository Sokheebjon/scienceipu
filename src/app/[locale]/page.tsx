import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Hero } from "@/components/home/Hero";
import { ConferenceCard } from "@/components/home/ConferenceCard";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { PartnersStrip } from "@/components/home/PartnersStrip";
import { conferences } from "@/data/conferences";
import { formatEdition } from "@/lib/format";
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

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <Hero locale={locale} />

      <Section
        eyebrow={t("home.factConferencesValue")}
        heading={t("home.conferencesHeading")}
        description={t("home.conferencesIntro")}
        width="wide"
        id="conferences"
      >
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {conferences.map((conference) => (
            <li key={conference.slug} className="h-full">
              <ConferenceCard
                conference={conference}
                locale={locale}
                labels={{
                  edition: t("home.edition", {
                    edition: formatEdition(conference.edition, locale),
                  }),
                  register: t("home.register"),
                  learnMore: t("home.learnMore"),
                }}
              />
            </li>
          ))}
        </ul>
      </Section>

      {/* Newsletter. Navy band with a gold hairline, breaking up the white
          sections above and below it. */}
      <div className="border-accent-500 bg-primary-800 relative isolate overflow-hidden border-y-2">
        <div
          aria-hidden
          className="bg-primary-500/40 absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full blur-3xl"
        />
        <Container width="wide">
          <div className="grid items-center gap-8 py-14 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl text-white sm:text-3xl">
                {t("newsletter.heading")}
              </h2>
              <div
                aria-hidden
                className="bg-accent-500 mt-3 h-1 w-14 rounded-full"
              />
              <p className="text-primary-200 mt-4 max-w-lg leading-relaxed">
                {t("newsletter.body")}
              </p>
            </div>
            <NewsletterForm />
          </div>
        </Container>
      </div>

      <Section
        heading={t("home.partnersHeading")}
        description={t("home.partnersIntro")}
        tone="tinted"
        width="wide"
      >
        <PartnersStrip locale={locale} />
      </Section>
    </>
  );
}
