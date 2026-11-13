// Reads the SVG written by the TeX engine into flat shapes, for the PDF writer and the image reader.
import { parseXml, elements } from "./xml.js";

export const mul = (a, b) => [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]];

function parseTransform(t) {
  let m = [1, 0, 0, 1, 0, 0];
  for (const [, fn, args] of String(t || "").matchAll(/(\w+)\(([^)]*)\)/g)) {
    const a = args.split(/[\s,]+/).filter(Boolean).map(Number);
    if (fn === "translate") m = mul(m, [1, 0, 0, 1, a[0] || 0, a[1] || 0]);
    else if (fn === "scale") m = mul(m, [a[0], 0, 0, a[1] ?? a[0], 0, 0]);
    else if (fn === "matrix") m = mul(m, a);
    else if (fn === "rotate") {
      const r = (a[0] * Math.PI) / 180;
      m = mul(m, [Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0]);
    }
  }
  return m;
}

/** Read an SVG from the engine into a flat list of shapes, in font units. */
export function svgShapes(svg) {
  const root = elements(parseXml(svg))[0];
  const box = (root.attrs.viewBox || "0 0 0 0").split(/\s+/).map(Number);
  const shapes = [];
  const walk = (n, m, fill) => {
    const mx = mul(m, parseTransform(n.attrs.transform));
    let f = n.attrs.fill && n.attrs.fill !== "none" ? n.attrs.fill : fill;
    const st = (n.attrs.style || "").match(/color:\s*([^;]+)/);
    if (st) f = st[1].trim();
    if (n.tag === "path") shapes.push({ d: n.attrs.d, m: mx, fill: f });
    else if (n.tag === "rect") {
      const [x, y, w, h] = ["x", "y", "width", "height"].map((k) => Number(n.attrs[k] || 0));
      if (n.attrs.fill !== "none") shapes.push({ d: `M${x} ${y}H${x + w}V${y + h}H${x}Z`, m: mx, fill: f });
    } else if (n.tag === "line") {
      const [x1, y1, x2, y2] = ["x1", "y1", "x2", "y2"].map((k) => Number(n.attrs[k] || 0));
      const w = Number(n.attrs["stroke-width"] || 60) / 2;
      const l = Math.hypot(x2 - x1, y2 - y1) || 1;
      const [dx, dy] = [(-(y2 - y1) / l) * w, ((x2 - x1) / l) * w];
      shapes.push({ d: `M${x1 + dx} ${y1 + dy}L${x2 + dx} ${y2 + dy}L${x2 - dx} ${y2 - dy}L${x1 - dx} ${y1 - dy}Z`, m: mx, fill: f });
    }
    for (const k of elements(n)) walk(k, mx, f);
  };
  walk(root, [1, 0, 0, 1, 0, 0], null);
  return { shapes, x: box[0], top: -box[1], w: box[2], depth: box[3] + box[1] };
}
