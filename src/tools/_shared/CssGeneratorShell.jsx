import { useMemo, useState } from "react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const PRESETS = {
  css_shadow: {
    init: { x: 8, y: 12, blur: 24, spread: 0, color: "rgba(15,23,42,0.18)" },
    css: (s) => `box-shadow: ${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color};`,
    style: (s) => ({ boxShadow: `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}` }),
    sliders: [
      ["x", "X", -40, 40],
      ["y", "Y", -40, 40],
      ["blur", "Blur", 0, 80],
      ["spread", "Spread", -20, 40],
    ],
    color: true,
  },
  css_radius: {
    init: { tl: 16, tr: 16, br: 16, bl: 16 },
    css: (s) => `border-radius: ${s.tl}px ${s.tr}px ${s.br}px ${s.bl}px;`,
    style: (s) => ({ borderRadius: `${s.tl}px ${s.tr}px ${s.br}px ${s.bl}px` }),
    sliders: [
      ["tl", "Top left", 0, 80],
      ["tr", "Top right", 0, 80],
      ["br", "Bottom right", 0, 80],
      ["bl", "Bottom left", 0, 80],
    ],
  },
  css_filter: {
    init: { blur: 0, bright: 100, contrast: 100, sat: 100 },
    css: (s) =>
      `filter: blur(${s.blur}px) brightness(${s.bright}%) contrast(${s.contrast}%) saturate(${s.sat}%);`,
    style: (s) => ({
      filter: `blur(${s.blur}px) brightness(${s.bright}%) contrast(${s.contrast}%) saturate(${s.sat}%)`,
    }),
    sliders: [
      ["blur", "Blur", 0, 20],
      ["bright", "Brightness", 50, 150],
      ["contrast", "Contrast", 50, 150],
      ["sat", "Saturate", 0, 200],
    ],
  },
  css_transform: {
    init: { rot: 0, sx: 1, sy: 1, tx: 0 },
    css: (s) => `transform: translateX(${s.tx}px) rotate(${s.rot}deg) scale(${s.sx}, ${s.sy});`,
    style: (s) => ({ transform: `translateX(${s.tx}px) rotate(${s.rot}deg) scale(${s.sx}, ${s.sy})` }),
    sliders: [
      ["rot", "Rotate", -180, 180],
      ["sx", "Scale X", 0.2, 2, 0.05],
      ["sy", "Scale Y", 0.2, 2, 0.05],
      ["tx", "Translate X", -80, 80],
    ],
  },
  css_grid: {
    init: { cols: 3, gap: 12 },
    css: (s) => `display: grid;\ngrid-template-columns: repeat(${s.cols}, 1fr);\ngap: ${s.gap}px;`,
    style: (s) => ({ display: "grid", gridTemplateColumns: `repeat(${s.cols}, 1fr)`, gap: s.gap }),
    sliders: [
      ["cols", "Columns", 1, 6],
      ["gap", "Gap", 0, 40],
    ],
    gridPreview: true,
  },
  css_clip: {
    init: { a: 50, b: 0, c: 100, d: 0, e: 100, f: 100 },
    css: (s) => `clip-path: polygon(${s.a}% ${s.b}%, ${s.c}% ${s.d}%, ${s.e}% ${s.f}%, 0% 100%);`,
    style: (s) => ({ clipPath: `polygon(${s.a}% ${s.b}%, ${s.c}% ${s.d}%, ${s.e}% ${s.f}%, 0% 100%)` }),
    sliders: [
      ["a", "P1 X", 0, 100],
      ["b", "P1 Y", 0, 100],
      ["c", "P2 X", 0, 100],
      ["d", "P2 Y", 0, 100],
    ],
  },
  css_flex: {
    init: { dir: "row", justify: "center", align: "center", gap: 12 },
    css: (s) =>
      `display: flex;\nflex-direction: ${s.dir};\njustify-content: ${s.justify};\nalign-items: ${s.align};\ngap: ${s.gap}px;`,
    style: (s) => ({
      display: "flex",
      flexDirection: s.dir,
      justifyContent: s.justify,
      alignItems: s.align,
      gap: s.gap,
    }),
    flex: true,
  },
  css_anim: {
    init: { name: "pulse", dur: 1.2 },
    css: (s) =>
      `@keyframes ${s.name} {\n  0% { transform: scale(1); opacity: 1; }\n  50% { transform: scale(1.06); opacity: 0.85; }\n  100% { transform: scale(1); opacity: 1; }\n}\n.animated { animation: ${s.name} ${s.dur}s ease-in-out infinite; }`,
    style: (s) => ({ animation: `${s.name} ${s.dur}s ease-in-out infinite` }),
    anim: true,
  },
};

export default function CssGeneratorShell({ seoKey, category, path, icon: Icon, title, subtitle, kind }) {
  const preset = PRESETS[kind];
  const [state, setState] = useState(preset.init);
  const css = useMemo(() => preset.css(state), [preset, state]);
  const set = (key, value) => setState((s) => ({ ...s, [key]: value }));

  return (
    <>
      <Seo page={seoKey} />
      <ToolHeroShell
        category={category}
        icon={Icon}
        title={title}
        subtitle={subtitle}
        layout="stack"
        panel="light"
      >
        {preset.flex ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-[var(--ftp-ink-soft)]">
              Direction
              <select className={`${selectDark} mt-1.5`} value={state.dir} onChange={(e) => set("dir", e.target.value)}>
                <option value="row">row</option>
                <option value="column">column</option>
              </select>
            </label>
            <label className="text-sm text-[var(--ftp-ink-soft)]">
              Justify
              <select
                className={`${selectDark} mt-1.5`}
                value={state.justify}
                onChange={(e) => set("justify", e.target.value)}
              >
                <option>flex-start</option>
                <option>center</option>
                <option>space-between</option>
                <option>space-around</option>
              </select>
            </label>
            <label className="text-sm text-[var(--ftp-ink-soft)]">
              Align
              <select
                className={`${selectDark} mt-1.5`}
                value={state.align}
                onChange={(e) => set("align", e.target.value)}
              >
                <option>stretch</option>
                <option>center</option>
                <option>flex-start</option>
                <option>flex-end</option>
              </select>
            </label>
            <label className="text-sm text-[var(--ftp-ink-soft)]">
              Gap: {state.gap}
              <input
                type="range"
                min={0}
                max={40}
                value={state.gap}
                onChange={(e) => set("gap", Number(e.target.value))}
                className="mt-1.5 w-full"
              />
            </label>
          </div>
        ) : null}

        {preset.anim ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-[var(--ftp-ink-soft)]">
              Name
              <input
                className={`${inputDark} mt-1.5`}
                value={state.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </label>
            <label className="text-sm text-[var(--ftp-ink-soft)]">
              Duration: {state.dur}s
              <input
                type="range"
                min={0.2}
                max={5}
                step={0.1}
                value={state.dur}
                onChange={(e) => set("dur", Number(e.target.value))}
                className="mt-1.5 w-full"
              />
            </label>
          </div>
        ) : null}

        {preset.sliders ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {preset.sliders.map(([key, label, min, max, step]) => (
              <label key={key} className="text-sm text-[var(--ftp-ink-soft)]">
                {label}: {state[key]}
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step || 1}
                  value={state[key]}
                  onChange={(e) => set(key, Number(e.target.value))}
                  className="mt-1.5 w-full"
                />
              </label>
            ))}
            {preset.color ? (
              <label className="text-sm text-[var(--ftp-ink-soft)] sm:col-span-2">
                Color
                <input
                  className={`${inputDark} mt-1.5`}
                  value={state.color}
                  onChange={(e) => set("color", e.target.value)}
                />
              </label>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-6">
          <div
            className="flex h-44 w-44 items-center justify-center rounded-2xl border border-[var(--ftp-line)] bg-white p-3"
            style={preset.flex || preset.gridPreview ? preset.style(state) : undefined}
          >
            {preset.flex || preset.gridPreview ? (
              Array.from({ length: preset.gridPreview ? state.cols * 2 : 3 }).map((_, i) => (
                <div key={i} className="h-10 w-10 rounded-lg bg-teal-600" />
              ))
            ) : (
              <div className="h-24 w-24 bg-teal-600" style={preset.style(state)} />
            )}
          </div>
          <pre className="min-w-[240px] flex-1 overflow-auto rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4 text-sm">
            {css}
          </pre>
        </div>
      </ToolHeroShell>
      <ToolContentLayout category={category} currentToolPath={path} />
    </>
  );
}
