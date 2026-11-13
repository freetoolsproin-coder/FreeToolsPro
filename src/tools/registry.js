// Which tool ids each engine implements. Used by scripts/check-catalog.mjs only (not shipped to the browser).
import { CALCS } from "./calcs.js";
import { TEXTS } from "./texts.js";
import { BUILDERS } from "./builders.js";
import { IMAGE_MODES } from "./image-modes.js";
import { PDF_MODES } from "./pdf-modes.js";
import { CANVAS_MODES } from "./canvas-modes.js";

export const ENGINE_IDS = {
  calc: Object.keys(CALCS),
  text: Object.keys(TEXTS),
  builder: Object.keys(BUILDERS),
  image: Object.keys(IMAGE_MODES),
  pdf: Object.keys(PDF_MODES),
  unit: ["unit-converter"],
  qr: ["qr-code-generator"],
  canvas: Object.keys(CANVAS_MODES),
  latex: ["latex-equation-editor", "latex-symbol-generator", "latex-matrix-generator", "latex-equation-to-image", "latex-table-generator", "latex-code-formatter", "image-to-latex", "latex-templates", "latex-formula-library", "mathml-to-latex", "latex-to-pdf", "latex-equation-to-word"],
  study: ["notes-summarizer", "flashcard-generator", "quiz-generator", "concept-explainer", "revision-plan-generator"],
};
