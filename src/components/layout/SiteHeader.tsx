import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { conferences } from "@/data/conferences";
import { site } from "@/data/site";
import { ConferencesMenu } from "./ConferencesMenu";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";

export async function SiteHeader() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();

  const primaryItems = [
    { href: "/", label: t("nav.home") },
    { href: "/register", label: t("nav.registration") },
    { href: "/about", label: t("nav.about") },
    { href: "/contacts", label: t("nav.contacts") },
  ];

  const conferenceItems = conferences.map((conference) => ({
    href: `/conferences/${conference.slug}`,
    label: conference.shortName[locale],
  }));

  const quickLinks = [
    { href: "/register", label: t("quickLinks.register"), starred: true },
    { href: "/upload", label: t("quickLinks.upload"), starred: true },
    { href: "/payment", label: t("quickLinks.payment"), starred: false },
    { href: "/deadlines", label: t("quickLinks.deadlines"), starred: false },
    { href: "/venue", label: t("quickLinks.venue"), starred: false },
    { href: "/photos", label: t("quickLinks.photos"), starred: false },
  ];

  const navLinkClass =
    "block border-b-2 border-transparent px-3 py-4 text-sm font-medium text-primary-100 transition-colors hover:border-accent-500 hover:text-white";
  const navLinkActiveClass = "border-accent-500 text-white";

  return (
    <header>
      {/* Main navigation bar */}
      <div className="bg-primary-900">
        <Container width="wide">
          <div className="flex items-center justify-between">
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

            <div className="py-2 lg:hidden">
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

            <div className="py-2">
              <LocaleSwitcher label={t("common.changeLanguage")} />
            </div>
          </div>
        </Container>
      </div>

      {/* Logo band. The mark is a fixed size so the localised wordmark can
          change width without moving anything above or below it. */}
      <div className="border-line border-b bg-white">
        <Container width="wide">
          <div className="flex min-h-24 items-center justify-center py-4">
            <Link
              href="/"
              className="flex items-center gap-3 text-center sm:gap-4"
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
                <span className="text-primary-800 block text-lg leading-tight font-bold sm:text-xl">
                  {site.name[locale]}
                </span>
                <span className="mt-0.5 block text-xs tracking-wide text-neutral-500 uppercase">
                  {site.contact.address[locale]
                    .split(",")
                    .slice(-2)
                    .join(",")
                    .trim()}
                </span>
              </span>
            </Link>
          </div>
        </Container>
      </div>

      {/* Secondary quick-links bar */}
      <nav
        aria-label={t("quickLinks.label")}
        className="bg-primary-50 border-line border-b"
      >
        <Container width="wide">
          <ul className="-mx-1 flex snap-x gap-1 overflow-x-auto py-2">
            {quickLinks.map((item) => (
              <li key={item.href} className="snap-start">
                <NavLink
                  href={item.href}
                  className="text-primary-700 hover:bg-primary-100 block rounded px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors sm:text-sm"
                  activeClassName="bg-primary-800 text-white hover:bg-primary-800"
                >
                  {item.label}
                  {item.starred ? (
                    <span aria-hidden className="text-accent-700 ml-1">
                      *
                    </span>
                  ) : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </header>
  );
}
