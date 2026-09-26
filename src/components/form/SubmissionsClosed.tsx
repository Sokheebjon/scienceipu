import { getTranslations } from "next-intl/server";
import { LinkButton } from "@/components/ui/Button";

/**
 * Stands in for the registration and upload forms once the deadline has
 * passed: a calendar badge, heading and short explanation, with links to the
 * contacts page and home.
 */
export async function SubmissionsClosed({
  form,
}: {
  form: "register" | "upload";
}) {
  const t = await getTranslations("submissionsClosed");

  return (
    <div className="feedback-in border-primary-100 from-primary-50 relative mx-auto max-w-2xl overflow-hidden rounded-xl border bg-gradient-to-b to-white px-6 py-10 text-center sm:px-12 sm:py-14">
      <div aria-hidden className="bg-accent-500 absolute inset-x-0 top-0 h-1" />

      <div className="bg-primary-800 text-accent-400 ring-primary-100 mx-auto flex h-16 w-16 items-center justify-center rounded-full shadow-md ring-8">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-8 w-8"
        >
          <rect x="3" y="4.5" width="18" height="16" rx="2" />
          <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
          <path d="M9.5 13l5 5M14.5 13l-5 5" />
        </svg>
      </div>

      <p className="border-accent-300 bg-accent-50 text-accent-800 mt-6 inline-block rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase">
        {t("badge")}
      </p>

      <h2 className="text-primary-900 mt-4 text-2xl sm:text-3xl">
        {t(form === "register" ? "registerHeading" : "uploadHeading")}
      </h2>

      <p className="mx-auto mt-4 max-w-lg leading-relaxed text-neutral-600">
        {t(form === "register" ? "registerBody" : "uploadBody")}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <LinkButton href="/contacts">{t("contactsCta")}</LinkButton>
        <LinkButton href="/" variant="secondary">
          {t("homeCta")}
        </LinkButton>
      </div>
    </div>
  );
}
