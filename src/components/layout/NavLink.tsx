"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  /** Marks the link active for any path beneath it, e.g. /conferences/*. */
  matchNested?: boolean;
};

export function NavLink({
  href,
  children,
  className,
  activeClassName,
  matchNested = false,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = matchNested
    ? pathname === href || pathname.startsWith(`${href}/`)
    : pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(className, isActive && activeClassName)}
    >
      {children}
    </Link>
  );
}
