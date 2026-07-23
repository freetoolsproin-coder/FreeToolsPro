import { AlignJustify } from "lucide-react";
import TextTransformTool from "./TextTransformTool";
import { optionNumber } from "./textToolOptions";

function justifyLine(line, width) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length >= width) return trimmed;
  const words = trimmed.split(/\s+/);
  if (words.length === 1) return trimmed;
  const gaps = words.length - 1;
  const totalSpaces = width - words.join("").length;
  const base = Math.floor(totalSpaces / gaps);
  let extra = totalSpaces % gaps;
  let out = words[0];
  for (let i = 1; i < words.length; i++) {
    const spaces = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra -= 1;
    out += " ".repeat(Math.max(1, spaces)) + words[i];
  }
  return out;
}

function justifyText(text, { width }) {
  const w = Math.max(20, Math.min(200, Number(width) || 80));
  const lines = text.split(/\r?\n/);
  const output = lines.map((line) => (line.trim() ? justifyLine(line, w) : line)).join("\n");
  return { output, width: w };
}

export default function JustifyText() {
  return (
    <TextTransformTool
      seoPage="justifyText"
      icon={AlignJustify}
      title="Justify Text"
      subtitle="Distribute spaces between words so each line fills a target width."
      path="/text-tools/justify-text"
      formLabel="Justify text"
      outputLabel="Justified text"
      placeholder="Paste lines to justify to a fixed width…"
      outputPlaceholder="Justified text will appear here…"
      initialOptions={{ width: 80 }}
      transform={justifyText}
      getStats={(_, { width }) => `Justified to ${width} characters per line.`}
      renderOptions={({ options, setOption }) =>
        optionNumber({
          id: "justify-width",
          label: "Line width",
          value: options.width,
          onChange: (v) => setOption("width", v),
          min: 20,
          max: 200,
        })
      }
      example={{
        caption: "Extra spaces are distributed between words to fill the line width.",
        before: "Hello world from FreeToolsPro",
        after: "Hello   world   from   FreeToolsPro",
      }}
      faqs={[
        { q: "Is Justify Text free?", a: "Yes. Justify lines with no signup." },
        {
          q: "Does this work like Word justify?",
          a: "It pads spaces between words on each existing line. Wrap text first if you need a fixed column width.",
        },
        { q: "Is my text uploaded?", a: "No. Justifying runs entirely in your browser." },
      ]}
    />
  );
}
