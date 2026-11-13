// Builds a worked example for a calculator page by running the calculator's own compute()
// with its default inputs at build time, so the numbers on the page always match the tool.
import { CALCS } from "../tools/calcs.js";
import { fmt, inr, num } from "./format.js";
import { SITE } from "../data/site.js";

const dateLabel = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

function inputText(spec, value) {
  switch (spec.type) {
    case "money": return inr(value);
    case "percent": return `${num(value)}%`;
    case "years": return `${num(value)} ${value === 1 ? "year" : "years"}`;
    case "number": return `${num(value)}${spec.unit ? " " + spec.unit : ""}`;
    case "select": return String((spec.options.find(([o]) => String(o) === String(value)) || [, value])[1]);
    case "toggle": return value ? "yes" : "no";
    case "date": return dateLabel(value);
    default: return String(value);
  }
}

/** Returns { inputs: [[label, text]], outputs: [[label, text]], query } or null. */
export function workedExample(id, overrides = {}) {
  const cfg = CALCS[id];
  if (!cfg) return null;
  // Dates default to "today"; pin them to the review date so the example doesn't change with each build.
  const v = Object.fromEntries(cfg.inputs.map((i) => [i.id, i.def === "today" ? SITE.updated : i.def]));
  Object.assign(v, overrides);
  let r;
  try {
    r = cfg.compute(v);
  } catch {
    return null;
  }
  if (!r || r.error || !r.primary) return null;
  const visible = cfg.inputs.filter((i) => !i.show || i.show(v));
  const inputs = visible.map((i) => [i.label, inputText(i, v[i.id])]);
  const outputs = [[r.primary.label, fmt(r.primary.value, r.primary.fmt)], ...(r.rows || []).slice(0, 4).map((row) => [row.label, fmt(row.value, row.fmt)])];
  const q = new URLSearchParams();
  for (const i of visible) if (i.type !== "date" || i.def !== "today") q.set(i.id, i.type === "toggle" ? (v[i.id] ? "1" : "0") : v[i.id]);
  return { inputs, outputs, query: q.toString() };
}

/** A question answered by running a calculator: "{0}" in `say` is the main result, "{1}" the next row, and so on. */
export function answerFor({ tool, values, say }) {
  const e = workedExample(tool, values);
  if (!e) throw new Error(`answerFor: ${tool} returned no result`);
  const text = say.replace(/\{(\d+)\}/g, (m, i) => {
    const out = e.outputs[Number(i)];
    if (!out) throw new Error(`answerFor: ${tool} has no output {${i}}`);
    return out[1];
  });
  const q = new URLSearchParams(Object.entries(values).map(([k, v]) => [k, typeof v === "boolean" ? (v ? "1" : "0") : String(v)]));
  return { text, query: q.toString() };
}

