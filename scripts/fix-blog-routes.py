#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VITE = ROOT / "vite.config.js"
SITEMAP = ROOT / "public" / "sitemap.xml"
LASTMOD = "2026-07-26"

NEW = [
    "50-free-ai-tools-developers-2026",
    "best-free-ai-tools-for-developers",
    "chatgpt-prompts-for-programmers",
    "ai-coding-assistants-compared",
    "claude-vs-chatgpt",
    "cursor-ai-guide",
    "gemini-for-developers",
    "best-ai-chrome-extensions",
    "ai-resume-builder-guide",
    "ai-image-generator-comparison",
    "ai-seo-tools",
    "html-color-picker-guide",
    "base64-encoder-vs-decoder-explained",
    "json-formatter-validator-guide",
    "password-generator-best-practices",
    "qr-code-types-explained",
    "image-compressor-without-losing-quality",
    "pdf-merge-vs-compress-guide",
    "merge-pdf",
    "split-pdf",
    "compress-pdf",
    "pdf-password-protection",
    "convert-word-to-pdf",
    "convert-pdf-to-word-online",
    "ocr-pdf-guide",
    "rotate-pdf",
    "pdf-editing",
    "pdf-file-size-tips",
    "javascript-interview-questions-2026",
    "css-flexbox-cheat-sheet",
    "react-roadmap",
    "react-hooks-guide",
    "react-performance",
    "react-project-ideas",
    "react-state-management",
    "react-vs-vue",
    "react-components",
    "react-best-practices",
    "react-interview-questions",
    "nextjs-seo",
    "google-search-console-guide",
    "schema-markup-tutorial",
    "core-web-vitals",
    "robots-txt-guide-2026",
    "xml-sitemap",
    "seo-checklist",
    "image-seo",
    "internal-linking-strategy",
    "ai-seo-geo-aeo",
    "technical-seo-audit",
]


def has_vite_route(text: str, slug: str) -> bool:
    return f'"/blog/{slug}"' in text


def has_sitemap_url(text: str, slug: str) -> bool:
    return f"<loc>https://blog.freetoolspro.in/{slug}</loc>" in text


def main() -> None:
    vite = VITE.read_text(encoding="utf-8")
    sm = SITEMAP.read_text(encoding="utf-8")

    missing_vite = [s for s in NEW if not has_vite_route(vite, s)]
    missing_sm = [s for s in NEW if not has_sitemap_url(sm, s)]
    print("missing vite:", missing_vite)
    print("missing sitemap:", missing_sm)

    if missing_vite:
        marker = '"/blog/git-version-control-guide",'
        additions = "\n".join(f'        "/blog/{s}",' for s in missing_vite)
        if marker not in vite:
            raise SystemExit("vite marker missing")
        vite = vite.replace(marker, marker + "\n" + additions, 1)
        VITE.write_text(vite, encoding="utf-8")
        print(f"added {len(missing_vite)} vite routes")

    if missing_sm:
        entries = []
        for slug in missing_sm:
            entries.append(
                "  <url>\n"
                f"    <loc>https://blog.freetoolspro.in/{slug}</loc>\n"
                f"    <lastmod>{LASTMOD}</lastmod>\n"
                "    <changefreq>monthly</changefreq>\n"
                "    <priority>0.6</priority>\n"
                "  </url>"
            )
        sm = sm.replace("</urlset>", "\n".join(entries) + "\n</urlset>", 1)
        SITEMAP.write_text(sm, encoding="utf-8")
        print(f"added {len(missing_sm)} sitemap urls")


if __name__ == "__main__":
    main()
