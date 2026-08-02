import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import { partners } from "@/data/partners";

/**
 * Grayscale placeholder marks that come up to full colour on hover. Each logo
 * box has fixed dimensions so the strip reserves its height before the images
 * decode.
 */
export function PartnersStrip({ locale }: { locale: Locale }) {
  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {partners.map((partner) => (
          <li
            key={partner.id}
            className="border-line hover:border-primary-200 flex h-24 items-center justify-center rounded-xl border bg-white px-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <Image
              src={`/img/partners/${partner.id}.svg`}
              alt={partner.name[locale]}
              width={240}
              height={96}
              className="h-16 w-auto opacity-70 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0"
            />
          </li>
        ))}
      </ul>
      <ul className="mt-8 grid gap-x-10 gap-y-1.5 text-sm text-neutral-600 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner) => (
          <li key={partner.id} className="flex gap-2">
            <span aria-hidden className="text-accent-600">
              ·
            </span>
            {partner.name[locale]}
          </li>
        ))}
      </ul>
    </>
  );
}
