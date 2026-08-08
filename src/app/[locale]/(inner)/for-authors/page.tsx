import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { buttonClass, LinkButton } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

const TEMPLATE_PATH = "/data/Template.docx";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "forAuthors" });
  return buildMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/for-authors",
  });
}

export default async function ForAuthorsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const structure = [
    t("forAuthors.structure1"),
    t("forAuthors.structure2"),
    t("forAuthors.structure3"),
    t("forAuthors.structure4"),
    t("forAuthors.structure5"),
    t("forAuthors.structure6"),
    t("forAuthors.structure7"),
  ];

  const formatting = [
    t("forAuthors.formatting1"),
    t("forAuthors.formatting2"),
    t("forAuthors.formatting3"),
    t("forAuthors.formatting4"),
    t("forAuthors.formatting5"),
    t("forAuthors.formatting6"),
    t("forAuthors.formatting7"),
  ];

  return (
    <>
      <PageHeader
        title={t("forAuthors.heading")}
        intro={t("forAuthors.intro")}
      />

      <Section
        heading={t("forAuthors.structureHeading")}
        description={t("forAuthors.structureIntro")}
      >
        <ol className="max-w-3xl list-decimal space-y-2 pl-5 text-neutral-700 marker:font-semibold">
          {structure.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </Section>

      <Section heading={t("forAuthors.formattingHeading")} tone="tinted">
        <ul className="max-w-3xl space-y-3">
          {formatting.map((item) => (
            <li key={item} className="flex gap-3 text-neutral-700">
              <span
                aria-hidden
                className="bg-accent-500 mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
              />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section heading={t("forAuthors.templateHeading")}>
        <div className="max-w-3xl">
          <p className="text-neutral-700">{t("forAuthors.templateBody")}</p>
          <div className="mt-6">
            <a href={TEMPLATE_PATH} download className={buttonClass("primary", "lg")}>
              {t("forAuthors.templateCta")}
            </a>
          </div>
        </div>
      </Section>

      <Section heading={t("forAuthors.submitHeading")} tone="tinted">
        <div className="max-w-3xl">
          <p className="text-neutral-700">{t("forAuthors.submitBody")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/upload">{t("forAuthors.submitCta")}</LinkButton>
            <LinkButton href="/deadlines" variant="secondary">
              {t("forAuthors.deadlinesCta")}
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
