import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import { partners } from "@/data/partners";

/**
 * Grayscale placeholder marks. Each logo box has fixed dimensions so the strip
 * reserves its height before the images decode.
 */
export function PartnersStrip({ locale }: { locale: Locale }) {
  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {partners.map((partner) => (
          <li
            key={partner.id}
            className="border-line flex h-24 items-center justify-center rounded-lg border bg-white px-4"
          >
            <Image
              src={`/img/partners/${partner.id}.svg`}
              alt={partner.name[locale]}
              width={240}
              height={96}
              className="h-16 w-auto opacity-80 grayscale transition-opacity hover:opacity-100"
            />
          </li>
        ))}
      </ul>
      <ul className="mt-6 grid gap-x-8 gap-y-1 text-sm text-neutral-600 sm:grid-cols-2">
        {partners.map((partner) => (
          <li key={partner.id}>{partner.name[locale]}</li>
        ))}
      </ul>
    </>
  );
}
