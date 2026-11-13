# SEO, indexing and AEO automation

> Everything that runs automatically (SEO, deploy, Instagram, uptime, dependency updates) and the one-time GitHub setup: [`AUTOMATION.md`](AUTOMATION.md).

Everything here is in `scripts/automation/` and needs no extra npm packages. The daily jobs are **read-only** for the website, with one exception: `sitemap-submit` submits the sitemap to Search Console and IndexNow when it has changed.

## Commands

| Command | What it does | When it runs |
|---|---|---|
| `npm run seo:sitemap` | Validates the live sitemap. If URLs or `<lastmod>` changed, submits `/sitemap.xml` to Search Console, confirms it, and sends the changed URLs to IndexNow | Daily |
| `npm run seo:index` | URL Inspection API for every sitemap URL: indexed or not, why, fixes, manual-request list (see `INDEXING.md`) | Daily |
| `npm run seo:audit` | Technical SEO and AEO audit of the live site | Daily |
| `npm run seo:audit:dist` | Same audit on the built `dist/` folder; exits with an error if anything is broken. Run it before deploying | Before each deploy (and on every push in GitHub Actions) |
| `npm run seo:perf` | Traffic and keyword opportunities from Search Console: striking-distance queries, low CTR, declining pages, cannibalisation, content gaps, rank tracking | Weekly |
| `npm run seo:cwv` | Core Web Vitals and Lighthouse scores via PageSpeed Insights | Weekly |
| `npm run seo:report` | Combines everything into `automation/reports/seo-health-latest.html` | After each job |
| `npm run seo:daily` | sitemap → index → audit → report, in that order | Manually |

Open **`automation/reports/seo-health-latest.html`** in a browser. It starts with what needs attention, then shows indexing, fixes, sitemap status, audit issues, internal-link suggestions and Core Web Vitals.

## Where each requirement is handled

**Google indexing automation**

| Requirement | Where |
|---|---|
| Generate and update XML sitemaps | `src/pages/sitemap*.xml.js` and `src/lib/sitemap.js`, rebuilt from the catalog on every build. Tool `<lastmod>` follows the page's own update date |
| Submit the sitemap through Search Console | `sitemap-submit.mjs`, automatically when the sitemap changes |
| Monitor indexed and non-indexed URLs | `gsc-index-monitor.mjs` |
| Detect crawling and indexing errors | `gsc-index-monitor.mjs` (Google's view) and `seo-audit.mjs` (crawler's view) |
| Track URL Inspection API results | `gsc-index-monitor.mjs`, with day-to-day history in `automation/state/indexing/` |
| Indexing issue report | `indexing-<date>-*.csv` and the combined HTML report |

**Automated SEO for all pages.** All of this is generated in `src/layouts/Base.astro`, so every page gets it; `seo-audit` checks it on every page.

| Requirement | Where |
|---|---|
| Unique titles and descriptions | Per-page props; `seo-refresh.mjs` improves weak ones; audit flags duplicates and lengths |
| Canonical URLs and robots directives | `Base.astro`: self-canonical and `index, follow, max-snippet:-1, max-image-preview:large`; noindex for 404 |
| Open Graph and Twitter Card | `Base.astro` plus a 1200×630 image per page (`/og/<id>.png`) |
| Image alt and image metadata | Audit checks alt text, file-name alt text, width/height and lazy loading; OG images have size and alt tags |
| Internal linking recommendations | `seo-audit-<date>-link-suggestions.csv`: pages with fewer than 3 contextual links, and which pages should link to them, with suggested anchor text |
| Breadcrumbs and structured data | Visible breadcrumbs (`Crumbs.jsx`) and BreadcrumbList JSON-LD on every inner page |

**AEO and AI search optimization**

| Requirement | Where |
|---|---|
| Question-based content, direct answers, FAQs | Tool pages have a quick answer and FAQs (`tool-depth.js`, `seo-overrides.js`). Audit flags pages without an FAQ, question-style headings or a short opening answer |
| Organization, WebSite, BreadcrumbList schema | `src/lib/schema.js`, home page, tool page `@graph` |
| SoftwareApplication schema | Tool pages use `WebApplication` (a SoftwareApplication subtype) with category, OS and a free offer. Star ratings need real `aggregateRating`/`review` data, so they are not added |
| Content for AI assistants | `/llms.txt` and `/llms-full.txt`, robots.txt allows AI search bots, IndexNow feeds Bing (ChatGPT search and Copilot use it) |

**Growing organic traffic (`gsc-performance.mjs`, weekly)**

| What it finds | What to do |
|---|---|
| Striking distance: queries on positions 8–20 with real impressions | Use the query in the title or an H2, answer it in an FAQ, and add 2–3 internal links with it as anchor text. This is usually the quickest traffic win |
| Low CTR on page 1 | Rewrite the title and description (`npm run seo:refresh`, or the monthly PR on GitHub) |
| Declining pages, with the queries that lost clicks | Refresh the content, check whether a competitor or an AI overview took the query, and check indexing |
| Cannibalisation: several of your pages competing for one query | Pick one page for the query, and point the others to it |
| Content gaps: demand with no matching tool | Ideas for new tools, sections and FAQs, in order of impressions |
| Rank tracking | Position history for your top 200 queries, with the biggest moves |

**Continuous technical monitoring (`seo-audit.mjs`, `cwv-monitor.mjs`)**

| Requirement | Check |
|---|---|
| Broken links | Every internal link, image and share image; external links with `--external` |
| Missing metadata | Title, description, canonical, lang, viewport, H1, Open Graph, Twitter, JSON-LD required properties |
| Duplicate titles and descriptions | Across all sitemap pages |
| HTTP status and redirects | Non-200 sitemap URLs, redirect chains and loops, links to redirected URLs, soft 404s |
| Mobile performance and Core Web Vitals | Real-user LCP, INP and CLS (Chrome UX Report) plus Lighthouse lab scores, mobile and desktop, with regression flags |
| Sitemap and robots.txt validation | XML, namespace, absolute https URLs, `<lastmod>` format, limits, duplicates, Sitemap line, no sitemap URL blocked, AI search bots allowed |

Two things to know about Google today: FAQ rich results only show for government and health sites, and HowTo rich results are retired. The FAQ and HowTo schema still help Google and AI assistants understand the page, so they stay.

## Setup

1. **Search Console key.** If `automation/state/gsc-key.json` already exists (from the SEO refresh or the index monitor), skip this step. Otherwise follow step 5 in `automation/README.md`. To let `seo:sitemap` submit, give the service account **Full** permission in Search Console → Settings → Users and permissions. With Restricted it still validates and reports, but can't submit.
2. **PageSpeed Insights key** (free): console.cloud.google.com → APIs & Services → enable **PageSpeed Insights API** → Credentials → Create API key. Put it in `.env` as `PSI_API_KEY`.
3. Add the new settings from `.env.example` to your `.env` (`INDEXNOW_KEY`, `PSI_API_KEY`, and optionally `SEO_ALERT_WEBHOOK`).
4. Test:
   ```
   npm run seo:sitemap -- --dry-run
   npm run seo:audit -- --limit 20
   npm run seo:cwv -- --mobile-only --pages / /calculators/emi-calculator
   npm run seo:report
   ```

## Scheduling

**Windows (PC on).** Run once in a Command Prompt. The daily task replaces the separate index-monitor task; if you created that earlier, delete it first with `schtasks /Delete /TN "FreeToolsPro indexing monitor" /F`.

```
schtasks /Create /TN "FreeToolsPro SEO daily" /SC DAILY /ST 09:15 /TR "\"D:\reactprjct\freetools\freetools-redesign\automation\run-seo-daily.bat\""
schtasks /Create /TN "FreeToolsPro SEO weekly" /SC WEEKLY /D MON /ST 10:00 /TR "\"D:\reactprjct\freetools\freetools-redesign\automation\run-cwv-weekly.bat\""
```

In Task Scheduler, tick **Run task as soon as possible after a scheduled start is missed** for both tasks.

**GitHub Actions (PC off).** Two workflows are in `automation/github/`. Copy them to `.github/workflows/`:

- `seo-automation.yml` runs everything above on a schedule. It keeps one GitHub issue labelled **seo-health** updated with what needs attention, and closes it when everything is fine. Every run attaches the full reports (open `seo-health-latest.html`). On the 1st of each month it runs the AI SEO refresh and opens a **pull request** with the new titles, descriptions, quick answers and FAQs for you to review. On every push it builds the site and fails if the SEO audit finds errors.
- `deploy.yml` (optional) replaces uploading `dist/` by hand. On every push to `main` it builds, blocks the deploy if the SEO audit fails, uploads to your server over SSH, checks the live pages answer 200, and then submits the sitemap and changed URLs to Google and IndexNow.

Setup on GitHub: add the secrets listed at the top of each file under Settings → Secrets and variables → Actions. Then, under Settings → Actions → General → Workflow permissions, choose **Read and write** and tick **Allow GitHub Actions to create and approve pull requests**.

`astro-redesign` is the repository's default branch, so the schedules, the monthly PR and the deploy workflow are active. Delete the Windows tasks (commands in `AUTOMATION.md`) so nothing runs twice.

**Before each deploy:** `npm run build && npm run seo:audit:dist`. After deploying, `npm run seo:sitemap` submits the changes right away instead of waiting for the next daily run.

## Reports and history

| Location | Contents |
|---|---|
| `automation/reports/seo-health-latest.html` | Combined dashboard (also saved per date) |
| `automation/reports/indexing/` | Index monitor CSVs and `sitemap-<date>.csv` |
| `automation/reports/audit/` | `seo-audit-<date>-issues.csv` (each with a fix, and new/existing compared with the previous run), `-pages.csv`, `-broken-links.csv`, `-link-suggestions.csv` |
| `automation/reports/cwv/` | `cwv-<date>.csv` |
| `automation/state/` | History used for comparisons (git-ignored) |

Issues that come from a shared template, such as a footer link on every page, are reported once with the page count, not once per page.
