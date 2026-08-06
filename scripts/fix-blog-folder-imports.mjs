import fs from "fs";
import path from "path";

function patch(file, replacers) {
  if (!fs.existsSync(file)) {
    console.log("missing", file);
    return;
  }
  let t = fs.readFileSync(file, "utf8");
  const before = t;
  for (const [a, b] of replacers) t = t.split(a).join(b);
  if (t !== before) {
    fs.writeFileSync(file, t);
    console.log("patched", file);
  } else {
    console.log("unchanged", file);
  }
}

const pageFiles = fs
  .readdirSync("blog/pages")
  .filter((f) => f.endsWith(".jsx"))
  .map((f) => path.join("blog/pages", f));

for (const f of pageFiles) {
  patch(f, [
    ['from "../../components/blog/', 'from "../components/'],
    ['from "../../data/blog/', 'from "../data/'],
    ['from "../../seo/blogSchema"', 'from "../seo/blogSchema"'],
  ]);
}

const compFiles = fs
  .readdirSync("blog/components")
  .filter((f) => f.endsWith(".jsx"))
  .map((f) => path.join("blog/components", f));

for (const f of compFiles) {
  patch(f, [['from "../../data/blog/', 'from "../data/']]);
}

patch("blog/seo/blogSchema.js", [
  ['from "./brand"', 'from "../../src/seo/brand"'],
  ['from "../data/blog/blogSite"', 'from "../data/blogSite"'],
]);

patch("blog/data/loadPosts.js", [
  ['import.meta.glob("../../../blog/*.md"', 'import.meta.glob("../content/*.md"'],
]);

patch("blog/data/blogSite.js", [
  [
    "markdown articles live in repo /blog/*.md",
    "markdown articles live in repo /blog/content/*.md",
  ],
]);

patch("src/App.jsx", [
  ['from "./data/blog/blogSite"', 'from "../blog/data/blogSite"'],
  ['from "./pages/blog/BlogRoutes"', 'from "../blog/pages/BlogRoutes"'],
]);

patch("src/routes/appRoutes.jsx", [
  ['from "../pages/blog/BlogApexEntry"', 'from "../../blog/pages/BlogApexEntry"'],
]);

patch("src/components/Header.jsx", [
  ['from "../data/blog/blogSite"', 'from "../../blog/data/blogSite"'],
]);

patch("src/components/Footer.jsx", [
  ['from "../data/blog/blogSite"', 'from "../../blog/data/blogSite"'],
]);

patch("src/pages/Home.jsx", [
  ['from "../data/blog/blogSite"', 'from "../../blog/data/blogSite"'],
]);

patch("package.json", [
  [
    '"generate:blog-static": "node scripts/generate-blog-static.mjs"',
    '"generate:blog-static": "node blog/scripts/generate-blog-static.mjs"',
  ],
]);

// Fix generate script paths: lives in blog/scripts, content in blog/content, output in blog/
{
  const f = "blog/scripts/generate-blog-static.mjs";
  let t = fs.readFileSync(f, "utf8");
  t = t
    .replace(
      /Usage: node scripts\/generate-blog-static\.mjs/,
      "Usage: node blog/scripts/generate-blog-static.mjs"
    )
    .replace(
      /Output: blog-static\/articles\/index\.html \(\+ blog-static\/index\.html redirect\)/,
      "Output: blog/articles/index.html (+ blog/index.html redirect)"
    )
    .replace(
      /const ROOT = path\.resolve\(__dirname, "\.\."\);/,
      'const ROOT = path.resolve(__dirname, "../..");'
    )
    .replace(
      /const BLOG_DIR = path\.join\(ROOT, "blog"\);/,
      'const BLOG_DIR = path.join(ROOT, "blog", "content");'
    )
    .replace(
      /const OUT_DIR = path\.join\(ROOT, "blog-static"\);/,
      'const OUT_DIR = path.join(ROOT, "blog");'
    )
    .replace(
      /Wrote \$\{posts\.length\} articles → blog-static\/articles\/index\.html/,
      "Wrote ${posts.length} articles → blog/articles/index.html"
    )
    .replace(
      /Deploy the blog-static\/ folder to blog\.freetoolspro\.in document root\./,
      "Deploy blog/index.html + blog/articles/ (and optionally keep content/ off the public root)."
    );
  fs.writeFileSync(f, t);
  console.log("patched", f);
}

// Other blog content scripts that still point at blog/*.md
for (const rel of [
  "scripts/expand-blog-articles.mjs",
  "scripts/generate-blog-articles.py",
  "scripts/humanize-blog-articles.py",
  "scripts/prune-blog-overlaps.py",
]) {
  if (!fs.existsSync(rel)) continue;
  patch(rel, [
    ['ROOT / "blog"', 'ROOT / "blog" / "content"'],
    ['path.join(ROOT, "blog")', 'path.join(ROOT, "blog", "content")'],
    ["blog/*.md", "blog/content/*.md"],
    ["`blog/`", "`blog/content/`"],
  ]);
}

console.log("done");
