import { useLocation } from "react-router-dom";
import { getCategoryTheme, normalizeCategory, categoryFromPath } from "../data/categoryThemes";

/** Light form controls for white hero workspaces (kept names for existing imports). */
export const inputDark =
  "tool-hero__input age-input w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-[var(--ftp-ink)] outline-none transition placeholder:text-[var(--ftp-ink)]/60";

export const selectDark =
  "tool-hero__input age-input w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-[var(--ftp-ink)] outline-none";

export const textareaDark =
  "tool-hero__input age-input w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 font-mono text-sm text-[var(--ftp-ink)] outline-none transition placeholder:text-[var(--ftp-ink)]/60";

export const inputLight = "age-input";

/**
 * Age Calculator–pattern tool hero.
 * - layout="split" (default): 2-col title | form
 * - layout="stack": single-column — title above, full-width form below
 * - columns: CSS grid fractions for desktop split (default 40% / 60%)
 */
export default function ToolHeroShell({
  icon: Icon,
  title,
  subtitle,
  category,
  children,
  headline,
  wide = false,
  layout = "split",
  panel,
  columns = "40fr 60fr",
  formLabel = "Start here",
  formHint = "Results update as you work",
  hideFormMeta = false,
}) {
  const { pathname } = useLocation();
  const resolved = normalizeCategory(category || categoryFromPath(pathname) || "calculators");
  const theme = getCategoryTheme(resolved);
  // Live forms always use white/light workspace (never dark ink panels)
  const light = true;
  const stack = layout === "stack";
  const split = !stack;

  const workspace = (
    <>
      {!hideFormMeta ? (
        <div className="mb-6 flex items-center gap-3">
          {Icon ? (
            <div
              className={
                light
                  ? "flex h-11 w-11 items-center justify-center rounded-2xl border border-black/[0.06] bg-[var(--hero-accent-soft)]"
                  : "flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"
              }
              style={{ color: theme.accent }}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
          ) : null}
          <div>
            <p
              className={
                light
                  ? "text-sm font-semibold text-[var(--ftp-ink)]"
                  : "text-sm font-semibold text-white"
              }
            >
              {formLabel}
            </p>
            <p className={light ? "text-xs text-[var(--ftp-ink)]/80" : "text-xs text-white/45"}>
              {formHint}
            </p>
          </div>
        </div>
      ) : null}
      {children}
    </>
  );

  return (
    <section
      className={`tool-hero tool-hero--${resolved} relative${light ? " tool-hero--stack" : ""}${stack ? " tool-hero--single" : ""}`}
      data-category={resolved}
      style={{
        "--hero-accent": theme.accent,
        "--hero-accent-soft": theme.accentSoft,
        "--hero-glow-a": theme.glowA,
        "--hero-glow-b": theme.glowB,
        "--age-teal": theme.accent,
        ...(split ? { "--hero-cols": columns } : null),
      }}
    >
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 pt-8 sm:px-6 sm:pt-8 lg:px-8 lg:pb-10 lg:pt-8">
        <div
          className={
            stack
              ? "tool-hero__split tool-hero__split--single grid min-w-0 gap-4"
              : "tool-hero__split grid min-w-0 items-center gap-8 lg:gap-12"
          }
        >
          <div className={`age-rise min-w-0 ${stack ? "max-w-4xl" : ""}`}>
            <h1 className="age-display text-[clamp(1.85rem,4.2vw,3rem)] font-semibold leading-[1.1] text-[var(--ftp-ink)]">
              {headline || title}
            </h1>
            {subtitle ? (
              <p
                className={`mt-1 text-[1.05rem] leading-7 text-[var(--ftp-ink)] ${stack ? "max-w-xl" : "max-w-md"}`}
              >
                {subtitle}
              </p>
            ) : null}

          </div>

          {light ? (
            <div className="tool-hero__workspace age-rise age-rise-delay-2 min-w-0">
              {workspace}
            </div>
          ) : (
            <div className="age-rise age-rise-delay-2 min-w-0 overflow-hidden rounded-[1.35rem] border border-white/10 bg-[var(--ftp-ink)] text-white shadow-[0_30px_90px_rgba(7,16,31,0.28)]">
              <div
                className="h-[3px] bg-gradient-to-r from-[var(--hero-accent)] to-transparent"
                aria-hidden="true"
              />
              <div className="p-5 sm:p-7">{workspace}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
