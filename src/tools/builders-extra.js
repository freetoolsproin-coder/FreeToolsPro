// Builder tools added in the October 2026 expansion: SERP preview, meta checker, email writer, prompt builder.
// Same contract as builders.js: fields -> build(values) => { code, lang, preview, stats, checks, outputs, download }.

const f = {
  text: (id, label, def = "", extra = {}) => ({ id, label, type: "text", def, ...extra }),
  area: (id, label, def = "", extra = {}) => ({ id, label, type: "textarea", def, ...extra }),
  range: (id, label, def, min, max, step = 1, unit = "", extra = {}) => ({ id, label, type: "range", def, min, max, step, unit, ...extra }),
  select: (id, label, def, options, extra = {}) => ({ id, label, type: "select", def, options, ...extra }),
  toggle: (id, label, def = false, extra = {}) => ({ id, label, type: "toggle", def, ...extra }),
};
const ok = (label, detail = "") => ({ status: "ok", label, detail });
const warn = (label, detail = "") => ({ status: "warn", label, detail });
const bad = (label, detail = "") => ({ status: "bad", label, detail });
const info = (label, detail = "") => ({ status: "info", label, detail });
const chars = (s) => [...String(s)].length;
const words = (s) => (String(s).match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length;

// ---------- pixel widths (Arial, units per 1000 em) ----------
// Google sets result titles and descriptions in Arial, so these widths predict where it truncates.
const W = {};
"abdeghnopqu0123456789$₹#_".split("").forEach((c) => (W[c] = 556));
"ckszvxy".split("").forEach((c) => (W[c] = 500));
Object.assign(W, { f: 278, i: 222, j: 222, l: 222, t: 278, r: 333, m: 833, w: 722, " ": 278, ".": 278, ",": 278, ":": 278, ";": 278, "!": 278, "|": 260, "'": 191, '"': 355, "(": 333, ")": 333, "[": 278, "]": 278, "-": 333, "–": 556, "—": 1000, "/": 278, "?": 556, "&": 667, "%": 889, "+": 584, "=": 584, "@": 1015, "*": 389, "…": 1000 });
Object.assign(W, { A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 500, K: 667, L: 556, M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611 });
export function pxWidth(s, size) {
  let w = 0;
  for (const ch of String(s)) w += W[ch] ?? (/[ऀ-෿]/.test(ch) ? 620 : /\p{Extended_Pictographic}/u.test(ch) ? 1150 : 600);
  return (w * size) / 1000;
}
/** Cut at a word boundary so the text plus " ..." fits in `max` pixels. */
export function fitPx(s, size, max) {
  const t = String(s).trim();
  if (pxWidth(t, size) <= max) return { text: t, cut: false };
  const parts = t.split(/(\s+)/);
  let out = "";
  for (const p of parts) {
    if (pxWidth(out + p + " ...", size) > max) break;
    out += p;
  }
  if (!out.trim()) {
    for (const ch of t) {
      if (pxWidth(out + ch + "...", size) > max) break;
      out += ch;
    }
  }
  return { text: out.trimEnd().replace(/[,;:\-–|]$/, "") + " ...", cut: true };
}

export const SERP = { title: { size: 20, max: 580 }, desc: { size: 14, max: 990 }, descMobile: { size: 14, max: 760 }, titleMobile: { size: 18, max: 620 } };

function crumbOf(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean).map((p) => decodeURIComponent(p));
    return { host: u.hostname.replace(/^www\./, ""), origin: `${u.protocol}//${u.hostname}`, crumb: parts.length ? " › " + parts.join(" › ") : "" };
  } catch {
    return { host: url || "example.com", origin: url || "https://example.com", crumb: "" };
  }
}
function serpPreview(v, device) {
  const { host, origin, crumb } = crumbOf(v.url);
  const t = fitPx(v.title || "Untitled page", device === "mobile" ? SERP.titleMobile.size : SERP.title.size, device === "mobile" ? SERP.titleMobile.max * 1.9 : SERP.title.max);
  const d = fitPx(v.desc || "", 14, device === "mobile" ? SERP.descMobile.max : SERP.desc.max);
  return { device, site: v.site || host, origin, crumb, title: t.text, desc: d.text, date: v.date || "", rating: v.rich === "rating" ? Number(v.rating) : 0, reviews: v.reviews || "", price: v.rich === "price" ? v.price : "", faq: v.rich === "faq" };
}

function titleChecks(title, kw) {
  const out = [];
  const n = chars(title);
  const px = Math.round(pxWidth(title, SERP.title.size));
  if (!n) out.push(bad("Title is empty"));
  else if (px > SERP.title.max) out.push(warn(`Title is ${n} characters (${px} px) and will likely be cut`, `Google shows about ${SERP.title.max} px on desktop. Shown as: “${fitPx(title, 20, SERP.title.max).text}”`));
  else if (n < 30) out.push(warn(`Title is only ${n} characters`, "Short titles waste space you could use for keywords and a reason to click. Aim for 50 to 60."));
  else out.push(ok(`Title fits: ${n} characters, ${px} of ${SERP.title.max} px`));
  if (title && title === title.toUpperCase() && /[A-Z]/.test(title)) out.push(warn("Title is all capitals", "Capitals are wider, so fewer fit, and they read as shouting."));
  const dup = (title.toLowerCase().match(/\b[\p{L}]{4,}\b/gu) || []).filter((w, i, a) => a.indexOf(w) !== i);
  if (dup.length) out.push(info(`Repeated word${dup.length > 1 ? "s" : ""}: ${[...new Set(dup)].join(", ")}`, "Repeating a keyword does not help ranking and costs space."));
  if (kw) {
    const pos = title.toLowerCase().indexOf(kw);
    if (pos < 0) out.push(warn(`Keyword “${kw}” is not in the title`));
    else if (pos > 30) out.push(info("Keyword is not near the start of the title", "Words at the start get the most attention and survive truncation."));
    else out.push(ok("Keyword is near the start of the title"));
  }
  return out;
}
function descChecks(desc, kw) {
  const out = [];
  const n = chars(desc);
  const px = Math.round(pxWidth(desc, 14));
  if (!n) out.push(warn("Description is empty", "Google will pick text from the page instead, which is often less persuasive."));
  else if (px > SERP.desc.max) out.push(warn(`Description is ${n} characters (${px} px) and will likely be cut on desktop`, `Keep the key message in the first 120 characters.`));
  else if (n < 70) out.push(warn(`Description is only ${n} characters`, "Use 120 to 158 characters to explain what the page offers and why to click."));
  else out.push(ok(`Description fits on desktop: ${n} characters, ${px} of ${SERP.desc.max} px`));
  if (n && px > SERP.descMobile.max && px <= SERP.desc.max) out.push(info("May be cut on mobile", `Mobile results show about ${SERP.descMobile.max} px (around 120 characters).`));
  if (kw && n) out.push(desc.toLowerCase().includes(kw) ? ok("Keyword appears in the description", "Google bolds it when it matches the search.") : info(`Keyword “${kw}” is not in the description`));
  return out;
}

// ---------- email templates ----------
const SIGN = { formal: "Regards", friendly: "Thanks" };
function lines(s) {
  return String(s || "")
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean);
}
function sentence(s) {
  const t = String(s || "").trim();
  if (!t) return "";
  return (t.charAt(0).toUpperCase() + t.slice(1)).replace(/([^.!?])$/, "$1.");
}
function emailFor(v) {
  const to = v.to.trim() || (v.tone === "formal" ? "Sir/Madam" : "there");
  const hi = v.tone === "formal" ? `Dear ${to},` : `Hi ${to},`;
  const me = v.from.trim() || "[Your name]";
  const role = v.role.trim();
  const company = v.company.trim();
  const when = v.when.trim();
  const detail = sentence(v.details);
  const sign = `${SIGN[v.tone] || "Regards"},\n${me}${v.type === "application" || v.type === "cover" ? "\n[Phone] | [Email] | [LinkedIn]" : ""}`;
  const f = v.tone === "formal";
  switch (v.type) {
    case "leave":
      return {
        subject: `Leave request${when ? `: ${when}` : ""}`,
        body: [hi, `I would like to request leave${when ? ` from ${when}` : ""}${detail ? `. ${detail}` : "."}`, `I will make sure my current work is up to date before I go${v.cover.trim() ? `, and ${v.cover.trim()} has agreed to cover anything urgent while I am away` : " and will share a handover note with the team"}. I will be reachable on phone for anything critical.`, f ? "Kindly let me know if this is approved, or if you would like me to adjust the dates." : "Let me know if that works, or if you'd like me to move the dates.", sign],
      };
    case "sick":
      return {
        subject: `Sick leave${when ? `: ${when}` : " today"}`,
        body: [hi, `I am not feeling well and will not be able to work ${when || "today"}${detail ? `. ${detail}` : "."}`, `${v.cover.trim() ? `${v.cover.trim()} can help with anything urgent. ` : ""}I will check messages when I can and will update you if I need more time to recover.`, f ? "I apologise for the short notice." : "Sorry for the short notice.", sign],
      };
    case "followup":
      return {
        subject: `Following up${v.topic.trim() ? `: ${v.topic.trim()}` : ""}`,
        body: [hi, `I hope you are doing well. I am following up on ${v.topic.trim() || "my earlier email"}${when ? `, which I sent on ${when}` : ""}.`, detail || "I wanted to check whether you had a chance to look at it, and whether you need anything else from me.", f ? "I would be grateful for an update when convenient." : "A quick update would be great whenever you get a moment.", sign],
      };
    case "meeting":
      return {
        subject: `Meeting request${v.topic.trim() ? `: ${v.topic.trim()}` : ""}`,
        body: [hi, `Could we set up a short meeting to discuss ${v.topic.trim() || "the next steps"}?${detail ? ` ${detail}` : ""}`, when ? `Would ${when} work for you? If not, please suggest a time that suits you.` : "Please let me know a time that suits you this week, and I will send an invite.", `I expect it to take about 30 minutes.`, sign],
      };
    case "thanks":
      return {
        subject: `Thank you${v.topic.trim() ? ` for ${v.topic.trim()}` : ""}`,
        body: [hi, `Thank you for ${v.topic.trim() || "your help"}${when ? ` on ${when}` : ""}. ${detail || "It made a real difference, and I appreciate the time you took."}`, f ? "Please do not hesitate to reach out if I can return the favour." : "Let me know if I can ever return the favour.", sign],
      };
    case "apology":
      return {
        subject: `Apology${v.topic.trim() ? `: ${v.topic.trim()}` : ""}`,
        body: [hi, `I am sorry about ${v.topic.trim() || "what happened"}${when ? ` on ${when}` : ""}. ${detail || "I understand the inconvenience it caused."}`, "To make sure it does not happen again, I have [the step you have taken].", f ? "Thank you for your patience and understanding." : "Thanks for bearing with me.", sign],
      };
    case "reminder":
      return {
        subject: `Reminder: ${v.topic.trim() || "payment due"}${when ? ` (${when})` : ""}`,
        body: [hi, `This is a friendly reminder about ${v.topic.trim() || "the pending payment"}${when ? `, due on ${when}` : ""}. ${detail}`, "If you have already taken care of it, please ignore this email. Otherwise, I would appreciate it if you could let me know when to expect it.", sign],
      };
    case "resignation":
      return {
        subject: `Resignation${me !== "[Your name]" ? ` – ${me}` : ""}`,
        body: [hi, `Please accept this email as formal notice of my resignation from my position${role ? ` as ${role}` : ""}${company ? ` at ${company}` : ""}. ${when ? `My last working day will be ${when}, in line with my notice period.` : "I will serve my notice period as per my contract."}`, detail || `I am grateful for the opportunities I have had here and for the support of the team.`, "I will do everything I can to ensure a smooth handover, including documenting my work and helping to train my replacement.", f ? "Thank you once again." : "Thanks again for everything.", sign],
      };
    case "application":
      return {
        subject: `Application for ${role || "[Job title]"}${me !== "[Your name]" ? ` – ${me}` : ""}`,
        body: [hi, `I am writing to apply for the ${role || "[Job title]"} role${company ? ` at ${company}` : ""}${v.source.trim() ? `, which I saw on ${v.source.trim()}` : ""}. ${detail}`.trim(), lines(v.points).length ? `A few highlights from my experience:\n${lines(v.points).map((p) => `• ${sentence(p)}`).join("\n")}` : "[Two or three highlights that match the job description.]", "I have attached my resume and would welcome the chance to discuss how I can contribute to the team.", sign],
      };
    case "cover": {
      const pts = lines(v.points);
      return {
        subject: `Cover letter – ${role || "[Job title]"}${me !== "[Your name]" ? ` – ${me}` : ""}`,
        body: [
          hi,
          `I am excited to apply for the ${role || "[Job title]"} position${company ? ` at ${company}` : ""}${v.source.trim() ? `, advertised on ${v.source.trim()}` : ""}. ${detail || `What draws me to ${company || "your company"} is [one specific reason: a product, value or recent news].`}`,
          pts.length ? `In my recent work I have:\n${pts.map((p) => `• ${sentence(p)}`).join("\n")}` : "In my recent work I have [achievement with a number], [second achievement] and [a skill from the job description you have used].",
          `I would bring the same focus on results to ${company || "your team"}. I would welcome the opportunity to discuss how my experience fits what you need, and I am available for a conversation at your convenience.`,
          "Thank you for considering my application.",
          sign.replace(/^Thanks,/, "Sincerely,").replace(/^Regards,/, "Sincerely,"),
        ],
      };
    }
    default:
      return { subject: "", body: [hi, detail, sign] };
  }
}
const needs = (types) => (v) => types.includes(v.type);

// ---------- prompt builder ----------
const VAGUE = ["good", "nice", "better", "some", "stuff", "things", "etc", "properly", "awesome", "interesting"];

export const EXTRA_BUILDERS = {
  "serp-snippet-preview": {
    fields: [
      f.text("title", "Title", "Home Loan EMI Calculator: EMI, Interest & Schedule", { counter: [30, 60] }),
      f.area("desc", "Meta description", "Calculate your home loan EMI instantly. See total interest, a year-by-year amortization schedule and how much a prepayment can save you.", { counter: [70, 158] }),
      f.text("url", "Page URL", "https://freetoolspro.in/loan-calculators/home-loan-calculator"),
      f.text("site", "Site name (shown above the URL)", "FreeToolsPro"),
      f.select("device", "Preview", "both", [["both", "Desktop and mobile"], ["desktop", "Desktop"], ["mobile", "Mobile"]]),
      f.text("date", "Date shown (optional)", "", { placeholder: "e.g. 14 Oct 2026" }),
      f.select("rich", "Rich result", "none", [["none", "None"], ["rating", "Star rating"], ["price", "Price"], ["faq", "FAQ links"]]),
      f.range("rating", "Rating", 4.6, 1, 5, 0.1, " ★", { show: (v) => v.rich === "rating" }),
      f.text("reviews", "Number of reviews", "1,284", { show: (v) => v.rich === "rating" }),
      f.text("price", "Price", "₹499", { show: (v) => v.rich === "price" }),
    ],
    build: (v) => {
      const devices = v.device === "both" ? ["desktop", "mobile"] : [v.device];
      const t = fitPx(v.title, 20, SERP.title.max);
      const d = fitPx(v.desc, 14, SERP.desc.max);
      return {
        preview: { type: "serp2", items: devices.map((dev) => serpPreview(v, dev)) },
        stats: [
          { label: "Title", value: `${chars(v.title)} chars · ${Math.round(pxWidth(v.title, 20))} px`, warn: t.cut },
          { label: "Description", value: `${chars(v.desc)} chars · ${Math.round(pxWidth(v.desc, 14))} px`, warn: d.cut },
          { label: "Title cut?", value: t.cut ? "Yes" : "No", warn: t.cut },
          { label: "Description cut?", value: d.cut ? "Yes (desktop)" : pxWidth(v.desc, 14) > SERP.descMobile.max ? "Mobile only" : "No", warn: d.cut },
        ],
        checks: [...titleChecks(v.title, ""), ...descChecks(v.desc, "")].filter((c) => c.status !== "info"),
        code: `<title>${esc(v.title)}</title>\n<meta name="description" content="${esc(v.desc)}">`,
        lang: "html",
      };
    },
  },

  "meta-title-description-checker": {
    fields: [
      f.text("title", "Meta title", "Best SIP Calculator Online - SIP Calculator for Mutual Funds with Step Up SIP Returns", { counter: [50, 60] }),
      f.area("desc", "Meta description", "Use our SIP calculator.", { counter: [120, 158] }),
      f.text("kw", "Focus keyword (optional)", "sip calculator"),
      f.text("url", "Page URL (for the preview)", "https://freetoolspro.in/calculators/sip-calculator"),
    ],
    build: (v) => {
      const kw = v.kw.trim().toLowerCase();
      const checks = [...titleChecks(v.title, kw), ...descChecks(v.desc, kw)];
      if (v.title.trim() && v.title.trim().toLowerCase() === v.desc.trim().toLowerCase()) checks.push(warn("Title and description are identical", "Use the description to add detail and a reason to click."));
      if (/["]/.test(v.desc)) checks.push(info("Description contains double quotes", "Write them as &quot; inside the content attribute or Google may cut the text there."));
      const score = Math.max(0, 100 - checks.filter((c) => c.status === "warn").length * 15 - checks.filter((c) => c.status === "bad").length * 30);
      return {
        preview: { type: "serp2", items: [serpPreview({ ...v, site: "" }, "desktop")] },
        stats: [
          { label: "Score", value: `${score}/100`, warn: score < 70 },
          { label: "Title", value: `${chars(v.title)} chars`, warn: pxWidth(v.title, 20) > SERP.title.max || chars(v.title) < 30 },
          { label: "Title width", value: `${Math.round(pxWidth(v.title, 20))}/${SERP.title.max} px`, warn: pxWidth(v.title, 20) > SERP.title.max },
          { label: "Description", value: `${chars(v.desc)} chars`, warn: chars(v.desc) < 70 || pxWidth(v.desc, 14) > SERP.desc.max },
          { label: "Description width", value: `${Math.round(pxWidth(v.desc, 14))}/${SERP.desc.max} px`, warn: pxWidth(v.desc, 14) > SERP.desc.max },
        ],
        checks,
        code: `<title>${esc(v.title)}</title>\n<meta name="description" content="${esc(v.desc)}">`,
        lang: "html",
      };
    },
  },

  "email-writer": {
    fields: [
      f.select("type", "What are you writing?", "leave", [
        ["leave", "Leave request"],
        ["sick", "Sick leave"],
        ["followup", "Follow-up"],
        ["meeting", "Meeting request"],
        ["thanks", "Thank-you note"],
        ["apology", "Apology"],
        ["reminder", "Payment or deadline reminder"],
        ["resignation", "Resignation"],
        ["application", "Job application email"],
        ["cover", "Cover letter"],
      ]),
      f.select("tone", "Tone", "formal", [["formal", "Formal"], ["friendly", "Friendly"]]),
      f.text("to", "Recipient's name", "Ms Sharma"),
      f.text("from", "Your name", "Rohan Iyer"),
      f.text("role", "Job title", "Product Analyst", { show: needs(["resignation", "application", "cover"]) }),
      f.text("company", "Company", "Zentro Payments", { show: needs(["resignation", "application", "cover"]) }),
      f.text("source", "Where you saw the job (optional)", "LinkedIn", { show: needs(["application", "cover"]) }),
      f.text("topic", "About (topic, proposal, invoice…)", "the Q3 vendor proposal", { show: needs(["followup", "meeting", "thanks", "apology", "reminder"]) }),
      f.text("when", "Dates or time", "12 to 14 November", { placeholder: "e.g. 12–14 Nov, Thursday 3 pm" }),
      f.text("cover", "Who covers for you (optional)", "Ananya", { show: needs(["leave", "sick"]) }),
      f.area("points", "Achievements to mention (one per line)", "Built a churn dashboard used by 40 people across sales and support\nCut monthly reporting time by 60% by automating SQL extracts\nLed A/B tests that lifted checkout conversion by 4%", { rows: 4, show: needs(["application", "cover"]) }),
      f.area("details", "Reason or extra details (optional)", "", { rows: 3, placeholder: "e.g. I have a family function out of town" }),
    ],
    build: (v) => {
      const { subject, body } = emailFor(v);
      const text = body.filter(Boolean).join("\n\n");
      const full = `Subject: ${subject}\n\n${text}`;
      return {
        outputs: [{ label: "Subject", value: subject }],
        code: text,
        lang: "text",
        download: { name: `${v.type}-email.txt`, mime: "text/plain" },
        stats: [
          { label: "Words", value: String(words(text)) },
          { label: "Reading time", value: `${Math.max(1, Math.round(words(text) / 200))} min` },
        ],
        checks: /\[[^\]]+\]/.test(full) ? [info("Fill in the parts in [brackets]", "They mark details only you know, such as a specific achievement or a fix you have made.")] : [],
      };
    },
  },

  "prompt-builder": {
    fields: [
      f.select("preset", "Prompt type", "developer", [["general", "General task"], ["developer", "Developer / coding"], ["writing", "Writing"], ["data", "Data analysis"]]),
      f.select("syntax", "Structure", "xml", [["xml", "XML tags"], ["markdown", "Markdown headings"]]),
      f.text("role", "Role for the AI (optional)", "a senior React developer who writes accessible, well-tested code"),
      f.area("task", "Task: what should it do?", "Write a React hook that debounces a search input and cancels stale fetch requests.", { rows: 3 }),
      f.area("context", "Context it cannot guess", "The app uses React 19 and TypeScript. Search hits /api/search?q=. Users on slow mobile networks type fast, so old responses sometimes overwrite newer ones.", { rows: 3 }),
      f.text("lang", "Language and versions", "TypeScript 5.6, React 19", { show: (v) => v.preset === "developer" }),
      f.area("input", "Material to work on (code, text, data)", "", { rows: 4, placeholder: "Paste code, a document or data here" }),
      f.area("constraints", "Rules and constraints (one per line)", "No external libraries\nUse AbortController\nKeep it under 40 lines", { rows: 3 }),
      f.select("format", "Answer format", "code", [["paragraphs", "Paragraphs"], ["bullets", "Bullet points"], ["table", "Table"], ["json", "JSON"], ["code", "Code with a short explanation"], ["steps", "Numbered steps"]]),
      f.select("length", "Length", "any", [["any", "As needed"], ["short", "Short (under 150 words)"], ["medium", "Medium (150–400 words)"], ["long", "Detailed"]]),
      f.select("tone", "Tone", "technical", [["neutral", "Neutral"], ["technical", "Technical"], ["friendly", "Friendly"], ["formal", "Formal"], ["persuasive", "Persuasive"]]),
      f.text("audience", "Audience (optional)", "", { placeholder: "e.g. beginners, my manager, customers" }),
      f.area("example", "Example of a good answer (optional)", "", { rows: 3 }),
      f.toggle("tests", "Include tests", true, { show: (v) => v.preset === "developer" }),
      f.toggle("ask", "Ask me questions first if anything is unclear", false),
      f.toggle("unsure", "Say so when unsure instead of guessing", true),
    ],
    build: (v) => {
      const FORMAT = { paragraphs: "Answer in clear paragraphs.", bullets: "Answer as concise bullet points.", table: "Present the answer as a table with clear column headings.", json: "Return only valid JSON, with no text before or after it.", code: "Return the code in one code block, followed by a short explanation of the key decisions.", steps: "Answer as numbered steps." };
      const LEN = { any: "", short: "Keep it under 150 words.", medium: "Aim for 150 to 400 words.", long: "Be thorough and detailed." };
      const rules = v.constraints.split(/\r?\n/).map((l) => l.replace(/^\s*[-*•]\s*/, "").trim()).filter(Boolean);
      if (v.preset === "developer" && v.lang.trim()) rules.unshift(`Use ${v.lang.trim()}.`);
      if (v.preset === "developer" && v.tests) rules.push("Include unit tests that cover the main behaviour and edge cases.");
      if (v.preset === "data") rules.push("State any assumptions about the data, and show the calculation behind each number.");
      if (v.preset === "writing" && v.audience.trim()) rules.push(`Write for ${v.audience.trim()}.`);
      if (v.unsure) rules.push("If you are not sure about something, say so rather than guessing.");
      const outputLines = [FORMAT[v.format], LEN[v.length], v.tone !== "neutral" ? `Use a ${v.tone} tone.` : "", v.audience.trim() && v.preset !== "writing" ? `The audience is ${v.audience.trim()}.` : ""].filter(Boolean);
      const sections = [];
      const X = v.syntax === "xml";
      const sec = (tag, title, body) => body && sections.push(X ? `<${tag}>\n${body}\n</${tag}>` : `## ${title}\n${body}`);
      const intro = v.role.trim() ? `You are ${v.role.trim().replace(/^(you are|act as)\s+/i, "").replace(/\.$/, "")}.` : "";
      sec("task", "Task", v.task.trim());
      sec("context", "Context", v.context.trim());
      sec(v.preset === "developer" ? "code" : "input", v.preset === "developer" ? "Existing code" : "Input", v.input.trim());
      sec("rules", "Rules", rules.map((r) => `- ${r.replace(/([^.!?])$/, "$1.")}`).join("\n"));
      sec("output_format", "Output format", outputLines.join(" "));
      sec("example", "Example of a good answer", v.example.trim());
      const closing = v.ask ? "Before you start, ask me any questions you need answered to do this well. Wait for my answers." : "";
      const prompt = [intro, ...sections, closing].filter(Boolean).join("\n\n");
      const checks = [];
      const tw = words(v.task);
      if (!tw) checks.push(bad("Describe the task"));
      else if (tw < 8) checks.push(warn("Task is very short", "Say what you want, for whom, and what 'done' looks like."));
      else checks.push(ok("Task is specific"));
      const vague = VAGUE.filter((w) => new RegExp(`\\b${w}\\b`, "i").test(v.task));
      if (vague.length) checks.push(warn(`Vague word${vague.length > 1 ? "s" : ""} in the task: ${vague.join(", ")}`, "Replace them with what you actually mean, such as 'under 200 words' or 'for a non-technical reader'."));
      checks.push(v.context.trim() ? ok("Context given") : warn("No context", "The model cannot see your project, audience or goal unless you tell it."));
      checks.push(rules.length ? ok(`${rules.length} rule${rules.length === 1 ? "" : "s"}`) : info("No constraints", "Limits such as length, libraries or style make answers more usable."));
      checks.push(v.example.trim() ? ok("Includes an example") : info("No example", "One short example of a good answer is the most reliable way to get the format you want."));
      return {
        code: prompt,
        lang: "text",
        download: { name: "prompt.txt", mime: "text/plain" },
        stats: [
          { label: "Words", value: String(words(prompt)) },
          { label: "Approx. tokens", value: String(Math.ceil(chars(prompt) / 4)) },
          { label: "Sections", value: String(sections.length) },
        ],
        checks,
      };
    },
  },
};

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
