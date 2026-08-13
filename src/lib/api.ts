import { getTranslations } from "next-intl/server";
import { defaultLocale, locales, type Locale } from "@/i18n/routing";
import type { Translate } from "./schemas";

/** Narrows next-intl's typed `t` to the loose signature the schemas take. */
export async function getServerTranslate(locale: Locale): Promise<Translate> {
  const t = await getTranslations({ locale });
  return (key, values) =>
    t(key as Parameters<typeof t>[0], values as Parameters<typeof t>[1]);
}

export function resolveLocale(value: unknown): Locale {
  return typeof value === "string" &&
    (locales as readonly string[]).includes(value)
    ? (value as Locale)
    : defaultLocale;
}

export type ApiResponse =
  | { ok: true; registrationNumber?: string }
  | { ok: false; error: string; fields?: Record<string, string> };

/** A filled honeypot means a bot; answer as if it worked and store nothing. */
export function isHoneypotFilled(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const value = (body as { website?: unknown }).website;
  return typeof value === "string" && value.trim().length > 0;
}
