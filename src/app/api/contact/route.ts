import { NextResponse } from "next/server";
import {
  getServerTranslate,
  isHoneypotFilled,
  resolveLocale,
  type ApiResponse,
} from "@/lib/api";
import { backendPostJson } from "@/lib/backend";
import { clientKey, rateLimit } from "@/lib/rateLimit";
import { createContactSchema } from "@/lib/schemas";

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
    console.warn("[contact] Honeypot filled; submission discarded.");
    return NextResponse.json({ ok: true });
  }

  const limited = rateLimit(clientKey(request, "contact"), LIMIT, WINDOW_MS);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: t("contacts.errorGeneric") },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  const parsed = createContactSchema(t).safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (path && !fields[path]) fields[path] = issue.message;
    }
    return NextResponse.json(
      { ok: false, error: t("contacts.errorGeneric"), fields },
      { status: 400 },
    );
  }

  const result = await backendPostJson("/conference-contacts", {
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || undefined,
    message: parsed.data.message,
    locale: parsed.data.locale,
  });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: t("contacts.errorUnavailable") },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
