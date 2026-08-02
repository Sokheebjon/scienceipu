import { NextResponse } from "next/server";
import {
  getServerTranslate,
  isHoneypotFilled,
  resolveLocale,
  type ApiResponse,
} from "@/lib/api";
import { clientKey, rateLimit } from "@/lib/rateLimit";
import { buildNewsletterRow } from "@/lib/rows";
import { createNewsletterSchema } from "@/lib/schemas";
import { appendRow } from "@/lib/sheets";

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
    console.warn("[newsletter] Honeypot filled; submission discarded.");
    return NextResponse.json({ ok: true });
  }

  const limited = rateLimit(clientKey(request, "newsletter"), LIMIT, WINDOW_MS);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: t("newsletter.errorGeneric") },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  const parsed = createNewsletterSchema(t).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: t("newsletter.errorInvalid") },
      { status: 400 },
    );
  }

  const result = await appendRow("newsletter", buildNewsletterRow(parsed.data));
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: t("newsletter.errorGeneric") },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
