import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { buttonClass } from "@/components/ui/Button";
import { PdfViewer } from "@/components/proceedings/PdfViewer";
import { getConference } from "@/data/conferences";
import {
  PROCEEDINGS_DIR,
  getProceedingsVolume,
  proceedings,
  type ProceedingsVolume,
} from "@/data/proceedings";
import { cn } from "@/lib/cn";
import { formatMegabytes } from "@/lib/format";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale; path?: string[] }> };

/** Only the volumes and parts listed in the data exist; the rest is a 404. */
export const dynamicParams = false;

/**
 * /proceedings                  first volume
 * /proceedings/{section}        that section's volume (its first part)
 * /proceedings/{section}/{n}    part n of a volume split into parts, n >= 2
 */
function volumeHref(volume: ProceedingsVolume, part = 0) {
  const base = `/proceedings/${volume.conference}`;
  return part === 0 ? base : `${base}/${part + 1}`;
}

function resolveSelection(path: string[] = []) {
  const [slug, partNumber, ...rest] = path;
  if (rest.length) return undefined;

  const volume = slug ? getProceedingsVolume(slug) : proceedings[0];
  if (!volume) return undefined;
  if (partNumber === undefined) return { volume, part: 0 };

  const part = Number(partNumber) - 1;
  const isListedPart =
    String(part + 1) === partNumber && part >= 1 && part < volume.files.length;
  return isListedPart ? { volume, part } : undefined;
}

export function generateStaticParams() {
  const paths: string[][] = [[]];
  for (const volume of proceedings) {
    paths.push([volume.conference]);
    for (let part = 1; part < volume.files.length; part += 1) {
      paths.push([volume.conference, String(part + 1)]);
    }
  }

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({ locale, path })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, path } = await params;
  const selection = resolveSelection(path);
  if (!selection) return {};

  const t = await getTranslations({ locale, namespace: "proceedings" });
  const { volume, part } = selection;
  const conference = getConference(volume.conference);

  const titleParts = [
    t("metaTitle"),
    t("sectionNumber", { number: volume.number }),
    conference?.name[locale],
    volume.files.length > 1 ? t("part", { index: part + 1 }) : undefined,
  ];

  return buildMetadata({
    locale,
    title: titleParts.filter(Boolean).join(" · "),
    description: t("metaDescription"),
    path: volumeHref(volume, part),
  });
}

export default async function ProceedingsPage({ params }: Props) {
  const { locale, path } = await params;
  const selection = resolveSelection(path);
  if (!selection) notFound();

  setRequestLocale(locale);
  const t = await getTranslations();

  const { volume, part } = selection;
  const file = volume.files[part];
  const fileUrl = `${PROCEEDINGS_DIR}/${file.file}`;
  const sectionName = (candidate: ProceedingsVolume) =>
    getConference(candidate.conference)?.name[locale] ?? candidate.conference;
  const hasParts = volume.files.length > 1;

  return (
    <>
      <PageHeader
        title={t("proceedings.heading")}
        intro={t("proceedings.intro")}
      />

      <Container>
        <nav aria-label={t("proceedings.sectionsLabel")}>
          <ul className="bg-primary-900 grid sm:grid-cols-3">
            {proceedings.map((candidate) => {
              const isActive = candidate === volume;
              return (
                <li key={candidate.conference}>
                  <Link
                    href={volumeHref(candidate)}
                    scroll={false}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "block border-b-2 px-4 py-3 text-center transition-colors",
                      isActive
                        ? "border-accent-500 bg-primary-950 text-white"
                        : "text-primary-200 hover:bg-primary-950 border-transparent hover:text-white",
                    )}
                  >
                    <span className="text-accent-400 block text-[11px] font-semibold tracking-[0.14em] uppercase">
                      {t("proceedings.sectionNumber", {
                        number: candidate.number,
                      })}
                    </span>
                    <span className="mt-0.5 block text-sm font-semibold">
                      {sectionName(candidate)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <section
          aria-labelledby="proceedings-volume-heading"
          className="mb-5 bg-white p-5 sm:p-8"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-accent-700 mb-2 text-xs font-semibold tracking-[0.14em] uppercase">
                {t("proceedings.sectionNumber", { number: volume.number })}
                {hasParts
                  ? ` · ${t("proceedings.part", { index: part + 1 })}`
                  : null}
              </p>
              <h2
                id="proceedings-volume-heading"
                className="text-xl sm:text-2xl"
              >
                {sectionName(volume)}
              </h2>
              <div
                aria-hidden
                className="bg-accent-500 mt-3 h-1 w-12 rounded-full"
              />
              <p className="mt-4 text-sm text-neutral-600">
                {t("proceedings.fileInfo", {
                  pages: file.pages,
                  size: formatMegabytes(file.size, locale),
                })}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href={fileUrl} download className={buttonClass("primary")}>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                >
                  <path
                    d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t("proceedings.download")}
              </a>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener"
                className={buttonClass("secondary")}
              >
                {t("proceedings.openInNewTab")}
              </a>
            </div>
          </div>

          {hasParts ? (
            <nav aria-label={t("proceedings.partsLabel")} className="mt-6">
              <ul className="flex flex-wrap gap-2">
                {volume.files.map((candidate, index) => {
                  const isActive = index === part;
                  return (
                    <li key={candidate.file}>
                      <Link
                        href={volumeHref(volume, index)}
                        scroll={false}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "block rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                          isActive
                            ? "border-primary-800 bg-primary-800 text-white"
                            : "border-primary-300 text-primary-700 hover:border-primary-500 hover:bg-primary-50 bg-white",
                        )}
                      >
                        {t("proceedings.part", { index: index + 1 })}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : null}

          <div className="mt-6">
            <PdfViewer
              src={fileUrl}
              title={t("proceedings.viewerTitle", {
                name: sectionName(volume),
              })}
              fallback={t("proceedings.noInlineViewer")}
            />
          </div>
        </section>
      </Container>
    </>
  );
}
