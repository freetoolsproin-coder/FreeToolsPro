import { useState } from "react";
import { BookOpen, Copy, Check, RefreshCw, Sparkles } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolPageContent from "../../components/ToolPageContent";

const GENRES = ["Fantasy", "Mystery", "Sci-Fi", "Adventure", "Romance", "Horror"];
const TONES = ["Dramatic", "Humorous", "Dark", "Whimsical", "Suspenseful"];

function generateStory({ title, genre, tone, length }) {
  const hero = title.trim() || "the wanderer";
  const short = length === "short";
  const opening = {
    Fantasy: `In a kingdom where moonlight forged steel, ${hero} discovered a map inked in starlight.`,
    Mystery: `The rain had barely stopped when ${hero} found the sealed envelope under the cafe door.`,
    "Sci-Fi": `On Station Orion-9, ${hero} woke to a red alert and a message that should not exist.`,
    Adventure: `The trail into the misty cliffs began with a whispered dare to ${hero}.`,
    Romance: `Every evening at the bookstore window, ${hero} noticed the same stranger reading the same page.`,
    Horror: `The house on Hollow Lane only opened its door for ${hero} after midnight.`,
  };

  const middle = {
    Dramatic: `Conflicts rose quickly. Allies became questions, and every choice carved a deeper scar into the journey.`,
    Humorous: `Nothing went according to plan—especially the talking raccoon with a spreadsheet of bad ideas.`,
    Dark: `Shadows lengthened with every step, and trust became a currency too expensive to spend.`,
    Whimsical: `Clouds rearranged into arrows, and streetlamps hummed lullabies only the curious could hear.`,
    Suspenseful: `Footsteps echoed behind, then ahead—never close enough to catch, never far enough to ignore.`,
  };

  const ending = short
    ? `By dawn, ${hero} understood the truth: courage is not the absence of fear, but the decision to walk anyway.`
    : `Hours later, when the final secret unraveled, ${hero} stood changed. The world looked the same, yet every sound carried a new meaning. And somewhere beyond the last page of this night, another story had already begun.`;

  const paragraphs = [
    opening[genre] || opening.Fantasy,
    middle[tone] || middle.Dramatic,
    `With a ${tone.toLowerCase()} resolve, ${hero} pressed forward through obstacles shaped by doubt, chance, and desire.`,
  ];

  if (!short) {
    paragraphs.push(
      `Clues gathered into a pattern. People who once seemed ordinary revealed motives as complex as constellations.`,
      `In a final confrontation of wit and will, ${hero} faced what had been avoided for too long.`
    );
  }

  paragraphs.push(ending);
  return paragraphs.join("\n\n");
}

export default function AiStoryGenerator() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("Fantasy");
  const [tone, setTone] = useState("Dramatic");
  const [length, setLength] = useState("medium");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setStory(generateStory({ title, genre, tone, length }));
    setLoading(false);
  };

  const copyStory = async () => {
    if (!story) return;
    await navigator.clipboard.writeText(story);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="aiStoryGenerator" />

      <ToolHeroShell
        icon={BookOpen}
        title="AI Story Generator"
        subtitle="Turn a character or idea into a short story with genre, tone, and length controls"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="story-title">
              Character / Story Idea
            </label>
            <input
              id="story-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., A lighthouse keeper who hears songs from the sea"
              className={inputDark}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className={selectDark}
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className={selectDark}
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className={selectDark}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !title.trim()}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Writing..." : "Generate Story"}
          </button>
        </div>

        {story && (
          <div className="relative mt-6 rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold text-white">
                <BookOpen className="h-4 w-4" /> Your Story
              </h2>
              <button
                type="button"
                onClick={copyStory}
                className="inline-flex items-center gap-1 rounded-2xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 transition hover:border-slate-500"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-300">{story}</pre>
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent
        category="social-media-tools"
        currentToolPath="/social-media-tools/ai-story-generator" />
    </>
  );
}
