import { NextResponse } from "next/server";
import {
  getServerTranslate,
  isHoneypotFilled,
  resolveLocale,
  type ApiResponse,
} from "@/lib/api";
import { backendPostJson } from "@/lib/backend";
import { clientKey, rateLimit } from "@/lib/rateLimit";
import { createRegistrationSchema } from "@/lib/schemas";

/** Five submissions per address per minute. */
const LIMIT = 5;
const WINDOW_MS = 60_000;

export async function POST(
  request: Request,
): Promise<NextResponse<ApiResponse>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request body." },
      { status: 400 },
    );
  }

  const locale = resolveLocale((body as { locale?: unknown } | null)?.locale);
  const t = await getServerTranslate(locale);

  if (isHoneypotFilled(body)) {
    console.warn("[register] Honeypot filled; submission discarded.");
    return NextResponse.json({ ok: true });
  }

  const limited = rateLimit(clientKey(request, "register"), LIMIT, WINDOW_MS);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: t("register.errorUnavailable") },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  const parsed = createRegistrationSchema(t).safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (path && !fields[path]) fields[path] = issue.message;
    }
    return NextResponse.json(
      { ok: false, error: t("register.errorBody"), fields },
      { status: 400 },
    );
  }

  // Empty strings for the optional fields become undefined so the backend's
  // validators (enum, email) do not reject the placeholder values.
  const v = parsed.data;
  const result = await backendPostJson<{ registrationNumber: string }>(
    "/conference-registrations",
    {
      title: v.title || undefined,
      firstName: v.firstName,
      lastName: v.lastName,
      affiliation: v.affiliation,
      country: v.country,
      address: v.address || undefined,
      phone: v.phone,
      email: v.email,
      secondEmail: v.secondEmail || undefined,
      conference: v.conference,
      presentationType: v.presentationType,
      articleTitle: v.articleTitle || undefined,
      articleAbstract: v.articleAbstract || undefined,
      hasSecondArticle: v.hasSecondArticle,
      articleTitle2: v.articleTitle2 || undefined,
      articleAbstract2: v.articleAbstract2 || undefined,
      consent: v.consent,
      locale: v.locale,
    },
  );

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: t("register.errorUnavailable") },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    registrationNumber: result.data.registrationNumber,
  });
}
