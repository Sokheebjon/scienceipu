import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { DataTable } from "@/components/ui/DataTable";
import { LinkButton } from "@/components/ui/Button";
import { SectionNav } from "@/components/conference/SectionNav";
import {
  conferences,
  getConference,
  type ConferenceDeadlines,
  type ConferenceFees,
} from "@/data/conferences";
import {
  formatDate,
  formatDateRange,
  formatEdition,
  formatFee,
} from "@/lib/format";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

const DEADLINE_ORDER: (keyof ConferenceDeadlines)[] = [
  "registration",
  "payment",
  "finalPaper",
  "presentation",
];

const FEE_ORDER: (keyof ConferenceFees)[] = [
  "standard",
  "returningParticipant",
  "phdUnder30",
  "late",
  "additionalPaper",
  "accompanyingPerson",
  "attendanceOnly",
];

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    conferences.map((conference) => ({ locale, slug: conference.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const conference = getConference(slug);
  if (!conference) return {};

  const t = await getTranslations({ locale, namespace: "conference" });

  return buildMetadata({
    locale,
    title: conference.name[locale],
    description: t("metaDescription", {
      name: conference.name[locale],
      edition: formatEdition(conference.edition, locale),
      dates: formatDateRange(conference.startDate, conference.endDate, locale),
      city: conference.city[locale],
    }),
    path: `/conferences/${conference.slug}`,
  });
}

export default async function ConferencePage({ params }: Props) {
  const { locale, slug } = await params;
  const conference = getConference(slug);
  if (!conference) notFound();

  setRequestLocale(locale);
  const t = await getTranslations();

  const dates = formatDateRange(
    conference.startDate,
    conference.endDate,
    locale,
  );

  const sections = [
    { id: "about", label: t("conference.aboutHeading") },
    { id: "topics", label: t("conference.topicsHeading") },
    { id: "dates", label: t("conference.datesHeading") },
    { id: "fees", label: t("conference.feesHeading") },
    { id: "venue", label: t("conference.venueHeading") },
    { id: "committee", label: t("conference.committeeHeading") },
  ];

  return (
    <>
      <Container>
        <header className="mb-5 bg-white p-5 sm:p-8">
          <p className="text-accent-700 mb-2 text-xs font-semibold tracking-[0.14em] uppercase">
            {t("home.edition", {
              edition: formatEdition(conference.edition, locale),
            })}
          </p>
          <h1 className="max-w-3xl text-2xl sm:text-3xl">
            {conference.name[locale]}
          </h1>
          <div
            aria-hidden
            className="bg-accent-500 mt-3 h-1 w-14 rounded-full"
          />
          <p className="mt-4 text-lg text-neutral-700">
            {dates} · {conference.city[locale]}, {conference.country[locale]}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton
              href={{
                pathname: "/register",
                query: { conference: conference.slug },
              }}
            >
              {t("home.register")}
            </LinkButton>
            <LinkButton href="/upload" variant="secondary">
              {t("conference.uploadCta")}
            </LinkButton>
          </div>
        </header>
      </Container>

      <SectionNav label={t("conference.sectionNav")} items={sections} />

      <Section id="about" heading={t("conference.aboutHeading")}>
        <div className="prose-site max-w-3xl">
          <p>{conference.description[locale]}</p>
        </div>
      </Section>

      <Section
        id="topics"
        heading={t("conference.topicsHeading")}
        description={t("conference.topicsIntro")}
        tone="tinted"
      >
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {conference.topics.map((topic) => (
            <li key={topic.en} className="flex gap-3 text-neutral-700">
              <span
                aria-hidden
                className="bg-accent-500 mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
              />
              {topic[locale]}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="dates" heading={t("conference.datesHeading")}>
        <DataTable
          headers={[t("conference.datesEvent"), t("conference.datesDate")]}
          rows={[
            [t("conference.conferenceDates"), dates],
            ...DEADLINE_ORDER.map((key) => [
              t(`deadlineLabels.${key}`),
              formatDate(conference.deadlines[key], locale),
            ]),
          ]}
        />
      </Section>

      <Section id="fees" heading={t("conference.feesHeading")} tone="tinted">
        <DataTable
          alignLastRight
          headers={[t("conference.feeCategory"), t("conference.feeAmount")]}
          rows={FEE_ORDER.map((key) => [
            t(`feeLabels.${key}`),
            formatFee(conference.fees[key], locale),
          ])}
        />
        <p className="mt-4">
          <Link
            href="/payment"
            className="text-accent-700 hover:text-primary-700 text-sm font-medium underline underline-offset-2"
          >
            {t("quickLinks.payment")}
          </Link>
        </p>
      </Section>

      <Section id="venue" heading={t("conference.venueHeading")}>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-primary-800 text-lg font-medium">
              {t("conference.venueLine", {
                venue: conference.venue[locale],
                city: conference.city[locale],
                country: conference.country[locale],
              })}
            </p>
            <p className="mt-4 text-neutral-700">{t("conference.venueBody")}</p>
            <div className="mt-6">
              <LinkButton href="/venue" variant="secondary">
                {t("conference.venueCta")}
              </LinkButton>
            </div>
          </div>
          <div className="border-line relative aspect-[16/9] overflow-hidden rounded-lg border">
            <Image
              src="/img/venue-map.svg"
              alt={t("venue.mapAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section
        id="committee"
        heading={t("conference.committeeHeading")}
        description={t("conference.committeeIntro")}
        tone="tinted"
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {conference.committee.map((member) => (
            <li
              key={member.name}
              className="border-line rounded-lg border bg-white p-4"
            >
              <p className="text-primary-800 font-semibold">{member.name}</p>
              <p className="text-accent-700 mt-1 text-sm font-medium">
                {member.role[locale]}
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                {member.affiliation[locale]}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="navy">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl text-white">
              {t("conference.registerHeading")}
            </h2>
            <p className="text-primary-200 mt-3">
              {t("conference.registerBody")}
            </p>
          </div>
          <LinkButton
            href={{
              pathname: "/register",
              query: { conference: conference.slug },
            }}
            variant="accent"
            size="lg"
            className="shrink-0"
          >
            {t("conference.registerCta")}
          </LinkButton>
        </div>
        <p className="border-primary-700 mt-8 border-t pt-6">
          <Link
            href="/"
            className="text-primary-200 text-sm underline underline-offset-2 hover:text-white"
          >
            {t("conference.allConferences")}
          </Link>
        </p>
      </Section>
    </>
  );
}
