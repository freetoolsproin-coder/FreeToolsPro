import { createContext, useContext, useEffect, useId, useState } from "react";
import { ChevronDown, Moon, Sun } from "lucide-react";
import AdSlot from "./AdSlot";
import FaqSchema from "./FaqSchema";
import HowToSchema from "./HowToSchema";

const SaasThemeContext = createContext(null);

export function useSaasTheme() {
  const theme = useContext(SaasThemeContext);
  if (!theme) {
    throw new Error("useSaasTheme must be used inside SaasToolFrame");
  }
  return theme;
}

const THEME_KEY = "ftp-tool-theme";

function readTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* private mode */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Compact tool page: workspace first, editorial copy below the fold,
 * ads in a labeled zone that never sits on the controls.
 */
export default function SaasToolFrame({
  kicker,
  title,
  lede,
  status = "Ready",
  statusLive = false,
  children,
  steps = [],
  reasons = [],
  faqs = [],
  schemaPath,
  schemaName,
  schemaDescription,
  showAd = true,
}) {
  const [theme, setTheme] = useState("light");
  const [openFaq, setOpenFaq] = useState(0);
  const dark = theme === "dark";

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const surface = {
    dark,
    card: dark
      ? "rounded-xl border border-slate-800 bg-slate-950 text-slate-50"
      : "rounded-xl border border-slate-200 bg-white text-slate-950 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
    field: dark
      ? "w-full resize-y rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-3 text-sm leading-6 text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-slate-500"
      : "w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white",
    primary: dark
      ? "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 active:scale-[0.98]"
      : "inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]",
    ghost: dark
      ? "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-transparent px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-900 active:scale-[0.98]"
      : "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]",
    muted: dark ? "text-slate-400" : "text-slate-500",
    ink: dark ? "text-slate-50" : "text-slate-950",
    stat: dark
      ? "rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-3"
      : "rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3",
  };

  return (
    <SaasThemeContext.Provider value={surface}>
      <FaqSchema faqs={faqs} pageUrl={schemaPath} />
      <HowToSchema
        name={schemaName || title}
        description={schemaDescription || lede}
        url={schemaPath}
        steps={steps}
      />

      <div
        className={
          dark
            ? "bg-slate-950 text-slate-50"
            : "bg-[var(--ftp-paper,#f7f6f3)] text-slate-950"
        }
        data-theme={theme}
      >
        <section id="tool-workspace" className="mx-auto w-full max-w-6xl px-4 pb-6 pt-5 sm:px-6 lg:pt-7">
          <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 max-w-2xl">
              {kicker ? (
                <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${surface.muted}`}>
                  {kicker}
                </p>
              ) : null}
              <h1 className="mt-1 text-[1.65rem] font-semibold leading-tight tracking-tight sm:text-3xl">
                {title}
              </h1>
              {lede ? (
                <p className={`mt-1.5 max-w-xl text-sm leading-6 ${surface.muted}`}>{lede}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                  dark ? "border-slate-800 bg-slate-900 text-slate-200" : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${statusLive ? "animate-pulse bg-emerald-500" : "bg-emerald-500"}`}
                  aria-hidden="true"
                />
                {status}
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                aria-pressed={dark}
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                className={
                  dark
                    ? "inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-800 text-slate-200 transition hover:bg-slate-900"
                    : "inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                }
              >
                {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </button>
            </div>
          </header>

          <div className={surface.card}>{children}</div>
        </section>

        {showAd ? (
          <aside
            aria-label="Advertisement"
            className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${dark ? "border-slate-800" : "border-slate-200"} border-t`}
          >
            <p className={`pb-1 pt-6 text-center text-[11px] font-medium uppercase tracking-[0.16em] ${surface.muted}`}>
              Advertisement
            </p>
            <div
              className={`mx-auto mb-2 max-w-3xl overflow-hidden rounded-xl border border-dashed ${
                dark ? "border-slate-800 bg-slate-900" : "border-slate-300 bg-slate-50"
              }`}
            >
              <AdSlot />
            </div>
          </aside>
        ) : null}

        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">How to use</h2>
              <ol className="mt-4 space-y-4">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-3">
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
                        dark ? "bg-white text-slate-950" : "bg-slate-950 text-white"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">{step.title}</h3>
                      <p className={`mt-0.5 text-sm leading-6 ${surface.muted}`}>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight">Why use this tool</h2>
              <ul className="mt-4 space-y-4">
                {reasons.map((reason) => (
                  <li key={reason.title}>
                    <h3 className="text-sm font-semibold">{reason.title}</h3>
                    <p className={`mt-0.5 text-sm leading-6 ${surface.muted}`}>{reason.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 max-w-3xl">
            <h2 className="text-lg font-semibold tracking-tight">Questions people actually ask</h2>
            <div className={`mt-3 divide-y ${dark ? "divide-slate-800 border-slate-800" : "divide-slate-200 border-slate-200"} border-y`}>
              {faqs.map((item, index) => (
                <FaqRow
                  key={item.q}
                  item={item}
                  open={openFaq === index}
                  dark={dark}
                  onToggle={() => setOpenFaq(openFaq === index ? -1 : index)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </SaasThemeContext.Provider>
  );
}

function FaqRow({ item, open, onToggle, dark }) {
  const panelId = useId();
  const buttonId = useId();

  return (
    <div>
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-3.5 text-left text-sm font-medium"
      >
        <span>{item.q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition ${open ? "rotate-180" : ""} ${dark ? "text-slate-400" : "text-slate-500"}`}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <p id={panelId} role="region" aria-labelledby={buttonId} className={`pb-4 pr-8 text-sm leading-6 ${dark ? "text-slate-400" : "text-slate-600"}`}>
          {item.a}
        </p>
      ) : null}
    </div>
  );
}
