import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { DataTable } from "@/components/ui/DataTable";
import { LinkButton } from "@/components/ui/Button";
import { conferences, type ConferenceDeadlines } from "@/data/conferences";
import { formatDate, formatDateRange } from "@/lib/format";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

const DEADLINE_ORDER: (keyof ConferenceDeadlines)[] = [
  "registration",
  "payment",
  "finalPaper",
  "presentation",
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "deadlines" });
  return buildMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/deadlines",
  });
}

export default async function DeadlinesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageHeader title={t("deadlines.heading")} intro={t("deadlines.intro")} />

      <Section heading={t("deadlines.scheduleHeading")} width="wide">
        <DataTable
          headers={[
            t("deadlines.scheduleConference"),
            t("deadlines.scheduleDates"),
            t("deadlines.scheduleRegistration"),
            t("deadlines.scheduleOpening"),
            t("deadlines.scheduleVenue"),
          ]}
          rows={conferences.map((conference) => [
            <Link
              key={conference.slug}
              href={`/conferences/${conference.slug}`}
              className="text-primary-700 underline underline-offset-2 hover:text-primary-500"
            >
              {conference.shortName[locale]}
            </Link>,
            formatDateRange(conference.startDate, conference.endDate, locale),
            conference.registrationTime,
            conference.openingTime,
            `${conference.venue[locale]}, ${conference.city[locale]}`,
          ])}
        />
      </Section>

      <Section
        heading={t("deadlines.deadlinesHeading")}
        tone="tinted"
        width="wide"
      >
        <DataTable
          headers={[
            t("deadlines.deadlinesStage"),
            ...conferences.map((conference) => conference.shortName[locale]),
          ]}
          rows={DEADLINE_ORDER.map((key) => [
            t(`deadlineLabels.${key}`),
            ...conferences.map((conference) =>
              formatDate(conference.deadlines[key], locale),
            ),
          ])}
        />
        <div className="mt-8">
          <LinkButton href="/register" size="lg">
            {t("deadlines.cta")}
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
