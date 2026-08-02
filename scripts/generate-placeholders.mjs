/**
 * Generates every placeholder image the site uses, as SVG, in the site palette.
 *
 * The artwork is original vector work: layered gradients, pointed arches and
 * n-pointed star tessellations, which are generic geometric motifs rather than
 * anything traced or copied. Nothing here is downloaded from, or derived from,
 * any third-party site.
 *
 * Run with `npm run gen:images`; output goes to public/img and is committed.
 * To use real photographs instead, drop JPG/PNG files with the same base names
 * into public/img/gallery and update the extension in the photos page.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "img");

const C = {
  navy950: "#0b0a24",
  navy900: "#121139",
  navy800: "#18174a",
  navy700: "#252260",
  navy600: "#343073",
  navy500: "#4b4899",
  navy400: "#6f6bb8",
  navy300: "#a5a2d3",
  gold500: "#c8a24b",
  gold400: "#d2b65e",
  gold300: "#dcc57c",
  gold200: "#eadca6",
  n100: "#f1f3f7",
  n200: "#e3e6ed",
  n300: "#cbd0db",
  n500: "#6b7387",
};

/** Deterministic PRNG so regenerating produces byte-identical files. */
function rng(seed) {
  let state = (seed * 2654435761) >>> 0;
  return () => {
    state ^= state << 13;
    state >>>= 0;
    state ^= state >> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0x100000000;
  };
}

const round = (value) => Math.round(value * 10) / 10;

/** n-pointed star, the base motif of the tessellation overlays. */
function star(cx, cy, outer, inner, points, rotation = 0) {
  const coords = [];
  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI / points) * i + rotation;
    coords.push(
      `${round(cx + radius * Math.cos(angle))},${round(cy + radius * Math.sin(angle))}`,
    );
  }
  return `M${coords.join("L")}Z`;
}

/** Pointed arch, the recurring architectural motif. */
function arch(x, y, w, h) {
  const half = w / 2;
  const spring = y + h * 0.42;
  return (
    `M${round(x)},${round(y + h)} L${round(x)},${round(spring)} ` +
    `C${round(x)},${round(y + h * 0.08)} ${round(x + half * 0.5)},${round(y)} ${round(x + half)},${round(y)} ` +
    `C${round(x + w - half * 0.5)},${round(y)} ${round(x + w)},${round(y + h * 0.08)} ${round(x + w)},${round(spring)} ` +
    `L${round(x + w)},${round(y + h)} Z`
  );
}

/** Fine film grain. Keeps large flat gradients from banding. */
function grain(id, opacity = 0.22) {
  return `<filter id="${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" result="n" />
      <feColorMatrix type="saturate" values="0" in="n" result="g" />
      <feComponentTransfer in="g" result="t">
        <feFuncA type="linear" slope="${opacity}" />
      </feComponentTransfer>
    </filter>`;
}

/** Soft coloured light blooms, layered for depth. */
function blooms(width, height, seed, colours) {
  const random = rng(seed);
  const defs = [];
  const shapes = [];

  colours.forEach((colour, index) => {
    const id = `bloom${seed}${index}`;
    const cx = width * (0.12 + random() * 0.76);
    const cy = height * (0.1 + random() * 0.8);
    const r = Math.max(width, height) * (0.3 + random() * 0.36);
    defs.push(
      `<radialGradient id="${id}">
        <stop offset="0%" stop-color="${colour}" stop-opacity="0.85" />
        <stop offset="60%" stop-color="${colour}" stop-opacity="0.22" />
        <stop offset="100%" stop-color="${colour}" stop-opacity="0" />
      </radialGradient>`,
    );
    shapes.push(
      `<circle cx="${round(cx)}" cy="${round(cy)}" r="${round(r)}" fill="url(#${id})" />`,
    );
  });

  return { defs: defs.join(""), shapes: shapes.join("") };
}

/** Repeating star lattice, drawn as thin gold strokes. */
function lattice(width, height, seed, { size = 120, opacity = 0.16 } = {}) {
  const random = rng(seed + 7);
  const parts = [];
  const points = 8;

  for (let y = -size / 2; y < height + size; y += size) {
    for (let x = -size / 2; x < width + size; x += size) {
      const offset = (Math.round(y / size) % 2) * (size / 2);
      const cx = x + offset;
      const jitter = (random() - 0.5) * size * 0.08;
      parts.push(
        `<path d="${star(cx + jitter, y + jitter, size * 0.34, size * 0.15, points, random() * 0.4)}" />`,
      );
    }
  }

  return `<g fill="none" stroke="${C.gold300}" stroke-width="1.1" opacity="${opacity}">${parts.join("")}</g>`;
}

/** Arcade of arches along the lower edge, receding in opacity. */
function arcade(width, height, seed, { count = 7, opacity = 0.3 } = {}) {
  const random = rng(seed + 13);
  const parts = [];
  const gap = width / count;
  const w = gap * 0.62;

  for (let i = 0; i < count; i += 1) {
    const h = height * (0.46 + random() * 0.3);
    const x = i * gap + (gap - w) / 2;
    const y = height - h;
    parts.push(
      `<path d="${arch(x, y, w, h)}" fill="${C.navy950}" opacity="${round(0.24 + random() * 0.3)}" />`,
      `<path d="${arch(x, y, w, h)}" fill="none" stroke="${C.gold400}" stroke-width="1.4" opacity="0.34" />`,
    );
  }

  return `<g opacity="${opacity}">${parts.join("")}</g>`;
}

function vignette(id) {
  return `<radialGradient id="${id}" cx="50%" cy="42%" r="78%">
      <stop offset="55%" stop-color="#000000" stop-opacity="0" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.42" />
    </radialGradient>`;
}

/**
 * Wide banner used for the hero and the conference headers: a deep navy field
 * with colour blooms, a star lattice, an arcade and a gold baseline.
 */
function banner({ width, height, seed, from, to, accentRule = true }) {
  const id = `b${seed}`;
  const { defs, shapes } = blooms(width, height, seed, [
    C.navy500,
    C.navy400,
    C.gold500,
  ]);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="55%" stop-color="${to}" />
      <stop offset="100%" stop-color="${from}" />
    </linearGradient>
    ${defs}
    ${vignette(`${id}v`)}
    ${grain(`${id}g`, 0.16)}
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${id})" />
  <g opacity="0.55">${shapes}</g>
  ${lattice(width, height, seed, { size: Math.round(height / 3.2), opacity: 0.14 })}
  ${arcade(width, height, seed, { count: Math.max(5, Math.round(width / 240)), opacity: 0.34 })}
  <rect width="${width}" height="${height}" fill="url(#${id}v)" />
  <rect width="${width}" height="${height}" filter="url(#${id}g)" opacity="0.5" />
  ${accentRule ? `<rect x="0" y="${height - 5}" width="${width}" height="5" fill="${C.gold500}" />` : ""}
</svg>
`;
}

/**
 * Gallery tiles. Five compositions cycle so a grid of twelve reads as a set of
 * related images rather than one repeated texture.
 */
function tile({ width, height, seed, variant, from, to }) {
  const id = `t${seed}`;
  const random = rng(seed);
  const { defs, shapes } = blooms(width, height, seed, [
    C.navy400,
    variant % 2 ? C.gold500 : C.navy500,
  ]);

  let motif = "";

  if (variant === 0) {
    // Arcade, seen straight on.
    motif = arcade(width, height, seed, { count: 4, opacity: 0.55 });
  } else if (variant === 1) {
    // Single large star medallion.
    motif = `<g fill="none" stroke="${C.gold300}" stroke-width="2" opacity="0.4">
        <path d="${star(width / 2, height / 2, height * 0.34, height * 0.15, 8, 0)}" />
        <path d="${star(width / 2, height / 2, height * 0.24, height * 0.1, 8, 0.4)}" />
        <circle cx="${width / 2}" cy="${height / 2}" r="${round(height * 0.4)}" />
      </g>`;
  } else if (variant === 2) {
    // Horizontal strata, like a long exposure of a hall.
    const bars = [];
    for (let i = 0; i < 7; i += 1) {
      const y = height * (0.1 + i * 0.12) + random() * 12;
      const h = 6 + random() * 26;
      bars.push(
        `<rect x="0" y="${round(y)}" width="${width}" height="${round(h)}" rx="${round(h / 2)}" opacity="${round(0.05 + random() * 0.1)}" />`,
      );
    }
    motif = `<g fill="#ffffff">${bars.join("")}</g>`;
  } else if (variant === 3) {
    // Dense star lattice.
    motif = lattice(width, height, seed, { size: 96, opacity: 0.3 });
  } else {
    // Concentric arcs.
    const arcs = [];
    for (let i = 1; i <= 6; i += 1) {
      arcs.push(
        `<circle cx="${round(width * 0.2)}" cy="${round(height * 1.05)}" r="${round(i * height * 0.19)}" />`,
      );
    }
    motif = `<g fill="none" stroke="${C.gold300}" stroke-width="1.6" opacity="0.3">${arcs.join("")}</g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
    ${defs}
    ${vignette(`${id}v`)}
    ${grain(`${id}g`, 0.2)}
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${id})" />
  <g opacity="0.6">${shapes}</g>
  ${motif}
  <rect width="${width}" height="${height}" fill="url(#${id}v)" />
  <rect width="${width}" height="${height}" filter="url(#${id}g)" opacity="0.55" />
</svg>
`;
}

/** Grayscale monogram mark for the partner strip. */
function partnerLogo(monogram) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="96" viewBox="0 0 240 96" role="img">
  <rect x="6" y="14" width="68" height="68" rx="14" fill="${C.n200}" />
  <path d="${star(40, 48, 20, 9, 8, 0.39)}" fill="none" stroke="${C.n500}" stroke-width="1.6" opacity="0.9" />
  <text x="40" y="55" font-family="Inter, Helvetica, Arial, sans-serif" font-size="19" font-weight="700"
        fill="${C.n500}" text-anchor="middle">${monogram}</text>
  <rect x="88" y="33" width="128" height="11" rx="5.5" fill="${C.n300}" />
  <rect x="88" y="52" width="88" height="11" rx="5.5" fill="${C.n200}" />
</svg>
`;
}

/** Schematic map block for the venue page. */
function mapPlaceholder() {
  const random = rng(99);
  const roads = [];

  for (let i = 1; i < 8; i += 1) {
    const y = i * 74 + random() * 10;
    roads.push(
      `<line x1="0" y1="${round(y)}" x2="960" y2="${round(y - 26)}" stroke="${C.n300}" stroke-width="${i % 3 === 0 ? 9 : 3}" stroke-linecap="round" />`,
    );
  }
  for (let i = 1; i < 11; i += 1) {
    const x = i * 92 + random() * 10;
    roads.push(
      `<line x1="${round(x)}" y1="0" x2="${round(x - 38)}" y2="540" stroke="${C.n300}" stroke-width="${i % 4 === 0 ? 9 : 3}" stroke-linecap="round" />`,
    );
  }

  const blocks = [];
  for (let i = 0; i < 14; i += 1) {
    const w = 40 + random() * 80;
    const h = 30 + random() * 60;
    blocks.push(
      `<rect x="${round(random() * (960 - w))}" y="${round(random() * (540 - h))}" width="${round(w)}" height="${round(h)}" rx="4" fill="${C.n200}" opacity="0.8" />`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540" role="img">
  <rect width="960" height="540" fill="${C.n100}" />
  <g>${blocks.join("")}</g>
  ${roads.join("")}
  <circle cx="480" cy="270" r="54" fill="${C.navy800}" opacity="0.1" />
  <circle cx="480" cy="270" r="30" fill="${C.navy800}" opacity="0.16" />
  <path d="M480 246 a18 18 0 0 1 18 18 c0 13-18 32-18 32 s-18-19-18-32 a18 18 0 0 1 18-18 z" fill="${C.navy800}" />
  <circle cx="480" cy="264" r="6.5" fill="${C.gold500}" />
</svg>
`;
}

/** Square monogram in the header lockup, beside the localised wordmark. */
function siteMark() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" role="img">
  <defs>
    <linearGradient id="m" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${C.navy700}" />
      <stop offset="100%" stop-color="${C.navy900}" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#m)" />
  <path d="${star(32, 30, 17, 7.5, 8, 0.39)}" fill="none" stroke="${C.gold400}" stroke-width="1.5" opacity="0.75" />
  <path d="${arch(23, 18, 18, 26)}" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linejoin="round" />
  <line x1="18" y1="50" x2="46" y2="50" stroke="${C.gold500}" stroke-width="3.2" stroke-linecap="round" />
</svg>
`;
}

const files = new Map();

files.set(
  "hero.svg",
  banner({
    width: 1680,
    height: 760,
    seed: 11,
    from: C.navy950,
    to: C.navy600,
  }),
);

files.set(
  "page-banner.svg",
  banner({
    width: 1680,
    height: 420,
    seed: 23,
    from: C.navy900,
    to: C.navy500,
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

const conferenceTones = [
  [C.navy950, C.navy600],
  [C.navy900, C.navy500],
  [C.navy950, C.navy700],
  [C.navy800, C.navy500],
  [C.navy900, C.navy600],
  [C.navy950, C.navy500],
];

conferenceSlugs.forEach((slug, index) => {
  const [from, to] = conferenceTones[index];
  files.set(
    `conferences/${slug}.svg`,
    banner({ width: 1680, height: 520, seed: 41 + index * 17, from, to }),
  );
  // Square-ish thumbnail used on the home cards.
  files.set(
    `conferences/${slug}-card.svg`,
    tile({
      width: 800,
      height: 400,
      seed: 300 + index * 23,
      variant: index % 5,
      from,
      to,
    }),
  );
});

for (let i = 1; i <= 12; i += 1) {
  const dark = i % 3 === 0 ? C.navy950 : i % 3 === 1 ? C.navy900 : C.navy800;
  const light = i % 2 === 0 ? C.navy500 : C.navy600;
  files.set(
    `gallery/photo-${String(i).padStart(2, "0")}.svg`,
    tile({
      width: 1200,
      height: 900,
      seed: 101 + i * 19,
      variant: i % 5,
      from: dark,
      to: light,
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
