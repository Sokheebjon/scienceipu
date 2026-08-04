import type { LocalizedText } from "./conferences";

/**
 * Organiser identity and contact details.
 *
 * TODO: placeholder organisation, address, phone, email and bank details.
 * Replace with the real organiser data before launch.
 */

export const site = {
  /** Localised wordmark. The logo lockup reserves a fixed width for this. */
  name: {
    uz: "Xalqaro Ilmiy Anjumanlar",
    en: "International Scientific Conferences",
  } satisfies LocalizedText,

  /** Short form used in the footer copyright line and OG site name. */
  shortName: {
    uz: "Xalqaro Ilmiy Anjumanlar",
    en: "International Scientific Conferences",
  } satisfies LocalizedText,

  /** Short place line under the wordmark in the header lockup. */
  locality: {
    uz: "Samarqand, Oʻzbekiston",
    en: "Samarkand, Uzbekistan",
  } satisfies LocalizedText,

  foundedYear: 2011,

  /** Absolute origin, used for canonical URLs and hreflang alternates. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://conferences.example.uz",

  contact: {
    email: "info@example.uz",
    submissionsEmail: "papers@example.uz",
    phones: [
      {
        number: "+998 71 200 00 00",
        language: { uz: "oʻzbekcha", en: "Uzbek" },
      },
      {
        number: "+998 71 200 00 01",
        language: { uz: "inglizcha", en: "English" },
      },
    ],
    address: {
      uz: "Registon koʻchasi 1, 140100 Samarqand, Oʻzbekiston",
      en: "1 Registan Street, 140100 Samarkand, Uzbekistan",
    } satisfies LocalizedText,
  },

  /** Tax identifiers printed on invoices. */
  registration: {
    inn: "000 000 000",
    vat: "UZ000000000",
  },
} as const;

export type Site = typeof site;
