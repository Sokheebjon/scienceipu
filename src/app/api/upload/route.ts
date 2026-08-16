import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerTranslate, resolveLocale, type ApiResponse } from "@/lib/api";
import { backendPostForm } from "@/lib/backend";
import { clientKey, rateLimit } from "@/lib/rateLimit";
import { UPLOAD_KINDS } from "@/lib/schemas";

const LIMIT = 5;
const WINDOW_MS = 60_000;

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".doc", ".docx", ".ppt", ".pptx", ".pdf"];

export async function POST(
  request: Request,
): Promise<NextResponse<ApiResponse>> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request body." },
      { status: 400 },
    );
  }

  const locale = resolveLocale(form.get("locale"));
  const t = await getServerTranslate(locale);

  const limited = rateLimit(clientKey(request, "upload"), LIMIT, WINDOW_MS);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: t("upload.errorGeneric") },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  const fields = z
    .object({
      fullName: z
        .string()
        .trim()
        .min(1, t("validation.required"))
        .max(120, t("validation.maxLength", { max: 120 })),
      registrationNumber: z
        .string()
        .trim()
        .min(1, t("validation.required"))
        .max(60, t("validation.maxLength", { max: 60 })),
      email: z.email(t("validation.email")),
      kind: z.enum(UPLOAD_KINDS, t("validation.select")),
    })
    .safeParse({
      fullName: form.get("fullName"),
      registrationNumber: form.get("registrationNumber"),
      email: form.get("email"),
      kind: form.get("kind"),
    });

  if (!fields.success) {
    const errors: Record<string, string> = {};
    for (const issue of fields.error.issues) {
      const path = issue.path.join(".");
      if (path && !errors[path]) errors[path] = issue.message;
    }
    return NextResponse.json(
      { ok: false, error: t("upload.errorGeneric"), fields: errors },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { ok: false, error: t("upload.errorFileType") },
      { status: 400 },
    );
  }
  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return NextResponse.json(
      { ok: false, error: t("upload.errorFileType") },
      { status: 400 },
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { ok: false, error: t("upload.errorFileSize") },
      { status: 400 },
    );
  }

  const forwarded = new FormData();
  forwarded.append("file", file, file.name);
  forwarded.append("fullName", fields.data.fullName);
  forwarded.append("registrationNumber", fields.data.registrationNumber);
  forwarded.append("email", fields.data.email);
  forwarded.append("kind", fields.data.kind);
  forwarded.append("locale", locale);

  const result = await backendPostForm("/conference-uploads", forwarded);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: t("upload.errorGeneric") },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
