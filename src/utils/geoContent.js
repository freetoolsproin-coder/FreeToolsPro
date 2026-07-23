import { tools } from "../data/toolDefinitions";
import { getToolWhatItDoes } from "../data/toolWhatItDoes";

/**
 * Build answer-first GEO copy for a tool path.
 * Human-readable summary + short definition for AI/snippet extraction.
 */
export function getToolGeoContent(path, overrides = {}) {
  const tool = tools.find((t) => t.path === path && !t.isPageLink);
  const what = overrides.whatItDoes ?? getToolWhatItDoes(path);
  const name = overrides.name || tool?.name || "This tool";
  const desc = (overrides.description || tool?.desc || "").replace(/\s+/g, " ").trim();

  const firstPara = what?.paragraphs?.[0]?.replace(/\s+/g, " ").trim() || "";
  const definitionSource = firstPara || desc;

  // Prefer a crisp 1–2 sentence summary (≤ ~320 chars) for answer engines.
  let summary = desc;
  if (firstPara) {
    const sentences = firstPara.match(/[^.!?]+[.!?]+/g);
    if (sentences?.length) {
      summary = sentences.slice(0, 2).join(" ").trim();
    } else {
      summary = firstPara.slice(0, 280).trim();
    }
  }
  if (summary.length > 360) {
    summary = `${summary.slice(0, 357).trim()}…`;
  }

  const definition =
    definitionSource.length > 220
      ? `${definitionSource.slice(0, 217).trim()}…`
      : definitionSource;

  const related = tools
    .filter(
      (t) =>
        !t.isPageLink &&
        t.path !== path &&
        (!tool?.category || t.category === tool.category)
    )
    .slice(0, 3);

  return {
    name,
    path: path || tool?.path,
    category: tool?.category,
    summary: summary || `${name} is a free online utility on FreeToolsPro.`,
    definition:
      definition ||
      `${name} is a free browser-based utility from FreeToolsPro that helps you complete the task without installing software.`,
    related,
  };
}
