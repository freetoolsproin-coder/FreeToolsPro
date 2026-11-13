// Sanity checks for the catalog: run with `npm run check:catalog`.
import { TOOLS, MAX_TOOLS, CATEGORIES } from "../src/data/catalog.js";
import { REDIRECTS } from "../src/data/redirects.js";
import { ENGINE_IDS } from "../src/tools/registry.js";
import { PRIORITY } from "../src/data/priority.js";
import { HUB_CONTENT, hubLinks } from "../src/data/hub-content.js";
import { DEPTH } from "../src/data/tool-depth.js";
import { answerFor } from "../src/lib/worked-example.js";

const errors = [];
const warn = [];
const ids = new Set();
const paths = new Set();
const hubPaths = new Set(CATEGORIES.map((c) => c.path));

if (TOOLS.length > MAX_TOOLS) errors.push(`Catalog has ${TOOLS.length} tools; the cap is ${MAX_TOOLS}.`);

for (const t of TOOLS) {
  if (ids.has(t.id)) errors.push(`Duplicate id ${t.id}`);
  if (paths.has(t.path)) errors.push(`Duplicate path ${t.path}`);
  ids.add(t.id);
  paths.add(t.path);
  for (const k of ["name", "short", "title", "description", "intro"]) if (!t[k]) errors.push(`${t.id} missing ${k}`);
  if (!t.faqs || t.faqs.length < 2) errors.push(`${t.id} needs at least 2 FAQs`);
  if (t.title.length > 65) warn.push(`${t.id} title is ${t.title.length} chars (aim for <= 60 before the brand suffix)`);
  if (t.description.length > 160) warn.push(`${t.id} description is ${t.description.length} chars`);
  if (t.description.length < 110) warn.push(`${t.id} description is short (${t.description.length})`);
  if (!ENGINE_IDS[t.engine]?.includes(t.id)) errors.push(`${t.id}: no implementation registered in engine '${t.engine}'`);
  if (REDIRECTS[t.path]) errors.push(`${t.id} path is also redirected`);
}

const ranked = new Set(PRIORITY);
for (const t of TOOLS) if (!ranked.has(t.id)) errors.push(`${t.id} is not listed in src/data/priority.js`);
for (const id of PRIORITY) if (!ids.has(id)) errors.push(`priority.js lists unknown tool '${id}'`);
if (ranked.size !== PRIORITY.length) errors.push("priority.js lists a tool more than once");

for (const [from, to] of Object.entries(REDIRECTS)) {
  if (!paths.has(to) && !hubPaths.has(to) && !["/", "/tools", "/contact", "/privacy-policy", "/terms", "/cookie-policy"].includes(to))
    errors.push(`Redirect ${from} -> ${to} points nowhere`);
  if (REDIRECTS[to]) errors.push(`Redirect chain ${from} -> ${to} -> ${REDIRECTS[to]}`);
}

for (const c of CATEGORIES) if (!HUB_CONTENT[c.id]) warn.push(`hub ${c.id} has no guide copy in hub-content.js`);
for (const [id, href] of hubLinks())
  if (!paths.has(href) && !hubPaths.has(href)) errors.push(`hub-content.js (${id}) links to ${href}, which is not a tool or hub`);

for (const [cid, c] of Object.entries(HUB_CONTENT)) {
  for (const [, id] of c.uses || []) if (!ids.has(id)) errors.push(`hub-content.js (${cid}) use case points to unknown tool '${id}'`);
  for (const a of c.answers || []) {
    if (!ids.has(a.tool)) errors.push(`hub-content.js (${cid}) answer uses unknown tool '${a.tool}'`);
    else
      try {
        answerFor(a);
      } catch (e) {
        errors.push(`hub-content.js (${cid}) "${a.q}": ${e.message}`);
      }
  }
}
for (const t of TOOLS) if (!DEPTH[t.id]?.how) warn.push(`${t.id} has no 'how it works' text in tool-depth.js`);
for (const id of Object.keys(DEPTH)) if (!ids.has(id)) errors.push(`tool-depth.js has an entry for unknown tool '${id}'`);

const perCat = Object.fromEntries(CATEGORIES.map((c) => [c.name, TOOLS.filter((t) => t.cat === c.id).length]));
console.log(`Tools: ${TOOLS.length}/${MAX_TOOLS}`, perCat);
console.log(`Redirects: ${Object.keys(REDIRECTS).length}`);
warn.forEach((w) => console.warn("warn:", w));
if (errors.length) {
  errors.forEach((e) => console.error("error:", e));
  process.exit(1);
}
console.log("Catalog OK");
