import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Conference } from "@/data/conferences";
import { LinkButton } from "@/components/ui/Button";
import { formatDateRange } from "@/lib/format";

type Props = {
  conference: Conference;
  locale: Locale;
  labels: {
    edition: string;
    register: string;
    learnMore: string;
  };
};

function CalendarIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3 10h18M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
    >
      <path
        d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ConferenceCard({ conference, locale, labels }: Props) {
  const href = `/conferences/${conference.slug}`;

  return (
    <article className="group border-line hover:border-primary-300 flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[2/1] overflow-hidden">
        <Image
          src={`/img/conferences/${conference.slug}-card.svg`}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <span className="bg-accent-500 text-primary-900 absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold shadow-sm">
          {labels.edition}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg leading-snug">
          <Link
            href={href}
            className="text-primary-800 group-hover:text-primary-600 transition-colors"
          >
            {conference.name[locale]}
          </Link>
        </h3>

        <div className="mt-3 space-y-1.5 text-sm text-neutral-600">
          <p className="flex items-center gap-2">
            <span className="text-accent-700">
              <CalendarIcon />
            </span>
            {formatDateRange(conference.startDate, conference.endDate, locale)}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-accent-700">
              <PinIcon />
            </span>
            {conference.city[locale]}, {conference.country[locale]}
          </p>
        </div>

        <div className="border-line mt-5 flex flex-wrap gap-2 border-t pt-4">
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
      </div>
    </article>
  );
}
