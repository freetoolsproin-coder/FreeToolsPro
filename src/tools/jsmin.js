// A conservative JavaScript minifier: removes comments and whitespace, never renames or rewrites code.
// Strings, template literals and regular expressions are copied exactly. Line breaks are kept wherever
// removing them could change how JavaScript inserts semicolons automatically.

const ID = /[A-Za-z0-9_$\\\u0080-\uffff]/;
const isId = (c) => !!c && ID.test(c);
const isDigit = (c) => c >= "0" && c <= "9";
const LT = /[\n\r\u2028\u2029]/;

// After these words a "/" starts a regular expression, not a division.
const REGEX_AFTER = new Set(["return", "typeof", "instanceof", "in", "of", "new", "delete", "void", "throw", "case", "do", "else", "yield", "await"]);

export function minifyJs(src, { keepLicense = true } = {}) {
  let out = "";
  let i = 0;
  const n = src.length;
  let ws = null; // pending whitespace: null, " " or "\n"
  const tpl = []; // brace depth inside each open ${ … } of a template literal
  let afterRegex = false; // the last token was a regular expression literal
  const parens = []; // for each open "(": does it belong to if/for/while/with?
  let ctrlClose = false; // the last token was the ")" closing an if/for/while/with header

  const lastWord = () => (out.slice(-12).match(/[A-Za-z_$][\w$]*$/) || [""])[0];

  function sep(next) {
    const a = out[out.length - 1];
    if (!a) return "";
    if (ws === "\n") {
      const prevEnds = afterRegex || isId(a) || ")]}\"'`".includes(a) || out.endsWith("++") || out.endsWith("--");
      const nextStarts = isId(next) || "\"'`([{+-!~/@#".includes(next);
      if (prevEnds && nextStarts) return "\n";
    }
    if ((isId(a) || afterRegex) && isId(next)) return " ";
    if ((a === "+" || a === "-") && next === a) return " ";
    if (isDigit(a) && next === ".") return " ";
    if (a === "/" && next === "/") return " ";
    return "";
  }
  function emit(text, regex = false) {
    if (ws !== null) out += sep(text[0]);
    ws = null;
    out += text;
    afterRegex = regex;
    ctrlClose = false;
  }
  function regexAllowed() {
    const a = out[out.length - 1];
    if (!a) return true;
    if (isId(a)) return REGEX_AFTER.has(lastWord());
    if (a === ")") return ctrlClose;
    return a !== "]";
  }
  // Copy template text from i (just after ` or }) up to the closing ` or the next ${.
  function readTemplate() {
    let j = i;
    while (j < n) {
      const ch = src[j];
      if (ch === "\\") {
        j += 2;
        continue;
      }
      if (ch === "`") {
        out += src.slice(i, j + 1);
        i = j + 1;
        return;
      }
      if (ch === "$" && src[j + 1] === "{") {
        out += src.slice(i, j + 2);
        i = j + 2;
        tpl.push(0);
        return;
      }
      j++;
    }
    throw new Error("A template literal (`…`) is not closed.");
  }

  while (i < n) {
    const c = src[i];
    // whitespace
    if (/\s/.test(c)) {
      let j = i;
      let nl = false;
      while (j < n && /\s/.test(src[j])) {
        if (LT.test(src[j])) nl = true;
        j++;
      }
      ws = nl || ws === "\n" ? "\n" : " ";
      i = j;
      continue;
    }
    // comments
    if (c === "/" && src[i + 1] === "/") {
      while (i < n && !LT.test(src[i])) i++;
      if (ws === null) ws = " ";
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      const end = src.indexOf("*/", i + 2);
      if (end < 0) throw new Error("A /* comment */ is not closed.");
      const body = src.slice(i, end + 2);
      i = end + 2;
      if (keepLicense && body[2] === "!") {
        if (out) out += "\n";
        out += body + "\n";
        ws = null;
        afterRegex = false;
      } else ws = LT.test(body) || ws === "\n" ? "\n" : ws ?? " ";
      continue;
    }
    // strings
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && src[j] !== c) {
        if (src[j] === "\\") j++;
        else if (LT.test(src[j])) throw new Error(`A string starting with ${c} is not closed on its line.`);
        j++;
      }
      if (j >= n) throw new Error(`A string starting with ${c} is not closed.`);
      emit(src.slice(i, j + 1));
      i = j + 1;
      continue;
    }
    // template literals
    if (c === "`") {
      emit("`");
      i++;
      readTemplate();
      continue;
    }
    // regular expression literal
    if (c === "/" && regexAllowed()) {
      let j = i + 1;
      let inClass = false;
      let ok = false;
      while (j < n) {
        const ch = src[j];
        if (ch === "\\") {
          j += 2;
          continue;
        }
        if (LT.test(ch)) break;
        if (ch === "[") inClass = true;
        else if (ch === "]") inClass = false;
        else if (ch === "/" && !inClass) {
          ok = true;
          break;
        }
        j++;
      }
      if (ok) {
        j++;
        while (j < n && /[a-z]/i.test(src[j])) j++;
        emit(src.slice(i, j), true);
        i = j;
        continue;
      }
    }
    // identifiers, keywords and numbers
    if (isId(c)) {
      let j = i + 1;
      while (j < n && (isId(src[j]) || (isDigit(c) && src[j] === "."))) j++;
      emit(src.slice(i, j));
      i = j;
      continue;
    }
    // braces that may close a template ${ … }
    if (c === "{" && tpl.length) tpl[tpl.length - 1]++;
    if (c === "}" && tpl.length) {
      if (tpl[tpl.length - 1] === 0) {
        tpl.pop();
        ws = null;
        afterRegex = false;
        out += "}";
        i++;
        readTemplate();
        continue;
      }
      tpl[tpl.length - 1]--;
    }
    if (c === "(") {
      const a = out[out.length - 1];
      parens.push(isId(a) && ["if", "for", "while", "with"].includes(lastWord()));
      emit(c);
    } else if (c === ")") {
      const ctrl = parens.pop() || false;
      emit(c);
      ctrlClose = ctrl;
    } else emit(c);
    i++;
  }
  return out;
}
