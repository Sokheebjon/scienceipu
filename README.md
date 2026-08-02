# International Scientific Conferences

Bilingual (Uzbek / English) website for six international scientific
conferences. Next.js 15 App Router, TypeScript, Tailwind v4, `next-intl`, and
Google Sheets as the only data store for form submissions.

There is no database. Conference content lives in typed data files under
`src/data/`; registrations, newsletter subscriptions and contact messages are
appended to tabs in a single Google spreadsheet.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # optional for local development
npm run dev                    # http://localhost:3000 -> redirects to /uz
```

The app runs without any credentials. With the Google variables unset, the
forms validate normally and the API returns a localised "temporarily
unavailable" message, while the server logs one clear warning. Nothing in the
build touches Google.

### Scripts

| Script                   | What it does                                                     |
| ------------------------ | ---------------------------------------------------------------- |
| `npm run dev`            | Development server                                               |
| `npm run build`          | Production build                                                 |
| `npm run start`          | Serve the production build                                       |
| `npm run lint`           | ESLint                                                           |
| `npm run typecheck`      | `tsc --noEmit`                                                   |
| `npm run format`         | Prettier, including Tailwind class ordering                      |
| `npm run check:messages` | Asserts `uz.json` and `en.json` have identical keys and ICU args |
| `npm run gen:images`     | Regenerates the placeholder SVGs in `public/img`                 |
| `npm run verify`         | messages + typecheck + lint + build, in that order               |

---

## Environment variables

Copy `.env.example` to `.env.local`. `.env.local` is git-ignored and must never
be committed.

| Variable                       | Required  | Default                          | Notes                                                                                  |
| ------------------------------ | --------- | -------------------------------- | -------------------------------------------------------------------------------------- |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | for forms | —                                | `something@project-id.iam.gserviceaccount.com`, from the service-account JSON key      |
| `GOOGLE_PRIVATE_KEY`           | for forms | —                                | Full key including the BEGIN/END lines. Keep the `\n` escapes; the app unescapes them. |
| `GOOGLE_SHEET_ID`              | for forms | —                                | The id in the spreadsheet URL between `/d/` and `/edit`                                |
| `GOOGLE_SHEET_TAB`             | no        | `Registrations`                  | Tab for registrations. The `Newsletter` and `Contacts` tab names are fixed.            |
| `NEXT_PUBLIC_SITE_URL`         | no        | `https://conferences.example.uz` | Absolute origin for canonical URLs, hreflang alternates and OpenGraph                  |

All three Google variables must be present together. If any is missing, the app
logs the missing names once and every form returns a friendly error.

---

## Google Sheets setup

**1. Create a Google Cloud project**

Go to <https://console.cloud.google.com/projectcreate>, name the project, and
create it.

**2. Enable the Sheets API**

In the project, open **APIs & Services → Library**, search for **Google Sheets
API**, and press **Enable**. (Direct link:
<https://console.cloud.google.com/apis/library/sheets.googleapis.com>.)

**3. Create a service account and a JSON key**

- **APIs & Services → Credentials → Create credentials → Service account**
- Give it a name such as `conferences-writer`; no project roles are needed,
  because access is granted on the spreadsheet itself in step 5.
- Open the new service account → **Keys → Add key → Create new key → JSON**.
- A `.json` file downloads. It contains `client_email` and `private_key`.

**4. Create the spreadsheet**

Create a new Google spreadsheet. Take the id from its URL:

```
https://docs.google.com/spreadsheets/d/1AbC...XyZ/edit
                                      ^^^^^^^^^^^ this is GOOGLE_SHEET_ID
```

You do not need to create the tabs or type the header rows. The app creates a
missing tab and writes the header row when row 1 is empty.

**5. Share the spreadsheet with the service account**

This is the step that is easy to miss. Press **Share** on the spreadsheet, paste
the `client_email` value from the JSON key, and give it **Editor**. Without
this, every append fails with a 403.

**6. Fill in `.env.local`**

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=conferences-writer@my-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1AbC...XyZ
GOOGLE_SHEET_TAB=Registrations
```

Copy `private_key` from the JSON exactly as it appears there, on one line, with
the `\n` sequences intact, wrapped in double quotes.

**7. Test with curl**

Start the server (`npm run dev`) and post a registration:

```bash
curl -i -X POST http://localhost:3000/api/register \
  -H 'Content-Type: application/json' \
  -d '{
    "locale": "en",
    "website": "",
    "title": "dr",
    "firstName": "Test",
    "lastName": "Participant",
    "affiliation": "Test University",
    "country": "UZ",
    "address": "1 Registan Street",
    "phone": "+998901234567",
    "email": "test@example.com",
    "secondEmail": "",
    "conference": "ecology-and-safety",
    "presentationType": "oral",
    "participatedLastYear": false,
    "phdUnder30": true,
    "articleTitle": "A test paper",
    "articleAbstract": "Short abstract.",
    "hasSecondArticle": false,
    "invoiceNeeded": false,
    "consent": true
  }'
```

Expected responses:

- `200 {"ok":true}` — a row appears on the `Registrations` tab
- `503` with a localised message — credentials missing or wrong; check the
  server log for the `[sheets]` line
- `400` with a `fields` object — validation failed, keyed by field name
- `429` — more than five posts from one address within a minute

The newsletter and contact endpoints work the same way:

```bash
curl -X POST http://localhost:3000/api/newsletter -H 'Content-Type: application/json' \
  -d '{"locale":"uz","email":"test@example.com","website":"","sourcePath":"/"}'

curl -X POST http://localhost:3000/api/contact -H 'Content-Type: application/json' \
  -d '{"locale":"uz","name":"Test","email":"test@example.com","phone":"","message":"Salom, bu sinov xabari.","website":""}'
```

### Sheet layout

Timestamps are local Tashkent time in `YYYY-MM-DD HH:MM:SS`, which sorts
correctly as text. Booleans are written as `TRUE`/`FALSE`. The conference,
title and presentation type are stored as English labels rather than internal
keys, so the sheet stays readable whichever language the participant used.

**`Registrations`** (25 columns)

```
Timestamp | Locale | Title | First name | Last name | Affiliation | Country |
Address | Phone | Email | Second email | Conference | Presentation type |
Participated last year | PhD under 30 | Article 1 title | Article 1 abstract |
Article 2 title | Article 2 abstract | Invoice needed | Company |
Company address | Responsible person | VAT / INN | Consent
```

**`Newsletter`** — `Timestamp | Locale | Email | Source page`

**`Contacts`** — `Timestamp | Locale | Name | Email | Phone | Message`

Header definitions live in `src/lib/sheets.ts` and the value mapping in
`src/lib/rows.ts`, which asserts that each row's width matches its header.

---

## Project structure

```
messages/                  uz.json, en.json — every UI string
public/img/                generated placeholder SVGs (committed)
scripts/
  generate-placeholders.mjs   writes public/img
  check-messages.mjs          locale key + ICU placeholder parity
src/
  app/
    layout.tsx             pass-through; [locale]/layout.tsx renders <html>
    not-found.tsx          404 for paths outside any locale
    [locale]/
      layout.tsx           fonts, header, footer, cookie banner, metadata
      page.tsx             home
      conferences/[slug]/  six generated detail pages
      register/ upload/ payment/ deadlines/ venue/ photos/
      about/ contacts/ terms/ privacy/
    api/
      register/ newsletter/ contact/     route handlers
  components/
    layout/                header, nav, drawer, footer, locale switcher, cookies
    home/                  conference card, newsletter form, partner strip
    conference/            in-page section nav
    form/                  field primitives, registration, contact, upload forms
    gallery/               grid + lightbox
    ui/                    Container, Section, Button, DataTable, PageHeader
  data/                    conferences, site, partners, accommodation, countries
  i18n/                    routing, navigation, request config
  lib/                     schemas, sheets, rows, rate limit, format, metadata
  middleware.ts            locale routing
```

### Conference data

`src/data/conferences.ts` is the single source of truth. Every page reads from
it — the home cards, the six detail pages, the deadlines matrix, the fee tables,
the registration select and the nav dropdown. Editing an entry there updates all
of them. No conference fact is written into a component.

### Internationalisation

- Locales `uz` (default) and `en`, both always path-prefixed: `/uz/...`, `/en/...`
- Every string lives in `messages/`. `npm run check:messages` fails the build if
  the two files drift apart in keys or ICU arguments.
- Dates, numbers and currency are formatted per locale.
  `Intl` resolves `uz` to Uzbek Latin, so 2026-08-19 renders as
  `19-avgust, 2026` in Uzbek and `19 August 2026` in English. Ranges are
  recombined by hand in `src/lib/format.ts` because Intl's own `formatRange`
  spaces the Uzbek pattern awkwardly.
- Country names come from `Intl.DisplayNames`, which ships Uzbek Latin names, so
  no translated country list is maintained by hand. The list is built on the
  server and passed to the form as props to avoid a hydration mismatch.
- The language switcher keeps the visitor on the same path and preserves the
  query string, so `?conference=` survives a switch.
- `hreflang` alternates for both locales plus `x-default`, and localised
  OpenGraph, are emitted per page from `src/lib/metadata.ts`.

### Design tokens

Defined as Tailwind v4 `@theme` variables in `src/app/globals.css`.

- **Primary** navy anchored on `#18174A`, the brand navy used by ipu-edu.uz
  (its `theme-color` and the single colour in its wordmark). White on it is
  16.7:1.
- **Accent** is an academic gold in two working tiers, because no single gold
  clears WCAG AA on both backgrounds: `accent-500` `#C8A24B` for navy surfaces
  (6.92:1) and `accent-700` `#85652C` for text on white (5.39:1). Keep them on
  their own backgrounds.
- **Neutral** is a cool gray scale that deliberately replaces Tailwind's stock
  `neutral`.

### Imagery

Every image is a locally generated SVG in the palette, produced by
`npm run gen:images` and committed under `public/img`. Nothing is fetched from
or derived from any third-party site. All images are rendered through
`next/image` inside fixed-ratio boxes, so no layout shift occurs on load.

---

## Replacing the placeholders

Search the tree for `TODO` before launch. The main items:

- `src/data/conferences.ts` — names, editions, dates, topics, fees, deadlines
  and organising committee members
- `src/data/site.ts` — organisation name, address, phones, emails, bank details
  and tax identifiers
- `src/data/partners.ts` and `public/img/partners/` — real partners and logos
- `src/data/accommodation.ts` — real properties and distances
- `messages/*.json` — the `terms` and `privacy` bodies, reviewed legally, and
  the statistics on the about page
- `public/img/` — real photographs in place of the generated gallery, hero and
  conference banners
- `/upload` — the file input is a stub. It currently shows instructions to email
  the file. A real implementation needs an upload endpoint with a 5 MB cap and
  an allowlist of `.doc/.docx/.ppt/.pptx/.pdf`.
- `/venue` — the map is a schematic placeholder; swap in a real embed

---

## Deployment

Vercel-compatible with no extra configuration.

1. Push the repository and import it in Vercel.
2. Add the environment variables from the table above under **Settings →
   Environment Variables**. Paste `GOOGLE_PRIVATE_KEY` with the literal `\n`
   sequences, exactly as in `.env.local`.
3. Set `NEXT_PUBLIC_SITE_URL` to the production origin, otherwise canonical and
   hreflang URLs point at the placeholder domain.
4. Deploy. Every page except the three API routes is statically prerendered for
   both locales.

The rate limiter in `src/lib/rateLimit.ts` is in-memory and therefore
per-instance. On a serverless platform each instance keeps its own counters, so
treat it as protection against naive floods rather than a hard guarantee; put a
platform-level limiter in front of `/api/*` if you need more.

## Attribution and licensing

The page structure, navigation and page inventory follow the conventions of
academic conference sites. All copy, data, imagery and code in this repository
are original to this project. No text, image, logo or asset is copied from, or
hotlinked to, any third-party site.
