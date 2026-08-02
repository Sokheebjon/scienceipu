import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Gallery, type GalleryItem } from "@/components/gallery/Gallery";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

const IMAGE_COUNT = 12;

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

export default async function PhotosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const items: GalleryItem[] = Array.from(
    { length: IMAGE_COUNT },
    (_, offset) => {
      const index = offset + 1;
      return {
        src: `/img/gallery/photo-${String(index).padStart(2, "0")}.svg`,
        alt: t("photos.imageAlt", { index }),
        open: t("photos.openImage", { index }),
        counter: t("common.image", { current: index, total: IMAGE_COUNT }),
      };
    },
  );

  return (
    <>
      <PageHeader title={t("photos.heading")} intro={t("photos.intro")} />

      <Section width="wide">
        <Gallery
          items={items}
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
