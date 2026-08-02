"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Field, FormStatus, Select, TextInput } from "@/components/form/fields";

export type ConferenceOption = { value: string; label: string };

type Props = {
  conferences: ConferenceOption[];
  /** Address the file should be emailed to until uploads are wired up. */
  submissionsEmail: string;
};

/**
 * TODO (v1 stub): the file input is not wired to any storage yet. Submitting
 * shows instructions to email the file, with the subject line pre-filled from
 * what the visitor entered. Replace with a real upload endpoint (signed URL to
 * object storage, 5 MB cap, .doc/.docx/.ppt/.pptx/.pdf only) before launch.
 */
export function UploadForm({ conferences, submissionsEmail }: Props) {
  const t = useTranslations();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [conference, setConference] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedLabel =
    conferences.find((option) => option.value === conference)?.label ?? "";

  const mailto = `mailto:${submissionsEmail}?subject=${encodeURIComponent(
    [selectedLabel, name].filter(Boolean).join(" — "),
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
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="upload-name"
          label={t("upload.nameLabel")}
          required
          requiredLabel={t("common.required")}
        >
          <TextInput
            id="upload-name"
            required
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Field>

        <Field
          id="upload-email"
          label={t("upload.emailLabel")}
          required
          requiredLabel={t("common.required")}
        >
          <TextInput
            id="upload-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>

        <Field
          id="upload-conference"
          label={t("upload.conferenceLabel")}
          required
          requiredLabel={t("common.required")}
          className="sm:col-span-2"
        >
          <Select
            id="upload-conference"
            required
            value={conference}
            onChange={(event) => setConference(event.target.value)}
          >
            <option value="">{t("register.selectPlaceholder")}</option>
            {conferences.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          id="upload-file"
          label={t("upload.fileLabel")}
          className="sm:col-span-2"
          hint={t("upload.notice4")}
        >
          <input
            id="upload-file"
            type="file"
            accept=".doc,.docx,.ppt,.pptx,.pdf"
            className="file:bg-primary-50 file:text-primary-700 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 file:mr-3 file:rounded file:border-0 file:px-3 file:py-1.5 file:text-sm file:font-medium"
          />
        </Field>
      </div>

      <Button type="submit" size="lg">
        {t("upload.submit")}
      </Button>
    </form>
  );
}
