"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { Honeypot, inputClass } from "@/components/form/fields";
import { createNewsletterSchema, type Translate } from "@/lib/schemas";
import { cn } from "@/lib/cn";

export function NewsletterForm() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const translate: Translate = (key, values) =>
    t(key as Parameters<typeof t>[0], values as Parameters<typeof t>[1]);

  const schema = createNewsletterSchema(translate).pick({
    email: true,
    website: true,
  });

  // Generics are left to inference: the resolver carries both the input and
  // the transformed output shape, which differ because of the honeypot default.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", website: "" },
  });

  async function onSubmit(values: { email: string; website: string }) {
    setStatus("idle");
    setServerError("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale, sourcePath: pathname }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        setServerError(data.error ?? t("newsletter.errorGeneric"));
        setStatus("error");
        return;
      }

      reset();
      setStatus("success");
    } catch {
      setServerError(t("newsletter.errorGeneric"));
      setStatus("error");
    }
  }

  const errorText = errors.email?.message ?? serverError;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            {t("newsletter.emailLabel")}
          </label>
          <input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            placeholder={t("newsletter.emailPlaceholder")}
            aria-invalid={errorText ? true : undefined}
            aria-describedby={errorText ? "newsletter-error" : undefined}
            className={cn(inputClass(Boolean(errorText)), "sm:h-11")}
            {...register("email")}
          />
        </div>
        <Button
          type="submit"
          variant="accent"
          disabled={isSubmitting}
          className="shrink-0"
        >
          {isSubmitting ? t("newsletter.submitting") : t("newsletter.submit")}
        </Button>
      </div>

      <Honeypot {...register("website")} />

      <div aria-live="polite" className="min-h-6">
        {errorText ? (
          <p
            id="newsletter-error"
            className="feedback-error-in mt-2 text-sm text-red-300"
          >
            {errorText}
          </p>
        ) : null}
        {status === "success" ? (
          <p className="feedback-in text-accent-300 mt-2 flex items-center gap-2 text-sm">
            <svg
              viewBox="0 0 52 52"
              fill="none"
              aria-hidden="true"
              className="h-5 w-5 shrink-0"
            >
              <circle
                className="check-circle"
                cx="26"
                cy="26"
                r="24"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="check-mark"
                d="M15 27l8 8 15-16"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("newsletter.success")}
          </p>
        ) : null}
      </div>
    </form>
  );
}
