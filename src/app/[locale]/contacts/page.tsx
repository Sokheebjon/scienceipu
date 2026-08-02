import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/form/ContactForm";
import { site } from "@/data/site";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contacts" });
  return buildMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/contacts",
  });
}

export default async function ContactsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageHeader title={t("contacts.heading")} intro={t("contacts.intro")} />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className="text-xl">{t("contacts.addressHeading")}</h2>
            <address className="mt-3 text-neutral-700 not-italic">
              <p className="font-medium text-primary-800">
                {site.name[locale]}
              </p>
              <p className="mt-1">{site.contact.address[locale]}</p>
            </address>

            <h2 className="mt-8 text-xl">{t("contacts.emailHeading")}</h2>
            <p className="mt-3">
              <a
                href={`mailto:${site.contact.email}`}
                className="text-accent-700 underline underline-offset-2 hover:text-primary-700"
              >
                {site.contact.email}
              </a>
            </p>

            <h2 className="mt-8 text-xl">{t("contacts.phoneHeading")}</h2>
            <ul className="mt-3 space-y-1 text-neutral-700">
              {site.contact.phones.map((phone) => (
                <li key={phone.number}>
                  <a
                    href={`tel:${phone.number.replace(/\s/g, "")}`}
                    className="hover:underline"
                  >
                    {phone.number}
                  </a>{" "}
                  <span className="text-neutral-500">
                    ({phone.language[locale]})
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-lg border-l-4 border-accent-500 bg-accent-50 p-4">
              <p className="text-sm text-neutral-700">
                {t("contacts.submissionNote")}
              </p>
              <p className="mt-2">
                <Link
                  href="/upload"
                  className="text-sm font-medium text-accent-700 underline underline-offset-2 hover:text-primary-700"
                >
                  {t("contacts.submissionCta")}
                </Link>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl">{t("contacts.formHeading")}</h2>
            <div className="mt-5">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
