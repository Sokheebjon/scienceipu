"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import {
  Field,
  FormStatus,
  Honeypot,
  Textarea,
  TextInput,
} from "@/components/form/fields";
import { createContactSchema, type Translate } from "@/lib/schemas";

type Values = {
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
};

export function ContactForm() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");

  const translate: Translate = (key, values) =>
    t(key as Parameters<typeof t>[0], values as Parameters<typeof t>[1]);

  const schema = createContactSchema(translate).omit({ locale: true });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      website: "",
    },
  });

  async function onSubmit(values: Values) {
    setServerError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setServerError(data.error ?? t("contacts.errorGeneric"));
        return;
      }

      reset();
      setSent(true);
    } catch {
      setServerError(t("contacts.errorGeneric"));
    }
  }

  if (sent) {
    return (
      <FormStatus tone="success" title={t("contacts.successHeading")}>
        {t("contacts.successBody")}
      </FormStatus>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError ? <FormStatus tone="error">{serverError}</FormStatus> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="contact-name"
          label={t("contacts.nameLabel")}
          required
          requiredLabel={t("common.required")}
          error={errors.name?.message}
        >
          <TextInput
            id="contact-name"
            autoComplete="name"
            hasError={Boolean(errors.name)}
            aria-invalid={errors.name ? true : undefined}
            {...register("name")}
          />
        </Field>

        <Field
          id="contact-email"
          label={t("contacts.emailLabel")}
          required
          requiredLabel={t("common.required")}
          error={errors.email?.message}
        >
          <TextInput
            id="contact-email"
            type="email"
            autoComplete="email"
            hasError={Boolean(errors.email)}
            aria-invalid={errors.email ? true : undefined}
            {...register("email")}
          />
        </Field>

        <Field
          id="contact-phone"
          label={t("contacts.phoneLabel")}
          error={errors.phone?.message}
          className="sm:col-span-2"
        >
          <TextInput
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            hasError={Boolean(errors.phone)}
            {...register("phone")}
          />
        </Field>

        <Field
          id="contact-message"
          label={t("contacts.messageLabel")}
          required
          requiredLabel={t("common.required")}
          error={errors.message?.message}
          className="sm:col-span-2"
        >
          <Textarea
            id="contact-message"
            rows={6}
            hasError={Boolean(errors.message)}
            aria-invalid={errors.message ? true : undefined}
            {...register("message")}
          />
        </Field>
      </div>

      <Honeypot {...register("website")} />

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? t("contacts.submitting") : t("contacts.submit")}
      </Button>
    </form>
  );
}
