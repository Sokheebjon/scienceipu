import type { Locale } from "@/i18n/routing";

/** BCP 47 tags handed to Intl. `uz` resolves to Uzbek Latin. */
const intlLocale: Record<Locale, string> = {
  uz: "uz",
  en: "en-GB",
};

/** Conference dates are plain ISO days; format them in a fixed zone. */
const TIME_ZONE = "UTC";

type DateParts = { day: string; month: string; year: string };

function partsOf(date: Date, locale: Locale): DateParts {
  const formatter = new Intl.DateTimeFormat(intlLocale[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  });

  const result: Record<string, string> = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== "literal") result[part.type] = part.value;
  }

  return {
    day: result.day ?? "",
    month: result.month ?? "",
    year: result.year ?? "",
  };
}

function toDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

/**
 * Single date, e.g. "15-may, 2026" (uz) or "15 May 2026" (en).
 */
export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(toDate(iso));
}

/**
 * Inclusive date range, collapsed when the endpoints share a month or year.
 *
 * Intl's own `formatRange` produces "10 – 13-avgust, 2026" for Uzbek, whose
 * spacing reads awkwardly, so the parts are recombined by hand per locale.
 *
 *   uz  10–13-avgust, 2026      30-iyul – 2-avgust, 2026
 *   en  10–13 August 2026       30 July – 2 August 2026
 */
export function formatDateRange(
  startIso: string,
  endIso: string,
  locale: Locale,
): string {
  const start = partsOf(toDate(startIso), locale);
  const end = partsOf(toDate(endIso), locale);

  const sameYear = start.year === end.year;
  const sameMonth = sameYear && start.month === end.month;

  if (startIso === endIso) return formatDate(startIso, locale);

  if (locale === "uz") {
    if (sameMonth) return `${start.day}–${end.day}-${end.month}, ${end.year}`;
    if (sameYear) {
      return `${start.day}-${start.month} – ${end.day}-${end.month}, ${end.year}`;
    }
    return `${start.day}-${start.month}, ${start.year} – ${end.day}-${end.month}, ${end.year}`;
  }

  if (sameMonth) return `${start.day}–${end.day} ${end.month} ${end.year}`;
  if (sameYear) {
    return `${start.day} ${start.month} – ${end.day} ${end.month} ${end.year}`;
  }
  return `${start.day} ${start.month} ${start.year} – ${end.day} ${end.month} ${end.year}`;
}

/** Ordinal used for "14th International Conference". Uzbek uses "14-". */
export function formatEdition(edition: number, locale: Locale): string {
  if (locale === "uz") return `${edition}-`;

  const remainderTen = edition % 10;
  const remainderHundred = edition % 100;
  if (remainderTen === 1 && remainderHundred !== 11) return `${edition}st`;
  if (remainderTen === 2 && remainderHundred !== 12) return `${edition}nd`;
  if (remainderTen === 3 && remainderHundred !== 13) return `${edition}rd`;
  return `${edition}th`;
}

/** Participation fees, e.g. "€360". */
export function formatFee(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale], {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Sheet timestamp: sortable-as-text local time in Tashkent. */
export function tashkentTimestamp(now: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return formatter.format(now).replace("T", " ");
}
