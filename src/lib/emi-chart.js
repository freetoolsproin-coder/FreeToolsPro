// EMI maths and the yearly principal/interest bar chart used by the home hero
// (server-rendered in Pages.jsx, redrawn in the browser by src/scripts/hero-demo.js).
export function emi(P, rate, years) {
  const i = rate / 1200,
    n = years * 12;
  return i ? (P * i * (1 + i) ** n) / ((1 + i) ** n - 1) : P / n;
}

/** Principal and interest paid in each year of the loan: [[principal, interest], …]. */
export function yearlySplit(P, rate, years) {
  const i = rate / 1200,
    m = emi(P, rate, years);
  let bal = P;
  const out = [];
  for (let y = 0; y < years; y++) {
    let pr = 0,
      it = 0;
    for (let k = 0; k < 12 && bal > 0.5; k++) {
      const int = bal * i;
      const prin = Math.min(bal, m - int);
      it += int;
      pr += prin;
      bal -= prin;
    }
    out.push([pr, it]);
  }
  return out;
}

/** Stacked yearly bars as SVG markup (viewBox 0 0 600 120): principal at the bottom, interest on top. */
export function splitBars(rows) {
  const W = 600,
    H = 120,
    gap = rows.length > 30 ? 2 : 4;
  const max = Math.max(...rows.map(([p, i]) => p + i), 1);
  const bw = (W - gap * (rows.length - 1)) / rows.length;
  return rows
    .map(([p, i], k) => {
      const x = (k * (bw + gap)).toFixed(1);
      const hp = (p / max) * H,
        hi = (i / max) * H;
      return `<rect class="bar-p" x="${x}" y="${(H - hp).toFixed(1)}" width="${bw.toFixed(1)}" height="${hp.toFixed(1)}" rx="1.5"/><rect class="bar-i" x="${x}" y="${(H - hp - hi).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(0, hi - 1.5).toFixed(1)}" rx="1.5"/>`;
    })
    .join("");
}
