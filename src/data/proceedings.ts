import type { ConferenceSlug } from "./conferences";

/**
 * Published proceedings, one volume per conference section. The PDFs live in
 * /public/proceedings. A section without a volume here is simply not listed on
 * the page, so adding one is a matter of dropping the file in and adding an
 * entry below.
 */

export type ProceedingsFile = {
  /** File name inside /public/proceedings; also the name of the download. */
  file: string;
  pages: number;
  /** Size in bytes. */
  size: number;
};

export type ProceedingsVolume = {
  conference: ConferenceSlug;
  /** Section number as printed on the volume's cover. */
  number: string;
  /** A single file, or several when the volume is split into parts. */
  files: ProceedingsFile[];
};

export const PROCEEDINGS_DIR = "/proceedings";

export const proceedings: ProceedingsVolume[] = [
  {
    conference: "exact-sciences",
    number: "I",
    files: [
      {
        file: "anjuman-2026-1-shoba-aniq-fanlar.pdf",
        pages: 665,
        size: 12_666_947,
      },
    ],
  },
  {
    conference: "natural-sciences",
    number: "III",
    files: [
      {
        file: "anjuman-2026-3-shoba-tabiiy-fanlar.pdf",
        pages: 633,
        size: 10_417_220,
      },
    ],
  },
  {
    conference: "humanities",
    number: "IV",
    files: [
      {
        file: "anjuman-2026-4-shoba-gumanitar-fanlar-1-qism.pdf",
        pages: 767,
        size: 8_443_713,
      },
      {
        file: "anjuman-2026-4-shoba-gumanitar-fanlar-2-qism.pdf",
        pages: 926,
        size: 10_446_572,
      },
      {
        file: "anjuman-2026-4-shoba-gumanitar-fanlar-3-qism.pdf",
        pages: 1002,
        size: 13_985_101,
      },
      {
        file: "anjuman-2026-4-shoba-gumanitar-fanlar-4-qism.pdf",
        pages: 739,
        size: 7_750_393,
      },
      {
        file: "anjuman-2026-4-shoba-gumanitar-fanlar-5-qism.pdf",
        pages: 905,
        size: 10_278_763,
      },
      {
        file: "anjuman-2026-4-shoba-gumanitar-fanlar-6-qism.pdf",
        pages: 847,
        size: 10_687_644,
      },
    ],
  },
];

export function getProceedingsVolume(
  conference: string,
): ProceedingsVolume | undefined {
  return proceedings.find((volume) => volume.conference === conference);
}
