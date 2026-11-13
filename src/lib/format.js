// Number formatting shared by islands and static pages. Indian digit grouping (12,34,567).
const inr0 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const num2 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

export function inr(n) {
  if (!Number.isFinite(n)) return "—";
  const sign = n < 0 ? "−" : "";
  return `${sign}₹${inr0.format(Math.abs(Math.round(n)))}`;
}

export function num(n, digits = 2) {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: digits }).format(n);
}

export function pct(n, digits = 2) {
  if (!Number.isFinite(n)) return "—";
  return `${num2.format(Number(n.toFixed(digits)))}%`;
}

/** "12.35 lakh", "1.2 crore" — the way amounts are spoken in India. */
export function inWords(n) {
  if (!Number.isFinite(n)) return "";
  const a = Math.abs(n);
  if (a >= 1e7) return `${trim(a / 1e7)} crore`;
  if (a >= 1e5) return `${trim(a / 1e5)} lakh`;
  if (a >= 1e3) return `${trim(a / 1e3)} thousand`;
  return "";
}
function trim(x) {
  return x >= 100 ? x.toFixed(0) : x.toFixed(2).replace(/\.?0+$/, "");
}

export function bytes(n) {
  if (!Number.isFinite(n)) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function fmt(value, kind) {
  switch (kind) {
    case "inr":
      return inr(value);
    case "inr2":
      return Number.isFinite(value) ? `₹${new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}` : "—";
    case "pct":
      return pct(value);
    case "pctInt":
      return `${value}%`;
    case "num":
      return num(value);
    case "int":
      return num(value, 0);
    case "months": {
      const y = Math.floor(value / 12);
      const m = Math.round(value % 12);
      return [y ? `${y} yr` : "", m ? `${m} mo` : ""].filter(Boolean).join(" ") || "0 mo";
    }
    default:
      return String(value);
  }
}
