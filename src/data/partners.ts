import type { LocalizedText } from "./conferences";

/**
 * Partner strip on the home and about pages.
 *
 * Logos are generated locally as monogram SVGs in the site palette; nothing is
 * fetched or copied from any third party. TODO: replace with real partners and
 * their supplied logo files.
 */

export type Partner = {
  /** Stable id, also the generated logo filename. */
  id: string;
  name: LocalizedText;
  /** Two- or three-letter monogram drawn into the placeholder logo. */
  monogram: string;
};

export const partners: Partner[] = [
  {
    id: "agrarian-university",
    name: { uz: "Agrar universitet", en: "Agrarian University" },
    monogram: "AU",
  },
  {
    id: "technical-university",
    name: { uz: "Texnika universiteti", en: "Technical University" },
    monogram: "TU",
  },
  {
    id: "university-of-economics",
    name: { uz: "Iqtisodiyot universiteti", en: "University of Economics" },
    monogram: "UE",
  },
  {
    id: "pedagogical-university",
    name: { uz: "Pedagogika universiteti", en: "Pedagogical University" },
    monogram: "PU",
  },
  {
    id: "world-languages",
    name: {
      uz: "Jahon tillari universiteti",
      en: "University of World Languages",
    },
    monogram: "WL",
  },
  {
    id: "institute-of-ecology",
    name: { uz: "Ekologiya instituti", en: "Institute of Ecology" },
    monogram: "IE",
  },
  {
    id: "institute-of-physics",
    name: { uz: "Fizika instituti", en: "Institute of Physics" },
    monogram: "IP",
  },
  {
    id: "institute-of-chemistry",
    name: { uz: "Kimyo instituti", en: "Institute of Chemistry" },
    monogram: "IC",
  },
  {
    id: "academy-of-sciences",
    name: { uz: "Fanlar akademiyasi", en: "Academy of Sciences" },
    monogram: "AS",
  },
  {
    id: "research-foundation",
    name: { uz: "Ilmiy tadqiqotlar jamgʻarmasi", en: "Research Foundation" },
    monogram: "RF",
  },
];
