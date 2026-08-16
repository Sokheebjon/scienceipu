import type { LocalizedText } from "./conferences";

/**
 * Co-organisers shown in the partner strip on the home page.
 *
 * Logo files live in `public/img/partners/` and were taken from each
 * organisation's official website or corporate-identity page (the Kazan
 * Federal University mark is the official single-colour SVG recoloured to the
 * university's blue). Intrinsic sizes are recorded so the strip reserves the
 * right box before the image loads.
 */

export type Partner = {
  /** Stable id, also the logo filename stem. */
  id: string;
  name: LocalizedText;
  /** Official website; the logo links here in a new tab. */
  url: string;
  /** Path under `public/`. */
  logo: string;
  /** Intrinsic pixel size of the logo file (SVG: viewBox size). */
  width: number;
  height: number;
};

export const partners: Partner[] = [
  {
    id: "ministry-higher-education-uz",
    name: {
      uz: "Oʻzbekiston Respublikasi Oliy taʼlim, fan va innovatsiyalar vazirligi (Toshkent)",
      en: "Ministry of Higher Education, Science and Innovation of the Republic of Uzbekistan (Tashkent)",
    },
    url: "https://edu.uz",
    logo: "/img/partners/ministry-higher-education-uz.png",
    width: 300,
    height: 248,
  },
  {
    id: "karshi-state-university",
    name: {
      uz: "Qarshi davlat universiteti (Oʻzbekiston)",
      en: "Karshi State University (Uzbekistan)",
    },
    url: "https://qarshidu.uz",
    logo: "/img/partners/karshi-state-university.svg",
    width: 312,
    height: 188,
  },
  {
    id: "karshi-state-technical-university",
    name: {
      uz: "Qarshi davlat texnika universiteti (Oʻzbekiston)",
      en: "Karshi State Technical University (Uzbekistan)",
    },
    url: "https://kstu.uz",
    logo: "/img/partners/karshi-state-technical-university.png",
    width: 120,
    height: 120,
  },
  {
    id: "pancasakti-tegal",
    name: {
      uz: "Pancasakti Tegal universiteti (Indoneziya)",
      en: "Universitas Pancasakti Tegal (Indonesia)",
    },
    url: "https://upstegal.ac.id",
    logo: "/img/partners/pancasakti-tegal.png",
    width: 286,
    height: 300,
  },
  {
    id: "karabuk-university",
    name: {
      uz: "Karabük universiteti (Turkiya)",
      en: "Karabuk University (Turkey)",
    },
    url: "https://www.karabuk.edu.tr",
    logo: "/img/partners/karabuk-university.png",
    width: 300,
    height: 231,
  },
  {
    id: "kazan-federal-university",
    name: {
      uz: "Qozon federal universiteti (Rossiya)",
      en: "Kazan Federal University (Russia)",
    },
    url: "https://kpfu.ru",
    logo: "/img/partners/kazan-federal-university.svg",
    width: 283,
    height: 59,
  },
];
