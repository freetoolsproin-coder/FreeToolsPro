// The TeX engine behind every LaTeX tool: MathJax, loaded once and only on pages that need it.
// Output is self-contained SVG (glyphs are paths, no web font), so one render can be shown on the page,
// saved as SVG, drawn to a PNG or copied into a PDF. Works in the browser and in Node (for checks).
import { mathjax } from "@mathjax/src/js/mathjax.js";
import { TeX } from "@mathjax/src/js/input/tex.js";
import { SVG } from "@mathjax/src/js/output/svg.js";
import { liteAdaptor } from "@mathjax/src/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "@mathjax/src/js/handlers/html.js";
import { SerializedMmlVisitor } from "@mathjax/src/js/core/MmlTree/SerializedMmlVisitor.js";
import { STATE } from "@mathjax/src/js/core/MathItem.js";
import { MathJaxTexFont } from "@mathjax/mathjax-tex-font/js/svg.js";
import "@mathjax/src/js/input/tex/base/BaseConfiguration.js";
import "@mathjax/src/js/input/tex/ams/AmsConfiguration.js";
import "@mathjax/src/js/input/tex/newcommand/NewcommandConfiguration.js";
import "@mathjax/src/js/input/tex/boldsymbol/BoldsymbolConfiguration.js";
import "@mathjax/src/js/input/tex/color/ColorConfiguration.js";
import "@mathjax/src/js/input/tex/cancel/CancelConfiguration.js";
import "@mathjax/src/js/input/tex/mhchem/MhchemConfiguration.js";
import "@mathjax/src/js/input/tex/mathtools/MathtoolsConfiguration.js";
import "@mathjax/src/js/input/tex/physics/PhysicsConfiguration.js";
import "@mathjax/src/js/input/tex/braket/BraketConfiguration.js";
import "@mathjax/src/js/input/tex/textmacros/TextMacrosConfiguration.js";
import "@mathjax/src/js/input/tex/noundefined/NoUndefinedConfiguration.js";

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const tex = new TeX({
  packages: ["base", "ams", "newcommand", "boldsymbol", "color", "cancel", "mhchem", "mathtools", "physics", "braket", "textmacros"],
  formatError: (_jax, err) => {
    throw err;
  },
});
// mhchem draws its arrows from a font extension that the TeX font does not have, so swap them for the
// standard arrows. Everything else in \ce renders normally.
const MHCHEM = { "": "←", "": "←", "": "→", "": "→", "": "↔", "": "↔", "": "⇌", "": "⇌", "": "⇌", "": "⇄", "": "≡" };
tex.postFilters.add(({ data }) => {
  data.root.walkTree((node) => {
    if (node.attributes?.get("mathvariant") !== "-mhchem") return;
    node.attributes.set("mathvariant", "normal");
    const t = node.childNodes?.[0];
    if (t?.getText && MHCHEM[t.getText()]) t.setText(MHCHEM[t.getText()]);
  });
});
const svg = new SVG({ fontData: MathJaxTexFont, fontCache: "none", displayAlign: "left", linebreaks: { inline: false } });
const doc = mathjax.document("", { InputJax: tex, OutputJax: svg });
const visitor = new SerializedMmlVisitor();

// Colour names end up in SVG attributes. Angle brackets and quotes never belong in one.
const BAD_COLOR = /\\(?:text)?color\s*(?:\[[^\]]*\])?\s*\{[^}]*["'<>&]/;

function metrics(s) {
  const n = (re) => Number((s.match(re) || [])[1]);
  return { w: n(/<svg[^>]*\swidth="([\d.]+)ex"/), h: n(/<svg[^>]*\sheight="([\d.]+)ex"/), depth: -n(/vertical-align:\s*(-?[\d.]+)ex/) || 0 };
}

/** TeX to SVG. Returns { svg, w, h, depth } (sizes in ex) or { error }. */
export function texToSvg(source, { display = true } = {}) {
  const src = String(source ?? "").trim();
  if (!src) return { svg: "", w: 0, h: 0, depth: 0 };
  if (BAD_COLOR.test(src)) return { error: "That colour name is not valid." };
  try {
    tex.parseOptions.tags.reset?.();
    const node = doc.convert(src, { display, em: 16, ex: 8, containerWidth: 80 * 16 });
    const el = adaptor.firstChild(node);
    adaptor.removeAttribute(el, "focusable");
    const out = adaptor.outerHTML(el).replace(/\sdata-(mml-node|c|latex)="[^"]*"/g, "");
    return { svg: out, ...metrics(out) };
  } catch (e) {
    return { error: cleanError(e) };
  }
}

/** TeX to a MathML string (presentation MathML, what Word and browsers read). */
export function texToMathml(source, { display = true } = {}) {
  const src = String(source ?? "").trim();
  if (!src) return { mathml: "" };
  try {
    const node = doc.convert(src, { display, end: STATE.CONVERT });
    return { mathml: visitor.visitTree(node, doc).replace(/\sdata-[\w-]+="[^"]*"/g, "") };
  } catch (e) {
    return { error: cleanError(e) };
  }
}

function cleanError(e) {
  const m = String(e?.message || e || "Could not read this LaTeX.");
  return m.replace(/^TeX parse error:\s*/i, "").replace(/\s+/g, " ").trim();
}
