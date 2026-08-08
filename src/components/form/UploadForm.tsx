"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FormStatus, Select, TextInput } from "@/components/form/fields";
import { UPLOAD_KINDS } from "@/lib/schemas";

type Props = {
  /** Address the file should be emailed to until uploads are wired up. */
  submissionsEmail: string;
};

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

/**
 * TODO (v1 stub): the file input is not wired to any storage yet. Submitting
 * shows instructions to email the file, with the subject line pre-filled from
 * what the visitor entered. Replace with a real upload endpoint (signed URL to
 * object storage, 5 MB cap, .doc/.docx/.ppt/.pptx/.pdf only) before launch.
 */
export function UploadForm({ submissionsEmail }: Props) {
  const t = useTranslations();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [kind, setKind] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedKindLabel = kind ? t(`upload.kinds.${kind}`) : "";

  const mailto = `mailto:${submissionsEmail}?subject=${encodeURIComponent(
    [registrationNumber, selectedKindLabel].filter(Boolean).join(" — "),
  )}`;

  if (submitted) {
    return (
      <div className="space-y-4">
        <FormStatus tone="success" title={t("upload.interimHeading")}>
          {t("upload.interimBody", { email: submissionsEmail })}
        </FormStatus>
        <div className="flex flex-wrap gap-3">
          <a
            href={mailto}
            className="bg-primary-800 hover:bg-primary-600 inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            {t("upload.interimCta")}
          </a>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setSubmitted(false)}
          >
            {t("common.previous")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-4"
    >
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
          <Button type="submit">{t("upload.submit")}</Button>
        </div>
      </div>
    </form>
  );
}
