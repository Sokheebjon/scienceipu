import en from "../../messages/en.json";
import { getConference } from "@/data/conferences";
import { getCountryNameEn } from "@/data/countries";
import { tashkentTimestamp } from "./format";
import { bool, SHEET_HEADERS } from "./sheets";
import type {
  ContactValues,
  NewsletterValues,
  RegistrationValues,
} from "./schemas";

/**
 * Maps validated form values onto sheet rows.
 *
 * Human-readable English labels are written rather than internal keys, so the
 * spreadsheet is legible to the organising team regardless of which language
 * the participant used. The labels are pulled from the English message file so
 * they cannot drift from what the form displayed.
 */

function assertWidth(tab: keyof typeof SHEET_HEADERS, row: unknown[]) {
  const expected = SHEET_HEADERS[tab].length;
  if (row.length !== expected) {
    throw new Error(
      `[sheets] ${tab} row has ${row.length} cells but the header has ${expected}.`,
    );
  }
}

export function buildRegistrationRow(
  values: RegistrationValues,
): (string | number)[] {
  const conference = getConference(values.conference);

  const row = [
    tashkentTimestamp(),
    values.locale,
    values.title ? en.titles[values.title] : "",
    values.firstName,
    values.lastName,
    values.affiliation,
    getCountryNameEn(values.country),
    values.address,
    values.phone,
    values.email,
    values.secondEmail,
    conference ? conference.name.en : values.conference,
    en.presentationTypes[values.presentationType],
    bool(values.participatedLastYear),
    bool(values.phdUnder30),
    values.articleTitle,
    values.articleAbstract,
    values.hasSecondArticle ? values.articleTitle2 : "",
    values.hasSecondArticle ? values.articleAbstract2 : "",
    bool(values.consent),
  ];

  assertWidth("registrations", row);
  return row;
}

export function buildNewsletterRow(
  values: NewsletterValues,
): (string | number)[] {
  const row = [
    tashkentTimestamp(),
    values.locale,
    values.email,
    values.sourcePath,
  ];
  assertWidth("newsletter", row);
  return row;
}

export function buildContactRow(values: ContactValues): (string | number)[] {
  const row = [
    tashkentTimestamp(),
    values.locale,
    values.name,
    values.email,
    values.phone,
    values.message,
  ];
  assertWidth("contacts", row);
  return row;
}
