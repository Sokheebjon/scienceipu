import { google, type sheets_v4 } from "googleapis";

/**
 * Google Sheets append client.
 *
 * The app must build and run without credentials: when the environment is
 * incomplete every call returns `not-configured` and the route turns that into
 * a friendly, localised "temporarily unavailable" response. Nothing here runs
 * at build time.
 */

export type SheetTab = "registrations" | "newsletter" | "contacts";

export type AppendResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "error" };

export const SHEET_HEADERS: Record<SheetTab, string[]> = {
  registrations: [
    "Timestamp (Asia/Tashkent)",
    "Locale",
    "Title",
    "First name",
    "Last name",
    "Affiliation",
    "Country",
    "Address",
    "Phone",
    "Email",
    "Second email",
    "Conference",
    "Presentation type",
    "Participated last year",
    "PhD under 30",
    "Article 1 title",
    "Article 1 abstract",
    "Article 2 title",
    "Article 2 abstract",
    "Invoice needed",
    "Company",
    "Company address",
    "Responsible person",
    "VAT / INN",
    "Consent",
  ],
  newsletter: ["Timestamp (Asia/Tashkent)", "Locale", "Email", "Source page"],
  contacts: [
    "Timestamp (Asia/Tashkent)",
    "Locale",
    "Name",
    "Email",
    "Phone",
    "Message",
  ],
};

type SheetsConfig = {
  clientEmail: string;
  privateKey: string;
  spreadsheetId: string;
  tabs: Record<SheetTab, string>;
};

let warnedAboutConfig = false;

function readConfig(): SheetsConfig | null {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID?.trim();

  const missing: string[] = [];
  if (!clientEmail) missing.push("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  if (!rawKey) missing.push("GOOGLE_PRIVATE_KEY");
  if (!spreadsheetId) missing.push("GOOGLE_SHEET_ID");

  if (missing.length || !clientEmail || !rawKey || !spreadsheetId) {
    if (!warnedAboutConfig) {
      warnedAboutConfig = true;
      console.warn(
        `[sheets] Google Sheets is not configured; form submissions will not be stored. ` +
          `Missing environment variable(s): ${missing.join(", ")}. ` +
          `See .env.example and the README for setup instructions.`,
      );
    }
    return null;
  }

  return {
    clientEmail,
    // Env files keep the key on one line with \n escapes, and some hosts wrap
    // the whole value in quotes. Undo both before handing it to the JWT client.
    privateKey: rawKey.replace(/^["']|["']$/g, "").replace(/\\n/g, "\n"),
    spreadsheetId,
    tabs: {
      registrations: process.env.GOOGLE_SHEET_TAB?.trim() || "Registrations",
      newsletter: "Newsletter",
      contacts: "Contacts",
    },
  };
}

let clientPromise: Promise<sheets_v4.Sheets> | null = null;

function getClient(config: SheetsConfig): Promise<sheets_v4.Sheets> {
  if (!clientPromise) {
    const auth = new google.auth.JWT({
      email: config.clientEmail,
      key: config.privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    clientPromise = Promise.resolve(google.sheets({ version: "v4", auth }));
  }
  return clientPromise;
}

/** Creates the tab when absent, then writes the header row when row 1 is empty. */
async function ensureTab(
  sheets: sheets_v4.Sheets,
  config: SheetsConfig,
  tab: SheetTab,
): Promise<string> {
  const title = config.tabs[tab];
  const headers = SHEET_HEADERS[tab];

  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: config.spreadsheetId,
    fields: "sheets.properties.title",
  });

  const exists = spreadsheet.data.sheets?.some(
    (sheet) => sheet.properties?.title === title,
  );

  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: config.spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title } } }],
      },
    });
  }

  const firstRow = await sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadsheetId,
    range: `${title}!A1:A1`,
  });

  if (!firstRow.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: config.spreadsheetId,
      range: `${title}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [headers] },
    });
  }

  return title;
}

/** Appends one row. Values are written raw so Sheets never reformats them. */
export async function appendRow(
  tab: SheetTab,
  row: (string | number)[],
): Promise<AppendResult> {
  const config = readConfig();
  if (!config) return { ok: false, reason: "not-configured" };

  try {
    const sheets = await getClient(config);
    const title = await ensureTab(sheets, config, tab);

    await sheets.spreadsheets.values.append({
      spreadsheetId: config.spreadsheetId,
      range: `${title}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });

    return { ok: true };
  } catch (error) {
    console.error(`[sheets] Failed to append to the ${tab} tab:`, error);
    return { ok: false, reason: "error" };
  }
}

/** True when all three variables are present, used by the health check. */
export function isSheetsConfigured(): boolean {
  return readConfig() !== null;
}

/** Sheets renders these as real booleans rather than text. */
export function bool(value: boolean): string {
  return value ? "TRUE" : "FALSE";
}
