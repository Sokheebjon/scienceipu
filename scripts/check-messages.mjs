/**
 * Verifies that every locale message file exposes exactly the same key paths,
 * and that ICU placeholders match per key. Run with `npm run check:messages`.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["uz", "en"];

function flatten(value, prefix = "", out = new Map()) {
  for (const [key, entry] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      flatten(entry, path, out);
    } else {
      out.set(path, String(entry));
    }
  }
  return out;
}

/** Top-level ICU arguments, ignoring plural/select sub-clauses. */
function placeholders(message) {
  const found = new Set();
  let depth = 0;
  let current = "";
  for (const char of message) {
    if (char === "{") {
      depth += 1;
      if (depth === 1) current = "";
      continue;
    }
    if (char === "}") {
      if (depth === 1 && current) {
        found.add(current.split(",")[0].trim());
      }
      depth = Math.max(0, depth - 1);
      continue;
    }
    if (depth === 1) current += char;
  }
  return found;
}

const loaded = new Map(
  locales.map((locale) => [
    locale,
    flatten(
      JSON.parse(readFileSync(join(root, "messages", `${locale}.json`), "utf8")),
    ),
  ]),
);

const [reference, ...others] = locales;
const referenceKeys = loaded.get(reference);
const problems = [];

for (const locale of others) {
  const keys = loaded.get(locale);

  for (const key of referenceKeys.keys()) {
    if (!keys.has(key)) problems.push(`${locale}: missing key "${key}"`);
  }
  for (const key of keys.keys()) {
    if (!referenceKeys.has(key)) problems.push(`${locale}: extra key "${key}"`);
  }
  for (const [key, message] of keys) {
    const expected = referenceKeys.get(key);
    if (expected === undefined) continue;
    const a = placeholders(expected);
    const b = placeholders(message);
    const missing = [...a].filter((name) => !b.has(name));
    const extra = [...b].filter((name) => !a.has(name));
    if (missing.length || extra.length) {
      problems.push(
        `${locale}: placeholder mismatch in "${key}" (missing: ${missing.join(", ") || "-"}, extra: ${extra.join(", ") || "-"})`,
      );
    }
  }
}

if (problems.length) {
  console.error(`Message check failed with ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(
  `Message check passed: ${referenceKeys.size} keys, locales ${locales.join(", ")}`,
);
