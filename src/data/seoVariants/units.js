import { buildVariant, labelize } from "./buildVariant.js";

/** Compact unit matrices for programmatic conversion landings (same factors as Unit Converter). */
const CATEGORIES = {
  length: ["meter", "kilometer", "centimeter", "millimeter", "inch", "foot", "yard", "mile"],
  weight: ["gram", "kilogram", "milligram", "pound", "ounce", "stone"],
  temperature: ["celsius", "fahrenheit", "kelvin"],
  volume: ["liter", "milliliter", "gallon", "pint", "cup", "fluidOunce"],
  speed: ["meterPerSecond", "kilometerPerHour", "milePerHour", "knot"],
  area: ["squareMeter", "squareKilometer", "squareFoot", "acre", "hectare"],
  time: ["second", "minute", "hour", "day", "week"],
  digitalStorage: ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte"],
};

const SHORT = {
  meter: "m",
  kilometer: "km",
  centimeter: "cm",
  millimeter: "mm",
  inch: "in",
  foot: "ft",
  yard: "yd",
  mile: "mi",
  gram: "g",
  kilogram: "kg",
  milligram: "mg",
  pound: "lb",
  ounce: "oz",
  stone: "st",
  celsius: "c",
  fahrenheit: "f",
  kelvin: "k",
  liter: "l",
  milliliter: "ml",
  gallon: "gal",
  pint: "pt",
  cup: "cup",
  fluidOunce: "fl-oz",
  meterPerSecond: "m-s",
  kilometerPerHour: "kmh",
  milePerHour: "mph",
  knot: "knot",
  squareMeter: "sq-m",
  squareKilometer: "sq-km",
  squareFoot: "sq-ft",
  acre: "acre",
  hectare: "ha",
  second: "sec",
  minute: "min",
  hour: "hr",
  day: "day",
  week: "week",
  byte: "byte",
  kilobyte: "kb",
  megabyte: "mb",
  gigabyte: "gb",
  terabyte: "tb",
};

function slugFor(from, to) {
  const a = SHORT[from] || from.toLowerCase();
  const b = SHORT[to] || to.toLowerCase();
  return `${a}-to-${b}`;
}

export function buildUnitVariants() {
  const out = [];
  for (const [category, units] of Object.entries(CATEGORIES)) {
    for (const from of units) {
      for (const to of units) {
        if (from === to) continue;
        const fromLabel = labelize(from);
        const toLabel = labelize(to);
        const slug = slugFor(from, to);
        out.push(
          buildVariant({
            slug,
            parentPath: "/trending-tools/unit-converter",
            parentName: "Unit Converter",
            category: "trending-tools",
            h1: `Convert ${fromLabel} to ${toLabel} Online`,
            title: `${fromLabel} to ${toLabel} Converter Free | FreeToolsPro`,
            description: `Convert ${fromLabel} to ${toLabel} online free. Instant ${category} unit conversion with formula—no signup on FreeToolsPro.`,
            keywords: [
              `${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()}`,
              `convert ${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()}`,
              `${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()} calculator`,
              `${category} unit converter`,
            ],
            intro: `Use our free Unit Converter to change ${fromLabel} into ${toLabel}. Pick the ${category} category, set units, and get an instant result with the conversion formula.`,
            steps: [
              "Open the Unit Converter with this pair preselected.",
              `Enter a value in ${fromLabel}.`,
              `Read the result in ${toLabel} and copy if needed.`,
            ],
            faqs: [
              {
                q: `How do I convert ${fromLabel} to ${toLabel}?`,
                a: `Open FreeToolsPro Unit Converter, choose ${category}, set From=${fromLabel} and To=${toLabel}, then enter your number.`,
              },
            ],
            presets: { type: category, from, to },
          })
        );
      }
    }
  }
  return out;
}
