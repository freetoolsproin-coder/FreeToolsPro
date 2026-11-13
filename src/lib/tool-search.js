// Tool search shared by the header palette (Ctrl/⌘ K) and the home Command Center.
// Matches by tool name first, then short line, description and category, and understands
// task phrasing ("calculate my age", "compress photo"). Plain functions, no DOM.
export const norm = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");

// Words around a task that say nothing about which tool is needed.
const SKIP = new Set("a an the my me i to of for in on with and or how do does can want need please online free tool tools find get make into from is are what your".split(" "));
// Task words mapped to the words tool names use.
const SYN = {
  calculate: ["calculator"], calc: ["calculator"], validate: ["validator"], check: ["checker", "check"], analyze: ["checker", "analyzer"], analyse: ["checker"],
  convert: ["to", "converter"], compress: ["compressor", "compress"], reduce: ["compress"], shrink: ["compress"], photo: ["image"], picture: ["image"], pic: ["image"],
  merge: ["merge", "merger"], combine: ["merge"], join: ["merge"], split: ["split", "splitter"], resize: ["resizer"], format: ["formatter"], beautify: ["formatter", "beautifier"],
  seo: ["seo", "meta", "serp"], tags: ["tag"], loan: ["emi", "loan"], salary: ["salary", "in-hand"], tax: ["tax"], marks: ["marks", "grade"], gpa: ["gpa", "cgpa"],
  notes: ["notes", "summarizer"], flashcards: ["flashcard"], quiz: ["quiz"], jpeg: ["jpg"], count: ["counter"], password: ["password"],
};

/** Prepare an index of { n: name, s: short, d?: description, c: category label, p: path, k: category id, pop? }. */
export function prepIndex(list) {
  return list.map((t) => ({ ...t, _n: norm(t.n), _t: norm(`${t.n} ${t.s} ${t.d || ""} ${t.c}`) }));
}

export function terms(q) {
  return norm(q)
    .split(/[^a-z0-9.+-]+/)
    .filter((w) => w && !SKIP.has(w))
    .map((w) => [w, ...(SYN[w] || []), w.replace(/s$/, "")]);
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function score(t, ts) {
  let s = 0,
    hit = 0;
  for (const alts of ts) {
    let best = 0;
    for (const a of alts) {
      if (!a) continue;
      if (t._n.startsWith(a)) best = Math.max(best, 6);
      else if (new RegExp(`(^|[^a-z0-9])${esc(a)}`).test(t._n)) best = Math.max(best, 5);
      else if (t._n.includes(a)) best = Math.max(best, 3);
      else if (t._t.includes(a)) best = Math.max(best, 1);
    }
    if (best) hit++;
    s += best;
  }
  // Most of the meaningful words must match; popular tools win ties.
  return hit >= Math.max(1, Math.ceil(ts.length * 0.6)) ? s + (t.pop ? 0.5 : 0) : 0;
}

/** Best matches for a query. Returns [] for an empty query. */
export function searchTools(index, q, limit = 8) {
  const ts = terms(q);
  if (!ts.length) return [];
  return index
    .map((t) => [score(t, ts), t])
    .filter(([s]) => s > 0)
    .sort((a, b) => b[0] - a[0])
    .slice(0, limit)
    .map(([, t]) => t);
}

/** Tools this visitor opened recently (saved in this browser by src/scripts/recent.js). */
export function readRecent(n = 3) {
  try {
    const v = JSON.parse(localStorage.getItem("ftp-recent-tools") || "[]");
    return Array.isArray(v) ? v.slice(0, n) : [];
  } catch {
    return [];
  }
}
