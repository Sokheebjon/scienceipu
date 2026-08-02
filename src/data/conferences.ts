/**
 * Central conference data. Every page reads from this file; conference facts
 * are never duplicated inside components.
 *
 * TODO: all names, dates, editions, fees and committee members below are
 * placeholders. Replace with the real event data before launch.
 */

export type LocalizedText = { uz: string; en: string };

export const conferenceSlugs = [
  "agriculture-and-food",
  "ecology-and-safety",
  "materials-methods-and-technologies",
  "economy-and-business",
  "education-research-and-development",
  "language-individual-and-society",
] as const;

export type ConferenceSlug = (typeof conferenceSlugs)[number];

export type ConferenceFees = {
  /** Standard participation fee, EUR. */
  standard: number;
  /** Reduced fee for participants of the previous edition. */
  returningParticipant: number;
  /** Reduced fee for PhD students under 30. */
  phdUnder30: number;
  /** Fee applied after the payment deadline. */
  late: number;
  /** Surcharge for presenting a second article. */
  additionalPaper: number;
  /** Accompanying person, no presentation or publication. */
  accompanyingPerson: number;
  /** Attendance only, no presentation or publication. */
  attendanceOnly: number;
};

export type ConferenceDeadlines = {
  /** Registration and abstract submission. */
  registration: string;
  /** Participation fee transfer. */
  payment: string;
  /** Final paper submission (optional). */
  finalPaper: string;
  /** Presentation or poster submission. */
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
  fees: ConferenceFees;
  description: LocalizedText;
  deadlines: ConferenceDeadlines;
  committee: CommitteeMember[];
};

const SAMARKAND: LocalizedText = { uz: "Samarqand", en: "Samarkand" };
const UZBEKISTAN: LocalizedText = { uz: "Oʻzbekiston", en: "Uzbekistan" };
const VENUE: LocalizedText = {
  uz: "Konferensiya markazi, Samarqand",
  en: "Congress Centre, Samarkand",
};

/** Identical ladder across events for now; kept per-conference so it can vary. */
const STANDARD_FEES: ConferenceFees = {
  standard: 360,
  returningParticipant: 300,
  phdUnder30: 300,
  late: 480,
  additionalPaper: 210,
  accompanyingPerson: 180,
  attendanceOnly: 180,
};

const STANDARD_DEADLINES: ConferenceDeadlines = {
  registration: "2026-05-15",
  payment: "2026-06-01",
  finalPaper: "2026-06-30",
  presentation: "2026-07-15",
};

export const conferences: Conference[] = [
  {
    slug: "agriculture-and-food",
    edition: 12,
    name: {
      uz: "Qishloq xoʻjaligi va oziq-ovqat",
      en: "Agriculture and Food",
    },
    shortName: {
      uz: "Qishloq xoʻjaligi va oziq-ovqat",
      en: "Agriculture & Food",
    },
    startDate: "2026-08-10",
    endDate: "2026-08-13",
    city: SAMARKAND,
    country: UZBEKISTAN,
    venue: VENUE,
    registrationTime: "09:00",
    openingTime: "10:00",
    description: {
      uz: "Konferensiya agrar fan, oziq-ovqat texnologiyalari va qishloq xoʻjaligini barqaror rivojlantirish boʻyicha tadqiqotchilarni bir joyga toʻplaydi. Muhokama mavzulari orasida hosildorlikni oshirish, suv resurslaridan oqilona foydalanish va oziq-ovqat xavfsizligi masalalari bor.",
      en: "The conference brings together researchers working on agricultural science, food technology and the sustainable development of farming systems. Sessions cover crop productivity, efficient use of water resources and food safety.",
    },
    topics: [
      {
        uz: "Agronomiya va oʻsimlikshunoslik",
        en: "Agronomy and crop science",
      },
      {
        uz: "Tuproqshunoslik va meliyoratsiya",
        en: "Soil science and land reclamation",
      },
      {
        uz: "Chorvachilik va veterinariya",
        en: "Animal husbandry and veterinary medicine",
      },
      { uz: "Oziq-ovqat texnologiyalari", en: "Food processing technologies" },
      {
        uz: "Oziq-ovqat xavfsizligi va sifat nazorati",
        en: "Food safety and quality control",
      },
      { uz: "Suv resurslarini boshqarish", en: "Water resource management" },
      {
        uz: "Agrobiznes va qishloq iqtisodiyoti",
        en: "Agribusiness and rural economics",
      },
      {
        uz: "Raqamli qishloq xoʻjaligi",
        en: "Digital agriculture and precision farming",
      },
      {
        uz: "Iqlim oʻzgarishiga moslashuv",
        en: "Climate change adaptation in agriculture",
      },
    ],
    fees: STANDARD_FEES,
    deadlines: STANDARD_DEADLINES,
    committee: [
      {
        name: "Prof. Dr. Nodira Alimova",
        role: { uz: "Raislik", en: "Chair" },
        affiliation: { uz: "Agrar universitet", en: "Agrarian University" },
      },
      {
        name: "Prof. Dr. Bekzod Rasulov",
        role: { uz: "Hamraislik", en: "Co-chair" },
        affiliation: {
          uz: "Oziq-ovqat instituti",
          en: "Institute of Food Science",
        },
      },
      {
        name: "Dr. Malika Yusupova",
        role: { uz: "Ilmiy kotib", en: "Scientific secretary" },
        affiliation: { uz: "Agrar universitet", en: "Agrarian University" },
      },
      {
        name: "Prof. Dr. Timur Sattorov",
        role: { uz: "Aʼzo", en: "Member" },
        affiliation: {
          uz: "Suv xoʻjaligi instituti",
          en: "Institute of Water Management",
        },
      },
    ],
  },
  {
    slug: "ecology-and-safety",
    edition: 15,
    name: { uz: "Ekologiya va xavfsizlik", en: "Ecology and Safety" },
    shortName: { uz: "Ekologiya va xavfsizlik", en: "Ecology & Safety" },
    startDate: "2026-08-10",
    endDate: "2026-08-13",
    city: SAMARKAND,
    country: UZBEKISTAN,
    venue: VENUE,
    registrationTime: "09:00",
    openingTime: "14:00",
    description: {
      uz: "Konferensiya atrof-muhitni muhofaza qilish, ekologik monitoring va sanoat xavfsizligi boʻyicha tadqiqot natijalarini muhokama qiladi. Alohida eʼtibor mintaqaviy ekologik muammolar va ularni hal qilish yoʻllariga qaratiladi.",
      en: "The conference examines environmental protection, ecological monitoring and industrial safety. Particular attention is given to regional environmental problems and practical approaches to addressing them.",
    },
    topics: [
      { uz: "Atrof-muhit monitoringi", en: "Environmental monitoring" },
      { uz: "Havo va suv sifati", en: "Air and water quality" },
      {
        uz: "Chiqindilarni boshqarish va qayta ishlash",
        en: "Waste management and recycling",
      },
      {
        uz: "Biologik xilma-xillikni saqlash",
        en: "Biodiversity conservation",
      },
      {
        uz: "Sanoat xavfsizligi va mehnat muhofazasi",
        en: "Industrial safety and occupational health",
      },
      {
        uz: "Qayta tiklanuvchi energiya manbalari",
        en: "Renewable energy sources",
      },
      { uz: "Ekologik huquq va siyosat", en: "Environmental law and policy" },
      {
        uz: "Iqlim oʻzgarishi va uning oqibatlari",
        en: "Climate change and its consequences",
      },
      {
        uz: "Yerlarning degradatsiyasi va choʻllanish",
        en: "Land degradation and desertification",
      },
    ],
    fees: STANDARD_FEES,
    deadlines: STANDARD_DEADLINES,
    committee: [
      {
        name: "Prof. Dr. Kamola Ergasheva",
        role: { uz: "Raislik", en: "Chair" },
        affiliation: { uz: "Ekologiya instituti", en: "Institute of Ecology" },
      },
      {
        name: "Prof. Dr. Sherzod Nazarov",
        role: { uz: "Hamraislik", en: "Co-chair" },
        affiliation: { uz: "Texnika universiteti", en: "Technical University" },
      },
      {
        name: "Dr. Dilnoza Qodirova",
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
    slug: "materials-methods-and-technologies",
    edition: 11,
    name: {
      uz: "Materiallar, usullar va texnologiyalar",
      en: "Materials, Methods and Technologies",
    },
    shortName: {
      uz: "Materiallar va texnologiyalar",
      en: "Materials, Methods & Technologies",
    },
    startDate: "2026-08-13",
    endDate: "2026-08-16",
    city: SAMARKAND,
    country: UZBEKISTAN,
    venue: VENUE,
    registrationTime: "09:00",
    openingTime: "10:00",
    description: {
      uz: "Konferensiya materialshunoslik, ishlab chiqarish texnologiyalari va muhandislik usullari sohasidagi yangi natijalarni taqdim etadi. Nazariy tadqiqotlar bilan bir qatorda amaliy qoʻllanmalar ham koʻrib chiqiladi.",
      en: "The conference presents new results in materials science, manufacturing technology and engineering methods. Theoretical studies are discussed alongside applied and industrial work.",
    },
    topics: [
      {
        uz: "Yangi materiallar va kompozitlar",
        en: "Advanced materials and composites",
      },
      { uz: "Nanotexnologiyalar", en: "Nanotechnology" },
      { uz: "Metallurgiya va qotishmalar", en: "Metallurgy and alloys" },
      { uz: "Polimerlar va keramika", en: "Polymers and ceramics" },
      {
        uz: "Ishlab chiqarish va avtomatlashtirish",
        en: "Manufacturing and automation",
      },
      {
        uz: "Oʻlchash usullari va sinov",
        en: "Measurement methods and testing",
      },
      { uz: "Additiv texnologiyalar", en: "Additive manufacturing" },
      {
        uz: "Energiya samaradorligi texnologiyalari",
        en: "Energy-efficient technologies",
      },
      { uz: "Modellashtirish va simulyatsiya", en: "Modelling and simulation" },
    ],
    fees: STANDARD_FEES,
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
        affiliation: { uz: "Texnika universiteti", en: "Technical University" },
      },
      {
        name: "Prof. Dr. Feruza Mirzayeva",
        role: { uz: "Aʼzo", en: "Member" },
        affiliation: { uz: "Kimyo instituti", en: "Institute of Chemistry" },
      },
    ],
  },
  {
    slug: "economy-and-business",
    edition: 9,
    name: { uz: "Iqtisodiyot va biznes", en: "Economy and Business" },
    shortName: { uz: "Iqtisodiyot va biznes", en: "Economy & Business" },
    startDate: "2026-08-16",
    endDate: "2026-08-19",
    city: SAMARKAND,
    country: UZBEKISTAN,
    venue: VENUE,
    registrationTime: "09:00",
    openingTime: "10:00",
    description: {
      uz: "Konferensiya iqtisodiy siyosat, korporativ boshqaruv va raqamli iqtisodiyot masalalarini qamrab oladi. Ishtirokchilar mintaqaviy bozorlar va investitsiya muhiti boʻyicha tadqiqotlarini taqdim etadilar.",
      en: "The conference covers economic policy, corporate governance and the digital economy. Participants present research on regional markets and the investment environment.",
    },
    topics: [
      {
        uz: "Makroiqtisodiyot va iqtisodiy siyosat",
        en: "Macroeconomics and economic policy",
      },
      { uz: "Moliya va bank ishi", en: "Finance and banking" },
      {
        uz: "Xalqaro savdo va investitsiyalar",
        en: "International trade and investment",
      },
      {
        uz: "Menejment va korporativ boshqaruv",
        en: "Management and corporate governance",
      },
      {
        uz: "Marketing va isteʼmolchi xulqi",
        en: "Marketing and consumer behaviour",
      },
      {
        uz: "Raqamli iqtisodiyot va elektron tijorat",
        en: "Digital economy and e-commerce",
      },
      {
        uz: "Tadbirkorlik va innovatsiyalar",
        en: "Entrepreneurship and innovation",
      },
      {
        uz: "Mehnat bozori va inson kapitali",
        en: "Labour markets and human capital",
      },
      {
        uz: "Barqaror rivojlanish iqtisodiyoti",
        en: "Economics of sustainable development",
      },
    ],
    fees: STANDARD_FEES,
    deadlines: STANDARD_DEADLINES,
    committee: [
      {
        name: "Prof. Dr. Gulnora Saidova",
        role: { uz: "Raislik", en: "Chair" },
        affiliation: {
          uz: "Iqtisodiyot universiteti",
          en: "University of Economics",
        },
      },
      {
        name: "Prof. Dr. Jasur Umarov",
        role: { uz: "Hamraislik", en: "Co-chair" },
        affiliation: {
          uz: "Bank-moliya akademiyasi",
          en: "Academy of Banking and Finance",
        },
      },
      {
        name: "Dr. Nilufar Ismoilova",
        role: { uz: "Ilmiy kotib", en: "Scientific secretary" },
        affiliation: {
          uz: "Iqtisodiyot universiteti",
          en: "University of Economics",
        },
      },
      {
        name: "Prof. Dr. Sanjar Yoʻldoshev",
        role: { uz: "Aʼzo", en: "Member" },
        affiliation: {
          uz: "Prognozlashtirish instituti",
          en: "Institute of Forecasting",
        },
      },
    ],
  },
  {
    slug: "education-research-and-development",
    edition: 14,
    name: {
      uz: "Taʼlim, tadqiqot va rivojlanish",
      en: "Education, Research and Development",
    },
    shortName: {
      uz: "Taʼlim va tadqiqot",
      en: "Education, Research & Development",
    },
    startDate: "2026-08-19",
    endDate: "2026-08-22",
    city: SAMARKAND,
    country: UZBEKISTAN,
    venue: VENUE,
    registrationTime: "09:00",
    openingTime: "10:00",
    description: {
      uz: "Konferensiya oliy taʼlim, pedagogika va ilmiy tadqiqotlarni tashkil etish masalalariga bagʻishlangan. Raqamli taʼlim va sunʼiy intellektning oʻquv jarayonidagi oʻrni alohida muhokama qilinadi.",
      en: "The conference addresses higher education, pedagogy and the organisation of scientific research. Digital learning and the role of artificial intelligence in teaching receive a dedicated session.",
    },
    topics: [
      {
        uz: "Oliy taʼlim va uning islohotlari",
        en: "Higher education and reform",
      },
      {
        uz: "Pedagogika va oʻqitish usullari",
        en: "Pedagogy and teaching methods",
      },
      {
        uz: "Raqamli taʼlim va masofaviy oʻqitish",
        en: "Digital and distance learning",
      },
      {
        uz: "Sunʼiy intellekt taʼlimda",
        en: "Artificial intelligence in education",
      },
      { uz: "Taʼlim sifatini baholash", en: "Quality assurance in education" },
      {
        uz: "Ilmiy tadqiqotlarni tashkil etish",
        en: "Organisation of scientific research",
      },
      {
        uz: "Xalqarolashuv va akademik harakatchanlik",
        en: "Internationalisation and academic mobility",
      },
      { uz: "Inklyuziv taʼlim", en: "Inclusive education" },
      { uz: "Yoshlar va kasbiy yoʻnalish", en: "Youth and career guidance" },
    ],
    fees: STANDARD_FEES,
    deadlines: STANDARD_DEADLINES,
    committee: [
      {
        name: "Prof. Dr. Dilorom Hamroyeva",
        role: { uz: "Raislik", en: "Chair" },
        affiliation: {
          uz: "Pedagogika universiteti",
          en: "Pedagogical University",
        },
      },
      {
        name: "Prof. Dr. Ulugʻbek Tursunov",
        role: { uz: "Hamraislik", en: "Co-chair" },
        affiliation: {
          uz: "Taʼlim tadqiqotlari markazi",
          en: "Centre for Education Research",
        },
      },
      {
        name: "Dr. Sevara Boymurodova",
        role: { uz: "Ilmiy kotib", en: "Scientific secretary" },
        affiliation: {
          uz: "Pedagogika universiteti",
          en: "Pedagogical University",
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
    slug: "language-individual-and-society",
    edition: 8,
    name: {
      uz: "Til, shaxs va jamiyat",
      en: "Language, Individual and Society",
    },
    shortName: {
      uz: "Til, shaxs va jamiyat",
      en: "Language, Individual & Society",
    },
    startDate: "2026-08-19",
    endDate: "2026-08-22",
    city: SAMARKAND,
    country: UZBEKISTAN,
    venue: VENUE,
    registrationTime: "09:00",
    openingTime: "14:00",
    description: {
      uz: "Konferensiya tilshunoslik, madaniyatshunoslik va ijtimoiy fanlar chorrahasidagi tadqiqotlarni birlashtiradi. Til siyosati, tarjimashunoslik va jamiyatdagi kommunikatsiya masalalari koʻrib chiqiladi.",
      en: "The conference joins research at the intersection of linguistics, cultural studies and the social sciences. Language policy, translation studies and communication in society are among the themes.",
    },
    topics: [
      {
        uz: "Nazariy va amaliy tilshunoslik",
        en: "Theoretical and applied linguistics",
      },
      {
        uz: "Til siyosati va koʻptillilik",
        en: "Language policy and multilingualism",
      },
      { uz: "Tarjimashunoslik", en: "Translation studies" },
      {
        uz: "Adabiyotshunoslik va matn tahlili",
        en: "Literary studies and textual analysis",
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
      { uz: "Raqamli muhitda til", en: "Language in digital environments" },
    ],
    fees: STANDARD_FEES,
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
