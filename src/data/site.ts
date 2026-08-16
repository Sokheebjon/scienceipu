import type { LocalizedText } from "./conferences";

/**
 * Organiser identity and contact details.
 *
 * TODO: placeholder organisation, address, phone, email and bank details.
 * Replace with the real organiser data before launch.
 */

export const site = {
  /**
   * Full conference name: OG site name, the `%s — name` title template and
   * the contacts page. The header lockup splits it into `kicker` + `title`.
   */
  name: {
    uz: "“Fan va texnologiyaning dolzarb masalalari” xalqaro ilmiy-amaliy konferensiyasi",
    en: "International Scientific and Practical Conference: Current Issues of Science and Technology",
  } satisfies LocalizedText,

  /** Small uppercase line above the wordmark in the header lockup. */
  kicker: {
    uz: "Xalqaro ilmiy-amaliy konferensiya",
    en: "International Scientific and Practical Conference",
  } satisfies LocalizedText,

  /** Bold wordmark line in the header lockup. */
  title: {
    uz: "Fan va texnologiyaning dolzarb masalalari",
    en: "Current Issues of Science and Technology",
  } satisfies LocalizedText,

  /** Short form used in the footer copyright line. */
  shortName: {
    uz: "Fan va texnologiyaning dolzarb masalalari",
    en: "Current Issues of Science and Technology",
  } satisfies LocalizedText,

  /** Organising institution, shown on the About page. */
  organiser: {
    uz: "Iqtisodiyot va pedagogika universiteti",
    en: "University of Economics and Pedagogy",
  } satisfies LocalizedText,

  /** Short place line under the wordmark in the header lockup. */
  locality: {
    uz: "Qarshi, Oʻzbekiston",
    en: "Qarshi, Uzbekistan",
  } satisfies LocalizedText,

  foundedYear: 2011,

  /** Absolute origin, used for canonical URLs and hreflang alternates. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://conferences.example.uz",

  contact: {
    email: "shohjahon.abduraximov@ipu-edu.uz",
    submissionsEmail: "papers@example.uz",
    phones: [
      {
        number: "+998 93 934 09 39",
        language: { uz: "oʻzbekcha", en: "Uzbek" },
      },
      {
        number: "+998 91 956 21 68",
        language: { uz: "inglizcha", en: "English" },
      },
    ],
    address: {
      uz: "Qarshi shahri, Qashqadaryo viloyati, Oʻzbekiston",
      en: "Qarshi, Qashqadaryo Region, Uzbekistan",
    } satisfies LocalizedText,
  },
} as const;

export type Site = typeof site;
