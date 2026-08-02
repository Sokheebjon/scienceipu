import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { conferences } from "@/data/conferences";
import { site } from "@/data/site";

export async function SiteFooter() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const year = new Date().getFullYear();

  const navigation = [
    { href: "/", label: t("nav.home") },
    { href: "/register", label: t("quickLinks.register") },
    { href: "/upload", label: t("quickLinks.upload") },
    { href: "/payment", label: t("quickLinks.payment") },
    { href: "/deadlines", label: t("quickLinks.deadlines") },
    { href: "/venue", label: t("quickLinks.venue") },
    { href: "/photos", label: t("quickLinks.photos") },
    { href: "/about", label: t("nav.about") },
    { href: "/contacts", label: t("nav.contacts") },
  ];

  const linkClass =
    "text-sm text-primary-200 transition-colors hover:text-white hover:underline underline-offset-2";

  return (
    <footer className="border-accent-500 bg-primary-900 mt-auto border-t-2">
      <Container width="wide">
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/img/mark.svg"
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 shrink-0 rounded-lg ring-1 ring-white/10"
              />
              <p className="text-base leading-tight font-bold text-white">
                {site.name[locale]}
              </p>
            </div>
            <p className="text-primary-200 mt-4 text-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h2 className="text-accent-400 text-sm font-semibold tracking-wide uppercase">
              {t("footer.navigate")}
            </h2>
            <ul className="mt-4 space-y-2">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-accent-400 text-sm font-semibold tracking-wide uppercase">
              {t("footer.events")}
            </h2>
            <ul className="mt-4 space-y-2">
              {conferences.map((conference) => (
                <li key={conference.slug}>
                  <Link
                    href={`/conferences/${conference.slug}`}
                    className={linkClass}
                  >
                    {conference.shortName[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-accent-400 text-sm font-semibold tracking-wide uppercase">
              {t("footer.contact")}
            </h2>
            <address className="text-primary-200 mt-4 space-y-2 text-sm not-italic">
              <p>{site.contact.address[locale]}</p>
              <p>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="hover:text-white hover:underline"
                >
                  {site.contact.email}
                </a>
              </p>
              {site.contact.phones.map((phone) => (
                <p key={phone.number}>
                  <a
                    href={`tel:${phone.number.replace(/\s/g, "")}`}
                    className="hover:text-white hover:underline"
                  >
                    {phone.number}
                  </a>{" "}
                  <span className="text-primary-300">
                    ({phone.language[locale]})
                  </span>
                </p>
              ))}
            </address>
          </div>
        </div>

        <div className="border-primary-700 flex flex-col gap-3 border-t py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-primary-300 text-sm">
            {t("footer.copyright", { year, name: site.name[locale] })}
          </p>
          <p className="flex items-center gap-3 text-sm">
            <Link href="/terms" className={linkClass}>
              {t("footer.terms")}
            </Link>
            <span aria-hidden className="text-primary-600">
              ·
            </span>
            <Link href="/privacy" className={linkClass}>
              {t("footer.privacy")}
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
