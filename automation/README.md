# Automation: Instagram posts and SEO / AEO / GenAI refresh

> Sitemap submission, indexing monitoring, the technical SEO audit, Core Web Vitals and the combined SEO health report are documented in [`SEO-MONITORING.md`](SEO-MONITORING.md).

Two scripts, both run from this project folder:

| Command | What it does |
|---|---|
| `npm run ig:post` | Posts the next tool to Instagram with an AI-written caption |
| `npm run ig:post -- --dry-run` | Shows the tool, image and caption it would post; posts nothing |
| `npm run ig:check` | Checks the Instagram token, the account and today's posting quota |
| `npm run seo:refresh` | Finds underperforming tool pages in Search Console and writes AI proposals to `automation/reports/` (changes nothing) |
| `npm run seo:apply` | Same, and writes the proposals to `src/data/seo-overrides.js` so the next build uses them |
| `npm run seo:revert -- <tool-id>` | Puts a page back to what it had before its last refresh |

## One-time setup

### 1. Settings file

Copy `.env.example` to `.env` in the project root and fill it in as you go through the steps below.

### 2. AI key (captions and SEO copy)

Pick one provider and set `LLM_PROVIDER` to match:

- **anthropic**: API key from console.anthropic.com → `ANTHROPIC_API_KEY`
- **gemini**: API key from aistudio.google.com (has a free tier) → `GEMINI_API_KEY`
- **openai**: API key from platform.openai.com → `OPENAI_API_KEY`

Without a key, `ig:post` still works with a template caption; `seo:refresh` needs one.

### 3. Instagram

1. In the Instagram app, switch **@freetoolsproin26** to a **Professional** account (Business or Creator). The API cannot post from a personal account.
2. On developers.facebook.com, create an app and add the **Instagram** product, set up for **Instagram API with Instagram Login**. A Facebook Page is not needed for this setup.
3. In the app's Instagram API setup, add the account and generate an access token with the `instagram_business_basic` and `instagram_business_content_publish` permissions.
4. Put the token in `.env` as `IG_ACCESS_TOKEN`. Run `npm run ig:check`; it should print `Connected as @freetoolsproin26`.

Tokens last 60 days. The script refreshes the token every 7 days and saves it in `automation/state/ig-token.json`, so it should not expire as long as a post runs at least every few weeks. If it ever does, generate a new one, put it in `.env` and delete `automation/state/ig-token.json`.

While the Meta app is in development mode, only accounts added to the app as testers or admins can be used. Posting to your own account is fine.

### 4. Build and deploy once

Instagram downloads the post image from your live site, so `/ig/<tool-id>.jpg` must be deployed before the first post:

```
npm run build
# deploy dist/ as usual
npm run ig:post -- --dry-run     # should no longer warn that the image is not live
npm run ig:post                  # first real post
```

### 5. Google Search Console (for the SEO refresh)

1. In console.cloud.google.com, create a project and enable **Google Search Console API**.
2. Under **IAM & Admin → Service accounts**, create a service account, open it, go to **Keys → Add key → JSON** and save the file as `automation/state/gsc-key.json`. That folder is git-ignored.
3. In Search Console → **Settings → Users and permissions**, add the service account's email (`...@...iam.gserviceaccount.com`) with **Restricted** permission.
4. Set `GSC_SITE` in `.env`: `sc-domain:freetoolspro.in` for a domain property, or `https://freetoolspro.in/` for a URL-prefix property.

No API access yet? Export **Performance → Pages** from Search Console as CSV and run `npm run seo:refresh -- --csv Pages.csv`. Without the API, the AI does not see the search queries for each page, so the proposals are less targeted.

## How the Instagram posting works

- Every tool has a 1080 × 1350 card at `/ig/<tool-id>.jpg`, generated at build time by `src/pages/ig/[slug].jpg.js` in the same style as the share images.
- Each run posts the tool that has gone longest without a post: never-posted tools first, in the site's priority order (`src/data/priority.js`), then the oldest. With 147 tools and one post a day, a tool comes round about every 5 months.
- Captions rotate through 5 angles (problem → solution, quick tip, did you know, step by step, myth vs fact). The AI also sees the tool's last two captions, so repeat posts don't reuse the same wording.
- A run is skipped if the last post was less than `IG_MIN_HOURS` (20) hours ago, so a double-fired schedule can't double post. `--force` overrides this.
- Post history (tool, date, link, caption) is in `automation/state/ig-posts.json`.
- Instagram captions can't hold clickable links, so captions say "link in bio". Keep the bio link pointing at freetoolspro.in.

## How the SEO / AEO / GenAI refresh works

1. Reads the last 28 days of Search Console data per page.
2. Picks up to `SEO_LIMIT` (5) **tool** pages with at least `SEO_MIN_IMPRESSIONS` (50) impressions where either:
   - the click-through rate is below what the page's position normally earns, or
   - the page is on positions 4–20, close enough to move up.
   Pages changed in the last `SEO_COOLDOWN_DAYS` (45) days are skipped, because Google needs a few weeks to show whether a change worked.
3. For each page, the AI gets the page copy, its method text from `tool-depth.js`, its FAQs and its real top search queries. It writes:
   - **SEO:** a new title (≤ 60 characters, main search phrase first) and meta description (110–158 characters).
   - **AEO:** a quick answer: the main query as a question plus a 30–85 word direct answer. It is shown at the top of the page and goes first in the page's FAQPage JSON-LD, which is what featured snippets and answer engines quote.
   - **GenAI search (GEO):** 2–3 extra FAQs covering queries the page doesn't answer yet. The page also gets a new `dateModified` in its JSON-LD and a new `<lastmod>` in the sitemap, and the new description flows into `llms.txt`, which AI assistants read.
4. Every proposal is checked (length, duplicate titles or descriptions across the site, question format, no repeated FAQs). A proposal that fails the checks gets one retry and is otherwise skipped.
5. The report (`automation/reports/seo-refresh-<date>.md`) shows before and after for each page. From the second month on, it also shows how pages changed earlier have done (CTR and position before vs now). A page that got worse can be reverted with `npm run seo:revert -- <tool-id>`.

`seo:apply` changes only `src/data/seo-overrides.js`. The hand-written copy in `src/data/tools/*.js` is never touched and stays the fallback. After applying:

```
npm run build                    # also runs check:catalog and check:seo
# deploy dist/
npm run indexnow -- /calculators/emi-calculator /image-tools/image-compressor   # the paths the script prints
```

Then ask Google to recrawl those URLs with **URL Inspection → Request indexing** in Search Console.

Read the quick answers before you deploy. The AI is told to use only facts from the page, but money and tax answers are worth a check.

## Scheduling on Windows

The two `.bat` files in this folder run the scripts and log to `automation/state/*.log`. Create the scheduled tasks once, in a Command Prompt:

```
schtasks /Create /TN "FreeToolsPro Instagram post" /SC DAILY /ST 18:30 /TR "\"D:\reactprjct\freetools\freetools-redesign\automation\run-ig-post.bat\""
schtasks /Create /TN "FreeToolsPro SEO refresh" /SC MONTHLY /D 1 /ST 10:00 /TR "\"D:\reactprjct\freetools\freetools-redesign\automation\run-seo-refresh.bat\""
```

- Tasks only run while the PC is on. In Task Scheduler you can tick **Run task as soon as possible after a scheduled start is missed** so a missed post runs when the PC wakes.
- The monthly SEO task only writes proposals. Read the report, then run `npm run seo:apply`, build and deploy. Once you trust the proposals, add `--apply` to `run-seo-refresh.bat`.
- To run on the server instead (so the PC can be off), copy the project there with `.env` and `automation/state/`, and add cron lines:
  ```
  30 13 * * *  cd /path/to/freetools-redesign && node scripts/automation/ig-post.mjs >> automation/state/ig-post.log 2>&1
  0 5 1 * *    cd /path/to/freetools-redesign && node scripts/automation/seo-refresh.mjs >> automation/state/seo-refresh.log 2>&1
  ```
  (13:30 UTC is 19:00 IST.)
