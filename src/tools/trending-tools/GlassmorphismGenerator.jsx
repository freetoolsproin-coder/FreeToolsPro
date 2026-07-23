import { useMemo, useState } from "react";
import { Layers, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";
import { ToolSeoIntro, ToolSeoStandard } from "../../utils/toolSeoBlocks";

export default function GlassmorphismGenerator() {
  const [blur, setBlur] = useState(12);
  const [opacity, setOpacity] = useState(0.25);
  const [border, setBorder] = useState(1);
  const [copied, setCopied] = useState(false);

  const glassCss = useMemo(
    () =>
      [
        `background: rgba(255, 255, 255, ${opacity.toFixed(2)});`,
        `backdrop-filter: blur(${blur}px);`,
        `-webkit-backdrop-filter: blur(${blur}px);`,
        `border: ${border}px solid rgba(255, 255, 255, 0.35);`,
        "border-radius: 16px;",
        "box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);",
      ].join("\n"),
    [blur, opacity, border]
  );

  const copyCss = async () => {
    await navigator.clipboard.writeText(glassCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="glassmorphismGenerator" />

      <ToolHeroShell
        icon={Layers}
        title="Glassmorphism CSS Generator"
        subtitle="Tune blur, opacity, and border to create frosted-glass UI panels with copy-ready CSS."
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="glass-blur">
                Blur ({blur}px)
              </label>
              <input
                id="glass-blur"
                type="range"
                min={0}
                max={40}
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full accent-sky-400"
              />
              <input
                type="number"
                min={0}
                max={40}
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className={`${inputDark} mt-2`}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="glass-opacity">
                Opacity ({opacity.toFixed(2)})
              </label>
              <input
                id="glass-opacity"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-sky-400"
              />
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className={`${inputDark} mt-2`}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="glass-border">
                Border ({border}px)
              </label>
              <input
                id="glass-border"
                type="range"
                min={0}
                max={6}
                value={border}
                onChange={(e) => setBorder(Number(e.target.value))}
                className="w-full accent-sky-400"
              />
              <input
                type="number"
                min={0}
                max={6}
                value={border}
                onChange={(e) => setBorder(Number(e.target.value))}
                className={`${inputDark} mt-2`}
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-300">Preview</p>
            <div
              className="relative flex h-56 items-center justify-center overflow-hidden rounded-2xl border border-slate-700"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #0ea5e9 0%, #6366f1 40%, #ec4899 100%)",
              }}
            >
              <div
                className="flex h-36 w-64 items-center justify-center px-6 text-center text-sm font-medium text-white"
                style={{
                  background: `rgba(255, 255, 255, ${opacity})`,
                  backdropFilter: `blur(${blur}px)`,
                  WebkitBackdropFilter: `blur(${blur}px)`,
                  border: `${border}px solid rgba(255, 255, 255, 0.35)`,
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                }}
              >
                Frosted glass panel preview
              </div>
            </div>
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
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-slate-300">{glassCss}</pre>
          </div>
        </div>
      </ToolHeroShell>

      <ToolPageContent category="trending-tools" currentToolPath="/trending-tools/glassmorphism-generator" />
    </>
  );
}
