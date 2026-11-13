# FreeToolsPro 2.0

A rebuild of freetoolspro.in as a static Astro site with React islands: a curated catalogue of tools, one page per tool, and JavaScript loaded only for the tool on that page.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # checks the catalog, builds dist/, writes redirect files
npm run check:seo  # every sitemap URL as raw HTML: title, description, canonical, robots, H1, JSON-LD
npm run check:seo -- https://freetoolspro.in   # same check against the live site
npm start          # serves dist/ with real 301s (node server.mjs)
```

Node 18.20+ (Node 20 or 22 recommended).

## What's where

| Path | What it holds |
|---|---|
| `src/data/tools/*.js` | The catalog: URL, title, meta description, intro and FAQs for every tool |
| `src/data/categories.js` | The 14 category hubs |
| `src/data/hub-content.js` | Guide copy and FAQs shown under each hub's tool grid (also FAQPage JSON-LD). Links use `[label](/path)` and are checked by `check:catalog` |
| `src/data/tool-depth.js` | Per-tool "How it works / How it's calculated", formula, limitations and official sources (rendered on every tool page) |
| `src/lib/worked-example.js` | Runs a calculator's own `compute()` at build time to produce the worked example on its page and the hubs' Quick answers |
| `src/lib/schema.js` | Shared JSON-LD: Organization (with founder), Person, WebPage/AboutPage/ContactPage, BreadcrumbList |
| `src/data/redirects.js` | 301 map for the ~340 retired URLs (closest tool, otherwise category hub) |
| `src/data/legacy-paths.js` | Every route from the old `appRoutes.jsx` |
| `src/tools/` | Tool logic: `calcs.js` (calculators), `texts.js` (text/dev/encoding), `builders.js` (CSS/SEO generators), image and PDF options |
| `src/tools/latex/` | LaTeX tools: `engine.js` (MathJax, loaded lazily), `document.js` and `pdf.js` (the PDF compiler), `docx.js` (MathML to Office Math), `ocr.js` (image to LaTeX), plus symbols, formulas and templates |
| `src/components/islands/` | The interactive React parts, one per engine |
| `src/components/static/` | Header, footer, tool page article, home, hubs, policy pages: rendered to HTML at build time with no JavaScript |
| `src/styles/global.css` | The whole design system (light and dark), served as one cached stylesheet |
| `src/pages/` | Routes, sitemaps, `robots.txt`, `llms.txt` |
| `src/pages/ig/` | 1080 × 1350 Instagram post images, one per tool (`/ig/<id>.jpg`) |
| `src/data/seo-overrides.js` | AI-refreshed titles, descriptions, quick answers and extra FAQs, merged over `tools/*.js` |
| `scripts/automation/` | Instagram auto-posting and the Search Console–driven SEO refresh (see `automation/README.md`) |

## SEO decisions

- **Same URLs.** The original 100 tools keep their old paths (`/calculators/emi-calculator`, no trailing slash), so existing rankings carry over.
- **301s for everything else.** `npm run build` writes `dist/_redirects` (Netlify, Cloudflare Pages), `dist/vercel.json` and `dist/redirects.json` (used by `server.mjs`). Astro also writes meta-refresh fallback pages for hosts that ignore those files. Old programmatic variant pages (`/calculators/emi-calculator/<anything>`) redirect to their parent tool.
- **Titles:** `Base.astro` adds ` | FreeToolsPro` only when the full title stays within 60 characters; longer titles go out without the suffix so Google does not truncate the keywords.
- **Per page:** unique title and description, canonical, Open Graph and Twitter tags, `WebApplication` + `BreadcrumbList` + `FAQPage` JSON-LD, and visible FAQ and how-to text that matches the markup.
- **Hubs and internal links:** 14 category hubs, a searchable `/tools` index, and 6 related-tool links on every tool page, rotated so every tool gets inbound links.
- **Sitemaps:** `/sitemap.xml` stays the index (same URL as before) and points to `sitemap-tools.xml`, `sitemap-categories.xml` and `sitemap-pages.xml`.
- **Speed:** pages are static HTML with one shared, cached stylesheet (`global.css`, built to `/_astro/*.css`). Heavy libraries (pdf-lib, pdf.js, MathJax, js-yaml, sql-formatter, marked, qrcode) load only when the tool needs them.

## Adding or replacing a tool

1. Add an entry to the right file in `src/data/tools/` (keep the old URL if it had one).
2. Implement it in the engine named by `engine` (for example a new key in `src/tools/calcs.js`).
3. If it replaces a tool, the old one's URL is automatically redirected if it is listed in `legacy-paths.js`; add a specific target in `CLOSEST` in `redirects.js`.
4. `npm run check:catalog` fails the build if the catalog goes over `MAX_TOOLS` (150), a tool has no implementation, or a redirect points nowhere or chains.

## Before you deploy

- **One URL per page (nginx):** `deploy/nginx.conf` is the complete site config. It 301s `www`, `http`, `.html`, `/index.html` and trailing-slash spellings to the one canonical URL, applies `dist/nginx-redirects.conf`, and returns real 404s. Without it Google sees duplicates and reports "Duplicate, Google chose different canonical than user". After each deploy run `npm run check:live`.

- **Blog:** the site has no blog. The old one and its two blog tools were deleted; `/blog`, `/blog/*`, `/images/blog/*` and the old blog sitemaps answer **410 Gone** (`GONE` in `src/data/redirects.js`) so Google drops them. Remove the DNS record for `blog.freetoolspro.in` so that subdomain stops resolving.
- **Old hub URLs:** if your old `CATEGORY_HUBS` used paths other than the new hubs (`/finance-calculators`, `/tax-salary-tools`, `/everyday-calculators`, `/text-tools`, `/developer-tools`, `/encoding-tools`, `/image-tools`, `/pdf-tools`, `/seo-design-tools`, `/seo-tools`, `/writing-tools`, `/creator-tools`, `/student-tools`), add them to `CLOSEST` in `src/data/redirects.js`.
- **Policy pages** in `src/components/static/Legal.jsx` are a reasonable starting point, not legal advice.
- **Tax and rates** are FY 2026-27 values (slabs unchanged by Budget 2026, PPF 7.1%, EPF 8.25%, GST 5/18/40%). Update `SITE.updated` in `src/data/site.js` when you review them.
- After launch, resubmit `https://freetoolspro.in/sitemap.xml` in Search Console and watch the Coverage report for redirected URLs.
