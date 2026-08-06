/** Offline template / heuristic generators for AI-style utility tools. */

const lines = (text) =>
  String(text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

const first = (text, fallback = "topic") => lines(text)[0] || fallback;
const titleCase = (s) =>
  String(s)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const bullets = (items) => items.map((i, idx) => `${idx + 1}. ${i}`).join("\n");

export const aiTransforms = {
  ai_title: async (input) => {
    const t = first(input, "your topic");
    return [
      `${titleCase(t)}: A Practical Guide for 2026`,
      `How to Master ${titleCase(t)} Without the Fluff`,
      `${titleCase(t)} Explained: Tips, Tools, and Examples`,
      `The Complete ${titleCase(t)} Checklist`,
      `Why ${titleCase(t)} Matters (And How to Start Today)`,
    ].join("\n");
  },

  blog_outline: async (input) => {
    const t = titleCase(first(input));
    return `# ${t}\n\n## Introduction\n- Hook and problem statement\n- Who this is for\n\n## What is ${t}?\n- Simple definition\n- Why it matters now\n\n## Step-by-step guide\n1. Prep\n2. Core process\n3. Common mistakes\n\n## Tools & examples\n- Recommended stack\n- Mini case study\n\n## FAQ\n- 3–5 reader questions\n\n## Conclusion\n- Recap + CTA`;
  },

  meta_description: async (input) => {
    const t = first(input);
    const d = `Learn ${t} with clear steps, practical tips, and examples. Free guide on FreeToolsPro—start in minutes.`.slice(
      0,
      155
    );
    return d;
  },

  faq_gen: async (input) => {
    const t = titleCase(first(input));
    return [
      `Q: What is ${t}?`,
      `A: ${t} is a practical approach you can use to get clearer results faster.`,
      ``,
      `Q: Who should use ${t}?`,
      `A: Beginners and busy professionals who want a simple, reliable workflow.`,
      ``,
      `Q: How long does ${t} take?`,
      `A: Most people can complete a first pass in under 30 minutes.`,
      ``,
      `Q: What mistakes should I avoid with ${t}?`,
      `A: Skipping basics, overcomplicating the first draft, and not measuring outcomes.`,
    ].join("\n");
  },

  product_desc: async (input) => {
    const [name, feature = "reliable performance", audience = "everyday users"] = lines(input);
    return `${titleCase(name || "Product")}\n\nBuilt for ${audience}, this product delivers ${feature}. Clean design, practical features, and value that shows up from day one.\n\nKey benefits:\n- Fast to set up\n- Easy to use\n- Built for real workflows\n\nGet started today.`;
  },

  email_gen: async (input) => {
    const t = first(input, "following up");
    return `Subject: Quick note about ${t}\n\nHi {{name}},\n\nI wanted to share a short update on ${t}. Happy to jump on a quick call if useful.\n\nBest,\n{{your name}}`;
  },

  cover_letter: async (input) => {
    const [role = "the role", company = "your company", skill = "relevant experience"] = lines(input);
    return `Dear Hiring Manager,\n\nI’m excited to apply for ${role} at ${company}. I’ve built ${skill} and enjoy solving practical problems with clear communication.\n\nI’d welcome the chance to contribute and learn more about your team’s goals.\n\nSincerely,\n{{your name}}`;
  },

  linkedin_post: async (input) => {
    const t = first(input);
    return `3 lessons from working on ${t}:\n\n1) Start simple\n2) Measure what matters\n3) Ship, then refine\n\nWhat’s one tip you’d add?\n\n#${t.replace(/\s+/g, "")} #Learning`;
  },

  tweet_gen: async (input) => {
    const t = first(input);
    return [
      `${t} tip: start smaller than you think. Consistency beats intensity.`,
      `If you’re stuck on ${t}, write the ugly first draft. Clarity comes second.`,
      `Hot take: most ${t} advice fails because it skips the boring basics.`,
    ].join("\n\n");
  },

  ig_caption: async (input) => {
    const t = first(input);
    return `${titleCase(t)} in real life ✨\n\nSave this for later.\n\n#${t.replace(/\s+/g, "")} #tips #daily`;
  },

  rewrite: async (input) => {
    const t = input.trim();
    if (!t) throw new Error("Paste text to rewrite");
    return t
      .replace(/\bvery\b/gi, "highly")
      .replace(/\bget\b/gi, "receive")
      .replace(/\bhelp\b/gi, "support")
      .replace(/\buse\b/gi, "utilize")
      .replace(/\bstart\b/gi, "begin");
  },

  tone_change: async (input) => {
    const [tone = "professional", ...rest] = lines(input);
    const body = rest.join(" ") || "Please review the attached update.";
    if (/casual/i.test(tone)) return `Hey — ${body} Let me know what you think!`;
    if (/friendly/i.test(tone)) return `Hi there! ${body} Happy to help if you need anything.`;
    return `Hello,\n\n${body}\n\nThank you.`;
  },

  simplify: async (input) => {
    return input
      .replace(/\butilize\b/gi, "use")
      .replace(/\bapproximately\b/gi, "about")
      .replace(/\bin order to\b/gi, "to")
      .replace(/\bdue to the fact that\b/gi, "because")
      .replace(/\bthereafter\b/gi, "then");
  },

  proofread: async (input) => {
    const issues = [];
    if (/\si\s/.test(input)) issues.push("Capitalize standalone “I”.");
    if (/!!+/.test(input)) issues.push("Reduce repeated exclamation marks.");
    if (/\t  +/.test(input) || /  {2,}/.test(input)) issues.push("Collapse extra spaces.");
    if (!/[.!?]$/.test(input.trim())) issues.push("Consider ending the final sentence with punctuation.");
    const cleaned = input.replace(/[ \t]{2,}/g, " ").replace(/\bi\b/g, "I").trim();
    return {
      output: cleaned,
      meta: issues.length ? `Notes:\n- ${issues.join("\n- ")}` : "No major surface issues found.",
    };
  },

  code_review: async (input) => {
    const notes = [];
    if (/var\s/.test(input)) notes.push("Prefer let/const over var.");
    if (/==(?!=)/.test(input)) notes.push("Use === instead of ==.");
    if (/console\.log/.test(input)) notes.push("Remove debug console.log before shipping.");
    if (!/try|catch|Error/.test(input) && /fetch\(|await /.test(input))
      notes.push("Add error handling around async calls.");
    if (!notes.length) notes.push("No obvious style issues in a quick pass—still run tests.");
    return `Code review notes:\n${bullets(notes)}`;
  },

  bug_finder: async (input) => {
    const bugs = [];
    if (/for\s*\(.*;;/.test(input)) bugs.push("Possible infinite for-loop pattern.");
    if (/JSON\.parse\([^)]+\)(?!\s*catch)/.test(input) && !/try/.test(input))
      bugs.push("JSON.parse without try/catch can throw.");
    if (/innerHTML\s*=/.test(input)) bugs.push("innerHTML assignment may create XSS risk.");
    if (/password.*=.*['"]/.test(input)) bugs.push("Hard-coded secret-like string detected.");
    if (!bugs.length) bugs.push("No obvious bug patterns detected in a static scan.");
    return bullets(bugs);
  },

  json_gen: async (input) => {
    const keys = lines(input).length ? lines(input) : ["id", "name", "email"];
    const obj = Object.fromEntries(
      keys.map((k) => [k.replace(/\s+/g, "_").toLowerCase(), k.includes("id") ? 1 : `sample_${k}`])
    );
    return JSON.stringify(obj, null, 2);
  },

  unit_test_gen: async (input) => {
    const name = first(input, "fn").replace(/[^a-zA-Z0-9_]/g, "") || "fn";
    return `import { ${name} } from "./${name}";\n\ndescribe("${name}", () => {\n  it("handles a basic case", () => {\n    expect(${name}(/* input */)).toBeDefined();\n  });\n\n  it("handles edge cases", () => {\n    expect(() => ${name}(null)).not.toThrow();\n  });\n});`;
  },

  css_gen: async (input) => {
    const t = first(input, "card");
    return `.${t.replace(/\s+/g, "-").toLowerCase()} {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 16px;\n  border-radius: 12px;\n  border: 1px solid #e5e7eb;\n  background: #fff;\n}`;
  },

  react_component: async (input) => {
    const name = titleCase(first(input, "Widget")).replace(/\s+/g, "") || "Widget";
    return `export default function ${name}({ title = "${name}" }) {\n  return (\n    <section className="${name.toLowerCase()}">\n      <h2>{title}</h2>\n      <p>Build your ${name} UI here.</p>\n    </section>\n  );\n}\n`;
  },

  keyword_gen: async (input) => {
    const t = first(input).toLowerCase();
    return [
      t,
      `best ${t}`,
      `${t} guide`,
      `${t} for beginners`,
      `how to ${t}`,
      `${t} tools`,
      `${t} examples`,
      `${t} checklist`,
      `${t} tips`,
      `${t} 2026`,
    ].join("\n");
  },

  keyword_cluster: async (input) => {
    const t = first(input).toLowerCase();
    return `Cluster A — Informational\n- what is ${t}\n- ${t} meaning\n- ${t} examples\n\nCluster B — Commercial\n- best ${t}\n- ${t} tools\n- ${t} pricing\n\nCluster C — Transactional\n- buy ${t}\n- ${t} near me\n- ${t} free trial`;
  },

  internal_links: async (input) => {
    const t = titleCase(first(input));
    return [
      `From intro → link to “${t} basics” guide`,
      `From steps → link to related calculator/tool page`,
      `From FAQ → link to glossary term for ${t}`,
      `From conclusion → link to next article in series`,
      `Add breadcrumb + contextual anchor text (avoid “click here”)`,
    ].join("\n");
  },

  content_optimizer: async (input) => {
    const words = input.trim().split(/\s+/).filter(Boolean).length;
    const tips = [];
    if (words < 300) tips.push("Expand past 300 words for depth.");
    if (!/#|\n## /.test(input) && !/^#/m.test(input)) tips.push("Add clear H2/H3 headings.");
    if (!/\?/.test(input)) tips.push("Add FAQ-style questions readers ask.");
    if (!/https?:\/\//.test(input)) tips.push("Cite at least one source URL.");
    if (!tips.length) tips.push("Solid structure—tighten intro and CTA.");
    return { output: bullets(tips), meta: `${words} words analyzed.` };
  },

  readability: async (input) => {
    const sentences = input.split(/[.!?]+/).filter((s) => s.trim()).length || 1;
    const words = input.trim().split(/\s+/).filter(Boolean).length;
    const avg = words / sentences;
    const score = avg <= 14 ? "Easy" : avg <= 20 ? "Okay" : "Hard";
    return {
      output: `Readability: ${score}\nAvg words/sentence: ${avg.toFixed(1)}\nWords: ${words}\nSentences: ${sentences}`,
      meta: "Heuristic only—not Flesch-Kincaid certified.",
    };
  },

  heading_optimizer: async (input) => {
    return lines(input || "introduction\nsteps\nconclusion")
      .map((h, i) => `${i === 0 ? "# " : "## "}${titleCase(h)}`)
      .join("\n");
  },

  ad_copy: async (input) => {
    const t = first(input);
    return `Headline: Get better results with ${t}\nPrimary text: Stop guessing. Use a clearer ${t} workflow that saves time.\nCTA: Try it free`;
  },

  google_ads: async (input) => {
    const t = titleCase(first(input));
    return [`${t} Made Simple`, `Best ${t} Tools`, `${t} in Minutes`, `Try ${t} Free`, `Improve Your ${t}`].join(
      "\n"
    );
  },

  facebook_ad: async (input) => {
    const t = first(input);
    return `Primary text: Struggling with ${t}? Here’s a simpler way that actually sticks.\nHeadline: Smarter ${titleCase(t)}\nDescription: Free tools. No signup wall.\nCTA: Learn More`;
  },

  yt_title: async (input) => {
    const t = titleCase(first(input));
    return [`${t} in 10 Minutes (Beginner Guide)`, `I Tried ${t} — Here’s What Worked`, `${t} Tips You Need in 2026`].join(
      "\n"
    );
  },

  thumbnail_text: async (input) => {
    const t = first(input).toUpperCase().slice(0, 18);
    return [`${t}`, `DO THIS`, `WATCH THIS`, `SIMPLE TIPS`].join("\n");
  },

  landing_copy: async (input) => {
    const t = titleCase(first(input));
    return `# ${t}\n\n## Hero\nGet clearer results with ${t}—without the busywork.\n\nCTA: Start free\n\n## Benefits\n- Faster setup\n- Cleaner workflow\n- Practical examples\n\n## Social proof\nTrusted by people who ship weekly.\n\n## Final CTA\nTry ${t} now`;
  },

  cta_gen: async (input) => {
    const t = first(input, "get started");
    return [`Start ${t} free`, `Try ${t} now`, `Get my ${t} checklist`, `Book a quick demo`, `Download the guide`].join(
      "\n"
    );
  },

  slogan_gen: async (input) => {
    const t = titleCase(first(input, "Brand"));
    return [`${t}: Clarity that ships.`, `Built for ${t}. Loved daily.`, `${t}—less noise, more progress.`].join("\n");
  },

  brand_name: async (input) => {
    const t = first(input, "nova").replace(/\s+/g, "");
    return [`${titleCase(t)}ly`, `${titleCase(t)}Kit`, `Get${titleCase(t)}`, `${titleCase(t)}Forge`, `Open${titleCase(t)}`].join(
      "\n"
    );
  },

  meeting_summary: async (input) => {
    const pts = lines(input);
    return `Meeting summary\n\nKey points:\n${bullets(pts.slice(0, 6).length ? pts.slice(0, 6) : ["Discussed progress", "Agreed next steps"])}\n\nAction items:\n- Owner TBD — follow up this week\n- Share notes with attendees`;
  },

  mom_gen: async (input) => {
    const pts = lines(input);
    return `Minutes of Meeting\nDate: ${new Date().toLocaleDateString("en-IN")}\nAttendees: {{names}}\n\nDiscussions:\n${bullets(pts.length ? pts : ["Project status", "Risks", "Timeline"])}\n\nDecisions:\n- Proceed with agreed plan\n\nAction items:\n- Assign owners and due dates`;
  },

  task_extract: async (input) => {
    const tasks = lines(input)
      .filter((l) => /should|need|todo|action|must|will/i.test(l) || /^-|\d+\./.test(l))
      .slice(0, 12);
    return bullets(tasks.length ? tasks.map((t) => t.replace(/^[-*\d.)\s]+/, "")) : ["Define next milestone", "Send update email"]);
  },

  proposal_gen: async (input) => {
    const t = titleCase(first(input, "Project"));
    return `# Business Proposal: ${t}\n\n## Objective\nDeliver ${t} with clear scope and timeline.\n\n## Scope\n- Discovery\n- Implementation\n- Review\n\n## Timeline\n2–4 weeks (adjust as needed)\n\n## Investment\n{{pricing}}\n\n## Next step\nApprove scope to begin.`;
  },

  invoice_desc: async (input) => {
    const t = first(input, "Professional services");
    return `Description: ${titleCase(t)}\nDetails: Scope delivered as discussed, including planning, execution, and delivery review.`;
  },

  exec_summary: async (input) => {
    const t = first(input, "the initiative");
    return `Executive summary\n\nWe recommend moving forward with ${t}. Expected impact is clearer execution and measurable outcomes within one quarter. Risks are manageable with weekly check-ins.`;
  },

  ats_resume: async (input) => {
    const tips = [];
    if (!/experience|skills|education/i.test(input)) tips.push("Add clear Experience / Skills / Education headings.");
    if (input.length < 400) tips.push("Expand with quantified achievements.");
    if (/[^\x00-\x7F]/.test(input)) tips.push("Prefer standard ASCII punctuation for ATS parsers.");
    if (!tips.length) tips.push("Structure looks ATS-friendly at a glance.");
    return bullets(tips);
  },

  resume_optimize: async (input) => {
    return `Optimization suggestions:\n${bullets([
      "Lead bullets with strong verbs (Led, Built, Improved).",
      "Add metrics (%, time saved, revenue, users).",
      "Mirror keywords from the job description.",
      "Keep to 1 page if under ~7 years experience.",
    ])}\n\nRewritten sample bullet:\n- ${first(input, "Improved process efficiency by streamlining reporting workflows.")}`;
  },

  jd_analyzer: async (input) => {
    const must = [...input.matchAll(/\b(must|required|proficient in)\b[^.!\n]*/gi)].map((m) => m[0]);
    return {
      output: `Must-have signals:\n${bullets(must.slice(0, 8).length ? must.slice(0, 8) : ["List hard skills from JD", "Note years of experience", "Call out tools/stack"])}`,
      meta: "Heuristic extraction from pasted JD text.",
    };
  },

  salary_negotiate: async (input) => {
    const role = first(input, "this role");
    return `Negotiation script for ${role}:\n\n1) Thanks + enthusiasm\n2) Market range you researched\n3) Your unique value (2 bullets)\n4) Ask: “Is there flexibility to meet ₹X?”\n5) Trade-offs: bonus, WFH, review in 6 months`;
  },

  skill_gap: async (input) => {
    const [have = "html, css", need = "react, typescript"] = input.split(/\n---\n|vs/i);
    const haveSet = new Set(
      have
        .split(/[,\n]/)
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    );
    const needList = need
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const gaps = needList.filter((s) => !haveSet.has(s.toLowerCase()));
    return `Skill gaps:\n${bullets(gaps.length ? gaps : ["No obvious gaps from the lists provided"])}`;
  },

  flashcards: async (input) => {
    const topics = lines(input);
    return (topics.length ? topics : ["Variable", "Function", "Loop"])
      .map((t) => `Q: What is ${t}?\nA: A concise definition of ${t} in your own words.\n`)
      .join("\n");
  },

  quiz_gen: async (input) => {
    const t = titleCase(first(input, "Topic"));
    return `Quiz: ${t}\n\n1) What best describes ${t}?\n   a) Option A\n   b) Option B\n   c) Option C\n\n2) Which step comes first in ${t}?\n   a) Plan\n   b) Skip ahead\n   c) Guess\n\nAnswer key: 1-a, 2-a`;
  },

  study_notes: async (input) => {
    const t = titleCase(first(input));
    return `# Study notes: ${t}\n\n## Core idea\n${t} in one sentence.\n\n## Key points\n- Point 1\n- Point 2\n- Point 3\n\n## Example\nWalk through a tiny example.\n\n## Recall check\nExplain ${t} without notes.`;
  },

  eli10: async (input) => {
    const t = first(input, "this idea");
    return `${titleCase(t)} is like a simple tool that helps you do a job more easily. Imagine building with blocks: you start with one block, then add more until it works. That’s the idea.`;
  },

  code_tutor: async (input) => {
    return `Tutor notes:\n${bullets([
      `Goal: understand ${first(input, "this code")}`,
      "Read top-to-bottom and name each function out loud.",
      "Trace one input through the happy path.",
      "Change one line and predict the result before running.",
    ])}`;
  },

  formula_explain: async (input) => {
    const f = first(input, "EMI = P×r×(1+r)^n / ((1+r)^n−1)");
    return `Formula: ${f}\n\nPlain English:\nEach symbol is a part of the calculation. Plug in your numbers carefully, keep units consistent, and check a known example to verify.`;
  },

  essay_improve: async (input) => {
    return `Improvement plan:\n${bullets([
      "Tighten the thesis in sentence 1.",
      "One idea per paragraph.",
      "Replace vague words with specifics.",
      "Add one concrete example.",
      "End with a clear takeaway.",
    ])}\n\nEdited opening:\n${first(input, "Your topic")} matters because it affects real decisions people make every week.`;
  },

  alt_text: async (input) => {
    const t = first(input, "image subject");
    return `Alt: ${titleCase(t)} shown clearly in the frame, useful for understanding the page content.`;
  },

  image_caption: async (input) => {
    const t = first(input, "scene");
    return `Caption: ${titleCase(t)} — a quick visual that supports the story above.`;
  },

  ocr_clean: async (input) =>
    input
      .replace(/[|]/g, "I")
      .replace(/\r/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim(),

  color_palette: async (input) => {
    const seed = [...first(input, "brand")].reduce((a, c) => a + c.charCodeAt(0), 0);
    const hex = (n) =>
      `#${((seed * (n + 3) * 9973) >>> 0).toString(16).padStart(6, "0").slice(0, 6)}`;
    return [hex(1), hex(2), hex(3), hex(4), hex(5)].join("\n");
  },

  image_prompt: async (input) => {
    const t = first(input, "product photo");
    return `Create a clean, high-resolution image of ${t}, soft daylight, minimal background, sharp focus, natural colors, no text overlay.`;
  },

  bg_description: async (input) => {
    const t = first(input, "workspace");
    return `Background: soft-focus ${t} environment with gentle gradients, uncluttered composition, and calm lighting that keeps the subject readable.`;
  },

  prompt_enhance: async (input) => {
    const t = input.trim() || "Write a helpful answer";
    return `${t}\n\nConstraints:\n- Be specific and actionable\n- Use short sections\n- Include one example\n- End with a checklist`;
  },

  prompt_shorten: async (input) => {
    const t = input.trim();
    return t.length <= 180 ? t : `${t.slice(0, 160).trim()}…\n\nKeep answers concise.`;
  },

  prompt_debug: async (input) => {
    const tips = [];
    if (input.length < 40) tips.push("Prompt is thin—add role, goal, and constraints.");
    if (!/example|e\.g\.|for instance/i.test(input)) tips.push("Add an example of desired output.");
    if (!/format|json|bullet|markdown/i.test(input)) tips.push("Specify output format.");
    if (!tips.length) tips.push("Prompt structure looks usable.");
    return bullets(tips);
  },

  prompt_translate: async (input) => {
    const [lang = "Hindi", ...rest] = lines(input);
    const prompt = rest.join("\n") || "Explain this simply.";
    return `Translate the following prompt intent into ${lang}, keeping instructions clear:\n\n"""${prompt}"""\n\nThen answer in ${lang}.`;
  },

  prompt_library: async () =>
    [
      "Role: senior editor. Task: tighten this draft for clarity.",
      "Role: SQL tutor. Task: explain this query line by line.",
      "Role: product marketer. Task: write 5 benefit-led bullets.",
      "Role: interviewer. Task: ask 8 follow-ups from this resume.",
    ].join("\n\n"),

  prompt_compare: async (input) => {
    const [a = "Prompt A", b = "Prompt B"] = input.split(/\n---\n/);
    return `Version A length: ${a.trim().length}\nVersion B length: ${b.trim().length}\n\nPick the version with clearer role + format + constraints.\nA preview: ${a.trim().slice(0, 120)}\nB preview: ${b.trim().slice(0, 120)}`;
  },

  prompt_score: async (input) => {
    let score = 40;
    if (input.length > 80) score += 15;
    if (/role|you are/i.test(input)) score += 15;
    if (/format|json|markdown|bullet/i.test(input)) score += 15;
    if (/example/i.test(input)) score += 15;
    return { output: `Prompt quality score: ${Math.min(score, 100)}/100`, meta: "Heuristic checklist score." };
  },

  role_prompt: async (input) => {
    const role = first(input, "expert assistant");
    return `You are ${role}. Goal: help the user succeed with clear, practical steps.\nAsk clarifying questions only when needed.\nReturn: short answer + checklist.`;
  },

  csv_clean: async (input) =>
    lines(input)
      .map((l) => l.replace(/\s+,/g, ",").replace(/,\s+/g, ",").replace(/"{2,}/g, '"'))
      .join("\n"),

  json_clean: async (input) => JSON.stringify(JSON.parse(input), null, 2),

  duplicate_finder: async (input) => {
    const rows = lines(input);
    const seen = new Map();
    rows.forEach((r) => seen.set(r, (seen.get(r) || 0) + 1));
    const dups = [...seen.entries()].filter(([, c]) => c > 1);
    return dups.length
      ? dups.map(([r, c]) => `${c}×  ${r}`).join("\n")
      : "No duplicate lines found.";
  },

  data_summarizer: async (input) => {
    const rows = lines(input);
    return `Rows: ${rows.length}\nApprox columns (row1): ${(rows[0] || "").split(",").length}\nPreview:\n${rows.slice(0, 5).join("\n")}`;
  },

  sql_to_csv: async (input) => {
    // naive: extract VALUES rows
    const vals = [...input.matchAll(/\(([^)]+)\)/g)].map((m) => m[1]);
    if (!vals.length) return "id,name\n1,sample";
    return vals.map((v) => v.replace(/'/g, "").trim()).join("\n");
  },

  csv_visualizer: async (input) => {
    const rows = lines(input);
    const headers = (rows[0] || "col1,col2").split(",");
    return `Detected columns: ${headers.join(" | ")}\nData rows: ${Math.max(rows.length - 1, 0)}\nTip: chart numeric columns in your spreadsheet or BI tool.`;
  },

  workflow_gen: async (input) => {
    const t = titleCase(first(input, "Process"));
    return `Workflow: ${t}\n1) Trigger\n2) Validate input\n3) Transform / enrich\n4) Notify stakeholders\n5) Log result + errors`;
  },

  sop_gen: async (input) => {
    const t = titleCase(first(input, "Operation"));
    return `# SOP: ${t}\n\nPurpose:\nStandardize ${t}.\n\nSteps:\n1. Prepare inputs\n2. Execute core task\n3. QA check\n4. Record outcome\n\nOwner: {{role}}\nTools: {{stack}}`;
  },

  checklist_gen: async (input) => {
    const t = first(input, "launch");
    return bullets([
      `Define ${t} goal`,
      "List required assets",
      "Assign owners",
      "Run dry run",
      "Ship + monitor",
    ]);
  },

  email_automation: async (input) => {
    const t = first(input, "onboarding");
    return `Automation: ${t}\nTrigger: form submit / signup\nEmail 1 (T+0): Welcome + next step\nEmail 2 (T+2d): Tips + resource\nEmail 3 (T+5d): Soft CTA / upgrade`;
  },

  zapier_ideas: async (input) => {
    const t = first(input, "leads");
    return bullets([
      `New ${t} → Google Sheet row`,
      `New ${t} → Slack alert`,
      `Form submit → CRM + welcome email`,
      `Paid invoice → accounting label`,
    ]);
  },

  n8n_workflow: async (input) => {
    const t = first(input, "sync");
    return `n8n sketch for ${t}:\n1) Webhook / Schedule Trigger\n2) HTTP Request (API)\n3) IF (status ok)\n4) Set / Function transform\n5) Destination node (Sheet/DB/Slack)\n6) Error Trigger → notify`;
  },

  api_integration: async (input) => {
    const t = first(input, "service");
    return `Integration plan for ${t}:\n- Auth: API key / OAuth\n- Endpoints needed: list, create, webhook\n- Map fields + idempotency key\n- Retries + rate limits\n- Log request ids for support`;
  },

  website_auditor: async (input) => {
    const url = first(input, "https://example.com");
    return `AI website audit checklist for ${url}:\n${bullets([
      "Title/meta unique per page?",
      "H1 present and singular?",
      "Images have alt text?",
      "Mobile layout readable?",
      "Core pages linked from home?",
      "HTTPS + basic security headers?",
      "Slow third-party scripts?",
      "404s / redirect chains?",
    ])}`;
  },

  seo_audit_ai: async (input) => {
    const url = first(input, "page topic");
    return `SEO audit for ${url}:\n${bullets([
      "Primary keyword in title + H1",
      "Meta description 140–160 chars",
      "Internal links with descriptive anchors",
      "FAQ block for People Also Ask",
      "Compress hero media",
      "Canonical set correctly",
    ])}`;
  },

  readme_ai: async (input) => {
    const t = titleCase(first(input, "Project"));
    return `# ${t}\n\n## Overview\n${t} helps you get work done faster.\n\n## Install\n\`\`\`bash\nnpm install\n\`\`\`\n\n## Usage\n\`\`\`bash\nnpm start\n\`\`\`\n\n## License\nMIT`;
  },
};
