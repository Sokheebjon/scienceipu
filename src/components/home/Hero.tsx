import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { conferences } from "@/data/conferences";
import { formatDate, formatDateRange } from "@/lib/format";

/**
 * Full-bleed hero carrying the page's only h1.
 *
 * The image sits in a fixed-ratio box behind the content and is priority
 * loaded, and the content column has its own min-height, so neither the image
 * decoding nor the font swap moves anything below the fold.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations();

  const first = conferences.reduce((earliest, conference) =>
    conference.startDate < earliest.startDate ? conference : earliest,
  );
  const last = conferences.reduce((latest, conference) =>
    conference.endDate > latest.endDate ? conference : latest,
  );

  const span = formatDateRange(first.startDate, last.endDate, locale);

  const facts = [
    { label: t("home.factConferences"), value: t("home.factConferencesValue") },
    { label: t("home.factDates"), value: span },
    {
      label: t("home.factCity"),
      value: `${first.city[locale]}, ${first.country[locale]}`,
    },
    {
      label: t("home.factDeadline"),
      value: formatDate(first.deadlines.registration, locale),
    },
  ];

  return (
    <section className="bg-primary-950 relative isolate overflow-hidden">
      <Image
        src="/img/hero.svg"
        alt={t("home.heroAlt")}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div
        aria-hidden
        className="from-primary-950/90 via-primary-950/60 absolute inset-0 -z-10 bg-gradient-to-r to-transparent"
      />

      <Container width="wide">
        <div className="flex min-h-[26rem] flex-col justify-center py-16 sm:min-h-[30rem] sm:py-20">
          <p className="text-accent-400 text-sm font-semibold tracking-[0.14em] uppercase">
            {t("home.heroEyebrow", {
              city: first.city[locale],
              dates: span,
            })}
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            {t("home.heroTitle")}
          </h1>

          <p className="text-primary-100 mt-5 max-w-xl text-lg">
            {t("home.heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <LinkButton href="/register" variant="accent" size="lg">
              {t("home.heroCta")}
            </LinkButton>
            <a
              href="#conferences"
              className="border-primary-400/60 hover:border-accent-500 hover:bg-primary-800/60 inline-flex items-center gap-2 rounded-md border px-6 py-3 text-base font-semibold text-white transition-colors"
            >
              {t("home.heroSecondary")}
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
              >
                <path
                  d="M12 5v14M5 12l7 7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <p className="mt-8 text-sm">
            <Link
              href="/photos"
              className="text-primary-200 decoration-accent-500/60 hover:decoration-accent-400 underline underline-offset-4 transition-colors hover:text-white"
            >
              {t("home.heroCaption")}
            </Link>
          </p>
        </div>
      </Container>

      {/* Key facts, sitting on the seam between hero and page body. */}
      <div className="bg-primary-950/70 relative border-t border-white/10 backdrop-blur-sm">
        <Container width="wide">
          <dl className="divide-primary-700/60 grid grid-cols-2 sm:grid-cols-4 sm:divide-x">
            {facts.map((fact) => (
              <div key={fact.label} className="px-1 py-5 sm:px-6 sm:first:pl-0">
                <dt className="text-primary-300 text-xs font-medium tracking-wide uppercase">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-white sm:text-base">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>
    </section>
  );
}
