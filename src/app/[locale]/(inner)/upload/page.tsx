import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { UploadForm } from "@/components/form/UploadForm";
import { conferences } from "@/data/conferences";
import { site } from "@/data/site";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "upload" });
  return buildMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/upload",
  });
}

export default async function UploadPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const notices = [
    t("upload.notice1"),
    t("upload.notice2"),
    t("upload.notice3"),
    t("upload.notice4"),
  ];

  return (
    <>
      <PageHeader title={t("upload.heading")} intro={t("upload.intro")} />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <h2 className="text-xl">{t("upload.noticeHeading")}</h2>
            <ul className="mt-4 space-y-3">
              {notices.map((notice) => (
                <li
                  key={notice}
                  className="flex gap-3 text-sm text-neutral-700"
                >
                  <span
                    aria-hidden
                    className="bg-accent-500 mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                  />
                  {notice}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <UploadForm
              submissionsEmail={site.contact.submissionsEmail}
              conferences={conferences.map((conference) => ({
                value: conference.slug,
                label: conference.name[locale],
              }))}
            />
          </div>
        </div>
      </Section>
    </>
  );
}
