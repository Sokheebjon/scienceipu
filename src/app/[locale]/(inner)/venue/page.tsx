import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { DataTable } from "@/components/ui/DataTable";
import { accommodation } from "@/data/accommodation";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

const GALLERY = [
  "/img/venue/hotel/suite-living.jpg",
  "/img/venue/hotel/suite-bedroom.jpg",
  "/img/venue/hotel/room-twin.jpg",
  "/img/venue/hotel/room-family.jpg",
];

/** Drop campus photos into /public/img/venue/university and list them here. */
const UNIVERSITY_GALLERY: string[] = [];

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

  return (
    <>
      <PageHeader title={t("venue.heading")} />

      <Section heading={t("venue.countryHeading")} width="wide">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="prose-site">
            <p>{t("venue.countryBody1")}</p>
            <p>{t("venue.countryBody2")}</p>
            <p>{t("venue.visaBody")}</p>
          </div>
          <figure>
            <div className="relative aspect-[1000/652] overflow-hidden rounded-lg">
              <Image
                src="/img/venue/uzbekistan-map.svg"
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

      <Section heading={t("venue.cityHeading")} tone="tinted" width="wide">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="prose-site">
            <p>{t("venue.cityBody1")}</p>
            <p>{t("venue.cityBody2")}</p>
          </div>
          <div className="border-line relative aspect-[4/3] overflow-hidden rounded-lg border">
            <Image
              src="/img/venue/qarshi.jpg"
              alt={t("venue.cityImageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section heading={t("venue.universityHeading")} width="wide">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="prose-site">
            <p>{t("venue.universityBody1")}</p>
            <p>{t("venue.universityBody2")}</p>
          </div>
          <div className="border-line relative aspect-[3/2] overflow-hidden rounded-lg border">
            <Image
              src="/img/conferences/ipu-main.png"
              alt={t("venue.universityImageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
        {UNIVERSITY_GALLERY.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {UNIVERSITY_GALLERY.map((src, index) => (
              <div
                key={src}
                className="border-line relative aspect-[4/3] overflow-hidden rounded-lg border"
              >
                <Image
                  src={src}
                  alt={t("venue.universityGalleryAlt", { index: index + 1 })}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}
      </Section>

      <Section heading={t("venue.hotelHeading")} tone="tinted" width="wide">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="prose-site">
            <p>{t("venue.hotelBody1")}</p>
            <p>{t("venue.hotelBody2")}</p>
          </div>
          <div className="border-line relative aspect-[16/9] overflow-hidden rounded-lg border">
            <Image
              src="/img/venue/hotel/exterior.jpg"
              alt={t("venue.hotelImageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {GALLERY.map((src, index) => (
            <div
              key={src}
              className="border-line relative aspect-[4/3] overflow-hidden rounded-lg border"
            >
              <Image
                src={src}
                alt={t("venue.galleryAlt", { index: index + 1 })}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section
        heading={t("venue.accommodationHeading")}
        description={t("venue.accommodationBody")}
        width="wide"
      >
        <DataTable
          headers={[
            t("venue.accommodationHotel"),
            t("venue.accommodationCategory"),
            t("venue.accommodationLocation"),
          ]}
          rows={accommodation.map((item) => [
            item.name[locale],
            item.category,
            item.location[locale],
          ])}
        />
      </Section>

      <Section heading={t("venue.travelHeading")} tone="tinted">
        <div className="prose-site max-w-3xl">
          <p>{t("venue.travelBody")}</p>
        </div>
      </Section>
    </>
  );
}
