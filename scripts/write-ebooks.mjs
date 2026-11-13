// Builds public/ebooks/*.pdf and public/ebooks/manifest.json.
//
//   node scripts/write-ebooks.mjs              build every book
//   node scripts/write-ebooks.mjs emi-and-home-loans gst-for-small-invoices
//                                              build only these books
//
// Each book is the explanatory part (scripts/ebooks/core) plus its practice
// material (scripts/ebooks/books/<slug>.mjs). Every book must pass the
// editorial check in scripts/ebooks/check.mjs. If any book fails, nothing is
// written for that book and the script exits with an error.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { EBOOKS } from "../src/data/ebooks.js";
import { AUTHOR } from "../src/data/author.js";
import { manuscriptFor } from "./ebooks/manuscript.mjs";
import { renderBook } from "./ebooks/render.mjs";
import { checkBook } from "./ebooks/check.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "ebooks");
const booksDir = join(root, "scripts", "ebooks", "books");
mkdirSync(outDir, { recursive: true });

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const manifestPath = join(outDir, "manifest.json");
const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : [];
const prevBySlug = new Map(previous.map((r) => [r.slug, r]));

const manifest = [];
const failures = [];

for (const book of EBOOKS) {
  if (only.length && !only.includes(book.slug)) {
    if (prevBySlug.has(book.slug)) manifest.push(prevBySlug.get(book.slug));
    continue;
  }
  const file = join(booksDir, `${book.slug}.mjs`);
  if (!existsSync(file)) {
    // TRANSITION: while the books are being rewritten, a book with no material
    // keeps its existing PDF. Remove this branch once all 12 are in place.
    if (existsSync(join(outDir, `${book.slug}.pdf`)) && prevBySlug.has(book.slug)) {
      console.log(`skip ${book.slug} (not rewritten yet, keeping the existing PDF)`);
      manifest.push(prevBySlug.get(book.slug));
      continue;
    }
    failures.push({ slug: book.slug, problems: [`no practice material at scripts/ebooks/books/${book.slug}.mjs`] });
    continue;
  }
  const material = (await import(pathToFileURL(file).href)).default;
  const { chapters, counts } = manuscriptFor(book, material);
  const edition = `Edition of ${material.checked}`;
  const { bytes, pages, overflows } = await renderBook({ book, author: AUTHOR, chapters, edition });
  const result = checkBook({ slug: book.slug, chapters, counts, material, pages, overflows });
  if (!result.ok) {
    // EBOOK_DRAFTS=folder writes failing books there so you can look at them.
    if (process.env.EBOOK_DRAFTS) {
      mkdirSync(process.env.EBOOK_DRAFTS, { recursive: true });
      writeFileSync(join(process.env.EBOOK_DRAFTS, `${book.slug}.pdf`), bytes);
    }
    failures.push(result);
    if (prevBySlug.has(book.slug)) manifest.push(prevBySlug.get(book.slug));
    console.log(`FAIL ${book.slug} (${pages} pages)`);
    continue;
  }
  writeFileSync(join(outDir, `${book.slug}.pdf`), bytes);
  manifest.push({ slug: book.slug, pages, bytes: bytes.length });
  const ex = Object.values(counts.exercises).reduce((a, b) => a + b, 0);
  console.log(`ok   ${String(pages).padStart(3)} pages  ${counts.scenarios} situations, ${counts.problems} problems, ${ex} exercises, ${counts.faqs} FAQs, ${counts.glossary} terms  ${book.slug}`);
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

if (failures.length) {
  console.error(`\n${failures.length} book(s) failed the editorial check:`);
  for (const f of failures) {
    console.error(`\n  ${f.slug}`);
    for (const p of f.problems.slice(0, 25)) console.error(`    - ${p}`);
    if (f.problems.length > 25) console.error(`    ... and ${f.problems.length - 25} more`);
  }
  process.exit(1);
}
console.log(`\nWrote ${manifest.length} books`);
