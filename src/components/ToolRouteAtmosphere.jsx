import { useLocation } from "react-router-dom";
import { getCategoryTheme, normalizeCategory, categoryFromPath } from "../data/categoryThemes";

/**
 * Wraps every tool route with Age Calculator chrome + category-themed hero atmosphere.
 */
export default function ToolRouteAtmosphere({ children }) {
  const { pathname } = useLocation();
  const category = categoryFromPath(pathname);

  if (!category) {
    return children;
  }

  const theme = getCategoryTheme(category);
  const cat = normalizeCategory(category);

  return (
    <div
      className={`age-app age-app--themed tool-route tool-route--${cat}`}
      data-category={cat}
      data-label={theme.label}
      style={{
        "--age-teal": theme.accent,
        "--age-teal-deep": theme.accent,
        "--hero-accent": theme.accent,
        "--hero-accent-soft": theme.accentSoft,
        "--hero-glow-a": theme.glowA,
        "--hero-glow-b": theme.glowB,
      }}
    >
      <div className="age-app__grid" aria-hidden="true" />
      <div className="age-orbit" aria-hidden="true">
        <div className="age-orbit__hand" />
      </div>
      <div className="relative z-[1] max-w-full min-w-0 overflow-x-clip">{children}</div>
    </div>
  );
}
