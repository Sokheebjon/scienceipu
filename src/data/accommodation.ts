import type { LocalizedText } from "./conferences";

/**
 * Accommodation options listed on the venue page.
 *
 * TODO: placeholder properties. Replace with real hotels, distances and
 * booking arrangements before launch. The organisers do not take bookings.
 */

export type Accommodation = {
  id: string;
  name: LocalizedText;
  category: string;
  /** Walking distance to the venue, in metres. */
  distanceMetres: number;
};

export const accommodation: Accommodation[] = [
  {
    id: "central",
    name: { uz: "Markaziy mehmonxona", en: "Central Hotel" },
    category: "4★",
    distanceMetres: 150,
  },
  {
    id: "registan",
    name: { uz: "Registon mehmonxonasi", en: "Registan Hotel" },
    category: "4★",
    distanceMetres: 400,
  },
  {
    id: "university",
    name: { uz: "Universitet mehmonxonasi", en: "University Guesthouse" },
    category: "3★",
    distanceMetres: 600,
  },
  {
    id: "silk-road",
    name: { uz: "Ipak yoʻli mehmonxonasi", en: "Silk Road Hotel" },
    category: "4★",
    distanceMetres: 900,
  },
  {
    id: "old-town",
    name: { uz: "Eski shahar mehmonxonasi", en: "Old Town Hotel" },
    category: "3★",
    distanceMetres: 1200,
  },
  {
    id: "park",
    name: { uz: "Park mehmonxonasi", en: "Park Hotel" },
    category: "5★",
    distanceMetres: 1500,
  },
];
