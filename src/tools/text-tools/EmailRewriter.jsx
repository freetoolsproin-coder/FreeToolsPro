import { useMemo, useState } from "react";
import { Mail, Copy, Check, RefreshCw } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const TONES = {
  Professional: {
    greet: "Dear Team,",
    close: "Best regards",
    swaps: [
      [/\bhey\b/gi, "Hello"],
      [/thanks a lot/gi, "Thank you"],
      [/\basap\b/gi, "as soon as possible"],
      [/\bgonna\b/gi, "going to"],
      [/\bwanna\b/gi, "want to"],
    ],
  },
  Friendly: {
    greet: "Hi there,",
    close: "Cheers",
    swaps: [
      [/Dear\s+/gi, "Hi "],
      [/I am writing to/gi, "Just wanted to"],
      [/Please be advised/gi, "Quick note:"],
    ],
  },
  Concise: {
    greet: "",
    close: "Thanks",
    swaps: [
      [/I hope this (email|message) finds you well[.,]?\s*/gi, ""],
      [/Just wanted to reach out (to|and)\s*/gi, ""],
      [/in order to/gi, "to"],
      [/at this point in time/gi, "now"],
    ],
  },
  Persuasive: {
    greet: "Hi,",
    close: "Looking forward to your reply",
    swaps: [
      [/I think/gi, "I'm confident"],
      [/maybe we could/gi, "let's"],
      [/would you mind/gi, "could you"],
    ],
  },
  Formal: {
    greet: "Dear Sir/Madam,",
    close: "Yours sincerely",
    swaps: [
      [/\bHi\b/gi, "Dear"],
      [/\bHey\b/gi, "Dear"],
      [/\bThanks\b/gi, "Thank you"],
      [/\bcan't\b/gi, "cannot"],
      [/\bwon't\b/gi, "will not"],
    ],
  },
};

function rewriteEmail(text, tone) {
  if (!text.trim()) return "";
  const cfg = TONES[tone] || TONES.Professional;
  let body = text.trim();
  for (const [re, rep] of cfg.swaps) body = body.replace(re, rep);
  const lines = body.split(/\n+/).filter(Boolean);
  const hasGreeting = /^(hi|hello|dear|hey)\b/i.test(lines[0] || "");
  const parts = [];
  if (cfg.greet && !hasGreeting) parts.push(cfg.greet, "");
  parts.push(body);
  if (cfg.close && !/regards|sincerely|cheers|thanks\b/i.test(body.slice(-80))) {
    parts.push("", cfg.close);
  }
  return parts.join("\n");
}

export default function EmailRewriter() {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("Professional");
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => rewriteEmail(input, tone), [input, tone]);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="emailRewriter" />
      <ToolHeroShell
        icon={Mail}
        title="Email Rewriter"
        subtitle="Rewrite any email into a clearer tone—professional, friendly, concise, persuasive, or formal."
        category="text-tools"
        layout="stack"
        formLabel="Rewrite email"
      >
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="tone">
            Tone
          </label>
          <select id="tone" value={tone} onChange={(e) => setTone(e.target.value)} className={selectDark}>
            {Object.keys(TONES).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="email-in">
              Original email
            </label>
            <textarea
              id="email-in"
              rows={14}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your draft email…"
              className={textareaDark}
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="email-out">
                Rewritten
              </label>
              <button type="button" onClick={copy} disabled={!output} className="age-btn-ghost px-3 py-1.5 text-xs">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea
              id="email-out"
              readOnly
              rows={14}
              value={output}
              placeholder="Rewritten email appears here…"
              className={textareaDark}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setInput("")}
          className="age-btn-ghost mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm"
        >
          <RefreshCw className="h-4 w-4" /> Clear
        </button>
      </ToolHeroShell>
      <ToolContentLayout
        category="text-tools"
        currentToolPath="/text-tools/email-rewriter"
        faqs={[
          { q: "Is this Email Rewriter free?", a: "Yes. Rewrite drafts freely—no account required." },
          {
            q: "Is my email uploaded?",
            a: "No. Rewrites run in your browser; nothing is stored on our servers.",
          },
          {
            q: "Which tones are available?",
            a: "Professional, Friendly, Concise, Persuasive, and Formal.",
          },
        ]}
      />
    </>
  );
}
