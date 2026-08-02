import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { RegistrationForm } from "@/components/form/RegistrationForm";
import { conferences } from "@/data/conferences";
import { DEFAULT_COUNTRY, getCountryOptions } from "@/data/countries";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "register" });
  return buildMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/register",
  });
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // Built on the server: ICU data can differ between Node and the browser, and
  // resolving country names in the client would risk a hydration mismatch.
  const countries = getCountryOptions(locale);

  return (
    <>
      <PageHeader title={t("register.heading")} intro={t("register.intro")} />

      <Section width="default">
        <div className="max-w-3xl">
          {/* No Suspense boundary: the form reads ?conference= on mount rather
              than via useSearchParams, so it renders in full in the static HTML
              and nothing shifts on hydration. */}
          <RegistrationForm
            countries={countries}
            defaultCountry={DEFAULT_COUNTRY}
            conferences={conferences.map((conference) => ({
              value: conference.slug,
              label: conference.name[locale],
            }))}
          />
        </div>
      </Section>
    </>
  );
}
