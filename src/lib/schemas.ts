import { z } from "zod";
import { conferenceSlugs } from "@/data/conferences";
import { countryCodes } from "@/data/countries";
import { locales } from "@/i18n/routing";

/**
 * Shared validation. Every schema is a factory taking a translate function so
 * the identical rules run on the client (with `useTranslations`) and on the
 * server (with `getTranslations`), producing messages in the submitter's
 * language on both sides.
 */
export type Translate = (
  key: string,
  values?: Record<string, string | number>,
) => string;

export const TITLES = ["mr", "ms", "dr", "prof", "eng"] as const;

export const PRESENTATION_TYPES = [
  "oral",
  "poster",
  "onlineOral",
  "onlinePoster",
  "attendee",
] as const;

export const UPLOAD_KINDS = [
  "manuscript",
  "abstract",
  "presentation",
  "poster",
] as const;

export const MAX_ABSTRACT = 2000;
export const MAX_MESSAGE = 4000;
const MAX_SHORT = 200;

/** Deliberately permissive: international numbers vary too much to be strict. */
const PHONE_PATTERN = /^[+()\d][\d\s()+.-]{5,30}$/;

function requiredText(t: Translate, max = MAX_SHORT) {
  return z
    .string()
    .trim()
    .min(1, t("validation.required"))
    .max(max, t("validation.maxLength", { max }));
}

function optionalText(t: Translate, max = MAX_SHORT) {
  return z
    .string()
    .trim()
    .max(max, t("validation.maxLength", { max }))
    .optional()
    .default("");
}

function optionalEmail(t: Translate) {
  return z
    .union([z.literal(""), z.email(t("validation.email"))])
    .optional()
    .default("");
}

/** Present but empty for real users; bots tend to fill every input. */
const honeypot = z.string().max(0).optional().default("");

const localeField = z.enum(locales);

/**
 * Everything the participant fills in. `locale` is added separately by the API
 * schema, because the form does not render it.
 *
 * The shape is built here rather than derived with `.omit()` from the server
 * schema: zod refuses `.omit()` on a schema carrying `.superRefine()`, and
 * calling it throws at render time in the browser.
 */
function registrationShape(t: Translate) {
  return {
    website: honeypot,

    // Personal information. Title is optional, so the placeholder option has
    // to validate: an empty string is accepted alongside the enum values.
    title: z
      .union([z.literal(""), z.enum(TITLES)])
      .optional()
      .default(""),
    firstName: requiredText(t),
    lastName: requiredText(t),
    affiliation: requiredText(t, 300),
    country: z.enum(countryCodes, t("validation.country")),
    address: optionalText(t, 300),
    phone: requiredText(t, 40).regex(PHONE_PATTERN, t("validation.phone")),
    email: z.email(t("validation.email")),
    secondEmail: optionalEmail(t),

    // Event information
    conference: z.enum(conferenceSlugs, t("validation.conference")),
    presentationType: z.enum(PRESENTATION_TYPES, t("validation.select")),
    participatedLastYear: z.boolean().optional().default(false),
    phdUnder30: z.boolean().optional().default(false),
    articleTitle: optionalText(t, 300),
    articleAbstract: optionalText(t, MAX_ABSTRACT),
    hasSecondArticle: z.boolean().optional().default(false),
    articleTitle2: optionalText(t, 300),
    articleAbstract2: optionalText(t, MAX_ABSTRACT),

    // Invoice
    invoiceNeeded: z.boolean().optional().default(false),
    company: optionalText(t, 300),
    companyAddress: optionalText(t, 300),
    responsiblePerson: optionalText(t),
    vat: optionalText(t, 60),

    // Consent
    consent: z.literal(true, t("validation.consent")),
  };
}

/** Fields whose requirement depends on a toggle elsewhere in the form. */
type ConditionalFields = {
  hasSecondArticle?: boolean;
  articleTitle2?: string;
  invoiceNeeded?: boolean;
  company?: string;
  companyAddress?: string;
  responsiblePerson?: string;
};

function registrationRules(t: Translate) {
  return (value: ConditionalFields, ctx: z.RefinementCtx) => {
    if (value.hasSecondArticle && !value.articleTitle2) {
      ctx.addIssue({
        code: "custom",
        path: ["articleTitle2"],
        message: t("validation.required"),
      });
    }

    if (value.invoiceNeeded) {
      for (const field of [
        "company",
        "companyAddress",
        "responsiblePerson",
      ] as const) {
        if (!value[field]) {
          ctx.addIssue({
            code: "custom",
            path: [field],
            message: t("validation.required"),
          });
        }
      }
    }
  };
}

/** Server-side schema: the form fields plus the submitter's locale. */
export function createRegistrationSchema(t: Translate) {
  return z
    .object({ locale: localeField, ...registrationShape(t) })
    .superRefine(registrationRules(t));
}

/** Client-side schema: identical rules, without the locale field. */
export function createRegistrationFormSchema(t: Translate) {
  return z.object(registrationShape(t)).superRefine(registrationRules(t));
}

export type RegistrationInput = z.input<
  ReturnType<typeof createRegistrationSchema>
>;
export type RegistrationValues = z.output<
  ReturnType<typeof createRegistrationSchema>
>;

export function createNewsletterSchema(t: Translate) {
  return z.object({
    locale: localeField,
    website: honeypot,
    email: z.email(t("newsletter.errorInvalid")),
    /** Path the visitor subscribed from, for context in the sheet. */
    sourcePath: optionalText(t, 300),
  });
}

export type NewsletterValues = z.output<
  ReturnType<typeof createNewsletterSchema>
>;

export function createContactSchema(t: Translate) {
  return z.object({
    locale: localeField,
    website: honeypot,
    name: requiredText(t),
    email: z.email(t("validation.email")),
    phone: optionalText(t, 40),
    message: z
      .string()
      .trim()
      .min(10, t("validation.message", { min: 10 }))
      .max(MAX_MESSAGE, t("validation.maxLength", { max: MAX_MESSAGE })),
  });
}

export type ContactValues = z.output<ReturnType<typeof createContactSchema>>;
