import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { conferences } from "@/data/conferences";
import { site } from "@/data/site";
import { ConferencesMenu } from "./ConferencesMenu";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";

/**
 * Mirrors the reference header: a fixed full-width dark nav bar with uppercase
 * links and a dropdown, then the centred logo on the dark page background.
 * A static spacer under the fixed bar keeps the flow stable (no CLS).
 */
export async function SiteHeader() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();

  const primaryItems = [
    { href: "/", label: t("nav.home") },
    { href: "/register", label: t("nav.registration") },
    { href: "/for-authors", label: t("nav.forAuthors") },
    { href: "/about", label: t("nav.about") },
    { href: "/contacts", label: t("nav.contacts") },
  ];

  const conferenceItems = conferences.map((conference) => ({
    href: `/conferences/${conference.slug}`,
    label: conference.shortName[locale],
  }));

  const quickLinks = [
    { href: "/register", label: t("quickLinks.register") },
    { href: "/upload", label: t("quickLinks.upload") },
    { href: "/deadlines", label: t("quickLinks.deadlines") },
    { href: "/committees", label: t("quickLinks.committees") },
    { href: "/venue", label: t("quickLinks.venue") },
    { href: "/photos", label: t("quickLinks.photos") },
  ];

  const navLinkClass =
    "block h-[50px] px-5 text-xs font-semibold uppercase tracking-wider leading-[50px] text-primary-200 transition-colors hover:bg-primary-950 hover:text-white";
  const navLinkActiveClass = "bg-primary-950 text-white";

  return (
    <header>
      <div className="bg-primary-900 shadow-primary-950/60 fixed inset-x-0 top-0 z-40 shadow-lg">
        <div className="mx-auto flex h-[50px] w-full max-w-[75rem] items-center justify-between px-4 sm:px-5">
          <nav aria-label={t("nav.primary")} className="hidden lg:block">
            <ul className="flex items-center">
              <li>
                <NavLink
                  href="/"
                  className={navLinkClass}
                  activeClassName={navLinkActiveClass}
                >
                  {t("nav.home")}
                </NavLink>
              </li>
              <li>
                <ConferencesMenu
                  label={t("nav.conferences")}
                  menuLabel={t("nav.conferencesMenu")}
                  items={conferenceItems}
                />
              </li>
              {primaryItems.slice(1).map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    className={navLinkClass}
                    activeClassName={navLinkActiveClass}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:hidden">
            <MobileNav
              openLabel={t("common.openMenu")}
              closeLabel={t("common.closeMenu")}
              primaryLabel={t("nav.primary")}
              conferencesLabel={t("nav.conferences")}
              quickLinksLabel={t("quickLinks.label")}
              items={primaryItems}
              conferences={conferenceItems}
              quickLinks={quickLinks}
            />
          </div>

          <LocaleSwitcher label={t("common.changeLanguage")} />
        </div>
      </div>
      {/* Spacer for the fixed bar. */}
      <div aria-hidden className="h-[50px]" />

      {/* Centred logo on the dark page background, like the reference. */}
      <div className="py-8 sm:py-9">
        <Link
          href="/"
          className="mx-auto flex w-fit items-center gap-3 px-4 sm:gap-4"
        >
          <Image
            src="/img/mark.svg"
            alt=""
            width={48}
            height={48}
            priority
            className="h-11 w-11 shrink-0 sm:h-12 sm:w-12"
          />
          <span className="text-left">
            <span className="text-primary-300 block text-[11px] tracking-[0.14em] uppercase">
              {site.kicker[locale]}
            </span>
            <span className="mt-0.5 block text-xl leading-tight font-bold text-white sm:text-2xl">
              {site.title[locale]}
            </span>
            <span className="text-primary-300 mt-1 block text-[11px] tracking-[0.18em] uppercase">
              {site.locality[locale]}
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
