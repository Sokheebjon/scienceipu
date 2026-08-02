"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Button, LinkButton } from "@/components/ui/Button";
import {
  Checkbox,
  Field,
  FormSection,
  FormStatus,
  Honeypot,
  Select,
  Textarea,
  TextInput,
} from "@/components/form/fields";
import {
  createRegistrationFormSchema,
  MAX_ABSTRACT,
  PRESENTATION_TYPES,
  TITLES,
  type Translate,
} from "@/lib/schemas";
import type { ConferenceSlug } from "@/data/conferences";
import type { CountryOption } from "@/data/countries";

type Option = { value: string; label: string };

type Props = {
  /** Localised, collated on the server so Node and the browser cannot differ. */
  countries: CountryOption[];
  conferences: { value: ConferenceSlug; label: string }[];
  defaultCountry: string;
};

type ApiResult = {
  ok: boolean;
  error?: string;
  fields?: Record<string, string>;
};

export function RegistrationForm({
  countries,
  conferences,
  defaultCountry,
}: Props) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [submittedConference, setSubmittedConference] = useState<string | null>(
    null,
  );
  const [serverError, setServerError] = useState("");

  const translate: Translate = (key, values) =>
    t(key as Parameters<typeof t>[0], values as Parameters<typeof t>[1]);

  const schema = createRegistrationFormSchema(translate);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      website: "",
      title: "" as const,
      firstName: "",
      lastName: "",
      affiliation: "",
      // Casts cover the placeholder option: zod rejects "" with a localised
      // message, but the enum input type does not include it.
      country: defaultCountry as CountryOption["code"] as never,
      address: "",
      phone: "",
      email: "",
      secondEmail: "",
      conference: "" as ConferenceSlug,
      presentationType: "" as (typeof PRESENTATION_TYPES)[number],
      participatedLastYear: false,
      phdUnder30: false,
      articleTitle: "",
      articleAbstract: "",
      hasSecondArticle: false,
      articleTitle2: "",
      articleAbstract2: "",
      invoiceNeeded: false,
      company: "",
      companyAddress: "",
      responsiblePerson: "",
      vat: "",
      consent: false as true,
    },
  });

  /**
   * Seeds the conference select from `?conference=`.
   *
   * The query is read here rather than through `useSearchParams` on purpose:
   * that hook forces a Suspense boundary on a statically rendered page, and
   * swapping the fallback for this form shifted the layout by 0.28 CLS. Reading
   * it on mount lets the full form render in the static HTML instead.
   */
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("conference");
    if (slug && conferences.some((option) => option.value === slug)) {
      setValue("conference", slug as ConferenceSlug);
    }
  }, [conferences, setValue]);

  const hasSecondArticle = watch("hasSecondArticle");
  const invoiceNeeded = watch("invoiceNeeded");
  const abstract = watch("articleAbstract") ?? "";
  const abstract2 = watch("articleAbstract2") ?? "";
  const errorCount = Object.keys(errors).length;

  const titleOptions: Option[] = TITLES.map((value) => ({
    value,
    label: t(`titles.${value}`),
  }));

  const presentationOptions: Option[] = PRESENTATION_TYPES.map((value) => ({
    value,
    label: t(`presentationTypes.${value}`),
  }));

  async function onSubmit(values: Record<string, unknown>) {
    setServerError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });
      const data = (await response.json()) as ApiResult;

      if (!response.ok || !data.ok) {
        if (data.fields) {
          for (const [field, message] of Object.entries(data.fields)) {
            setError(field as "firstName", { type: "server", message });
          }
        }
        setServerError(data.error ?? t("register.errorUnavailable"));
        return;
      }

      const chosen = conferences.find(
        (option) => option.value === values.conference,
      );
      setSubmittedConference(chosen?.label ?? "");
      reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setServerError(t("register.errorNetwork"));
    }
  }

  if (submittedConference !== null) {
    return (
      <div className="space-y-6">
        <FormStatus tone="success" title={t("register.successHeading")}>
          {t("register.successBody", { conference: submittedConference })}
        </FormStatus>
        <div className="flex flex-wrap gap-3">
          <LinkButton href="/upload">{t("register.successNext")}</LinkButton>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setSubmittedConference(null)}
          >
            {t("register.successAgain")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {serverError || errorCount ? (
        <FormStatus tone="error" title={t("register.errorHeading")}>
          {serverError || t("register.errorSummary", { count: errorCount })}
        </FormStatus>
      ) : null}

      <FormSection title={t("register.personalHeading")}>
        <Field id="reg-title" label={t("register.titleLabel")}>
          <Select id="reg-title" {...register("title")}>
            <option value="">{t("register.selectPlaceholder")}</option>
            {titleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <div className="hidden sm:block" aria-hidden />

        <Field
          id="reg-first-name"
          label={t("register.firstNameLabel")}
          required
          requiredLabel={t("common.required")}
          error={errors.firstName?.message}
        >
          <TextInput
            id="reg-first-name"
            autoComplete="given-name"
            hasError={Boolean(errors.firstName)}
            aria-invalid={errors.firstName ? true : undefined}
            {...register("firstName")}
          />
        </Field>

        <Field
          id="reg-last-name"
          label={t("register.lastNameLabel")}
          required
          requiredLabel={t("common.required")}
          error={errors.lastName?.message}
        >
          <TextInput
            id="reg-last-name"
            autoComplete="family-name"
            hasError={Boolean(errors.lastName)}
            aria-invalid={errors.lastName ? true : undefined}
            {...register("lastName")}
          />
        </Field>

        <Field
          id="reg-affiliation"
          label={t("register.affiliationLabel")}
          required
          requiredLabel={t("common.required")}
          error={errors.affiliation?.message}
          className="sm:col-span-2"
        >
          <TextInput
            id="reg-affiliation"
            autoComplete="organization"
            hasError={Boolean(errors.affiliation)}
            aria-invalid={errors.affiliation ? true : undefined}
            {...register("affiliation")}
          />
        </Field>

        <Field
          id="reg-country"
          label={t("register.countryLabel")}
          required
          requiredLabel={t("common.required")}
          error={errors.country?.message}
        >
          <Select
            id="reg-country"
            autoComplete="country"
            hasError={Boolean(errors.country)}
            aria-invalid={errors.country ? true : undefined}
            {...register("country")}
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          id="reg-address"
          label={t("register.addressLabel")}
          error={errors.address?.message}
        >
          <TextInput
            id="reg-address"
            autoComplete="street-address"
            hasError={Boolean(errors.address)}
            {...register("address")}
          />
        </Field>

        <Field
          id="reg-phone"
          label={t("register.phoneLabel")}
          required
          requiredLabel={t("common.required")}
          error={errors.phone?.message}
        >
          <TextInput
            id="reg-phone"
            type="tel"
            autoComplete="tel"
            hasError={Boolean(errors.phone)}
            aria-invalid={errors.phone ? true : undefined}
            {...register("phone")}
          />
        </Field>

        <Field
          id="reg-email"
          label={t("register.emailLabel")}
          required
          requiredLabel={t("common.required")}
          error={errors.email?.message}
        >
          <TextInput
            id="reg-email"
            type="email"
            autoComplete="email"
            hasError={Boolean(errors.email)}
            aria-invalid={errors.email ? true : undefined}
            {...register("email")}
          />
        </Field>

        <Field
          id="reg-second-email"
          label={t("register.secondEmailLabel")}
          hint={t("register.secondEmailHint")}
          error={errors.secondEmail?.message}
          className="sm:col-span-2"
        >
          <TextInput
            id="reg-second-email"
            type="email"
            hasError={Boolean(errors.secondEmail)}
            {...register("secondEmail")}
          />
        </Field>
      </FormSection>

      <FormSection title={t("register.eventHeading")}>
        <Field
          id="reg-conference"
          label={t("register.conferenceLabel")}
          required
          requiredLabel={t("common.required")}
          error={errors.conference?.message}
        >
          <Select
            id="reg-conference"
            hasError={Boolean(errors.conference)}
            aria-invalid={errors.conference ? true : undefined}
            {...register("conference")}
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
          id="reg-presentation-type"
          label={t("register.presentationTypeLabel")}
          required
          requiredLabel={t("common.required")}
          error={errors.presentationType?.message}
        >
          <Select
            id="reg-presentation-type"
            hasError={Boolean(errors.presentationType)}
            aria-invalid={errors.presentationType ? true : undefined}
            {...register("presentationType")}
          >
            <option value="">{t("register.selectPlaceholder")}</option>
            {presentationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <div className="space-y-3 sm:col-span-2">
          <Checkbox
            id="reg-participated"
            label={t("register.participatedLastYearLabel")}
            {...register("participatedLastYear")}
          />
          <Checkbox
            id="reg-phd"
            label={t("register.phdUnder30Label")}
            {...register("phdUnder30")}
          />
        </div>

        <Field
          id="reg-article-title"
          label={t("register.articleTitleLabel")}
          error={errors.articleTitle?.message}
          className="sm:col-span-2"
        >
          <TextInput
            id="reg-article-title"
            hasError={Boolean(errors.articleTitle)}
            {...register("articleTitle")}
          />
        </Field>

        <Field
          id="reg-article-abstract"
          label={t("register.articleAbstractLabel")}
          hint={t("register.charactersLeft", {
            count: Math.max(0, MAX_ABSTRACT - abstract.length),
          })}
          error={errors.articleAbstract?.message}
          className="sm:col-span-2"
        >
          <Textarea
            id="reg-article-abstract"
            rows={6}
            maxLength={MAX_ABSTRACT}
            hasError={Boolean(errors.articleAbstract)}
            {...register("articleAbstract")}
          />
        </Field>

        <div className="sm:col-span-2">
          <Checkbox
            id="reg-second-article"
            label={t("register.secondArticleToggle")}
            {...register("hasSecondArticle")}
          />
        </div>

        {hasSecondArticle ? (
          <>
            <Field
              id="reg-article-title-2"
              label={t("register.articleTitle2Label")}
              required
              requiredLabel={t("common.required")}
              error={errors.articleTitle2?.message}
              className="sm:col-span-2"
            >
              <TextInput
                id="reg-article-title-2"
                hasError={Boolean(errors.articleTitle2)}
                aria-invalid={errors.articleTitle2 ? true : undefined}
                {...register("articleTitle2")}
              />
            </Field>

            <Field
              id="reg-article-abstract-2"
              label={t("register.articleAbstract2Label")}
              hint={t("register.charactersLeft", {
                count: Math.max(0, MAX_ABSTRACT - abstract2.length),
              })}
              error={errors.articleAbstract2?.message}
              className="sm:col-span-2"
            >
              <Textarea
                id="reg-article-abstract-2"
                rows={6}
                maxLength={MAX_ABSTRACT}
                hasError={Boolean(errors.articleAbstract2)}
                {...register("articleAbstract2")}
              />
            </Field>
          </>
        ) : null}
      </FormSection>

      <FormSection title={t("register.invoiceHeading")}>
        <div className="sm:col-span-2">
          <Checkbox
            id="reg-invoice"
            label={t("register.invoiceToggle")}
            {...register("invoiceNeeded")}
          />
        </div>

        {invoiceNeeded ? (
          <>
            <Field
              id="reg-company"
              label={t("register.companyLabel")}
              required
              requiredLabel={t("common.required")}
              error={errors.company?.message}
            >
              <TextInput
                id="reg-company"
                autoComplete="organization"
                hasError={Boolean(errors.company)}
                aria-invalid={errors.company ? true : undefined}
                {...register("company")}
              />
            </Field>

            <Field
              id="reg-company-address"
              label={t("register.companyAddressLabel")}
              required
              requiredLabel={t("common.required")}
              error={errors.companyAddress?.message}
            >
              <TextInput
                id="reg-company-address"
                hasError={Boolean(errors.companyAddress)}
                aria-invalid={errors.companyAddress ? true : undefined}
                {...register("companyAddress")}
              />
            </Field>

            <Field
              id="reg-responsible"
              label={t("register.responsiblePersonLabel")}
              required
              requiredLabel={t("common.required")}
              error={errors.responsiblePerson?.message}
            >
              <TextInput
                id="reg-responsible"
                hasError={Boolean(errors.responsiblePerson)}
                aria-invalid={errors.responsiblePerson ? true : undefined}
                {...register("responsiblePerson")}
              />
            </Field>

            <Field
              id="reg-vat"
              label={t("register.vatLabel")}
              error={errors.vat?.message}
            >
              <TextInput
                id="reg-vat"
                hasError={Boolean(errors.vat)}
                {...register("vat")}
              />
            </Field>
          </>
        ) : null}
      </FormSection>

      <fieldset className="border-line rounded-lg border bg-white p-5 sm:p-6">
        <legend className="text-primary-800 px-2 text-base font-bold">
          {t("register.consentHeading")}
        </legend>
        <div className="mt-2">
          <Checkbox
            id="reg-consent"
            error={errors.consent?.message}
            label={t.rich("register.consentLabel", {
              terms: (chunks) => (
                <Link
                  href="/terms"
                  className="text-accent-700 hover:text-primary-700 underline underline-offset-2"
                >
                  {chunks}
                </Link>
              ),
            })}
            {...register("consent")}
          />
        </div>
      </fieldset>

      <Honeypot {...register("website")} />

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? t("register.submitting") : t("register.submit")}
      </Button>
    </form>
  );
}
