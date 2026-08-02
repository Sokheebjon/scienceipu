import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation primitives. Always import `Link` from here rather
 * than `next/link` so hrefs stay locale-prefixed.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
