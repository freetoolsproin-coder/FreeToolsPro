---
title: "Robots.txt Guide: Control What Search Engines Can Crawl"
description: "Learn how robots.txt works, common Allow/Disallow patterns, sitemap declarations, and mistakes that block your whole site—plus a free robots.txt generator."
slug: robots-txt-guide
category: tutorials
date: 2026-06-26
updated: 2026-07-22
tags:
  - robots.txt
  - crawl
  - technical-seo
relatedTools:
  - /developer-tools/robots-generator
  - /developer-tools/sitemap-generator
  - /developer-tools/website-seo-audit
---

`robots.txt` is a plain text file at the root of your site (`https://example.com/robots.txt`). Crawlers read it first to learn which paths they may fetch. It does **not** securely hide private pages—use authentication for that—but it is essential for crawl budget and keeping staging or utility URLs out of the index pipeline.

## What belongs in robots.txt

A minimal production file often looks like this:

```txt
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

Key ideas:

1. **User-agent** — `*` means all bots; you can target Googlebot separately when needed.
2. **Disallow** — path prefixes the bot should skip (for example `/admin/` or `/api/`).
3. **Allow** — exceptions inside a disallowed tree (useful for specific public assets).
4. **Sitemap** — absolute URL(s) of your XML sitemap(s).

## Practical rules that work

- Disallow **thank-you**, **cart**, **checkout**, and **search-result** URLs when they create infinite parameter combinations.
- Keep **CSS/JS** allowed if you want Google to render pages correctly—blocking `/assets/` wholesale can hurt rendering.
- Prefer `noindex` in HTML or headers for thin pages you still want humans to open; robots.txt alone does not remove URLs already discovered.

## Common mistakes

- `Disallow: /` on production—blocks everything.
- Relative sitemap lines without `https://`.
- Conflicting plugin rules that stack multiple generators.
- Using robots.txt to “hide” confidential PDFs (they can still be linked and crawled if discovered elsewhere).

## Build yours on FreeToolsPro

1. Open the [Robots.txt Generator](/developer-tools/robots-generator).
2. Choose agents and paths you want to allow or block.
3. Add your sitemap URL from the [Sitemap Generator](/developer-tools/sitemap-generator).
4. Deploy the file at `/robots.txt` and re-check with a [Website SEO Audit](/developer-tools/website-seo-audit) mindset.

## After you publish

Fetch the live URL in a browser, then use Search Console’s robots.txt tester (when available) after large template changes. Revisit rules whenever you add admin tools, staging subfolders, or filtered faceted navigation.
