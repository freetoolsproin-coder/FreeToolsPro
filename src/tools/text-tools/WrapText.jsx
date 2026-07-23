import { WrapText as WrapIcon } from "lucide-react";
import TextTransformTool from "./TextTransformTool";
import { optionCheckbox, optionNumber, optionSelect } from "./textToolOptions";

function wrapLine(line, width, breakLong) {
  if (line.length <= width) return [line];
  const out = [];
  let rest = line;
  while (rest.length > width) {
    let breakAt = rest.lastIndexOf(" ", width);
    if (breakAt <= 0) {
      if (!breakLong) break;
      breakAt = width;
    }
    out.push(rest.slice(0, breakAt).trimEnd());
    rest = rest.slice(breakAt).trimStart();
  }
  if (rest) out.push(rest);
  return out;
}

function wrapText(text, { mode, width, breakLongWords, keepParagraphs }) {
  if (mode === "unwrap") {
    if (!keepParagraphs) {
      return {
        output: text.replace(/\r?\n+/g, " ").replace(/[ \t]+/g, " ").trim(),
        mode,
      };
    }
    const paragraphs = text
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.replace(/\r?\n+/g, " ").replace(/[ \t]+/g, " ").trim())
      .filter(Boolean);
    return { output: paragraphs.join("\n\n"), paragraphs: paragraphs.length, mode };
  }

  const w = Math.max(8, Math.min(200, Number(width) || 80));
  const lines = text.split(/\r?\n/);
  const wrapped = lines.flatMap((line) => wrapLine(line, w, breakLongWords));
  return { output: wrapped.join("\n"), width: w, lineCount: wrapped.length, mode };
}

export default function WrapText() {
  return (
    <TextTransformTool
      seoPage="wrapText"
      icon={WrapIcon}
      title="Wrap Text"
      subtitle="Soft-wrap long lines to a width, or unwrap hard breaks into paragraphs."
      path="/text-tools/wrap-text"
      formLabel="Wrap text"
      outputLabel="Result"
      placeholder="Paste a long paragraph to wrap at your chosen width…"
      outputPlaceholder="Result will appear here…"
      initialOptions={{ mode: "wrap", width: 80, breakLongWords: true, keepParagraphs: true }}
      transform={wrapText}
      getStats={(_, result, options) => {
        if (options.mode === "unwrap") {
          return options.keepParagraphs
            ? `Joined into ${result.paragraphs || 0} paragraph${result.paragraphs === 1 ? "" : "s"}.`
            : "Joined into a single block.";
        }
        return `Wrapped to ${result.width} characters — ${result.lineCount} line${result.lineCount === 1 ? "" : "s"}.`;
      }}
      renderOptions={({ options, setOption }) => (
        <>
          {optionSelect({
            id: "wrap-mode",
            label: "Mode",
            value: options.mode,
            onChange: (v) => setOption("mode", v),
            children: (
              <>
                <option value="wrap">Wrap</option>
                <option value="unwrap">Unwrap</option>
              </>
            ),
          })}
          {options.mode === "wrap" ? (
            <>
              {optionNumber({
                id: "wrap-width",
                label: "Width",
                value: options.width,
                onChange: (v) => setOption("width", v),
                min: 8,
                max: 200,
              })}
              {optionCheckbox({
                label: "Break long words",
                checked: options.breakLongWords,
                onChange: (v) => setOption("breakLongWords", v),
              })}
            </>
          ) : (
            optionCheckbox({
              label: "Keep paragraph breaks (blank lines)",
              checked: options.keepParagraphs,
              onChange: (v) => setOption("keepParagraphs", v),
            })
          )}
        </>
      )}
      example={{
        caption: "Long paragraphs wrap at your chosen width (shown conceptually at ~40 chars).",
        before:
          "Paste a long paragraph of plain text that should break onto multiple lines for email or commit messages.",
        after:
          "Paste a long paragraph of plain text\nthat should break onto multiple lines\nfor email or commit messages.",
      }}
      faqs={[
        { q: "Is Wrap Text free?", a: "Yes. Wrap or unwrap lines online with no signup." },
        {
          q: "Can I unwrap hard line breaks?",
          a: "Yes. Choose Unwrap in Mode. The old /unwrap-text URL redirects here.",
        },
        {
          q: "Does wrapping change my words?",
          a: "No. Wrap only inserts line breaks at spaces (or mid-word if you enable long-word breaks).",
        },
        { q: "Is my text uploaded?", a: "No. Wrapping runs entirely in your browser." },
      ]}
    />
  );
}
