import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";

/**
 * The reference hero: a wide image in an 8px white frame directly under the
 * logo, with a small caption link to the photo gallery underneath. The frame
 * wraps a fixed-ratio box and the image is priority loaded, so nothing below
 * it moves once the SVG decodes.
 */
export async function Hero() {
  const t = await getTranslations();

  return (
    <Container>
      <figure className="mb-5">
        <div className="relative aspect-[21/9] w-full overflow-hidden border-8 border-white">
          <Image
            src="/img/hero.svg"
            alt={t("home.heroAlt")}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
        <figcaption className="pt-2.5 text-center text-sm">
          <Link
            href="/photos"
            className="text-accent-400 hover:text-accent-300 underline underline-offset-2 transition-colors"
          >
            {t("home.heroCaption")}
          </Link>
        </figcaption>
      </figure>
    </Container>
  );
}
