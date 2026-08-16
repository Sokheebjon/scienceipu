import type { ConferenceSlug, LocalizedText } from "./conferences";

/**
 * About-page content: the conference goals and the numbering of the four
 * scientific sections. Each section's topic list lives on its conference
 * entry in `conferences.ts`.
 */

export const aboutGoals: LocalizedText[] = [
  {
    uz: "Aniq, muhandislik, tabiiy va gumanitar fanlar yoʻnalishlarida fan va texnologiyaning dolzarb masalalarini muhokama qilish",
    en: "Discuss current issues of science and technology in the exact, engineering, natural and humanities sciences",
  },
  {
    uz: "Fanlararo integratsiyani rivojlantirish",
    en: "Promote interdisciplinary integration between research fields",
  },
  {
    uz: "Zamonaviy ilmiy tadqiqot natijalari bilan almashish",
    en: "Exchange contemporary research findings",
  },
  {
    uz: "Xalqaro ilmiy hamkorlikni mustahkamlash",
    en: "Strengthen international scientific cooperation",
  },
];

export type AboutSection = {
  /** Links the section card to its conference page. */
  slug: ConferenceSlug;
  /** Roman ordinal, matching the numbering used on the reference page. */
  numeral: string;
};

export const aboutSections: AboutSection[] = [
  { slug: "exact-sciences", numeral: "I" },
  { slug: "engineering-sciences", numeral: "II" },
  { slug: "natural-sciences", numeral: "III" },
  { slug: "humanities", numeral: "IV" },
];
