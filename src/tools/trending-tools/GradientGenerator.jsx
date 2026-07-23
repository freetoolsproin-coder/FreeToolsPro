import { useMemo, useState } from "react";
import { Palette, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import { ToolSeoIntro, ToolSeoStandard } from "../../utils/toolSeoBlocks";

const DIRECTIONS = [
  { value: "to right", label: "Left → Right" },
  { value: "to left", label: "Right → Left" },
  { value: "to bottom", label: "Top → Bottom" },
  { value: "to top", label: "Bottom → Top" },
  { value: "to bottom right", label: "Diagonal ↘" },
  { value: "to bottom left", label: "Diagonal ↙" },
  { value: "135deg", label: "135°" },
  { value: "45deg", label: "45°" },
];

export default function GradientGenerator() {
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#ec4899");
  const [direction, setDirection] = useState("to right");
  const [copied, setCopied] = useState(false);

  const gradientCss = useMemo(
    () => `background: linear-gradient(${direction}, ${color1}, ${color2});`,
    [direction, color1, color2]
  );

  const copyCss = async () => {
    await navigator.clipboard.writeText(gradientCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="gradientGenerator" />

      <ToolHeroShell
        icon={Palette}
        title="CSS Gradient Generator"
        subtitle="Pick two colors and a direction, preview the gradient, and copy ready-to-use CSS."
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="grad-color-1">
                Color 1
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="grad-color-1"
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="h-12 w-14 cursor-pointer rounded-xl border border-slate-700 bg-slate-900"
                />
                <input
                  type="text"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className={inputDark}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="grad-color-2">
                Color 2
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="grad-color-2"
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="h-12 w-14 cursor-pointer rounded-xl border border-slate-700 bg-slate-900"
                />
                <input
                  type="text"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className={inputDark}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="grad-direction">
              Direction
            </label>
            <select
              id="grad-direction"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className={selectDark}
            >
              {DIRECTIONS.map((d) => (
                <option key={d.value} value={d.value} className="bg-slate-900 text-white">
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-300">Preview</p>
            <div
              className="h-40 w-full rounded-2xl border border-slate-700 shadow-inner"
              style={{ background: `linear-gradient(${direction}, ${color1}, ${color2})` }}
            />
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-300">CSS Output</p>
              <button
                type="button"
                onClick={copyCss}
                className="inline-flex items-center gap-1 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-200 transition hover:border-slate-500"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy CSS"}
              </button>
            </div>
            <pre className="overflow-x-auto font-mono text-sm text-slate-300">{gradientCss}</pre>
          </div>
        </div>
      </ToolHeroShell>

      <ToolPageContent category="trending-tools" currentToolPath="/trending-tools/gradient-generator" />
    </>
  );
}
