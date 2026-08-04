import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { committees } from "@/data/committees";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "committees" });
  return buildMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/committees",
  });
}

export default async function CommitteesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageHeader
        title={t("committees.heading")}
        intro={t("committees.lead")}
      />

      {committees.map((committee) => (
        <Section
          key={committee.id}
          id={committee.id}
          heading={committee.name[locale]}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {committee.leadership.flatMap((group) =>
              group.people.map((person) => (
                <div
                  key={person.name}
                  className="border-line rounded-lg border bg-neutral-50 p-5"
                >
                  <p className="text-accent-700 text-xs font-semibold tracking-[0.14em] uppercase">
                    {group.role[locale]}
                  </p>
                  <p className="text-primary-900 mt-2 font-semibold">
                    {person.name}
                  </p>
                  <p className="mt-0.5 text-sm text-neutral-500">
                    {person.country[locale]}
                  </p>
                </div>
              )),
            )}
          </div>

          <div className="mt-8 mb-4 flex items-baseline gap-2.5">
            <h3 className="text-base">{committee.members.role[locale]}</h3>
            <span className="text-sm text-neutral-500">
              {t("committees.memberCount", {
                count: committee.members.people.length,
              })}
            </span>
          </div>
          <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {committee.members.people.map((person) => (
              <li
                key={person.name}
                className="flex gap-2.5 text-sm leading-relaxed text-neutral-700"
              >
                <span
                  aria-hidden
                  className="bg-accent-500 mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                />
                <span>
                  {person.name}
                  <span className="text-neutral-500">
                    {" "}
                    · {person.country[locale]}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </>
  );
}
