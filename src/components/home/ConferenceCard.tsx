import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Conference } from "@/data/conferences";
import { LinkButton } from "@/components/ui/Button";
import { formatDateRange, formatEdition } from "@/lib/format";

type Props = {
  conference: Conference;
  locale: Locale;
  labels: {
    edition: string;
    register: string;
    learnMore: string;
  };
};

export function ConferenceCard({ conference, locale, labels }: Props) {
  const href = `/conferences/${conference.slug}`;

  return (
    <article className="border-line flex h-full flex-col overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md">
      <div className="border-accent-500 flex-1 border-t-4 p-5">
        <h3 className="text-lg leading-snug">
          <Link
            href={href}
            className="text-primary-800 hover:text-primary-600 underline-offset-2 hover:underline"
          >
            {conference.name[locale]}
          </Link>
        </h3>
        <p className="mt-3 text-sm text-neutral-600">
          <span className="block font-medium text-neutral-700">
            {labels.edition}
          </span>
          <span className="mt-1 block">
            {formatDateRange(conference.startDate, conference.endDate, locale)}
          </span>
          <span className="block">
            {conference.city[locale]}, {conference.country[locale]}
          </span>
        </p>
      </div>
      <div className="border-line flex flex-wrap gap-2 border-t bg-neutral-50 p-4">
        <LinkButton
          href={{
            pathname: "/register",
            query: { conference: conference.slug },
          }}
          size="sm"
        >
          {labels.register}
        </LinkButton>
        <LinkButton href={href} variant="secondary" size="sm">
          {labels.learnMore}
        </LinkButton>
      </div>
    </article>
  );
}

/** Edition label is formatted per locale: "14th" in English, "14-" in Uzbek. */
export function editionLabel(edition: number, locale: Locale) {
  return formatEdition(edition, locale);
}
