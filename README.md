# International Scientific Conferences

Bilingual (Uzbek / English) website for six international scientific
conferences. Next.js 15 App Router, TypeScript, Tailwind v4, `next-intl`.
Form submissions are stored by the **ipu-back** backend (NestJS + MongoDB):
each form has its own collection (`conference_registrations`,
`conference_contacts`, `conference_newsletter_subscriptions`,
`conference_uploads`), and `/admin` is a management panel that talks to the
ipu-back admin app using its own JWT auth.

Conference content lives in typed data files under `src/data/`; submissions
are proxied through the Next.js API routes to the ipu-back user app.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # optional for local development
npm run dev                    # http://localhost:3000 -> redirects to /uz
```

The app runs without the backend. With ipu-back unreachable, the forms
validate normally and the API returns a localised "temporarily unavailable"
message, while the server logs one clear warning.

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

| Variable                    | Required  | Default                          | Notes                                                                       |
| --------------------------- | --------- | -------------------------------- | --------------------------------------------------------------------------- |
| `CONFERENCE_API_URL`        | for forms | `http://localhost:4000`          | ipu-back **user** app. Server-side only; form posts are proxied to it.      |
| `NEXT_PUBLIC_ADMIN_API_URL` | for admin | `http://localhost:3000`          | ipu-back **admin** app. Read in the browser by the `/admin` panel.          |
| `NEXT_PUBLIC_SITE_URL`      | no        | `https://conferences.example.uz` | Absolute origin for canonical URLs, hreflang alternates and OpenGraph       |

---

## Backend (ipu-back)

The backend lives in the separate `ipu-back` repository (NestJS monorepo,
MongoDB). Two apps matter here:

- **user app** (default port 4000) — public endpoints the Next.js API routes
  proxy to: `POST /conference-registrations` (returns the generated
  `registrationNumber`, e.g. `IPU-00042`), `POST /conference-contacts`,
  `POST /conference-newsletter` (idempotent per email), and
  `POST /conference-uploads` (multipart; stores the file in S3 under
  `conference/uploads/` and records it).
- **admin app** (default port 3000) — JWT-protected `GET`/`DELETE` endpoints
  for the same collections, plus `POST /auth/login` (`{phone, password}` →
  `{user, token}`). The `/admin` panel in this repo logs in there, keeps the
  token in `localStorage` and sends it as a `Bearer` header.

Run it locally with `npm run start:user:dev` / `npm run start:admin:dev` inside
`ipu-back` (Mongo comes from its `docker-compose.yml`). Note the ipu-back admin
app also defaults to port 3000, so start Next on another port
(`npm run dev -- -p 3001`) when running all three together.

Test a registration end to end:

```bash
curl -i -X POST http://localhost:3001/api/register \
  -H 'Content-Type: application/json' \
  -d '{
    "locale": "en",
    "website": "",
    "title": "dr",
    "firstName": "Test",
    "lastName": "Participant",
    "affiliation": "Test University",
    "country": "UZ",
    "phone": "+998901234567",
    "email": "test@example.com",
    "conference": "exact-sciences",
    "presentationType": "oral",
    "hasSecondArticle": false,
    "consent": true
  }'
```

Expected responses:

- `200 {"ok":true,"registrationNumber":"IPU-00001"}` — stored in Mongo
- `503` with a localised message — ipu-back unreachable; check the `[backend]`
  server log line
- `400` with a `fields` object — validation failed, keyed by field name
- `429` — more than five posts from one address within a minute

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
      page.tsx             home (hero sits between the logo and the fastnav)
      (inner)/             route group: renders the fastnav above every page
        layout.tsx
        conferences/[slug]/  six generated detail pages
        register/ upload/ payment/ deadlines/ venue/ photos/
        about/ contacts/ terms/ privacy/
    api/
      register/ newsletter/ contact/ upload/   route handlers (proxy to ipu-back)
    admin/
      layout.tsx login/    admin shell + login (ipu-back JWT auth)
      (panel)/             dashboard, registrations, contacts, newsletter, uploads
  components/
    layout/                header, nav, drawer, footer, locale switcher, cookies
    home/                  conference card, newsletter form, partner strip
    conference/            in-page section nav
    form/                  field primitives, registration, contact, upload forms
    gallery/               grid + lightbox
    ui/                    Container, Section, Button, DataTable, PageHeader
  data/                    conferences, site, partners, accommodation, countries
  i18n/                    routing, navigation, request config
  lib/                     schemas, backend proxy, admin API client, rate limit
  middleware.ts            locale routing (skips /api and /admin)
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

### Design

The layout replicates the reference site's skeleton: a dark textured page
background, a fixed uppercase top nav, a centred logo, a hero image in an 8px
white frame, a dark "fastnav" bar, conference boxes in a 1px-gap dark mosaic,
a compact dark newsletter box, white content sheets for inner pages, and a
one-line footer — all inside a boxed 1200px wrap. Only the structure is
replicated; every colour comes from this project's own palette and every asset
is original.

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
- `/venue` — the map is a schematic placeholder; swap in a real embed

---

## Deployment

Vercel-compatible with no extra configuration.

1. Push the repository and import it in Vercel.
2. Add the environment variables from the table above under **Settings →
   Environment Variables**. `CONFERENCE_API_URL` must point at the deployed
   ipu-back user app and `NEXT_PUBLIC_ADMIN_API_URL` at the admin app.
3. Set `NEXT_PUBLIC_SITE_URL` to the production origin, otherwise canonical and
   hreflang URLs point at the placeholder domain.
4. Deploy. Every page except the API routes is statically prerendered for
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
