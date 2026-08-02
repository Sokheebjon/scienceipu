import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

const SECTIONS = ["s1", "s2", "s3", "s4", "s5", "s6"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return buildMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/privacy",
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageHeader title={t("privacy.heading")} intro={t("privacy.updated")} />

      <Section width="narrow">
        <div className="prose-site">
          {SECTIONS.map((section) => (
            <section key={section}>
              <h2>{t(`privacy.${section}Heading`)}</h2>
              <p>{t(`privacy.${section}Body`)}</p>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
