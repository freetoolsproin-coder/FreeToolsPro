// AI Study engine: rule-based language processing that runs entirely in the browser.
// Used by the Notes Summarizer, Flashcard Generator, Quiz Generator, Concept Explainer
// and Revision Plan Generator islands. No network calls here (the explainer's optional
// Wikipedia lookup lives in its island).
import { wordList, STOP, mulberry32 } from "./textlib.js";

export const SAMPLE_NOTES = `Photosynthesis

Photosynthesis is the process by which green plants make their own food using sunlight, carbon dioxide and water. It takes place mainly in the leaves, inside tiny organelles called chloroplasts. Chlorophyll is the green pigment that absorbs light energy, mostly red and blue light.

Raw materials and products
The raw materials are carbon dioxide, which enters through the stomata, and water, which is absorbed by the roots and carried up through the xylem. The products are glucose and oxygen. The overall equation is 6CO2 + 6H2O → C6H12O6 + 6O2.
Stomata are tiny pores on the underside of leaves that allow gases to move in and out. Guard cells control the opening and closing of the stomata.

Stages of photosynthesis
Photosynthesis happens in two stages. First, the light-dependent reactions take place in the thylakoid membranes, where light energy splits water molecules and releases oxygen. This splitting of water is called photolysis. Then, the Calvin cycle takes place in the stroma, where carbon dioxide is fixed into glucose using ATP and NADPH.
ATP (adenosine triphosphate) is the energy currency of the cell.

Factors affecting the rate
The rate of photosynthesis depends on light intensity, carbon dioxide concentration and temperature. A factor that is in short supply and stops the rate from rising is known as a limiting factor. For example, on a cold morning temperature is usually the limiting factor. Most plants photosynthesise best between 25°C and 35°C, because enzymes work fastest in this range.

Why it matters
Photosynthesis is important because it produces the oxygen that most living things need for respiration. It is also the starting point of almost every food chain, since animals depend directly or indirectly on plants for food. Unlike respiration, which releases energy, photosynthesis stores energy in glucose.`;

// ---------- text basics ----------
const ABBR = /\b(?:e\.g|i\.e|etc|vs|Dr|Mr|Mrs|Ms|Prof|Fig|No|St|approx|viz)\.$/i;
const BULLET = /^\s*(?:[-*•▪◦·‣–—]|\d{1,2}[.)]|[a-zA-Z][.)]|\(\w\))\s+/;

export const stem = (w) =>
  w
    .toLowerCase()
    .replace(/(?:ies)$/, "y")
    .replace(/(?:sses)$/, "ss")
    .replace(/(?:ing|edly|ed|es|s)$/, "")
    .slice(0, 12);

export const words = (s) => wordList(s);
export const countWords = (s) => wordList(s).length;
// Words that are common in notes but make poor study terms on their own.
const STUDY_STOP = new Set(
  "place takes take taken taking using used use uses called known mainly also make makes made making happen happens happened tiny small large big many most usually part parts way ways thing things type types kind kinds form forms like well new first second third then next finally last important process done give gives given allow allows allowed help helps helped need needs needed every almost directly indirectly starting point best short supply rising stops overall two three four five several various different same other another example examples called whose within without upon rather around across along among however therefore thus hence because since while although though often sometimes always never mostly simply really just only even still yet already called show shows shown get gets got become becomes became work works worked stage stages step steps level levels number numbers amount lot lots main key basic total each such much less more least side end start top bottom inside outside note notes topic chapter unit lesson day days year years time times".split(" ")
);
const isStop = (w) => STOP.has(w.toLowerCase()) || STUDY_STOP.has(w.toLowerCase());
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const trimEnd = (s) => s.replace(/[\s,;:]+$/, "");
const endDot = (s) => (/[.!?)]$/.test(s) ? s : s + ".");

/**
 * Split notes into sentences, keeping track of headings and list items.
 * Returns [{ i, text, section, bullet, first }].
 */
export function splitSentences(text) {
  const out = [];
  let section = "";
  const lines = String(text).replace(/\r/g, "").split("\n");
  let para = [];
  const flush = (bullet = false) => {
    const flat = para.join(" ").replace(/\s+/g, " ").trim();
    para = [];
    if (!flat) return;
    const pieces = flat.split(/(?<=[.!?।])\s+(?=["'“‘(\[]?[\p{Lu}\p{N}])/u);
    let buf = "";
    let first = true;
    pieces.forEach((p, k) => {
      buf = buf ? `${buf} ${p}` : p;
      if (ABBR.test(buf) && k < pieces.length - 1) return;
      if (countWords(buf) >= 3) out.push({ text: buf, section, bullet, first });
      first = false;
      buf = "";
    });
  };
  for (let n = 0; n < lines.length; n++) {
    const raw = lines[n];
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    const md = line.match(/^#{1,6}\s+(.*)$/);
    const next = (lines[n + 1] || "").trim();
    const looksHeading =
      md ||
      (!BULLET.test(line) && countWords(line) <= 8 && !/[.!?,;:]$/.test(line) && !/[.!?]\s/.test(line) && (next || n === 0) && !/^(q|a|question|answer)\s*[:.)-]/i.test(line) && !/\s[-–—=:]\s/.test(line));
    if (looksHeading) {
      flush();
      section = (md ? md[1] : line).replace(/[*_#]+/g, "").trim();
      continue;
    }
    if (BULLET.test(line)) {
      flush();
      para = [line.replace(BULLET, "")];
      flush(true);
      continue;
    }
    // A single line that ends with a full stop is its own paragraph boundary in notes.
    para.push(line);
    if (/[.!?]$/.test(line) && countWords(para.join(" ")) > 40) flush();
  }
  flush();
  return out.map((s, i) => ({ ...s, i }));
}

/**
 * Key terms: single words and 2–3 word phrases of content words, scored by frequency,
 * spread across the notes, and a bonus for terms that are defined or capitalised mid-sentence.
 */
export function keyTerms(text, sents = splitSentences(text), defs = extractDefinitions(text, sents), limit = 20) {
  const scores = new Map();
  const display = new Map();
  const seenIn = new Map();
  const nounCue = new Map();
  const PRE = /^(the|a|an|of|and|in|into|on|by|with|from|for|their|its|his|her|our|your|this|these|that|those|some|any|no|each|every|which|whose|between|through|during|about|than)$/i;
  const POST = /^(is|are|was|were|has|have|can|will|may|of)$/i;
  sents.forEach((s, si) => {
    const ws = wordList(s.text);
    ws.forEach((w, k) => {
      if (k === 0 || PRE.test(ws[k - 1] || "") || POST.test(ws[k + 1] || "") || /^[A-Z]/.test(w)) nounCue.set(stem(w), (nounCue.get(stem(w)) || 0) + 1);
    });
    for (let n = 1; n <= 3; n++) {
      for (let k = 0; k + n <= ws.length; k++) {
        const g = ws.slice(k, k + n);
        if (g.some((w) => isStop(w) || w.length < 3 || /^\d+$/.test(w))) continue;
        const key = g.map(stem).join(" ");
        const weight = n === 1 ? 1 : n === 2 ? 1.6 : 1.9;
        scores.set(key, (scores.get(key) || 0) + weight);
        const m = display.get(key) || new Map();
        const surf = g.join(" ");
        m.set(surf, (m.get(surf) || 0) + 1);
        display.set(key, m);
        const set = seenIn.get(key) || new Set();
        set.add(si);
        seenIn.set(key, set);
      }
    }
  });
  const defKeys = new Set(defs.map((d) => wordList(d.term).map(stem).join(" ")));
  const headStems = new Set(sents.flatMap((s) => wordList(s.section || "").map(stem)));
  const out = [];
  for (const [key, sc] of scores) {
    const n = key.split(" ").length;
    const occ = seenIn.get(key).size;
    if (n > 1 && occ < 2 && !defKeys.has(key)) continue;
    let score = sc * (1 + Math.log(occ));
    if (defKeys.has(key)) score *= 2.2;
    if (key.split(" ").every((k) => headStems.has(k))) score *= 1.4;
    if (n === 1 && /ly$/.test(key)) score *= 0.4;
    const last = key.split(" ").pop();
    const nounish = defKeys.has(key) || n > 1 || nounCue.has(last) || /(tion|sion|sis|ment|ity|ism|ance|ence|ure|ogy|ide|ose|ein|ase|ast|ist|ium|um|on|ar|cle|yte|phyll|plast|cell|ell)$/.test(last);
    if (!nounish) score *= 0.55;
    const forms = [...display.get(key)].sort((a, b) => b[1] - a[1]);
    let label = forms[0][0];
    const lower = forms.find(([f]) => f === f.toLowerCase());
    if (lower && !/^[A-Z0-9]{2,}$/.test(label)) label = lower[0];
    out.push({ key, label, score, count: occ, n, noun: nounish && !(n === 1 && /(s|ed|ing)$/.test(label) && !nounCue.has(last)) });
  }
  out.sort((a, b) => b.score - a.score);
  // Drop single words that are fully covered by a stronger phrase, and phrases that are sub-phrases of stronger ones.
  const kept = [];
  for (const t of out) {
    if (kept.some((k) => k.n > t.n && (" " + k.key + " ").includes(" " + t.key + " ") && k.count >= t.count * 0.8)) continue;
    if (kept.some((k) => k.n < t.n && (" " + t.key + " ").includes(" " + k.key + " ") && t.count < k.count * 0.5 && !defKeys.has(t.key))) continue;
    kept.push(t);
    if (kept.length >= limit) break;
  }
  return kept;
}

// ---------- definitions ----------
const DEF_VERBS = [
  [/^(.{2,60}?)\s+(?:is|are)\s+(?:defined as|known as|called)\s+(.{8,})$/i, "def"],
  [/^(.{2,60}?)\s+(?:refers? to|means|is the term for|stands for|denotes)\s+(.{6,})$/i, "def"],
  [/^(.{2,60}?)\s+(?:is|are|was|were)\s+((?:a|an|the|one of the)\s+.{8,})$/i, "def"],
  [/^(.{2,40}?)\s+(?:is|are)\s+((?:[a-z-]+\s+){0,3}[a-z-]+\s+(?:that|which|where|who|used|found|made|on|in|of)\b.{6,})$/i, "def"],
];

/** Replace a leading It/This/They with the section heading, so a sentence makes sense on its own. */
export function resolvePronoun(t, section) {
  if (section && /^(it|they)\s/i.test(t) && countWords(section) <= 4) return section + t.replace(/^\S+/, "");
  return t.replace(/^(this|these)\s/i, (m) => (m.toLowerCase().startsWith("these") ? "The " : "The "));
}
function cleanTerm(t) {
  return t
    .replace(/^(?:the|a|an)\s+/i, "")
    .replace(/[*_`"“”]/g, "")
    .replace(/\s*\(.*?\)\s*$/, "")
    .trim();
}
function goodTerm(t) {
  const n = countWords(t);
  if (n < 1 || n > 6) return false;
  if (/^(it|this|that|these|those|they|he|she|there|here|which|what|one|some|many|most|all|each)\b/i.test(t)) return false;
  if (/[,;]/.test(t)) return false;
  if (/\b(is|are|was|were|has|have|can|will)\b/i.test(t)) return false;
  return true;
}

/**
 * Find definitions in notes: "Term: meaning" lines, Q/A pairs, "X is a/the …", "X refers to …",
 * "… is known as X", "… called X", and acronyms with their expansion.
 * Returns [{ term, def, source, kind }].
 */
export function extractDefinitions(text, sents = splitSentences(text)) {
  const out = [];
  const seen = new Set();
  const add = (term, def, source, kind) => {
    term = cleanTerm(term);
    def = trimEnd(def.replace(/^\s*[-–—:=]\s*/, "").trim());
    if (!goodTerm(term) || countWords(def) < 2) return;
    const k = term.toLowerCase();
    if (seen.has(k)) return;
    seen.add(k);
    out.push({ term: /^[a-z]/.test(term) && !/^[a-z]+[A-Z]/.test(term) ? cap(term) : term, def: endDot(cap(def)), source, kind });
  };
  // Line formats first (most reliable).
  const lines = String(text).replace(/\r/g, "").split("\n").map((l) => l.trim().replace(BULLET, ""));
  for (let n = 0; n < lines.length; n++) {
    const l = lines[n];
    const qa = l.match(/^(?:q(?:uestion)?\s*\d*\s*[:.)-])\s*(.+)$/i);
    if (qa) {
      const a = (lines[n + 1] || "").match(/^(?:a(?:ns(?:wer)?)?\s*[:.)-])\s*(.+)$/i);
      if (a) {
        out.push({ term: qa[1].trim(), def: endDot(a[1].trim()), source: `${qa[1]} ${a[1]}`, kind: "qa" });
        n++;
        continue;
      }
    }
    const m = l.match(/^([^:=–—]{2,50}?)\s*(?::|\s[-–—=]\s)\s*(.{6,})$/);
    if (m && countWords(m[1]) <= 6 && !/^(note|example|eg|e\.g|tip|remember|ans|answer|q|question)$/i.test(m[1].trim())) add(m[1], m[2], l, "line");
  }
  for (const s of sents) {
    const t = s.text.replace(/\s+/g, " ").trim();
    // "… is known as / is called X."
    const rev = t.match(/^(.{12,}?)\s+(?:is|are)\s+(?:known as|called|termed)\s+(?:an?\s+|the\s+)?([^,.;]{2,50})[.!]?$/i);
    if (rev && goodTerm(cleanTerm(rev[2]))) {
      add(rev[2], resolvePronoun(rev[1], s.section), t, "named");
      continue;
    }
    // "… organelles called chloroplasts" → chloroplasts: the organelle described
    const called = t.match(/\b(?:called|named|known as)\s+([A-Za-z][\w-]*(?:\s[A-Za-z][\w-]*)?)/);
    // Acronyms: "ATP (adenosine triphosphate)"
    for (const ac of t.matchAll(/\b([A-Z][A-Z0-9]{1,7})\s*\(([a-z][a-z\s-]{5,60})\)/g)) {
      const rest = t.slice(ac.index + ac[0].length).match(/^\s+(?:is|are)\s+(.{6,})$/);
      add(ac[1], rest ? `${ac[2]}: ${rest[1]}` : ac[2], t, "acronym");
    }
    let hit = false;
    for (const [re, kind] of DEF_VERBS) {
      const m = t.match(re);
      if (m) {
        const term = cleanTerm(m[1]);
        if (goodTerm(term)) {
          add(term, m[2], t, kind);
          hit = true;
          break;
        }
      }
    }
    if (!hit && called && countWords(t) <= 40) {
      // Use the sentence itself, minus the name, as the clue: "…inside tiny organelles called chloroplasts" → "…inside tiny organelles".
      const clue = resolvePronoun(t.replace(new RegExp(`,?\\s*${escapeRe(called[0])}`), ""), s.section);
      if (countWords(clue) >= 4) add(called[1], clue, t, "called");
    }
  }
  return out;
}

// ---------- sentence scoring ----------
const CUE = /\b(important|key|main|essential|significant|because|therefore|thus|hence|result|cause|leads? to|means|defined|called|known as|example|such as|first|finally|depends|unlike|whereas|however|always|never)\b/i;

/** Score every sentence for how central it is to the notes. */
export function scoreSentences(sents, terms, defs) {
  const tw = new Map(terms.map((t, r) => [t.key, (terms.length - r) / terms.length]));
  const defSrc = new Set(defs.map((d) => d.source));
  const sectionsSeen = new Set();
  return sents.map((s) => {
    const st = wordList(s.text).map(stem);
    const joined = " " + st.join(" ") + " ";
    let score = 0;
    for (const [k, w] of tw) if (joined.includes(" " + k + " ")) score += w * (k.includes(" ") ? 1.4 : 1);
    const n = st.length;
    score /= Math.sqrt(Math.max(4, n));
    if (s.first) score *= 1.2;
    if (!sectionsSeen.has(s.section)) {
      score *= 1.15;
      sectionsSeen.add(s.section);
    }
    if (defSrc.has(s.text)) score *= 1.5;
    if (CUE.test(s.text)) score *= 1.12;
    if (/\d/.test(s.text)) score *= 1.05;
    if (n < 6) score *= 0.6;
    if (n > 45) score *= 0.8;
    return { ...s, score, stems: new Set(st.filter((w) => !STOP.has(w))) };
  });
}

function overlap(a, b) {
  let k = 0;
  for (const w of a) if (b.has(w)) k++;
  return k / Math.max(1, Math.min(a.size, b.size));
}

/** Pick `k` sentences, best first, avoiding near-duplicates (MMR-style). Returns them in reading order. */
export function pickSentences(scored, k) {
  const pool = [...scored].sort((a, b) => b.score - a.score);
  const chosen = [];
  while (chosen.length < k && pool.length) {
    let bi = 0,
      best = -Infinity;
    pool.forEach((s, j) => {
      const red = chosen.length ? Math.max(...chosen.map((c) => overlap(s.stems, c.stems))) : 0;
      const v = s.score * (1 - 0.65 * red);
      if (v > best) {
        best = v;
        bi = j;
      }
    });
    chosen.push(pool.splice(bi, 1)[0]);
  }
  return chosen.sort((a, b) => a.i - b.i);
}

/** Everything the study tools need from one block of notes. */
export function analyse(text) {
  const sents = splitSentences(text);
  const defs = extractDefinitions(text, sents);
  const terms = keyTerms(text, sents, defs, 24);
  const scored = scoreSentences(sents, terms, defs);
  return { sents, defs, terms, scored, words: countWords(text) };
}

// ---------- questions from sentences ----------
/** Turn a fact into a question for Cornell cues and self-tests. */
export function questionFor(sentence, defs = []) {
  const t = sentence.replace(/\s+/g, " ").trim().replace(/[.!]$/, "").replace(/^(first|firstly|then|next|finally|also|after that|in addition),?\s+/i, "");
  const d = defs.find((x) => x.source === sentence);
  if (d && d.kind !== "qa") return `What ${isPlural(d.term) ? "are" : "is"} ${/^[A-Z]{2,}/.test(d.term) ? d.term : d.term.toLowerCase()}?`;
  let m;
  if ((m = t.match(/^(.{4,80}?)\s+(?:is|are)\s+important\s+because\b/i))) return `Why is ${lowerFirst(m[1])} important?`;
  if ((m = t.match(/^(.{4,80}?)\s+(?:depends?|depend)\s+on\b/i))) return `What does ${lowerFirst(m[1])} depend on?`;
  if ((m = t.match(/^(.{4,80}?)\s+(?:takes? place|occurs?|happens?)\s+(?:mainly\s+)?(in|at|inside|on)\b/i))) return `Where ${isPlural(m[1]) ? "do" : "does"} ${lowerFirst(m[1])} take place?`;
  if ((m = t.match(/^(.{4,80}?)\s+(?:consists? of|is made of|is made up of|contains?)\b/i))) return `What does ${lowerFirst(m[1])} consist of?`;
  if ((m = t.match(/^(.{4,60}?)\s+(?:causes?|leads? to|results? in|produces?)\b/i))) return `What does ${lowerFirst(m[1])} lead to?`;
  if (/\bbecause\b/i.test(t)) return `Why? ${cap(t.split(/\bbecause\b/i)[0].trim())}…`;
  if (/^(first|then|next|finally)\b/i.test(t)) return "What happens in this step?";
  if (/\b(two|three|four|five|several)\s+(stages|steps|types|kinds|parts|phases)\b/i.test(t)) return `What are the ${t.match(/\b(two|three|four|five|several)\s+(stages|steps|types|kinds|parts|phases)\b/i)[0]}?`;
  return null;
}
function isPlural(term) {
  const w = term.split(/\s+/).pop().toLowerCase();
  return /[^su]s$/.test(w) && !/(sis|us|ss|ics)$/.test(w);
}
function lowerFirst(s) {
  s = s.replace(/^(the|a|an)\s+/i, (x) => x.toLowerCase());
  return /^[A-Z]{2,}/.test(s) ? s : s[0].toLowerCase() + s.slice(1);
}

// ---------- summarizer ----------
/**
 * Summarize notes. `level`: 'brief' | 'standard' | 'detailed'.
 * Returns { tldr, points:[{section, text, i}], glossary, terms, cornell, highlights:Set, stats }.
 */
export function summarize(text, { level = "standard", maxTerms = 12 } = {}) {
  const A = analyse(text);
  const { sents, defs, terms, scored } = A;
  if (sents.length < 2) return { error: "Paste at least a few sentences of notes to summarize." };
  const ratio = { brief: 0.18, standard: 0.32, detailed: 0.5 }[level] || 0.32;
  const k = Math.max(2, Math.min(sents.length, Math.round(sents.length * ratio)));
  const picked = pickSentences(scored, k);
  const tl = pickSentences(scored, Math.min(2, sents.length));
  const tldr = tl.map((s) => s.text).join(" ");
  const points = picked.map((s) => ({ section: s.section, text: s.text, i: s.i }));
  const cornell = picked.map((s) => ({ cue: questionFor(s.text, defs) || cueFromTerms(s, terms), note: s.text }));
  const after = countWords(points.map((p) => p.text).join(" "));
  return {
    tldr,
    points,
    glossary: defs.slice(0, 30),
    terms: terms.slice(0, maxTerms),
    cornell,
    highlights: new Set(picked.map((s) => s.i)),
    sents,
    stats: { before: A.words, after, sentences: sents.length, kept: picked.length, readBefore: A.words / 220, readAfter: after / 220 },
  };
}
function cueFromTerms(s, terms) {
  const st = " " + wordList(s.text).map(stem).join(" ") + " ";
  const t = terms.find((x) => st.includes(" " + x.key + " "));
  return t ? `Key idea: ${t.label}` : "Key idea";
}

// ---------- flashcards ----------
/**
 * Build flashcards. kinds: { defs, cloze, qa }. Returns [{ id, front, back, kind, source }].
 */
export function makeFlashcards(text, { defs: useDefs = true, cloze = true, max = 30 } = {}) {
  const A = analyse(text);
  const cards = [];
  const seenFront = new Set();
  const push = (c) => {
    const k = c.front.toLowerCase();
    if (seenFront.has(k) || cards.length >= max) return;
    seenFront.add(k);
    cards.push({ id: `c${cards.length + 1}`, ...c });
  };
  if (useDefs)
    for (const d of A.defs) {
      if (d.kind === "qa") push({ front: d.term, back: d.def, kind: "qa", source: d.source });
      else push({ front: d.term, back: d.def, kind: "definition", source: d.source });
    }
  if (cloze) {
    const usedTerms = new Set(A.defs.map((d) => d.source));
    const order = [...A.scored].sort((a, b) => b.score - a.score);
    for (const s of order) {
      if (cards.length >= max) break;
      if (usedTerms.has(s.text) && useDefs) continue;
      const c = clozeFor(s.text, A.terms);
      if (c) push({ front: c.front, back: c.answer, kind: "cloze", source: s.text });
    }
  }
  return { cards, terms: A.terms, defs: A.defs };
}

/** Blank out the most important term in a sentence. */
export function clozeFor(sentence, terms, avoid = new Set()) {
  if (countWords(sentence) < 6 || countWords(sentence) > 45) return null;
  const ws = wordList(sentence);
  const present = terms.filter((t) => {
    for (let k = 0; k + t.n <= ws.length; k++) if (ws.slice(k, k + t.n).map(stem).join(" ") === t.key) return true;
    return false;
  });
  // Prefer nouns, and the longest phrase that contains the strongest term ("light energy", not "energy").
  const ordered = [...present.filter((t) => t.noun), ...present.filter((t) => !t.noun)].map((t) => present.find((p) => p.n > t.n && (" " + p.key + " ").includes(" " + t.key + " ")) || t);
  for (const t of ordered) {
    if (avoid.has(t.key)) continue;
    const n = t.n;
    for (let k = 0; k + n <= ws.length; k++) {
      if (ws.slice(k, k + n).map(stem).join(" ") !== t.key) continue;
      const surface = ws.slice(k, k + n);
      const re = new RegExp(`\\b${surface.map(escapeRe).join("[\\s\\-]+")}\\b`);
      const m = sentence.match(re);
      if (!m) continue;
      if (m.index < 2 && countWords(sentence) < 8) continue;
      return { front: sentence.slice(0, m.index) + "_____" + sentence.slice(m.index + m[0].length), answer: m[0], key: t.key, index: m.index };
    }
  }
  // Numbers make good blanks too.
  const num = sentence.match(/\b\d+(?:[.,]\d+)?\s?(?:°C|%|km|kg|m|cm|years?|days?|hours?)?\b/);
  if (num && num[0].length > 1) return { front: sentence.slice(0, num.index) + "_____" + sentence.slice(num.index + num[0].length), answer: num[0].trim(), key: "#" + num[0], index: num.index, numeric: true };
  return null;
}
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Parse cards the user typed or pasted: "front :: back", tab-separated, "front - back" or Q:/A: pairs. */
export function parseCardList(text) {
  const out = [];
  const lines = String(text).replace(/\r/g, "").split("\n");
  for (let n = 0; n < lines.length; n++) {
    const l = lines[n].trim();
    if (!l) continue;
    const q = l.match(/^q(?:uestion)?\s*\d*\s*[:.)-]\s*(.+)$/i);
    const a = (lines[n + 1] || "").trim().match(/^a(?:ns(?:wer)?)?\s*[:.)-]\s*(.+)$/i);
    if (q && a) {
      out.push({ front: q[1], back: a[1] });
      n++;
      continue;
    }
    const parts = l.includes("\t") ? l.split("\t") : l.includes("::") ? l.split("::") : l.split(/\s[-–—=]\s|:\s/);
    if (parts.length >= 2 && parts[0].trim() && parts.slice(1).join(" ").trim()) out.push({ front: parts[0].trim(), back: parts.slice(1).join(" - ").trim() });
  }
  return out.map((c, i) => ({ id: `u${i + 1}`, kind: "typed", ...c }));
}

// Leitner boxes: 1 (new / wrong) to 5 (known). Days until the card is due again.
export const BOX_DAYS = [0, 0, 1, 3, 7, 16];
export function nextBox(box, grade) {
  if (grade === "again") return 1;
  if (grade === "hard") return Math.max(1, box);
  if (grade === "easy") return Math.min(5, box + 2);
  return Math.min(5, box + 1);
}

// ---------- quiz ----------
function shuffle(arr, rnd) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function shape(s) {
  return { words: countWords(s), capital: /^[A-Z]/.test(s), acronym: /^[A-Z0-9]{2,}$/.test(s), numeric: /\d/.test(s) };
}
function distractors(answer, pool, rnd, n = 3, prompt = "") {
  const a = answer.toLowerCase();
  const inPrompt = " " + wordList(prompt).map(stem).join(" ") + " ";
  const sa = shape(answer);
  const seen = new Set();
  const cand = pool.filter((p) => {
    const l = p && p.toLowerCase();
    if (!l || l === a || a.includes(l) || l.includes(a) || stem(l) === stem(a) || seen.has(l)) return false;
    if (prompt && inPrompt.includes(" " + wordList(l).map(stem).join(" ") + " ")) return false;
    seen.add(l);
    return true;
  });
  // The pool is already in preference order (defined terms, then nouns); shuffle within the top of it.
  const top = shuffle(cand.slice(0, Math.max(n * 3, 8)), rnd);
  const ranked = top.sort((x, y) => {
    const sx = shape(x),
      sy = shape(y);
    const dx = Math.abs(sx.words - sa.words) + (sx.acronym !== sa.acronym ? 2 : 0) + (sx.numeric !== sa.numeric ? 3 : 0);
    const dy = Math.abs(sy.words - sa.words) + (sy.acronym !== sa.acronym ? 2 : 0) + (sy.numeric !== sa.numeric ? 3 : 0);
    return dx - dy;
  });
  return ranked.slice(0, n);
}
function numericDistractors(answer, rnd) {
  const m = answer.match(/(\d+(?:\.\d+)?)/);
  if (!m) return [];
  const v = Number(m[1]);
  const opts = new Set();
  const steps = v >= 10 ? [0.5, 0.8, 1.25, 1.5, 2] : [-2, -1, 1, 2, 3];
  for (const s of shuffle(steps, rnd)) {
    let x = v >= 10 ? Math.round(v * s) : v + s;
    if (x <= 0 || x === v) continue;
    opts.add(answer.replace(m[1], String(x)));
    if (opts.size >= 3) break;
  }
  return [...opts];
}
function swapForFalse(sentence, terms, rnd) {
  const ws = wordList(sentence);
  const present = terms.filter((t) => {
    for (let k = 0; k + t.n <= ws.length; k++) if (ws.slice(k, k + t.n).map(stem).join(" ") === t.key) return true;
    return false;
  });
  if (!present.length) {
    const num = sentence.match(/\b(\d+(?:\.\d+)?)\b/);
    if (num) {
      const alt = numericDistractors(num[0], rnd)[0];
      if (alt) return { text: sentence.replace(num[0], alt), changed: `${num[0]} → ${alt}` };
    }
    return null;
  }
  // Swap a noun that is not the sentence subject, so the false statement still reads naturally.
  const expand = (t) => present.find((p) => p.n > t.n && (" " + p.key + " ").includes(" " + t.key + " ")) || t;
  const cands = [...present.filter((t) => t.noun), ...present.filter((t) => !t.noun)].map(expand);
  const target = cands.find((t) => (clozeFor(sentence, [t]) || {}).index > 0) || cands[0];
  const others = terms.filter((t) => t.noun && t.key !== target.key && !present.some((p) => p.key === t.key) && (t.n > 1) === (target.n > 1));
  if (!others.length) return null;
  const repl = others[Math.floor(rnd() * Math.min(others.length, 6))];
  const c = clozeFor(sentence, [target]);
  if (!c) return null;
  const text = c.front.replace("_____", c.index === 0 ? cap(repl.label) : repl.label);
  return { text, changed: `${c.answer} → ${repl.label}` };
}

/**
 * Build a quiz. types: subset of ['mcq','tf','fill']. Returns [{ id, type, prompt, options?, answer, explain, source }].
 */
export function makeQuiz(text, { count = 10, types = ["mcq", "tf", "fill"], seed = 7, difficulty = "mixed" } = {}) {
  const A = analyse(text);
  const rnd = mulberry32(seed);
  if (A.sents.length < 3) return { error: "Paste at least a few sentences of notes to build a quiz.", questions: [] };
  const termPool = [...A.defs.filter((d) => d.kind !== "qa").map((d) => d.term), ...A.terms.filter((t) => t.noun).map((t) => t.label)];
  const qs = [];
  const usedSrc = new Set();
  const order = [...A.scored].sort((a, b) => b.score - a.score);
  const pool = difficulty === "easy" ? order.slice(0, Math.ceil(order.length * 0.6)) : difficulty === "hard" ? [...order].reverse() : order;
  const want = (t) => types.includes(t);
  const plan = [];
  for (let i = 0; i < count; i++) plan.push(types[i % types.length]);

  // Definition questions first: they make the cleanest MCQs.
  const defQs = shuffle(A.defs.filter((d) => d.kind !== "qa"), rnd);
  let di = 0;
  let si = 0;
  let guard = 0;
  for (const kind of plan) {
    if (qs.length >= count || guard++ > count * 6) break;
    let made = null;
    if (kind === "mcq") {
      if (di < defQs.length && (rnd() < 0.55 || si >= pool.length)) {
        const d = defQs[di++];
        const opts = distractors(d.term, termPool, rnd, 3, d.def);
        if (opts.length >= 2) {
          made = { type: "mcq", prompt: `Which term matches this description? “${d.def.replace(/\.$/, "")}”`, options: shuffle([d.term, ...opts], rnd), answer: d.term, explain: d.source, source: d.source };
          usedSrc.add(d.source);
        }
      }
      while (!made && si < pool.length) {
        const s = pool[si++];
        if (usedSrc.has(s.text)) continue;
        const c = clozeFor(s.text, A.terms);
        if (!c) continue;
        const opts = c.numeric ? numericDistractors(c.answer, rnd) : distractors(c.answer, termPool, rnd, 3, c.front);
        if (opts.length < 2) continue;
        made = { type: "mcq", prompt: c.front, options: shuffle([c.answer, ...opts], rnd), answer: c.answer, explain: s.text, source: s.text };
        usedSrc.add(s.text);
      }
    } else if (kind === "tf") {
      while (!made && si < pool.length) {
        const s = pool[si++];
        if (usedSrc.has(s.text) || countWords(s.text) > 40) continue;
        const truth = rnd() < 0.5;
        if (truth) made = { type: "tf", prompt: s.text, options: ["True", "False"], answer: "True", explain: "This matches your notes.", source: s.text };
        else {
          const f = swapForFalse(s.text, A.terms, rnd);
          if (!f) continue;
          made = { type: "tf", prompt: f.text, options: ["True", "False"], answer: "False", explain: `Your notes say: “${s.text}” (${f.changed})`, source: s.text };
        }
        usedSrc.add(s.text);
      }
    } else if (kind === "fill") {
      if (di < defQs.length && rnd() < 0.4) {
        const d = defQs[di++];
        made = { type: "fill", prompt: `Name the term: ${d.def}`, answer: d.term, explain: d.source, source: d.source };
        usedSrc.add(d.source);
      }
      while (!made && si < pool.length) {
        const s = pool[si++];
        if (usedSrc.has(s.text)) continue;
        const c = clozeFor(s.text, A.terms);
        if (!c) continue;
        made = { type: "fill", prompt: c.front, answer: c.answer, explain: s.text, source: s.text };
        usedSrc.add(s.text);
      }
    }
    if (made) qs.push(made);
  }
  // Top up with whatever type still works if we fell short.
  if (qs.length < count) {
    for (const s of pool) {
      if (qs.length >= count) break;
      if (usedSrc.has(s.text)) continue;
      const c = clozeFor(s.text, A.terms);
      if (!c) continue;
      if (want("mcq")) {
        const opts = c.numeric ? numericDistractors(c.answer, rnd) : distractors(c.answer, termPool, rnd, 3, c.front);
        if (opts.length >= 2) {
          qs.push({ type: "mcq", prompt: c.front, options: shuffle([c.answer, ...opts], rnd), answer: c.answer, explain: s.text, source: s.text });
          usedSrc.add(s.text);
          continue;
        }
      }
      if (want("fill")) {
        qs.push({ type: "fill", prompt: c.front, answer: c.answer, explain: s.text, source: s.text });
        usedSrc.add(s.text);
      }
    }
  }
  return { questions: qs.map((q, i) => ({ id: `q${i + 1}`, ...q })), available: A.sents.length };
}

/** Forgiving answer check for typed answers: case, punctuation, plurals and one typo. */
export function answerMatches(given, answer) {
  const norm = (s) =>
    String(s)
      .toLowerCase()
      .replace(/^(the|a|an)\s+/, "")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();
  const g = norm(given),
    a = norm(answer);
  if (!g) return false;
  if (g === a || stem(g) === stem(a)) return true;
  if (a.length >= 5 && levenshtein(g, a) <= (a.length > 9 ? 2 : 1)) return true;
  return false;
}
export function levenshtein(a, b) {
  const m = a.length,
    n = b.length;
  if (Math.abs(m - n) > 3) return 99;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

// ---------- concept explainer ----------
const ROLES = [
  ["definition", /\b(is|are)\s+(a|an|the)\b|\brefers? to\b|\bmeans\b|\bdefined as\b|\bknown as\b|\bcalled\b/i],
  ["example", /\b(for example|for instance|e\.g\.|such as|like when|an example)\b/i],
  ["process", /^(first|firstly|then|next|after that|finally|lastly|in the (first|second|final) (step|stage))\b|\b(step|stage|phase)s?\b|\b(takes place|occurs|happens)\b/i],
  ["cause", /\b(because|due to|caused by|causes|leads? to|results? in|therefore|so that|as a result|depends on|affect(s|ed|ing)?)\b/i],
  ["importance", /\b(important|essential|vital|crucial|matters|necessary|needed|helps?|allows?|used (for|to|in)|role)\b/i],
  ["contrast", /\b(unlike|whereas|in contrast|on the other hand|differs?|difference|compared (to|with)|however|not to be confused)\b/i],
];

/** Plain-English swaps for common academic words, used by the "Simple" reading level. */
const SIMPLE = {
  utilize: "use", utilise: "use", utilizes: "uses", utilises: "uses", approximately: "about", numerous: "many", sufficient: "enough", obtain: "get", obtains: "gets", obtained: "got", require: "need", requires: "needs", required: "needed", commence: "start", commences: "starts", terminate: "end", demonstrate: "show", demonstrates: "shows", indicate: "show", indicates: "shows", subsequently: "later", consequently: "so", therefore: "so", thus: "so", hence: "so", however: "but", nevertheless: "still", additionally: "also", furthermore: "also", moreover: "also", facilitate: "help", facilitates: "helps", component: "part", components: "parts", constitute: "make up", constitutes: "makes up", comprise: "include", comprises: "includes", initiate: "start", initiates: "starts", maximum: "most", minimum: "least", modify: "change", modifies: "changes", optimal: "best", primary: "main", primarily: "mainly", principal: "main", prior: "before", purchase: "buy", regarding: "about", significant: "big", significantly: "a lot", substantial: "large", transmit: "send", transmits: "sends", magnitude: "size", acquire: "get", acquires: "gets", assist: "help", assists: "helps", attempt: "try", beneficial: "helpful", concentration: "level", constant: "steady", decrease: "drop", decreases: "drops", diminish: "shrink", eliminate: "remove", eliminates: "removes", emit: "give off", emits: "gives off", enable: "let", enables: "lets", ensure: "make sure", equivalent: "equal", exhibit: "show", exhibits: "shows", expand: "grow", fundamental: "basic", generate: "make", generates: "makes", identical: "the same", illustrate: "show", increase: "rise", increases: "rises", individual: "single", inhibit: "block", inhibits: "blocks", insufficient: "not enough", interact: "act on each other", maintain: "keep", maintains: "keeps", mechanism: "way it works", objective: "goal", occur: "happen", occurs: "happens", possess: "have", possesses: "has", proceed: "go on", produce: "make", produces: "makes", reside: "live", retain: "keep", retains: "keeps", sufficiently: "enough", synthesize: "build", synthesise: "build", transform: "change", transforms: "changes", absorbs: "soaks up", absorb: "soak up", releases: "gives out", release: "give out", respiration: "respiration (how cells get energy from food)",
};

export function simplify(sentence) {
  let s = sentence.replace(/\b[A-Za-z]+\b/g, (w) => {
    const r = SIMPLE[w.toLowerCase()];
    if (!r) return w;
    return /^[A-Z]/.test(w) ? cap(r) : r;
  });
  s = s.replace(/\s*\([^)]{0,80}\)/g, (m) => (/\d/.test(m) ? m : "")).replace(/;\s+/g, ". ");
  return s
    .split(/(?<=\.)\s+/)
    .map((x) => cap(x.trim()))
    .join(" ");
}

/** Terms that appear in the notes and probably need explaining to a beginner. */
export function jargon(text) {
  return [...new Set(wordList(text).filter((w) => w.length >= 9 && !isStop(w) && !/^\d/.test(w)).map((w) => w.toLowerCase()))].slice(0, 12);
}

/**
 * Explain `concept` using only the given notes. Returns sections of sentences by role,
 * related concepts and self-check questions.
 */
export function explainConcept(notes, concept, { level = "standard" } = {}) {
  const A = analyse(notes);
  const cStems = wordList(concept).filter((w) => !isStop(w)).map(stem);
  if (!cStems.length) return { error: "Type the concept you want explained." };
  const cKey = cStems.join(" ");
  // Sentences that mention the concept (all its content words), plus the one after a mention when it starts with It/This.
  const hits = [];
  A.sents.forEach((s, i) => {
    const st = wordList(s.text).map(stem);
    const joined = " " + st.join(" ") + " ";
    const full = joined.includes(" " + cKey + " ");
    const partial = cStems.length > 1 && cStems.filter((c) => st.includes(c)).length >= Math.ceil(cStems.length * 0.6);
    if (full || partial) hits.push({ ...s, strength: full ? 2 : 1 });
    else if (hits.length && hits[hits.length - 1].i === i - 1 && /^(it|this|these|they|its)\b/i.test(s.text)) hits.push({ ...s, strength: 1, follow: true });
  });
  if (!hits.length) return { found: false, concepts: A.terms.slice(0, 12).map((t) => t.label) };
  const def = A.defs.find((d) => wordList(d.term).map(stem).join(" ") === cKey) || A.defs.find((d) => wordList(d.term).map(stem).join(" ").includes(cKey));
  const sections = { definition: [], example: [], process: [], cause: [], importance: [], contrast: [], other: [] };
  const used = new Set();
  if (def) {
    sections.definition.push(def.source);
    used.add(def.source);
  }
  for (const h of hits) {
    if (used.has(h.text)) continue;
    const role = (ROLES.find(([, re]) => re.test(h.text)) || ["other"])[0];
    if (role === "definition" && sections.definition.length >= 2) sections.other.push(h.text);
    else sections[role].push(h.text);
    used.add(h.text);
  }
  const fmt = level === "simple" ? simplify : (x) => x;
  for (const k of Object.keys(sections)) sections[k] = sections[k].map(fmt);
  // Related concepts: key terms that co-occur in the concept's sentences.
  const hitText = " " + hits.map((h) => wordList(h.text).map(stem).join(" ")).join(" ") + " ";
  const related = A.terms.filter((t) => t.noun && t.key !== cKey && !cKey.includes(t.key) && !t.key.includes(cKey) && hitText.includes(" " + t.key + " ")).slice(0, 8);
  const questions = [];
  const name = concept.trim();
  if (def) questions.push(`In your own words, what ${isPlural(name) ? "are" : "is"} ${name}?`);
  for (const h of hits) {
    if (def && h.text === def.source) continue;
    const q = questionFor(h.text, A.defs);
    if (q && !questions.includes(q)) questions.push(q);
    if (questions.length >= 5) break;
  }
  if (sections.example.length) questions.push(`Give your own example of ${name}.`);
  if (sections.contrast.length) {
    const other = sections.contrast.join(" ").match(/\b(?:unlike|compared (?:to|with)|different from|whereas|than)\s+((?:the\s+)?[a-z][\w-]*(?:\s[a-z][\w-]*)?)/i);
    questions.push(`How is ${name} different from ${other ? other[1].replace(/^the\s+/i, "") : "similar ideas"}?`);
  }
  const oneLine = def ? `${def.term}: ${def.def}` : fmt(hits[0].text);
  return {
    found: true,
    oneLine: level === "simple" ? simplify(oneLine) : oneLine,
    sections,
    related: related.map((t) => t.label),
    questions: questions.slice(0, 6),
    mentions: hits.length,
    keyStems: [...new Set(hits.flatMap((h) => wordList(h.text).filter((w) => !isStop(w) && w.length > 3).map(stem)))],
    concepts: A.terms.slice(0, 12).map((t) => t.label),
  };
}

/**
 * Feynman check: compare the student's own explanation with the notes' key ideas.
 * Returns coverage %, covered and missing key terms, and readability hints.
 */
export function feynmanCheck(own, notes, concept) {
  const A = analyse(notes);
  const ex = explainConcept(notes, concept);
  const ownStems = new Set(wordList(own).map(stem));
  const cStems = new Set(wordList(concept).map(stem));
  let important = A.terms.filter((t) => t.key.split(" ").every((k) => !cStems.has(k)));
  if (ex.found) {
    const ks = new Set(ex.keyStems);
    important = important.filter((t) => t.key.split(" ").some((k) => ks.has(k)));
  }
  important = important.slice(0, 10);
  const covered = important.filter((t) => t.key.split(" ").every((k) => ownStems.has(k)));
  const missing = important.filter((t) => !covered.includes(t));
  const sents = splitSentences(own);
  const ownWords = countWords(own);
  const avgLen = sents.length ? ownWords / sents.length : ownWords;
  const longWords = wordList(own).filter((w) => w.length >= 11).length;
  const tips = [];
  if (ownWords < 25) tips.push("Write a bit more: aim for 3 to 5 sentences, as if teaching a friend.");
  if (avgLen > 25) tips.push("Your sentences are long. Break them up; short sentences show you really understand.");
  if (longWords > 3) tips.push("You used several long technical words. Try explaining at least one of them in plain words.");
  if (!/\b(because|so|which means|this means|that is why|for example|like)\b/i.test(own)) tips.push("Add a 'because' or 'for example'. Explaining why, or giving an example, is the best test of understanding.");
  return { coverage: important.length ? (covered.length / important.length) * 100 : 0, covered: covered.map((t) => t.label), missing: missing.map((t) => t.label), words: ownWords, avgLen, tips };
}

// ---------- revision plan ----------
export const INTERVALS = {
  standard: [1, 3, 7, 14, 30],
  intensive: [1, 2, 4, 7, 12],
  light: [2, 7, 21],
};
const DIFF_HOURS = { easy: 1.5, medium: 3, hard: 5 };
const DIFF_W = { easy: 1, medium: 2, hard: 3 };

/** Parse "Topic, hard, 4h" style lines. */
export function parseTopics(text) {
  const out = [];
  for (const raw of String(text).replace(/\r/g, "").split("\n")) {
    let l = raw.trim().replace(BULLET, "");
    if (!l) continue;
    let diff = "medium",
      hours = null,
      subject = "";
    const h = l.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hours?)\b/i);
    if (h) {
      hours = Number(h[1]);
      l = l.replace(h[0], " ");
    }
    const d = l.match(/\b(easy|medium|moderate|hard|difficult|tough|weak|strong)\b/i);
    if (d) {
      const w = d[1].toLowerCase();
      diff = w === "easy" || w === "strong" ? "easy" : w === "hard" || w === "difficult" || w === "tough" || w === "weak" ? "hard" : "medium";
      l = l.replace(d[0], " ");
    }
    const sub = l.match(/^\s*([^:>|]{2,30})\s*[:>|]\s*(.+)$/);
    if (sub) {
      subject = sub[1].trim();
      l = sub[2];
    }
    const name = l.replace(/[,;()\[\]]+/g, " ").replace(/\s+/g, " ").trim();
    if (!name) continue;
    out.push({ id: `t${out.length + 1}`, name, subject, diff, hours: hours ?? DIFF_HOURS[diff] });
  }
  return out;
}

const DAY = 86400000;
export function isoDay(d) {
  return new Date(d).toISOString().slice(0, 10);
}
export function parseIso(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ""));
  return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null;
}

/**
 * Build a day-by-day plan: new topics first (hardest first, or interleaved by subject),
 * spaced revisions after each topic is finished, and a final phase of mock tests and full revision.
 */
export function buildRevisionPlan({ topics, start, exam, weekday = 3, weekend = 5, rest = "none", scheme = "standard", finalDays = 5, order = "hard-first", mockHours = 3, pace = "spread" }) {
  const s0 = parseIso(start),
    e0 = parseIso(exam);
  if (!topics.length) return { error: "Add at least one topic, one per line." };
  if (s0 === null || e0 === null) return { error: "Enter the start date and the exam date." };
  if (e0 <= s0) return { error: "The exam date must be after the start date." };
  const days = [];
  for (let t = s0; t < e0; t += DAY) {
    const wd = new Date(t).getUTCDay();
    const off = (rest === "sun" && wd === 0) || (rest === "weekend" && (wd === 0 || wd === 6));
    days.push({ date: isoDay(t), wd, cap: off ? 0 : wd === 0 || wd === 6 ? weekend : weekday, items: [], used: 0, off });
  }
  const studyDays = days.filter((d) => d.cap > 0);
  if (!studyDays.length) return { error: "There are no study days between those dates. Add hours or remove rest days." };
  const fd = Math.min(finalDays, Math.max(0, Math.floor(studyDays.length * 0.25)));
  const finalStart = fd > 0 ? studyDays[studyDays.length - fd].date : null;
  const isFinal = (d) => finalStart && d.date >= finalStart;
  const intervals = INTERVALS[scheme] || INTERVALS.standard;

  let list = [...topics];
  if (order === "hard-first") list.sort((a, b) => DIFF_W[b.diff] - DIFF_W[a.diff]);
  else if (order === "interleave") {
    const bySub = new Map();
    for (const t of list) bySub.set(t.subject || "", [...(bySub.get(t.subject || "") || []), t]);
    const queues = [...bySub.values()].map((q) => q.sort((a, b) => DIFF_W[b.diff] - DIFF_W[a.diff]));
    list = [];
    while (queues.some((q) => q.length)) for (const q of queues) if (q.length) list.push(q.shift());
  }

  const totalLearn = topics.reduce((a, t) => a + t.hours, 0);
  // Each spaced revision is shorter than the last: round 1 about a quarter of the learning time.
  const revFor = (t, round = 1) => Math.max(0.5, Math.round(t.hours * (t.diff === "hard" ? 0.3 : 0.22) * Math.pow(0.75, round - 1) * 2) / 2);
  const due = new Map(); // date index -> [{topic, n}]
  const remaining = new Map(list.map((t) => [t.id, t.hours]));
  let ti = 0;
  const learnDays = days.map((d, i) => i).filter((i) => !isFinal(days[i]));
  const addDue = (fromIdx, topic) => {
    intervals.forEach((gap, n) => {
      const idx = fromIdx + gap;
      if (idx < days.length && !isFinal(days[idx])) due.set(idx, [...(due.get(idx) || []), { topic, n: n + 1 }]);
    });
  };
  // "spread": each topic may not start before its share of the learning phase (using 85% of it, as a buffer),
  // so new topics are spaced out to the exam instead of all being crammed into the first days.
  const learnStudyDays = learnDays.filter((i) => days[i].cap > 0).length || 1;
  const startAt = [];
  let cum = 0;
  for (const t of list) {
    startAt.push(pace === "spread" ? Math.floor((cum / Math.max(1, totalLearn)) * learnStudyDays * 0.85) : 0);
    cum += t.hours;
  }
  let studyIdx = -1;
  const carry = [];
  for (const i of learnDays) {
    if (days[i].cap > 0) studyIdx++;
    const d = days[i];
    const pending = [...carry.splice(0), ...(due.get(i) || [])];
    if (d.cap === 0) {
      carry.push(...pending);
      continue;
    }
    // Revisions first: they are short and protect what you already learnt. Keep at least half the day for new topics while any are left.
    const revCap = ti < list.length ? Math.max(1, d.cap * 0.5) : d.cap;
    for (const r of pending) {
      const h = revFor(r.topic, r.n);
      if (d.used + h <= revCap + 1e-9) {
        d.items.push({ type: "revise", topic: r.topic, hours: h, round: r.n });
        d.used += h;
      } else carry.push(r);
    }
    // Then new learning, in chunks.
    while (ti < list.length && d.used < d.cap - 0.25 && (studyIdx >= startAt[ti] || remaining.get(list[ti].id) < list[ti].hours)) {
      const t = list[ti];
      const left = remaining.get(t.id);
      const room = Math.floor((d.cap - d.used) * 2) / 2;
      const h = Math.min(left, room);
      if (h <= 0 || (h < 1 && left > h)) break; // no slivers under an hour unless it finishes the topic
      const part = t.hours > h || left < t.hours ? true : false;
      d.items.push({ type: "learn", topic: t, hours: h, part });
      d.used += h;
      remaining.set(t.id, left - h);
      if (left - h <= 1e-9) {
        addDue(i, t);
        ti++;
      }
    }
  }
  const unfinished = list.slice(ti).map((t) => ({ ...t, left: remaining.get(t.id) }));
  const missedRevisions = carry.length;

  // Final phase: one mock test a day (if there is room) plus quick revision of every topic, hardest first.
  const finals = days.filter((d) => isFinal(d) && d.cap > 0);
  const revOrder = [...topics].sort((a, b) => DIFF_W[b.diff] - DIFF_W[a.diff]);
  let ri = 0;
  finals.forEach((d, k) => {
    const mock = Math.min(mockHours, Math.max(1, Math.floor(d.cap * 0.6 * 2) / 2));
    if (mockHours > 0 && (k % 2 === 0 || d.cap >= mockHours + 1.5)) {
      d.items.push({ type: "mock", hours: mock });
      d.used += mock;
    }
    let guard = 0;
    while (d.used < d.cap - 0.25 && guard++ < topics.length * 2) {
      const t = revOrder[ri % revOrder.length];
      const h = Math.min(Math.max(0.5, revFor(t)), Math.floor((d.cap - d.used) * 2) / 2);
      if (h <= 0) break;
      d.items.push({ type: "final", topic: t, hours: h });
      d.used += h;
      ri++;
    }
  });

  const capTotal = days.reduce((a, d) => a + d.cap, 0);
  const finalCap = finals.reduce((a, d) => a + d.cap, 0);
  const revHours = days.reduce((a, d) => a + d.items.filter((x) => x.type === "revise").reduce((b, x) => b + x.hours, 0), 0);
  const warnings = [];
  if (unfinished.length) warnings.push(`Not enough time to finish ${unfinished.length} topic${unfinished.length > 1 ? "s" : ""} before the final revision phase (${unfinished.map((t) => t.name).join(", ")}). Add study hours, start earlier or shorten the final phase.`);
  if (missedRevisions > 0) warnings.push(`${missedRevisions} spaced revision${missedRevisions > 1 ? "s" : ""} did not fit. Your days are full; consider an extra hour on weekends.`);
  if (ri < topics.length && finals.length) warnings.push("The final phase is too short to revise every topic once. Increase final-phase days or hours.");
  return {
    days,
    finalStart,
    stats: { days: days.length, studyDays: studyDays.length, capTotal, learnHours: totalLearn, revHours, finalCap, topics: topics.length, slack: capTotal - totalLearn - revHours - finalCap },
    warnings,
    unfinished,
  };
}

/** iCalendar export of a plan: one all-day event per study day. */
export function planToIcs(plan, title = "Revision plan") {
  const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//FreeToolsPro//Revision Plan//EN", "CALSCALE:GREGORIAN", `X-WR-CALNAME:${esc(title)}`];
  for (const d of plan.days) {
    if (!d.items.length) continue;
    const ymd = d.date.replace(/-/g, "");
    const next = isoDay(parseIso(d.date) + DAY).replace(/-/g, "");
    const summary = d.items.map(itemLabel).join(" · ");
    lines.push("BEGIN:VEVENT", `UID:${ymd}-${Math.random().toString(36).slice(2, 10)}@freetoolspro.in`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${ymd}`, `DTEND;VALUE=DATE:${next}`, `SUMMARY:${esc(`Study ${fmtH(d.used)}: ${summary}`).slice(0, 240)}`, `DESCRIPTION:${esc(d.items.map((x) => `${itemLabel(x)} (${fmtH(x.hours)})`).join("\n"))}`, "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
export function fmtH(h) {
  const m = Math.round(h * 60);
  const hh = Math.floor(m / 60),
    mm = m % 60;
  return hh && mm ? `${hh} h ${mm} min` : hh ? `${hh} h` : `${mm} min`;
}
export function itemLabel(x) {
  const name = x.topic ? (x.topic.subject ? `${x.topic.subject}: ${x.topic.name}` : x.topic.name) : "";
  if (x.type === "learn") return `Learn ${name}${x.part ? " (part)" : ""}`;
  if (x.type === "revise") return `Revise ${name} (round ${x.round})`;
  if (x.type === "mock") return "Full mock test / past paper";
  return `Final revision: ${name}`;
}

// ---------- sharing between the study tools ----------
export const NOTES_KEY = "ftp-study-notes";
export function saveNotes(text) {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify({ text, at: Date.now() }));
  } catch {}
}
export function loadNotes() {
  try {
    const v = JSON.parse(localStorage.getItem(NOTES_KEY) || "null");
    return v && typeof v.text === "string" ? v : null;
  } catch {
    return null;
  }
}
