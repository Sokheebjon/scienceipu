import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

/**
 * The reference hero: a wide image in an 8px white frame directly under the
 * logo. The frame wraps a fixed-ratio box and the image is priority loaded,
 * so nothing below it moves once the photo decodes.
 */
export async function Hero() {
  const t = await getTranslations();

  return (
    <Container>
      <figure className="mb-5">
        <div className="relative aspect-[21/9] w-full overflow-hidden border-8 border-white">
          <Image
            src="/img/conferences/ipu-main.png"
            alt={t("home.heroAlt")}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </figure>
    </Container>
  );
}
