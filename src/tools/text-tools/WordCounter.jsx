import { useMemo, useState } from "react";
import { BookOpen, Clock, Copy, Hash, Space, Trash2, Type, WholeWord } from "lucide-react";
import Seo from "../../components/Seo";
import SaasToolFrame, { useSaasTheme } from "../../components/SaasToolFrame";

const STEPS = [
  {
    title: "Drop the draft in",
    body: "Paste from Docs, a caption box, or start typing. The count begins on the first character.",
  },
  {
    title: "Check the numbers that matter",
    body: "Words, characters with and without spaces, sentences, paragraphs, and a rough read time sit beside the text.",
  },
  {
    title: "Copy it or clear the box",
    body: "Copy keeps the draft on your clipboard. Clear wipes the box for the next piece. We do not store either.",
  },
];

const REASONS = [
  {
    title: "You see the limit while you cut",
    body: "The totals move with the cursor. Trim a headline or stretch a thin paragraph without hopping to another tab.",
  },
  {
    title: "The draft stays in this browser",
    body: "Counting runs on your device. Close the tab and the text is gone. Nothing is sent to us for a tally.",
  },
  {
    title: "Both character figures are on the card",
    body: "Some forms count spaces, some do not. You get both, plus a read-time estimate at about 220 words a minute.",
  },
];

const FAQS = [
  {
    q: "Will this match Microsoft Word?",
    a: "Usually within a word or two. We split words on whitespace. Word can also count fields, footnotes, and some punctuation in its own way. If a journal or client gives you their counter, use that number for the submission.",
  },
  {
    q: "Do character counts include spaces?",
    a: "Both are listed. Characters includes spaces, tabs, and line breaks. No spaces drops every whitespace character. Check the field’s own rule before you trust one figure.",
  },
  {
    q: "Is my text uploaded?",
    a: "No. The math runs in your browser. We never receive the draft, and we do not keep a copy after you leave.",
  },
  {
    q: "Why is the sentence count higher than I expect?",
    a: "Periods inside abbreviations, decimals, and web addresses are treated as breaks. Use the sentence number as a guide, then skim the piece if the count has to be exact.",
  },
  {
    q: "What counts as a paragraph?",
    a: "A block separated by a line break. Soft wrapping inside the box does not create a new paragraph. One long block is one paragraph.",
  },
];

function countText(text) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean).length;
  const paragraphs = text.split(/\n+/).map((part) => part.trim()).filter(Boolean).length;
  const minutes = words === 0 ? 0 : Math.max(1, Math.round(words / 220));
  return { words, characters, charactersNoSpaces, sentences, paragraphs, minutes };
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const live = text.length > 0;

  return (
    <>
      <Seo page="wordCounter" />
      <SaasToolFrame
        kicker="Text"
        title="Word Counter"
        lede="Paste a draft and read the length as you edit. Words, characters, sentences, and paragraphs update on each keystroke."
        status={live ? "Fast processing" : "Ready"}
        statusLive={live}
        steps={STEPS}
        reasons={REASONS}
        faqs={FAQS}
        schemaPath="/text-tools/word-counter"
        schemaName="Word Counter"
        schemaDescription="Count words, characters, sentences, and paragraphs in the browser."
      >
        <CounterWorkspace text={text} setText={setText} />
      </SaasToolFrame>
    </>
  );
}

function CounterWorkspace({ text, setText }) {
  const surface = useSaasTheme();
  const [copied, setCopied] = useState(false);
  const stats = useMemo(() => countText(text), [text]);
  const live = text.length > 0;

  const copyText = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const tiles = [
    { label: "Words", value: stats.words, icon: WholeWord },
    { label: "Characters", value: stats.characters, icon: Type },
    { label: "No spaces", value: stats.charactersNoSpaces, icon: Space },
    { label: "Sentences", value: stats.sentences, icon: Hash },
    { label: "Paragraphs", value: stats.paragraphs, icon: BookOpen },
    {
      label: "Read time",
      value: stats.words === 0 ? "—" : stats.minutes === 1 ? "1 min" : `${stats.minutes} min`,
      icon: Clock,
    },
  ];

  return (
    <div className="grid gap-0 lg:grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.7fr)]">
      <div className={`p-4 sm:p-5 ${surface.dark ? "lg:border-r lg:border-slate-800" : "lg:border-r lg:border-slate-200"}`}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <label htmlFor="word-counter-input" className="text-xs font-semibold uppercase tracking-[0.14em]">
            Draft
          </label>
          <span className={`text-xs ${surface.muted}`}>{live ? "Updates as you type" : "Waiting for text"}</span>
        </div>
        <textarea
          id="word-counter-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste a paragraph, a caption, or a whole draft."
          className={`${surface.field} saas-tool-field`}
          spellCheck="true"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={copyText} disabled={!text} className={`${surface.primary} disabled:pointer-events-none disabled:opacity-40`}>
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            {copied ? "Copied" : "Copy text"}
          </button>
          <button type="button" onClick={() => setText("")} disabled={!text} className={`${surface.ghost} disabled:pointer-events-none disabled:opacity-40`}>
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Clear
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.14em] ${surface.muted}`}>
          Totals
        </p>
        <dl className="grid grid-cols-2 gap-2">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <div key={tile.label} className={surface.stat}>
                <dt className={`flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide ${surface.muted}`}>
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {tile.label}
                </dt>
                <dd className="mt-1.5 text-xl font-semibold tabular-nums tracking-tight">{tile.value}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
