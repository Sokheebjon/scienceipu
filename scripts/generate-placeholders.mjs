/**
 * Generates every placeholder image the site uses, as SVG, in the site palette.
 *
 * Nothing here is downloaded, traced or derived from any third-party site: the
 * output is plain gradients, a geometric lattice and monogram marks. Run with
 * `npm run gen:images`; output goes to public/img and is committed.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "img");

const PALETTE = {
  primary900: "#121139",
  primary800: "#18174a",
  primary700: "#252260",
  primary600: "#343073",
  primary500: "#4b4899",
  primary400: "#6f6bb8",
  accent500: "#c8a24b",
  accent300: "#dcc57c",
  neutral100: "#f1f3f7",
  neutral200: "#e3e6ed",
  neutral300: "#cbd0db",
  neutral400: "#9aa1b4",
  neutral500: "#6b7387",
};

/** Small deterministic PRNG so regenerating produces identical files. */
function rng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function lattice(width, height, seed, opacity) {
  const random = rng(seed);
  const step = Math.round(width / 14);
  const parts = [];

  for (let x = step; x < width; x += step) {
    parts.push(
      `<line x1="${x}" y1="0" x2="${x - step * 0.6}" y2="${height}" />`,
    );
  }
  for (let y = step; y < height; y += step) {
    parts.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" />`);
  }

  const dots = [];
  const count = Math.round((width * height) / 26000);
  for (let i = 0; i < count; i += 1) {
    const cx = Math.round(random() * width);
    const cy = Math.round(random() * height);
    const r = 1.5 + random() * 3.5;
    dots.push(`<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" />`);
  }

  return `
    <g stroke="#ffffff" stroke-width="1" opacity="${opacity}">${parts.join("")}</g>
    <g fill="${PALETTE.accent500}" opacity="${(opacity * 2.4).toFixed(2)}">${dots.join("")}</g>`;
}

/** Deep navy banner with a lattice and a gold rule along the lower edge. */
function banner({ width, height, seed, from, to }) {
  const id = `g${seed}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${id})" />
  ${lattice(width, height, seed, 0.07)}
  <rect x="0" y="${height - 6}" width="${width}" height="6" fill="${PALETTE.accent500}" />
</svg>
`;
}

/** Lighter card for gallery tiles, so a grid of them does not read as a wall. */
function tile({ width, height, seed, from, to }) {
  const id = `t${seed}`;
  const random = rng(seed * 7 + 3);
  const bars = [];
  for (let i = 0; i < 5; i += 1) {
    const w = Math.round(width * (0.18 + random() * 0.34));
    const h = Math.round(height * (0.05 + random() * 0.16));
    const x = Math.round(random() * (width - w));
    const y = Math.round(random() * (height - h));
    bars.push(
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.round(h / 2)}" />`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${id})" />
  <g fill="#ffffff" opacity="0.08">${bars.join("")}</g>
  ${lattice(width, height, seed, 0.05)}
</svg>
`;
}

/** Grayscale monogram mark used in the partner strip. */
function partnerLogo(monogram) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="96" viewBox="0 0 240 96" role="img">
  <rect width="240" height="96" fill="none" />
  <rect x="8" y="16" width="64" height="64" rx="8" fill="${PALETTE.neutral300}" />
  <text x="40" y="57" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="700"
        fill="${PALETTE.neutral500}" text-anchor="middle">${monogram}</text>
  <rect x="86" y="34" width="132" height="10" rx="5" fill="${PALETTE.neutral300}" />
  <rect x="86" y="54" width="96" height="10" rx="5" fill="${PALETTE.neutral200}" />
</svg>
`;
}

/** Schematic map block for the venue page. */
function mapPlaceholder() {
  const roads = [];
  for (let i = 1; i < 7; i += 1) {
    roads.push(
      `<line x1="0" y1="${i * 90}" x2="960" y2="${i * 90 - 30}" stroke="${PALETTE.neutral300}" stroke-width="${i % 3 === 0 ? 8 : 3}" />`,
    );
  }
  for (let i = 1; i < 10; i += 1) {
    roads.push(
      `<line x1="${i * 100}" y1="0" x2="${i * 100 - 40}" y2="540" stroke="${PALETTE.neutral300}" stroke-width="${i % 4 === 0 ? 8 : 3}" />`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540" role="img">
  <rect width="960" height="540" fill="${PALETTE.neutral100}" />
  ${roads.join("")}
  <circle cx="480" cy="270" r="46" fill="${PALETTE.primary800}" opacity="0.12" />
  <circle cx="480" cy="270" r="16" fill="${PALETTE.primary800}" />
  <circle cx="480" cy="270" r="6" fill="${PALETTE.accent500}" />
</svg>
`;
}

/** Square monogram used in the header lockup, alongside the localised name. */
function siteMark() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" role="img">
  <rect width="64" height="64" rx="10" fill="${PALETTE.primary800}" />
  <path d="M16 44 L32 18 L48 44" fill="none" stroke="#ffffff" stroke-width="4"
        stroke-linecap="round" stroke-linejoin="round" />
  <line x1="16" y1="50" x2="48" y2="50" stroke="${PALETTE.accent500}" stroke-width="4"
        stroke-linecap="round" />
</svg>
`;
}

const files = new Map();

files.set(
  "hero.svg",
  banner({
    width: 1680,
    height: 720,
    seed: 11,
    from: PALETTE.primary900,
    to: PALETTE.primary600,
  }),
);

files.set(
  "page-banner.svg",
  banner({
    width: 1680,
    height: 420,
    seed: 23,
    from: PALETTE.primary800,
    to: PALETTE.primary500,
  }),
);

const conferenceSlugs = [
  "agriculture-and-food",
  "ecology-and-safety",
  "materials-methods-and-technologies",
  "economy-and-business",
  "education-research-and-development",
  "language-individual-and-society",
];

conferenceSlugs.forEach((slug, index) => {
  files.set(
    `conferences/${slug}.svg`,
    banner({
      width: 1680,
      height: 480,
      seed: 41 + index * 13,
      from: index % 2 === 0 ? PALETTE.primary900 : PALETTE.primary800,
      to: index % 3 === 0 ? PALETTE.primary500 : PALETTE.primary600,
    }),
  );
});

for (let i = 1; i <= 12; i += 1) {
  files.set(
    `gallery/photo-${String(i).padStart(2, "0")}.svg`,
    tile({
      width: 1200,
      height: 900,
      seed: 101 + i * 17,
      from: i % 2 === 0 ? PALETTE.primary700 : PALETTE.primary800,
      to: i % 3 === 0 ? PALETTE.primary400 : PALETTE.primary500,
    }),
  );
}

const partnerMonograms = [
  ["agrarian-university", "AU"],
  ["technical-university", "TU"],
  ["university-of-economics", "UE"],
  ["pedagogical-university", "PU"],
  ["world-languages", "WL"],
  ["institute-of-ecology", "IE"],
  ["institute-of-physics", "IP"],
  ["institute-of-chemistry", "IC"],
  ["academy-of-sciences", "AS"],
  ["research-foundation", "RF"],
];

for (const [id, monogram] of partnerMonograms) {
  files.set(`partners/${id}.svg`, partnerLogo(monogram));
}

files.set("venue-map.svg", mapPlaceholder());
files.set("mark.svg", siteMark());

let written = 0;
for (const [name, contents] of files) {
  const target = join(outDir, name);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents, "utf8");
  written += 1;
}

console.log(`Generated ${written} placeholder images in public/img`);
