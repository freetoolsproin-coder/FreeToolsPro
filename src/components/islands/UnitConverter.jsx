import { useState } from "react";

// factor = how many base units in one of this unit
const CATS = {
  length: {
    label: "Length",
    units: [["mm", "Millimetre", 0.001], ["cm", "Centimetre", 0.01], ["m", "Metre", 1], ["km", "Kilometre", 1000], ["in", "Inch", 0.0254], ["ft", "Foot", 0.3048], ["yd", "Yard", 0.9144], ["mi", "Mile", 1609.344], ["nmi", "Nautical mile", 1852]],
  },
  weight: {
    label: "Weight",
    units: [["mg", "Milligram", 1e-6], ["g", "Gram", 0.001], ["kg", "Kilogram", 1], ["quintal", "Quintal", 100], ["t", "Tonne", 1000], ["oz", "Ounce", 0.028349523125], ["lb", "Pound", 0.45359237], ["tola", "Tola", 0.0116638]],
  },
  area: {
    label: "Area",
    units: [["sqft", "Square foot", 0.09290304], ["sqm", "Square metre", 1], ["gaj", "Gaj (square yard)", 0.83612736], ["cent", "Cent", 40.468564224], ["guntha", "Guntha", 101.17141056], ["acre", "Acre", 4046.8564224], ["ha", "Hectare", 10000], ["sqkm", "Square kilometre", 1e6]],
  },
  volume: {
    label: "Volume",
    units: [["ml", "Millilitre", 0.001], ["l", "Litre", 1], ["m3", "Cubic metre", 1000], ["tsp", "Teaspoon (US)", 0.00492892159375], ["tbsp", "Tablespoon (US)", 0.01478676478125], ["cup", "Cup (US)", 0.2365882365], ["galus", "Gallon (US)", 3.785411784], ["galuk", "Gallon (UK)", 4.54609]],
  },
  temperature: { label: "Temperature", units: [["c", "Celsius"], ["f", "Fahrenheit"], ["k", "Kelvin"]] },
  speed: { label: "Speed", units: [["kmh", "km per hour", 1 / 3.6], ["ms", "Metres per second", 1], ["mph", "Miles per hour", 0.44704], ["kn", "Knot", 0.514444]] },
  time: { label: "Time", units: [["s", "Second", 1], ["min", "Minute", 60], ["h", "Hour", 3600], ["d", "Day", 86400], ["wk", "Week", 604800], ["mo", "Month (avg)", 2629746], ["yr", "Year (365.25 d)", 31557600]] },
  data: { label: "Data", units: [["b", "Byte", 1], ["kb", "Kilobyte (1000)", 1e3], ["kib", "Kibibyte (1024)", 1024], ["mb", "Megabyte", 1e6], ["mib", "Mebibyte", 1048576], ["gb", "Gigabyte", 1e9], ["gib", "Gibibyte", 1073741824], ["tb", "Terabyte", 1e12]] },
};

function toBase(cat, unit, v) {
  if (cat === "temperature") return unit === "c" ? v : unit === "f" ? ((v - 32) * 5) / 9 : v - 273.15;
  return v * CATS[cat].units.find((u) => u[0] === unit)[2];
}
function fromBase(cat, unit, b) {
  if (cat === "temperature") return unit === "c" ? b : unit === "f" ? (b * 9) / 5 + 32 : b + 273.15;
  return b / CATS[cat].units.find((u) => u[0] === unit)[2];
}
function show(n) {
  if (!Number.isFinite(n)) return "";
  if (n !== 0 && (Math.abs(n) < 1e-6 || Math.abs(n) >= 1e15)) return n.toExponential(6);
  return String(+n.toPrecision(10));
}

export default function UnitConverter() {
  const [cat, setCat] = useState("area");
  const [src, setSrc] = useState({ unit: "gaj", text: "100" });
  const base = (() => {
    const n = parseFloat(src.text.replace(/,/g, ""));
    return Number.isFinite(n) ? toBase(cat, src.unit, n) : NaN;
  })();

  return (
    <div className="units">
      <div className="seg seg--wrap" role="tablist" aria-label="Category">
        {Object.entries(CATS).map(([k, c]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={k === cat}
            className="seg__opt"
            onClick={() => {
              setCat(k);
              setSrc({ unit: CATS[k].units[0][0], text: "1" });
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
      <ul className="units__list panel">
        {CATS[cat].units.map(([u, label]) => {
          const value = u === src.unit ? src.text : show(fromBase(cat, u, base));
          return (
            <li key={u} className={`units__row ${u === src.unit ? "is-src" : ""}`}>
              <label htmlFor={`u-${u}`}>{label}</label>
              <input id={`u-${u}`} className="input" inputMode="decimal" value={value} onChange={(e) => setSrc({ unit: u, text: e.target.value })} onFocus={(e) => e.target.select()} />
            </li>
          );
        })}
      </ul>
      <p className="muted">Type in any box; the others update. Tola is the Indian standard tola of 11.6638 g.</p>
    </div>
  );
}
