import type { ConferenceSlug, LocalizedText } from "./conferences";

/**
 * About-page content: the conference goals and the topic lists of the four
 * scientific sections, as published on the organiser's About page.
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
  topics: LocalizedText[];
};

export const aboutSections: AboutSection[] = [
  {
    slug: "exact-sciences",
    numeral: "I",
    topics: [
      { uz: "Matematika", en: "Mathematics" },
      { uz: "Fizika", en: "Physics" },
      { uz: "Informatika", en: "Computer science" },
      {
        uz: "Statistika va maʼlumotlar fani",
        en: "Statistics and data science",
      },
      {
        uz: "Amaliy matematika va matematik modellashtirish",
        en: "Applied mathematics and mathematical modelling",
      },
    ],
  },
  {
    slug: "engineering-sciences",
    numeral: "II",
    topics: [
      {
        uz: "Axborot-kommunikatsiya texnologiyalari",
        en: "Information and communication technologies",
      },
      {
        uz: "Neft-gaz sanoatida zamonaviy texnologiyalar",
        en: "Emerging technologies in the oil and gas industry",
      },
      {
        uz: "Energetika tizimlari va energiya tejamkor texnologiyalar",
        en: "Energy systems and energy-efficient technologies",
      },
      {
        uz: "Geologik qidiruv va qatlam muhandisligi",
        en: "Exploration and reservoir engineering",
      },
      {
        uz: "Sanoat xavfsizligi, xavflarni baholash va ishonchlilik muhandisligi",
        en: "Industrial safety, risk assessment and reliability engineering",
      },
    ],
  },
  {
    slug: "natural-sciences",
    numeral: "III",
    topics: [
      {
        uz: "Fizika va zamonaviy fizik texnologiyalar",
        en: "Physics and modern physical technologies",
      },
      {
        uz: "Kimyo va kimyoviy texnologiyalar",
        en: "Chemistry and chemical technologies",
      },
      {
        uz: "Neft-gaz sohasida atrof-muhitni muhofaza qilish va barqaror rivojlanish",
        en: "Environmental protection and sustainable development in the oil and gas sector",
      },
      {
        uz: "Biologiya, biotexnologiya va bioinformatika",
        en: "Biology, biotechnology and bioinformatics",
      },
      {
        uz: "Neft va gaz qidiruvi hamda qatlamlarni oʻrganish",
        en: "Oil and gas exploration and reservoir characterisation",
      },
    ],
  },
  {
    slug: "humanities",
    numeral: "IV",
    topics: [
      {
        uz: "Iqtisodiyot va ijtimoiy-iqtisodiy rivojlanish",
        en: "Economics and socio-economic development",
      },
      {
        uz: "Pedagogika va zamonaviy taʼlim texnologiyalari",
        en: "Pedagogy and modern educational technologies",
      },
      {
        uz: "Psixologiya va ijtimoiy jarayonlar",
        en: "Psychology and social processes",
      },
      {
        uz: "Falsafa, sotsiologiya va fanlararo tadqiqotlar",
        en: "Philosophy, sociology and interdisciplinary studies",
      },
      {
        uz: "Filologiya, tilshunoslik va madaniyatshunoslik",
        en: "Philology, linguistics and cultural studies",
      },
    ],
  },
];
