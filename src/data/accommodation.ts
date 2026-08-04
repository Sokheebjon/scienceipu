import type { LocalizedText } from "./conferences";

/**
 * Accommodation options listed on the venue page.
 *
 * Hotels in Qarshi. Star categories are shown only where the property
 * publishes one; locations are approximate. The organisers do not take
 * bookings — participants book directly with the hotels.
 */

export type Accommodation = {
  id: string;
  name: LocalizedText;
  /** Star category where published, otherwise an em dash. */
  category: string;
  /** Short note on where the hotel is. */
  location: LocalizedText;
};

export const accommodation: Accommodation[] = [
  {
    id: "grand-sarbon",
    name: { uz: "Grand Sarbon mehmonxonasi", en: "Grand Sarbon Hotel" },
    category: "4★",
    location: {
      uz: "Konferensiya oʻtkaziladigan mehmonxona",
      en: "Conference venue hotel",
    },
  },
  {
    id: "reikartz",
    name: { uz: "Reikartz Qarshi", en: "Reikartz Qarshi" },
    category: "4★",
    location: {
      uz: "Xalqaro tarmoq mehmonxonasi, shahar markazi yaqinida",
      en: "International chain hotel near the city centre",
    },
  },
  {
    id: "sultan",
    name: { uz: "Sultan mehmonxonasi", en: "Hotel Sultan" },
    category: "3★",
    location: {
      uz: "Shahar markazida",
      en: "In the city centre",
    },
  },
  {
    id: "grand-star",
    name: { uz: "Grand Star mehmonxonasi", en: "Grand Star Hotel" },
    category: "—",
    location: {
      uz: "Markazdan taxminan 1,6 km",
      en: "About 1.6 km from the centre",
    },
  },
  {
    id: "afrosiyob",
    name: { uz: "Afrosiyob mehmonxonasi", en: "Hotel Afrosiyob" },
    category: "—",
    location: {
      uz: "Markazdan taxminan 3 km",
      en: "About 3 km from the centre",
    },
  },
  {
    id: "afsona",
    name: { uz: "Afsona mehmonxonasi", en: "Afsona Hotel" },
    category: "—",
    location: {
      uz: "Aeroportga yaqin qismda",
      en: "Closer to the airport",
    },
  },
  {
    id: "naxshab",
    name: { uz: "Naxshab mehmonxonasi", en: "Hotel Naxshab" },
    category: "—",
    location: {
      uz: "Shahar ichida, milliy restorani bor",
      en: "In the city, with a traditional restaurant",
    },
  },
];
