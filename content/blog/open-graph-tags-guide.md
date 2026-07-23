---
title: "Open Graph Tags: Control How Your Links Look When Shared"
description: "Add og:title, og:description, og:image, and og:url so shares on social platforms look intentional—pair with FreeToolsPro meta and Twitter card tools."
slug: open-graph-tags-guide
category: seo
date: 2026-07-02
updated: 2026-07-22
tags:
  - open-graph
  - social-seo
  - meta-tags
relatedTools:
  - /developer-tools/meta-tag-generator
  - /social-media-tools/twitter-card-generator
  - /image-tools/image-resizer
---

Open Graph (OG) tags are meta tags that platforms like Facebook, LinkedIn, and many messengers use to build link previews. They do not directly rank you in Google, but they influence **click-through** from social—and poor previews waste distribution.

## Essential OG properties

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="Clear benefit-led title" />
<meta property="og:description" content="One or two sentences of context." />
<meta property="og:url" content="https://example.com/page" />
<meta property="og:image" content="https://example.com/images/share.png" />
<meta property="og:site_name" content="Your Brand" />
```

For articles, use `og:type` = `article` and add published/modified times when useful.

## Image guidelines

- Prefer roughly **1200×630** for wide cards.
- Keep important text away from edges.
- Host on HTTPS with a stable URL (avoid expiring signed links).
- Compress without visible mush—see our [image optimization tips](/blog/image-optimization-tips-for-the-web) and the [Image Resizer](/image-tools/image-resizer).

## Alignment with on-page SEO

OG title/description can differ slightly from the HTML `<title>` to fit social tone, but they should not contradict the page. Generate a baseline with the [Meta Tag Generator](/developer-tools/meta-tag-generator), then tune for sharing.

## Debugging previews

Platforms **cache** previews aggressively. After you change tags:

1. Confirm view-source shows the new tags.
2. Use each platform’s sharing debugger to refresh the cache.
3. Test on mobile and desktop.

## Pair with Twitter / X Cards

Twitter/X often falls back to OG tags, but explicit card tags give tighter control:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Clear benefit-led title" />
<meta name="twitter:description" content="One or two sentences of context." />
<meta name="twitter:image" content="https://example.com/images/share.png" />
```

Build both OG and Twitter tags with FreeToolsPro’s [Twitter Card Generator](/social-media-tools/twitter-card-generator) and [Meta Tag Generator](/developer-tools/meta-tag-generator).

Ship share tags on every public template—home, tools, and blog posts—so every share looks like it came from a finished product, not a blank scrape.
