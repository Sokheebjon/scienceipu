"use client";

import { useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Select, TextInput } from "@/components/form/fields";
import { ErrorBanner, SuccessPanel } from "@/components/form/feedback";
import { UPLOAD_KINDS } from "@/lib/schemas";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Reference-style row: label in a left column, control on the right. */
const LABEL_COL = "sm:grid-cols-[11rem_1fr]";

function Row({
  id,
  label,
  children,
}: {
  id: string;
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={`grid gap-1.5 sm:items-center sm:gap-4 ${LABEL_COL}`}>
      <label
        htmlFor={id}
        className="text-sm font-medium text-neutral-800 sm:text-right"
      >
        {label}
      </label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function UploadForm() {
  const t = useTranslations();
  const locale = useLocale();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [kind, setKind] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError("");
    setAttempt((n) => n + 1);

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setServerError(t("upload.errorFileType"));
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setServerError(t("upload.errorFileSize"));
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("registrationNumber", registrationNumber);
    form.append("email", email);
    form.append("kind", kind);
    form.append("locale", locale);

    setSubmitting(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setServerError(data.error ?? t("upload.errorGeneric"));
        return;
      }

      setRegistrationNumber("");
      setEmail("");
      setKind("");
      if (fileRef.current) fileRef.current.value = "";
      setSubmitted(true);
    } catch {
      setServerError(t("upload.errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <SuccessPanel
        title={t("upload.successHeading")}
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => setSubmitted(false)}
          >
            {t("upload.successAgain")}
          </Button>
        }
      >
        {t("upload.successBody")}
      </SuccessPanel>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {serverError ? (
        <ErrorBanner
          key={`${attempt}-${serverError}`}
          title={t("upload.errorHeading")}
          scrollTo
        >
          {serverError}
        </ErrorBanner>
      ) : null}

      <Row id="upload-regnum" label={t("upload.registrationNumberLabel")}>
        <TextInput
          id="upload-regnum"
          required
          value={registrationNumber}
          onChange={(event) => setRegistrationNumber(event.target.value)}
        />
      </Row>

      <Row id="upload-email" label={t("upload.emailLabel")}>
        <TextInput
          id="upload-email"
          type="email"
          required
          autoComplete="email"
          placeholder={t("upload.emailPlaceholder")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </Row>

      <Row id="upload-kind" label={t("upload.kindLabel")}>
        <Select
          id="upload-kind"
          required
          value={kind}
          onChange={(event) => setKind(event.target.value)}
        >
          <option value="">{t("upload.selectPlaceholder")}</option>
          {UPLOAD_KINDS.map((value) => (
            <option key={value} value={value}>
              {t(`upload.kinds.${value}`)}
            </option>
          ))}
        </Select>
      </Row>

      <Row id="upload-file" label={t("upload.fileLabel")}>
        <input
          id="upload-file"
          ref={fileRef}
          type="file"
          required
          accept=".doc,.docx,.ppt,.pptx,.pdf"
          aria-describedby="upload-file-hint"
          className="file:bg-primary-50 file:text-primary-700 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 file:mr-3 file:rounded file:border-0 file:px-3 file:py-1.5 file:text-sm file:font-medium"
        />
        <p id="upload-file-hint" className="mt-1.5 text-xs text-neutral-500">
          {t("upload.notice4")}
        </p>
      </Row>

      <div className={`grid sm:gap-4 ${LABEL_COL}`}>
        <span aria-hidden className="hidden sm:block" />
        <div>
          <Button type="submit" disabled={submitting}>
            {submitting ? t("upload.submitting") : t("upload.submit")}
          </Button>
        </div>
      </div>
    </form>
  );
}
