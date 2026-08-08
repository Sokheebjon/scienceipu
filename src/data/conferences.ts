/**
 * Central conference data. Every page reads from this file; conference facts
 * are never duplicated inside components.
 *
 * TODO: dates, editions and committee members below are placeholders.
 * Replace with the real event data before launch.
 */

export type LocalizedText = { uz: string; en: string };

export const conferenceSlugs = [
  "exact-sciences",
  "engineering-sciences",
  "natural-sciences",
  "humanities",
] as const;

export type ConferenceSlug = (typeof conferenceSlugs)[number];

export type ConferenceDeadlines = {
  /** Registration and abstract submission. */
  registration: string;
  /** Final paper submission. */
  finalPaper: string;
  /** Presentation submission. */
  presentation: string;
};

export type CommitteeMember = {
  name: string;
  role: LocalizedText;
  affiliation: LocalizedText;
};

export type Conference = {
  slug: ConferenceSlug;
  /** Ordinal of this edition, rendered as "Nth International Conference". */
  edition: number;
  name: LocalizedText;
  /** Compact label for nav dropdowns and select options. */
  shortName: LocalizedText;
  /** ISO date, inclusive. */
  startDate: string;
  /** ISO date, inclusive. */
  endDate: string;
  city: LocalizedText;
  country: LocalizedText;
  venue: LocalizedText;
  /** On-site registration desk opening time, 24h. */
  registrationTime: string;
  /** Opening ceremony time, 24h. */
  openingTime: string;
  topics: LocalizedText[];
  description: LocalizedText;
  deadlines: ConferenceDeadlines;
  committee: CommitteeMember[];
};

const QARSHI: LocalizedText = { uz: "Qarshi", en: "Qarshi" };
const UZBEKISTAN: LocalizedText = { uz: "Oʻzbekiston", en: "Uzbekistan" };
const VENUE: LocalizedText = {
  uz: "Iqtisodiyot va Pedagogika universiteti",
  en: "University of Economics and Pedagogy",
};

const STANDARD_DEADLINES: ConferenceDeadlines = {
  registration: "2026-09-20",
  finalPaper: "2026-09-25",
  presentation: "2026-09-30",
};

export const conferences: Conference[] = [
  {
    slug: "exact-sciences",
    edition: 12,
    name: { uz: "Aniq fanlar", en: "Exact Sciences" },
    shortName: { uz: "Aniq fanlar", en: "Exact Sciences" },
    startDate: "2026-10-08",
    endDate: "2026-10-10",
    city: QARSHI,
    country: UZBEKISTAN,
    venue: VENUE,
    registrationTime: "09:00",
    openingTime: "10:00",
    description: {
      uz: "Konferensiya matematika, fizika, informatika va boshqa aniq fanlar yoʻnalishidagi tadqiqotchilarni bir joyga toʻplaydi. Nazariy natijalar bilan bir qatorda amaliy qoʻllanmalar va fanlararo tadqiqotlar ham muhokama qilinadi.",
      en: "The conference brings together researchers in mathematics, physics, computer science and other exact sciences. Applied and interdisciplinary work is discussed alongside theoretical results.",
    },
    topics: [
      {
        uz: "Matematika va matematik modellashtirish",
        en: "Mathematics and mathematical modelling",
      },
      { uz: "Fizika va astronomiya", en: "Physics and astronomy" },
      {
        uz: "Informatika va axborot texnologiyalari",
        en: "Computer science and information technologies",
      },
      {
        uz: "Sunʼiy intellekt va maʼlumotlar tahlili",
        en: "Artificial intelligence and data analysis",
      },
      {
        uz: "Statistika va ehtimollar nazariyasi",
        en: "Statistics and probability theory",
      },
      { uz: "Mexanika", en: "Mechanics" },
      {
        uz: "Hisoblash usullari va simulyatsiya",
        en: "Computational methods and simulation",
      },
      {
        uz: "Kriptografiya va axborot xavfsizligi",
        en: "Cryptography and information security",
      },
    ],
    deadlines: STANDARD_DEADLINES,
    committee: [
      {
        name: "Prof. Dr. Rustam Karimov",
        role: { uz: "Raislik", en: "Chair" },
        affiliation: { uz: "Texnika universiteti", en: "Technical University" },
      },
      {
        name: "Prof. Dr. Zulfiya Abdullayeva",
        role: { uz: "Hamraislik", en: "Co-chair" },
        affiliation: { uz: "Fizika instituti", en: "Institute of Physics" },
      },
      {
        name: "Dr. Otabek Jalilov",
        role: { uz: "Ilmiy kotib", en: "Scientific secretary" },
        affiliation: {
          uz: "Matematika instituti",
          en: "Institute of Mathematics",
        },
      },
      {
        name: "Prof. Dr. Aziz Xolmatov",
        role: { uz: "Aʼzo", en: "Member" },
        affiliation: {
          uz: "Axborot texnologiyalari universiteti",
          en: "University of Information Technologies",
        },
      },
    ],
  },
  {
    slug: "engineering-sciences",
    edition: 11,
    name: { uz: "Muhandislik fanlari", en: "Engineering Sciences" },
    shortName: { uz: "Muhandislik fanlari", en: "Engineering Sciences" },
    startDate: "2026-10-08",
    endDate: "2026-10-10",
    city: QARSHI,
    country: UZBEKISTAN,
    venue: VENUE,
    registrationTime: "09:00",
    openingTime: "10:00",
    description: {
      uz: "Konferensiya materialshunoslik, ishlab chiqarish texnologiyalari va muhandislik usullari sohasidagi yangi natijalarni taqdim etadi. Nazariy tadqiqotlar bilan bir qatorda sanoatdagi amaliy ishlanmalar ham koʻrib chiqiladi.",
      en: "The conference presents new results in materials science, manufacturing technology and engineering methods. Theoretical studies are discussed alongside applied and industrial work.",
    },
    topics: [
      {
        uz: "Yangi materiallar va kompozitlar",
        en: "Advanced materials and composites",
      },
      { uz: "Nanotexnologiyalar", en: "Nanotechnology" },
      { uz: "Metallurgiya va qotishmalar", en: "Metallurgy and alloys" },
      { uz: "Mashinasozlik va mexatronika", en: "Mechanical engineering and mechatronics" },
      {
        uz: "Ishlab chiqarish va avtomatlashtirish",
        en: "Manufacturing and automation",
      },
      {
        uz: "Energetika va energiya samaradorligi",
        en: "Power engineering and energy efficiency",
      },
      { uz: "Qurilish va arxitektura", en: "Civil engineering and architecture" },
      { uz: "Additiv texnologiyalar", en: "Additive manufacturing" },
      {
        uz: "Oʻlchash usullari va sinov",
        en: "Measurement methods and testing",
      },
    ],
    deadlines: STANDARD_DEADLINES,
    committee: [
      {
        name: "Prof. Dr. Sherzod Nazarov",
        role: { uz: "Raislik", en: "Chair" },
        affiliation: { uz: "Texnika universiteti", en: "Technical University" },
      },
      {
        name: "Prof. Dr. Feruza Mirzayeva",
        role: { uz: "Hamraislik", en: "Co-chair" },
        affiliation: { uz: "Kimyo instituti", en: "Institute of Chemistry" },
      },
      {
        name: "Dr. Dilnoza Qodirova",
        role: { uz: "Ilmiy kotib", en: "Scientific secretary" },
        affiliation: { uz: "Texnika universiteti", en: "Technical University" },
      },
      {
        name: "Prof. Dr. Timur Sattorov",
        role: { uz: "Aʼzo", en: "Member" },
        affiliation: {
          uz: "Energetika instituti",
          en: "Institute of Energy",
        },
      },
    ],
  },
  {
    slug: "natural-sciences",
    edition: 15,
    name: { uz: "Tabiiy fanlar", en: "Natural Sciences" },
    shortName: { uz: "Tabiiy fanlar", en: "Natural Sciences" },
    startDate: "2026-10-08",
    endDate: "2026-10-10",
    city: QARSHI,
    country: UZBEKISTAN,
    venue: VENUE,
    registrationTime: "09:00",
    openingTime: "10:00",
    description: {
      uz: "Konferensiya biologiya, kimyo, geologiya va ekologiya yoʻnalishidagi tadqiqot natijalarini muhokama qiladi. Alohida eʼtibor mintaqaviy ekologik muammolar va ularni hal qilish yoʻllariga qaratiladi.",
      en: "The conference examines research in biology, chemistry, geology and ecology. Particular attention is given to regional environmental problems and practical approaches to addressing them.",
    },
    topics: [
      { uz: "Biologiya va biotexnologiya", en: "Biology and biotechnology" },
      { uz: "Kimyo va kimyoviy texnologiyalar", en: "Chemistry and chemical technologies" },
      { uz: "Geologiya va geografiya", en: "Geology and geography" },
      { uz: "Atrof-muhit monitoringi", en: "Environmental monitoring" },
      {
        uz: "Biologik xilma-xillikni saqlash",
        en: "Biodiversity conservation",
      },
      {
        uz: "Iqlim oʻzgarishi va uning oqibatlari",
        en: "Climate change and its consequences",
      },
      { uz: "Suv resurslarini boshqarish", en: "Water resource management" },
      {
        uz: "Qishloq xoʻjaligi va oziq-ovqat xavfsizligi",
        en: "Agriculture and food safety",
      },
      {
        uz: "Qayta tiklanuvchi energiya manbalari",
        en: "Renewable energy sources",
      },
    ],
    deadlines: STANDARD_DEADLINES,
    committee: [
      {
        name: "Prof. Dr. Kamola Ergasheva",
        role: { uz: "Raislik", en: "Chair" },
        affiliation: { uz: "Ekologiya instituti", en: "Institute of Ecology" },
      },
      {
        name: "Prof. Dr. Bekzod Rasulov",
        role: { uz: "Hamraislik", en: "Co-chair" },
        affiliation: {
          uz: "Biologiya instituti",
          en: "Institute of Biology",
        },
      },
      {
        name: "Dr. Malika Yusupova",
        role: { uz: "Ilmiy kotib", en: "Scientific secretary" },
        affiliation: { uz: "Ekologiya instituti", en: "Institute of Ecology" },
      },
      {
        name: "Prof. Dr. Anvar Toshmatov",
        role: { uz: "Aʼzo", en: "Member" },
        affiliation: { uz: "Geologiya instituti", en: "Institute of Geology" },
      },
    ],
  },
  {
    slug: "humanities",
    edition: 8,
    name: { uz: "Gumanitar fanlar", en: "Humanities" },
    shortName: { uz: "Gumanitar fanlar", en: "Humanities" },
    startDate: "2026-10-08",
    endDate: "2026-10-10",
    city: QARSHI,
    country: UZBEKISTAN,
    venue: VENUE,
    registrationTime: "09:00",
    openingTime: "10:00",
    description: {
      uz: "Konferensiya tilshunoslik, tarix, falsafa va ijtimoiy fanlar chorrahasidagi tadqiqotlarni birlashtiradi. Til siyosati, madaniy meros, taʼlim va jamiyatdagi kommunikatsiya masalalari koʻrib chiqiladi.",
      en: "The conference joins research across linguistics, history, philosophy and the social sciences. Language policy, cultural heritage, education and communication in society are among the themes.",
    },
    topics: [
      {
        uz: "Nazariy va amaliy tilshunoslik",
        en: "Theoretical and applied linguistics",
      },
      {
        uz: "Adabiyotshunoslik va matn tahlili",
        en: "Literary studies and textual analysis",
      },
      { uz: "Tarix va arxeologiya", en: "History and archaeology" },
      { uz: "Falsafa va etika", en: "Philosophy and ethics" },
      {
        uz: "Pedagogika va oʻqitish usullari",
        en: "Pedagogy and teaching methods",
      },
      {
        uz: "Sotsiologiya va ijtimoiy tadqiqotlar",
        en: "Sociology and social research",
      },
      {
        uz: "Psixologiya va shaxs rivoji",
        en: "Psychology and personal development",
      },
      {
        uz: "Madaniy meros va oʻziga xoslik",
        en: "Cultural heritage and identity",
      },
      {
        uz: "Ommaviy kommunikatsiya va media",
        en: "Mass communication and media",
      },
    ],
    deadlines: STANDARD_DEADLINES,
    committee: [
      {
        name: "Prof. Dr. Shahnoza Rahimova",
        role: { uz: "Raislik", en: "Chair" },
        affiliation: {
          uz: "Jahon tillari universiteti",
          en: "University of World Languages",
        },
      },
      {
        name: "Prof. Dr. Farrux Qosimov",
        role: { uz: "Hamraislik", en: "Co-chair" },
        affiliation: {
          uz: "Til va adabiyot instituti",
          en: "Institute of Language and Literature",
        },
      },
      {
        name: "Dr. Zarina Muhammadiyeva",
        role: { uz: "Ilmiy kotib", en: "Scientific secretary" },
        affiliation: {
          uz: "Jahon tillari universiteti",
          en: "University of World Languages",
        },
      },
      {
        name: "Prof. Dr. Doniyor Ochilov",
        role: { uz: "Aʼzo", en: "Member" },
        affiliation: { uz: "Sotsiologiya markazi", en: "Centre for Sociology" },
      },
    ],
  },
];

const bySlug = new Map<ConferenceSlug, Conference>(
  conferences.map((conference) => [conference.slug, conference]),
);

export function getConference(slug: string): Conference | undefined {
  return bySlug.get(slug as ConferenceSlug);
}

export function isConferenceSlug(value: string): value is ConferenceSlug {
  return bySlug.has(value as ConferenceSlug);
}
