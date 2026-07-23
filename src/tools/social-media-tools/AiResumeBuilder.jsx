import { useState } from "react";
import {
  FileUser,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell from "../../components/ToolHeroShell";

const TEMPLATES = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "compact", label: "Compact" },
];

const inputClass =
  "w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25 placeholder:text-slate-500";

function splitLines(text) {
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

function splitSkills(text) {
  return text
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildSummary(name, title, keywords) {
  const k = keywords.trim() || "results-driven professional";
  return `${name} is a ${title || "professional"} focused on ${k}. Known for clear communication, ownership, and delivering measurable outcomes across projects and teams.`;
}

function generateResume({ name, title, keywords, skills, experience, education, template }) {
  const skillList = splitSkills(skills);
  const expBullets = splitLines(experience);
  const eduLines = splitLines(education);
  const summary = buildSummary(name, title, keywords);

  const text = [
    name.toUpperCase(),
    title,
    "",
    "PROFESSIONAL SUMMARY",
    summary,
    "",
    "SKILLS",
    skillList.length ? skillList.join(" · ") : "Add your key skills",
    "",
    "EXPERIENCE",
    ...(expBullets.length ? expBullets.map((b) => `• ${b}`) : ["• Add experience highlights"]),
    "",
    "EDUCATION",
    ...(eduLines.length ? eduLines.map((e) => `• ${e}`) : ["• Add education details"]),
  ].join("\n");

  let html = "";
  if (template === "modern") {
    html = `
<div style="font-family:Georgia,serif;max-width:720px;margin:0 auto;color:#0f172a">
  <div style="border-left:4px solid #0ea5e9;padding-left:16px;margin-bottom:20px">
    <h1 style="margin:0;font-size:28px">${escapeHtml(name)}</h1>
    <p style="margin:4px 0 0;color:#0369a1;font-size:16px">${escapeHtml(title || "Professional")}</p>
  </div>
  <h2 style="font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#64748b">Summary</h2>
  <p style="line-height:1.6">${escapeHtml(summary)}</p>
  <h2 style="font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#64748b">Skills</h2>
  <p>${skillList.map(escapeHtml).join(" · ") || "—"}</p>
  <h2 style="font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#64748b">Experience</h2>
  <ul>${(expBullets.length ? expBullets : ["Add experience highlights"]).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>
  <h2 style="font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#64748b">Education</h2>
  <ul>${(eduLines.length ? eduLines : ["Add education details"]).map((e) => `<li>${escapeHtml(e)}</li>`).join("")}</ul>
</div>`.trim();
  } else if (template === "compact") {
    html = `
<div style="font-family:system-ui,sans-serif;max-width:720px;margin:0 auto;font-size:13px;color:#111">
  <strong style="font-size:18px">${escapeHtml(name)}</strong> — ${escapeHtml(title || "Professional")}<br/>
  <em>${escapeHtml(summary)}</em>
  <p style="margin:10px 0 4px"><strong>Skills:</strong> ${skillList.map(escapeHtml).join(", ") || "—"}</p>
  <p style="margin:8px 0 2px"><strong>Experience</strong></p>
  <ul style="margin:0;padding-left:18px">${(expBullets.length ? expBullets : ["Add experience highlights"]).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>
  <p style="margin:8px 0 2px"><strong>Education</strong></p>
  <ul style="margin:0;padding-left:18px">${(eduLines.length ? eduLines : ["Add education details"]).map((e) => `<li>${escapeHtml(e)}</li>`).join("")}</ul>
</div>`.trim();
  } else {
    html = `
<div style="font-family:'Times New Roman',Times,serif;max-width:720px;margin:0 auto;color:#000">
  <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:16px">
    <h1 style="margin:0;font-size:26px">${escapeHtml(name)}</h1>
    <p style="margin:4px 0 0">${escapeHtml(title || "Professional")}</p>
  </div>
  <h2 style="font-size:15px;border-bottom:1px solid #999">Professional Summary</h2>
  <p>${escapeHtml(summary)}</p>
  <h2 style="font-size:15px;border-bottom:1px solid #999">Skills</h2>
  <p>${skillList.map(escapeHtml).join(" | ") || "—"}</p>
  <h2 style="font-size:15px;border-bottom:1px solid #999">Experience</h2>
  <ul>${(expBullets.length ? expBullets : ["Add experience highlights"]).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>
  <h2 style="font-size:15px;border-bottom:1px solid #999">Education</h2>
  <ul>${(eduLines.length ? eduLines : ["Add education details"]).map((e) => `<li>${escapeHtml(e)}</li>`).join("")}</ul>
</div>`.trim();
  }

  return { text, html };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default function AiResumeBuilder() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [template, setTemplate] = useState("classic");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const handleGenerate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setOutput(
      generateResume({
        name: name.trim(),
        title: title.trim(),
        keywords,
        skills,
        experience,
        education,
        template,
      })
    );
    setLoading(false);
  };

  const copyText = async () => {
    if (!output?.text) return;
    await navigator.clipboard.writeText(output.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyHtml = async () => {
    if (!output?.html) return;
    await navigator.clipboard.writeText(output.html);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  return (
    <>
      <Seo page="aiResumeBuilder" />

      <ToolHeroShell
        icon={FileUser}
        title="AI Resume Builder"
        subtitle="Enter your details, pick a template, and generate a formatted resume preview you can copy as text or HTML."
        category="social-media-tools"
        wide={Boolean(output)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="res-name">
              Full name
            </label>
            <input
              id="res-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="res-title">
              Job title
            </label>
            <input
              id="res-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product Designer"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="res-keywords">
            Summary keywords
          </label>
          <input
            id="res-keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="UX research, design systems, cross-functional collaboration"
            className={inputClass}
          />
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="res-skills">
            Skills (comma-separated)
          </label>
          <input
            id="res-skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Figma, Prototyping, Accessibility, HTML/CSS"
            className={inputClass}
          />
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="res-exp">
            Experience bullets
          </label>
          <textarea
            id="res-exp"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            rows={5}
            placeholder={"Led redesign of checkout flow (+12% conversion)\nPartnered with engineering on design system v2"}
            className={inputClass}
          />
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="res-edu">
            Education
          </label>
          <textarea
            id="res-edu"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            rows={3}
            placeholder={"B.A. Design, State University — 2018\nUX Certificate, Online Academy — 2020"}
            className={inputClass}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Template</label>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id)}
                  className={`rounded-2xl border px-3 py-1.5 text-sm transition ${
                    template === t.id
                      ? "border-indigo-400 bg-indigo-500/20 text-indigo-200"
                      : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !name.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating..." : "Generate Resume"}
          </button>
        </div>

        {output && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-semibold text-white">
                <FileUser className="h-4 w-4" /> Resume preview
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyText}
                  className="inline-flex items-center gap-1 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-sm text-slate-200 transition hover:border-slate-500"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied text" : "Copy text"}
                </button>
                <button
                  type="button"
                  onClick={copyHtml}
                  className="inline-flex items-center gap-1 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-sm text-slate-200 transition hover:border-slate-500"
                >
                  {copiedHtml ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copiedHtml ? "Copied HTML" : "Copy HTML"}
                </button>
              </div>
            </div>

            <div
              className="rounded-2xl border border-slate-700 bg-white p-5 text-slate-900 shadow-sm"
              dangerouslySetInnerHTML={{ __html: output.html }}
            />

            <details className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3 text-sm">
              <summary className="cursor-pointer font-medium text-slate-300">Plain text version</summary>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-slate-300">{output.text}</pre>
            </details>
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent
        category="social-media-tools"
        currentToolPath="/social-media-tools/ai-resume-builder" />
    </>
  );
}
