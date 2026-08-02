import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";

/**
 * The reference footer is a single small line inside the wrap: the © range
 * and the legal links, on the dark page background.
 */
export async function SiteFooter() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const currentYear = new Date().getFullYear();
  const years =
    currentYear > site.foundedYear
      ? `${site.foundedYear}-${currentYear}`
      : `${currentYear}`;

  const linkClass =
    "text-primary-200 underline underline-offset-2 transition-colors hover:text-white";

  return (
    <footer className="mt-auto">
      <Container>
        <p className="text-primary-300 pt-2 pb-8 text-xs leading-relaxed">
          {t("footer.copyright", { year: years, name: site.name[locale] })}
          <span aria-hidden className="mx-2">
            ·
          </span>
          <Link href="/terms" className={linkClass}>
            {t("footer.terms")}
          </Link>
          <span aria-hidden className="mx-2">
            ·
          </span>
          <Link href="/privacy" className={linkClass}>
            {t("footer.privacy")}
          </Link>
        </p>
      </Container>
    </footer>
  );
}
