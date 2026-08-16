import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import { partners } from "@/data/partners";

/**
 * The reference partner block: full-colour logos flowing centred in a white
 * sheet, each linking to the partner's website in a new tab, followed by the
 * partner names in a two-column list.
 */
export function PartnersStrip({ locale }: { locale: Locale }) {
  return (
    <>
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
        {partners.map((partner) => (
          <li key={partner.id}>
            <a
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-visible:ring-primary-500 block rounded transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none"
            >
              <Image
                src={partner.logo}
                alt={partner.name[locale]}
                width={partner.width}
                height={partner.height}
                className="h-14 w-auto"
              />
            </a>
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
