import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Conference } from "@/data/conferences";
import { LinkButton } from "@/components/ui/Button";
import { formatDateRange } from "@/lib/format";

type Props = {
  conference: Conference;
  locale: Locale;
  labels: {
    register: string;
    learnMore: string;
  };
};

/**
 * A reference `.box`: a dark tile in the 1px-gap event mosaic. Title link in
 * the accent colour, the section's topic list, two plain lines (dates, city),
 * then the two uppercase buttons.
 */
export function ConferenceCard({ conference, locale, labels }: Props) {
  const href = `/conferences/${conference.slug}`;

  return (
    <article className="bg-primary-800 flex h-full flex-col p-5">
      <h2 className="text-[22px] leading-snug font-normal">
        <Link
          href={href}
          className="text-accent-400 hover:text-accent-300 underline-offset-2 transition-colors hover:underline"
        >
          {conference.name[locale]}
        </Link>
      </h2>

      <p className="text-primary-100 mt-2.5 text-sm leading-6">
        {conference.topics.map((topic) => topic[locale]).join(", ")}
      </p>

      <p className="text-primary-100 mt-3 mb-5 text-sm leading-6">
        <span className="block">
          {formatDateRange(conference.startDate, conference.endDate, locale)}
        </span>
        <span className="block">
          {conference.city[locale]}, {conference.country[locale]}
        </span>
      </p>

      <div className="mt-auto flex flex-wrap gap-2.5">
        <LinkButton
          href={{
            pathname: "/register",
            query: { conference: conference.slug },
          }}
          variant="accent"
          size="sm"
          className="min-w-[8.5rem] text-xs tracking-wide uppercase"
        >
          {labels.register}
        </LinkButton>
        <LinkButton
          href={href}
          variant="light"
          size="sm"
          className="min-w-[8.5rem] text-xs tracking-wide uppercase"
        >
          {labels.learnMore}
        </LinkButton>
      </div>
    </article>
  );
}
