---
title: "Sitemap Tutorial: Help Search Engines Find Your Important URLs"
description: "A practical XML sitemap tutorial covering what to include, lastmod hygiene, index vs urlset files, and how to generate and submit a sitemap for FreeToolsPro-style sites."
slug: sitemap-tutorial
category: tutorials
date: 2026-06-28
updated: 2026-07-22
tags:
  - sitemap
  - xml
  - indexing
relatedTools:
  - /developer-tools/sitemap-generator
  - /developer-tools/robots-generator
  - /developer-tools/website-seo-audit
---

An XML sitemap is a map of **canonical URLs** you want discovered. It does not guarantee rankings, but it speeds up discovery for new and updated pages—especially on large or sparsely linked sites.

## When you need a sitemap

- You publish many URLs (blog, tools catalog, product pages).
- Internal linking is incomplete for brand-new sections.
- You frequently update content and want fresher crawl signals via `lastmod`.

Small brochure sites can live without one; tool platforms and blogs almost always benefit.

## Anatomy of a simple sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/blog/example-post</loc>
    <lastmod>2026-07-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

Notes:

- **`loc`** must be absolute and canonical (https, preferred host, no tracking params).
- **`lastmod`** should change when content meaningfully updates—not on every deploy.
- **`priority` / `changefreq`** are soft hints; accuracy of URLs matters more.

## What to include (and skip)

**Include:** homepage, category hubs, unique tool pages, blog posts, important legal pages.

**Skip:** duplicates, filtered faceted URLs, session IDs, thank-you pages, soft-404s, and anything `noindex`.

If you exceed ~50,000 URLs, split into multiple sitemaps and add a **sitemap index**.

## Generate and wire it up

1. Build the list with the [Sitemap Generator](/developer-tools/sitemap-generator).
2. Host it at `/sitemap.xml` (or a CDN URL you control).
3. Reference it from [robots.txt](/blog/robots-txt-guide) via the [Robots.txt Generator](/developer-tools/robots-generator).
4. Submit the sitemap in Google Search Console / Bing Webmaster Tools.

## Hygiene checklist

- One canonical host (www vs non-www).
- Trailing-slash policy matches live redirects.
- Remove retired URLs promptly.
- Spot-check with a [Website SEO Audit](/developer-tools/website-seo-audit) after big releases.

Treat the sitemap as living documentation of what deserves to be crawled—not a dumping ground for every URL your CMS can invent.
