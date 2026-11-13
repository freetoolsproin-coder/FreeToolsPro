# Daily Search Console indexing monitor

`scripts/automation/gsc-index-monitor.mjs` checks every URL in https://freetoolspro.in/sitemap.xml against Google Search Console once a day and tells you which pages are not indexed, why, and what to fix.

**It is read-only.** It never edits the website, its files, its sitemap or robots.txt, and it never submits anything unless you run it with `--submit-sitemap`. All it writes are CSV reports and its own history file.

## What each run does

1. Reads every URL from `/sitemap.xml` and the sitemaps it lists.
2. Inspects each URL with the **Search Console URL Inspection API** and puts it in one category:
   - Indexed
   - Crawled – currently not indexed
   - Discovered – currently not indexed
   - Excluded by noindex
   - Blocked by robots.txt
   - Duplicate without user-selected canonical
   - Server errors
   - Other indexing issues

   Google's exact wording is kept in the `gsc_coverage_state` column. For example, "Duplicate, Google chose different canonical than user", "Page with redirect" and "URL is unknown to Google" all fall under Other.
3. Fetches every page the way a crawler gets it, without running JavaScript, and checks:
   - the HTTP status and any redirect
   - the `X-Robots-Tag` header, meta robots and the canonical tag (is it self-referencing?)
   - your live robots.txt rules for Googlebot
   - the title and meta description: missing, length, or duplicated on another page
   - the number of `<h1>` elements
   - main-content word count: under 300 words counts as thin
   - near-duplicate text: the share of 5-word phrases shared with the most similar page
   - internal links from other pages' main content, and from menus and footers
   - which sitemap file lists the URL, and whether Google lists it under a submitted sitemap
4. Writes a specific fix for every issue, with a priority for each page:
   - **High:** home page, category hubs, popular tools and the top 30 tools.
   - **Medium:** the other tools.
   - **Low:** policy pages.
5. Lists the URLs worth a **manual "Request indexing"** in Search Console. The API cannot request indexing for ordinary pages, so this step stays manual. Google's Indexing API is only for job-posting and livestream pages, so the script does not use it.
6. Compares with the previous day's run: newly indexed URLs, dropped URLs, other status changes, and counts before vs now.

## Reports

Saved in `automation/reports/indexing/`. All files are CSV and open directly in Excel.

| File | Contents |
|---|---|
| `indexing-<date>-summary.csv` | Totals: URLs inspected, indexed and not indexed, each category, coverage %, change vs the previous run, sitemap status in Search Console, sitemap submission result |
| `indexing-<date>.csv` | One row per URL with everything above: Google's verdict, coverage state, last crawl, Google's and your canonical, the live checks, the issues, the fixes and an "Inspect in Search Console" link |
| `indexing-<date>-fixes.csv` | One row per issue and fix, most important pages first |
| `indexing-<date>-manual-requests.csv` | URLs to request indexing for: **Now** (nothing blocks them) or **After fixing content** (thin or near-duplicate pages; requesting these before fixing them rarely helps). Each row has a direct link to the URL Inspection page |
| `indexing-<date>-changes.csv` | URLs whose status changed since the previous run |

Search Console limits manual indexing requests to a small daily quota (often around 10). Work through the manual-requests file from the top: it is sorted by priority.

## Setup

1. **Service account.** If you already set up `automation/state/gsc-key.json` for the SEO refresh (see `automation/README.md`, step 5), skip this step. Otherwise:
   - In console.cloud.google.com, create a project and enable **Google Search Console API**.
   - Create a service account, add a JSON key, and save it as `automation/state/gsc-key.json`.
   - In Search Console → **Settings → Users and permissions**, add the service account's email. **Restricted** is enough for monitoring; **Full** is needed only for `--submit-sitemap`.
2. **`.env`** (in the project root) needs:
   ```
   GSC_KEY_FILE=automation/state/gsc-key.json
   GSC_SITE=sc-domain:freetoolspro.in
   ```
   For a URL-prefix property, use `GSC_SITE=https://freetoolspro.in/`. To check another domain, set `INDEX_SITE_URL` (default `https://freetoolspro.in`).
3. **Test run** on a few URLs: `node scripts/automation/gsc-index-monitor.mjs --limit 10`. A `--limit` run is not saved as history.
4. **Full run:** `node scripts/automation/gsc-index-monitor.mjs`. About 160 URLs take a few minutes. The API allows 2,000 inspections a day per property.

## Sitemap submission (only with your approval)

```
node scripts/automation/gsc-index-monitor.mjs --submit-sitemap
```

This resubmits `https://freetoolspro.in/sitemap.xml` through the Search Console Sitemaps API, then reads the sitemap back to check that Search Console recorded it. The summary says exactly one of:

- **Confirmed**, with Search Console's submission time
- **Sent, but NOT confirmed**
- **Failed**, with the reason

A resubmission is useful after you deploy pages or change `<lastmod>`. The daily schedule does not do it.

## Daily schedule (Windows)

Run once in a Command Prompt:

```
schtasks /Create /TN "FreeToolsPro indexing monitor" /SC DAILY /ST 09:15 /TR "\"D:\reactprjct\freetools\freetools-redesign\automation\run-index-monitor.bat\""
```

The task runs only while the PC is on. In Task Scheduler → the task → **Settings**, tick **Run task as soon as possible after a scheduled start is missed**. Each run's output is logged to `automation/state/index-monitor.log`.

## Reading the categories

| Category | What it usually means | First thing to do |
|---|---|---|
| Crawled – currently not indexed | Google read the page and decided it wasn't worth indexing (yet) | Make the content more useful and distinct from similar pages, add internal links, then request indexing once |
| Discovered – currently not indexed | Google knows the URL but hasn't crawled it | Link to it from the home page or its hub; request indexing; it often clears on its own as the site gains authority |
| Excluded by noindex | The page or its header says noindex | Remove noindex, or remove the URL from the sitemap |
| Blocked by robots.txt | A robots.txt rule stops Googlebot | Change the rule in `src/pages/robots.txt.js` |
| Duplicate without user-selected canonical | Google sees it as a copy and the page has no canonical | Add a self-referencing canonical and make the content distinct |
| Server errors | Google got a 5xx | Check the server logs; request indexing once it answers 200 |

New sites often have many Discovered and Crawled-not-indexed pages for weeks. Watch the trend in the summary and changes files, not a single day.
