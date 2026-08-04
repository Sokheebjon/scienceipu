import type { LocalizedText } from "./conferences";

/**
 * Three-day conference program shared by all four conferences
 * (8–10 October 2026, Karshi, Uzbekistan).
 *
 * Source: the organisers' program published at cistuep.org.
 */

export type ProgramItem = {
  /** Time slot, local time. */
  time: string;
  activity: LocalizedText;
};

export type ProgramDay = {
  id: string;
  /** ISO date, formatted per locale on the page. */
  date: string;
  items: ProgramItem[];
};

export const programDays: ProgramDay[] = [
  {
    id: "day-1",
    date: "2026-10-08",
    items: [
      {
        time: "09:00 – 10:00",
        activity: {
          uz: "Ishtirokchilarni roʻyxatga olish",
          en: "Registration of participants",
        },
      },
      {
        time: "10:00 – 11:00",
        activity: {
          uz: "Ochilish marosimi",
          en: "Opening ceremony",
        },
      },
      {
        time: "11:00 – 13:00",
        activity: {
          uz: "Yalpi majlis",
          en: "Plenary session",
        },
      },
      {
        time: "13:00 – 14:00",
        activity: {
          uz: "Tushlik",
          en: "Lunch",
        },
      },
      {
        time: "14:00 – 17:00",
        activity: {
          uz: "Shoʻba yigʻilishlari",
          en: "Section meetings",
        },
      },
      {
        time: "19:00 – 21:00",
        activity: {
          uz: "Kechki ovqat",
          en: "Dinner",
        },
      },
    ],
  },
  {
    id: "day-2",
    date: "2026-10-09",
    items: [
      {
        time: "09:00 – 12:30",
        activity: {
          uz: "Shoʻba yigʻilishlari",
          en: "Section meetings",
        },
      },
      {
        time: "12:30 – 13:30",
        activity: {
          uz: "Tushlik",
          en: "Lunch",
        },
      },
      {
        time: "13:30 – 16:30",
        activity: {
          uz: "Shoʻba yigʻilishlari",
          en: "Section meetings",
        },
      },
      {
        time: "16:30 – 17:30",
        activity: {
          uz: "Davra suhbatlari va mahorat darslari",
          en: "Roundtable discussions and master classes",
        },
      },
      {
        time: "19:00 – 21:00",
        activity: {
          uz: "Kechki ovqat",
          en: "Dinner",
        },
      },
    ],
  },
  {
    id: "day-3",
    date: "2026-10-10",
    items: [
      {
        time: "08:00 – 09:00",
        activity: {
          uz: "Nonushta va mehmonxonadan chiqish",
          en: "Breakfast and hotel check-out",
        },
      },
      {
        time: "09:00 – 12:00",
        activity: {
          uz: "Samarqandga safar (transfer)",
          en: "Trip to Samarkand (transfer)",
        },
      },
      {
        time: "12:00 – 13:00",
        activity: {
          uz: "Tushlik (milliy taomlar)",
          en: "Lunch (national cuisine)",
        },
      },
      {
        time: "13:00 – 16:00",
        activity: {
          uz: "Samarqand boʻylab madaniy-maʼrifiy sayohat",
          en: "Cultural and educational tour of Samarkand",
        },
      },
      {
        time: "18:00 – 19:00",
        activity: {
          uz: "Yakuniy uchrashuv va fikr almashish",
          en: "Final meeting and exchange of views",
        },
      },
      {
        time: "19:00",
        activity: {
          uz: "Konferensiya va madaniy dasturning yakunlanishi",
          en: "Conclusion of the conference and cultural program",
        },
      },
    ],
  },
];
