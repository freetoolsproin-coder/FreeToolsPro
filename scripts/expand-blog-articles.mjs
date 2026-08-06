/**
 * Expand every blog/content/*.md body to 600–900 words while keeping frontmatter.
 * node scripts/expand-blog-articles.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BLOG = path.join(ROOT, "blog", "content");
const MIN = 600;
const MAX = 900;
const TARGET = 750;

function parseFile(raw) {
  const text = String(raw || "").replace(/^\uFEFF/, "");
  if (!text.startsWith("---")) {
    return { fm: "", data: {}, body: text.trim() };
  }
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { fm: "", data: {}, body: text.trim() };
  const fmBlock = text.slice(3, end).trim();
  const body = text.slice(end + 4).replace(/^\r?\n/, "").trim();
  const data = {};
  for (const line of fmBlock.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    data[key] = val;
  }
  // collect related tools from indented list under relatedTools:
  const related = [];
  let inRelated = false;
  for (const line of fmBlock.split(/\r?\n/)) {
    if (/^relatedTools:\s*$/.test(line)) {
      inRelated = true;
      continue;
    }
    if (inRelated) {
      const rm = line.match(/^\s*-\s+(\S+)/);
      if (rm) related.push(rm[1]);
      else if (/^[A-Za-z]/.test(line)) inRelated = false;
    }
  }
  data.relatedTools = related;
  return { fm: text.slice(0, end + 4), data, body };
}

function wordCount(text) {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function toolLinks(related = []) {
  if (!related.length) {
    return "Browse the full FreeToolsPro catalog from the [tools directory](/tools) when you need a calculator, formatter, or converter.";
  }
  const links = related.slice(0, 4).map((p) => {
    const label = p
      .split("/")
      .pop()
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return `[${label}](${p})`;
  });
  if (links.length === 1) return `Start with ${links[0]} on FreeToolsPro.`;
  const last = links.pop();
  return `Useful FreeToolsPro pages for this topic: ${links.join(", ")}, and ${last}.`;
}

function categoryExtras(category, title, slug) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("pdf")) {
    return `
## A practical PDF workflow

1. **Inspect first** — open the file and note page count, orientation, and whether text is selectable.
2. **Fix structure** — rotate, split, or merge before you compress, so you are not baking in the wrong pages.
3. **Optimize delivery** — compress or re-export only after the content is correct.
4. **Verify** — spot-check the first page, a middle page, and the last page on phone and desktop.

Phone scans are the usual culprit for sideways pages, huge file sizes, and unsearchable text. Fix orientation and OCR needs early. If you only need a few pages from a binder scan, split those pages out before you email the whole packet.

When portals reject uploads, ask whether the limit is file size, page count, or file type. The fix differs for each case. A 40 MB scan often shrinks dramatically after cleaning blank pages and exporting at a saner DPI—see related notes in [PDF File Size Tips](/blog/pdf-file-size-tips) and [Compress PDF](/blog/compress-pdf).
`.trim();
  }
  if (cat.includes("seo") || slug.includes("seo") || slug.includes("sitemap") || slug.includes("robots") || slug.includes("schema") || slug.includes("canonical") || slug.includes("hreflang") || slug.includes("linking") || slug.includes("vitals") || slug.includes("search-console")) {
    return `
## How to apply this without boiling the ocean

Pick one template (homepage, category, product, or article) and ship a complete pass:

1. Confirm the **primary URL** and title/description match search intent.
2. Fix **indexability** (robots, canonical, sitemap inclusion).
3. Improve **on-page clarity** (one H1, descriptive H2s, internal links to supporting pages).
4. Measure with Search Console or a crawl—not screenshots alone.

SEO work compounds when you document decisions. Keep a short note of what you changed and why. Revisit after indexing cycles instead of tweaking daily. Pair technical fixes with content that answers the query; markup and sitemaps cannot rescue a page with nothing useful to say.

If you are also experimenting with answer-engine visibility, keep claims factual and cite primary sources. Structured data should reflect visible content—never invent FAQs or ratings that users cannot see.
`.trim();
  }
  if (cat.includes("javascript") || cat.includes("programming") || slug.startsWith("react") || slug.startsWith("javascript") || slug.includes("nodejs") || slug.includes("express") || slug.includes("mongodb") || slug.includes("git") || slug.includes("css") || slug.includes("html")) {
    return `
## Practice loop that sticks

Reading alone rarely locks in mental models. Use a tight loop:

1. **Predict** what a tiny snippet will print or render.
2. **Run** it in the browser console, Node, or a playground.
3. **Change one variable** and predict again.
4. **Write one sentence** explaining the surprise in your own words.

For interviews, prefer explaining trade-offs over reciting trivia. Interviewers listen for whether you know when a pattern helps and when it hurts. Keep a personal gist of examples—event loop order, closure traps, React dependency arrays, CSS specificity fights—and rehearse them out loud once a week.

When debugging production issues, reproduce with the smallest fixture you can. Format payloads with a [JSON Formatter](/developer-tools/json-formatter), isolate regex with a [Regex Tester](/developer-tools/regex-tester), and only then reach for heavier tooling.
`.trim();
  }
  if (cat.includes("ai") || slug.includes("ai") || slug.includes("chatgpt") || slug.includes("claude") || slug.includes("gemini") || slug.includes("prompt") || slug.includes("cursor")) {
    return `
## Using AI without losing the plot

Treat model output like a junior teammate: fast, often useful, occasionally confidently wrong.

- **Scope the job** — outline, draft, critique, or rewrite—not all four in one prompt.
- **Paste constraints** — audience, tone, length, forbidden claims, and the source text when you have it.
- **Verify** anything legal, medical, financial, or citation-heavy against primary sources.
- **Keep secrets out** of public chats; redact tokens, customer data, and private keys.

Save prompts that worked. Small libraries beat one mega-prompt you forget how to steer. When a draft feels robotic, tighten structure first, then run a light polish pass—human editing still wins for voice. FreeToolsPro helpers like the [AI Prompt Optimizer](/social-media-tools/ai-prompt-optimizer) are useful for reshaping rough instructions before you paste them into a model.
`.trim();
  }
  if (cat.includes("image")) {
    return `
## Image workflow that protects quality and speed

1. Crop and straighten before heavy compression.
2. Choose dimensions for the layout slot—not the original camera resolution.
3. Compress with a visual check at 1x and 2x DPR if you serve retina assets.
4. Write alt text that describes function and content, not “image123”.

Huge hero images quietly ruin Core Web Vitals. Prefer modern formats when your stack supports them, lazy-load below-the-fold media, and keep decorative images out of the LCP candidate set. For quick compression experiments, FreeToolsPro image tools pair well with a hard refresh test on a mid-range phone.
`.trim();
  }
  return `
## Make the advice actionable this week

Skim once for orientation, then pick a single outcome: finish a checklist, ship a fix, or draft a reusable template. Time-box forty-five minutes. Write down what “done” looks like before you open tools.

Break the work into visible steps—input, transform, verify—so you can stop mid-way without losing context. If a step needs a FreeToolsPro utility, open it in a second tab and paste results back into your notes. Momentum beats perfection on the first pass; schedule a short review later for polish.
`.trim();
}

function buildExpansion(data, body) {
  const title = data.title || data.slug || "this topic";
  const category = data.category || "guides";
  const slug = data.slug || "";
  const related = data.relatedTools || [];
  const toolsBlurb = toolLinks(related);

  const blocks = [
    `## Why ${title.replace(/:/g, "—")} still matters

Most people do not need another abstract definition. They need a repeatable way to get a correct result under time pressure. This guide keeps the focus on decisions you can make today: what to check first, what to ignore, and which FreeToolsPro utilities shorten the path.

If you arrived from a search snippet, skim the headings, then follow the workflow section in order. Jumping to the last tip without fixing fundamentals is how small mistakes stack into frustrating rework.`,

    categoryExtras(category, title, slug),

    `## Step-by-step approach

1. **Clarify the outcome** — what does “finished” look like (file delivered, page indexed, bug fixed, draft approved)?
2. **Gather inputs** — source files, URLs, error messages, constraints, and deadlines.
3. **Apply the smallest change** that could work; avoid parallel experiments that hide the cause.
4. **Validate** with a second device, a clean browser profile, or a fresh export.
5. **Document the winning path** in three bullets so next time is faster.

${toolsBlurb}`,

    `## Common mistakes (and quick fixes)

- **Skipping the preview** — always open the final artifact before sharing.
- **Optimizing the wrong metric** — file size, rankings, or speed only matter relative to the real goal.
- **One giant edit** — smaller passes are easier to reverse when something breaks.
- **Ignoring mobile** — many PDF, SEO, and UI issues only appear on a phone viewport.
- **Trusting defaults** — export quality, crawl rules, and model temperature are not universal.

When something fails twice, change the method instead of retrying the same click pattern. Capture a screenshot or error string; future-you (or a teammate) will thank you.`,

    `## Checklist before you publish or hand off

- [ ] Primary goal stated in one sentence
- [ ] Inputs saved or linked
- [ ] Output opens correctly on a second device
- [ ] Sensitive data removed from drafts and prompts
- [ ] Follow-up link or owner noted if more work remains

Use this list as a gate. If any box is unchecked, pause. Ten careful minutes here usually beats an hour of cleanup later.`,

    `## FAQ

### How long should this take?
A focused first pass often fits in under an hour for a single page, file, or feature. Broader audits take longer—schedule them deliberately.

### Do I need paid software?
Not for the workflows covered here. Browser-based FreeToolsPro utilities handle many inspection, conversion, and drafting steps without installs.

### What if my case is weird?
Isolate the oddity (one page, one URL, one function). Reproduce it with minimal inputs, then widen scope only after you understand the failure.

### How do I keep improving?
Keep a short personal playbook: prompts that worked, compression settings you trust, SEO checks you never skip. Update it when reality contradicts the notes.`,

    `## Wrap-up

${title} is less about memorizing jargon and more about a calm sequence: clarify, change one thing, verify, then document. Return to this page when you need the sequence—not when you need another tab of theory.

Explore related FreeToolsPro guides from the [blog home](/blog), and open the linked tools whenever you want a fast, private, browser-based pass at the job.`,
  ];

  let expanded = body.trim();
  for (const block of blocks) {
    if (wordCount(expanded) >= TARGET) break;
    // Avoid duplicating a heading that already exists
    const heading = block.match(/^##\s+(.+)$/m)?.[1]?.toLowerCase();
    if (heading && expanded.toLowerCase().includes(`## ${heading}`)) continue;
    expanded = `${expanded}\n\n${block}`.trim();
  }

  // If still short, add a deeper "field notes" section
  let guard = 0;
  while (wordCount(expanded) < MIN && guard < 5) {
    guard += 1;
    expanded += `\n\n## Field notes for ${title.split(":")[0].trim()}

Real projects rarely match the happy path. Expect missing fonts in PDFs, thin content on “SEO pages,” flaky async ordering in JavaScript demos, and AI drafts that sound polished while inventing details. Build buffers into your estimate for verification.

When collaborating, share the checklist and the raw inputs—not just the final file. Clear inputs make reviews faster and reduce accidental overwrites. If you maintain a team wiki, paste the winning settings (export DPI, crawl directives, prompt skeletons) so knowledge survives chat scrollback.

Finally, revisit results after they meet the real world: a portal upload, a search impression, a production deploy, or a classmate’s feedback. Adjust the playbook with what actually happened. That feedback loop is how short guides become reliable personal standards.`;
  }

  // Soft trim if somehow over MAX (unlikely with current bodies)
  if (wordCount(expanded) > MAX) {
    const paras = expanded.split(/\n\n+/);
    while (wordCount(paras.join("\n\n")) > MAX && paras.length > 4) {
      paras.pop();
    }
    expanded = paras.join("\n\n").trim();
  }

  return expanded.trim() + "\n";
}

function rebuildFile(fmPrefix, body) {
  // fmPrefix includes opening --- ... ---
  return `${fmPrefix.replace(/\s*$/, "")}\n\n${body}`;
}

function main() {
  const files = fs.readdirSync(BLOG).filter((f) => f.endsWith(".md"));
  const stats = { ok: 0, stillShort: 0, trimmed: 0 };
  for (const file of files) {
    const full = path.join(BLOG, file);
    const raw = fs.readFileSync(full, "utf8");
    const { fm, data, body } = parseFile(raw);
    if (!fm) {
      console.warn("skip (no fm)", file);
      continue;
    }
    const expanded = buildExpansion(data, body);
    const words = wordCount(expanded);
    const out = rebuildFile(raw.slice(0, raw.indexOf("\n---", 3) + 4), expanded);
    fs.writeFileSync(full, out, "utf8");
    if (words < MIN) stats.stillShort += 1;
    else if (words > MAX) stats.trimmed += 1;
    else stats.ok += 1;
    console.log(String(words).padStart(4), file);
  }
  console.log("DONE", stats);
}

main();
