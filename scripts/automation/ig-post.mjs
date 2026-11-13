// Post one tool to Instagram: picks the tool that has gone longest without a post, writes a fresh
// caption with AI (a different angle each time the tool comes round again) and publishes the
// tool's /ig/<id>.jpg card through the Instagram API.
//
//   npm run ig:post                  post the next tool
//   npm run ig:post -- --dry-run     show what would be posted (no Instagram token needed)
//   npm run ig:post -- --tool sip-calculator   post a specific tool
//   npm run ig:post -- --check       check the token, the account and today's posting quota
//   npm run ig:post -- --force       post even if the last post was less than IG_MIN_HOURS ago
//
// Settings in .env: IG_ACCESS_TOKEN (first run only; it is then kept and refreshed in
// automation/state/ig-token.json), IG_API_VERSION, IG_MIN_HOURS, IG_SKIP, LLM_PROVIDER and its key.
import { join } from "node:path";
import { TOOLS, toolById, categoryById } from "../../src/data/catalog.js";
import { SITE } from "../../src/data/site.js";
import { STATE_DIR, env, flag, option, readJson, writeJson } from "./lib/env.mjs";
import { askJson, llmAvailable, llmConfig } from "./lib/llm.mjs";

const API = `https://graph.instagram.com/${env("IG_API_VERSION", "v23.0")}`;
const STATE_FILE = join(STATE_DIR, "ig-posts.json");
const TOKEN_FILE = join(STATE_DIR, "ig-token.json");
const MIN_HOURS = Number(env("IG_MIN_HOURS", "20"));
const SKIP = new Set(env("IG_SKIP", "").split(",").map((s) => s.trim()).filter(Boolean));
const DRY = flag("dry-run");

// A different angle each time the same tool comes round, so repeat posts don't read the same.
const ANGLES = [
  "Problem → solution: open with the everyday problem this tool solves, then show how it fixes it in seconds.",
  "Quick tip: one practical, specific tip about the task this tool helps with, then point to the tool.",
  "Did you know: lead with a surprising but true fact taken from the FAQs or method, then the tool.",
  "Step by step: 3 short numbered steps to get the result with this tool.",
  "Myth vs fact: one common misconception about this topic (from the FAQs), corrected, then the tool.",
];

const HASHTAGS = {
  finance: ["#personalfinance", "#moneytips", "#emi", "#loan", "#investing", "#financialplanning", "#india"],
  tax: ["#incometax", "#tax", "#taxsaving", "#salary", "#gst", "#india", "#financetips"],
  everyday: ["#calculator", "#productivity", "#lifehacks", "#dailytools", "#india"],
  student: ["#students", "#studytips", "#cgpa", "#exam", "#college", "#india"],
  study: ["#studytips", "#students", "#studygram", "#exampreparation", "#learning"],
  latex: ["#latex", "#math", "#students", "#research", "#engineering"],
  text: ["#writingtools", "#productivity", "#texttools", "#contentcreator"],
  writing: ["#writing", "#writingtips", "#contentwriting", "#productivity"],
  developer: ["#webdeveloper", "#coding", "#programming", "#devtools", "#javascript"],
  encoding: ["#developer", "#coding", "#cybersecurity", "#devtools"],
  seo: ["#seo", "#digitalmarketing", "#blogging", "#webdesign", "#seotips"],
  image: ["#photoediting", "#imagetools", "#contentcreator", "#socialmediatips"],
  creator: ["#contentcreator", "#youtube", "#instagramtips", "#creator"],
  pdf: ["#pdf", "#productivity", "#officetools", "#students"],
  design: ["#webdesign", "#css", "#uidesign", "#frontend"],
};
const BASE_TAGS = ["#freetools", "#freetoolspro", "#onlinetools"];

const state = readJson(STATE_FILE, { posts: [] });
const lastPost = (id) => state.posts.filter((p) => p.id === id).map((p) => p.date).sort().pop();
const postCount = (id) => state.posts.filter((p) => p.id === id).length;

function pickTool() {
  const want = option("tool");
  if (want) {
    if (!toolById[want]) throw new Error(`Unknown tool id '${want}'`);
    return toolById[want];
  }
  // Never-posted tools first (in the site's priority order), then the one posted longest ago.
  return TOOLS.filter((t) => !SKIP.has(t.id))
    .map((t) => ({ t, last: lastPost(t.id) || "" }))
    .sort((a, b) => (a.last < b.last ? -1 : a.last > b.last ? 1 : a.t.rank - b.t.rank))[0].t;
}

function fallbackCaption(tool) {
  const cat = categoryById[tool.cat];
  const tags = [...BASE_TAGS, ...(HASHTAGS[tool.cat] || [])].slice(0, 10);
  return [`${tool.name}: ${tool.short}.`, "", tool.description, "", `👉 Free, no sign-up: ${SITE.url.replace("https://", "")}${tool.path} (link in bio)`, `More ${cat.name.toLowerCase()} on our page.`, "", tags.join(" ")].join("\n");
}

async function aiCaption(tool) {
  const n = postCount(tool.id);
  const angle = ANGLES[n % ANGLES.length];
  const previous = state.posts.filter((p) => p.id === tool.id).slice(-2).map((p) => p.caption);
  const data = await askJson({
    system:
      "You write Instagram captions for FreeToolsPro, a site of free browser-based tools for Indian users. Voice: friendly, clear, practical, Indian English. No hype words (amazing, revolutionary, game-changer), no fake urgency, no claims that are not in the material. Use at most 3 emojis.",
    prompt: `Write a caption for a post about this tool.

Angle for this post: ${angle}

Tool: ${tool.name}
What it does: ${tool.short}
Description: ${tool.description}
About: ${tool.intro}
FAQs:
${tool.faqs.slice(0, 4).map(([q, a]) => `- ${q} ${a}`).join("\n")}
Category: ${categoryById[tool.cat].name}

${previous.length ? `Earlier captions for this tool (do not repeat their hook or wording):\n${previous.map((c) => "---\n" + c).join("\n")}\n` : ""}
Return JSON: {"hook": "first line, max 90 characters, makes people stop scrolling", "body": "2 to 5 short lines, max 500 characters, may use line breaks", "hashtags": ["8 to 12 relevant hashtags, mix of broad and niche, each starting with #"]}`,
  });
  const hook = String(data.hook || "").trim();
  const body = String(data.body || "").trim();
  if (!hook || !body) throw new Error("caption is missing its hook or body");
  const tags = [...new Set([...BASE_TAGS, ...(data.hashtags || []).map((h) => "#" + String(h).replace(/^#+/, "").replace(/\s+/g, "").toLowerCase())])].filter((h) => h.length > 2).slice(0, 15);
  return [hook, "", body, "", `👉 Try it free, no sign-up: ${SITE.url.replace("https://", "")}${tool.path} (link in bio)`, "", tags.join(" ")].join("\n");
}

async function api(path, params = {}, method = "GET") {
  const url = new URL(API + path);
  const opts = { method };
  if (method === "GET") for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  else opts.body = new URLSearchParams(params);
  const r = await fetch(url, opts);
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(`Instagram API ${path}: ${j.error?.message || r.status}${j.error?.error_user_msg ? " – " + j.error.error_user_msg : ""}`);
  return j;
}

/** The saved long-lived token, refreshed once a week so it never reaches its 60-day expiry. */
async function getToken() {
  const saved = readJson(TOKEN_FILE, null);
  let token = saved?.token || env("IG_ACCESS_TOKEN");
  if (!token) throw new Error("No Instagram token: set IG_ACCESS_TOKEN in .env (see automation/README.md).");
  const age = saved?.refreshedAt ? (Date.now() - Date.parse(saved.refreshedAt)) / 864e5 : Infinity;
  if (age > 7) {
    try {
      const r = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`);
      const j = await r.json();
      if (j.access_token) {
        token = j.access_token;
        writeJson(TOKEN_FILE, { token, refreshedAt: new Date().toISOString(), expiresInDays: Math.round((j.expires_in || 0) / 86400) });
        console.log(`Token refreshed (valid ${Math.round((j.expires_in || 0) / 86400)} more days).`);
      } else {
        console.warn(`warn: token refresh failed (${j.error?.message || r.status}); using the current token.`);
        if (!saved) writeJson(TOKEN_FILE, { token, refreshedAt: null });
      }
    } catch (e) {
      console.warn("warn: token refresh failed:", e.message);
    }
  }
  return token;
}

async function check() {
  const token = await getToken();
  const me = await api("/me", { fields: "user_id,username,account_type", access_token: token });
  console.log(`Connected as @${me.username} (${me.account_type || "account"}, id ${me.user_id || me.id}).`);
  try {
    const q = await api("/me/content_publishing_limit", { fields: "quota_usage,config", access_token: token });
    const d = q.data?.[0];
    if (d) console.log(`Posts published through the API in the last 24 hours: ${d.quota_usage}/${d.config?.quota_total ?? "?"}`);
  } catch (e) {
    console.warn("warn: could not read the posting quota:", e.message);
  }
  console.log(`AI captions: ${llmAvailable() ? `${llmConfig().name} (${llmConfig().model})` : "off (no API key), using the template caption"}`);
}

async function main() {
  if (flag("check")) return check();

  const last = state.posts.map((p) => p.date).sort().pop();
  if (!DRY && !flag("force") && last && (Date.now() - Date.parse(last)) / 36e5 < MIN_HOURS) {
    console.log(`Last post was at ${last}, less than ${MIN_HOURS} hours ago. Nothing to do (use --force to post anyway).`);
    return;
  }

  const tool = pickTool();
  const image = `${SITE.url}/ig/${tool.id}.jpg`;
  let caption;
  if (llmAvailable()) {
    try {
      caption = await aiCaption(tool);
    } catch (e) {
      console.warn(`warn: AI caption failed (${e.message}); using the template caption.`);
    }
  }
  caption ||= fallbackCaption(tool);
  if (caption.length > 2200) caption = caption.slice(0, 2200);

  console.log(`Tool:  ${tool.name} (${tool.id}), posted ${postCount(tool.id)} time(s) before`);
  console.log(`Image: ${image}`);
  console.log(`Caption:\n${caption}\n`);

  const head = await fetch(image, { method: "HEAD" }).catch(() => null);
  const ok = head?.ok && /image\/jpe?g/.test(head.headers.get("content-type") || "");
  if (!ok) {
    const msg = `The image ${image} is not live (${head ? `HTTP ${head.status}, ${head.headers.get("content-type")}` : "no response"}). Build and deploy the site first: the /ig/ images come from src/pages/ig/[slug].jpg.js.`;
    if (DRY) console.warn("warn:", msg);
    else throw new Error(msg);
  }
  if (DRY) return console.log("Dry run: nothing was posted.");

  const token = await getToken();
  const container = await api("/me/media", { image_url: image, caption, access_token: token }, "POST");
  // Wait until Instagram has fetched and processed the image.
  for (let i = 0; i < 12; i++) {
    const s = await api(`/${container.id}`, { fields: "status_code", access_token: token });
    if (s.status_code === "FINISHED") break;
    if (s.status_code === "ERROR" || s.status_code === "EXPIRED") throw new Error(`Instagram could not process the image (${s.status_code}).`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  const media = await api("/me/media_publish", { creation_id: container.id, access_token: token }, "POST");
  let permalink = "";
  try {
    permalink = (await api(`/${media.id}`, { fields: "permalink", access_token: token })).permalink || "";
  } catch {}
  state.posts.push({ id: tool.id, date: new Date().toISOString(), mediaId: media.id, permalink, caption });
  writeJson(STATE_FILE, state);
  console.log(`Posted: ${permalink || media.id}`);
}

main().catch((e) => {
  console.error("error:", e.message);
  process.exit(1);
});
