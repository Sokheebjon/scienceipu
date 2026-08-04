import type { LocalizedText } from "./conferences";

/**
 * Committees-page content: the organizing and program committees as published
 * on the organiser's Committees page. Names are kept in their published Latin
 * spelling in both locales; only roles and countries are translated.
 */

export type CommitteeMember = {
  name: string;
  country: LocalizedText;
};

export type CommitteeGroup = {
  role: LocalizedText;
  people: CommitteeMember[];
};

export type Committee = {
  /** Stable anchor id for the section. */
  id: string;
  name: LocalizedText;
  /** Chair, co-chairs and secretary — rendered as highlighted cards. */
  leadership: CommitteeGroup[];
  /** The full member roster, rendered as a compact multi-column list. */
  members: CommitteeGroup;
};

const UZBEKISTAN: LocalizedText = { uz: "Oʻzbekiston", en: "Uzbekistan" };
const INDONESIA: LocalizedText = { uz: "Indoneziya", en: "Indonesia" };
const TURKEY: LocalizedText = { uz: "Turkiya", en: "Turkey" };
const MALAYSIA: LocalizedText = { uz: "Malayziya", en: "Malaysia" };
const INDIA: LocalizedText = { uz: "Hindiston", en: "India" };
const BULGARIA: LocalizedText = { uz: "Bolgariya", en: "Bulgaria" };
const RUSSIA: LocalizedText = { uz: "Rossiya", en: "Russia" };

const CHAIR: LocalizedText = { uz: "Rais", en: "Chair" };
const CO_CHAIRS: LocalizedText = { uz: "Hamraislar", en: "Co-chairs" };
const SECRETARY: LocalizedText = {
  uz: "Masʼul kotib",
  en: "Executive secretary",
};
const MEMBERS: LocalizedText = { uz: "Aʼzolar", en: "Members" };

const member = (
  name: string,
  country: LocalizedText = UZBEKISTAN,
): CommitteeMember => ({ name, country });

export const committees: Committee[] = [
  {
    id: "organizing",
    name: { uz: "Tashkiliy qoʻmita", en: "Organizing committee" },
    leadership: [
      { role: CHAIR, people: [member("Otabek Bozorov")] },
      {
        role: CO_CHAIRS,
        people: [member("Inom Majidov"), member("Abdulkhamid Kholmurodov")],
      },
      { role: SECRETARY, people: [member("Jasur Farmonov")] },
    ],
    members: {
      role: MEMBERS,
      people: [
        member("Erkin Rakhmatov"),
        member("Sardor Rakhimov"),
        member("Olim Abdullaev"),
        member("Khojiakbar Egamberdiev"),
        member("Akhror Xamraev"),
        member("Zafar Batirov"),
        member("Maysara Danieva"),
        member("Aziz Dustov"),
        member("Bakhodir Eshmatov"),
        member("Fazliddin Muminov"),
        member("Rizamat Shodiyev"),
        member("Beni Habibi", INDONESIA),
        member("Imam Asmarudin", INDONESIA),
        member("Cicik Sophia", INDONESIA),
        member("Fatih Kirişik", TURKEY),
        member("Haci Mehmet Baskonus", TURKEY),
        member("Adem Kilicman", MALAYSIA),
        member("Alok Kumar Chakrawal", INDIA),
        member("Chakradhara Rao", INDIA),
        member("Renu Bhatt", INDIA),
        member("Khemchand Dewangan", INDIA),
        member("Hristo Paraskevov", BULGARIA),
        member("Todor Raychev Todorov", BULGARIA),
        member("Ilhom Bekpulatov"),
        member("Shokhjakhon Abdurakhimov"),
      ],
    },
  },
  {
    id: "program",
    name: { uz: "Dasturiy qoʻmita", en: "Program committee" },
    leadership: [
      { role: CHAIR, people: [member("Gulom Uzakov")] },
      {
        role: CO_CHAIRS,
        people: [
          member("Elzara Gafiyatova", RUSSIA),
          member("Yoga Prihatin", INDONESIA),
        ],
      },
    ],
    members: {
      role: MEMBERS,
      people: [
        member("Sadritdin Turabdjanov"),
        member("Abdulaziz Gulamov"),
        member("Shokhujaeva Zebo Safoevna"),
        member("Umida Ziyamukhamedova"),
        member("Muradulla Normuradov"),
        member("Allanazar Tashatov"),
        member("Zikirov Obidjon"),
        member("Abdullo Hayotov"),
        member("Akhror Khamraev"),
        member("Bakhodir Abdullaev"),
        member("Farxod Ochilov"),
        member("Sardor Donaev"),
        member("Giyosiddin Mavlonov"),
        member("Jasur Safarov"),
        member("Anvar Rahimov"),
        member("Sahodat Murtazova"),
        member("Sukhrob Mukhammadiev"),
        member("Xolmurod Rakhimov"),
        member("Kasim Mermerdaş", TURKEY),
        member("Jurabek Safarov"),
        member("Murodjon Samadiy"),
        member("Zayniddin Boltaev"),
        member("Said Shaumarov"),
        member("Adilbek Turgunov"),
      ],
    },
  },
];
