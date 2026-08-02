import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { NavLink } from "./NavLink";

/**
 * The reference "fastnav": a dark boxed bar of six uppercase links laid out
 * three per row, sitting between the logo/hero and the page content.
 */
export async function QuickLinksBar() {
  const t = await getTranslations();

  const quickLinks = [
    { href: "/register", label: t("quickLinks.register"), starred: true },
    { href: "/upload", label: t("quickLinks.upload"), starred: true },
    { href: "/payment", label: t("quickLinks.payment"), starred: false },
    { href: "/deadlines", label: t("quickLinks.deadlines"), starred: false },
    { href: "/venue", label: t("quickLinks.venue"), starred: false },
    { href: "/photos", label: t("quickLinks.photos"), starred: false },
  ];

  return (
    <Container>
      <nav aria-label={t("quickLinks.label")} className="bg-primary-900 mb-5">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((item) => (
            <li key={item.href}>
              <NavLink
                href={item.href}
                className="text-primary-200 hover:bg-primary-950 block truncate px-3 text-center text-xs leading-[46px] font-semibold tracking-wider uppercase transition-colors hover:text-white"
                activeClassName="bg-primary-950 text-white"
              >
                {item.label}
                {item.starred ? (
                  <span aria-hidden className="text-accent-400 ml-1">
                    *
                  </span>
                ) : null}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
