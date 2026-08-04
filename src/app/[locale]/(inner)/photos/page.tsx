import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import {
  ExcursionProgram,
  type ExcursionProgramStop,
} from "@/components/gallery/ExcursionProgram";
import { excursionStops, excursionTimeRange } from "@/data/excursion";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "photos" });
  return buildMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/photos",
  });
}

const factIcons = {
  date: "M8 3v3m8-3v3M4.5 9h15M6 4.5h12A1.5 1.5 0 0 1 19.5 6v13a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19V6A1.5 1.5 0 0 1 6 4.5Z",
  time: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4.5V12l3 2",
  city: "M12 21s-6.5-5.4-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.6 12 21 12 21Zm0-8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  stops:
    "M6 21V4m0 0h11l-2.5 3.5L17 11H6m-2 10h4",
} as const;

export default async function PhotosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const total = excursionStops.length;
  const stops: ExcursionProgramStop[] = excursionStops.map((stop, offset) => {
    const index = offset + 1;
    const name = stop.name[locale];
    return {
      id: stop.id,
      time: stop.time,
      name,
      paragraphs: stop.description[locale],
      image: stop.image,
      stopLabel: t("photos.stopLabel", { index }),
      open: t("photos.openImage", { name }),
      counter: t("common.image", { current: index, total }),
    };
  });

  const facts: { id: keyof typeof factIcons; text: string }[] = [
    { id: "date", text: t("photos.factDate") },
    { id: "time", text: excursionTimeRange },
    { id: "city", text: t("photos.factCity") },
    { id: "stops", text: t("photos.factStops", { count: total }) },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t("photos.eyebrow")}
        title={t("photos.heading")}
        intro={t("photos.intro")}
      >
        <ul className="flex flex-wrap gap-2 text-sm text-neutral-700">
          {facts.map((fact) => (
            <li
              key={fact.id}
              className="border-line inline-flex items-center gap-2 rounded-full border bg-neutral-50 px-3.5 py-1.5"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="text-accent-700 h-4 w-4 shrink-0"
                fill="none"
              >
                <path
                  d={factIcons[fact.id]}
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {fact.text}
            </li>
          ))}
        </ul>
      </PageHeader>

      <Section
        id="itinerary"
        eyebrow={t("photos.itineraryEyebrow")}
        heading={t("photos.itineraryHeading")}
        description={t("photos.itineraryDescription")}
      >
        <ExcursionProgram
          stops={stops}
          labels={{
            lightboxLabel: t("photos.lightboxLabel"),
            close: t("common.close"),
            previous: t("common.previous"),
            next: t("common.next"),
          }}
        />
      </Section>
    </>
  );
}
