import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { DataTable } from "@/components/ui/DataTable";
import { LinkButton } from "@/components/ui/Button";
import { conferences, type ConferenceFees } from "@/data/conferences";
import { site } from "@/data/site";
import { formatFee } from "@/lib/format";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

const FEE_ORDER: (keyof ConferenceFees)[] = [
  "standard",
  "returningParticipant",
  "phdUnder30",
  "late",
  "additionalPaper",
  "accompanyingPerson",
  "attendanceOnly",
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "payment" });
  return buildMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/payment",
  });
}

export default async function PaymentPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // Fees are identical across events; the first conference is the reference.
  const fees = conferences[0].fees;

  const included = [
    t("payment.included1"),
    t("payment.included2"),
    t("payment.included3"),
    t("payment.included4"),
    t("payment.included5"),
    t("payment.included6"),
  ];

  const bankRows: [string, string][] = [
    [t("payment.bankRecipient"), site.bank.recipient],
    [t("payment.bankRecipientAddress"), site.bank.recipientAddress[locale]],
    [t("payment.bankName"), site.bank.bankName],
    [t("payment.bankAddress"), site.bank.bankAddress[locale]],
    [t("payment.bankIban"), site.bank.iban],
    [t("payment.bankSwift"), site.bank.swift],
    [t("payment.bankReference"), t("payment.bankReferenceValue")],
  ];

  return (
    <>
      <PageHeader title={t("payment.heading")} intro={t("payment.intro")} />

      <Section heading={t("payment.feeCategory")}>
        <DataTable
          alignLastRight
          headers={[t("payment.feeCategory"), t("payment.feeAmount")]}
          rows={FEE_ORDER.map((key) => [
            t(`feeLabels.${key}`),
            formatFee(fees[key], locale),
          ])}
        />
      </Section>

      <Section heading={t("payment.includedHeading")} tone="tinted">
        <ul className="grid gap-3 sm:grid-cols-2">
          {included.map((item) => (
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

      <Section heading={t("payment.methodsHeading")}>
        <div className="prose-site max-w-3xl">
          <p>{t("payment.methodsBody")}</p>
        </div>

        <h3 className="mt-10 mb-4 text-xl">{t("payment.bankHeading")}</h3>
        <DataTable
          headers={[t("payment.bankHeading"), ""]}
          rows={bankRows.map(([label, value]) => [label, value])}
        />
        <p className="mt-3 text-sm text-neutral-500">
          TODO: replace the placeholder bank details above with the real account
          before launch.
        </p>
      </Section>

      <Section heading={t("payment.invoiceHeading")} tone="tinted">
        <div className="prose-site max-w-3xl">
          <p>{t("payment.invoiceBody")}</p>
        </div>
        <div className="mt-8">
          <LinkButton href="/register" size="lg">
            {t("payment.cta")}
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
