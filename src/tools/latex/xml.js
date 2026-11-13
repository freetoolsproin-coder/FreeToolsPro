// A small XML reader for MathML, and for the SVG that the TeX engine writes. It runs the same way in the
// browser and in Node, keeps tag names without their namespace prefix (mml:mfrac becomes mfrac), and keeps
// text nodes as plain strings inside `children`.
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", InvisibleTimes: "⁢", ApplyFunction: "⁡", minus: "−", times: "×", pi: "π", infin: "∞", le: "≤", ge: "≥", ne: "≠" };

function unescape(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => {
    if (e[0] === "#") {
      const n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENT[e] ?? m;
  });
}

export function parseXml(src) {
  const root = { tag: "#root", attrs: {}, children: [] };
  const stack = [root];
  let i = 0;
  const text = (t) => {
    if (t) stack[stack.length - 1].children.push(unescape(t));
  };
  while (i < src.length) {
    const lt = src.indexOf("<", i);
    if (lt < 0) {
      text(src.slice(i));
      break;
    }
    text(src.slice(i, lt));
    if (src.startsWith("<!--", lt)) {
      const e = src.indexOf("-->", lt);
      i = e < 0 ? src.length : e + 3;
    } else if (src.startsWith("<![CDATA[", lt)) {
      const e = src.indexOf("]]>", lt);
      if (e < 0) throw new Error("A CDATA section is not closed.");
      stack[stack.length - 1].children.push(src.slice(lt + 9, e));
      i = e + 3;
    } else if (src[lt + 1] === "?" || src[lt + 1] === "!") {
      const e = src.indexOf(">", lt);
      i = e < 0 ? src.length : e + 1;
    } else if (src[lt + 1] === "/") {
      const e = src.indexOf(">", lt);
      if (e < 0) throw new Error("A closing tag is not finished.");
      const name = src.slice(lt + 2, e).trim().replace(/^[\w.-]+:/, "");
      const open = stack.pop();
      if (!open || open.tag !== name || !stack.length) throw new Error(`Found </${name}> where ${open && open.tag !== "#root" ? `</${open.tag}>` : "no closing tag"} was expected.`);
      i = e + 1;
    } else {
      let e = lt + 1,
        q = null;
      for (; e < src.length; e++) {
        const c = src[e];
        if (q) {
          if (c === q) q = null;
        } else if (c === '"' || c === "'") q = c;
        else if (c === ">") break;
      }
      if (e >= src.length) throw new Error("A tag is not finished.");
      let body = src.slice(lt + 1, e);
      const self = body.endsWith("/");
      if (self) body = body.slice(0, -1);
      const m = body.match(/^[^\s]+/);
      if (!m) throw new Error("Found a '<' that does not start a tag.");
      const node = { tag: m[0].replace(/^[\w.-]+:/, ""), attrs: {}, children: [] };
      for (const a of body.slice(m[0].length).matchAll(/([\w:.-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) node.attrs[a[1].replace(/^[\w.-]+:(?!$)/, "")] = unescape(a[3] ?? a[4] ?? "");
      stack[stack.length - 1].children.push(node);
      if (!self) stack.push(node);
      i = e + 1;
    }
  }
  if (stack.length > 1) throw new Error(`<${stack[stack.length - 1].tag}> is never closed.`);
  return root;
}

export const elements = (n) => n.children.filter((c) => typeof c !== "string");
export const textOf = (n) => n.children.map((c) => (typeof c === "string" ? c : textOf(c))).join("");
export function escXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
