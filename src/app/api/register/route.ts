import { NextResponse } from "next/server";
import {
  getServerTranslate,
  isHoneypotFilled,
  resolveLocale,
  type ApiResponse,
} from "@/lib/api";
import { clientKey, rateLimit } from "@/lib/rateLimit";
import { buildRegistrationRow } from "@/lib/rows";
import { createRegistrationSchema } from "@/lib/schemas";
import { appendRow } from "@/lib/sheets";

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

  const result = await appendRow(
    "registrations",
    buildRegistrationRow(parsed.data),
  );

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: t("register.errorUnavailable") },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
