import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { PartnersStrip } from "@/components/home/PartnersStrip";
import { site } from "@/data/site";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

/** TODO: placeholder figures. Replace with the organiser's real numbers. */
const STATS = [
  { key: "statYears", value: 15 },
  { key: "statConferences", value: 78 },
  { key: "statParticipants", value: 9200 },
  { key: "statCountries", value: 41 },
  { key: "statPapers", value: 2100 },
  { key: "statOrganisations", value: 640 },
] as const;

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
  const number = new Intl.NumberFormat(locale === "uz" ? "uz" : "en-GB");

  return (
    <>
      <PageHeader title={t("about.heading")} intro={t("about.lead")} />

      <Section>
        <div className="prose-site max-w-3xl">
          <p>{t("about.body1")}</p>
          <p>{t("about.body2")}</p>
        </div>
      </Section>

      <Section heading={t("about.statsHeading")} tone="tinted">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {STATS.map((stat) => (
            <div
              key={stat.key}
              className="border-line rounded-lg border bg-white p-4 text-center"
            >
              <dt className="order-2 mt-1 text-xs text-neutral-600">
                {t(`about.${stat.key}`)}
              </dt>
              <dd className="text-primary-800 text-2xl font-bold tabular-nums">
                {number.format(stat.value)}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section heading={t("about.legalHeading")}>
        <div className="prose-site max-w-3xl">
          <p>{t("about.legalBody")}</p>
          <ul>
            <li>{site.name[locale]}</li>
            <li>{site.contact.address[locale]}</li>
            <li>INN {site.registration.inn}</li>
            <li>VAT {site.registration.vat}</li>
          </ul>
        </div>
      </Section>

      <Section heading={t("about.partnersHeading")} tone="tinted" width="wide">
        <PartnersStrip locale={locale} />
      </Section>
    </>
  );
}
