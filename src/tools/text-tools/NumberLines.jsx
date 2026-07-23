import { ListOrdered } from "lucide-react";
import TextTransformTool from "./TextTransformTool";
import { optionCheckbox, optionNumber, optionSelect } from "./textToolOptions";

const LINE_NUM_RE =
  /^\s*(?:\[\s*\d+\s*\]|\(\s*\d+\s*\)|\d+[.)\]:]|\d+)\s*[-–—:.)\]]?\s*/;

function numberLines(text, { mode, start, style, skipEmpty }) {
  if (mode === "remove") {
    const lines = text.split(/\r?\n/);
    let removed = 0;
    const output = lines
      .map((line) => {
        const next = line.replace(LINE_NUM_RE, "");
        if (next !== line) removed += 1;
        return next;
      })
      .join("\n");
    return { output, removed, total: lines.length, mode };
  }

  const begin = Math.max(0, Number(start) || 1);
  const lines = text.split(/\r?\n/);
  let n = begin;
  const output = lines
    .map((line) => {
      if (skipEmpty && !line.length) return line;
      const num = n++;
      switch (style) {
        case "dot":
          return `${num}. ${line}`;
        case "paren":
          return `${num}) ${line}`;
        case "bracket":
          return `[${num}] ${line}`;
        case "colon":
          return `${num}: ${line}`;
        default:
          return `${num}\t${line}`;
      }
    })
    .join("\n");
  return { output, numbered: n - begin, mode };
}

export default function NumberLines() {
  return (
    <TextTransformTool
      seoPage="numberLines"
      icon={ListOrdered}
      title="Number Lines"
      subtitle="Add sequential line numbers, or strip common number prefixes."
      path="/text-tools/number-lines"
      formLabel="Number lines"
      outputLabel="Result"
      placeholder={"alpha\nbeta\ngamma"}
      outputPlaceholder="Result will appear here…"
      initialOptions={{ mode: "add", start: 1, style: "dot", skipEmpty: false }}
      transform={numberLines}
      getStats={(_, result, options) =>
        options.mode === "remove"
          ? `Removed numbers from ${result.removed} of ${result.total} line${result.total === 1 ? "" : "s"}.`
          : `Numbered ${result.numbered} line${result.numbered === 1 ? "" : "s"}.`
      }
      renderOptions={({ options, setOption }) => (
        <>
          {optionSelect({
            id: "number-mode",
            label: "Mode",
            value: options.mode,
            onChange: (v) => setOption("mode", v),
            children: (
              <>
                <option value="add">Add numbers</option>
                <option value="remove">Remove numbers</option>
              </>
            ),
          })}
          {options.mode === "add" ? (
            <>
              {optionSelect({
                id: "number-style",
                label: "Format",
                value: options.style,
                onChange: (v) => setOption("style", v),
                children: (
                  <>
                    <option value="dot">1. line</option>
                    <option value="paren">1) line</option>
                    <option value="bracket">[1] line</option>
                    <option value="colon">1: line</option>
                    <option value="tab">1⇥ line</option>
                  </>
                ),
              })}
              {optionNumber({
                id: "number-start",
                label: "Start at",
                value: options.start,
                onChange: (v) => setOption("start", v),
                min: 0,
                max: 99999,
              })}
              {optionCheckbox({
                label: "Skip empty lines",
                checked: options.skipEmpty,
                onChange: (v) => setOption("skipEmpty", v),
              })}
            </>
          ) : null}
        </>
      )}
      example={{
        caption: "Dot format starting at 1 (Add numbers mode).",
        before: "alpha\nbeta\ngamma",
        after: "1. alpha\n2. beta\n3. gamma",
      }}
      faqs={[
        { q: "Is Number Lines free?", a: "Yes. Add or remove line numbers with no signup." },
        {
          q: "Can I remove existing line numbers?",
          a: "Yes. Choose Remove numbers in Mode. The old /remove-line-numbers URL redirects here.",
        },
        {
          q: "Can I start from zero?",
          a: "Yes. In Add mode, set Start at to 0 (or any number) before numbering.",
        },
        { q: "Is my text uploaded?", a: "No. Numbering runs entirely in your browser." },
      ]}
    />
  );
}
