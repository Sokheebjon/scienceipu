import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { aboutGoals, aboutSections } from "@/data/about";
import { conferences } from "@/data/conferences";
import { site } from "@/data/site";
import { formatDateRange } from "@/lib/format";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return buildMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/about",
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  /** All four sections share dates, venue and city; read them off the first. */
  const event = conferences[0];
  const dates = formatDateRange(event.startDate, event.endDate, locale);
  const place = `${event.city[locale]}, ${event.country[locale]}`;

  const facts = [
    { label: t("about.factName"), value: site.name[locale] },
    { label: t("about.factOrganiser"), value: site.organiser[locale] },
    { label: t("about.factDates"), value: dates },
    { label: t("about.factVenue"), value: event.venue[locale] },
    { label: t("about.factCity"), value: place },
    {
      label: t("about.factSections"),
      value: t("about.factSectionsValue", {
        sections: aboutSections.length,
        topics: conferences.reduce((n, c) => n + c.topics.length, 0),
      }),
    },
  ];

  return (
    <>
      <PageHeader
        title={t("about.heading")}
        eyebrow={`${dates} · ${place}`}
        intro={t("about.lead")}
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(280px,340px)]">
          <div className="prose-site max-w-3xl">
            <p>{t("about.body1")}</p>
            <p>{t("about.body2")}</p>
          </div>

          <dl className="border-line divide-line h-fit divide-y rounded-lg border bg-neutral-50">
            {facts.map((fact) => (
              <div key={fact.label} className="px-5 py-4">
                <dt className="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">
                  {fact.label}
                </dt>
                <dd className="text-primary-900 mt-1 font-medium">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section heading={t("about.goalsHeading")} tone="navy">
        <ul className="grid gap-4 sm:grid-cols-2">
          {aboutGoals.map((goal, index) => (
            <li
              key={goal.en}
              className="bg-primary-800 flex gap-4 rounded-lg p-5"
            >
              <span
                aria-hidden
                className="text-accent-400 text-2xl font-bold tabular-nums"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-primary-100 leading-relaxed">{goal[locale]}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        heading={t("about.sectionsHeading")}
        description={t("about.sectionsLead")}
        tone="tinted"
        width="wide"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {aboutSections.map((section) => {
            const conference = conferences.find(
              (c) => c.slug === section.slug,
            )!;
            return (
              <article
                key={section.slug}
                className="border-line flex flex-col rounded-lg border bg-white p-5 sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="bg-primary-900 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  >
                    {section.numeral}
                  </span>
                  <h3 className="text-lg">{conference.name[locale]}</h3>
                </div>

                <ul className="mt-4 mb-5 space-y-2 text-sm leading-relaxed text-neutral-700">
                  {conference.topics.map((topic) => (
                    <li key={topic.en} className="flex gap-2.5">
                      <span
                        aria-hidden
                        className="bg-accent-500 mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                      />
                      {topic[locale]}
                    </li>
                  ))}
                </ul>

                <div className="border-line mt-auto border-t pt-4">
                  <Link
                    href={`/conferences/${section.slug}`}
                    className="text-primary-800 hover:text-primary-600 text-sm font-semibold underline-offset-2 transition-colors hover:underline"
                  >
                    {t("about.sectionCta")} →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Section>
    </>
  );
}
