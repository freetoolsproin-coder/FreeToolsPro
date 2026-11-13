# What runs automatically

Everything below runs on GitHub Actions from the default branch, `astro-redesign`, so your PC can be off. The details of the SEO jobs are in [`SEO-MONITORING.md`](SEO-MONITORING.md).

| Workflow | When | What it does | Where you see it |
|---|---|---|---|
| **SEO automation**: check | Every push and PR | Builds the site and audits all pages; fails on SEO errors | ✓/✗ on the commit or PR |
| **SEO automation**: daily | 09:15 IST | Validates the sitemap and submits it if it changed (Google + IndexNow), inspects every URL's indexing status, runs the technical audit | The `seo-health` issue and the `seo-reports` artifact |
| **SEO automation**: weekly | Mondays 10:00 IST | Adds keyword and traffic opportunities and Core Web Vitals | Same |
| **SEO automation**: monthly | 1st of the month | AI rewrites titles, descriptions, quick answers and FAQs for underperforming pages | A pull request for you to review |
| **Deploy** | Every push to `astro-redesign` | Build → SEO gate → upload to your server → check the live site → notify Google and IndexNow | Actions tab |
| **Instagram post** | 18:30 IST daily | Posts the next tool with an AI caption | Instagram |
| **Uptime** | Every 15 minutes | Checks 4 key URLs and the SSL certificate; alerts once when down and once when back | Email/SMS/webhook and a `site-down` issue |
| **Dependabot** | Weekly | Package and Actions updates, each checked by the SEO build | Pull requests |

Merging a pull request (an SEO refresh, a Dependabot update or your own change) deploys it automatically. Nothing else changes the live site.

## One-time setup on GitHub

Repository → **Settings → Secrets and variables → Actions → New repository secret**. A job whose secrets are missing is skipped or reports what is missing; nothing breaks.

| Secret | Needed for | Where to get it |
|---|---|---|
| `GSC_KEY_JSON` | SEO jobs, deploy notification | The full text of `automation/state/gsc-key.json` on your PC |
| `GSC_SITE` | optional | `sc-domain:freetoolspro.in` (the default) |
| `PSI_API_KEY` | Core Web Vitals | console.cloud.google.com → enable PageSpeed Insights API → API key |
| `LLM_PROVIDER` and `ANTHROPIC_API_KEY` / `GEMINI_API_KEY` / `OPENAI_API_KEY` | Monthly SEO refresh, Instagram captions | Same values as in your `.env` |
| `IG_ACCESS_TOKEN` | Instagram | The `token` value in `automation/state/ig-token.json` on your PC (or `IG_ACCESS_TOKEN` in `.env`) |
| `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_PATH`, `DEPLOY_PORT` | Deploy | Your server. Create a deploy key pair, put the public key in `~/.ssh/authorized_keys` and the private key in the secret. `DEPLOY_PATH` is the folder nginx serves |
| `ALERT_EMAIL`, `EMAILJS_*`, `ALERT_PHONE`, `TWILIO_*` | Uptime email/SMS | Already used by the old site's uptime check, so they may be set already |
| `SEO_ALERT_WEBHOOK` | optional | Slack / Discord / Google Chat incoming webhook |

Then, under **Settings → Actions → General → Workflow permissions**, choose **Read and write permissions** and tick **Allow GitHub Actions to create and approve pull requests**.

To carry over your Instagram post history, commit `automation/state/ig-posts.json` from your PC as `automation/ig-posts-seed.json`. Without it, the first posts start again from the top of the priority list.

## Turn off the PC tasks

Once the GitHub jobs run, delete the Windows tasks so nothing runs twice:

```
schtasks /Delete /TN "FreeToolsPro Instagram post" /F
schtasks /Delete /TN "FreeToolsPro SEO daily" /F
schtasks /Delete /TN "FreeToolsPro SEO weekly" /F
schtasks /Delete /TN "FreeToolsPro SEO refresh" /F
schtasks /Delete /TN "FreeToolsPro indexing monitor" /F
```

(Errors for tasks you never created are harmless.)

## Running a job by hand

Actions tab → pick the workflow → **Run workflow**. SEO automation offers `daily`, `weekly` and `seo-refresh-pr`. Instagram post can post a specific tool or do a dry run. Uptime can send a test alert.
