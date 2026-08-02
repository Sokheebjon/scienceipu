import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import { partners } from "@/data/partners";

/**
 * The reference partner block: grayscale logos flowing centred in a white
 * sheet, followed by the partner names in a two-column list.
 */
export function PartnersStrip({ locale }: { locale: Locale }) {
  return (
    <>
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
        {partners.map((partner) => (
          <li key={partner.id}>
            <Image
              src={`/img/partners/${partner.id}.svg`}
              alt={partner.name[locale]}
              width={240}
              height={96}
              className="h-14 w-auto opacity-75 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0"
            />
          </li>
        ))}
      </ul>
      <ul className="mt-7 columns-1 gap-10 text-sm text-neutral-600 sm:columns-2">
        {partners.map((partner) => (
          <li key={partner.id} className="mb-1.5 break-inside-avoid">
            <span aria-hidden className="text-accent-600 mr-2">
              ·
            </span>
            {partner.name[locale]}
          </li>
        ))}
      </ul>
    </>
  );
}
