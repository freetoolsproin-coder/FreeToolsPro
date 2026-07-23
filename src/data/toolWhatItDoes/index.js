import calculators from "./calculators.js";
import businessTools from "./businessTools.js";
import developerTools from "./developerTools.js";
import imageTools from "./imageTools.js";
import pdfTools from "./pdfTools.js";
import socialMediaTools from "./socialMediaTools.js";
import textTools from "./textTools.js";
import trendingTools from "./trendingTools.js";
import newTools from "./newTools.js";
import { TOOL_PATH_ALIASES } from "./aliases.js";

const TOOL_WHAT_IT_DOES = {
  ...calculators,
  ...businessTools,
  ...developerTools,
  ...imageTools,
  ...pdfTools,
  ...socialMediaTools,
  ...textTools,
  ...trendingTools,
  ...newTools,
};

export function getToolWhatItDoes(path) {
  if (!path) return null;
  if (TOOL_WHAT_IT_DOES[path]) return TOOL_WHAT_IT_DOES[path];
  const alias = TOOL_PATH_ALIASES[path];
  if (alias && TOOL_WHAT_IT_DOES[alias]) return TOOL_WHAT_IT_DOES[alias];
  return null;
}

export default TOOL_WHAT_IT_DOES;
