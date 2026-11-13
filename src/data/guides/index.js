// Long-form guides shown on each tool page, keyed by tool id.
// Each entry is [heading, ...paragraphs], written to sit between "About this tool" and "How to use it".
import finance from "./finance.js";
import tax from "./tax.js";
import everyday from "./everyday.js";
import text from "./text.js";
import developer from "./developer.js";
import encoding from "./encoding.js";
import image from "./image.js";
import pdf from "./pdf.js";
import design from "./design.js";
import latex from "./latex.js";

export const GUIDES = { ...finance, ...tax, ...everyday, ...text, ...developer, ...encoding, ...image, ...pdf, ...design, ...latex };
