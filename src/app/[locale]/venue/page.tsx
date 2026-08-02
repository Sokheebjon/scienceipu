import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { DataTable } from "@/components/ui/DataTable";
import { accommodation } from "@/data/accommodation";
import { conferences } from "@/data/conferences";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "venue" });
  return buildMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/venue",
  });
}

export default async function VenuePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const venue = conferences[0];
  const distance = new Intl.NumberFormat(locale === "uz" ? "uz" : "en-GB");

  return (
    <>
      <PageHeader title={t("venue.heading")} />

      <Section heading={t("venue.venueHeading")}>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="prose-site">
            <p className="text-lg font-medium text-primary-800">
              {venue.venue[locale]}, {venue.city[locale]},{" "}
              {venue.country[locale]}
            </p>
            <p>{t("venue.venueBody")}</p>
          </div>
          <figure>
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-line">
              <Image
                src="/img/venue-map.svg"
                alt={t("venue.mapAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 text-sm text-neutral-500">
              {t("venue.mapNote")}
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section heading={t("venue.cityHeading")} tone="tinted">
        <div className="prose-site max-w-3xl">
          <p>{t("venue.cityBody")}</p>
        </div>
      </Section>

      <Section
        heading={t("venue.accommodationHeading")}
        description={t("venue.accommodationBody")}
      >
        <DataTable
          headers={[
            t("venue.accommodationHotel"),
            t("venue.accommodationCategory"),
            t("venue.accommodationDistance"),
          ]}
          rows={accommodation.map((item) => [
            item.name[locale],
            item.category,
            `${distance.format(item.distanceMetres)} m`,
          ])}
        />

        <div className="mt-8 rounded-lg border-l-4 border-accent-500 bg-accent-50 p-5">
          <h3 className="text-base">{t("venue.fraudHeading")}</h3>
          <p className="mt-2 text-sm text-neutral-700">
            {t("venue.fraudBody")}
          </p>
        </div>
      </Section>

      <Section heading={t("venue.travelHeading")} tone="tinted">
        <div className="prose-site max-w-3xl">
          <p>{t("venue.travelBody")}</p>
        </div>
      </Section>
    </>
  );
}
