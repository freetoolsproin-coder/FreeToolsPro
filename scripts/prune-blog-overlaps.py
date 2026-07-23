"""Prune overlapping same-day blog posts and stagger remaining dates."""
from __future__ import annotations

import pathlib
import re
from datetime import date, timedelta

ROOT = pathlib.Path(__file__).resolve().parents[1]
BLOG = ROOT / "content" / "blog"

# slug -> canonical redirect target slug
DELETE_REDIRECTS = {
    "structured-data-guide": "schema-markup-guide",
    "twitter-cards-guide": "open-graph-tags-guide",
    "page-speed-guide": "core-web-vitals-guide",
    "compress-pdfs-guide": "pdf-convert-and-prepare-tutorial",
    "split-large-pdfs-guide": "pdf-convert-and-prepare-tutorial",
    "password-protect-pdfs-guide": "pdf-convert-and-prepare-tutorial",
    "remove-pdf-password-guide": "pdf-convert-and-prepare-tutorial",
}

# Move PDF how-tos out of programming
CATEGORY_FIXES = {
    "merge-pdf-files-guide": "pdf",
    "convert-pdf-to-word-guide": "pdf",
    "ocr-explained": "pdf",
}

# Stagger remaining same-day flood across June–July (unique dates)
DATE_PLAN = {
    # early / evergreen stack
    "html-basics-for-web-developers": "2026-06-10",
    "css-fundamentals-guide": "2026-06-12",
    "javascript-fundamentals-guide": "2026-06-14",
    "react-beginners-guide": "2026-06-16",
    "nodejs-beginners-guide": "2026-06-18",
    "express-js-guide": "2026-06-20",
    "mongodb-basics-guide": "2026-06-22",
    "git-version-control-guide": "2026-06-24",
    # SEO
    "robots-txt-guide": "2026-06-26",
    "sitemap-tutorial": "2026-06-28",
    "canonical-urls-explained": "2026-06-30",
    "open-graph-tags-guide": "2026-07-02",
    "schema-markup-guide": "2026-07-04",
    "core-web-vitals-guide": "2026-07-06",
    "internal-linking-guide": "2026-07-08",
    "technical-seo-guide": "2026-07-09",
    "keyword-research-guide": "2026-07-10",
    # PDF keepers
    "merge-pdf-files-guide": "2026-07-11",
    "convert-pdf-to-word-guide": "2026-07-12",
    "ocr-explained": "2026-07-13",
    # AI
    "best-ai-prompts": "2026-07-01",
    "prompt-engineering-guide": "2026-07-03",
    "chatgpt-tips": "2026-07-05",
    "ai-for-students": "2026-07-07",
    "ai-for-developers": "2026-07-14",
    "ai-resume-writing": "2026-07-16",
    "ai-email-writing": "2026-07-18",
    "ai-productivity": "2026-07-19",
}

LINK_REPLACEMENTS = [
    ("/blog/structured-data-guide", "/blog/schema-markup-guide"),
    ("/blog/twitter-cards-guide", "/blog/open-graph-tags-guide"),
    ("/blog/page-speed-guide", "/blog/core-web-vitals-guide"),
    ("/blog/compress-pdfs-guide", "/blog/pdf-convert-and-prepare-tutorial"),
    ("/blog/split-large-pdfs-guide", "/blog/pdf-convert-and-prepare-tutorial"),
    ("/blog/password-protect-pdfs-guide", "/blog/pdf-convert-and-prepare-tutorial"),
    ("/blog/remove-pdf-password-guide", "/blog/pdf-convert-and-prepare-tutorial"),
]


def set_frontmatter_field(text: str, key: str, value: str) -> str:
    pattern = rf"(^---\n(?:.*\n)*?){key}:\s*.*"

    def repl(m: re.Match) -> str:
        return f"{m.group(1)}{key}: {value}"

    new, n = re.subn(pattern, repl, text, count=1, flags=re.M)
    if n:
        return new
    # insert after slug/category block if missing
    return re.sub(r"(^---\n)", rf"\1{key}: {value}\n", text, count=1)


def main() -> None:
    # Delete overlaps
    for slug in DELETE_REDIRECTS:
        path = BLOG / f"{slug}.md"
        if path.exists():
            path.unlink()
            print("deleted", slug)

    # Patch remaining posts
    for path in sorted(BLOG.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        slug = path.stem
        original = text

        if slug in CATEGORY_FIXES:
            text = set_frontmatter_field(text, "category", CATEGORY_FIXES[slug])

        if slug in DATE_PLAN:
            text = set_frontmatter_field(text, "date", DATE_PLAN[slug])
            text = set_frontmatter_field(text, "updated", "2026-07-22")

        for old, new in LINK_REPLACEMENTS:
            text = text.replace(old, new)

        # Specific content fixes
        if slug == "schema-markup-guide":
            text = text.replace(
                "## Pair with structured data strategy\n\n"
                "Schema markup is the syntax; [structured data planning](/blog/schema-markup-guide) is the editorial system—what each template claims, who owns updates, and how you avoid conflicting graphs.\n\n"
                "Start with Organization + WebSite + one content type (Article or WebApplication). Expand only when the visible page supports the claim.",
                "## Plan entities before you paste JSON-LD\n\n"
                "Schema markup is the serialization; planning is the system. Inventory brand, tool, and article entities; assign template owners; and validate after every redesign so FAQ graphs and `@id`s do not collide.\n\n"
                "Start with Organization + WebSite + one content type (Article or WebApplication). Expand only when the visible page supports the claim.",
            )
            # if previous replace already collapsed link to self, still try generic ending
            if "structured data planning" in text:
                text = re.sub(
                    r"## Pair with structured data strategy[\s\S]*$",
                    "## Plan entities before you paste JSON-LD\n\n"
                    "Schema markup is the serialization; planning is the system. Inventory brand, tool, and article entities; assign template owners; and validate after every redesign so FAQ graphs and `@id`s do not collide.\n\n"
                    "Start with Organization + WebSite + one content type (Article or WebApplication). Expand only when the visible page supports the claim.\n",
                    text,
                )

        if slug == "core-web-vitals-guide":
            text = text.replace(
                "For a broader speed checklist, continue with our [page speed guide](/blog/core-web-vitals-guide).",
                "Treat this as your speed checklist: measure vitals first, then chase opportunities in the Page Speed Analyzer until the landing pages that already earn traffic feel fast.",
            )
            text = text.replace(
                "For a broader speed checklist, continue with our [page speed guide](/blog/page-speed-guide).",
                "Treat this as your speed checklist: measure vitals first, then chase opportunities in the Page Speed Analyzer until the landing pages that already earn traffic feel fast.",
            )

        if slug == "open-graph-tags-guide":
            if "twitter:card" not in text:
                text = text.replace(
                    "## Pair with Twitter Cards\n\n"
                    "Twitter/X often falls back to OG tags, but explicit Twitter Card tags give tighter control. Build both with FreeToolsPro’s [Twitter Card Generator](/social-media-tools/twitter-card-generator).\n\n"
                    "Ship OG tags on every public template—home, tools, and blog posts—so every share looks like it came from a finished product, not a blank scrape.",
                    "## Pair with Twitter / X Cards\n\n"
                    "Twitter/X often falls back to OG tags, but explicit card tags give tighter control:\n\n"
                    "```html\n"
                    '<meta name="twitter:card" content="summary_large_image" />\n'
                    '<meta name="twitter:title" content="Clear benefit-led title" />\n'
                    '<meta name="twitter:description" content="One or two sentences of context." />\n'
                    '<meta name="twitter:image" content="https://example.com/images/share.png" />\n'
                    "```\n\n"
                    "Build both OG and Twitter tags with FreeToolsPro’s [Twitter Card Generator](/social-media-tools/twitter-card-generator) and [Meta Tag Generator](/developer-tools/meta-tag-generator).\n\n"
                    "Ship share tags on every public template—home, tools, and blog posts—so every share looks like it came from a finished product, not a blank scrape.",
                )

        if slug == "pdf-convert-and-prepare-tutorial":
            if "When portals reject large files" not in text:
                text = text.replace(
                    "## Privacy habits\n",
                    "## When portals reject large files\n\n"
                    "Before you hunt for a separate “compress” or “split” utility, try the workflow you already have:\n\n"
                    "1. Merge only the pages you need (drop blank scans).\n"
                    "2. Convert image-heavy pages to JPG previews when stakeholders only need screenshots.\n"
                    "3. Re-export from the source (Word/Sheets) instead of stacking nested PDF conversions.\n"
                    "4. Keep password-protected originals offline; share unlocked working copies only when policy allows.\n\n"
                    "These steps cover most attachment-limit and packaging issues without a cluster of near-duplicate guides.\n\n"
                    "## Privacy habits\n",
                )

        if slug == "merge-pdf-files-guide":
            text = text.replace(
                "If a portal rejects the file as “too large,” compress or split first (see our [compress](/blog/pdf-convert-and-prepare-tutorial) and [split](/blog/pdf-convert-and-prepare-tutorial) guides).",
                "If a portal rejects the file as “too large,” trim unnecessary pages or re-export lighter sources—see the [PDF convert & prepare tutorial](/blog/pdf-convert-and-prepare-tutorial).",
            )

        if slug == "ocr-explained":
            text = text.replace(
                "After OCR cleanup you may still [compress](/blog/pdf-convert-and-prepare-tutorial), [split](/blog/pdf-convert-and-prepare-tutorial), or [password-protect](/blog/pdf-convert-and-prepare-tutorial) the delivery file.",
                "After OCR cleanup, package the result with the [PDF convert & prepare tutorial](/blog/pdf-convert-and-prepare-tutorial) or [merge PDFs](/blog/merge-pdf-files-guide) when you need a single packet.",
            )

        if slug == "css-fundamentals-guide":
            text = text.replace(
                "For Core Web Vitals context, see our [page speed guide](/blog/core-web-vitals-guide).",
                "For Core Web Vitals context, see our [Core Web Vitals guide](/blog/core-web-vitals-guide).",
            )

        if text != original:
            path.write_text(text, encoding="utf-8")
            print("updated", slug)

    # Write redirect map for BlogRoutes consumption
    out = ROOT / "src" / "data" / "blog" / "slugRedirects.js"
    lines = ["/** Old blog slugs → canonical slug after content consolidation. */", "export const BLOG_SLUG_REDIRECTS = {"]
    for old, new in sorted(DELETE_REDIRECTS.items()):
        lines.append(f'  "{old}": "{new}",')
    lines.append("};")
    lines.append("")
    out.write_text("\n".join(lines), encoding="utf-8")
    print("wrote", out.relative_to(ROOT))

    # Update sitemaps: drop deleted blog URLs
    for sitemap in [ROOT / "public" / "sitemap.xml", ROOT / "sitemap.xml"]:
        if not sitemap.exists():
            continue
        xml = sitemap.read_text(encoding="utf-8")
        for slug in DELETE_REDIRECTS:
            xml = re.sub(
                rf"\s*<url>\s*<loc>https://freetoolspro\.in/blog/{re.escape(slug)}</loc>.*?</url>",
                "",
                xml,
                flags=re.S,
            )
        sitemap.write_text(xml, encoding="utf-8")
        print("sitemap cleaned", sitemap.name)


if __name__ == "__main__":
    main()
