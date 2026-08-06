#!/usr/bin/env python3
"""Register India/utility tools in catalog, routes, SEO, home, sitemap, what-it-does."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = json.loads((ROOT / "scripts/_india_tools_manifest.json").read_text(encoding="utf-8"))

# id, component, folder, category, path, name, desc, icon, navLabel, seoKey, seoCategory
KEYWORDS = {
    "epf-checker": ["epf", "provident fund", "pf calculator", "epfo"],
    "gas-supply-distributor": ["lpg", "png", "indane", "bharatgas", "gas distributor"],
    "account-id-link-checker": ["aadhaar", "pan link", "upi", "kyc", "digilocker"],
    "indian-equity-market-indices": ["nifty", "sensex", "stock market", "indices"],
    "gold-silver-price-tracker": ["gold rate", "silver price", "bullion"],
    "pin-code-post-office-finder": ["pincode", "pin code", "post office", "india post"],
    "toll-calculator-india": ["toll", "fastag", "highway toll", "nhai"],
    "government-scheme-finder": ["pm kisan", "government scheme", "yojana"],
    "job-notification-tracker": ["ssc", "upsc", "ibps", "job alert", "exam"],
    "scholarship-finder": ["scholarship", "nsp", "student aid"],
    "electricity-bill-calculator": ["electricity bill", "power bill", "unit calculator"],
    "weather": ["weather", "temperature", "forecast", "open-meteo"],
    "aqi-checker": ["aqi", "air quality", "pollution"],
    "government-holidays": ["holiday", "gazetted", "public holiday india"],
    "festival-calendar": ["festival", "diwali", "holi", "indian calendar"],
    "llm-readiness-checker": ["llm", "geo", "ai readiness", "answer engine"],
}

ICONS_NEEDED = [
    "Coins",
    "MapPin",
    "Car",
    "CloudSun",
    "Wind",
    "PartyPopper",
    "Zap",
    "Briefcase",
]


def def_block(meta: list) -> str:
    tid, _comp, _folder, category, path, name, desc, icon, nav, _seo, _scat = meta
    kws = ", ".join(f'"{k}"' for k in KEYWORDS[tid])
    return f"""
{{
  id: "{tid}",
  path: "{path}",
  name: "{name}",
  desc: "{desc}",
  icon: {icon},
  category: "{category}",
  keywords: [{kws}],
  navLabel: "{nav}",
  title: "{name}",
  showInDesktopNav: true,
  showInMobileNav: true,
}},
"""


def seo_block(meta: list) -> str:
    tid, _c, _f, _cat, path, name, desc, _icon, _nav, seo_key, seo_cat = meta
    kws = ", ".join(KEYWORDS[tid][:6])
    return f"""
  {seo_key}: {{
    title: "{name} | FreeToolsPro",
    description: "{desc}",
    keywords: "{kws}",
    path: "{path}",
    type: "tool",
    category: "{seo_cat}",
  }},
"""


def seo_route_block(meta: list) -> str:
    _tid, _c, _f, _cat, path, name, desc, *_ = meta
    return f'''  "{path}": {{
    title: "{name} | FreeToolsPro",
    description: "{desc}",
  }},
'''


def what_it_does_entry(meta: list) -> str:
    tid, _c, _f, _cat, path, name, desc, *_ = meta
    return f'''  "{path}": {{
    paragraphs: [
      "{name} on FreeToolsPro helps you {desc[0].lower() + desc[1:] if desc else "get a quick answer."} Use the form on this page for a fast estimate or lookup, then verify critical results on official portals when money, identity, or legal deadlines are involved.",
      "We keep the interface lightweight so you can check a number, shortlist a scheme, or plan a trip without creating an account. Sample datasets power several India utilities where live APIs are restricted; calculators use transparent formulas you can recompute yourself.",
    ],
    sections: [
      {{
        title: "How to use this tool",
        paragraphs: [
          "Enter the fields that match your situation—city, units, contribution amount, or search keywords—and read the result panel. Adjust inputs to compare scenarios before you act on a single number.",
          "Copy or note the output you need, then open the linked official site (EPFO, India Post, NSE, CPCB, NSP, and so on) when you need a filing-ready confirmation.",
        ],
      }},
      {{
        title: "What this is not",
        paragraphs: [
          "This page is an educational utility, not a government service, broker terminal, or DISCOM bill. Live rates, eligibility, and holiday dates can change without notice.",
          "For identity linking, bank IFSC, and scheme applications, always complete the final step on the authorised platform that holds your account.",
        ],
      }},
    ],
  }},
'''


def ensure_icons(text: str) -> str:
    # Insert missing icons before closing of lucide import
    m = re.search(r'(Shuffle,\n\} from "lucide-react";)', text)
    if not m:
        m = re.search(r'(\n\} from "lucide-react";)', text)
    if not m:
        raise SystemExit("Could not find lucide import end")
    block = m.group(1)
    adds = []
    for icon in ICONS_NEEDED:
        if re.search(rf"\b{icon}\b", text[: m.start() + 200] if False else text.split('} from "lucide-react"')[0]):
            continue
        # check in import section only
        import_section = text[: m.end()]
        if icon not in import_section:
            adds.append(f"  {icon},")
    if not adds:
        return text
    insert = "\n".join(adds) + "\n"
    # insert before Shuffle, or before closing
    if "Shuffle," in block:
        return text.replace("  Shuffle,\n} from \"lucide-react\";", insert + "  Shuffle,\n} from \"lucide-react\";", 1)
    return text.replace("\n} from \"lucide-react\";", "\n" + insert + "} from \"lucide-react\";", 1)


def patch_tool_definitions():
    path = ROOT / "src/data/toolDefinitions.js"
    text = path.read_text(encoding="utf-8")
    text = ensure_icons(text)

    # Update IFSC naming
    text = text.replace(
        'name: "IFSC Code Finder",\n  desc: "Validate IFSC format and look up common bank branch codes.",',
        'name: "IFSC + Bank Branch Finder",\n  desc: "Validate IFSC format and look up bank branch details for NEFT, RTGS, and IMPS.",',
        1,
    )
    text = text.replace('title: "IFSC Code Finder",', 'title: "IFSC + Bank Branch Finder",', 1)

    # Avoid duplicate insert
    if 'id: "epf-checker"' in text:
        print("toolDefinitions: already has epf-checker, skipping defs insert")
        path.write_text(text, encoding="utf-8")
        return

    trending = [m for m in MANIFEST if m[3] == "trending-tools"]
    others = [m for m in MANIFEST if m[3] != "trending-tools"]

    # Insert trending tools before first trending-tools category entry (word-counter)
    marker = '{\n  id: "word-counter",'
    if marker not in text:
        raise SystemExit("word-counter marker missing")
    trending_block = "/* ---- Recently added India / utility tools (trending) ---- */\n" + "".join(
        def_block(m) for m in trending
    )
    text = text.replace(marker, trending_block + marker, 1)

    # Insert non-trending after IFSC block
    ifsc_end = '  showInMobileNav: true,\n},\n/* ======================================\n   DEVELOPER TOOLS'
    if ifsc_end not in text:
        # try after ifsc regardless of comment
        ifsc_marker = 'id: "ifsc-code-finder"'
        idx = text.find(ifsc_marker)
        if idx < 0:
            raise SystemExit("ifsc marker missing")
        # find closing of that object
        close = text.find("},\n", idx)
        insert_at = close + 3
        other_block = "\n/* ---- New business / calculator / developer tools ---- */\n" + "".join(
            def_block(m) for m in others
        )
        text = text[:insert_at] + other_block + text[insert_at:]
    else:
        other_block = "\n/* ---- New business / calculator / developer tools ---- */\n" + "".join(
            def_block(m) for m in others
        )
        text = text.replace(
            ifsc_end,
            "  showInMobileNav: true,\n}," + other_block + "/* ======================================\n   DEVELOPER TOOLS",
            1,
        )

    path.write_text(text, encoding="utf-8")
    print("patched toolDefinitions.js")


def patch_routes():
    path = ROOT / "src/routes/appRoutes.jsx"
    text = path.read_text(encoding="utf-8")
    if "EpfChecker" in text:
        print("appRoutes: already registered")
        return

    lazy_lines = []
    for meta in MANIFEST:
        tid, component, folder, _cat, route_path, *_ = meta
        lazy_lines.append(
            f'const {component} = lazy(() => import("../tools/{folder}/{component}"));'
        )
    lazy_block = "\n".join(lazy_lines) + "\n"

    # Insert after DocumentationGenerator lazy line or after NumberLines
    anchor = 'const DocumentationGenerator = lazy(() => import("../tools/developer-tools/DocumentationGenerator"));\n'
    if anchor not in text:
        raise SystemExit("lazy anchor missing")
    text = text.replace(anchor, anchor + lazy_block, 1)

    # Insert routes after ifsc route
    route_entries = []
    for meta in MANIFEST:
        _tid, component, _f, _c, route_path, *_ = meta
        route_entries.append(
            f"""  {{
    path: "{route_path}",
    element: (
      <Suspense fallback={{fallback}}>
        <{component} />
      </Suspense>
    ),
  }},"""
        )
    routes_block = "\n".join(route_entries) + "\n"
    ifsc_route = """  {
    path: "/business-tools/ifsc-code-finder",
    element: (
      <Suspense fallback={fallback}>
        <IfscCodeFinder />
      </Suspense>
    ),
  },
"""
    if ifsc_route not in text:
        raise SystemExit("ifsc route block missing")
    text = text.replace(ifsc_route, ifsc_route + routes_block, 1)
    path.write_text(text, encoding="utf-8")
    print("patched appRoutes.jsx")


def patch_seo_config():
    path = ROOT / "src/seo/seoConfig.js"
    text = path.read_text(encoding="utf-8")
    # Update IFSC SEO
    text = text.replace(
        'title: "IFSC Code Finder: Search Bank IFSC Codes",\n    description:\n      "Search sample Indian bank IFSC codes and validate the standard 11-character format.",\n    keywords: "ifsc code finder, bank ifsc search, ifsc validator",',
        'title: "IFSC + Bank Branch Finder: Search Bank IFSC Codes",\n    description:\n      "Search sample Indian bank IFSC codes, validate the 11-character format, and view branch details.",\n    keywords: "ifsc code finder, bank branch finder, ifsc validator, neft rtgs",',
        1,
    )
    if "epfChecker:" in text:
        print("seoConfig: already has epfChecker")
        path.write_text(text, encoding="utf-8")
        return
    block = "".join(seo_block(m) for m in MANIFEST)
    # insert after ifscCodeFinder block
    marker = "  ifscCodeFinder: {"
    idx = text.find(marker)
    if idx < 0:
        raise SystemExit("ifscCodeFinder missing in seoConfig")
    # find end of that object - next "\n  word" after closing
    end = text.find("\n  },\n\n  ", idx)
    if end < 0:
        end = text.find("\n  },\n  ", idx)
    insert_at = end + len("\n  },")
    text = text[:insert_at] + "\n" + block + text[insert_at:]
    path.write_text(text, encoding="utf-8")
    print("patched seoConfig.js")


def patch_seo_routes():
    path = ROOT / "src/components/config/seoRoutes.js"
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        '"/business-tools/ifsc-code-finder": {\n    title: "IFSC Code Finder',
        '"/business-tools/ifsc-code-finder": {\n    title: "IFSC + Bank Branch Finder',
        1,
    )
    if "/business-tools/epf-checker" in text:
        print("seoRoutes: already has epf")
        path.write_text(text, encoding="utf-8")
        return
    # append before final closing };
    block = "".join(seo_route_block(m) for m in MANIFEST)
    text = re.sub(r"\n\};\s*$", "\n" + block + "};\n", text)
    path.write_text(text, encoding="utf-8")
    print("patched seoRoutes.js")


def patch_home():
    path = ROOT / "src/data/homeSections.js"
    text = path.read_text(encoding="utf-8")
    ids = [m[0] for m in MANIFEST]
    # also keep ifsc near top of recently added as enhanced
    new_ids = ids + ["ifsc-code-finder"]
    if "epf-checker" in text:
        print("homeSections: already updated")
        return
    # replace RECENTLY_ADDED_IDS array content by prepending
    m = re.search(r"export const RECENTLY_ADDED_IDS = \[([\s\S]*?)\];", text)
    if not m:
        raise SystemExit("RECENTLY_ADDED_IDS missing")
    existing = re.findall(r'"([^"]+)"', m.group(1))
    merged = []
    for i in new_ids + existing:
        if i not in merged:
            merged.append(i)
    body = ",\n".join(f'  "{i}"' for i in merged)
    text = text[: m.start()] + f"export const RECENTLY_ADDED_IDS = [\n{body},\n];" + text[m.end() :]
    # update trending blurb
    text = text.replace(
        '"trending-tools": "Password, QR, converters, and everyday utilities.",',
        '"trending-tools": "India utilities, weather, markets, holidays, and everyday converters.",',
        1,
    )
    text = text.replace(
        '"business-tools": "GST, salary, invoices, and payroll basics.",',
        '"business-tools": "GST, salary, EPF, IFSC, invoices, and payroll basics.",',
        1,
    )
    path.write_text(text, encoding="utf-8")
    print("patched homeSections.js")


def patch_what_it_does():
    # Append to category files
    by_cat_file = {
        "business-tools": "businessTools.js",
        "trending-tools": "trendingTools.js",
        "calculators": "calculators.js",
        "developer-tools": "developerTools.js",
    }
    grouped: dict[str, list] = {}
    for meta in MANIFEST:
        grouped.setdefault(meta[3], []).append(meta)

    for cat, metas in grouped.items():
        fpath = ROOT / "src/data/toolWhatItDoes" / by_cat_file[cat]
        text = fpath.read_text(encoding="utf-8")
        if metas[0][4] in text:
            print(f"whatItDoes {fpath.name}: skip")
            continue
        # insert before final };
        entries = "".join(what_it_does_entry(m) for m in metas)
        text = re.sub(r"\n\};\s*$", "\n" + entries + "};\n", text)
        fpath.write_text(text, encoding="utf-8")
        print("patched", fpath.name)

    # IFSC what-it-does title touch if present
    biz = ROOT / "src/data/toolWhatItDoes/businessTools.js"
    btext = biz.read_text(encoding="utf-8")
    if "/business-tools/ifsc-code-finder" in btext:
        btext = btext.replace("IFSC Code Finder", "IFSC + Bank Branch Finder")
        biz.write_text(btext, encoding="utf-8")


def patch_ifsc_component():
    path = ROOT / "src/tools/business-tools/IfscCodeFinder.jsx"
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        'title="IFSC Code Finder"',
        'title="IFSC + Bank Branch Finder"',
    )
    text = text.replace(
        'subtitle="Search sample Indian bank IFSC codes and validate the standard 11-character format."',
        'subtitle="Validate IFSC format and look up bank branch details for NEFT, RTGS, and IMPS."',
    )
    path.write_text(text, encoding="utf-8")
    print("patched IfscCodeFinder.jsx")


def patch_sitemap():
    path = ROOT / "public/sitemap.xml"
    text = path.read_text(encoding="utf-8")
    if "epf-checker" in text:
        print("sitemap: already has epf")
        return
    urls = []
    for meta in MANIFEST:
        p = meta[4]
        urls.append(
            f"""  <url>
    <loc>https://freetoolspro.in{p}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>"""
        )
    block = "\n".join(urls) + "\n"
    text = text.replace("</urlset>", block + "</urlset>")
    path.write_text(text, encoding="utf-8")
    print("patched sitemap.xml")


def patch_vite_dynamic_routes():
    path = ROOT / "vite.config.js"
    text = path.read_text(encoding="utf-8")
    if "/business-tools/epf-checker" in text:
        print("vite: already has epf")
        return
    # Find dynamicRoutes array and append paths
    m = re.search(r"dynamicRoutes:\s*\[", text)
    if not m:
        print("vite: no dynamicRoutes, skip")
        return
    insert_paths = ",\n".join(f'        "{meta[4]}"' for meta in MANIFEST)
    # insert after opening bracket
    at = m.end()
    text = text[:at] + "\n" + insert_paths + "," + text[at:]
    path.write_text(text, encoding="utf-8")
    print("patched vite.config.js dynamicRoutes")


def fix_unused_imports():
    # WeatherTool imports useMemo unused
    w = ROOT / "src/tools/trending/WeatherTool.jsx"
    t = w.read_text(encoding="utf-8")
    t = t.replace("import { useMemo, useState } from \"react\";", "import { useState } from \"react\";")
    w.write_text(t, encoding="utf-8")

    # Remove unused selectDark where not used
    for rel in [
        "src/tools/business-tools/EpfChecker.jsx",
        "src/tools/business-tools/AccountIdLinkChecker.jsx",
        "src/tools/trending/IndianEquityMarketIndices.jsx",
        "src/tools/trending/PinCodePostOfficeFinder.jsx",
        "src/tools/trending/JobNotificationTracker.jsx",
        "src/tools/developer-tools/LlmReadinessChecker.jsx",
    ]:
        p = ROOT / rel
        if not p.exists():
            continue
        txt = p.read_text(encoding="utf-8")
        if "selectDark" in txt and "${selectDark}" not in txt and "selectDark}" not in txt.split("from")[0]:
            # check usage in body
            if "selectDark" not in txt.split("ToolHeroShell")[1] if "ToolHeroShell" in txt else True:
                pass
        if "selectDark" in txt and "selectDark}" not in txt.replace("selectDark,", "").replace('{ selectDark }', ''):
            # simpler: if selectDark only appears in import
            body = txt.split("export default", 1)[-1]
            if "selectDark" not in body:
                txt = txt.replace(", selectDark", "").replace("selectDark, ", "")
                p.write_text(txt, encoding="utf-8")


def main():
    patch_tool_definitions()
    patch_routes()
    patch_seo_config()
    patch_seo_routes()
    patch_home()
    patch_what_it_does()
    patch_ifsc_component()
    patch_sitemap()
    patch_vite_dynamic_routes()
    fix_unused_imports()
    print("ALL DONE")


if __name__ == "__main__":
    main()
