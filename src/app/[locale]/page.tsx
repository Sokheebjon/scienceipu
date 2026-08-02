import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
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
      {/* Hero. The aspect ratio is fixed in CSS and the image is priority-loaded,
          so nothing below it moves once the SVG decodes. */}
      <div className="bg-primary-900">
        <Container width="wide" className="py-4 sm:py-6">
          <figure className="overflow-hidden rounded-lg">
            <div className="relative aspect-[21/9] w-full">
              <Image
                src="/img/hero.svg"
                alt={t("home.heroAlt")}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
            </div>
            <figcaption className="bg-primary-950 px-4 py-2.5 text-center text-sm">
              <Link
                href="/photos"
                className="text-accent-400 hover:text-accent-300 underline underline-offset-2"
              >
                {t("home.heroCaption")}
              </Link>
            </figcaption>
          </figure>
        </Container>
      </div>

      <Section
        heading={t("home.conferencesHeading")}
        description={t("home.conferencesIntro")}
        width="wide"
        id="conferences"
      >
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      <div className="bg-primary-800">
        <Container width="wide">
          <div className="grid items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-2xl text-white">{t("newsletter.heading")}</h2>
              <div
                aria-hidden
                className="bg-accent-500 mt-3 h-1 w-12 rounded-full"
              />
              <p className="text-primary-200 mt-4">{t("newsletter.body")}</p>
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
