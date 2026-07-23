import { IndentIncrease } from "lucide-react";
import TextTransformTool from "./TextTransformTool";
import { optionNumber, optionSelect } from "./textToolOptions";

function indentText(text, { mode, amount, style }) {
  const n = Math.max(1, Math.min(16, Number(amount) || 2));
  const lines = text.split(/\r?\n/);

  if (mode === "outdent") {
    const output = lines
      .map((line) => {
        if (style === "tabs") {
          let rest = line;
          for (let i = 0; i < n && rest.startsWith("\t"); i++) rest = rest.slice(1);
          return rest;
        }
        return line.replace(new RegExp(`^[ ]{1,${n}}`), "");
      })
      .join("\n");
    return { output, n, style, mode };
  }

  const prefix = style === "tabs" ? "\t".repeat(n) : " ".repeat(n);
  const output = lines.map((line) => (line.length ? prefix + line : line)).join("\n");
  return { output, n, style, mode };
}

export default function IndentText() {
  return (
    <TextTransformTool
      seoPage="indentText"
      icon={IndentIncrease}
      title="Indent Text"
      subtitle="Add or remove spaces/tabs at the start of each line."
      path="/text-tools/indent-text"
      formLabel="Indent text"
      outputLabel="Result"
      placeholder={"function hello() {\nconsole.log('hi');\n}"}
      outputPlaceholder="Result will appear here…"
      initialOptions={{ mode: "indent", amount: 2, style: "spaces" }}
      transform={indentText}
      getStats={(_, { n, style, mode }) =>
        mode === "outdent"
          ? `Removed up to ${n} leading ${style === "tabs" ? "tab" : "space"}${n === 1 ? "" : "s"} per line.`
          : `Added ${n} ${style === "tabs" ? "tab" : "space"}${n === 1 ? "" : "s"} per non-empty line.`
      }
      renderOptions={({ options, setOption }) => (
        <>
          {optionSelect({
            id: "indent-mode",
            label: "Mode",
            value: options.mode,
            onChange: (v) => setOption("mode", v),
            children: (
              <>
                <option value="indent">Indent (add)</option>
                <option value="outdent">Outdent (remove)</option>
              </>
            ),
          })}
          {optionSelect({
            id: "indent-style",
            label: options.mode === "outdent" ? "Remove" : "Indent with",
            value: options.style,
            onChange: (v) => setOption("style", v),
            children: (
              <>
                <option value="spaces">Spaces</option>
                <option value="tabs">Tabs</option>
              </>
            ),
          })}
          {optionNumber({
            id: "indent-amount",
            label: "Amount",
            value: options.amount,
            onChange: (v) => setOption("amount", v),
            min: 1,
            max: 16,
          })}
        </>
      )}
      example={{
        caption: "Two spaces added to each non-empty line (Indent mode).",
        before: "function hello() {\nconsole.log('hi');\n}",
        after: "  function hello() {\n  console.log('hi');\n  }",
      }}
      faqs={[
        { q: "Is Indent Text free?", a: "Yes. Indent or outdent lines with no signup." },
        {
          q: "Can I outdent (unindent)?",
          a: "Yes. Choose Outdent (remove) in Mode. The old /outdent-text URL redirects here.",
        },
        {
          q: "Are blank lines indented?",
          a: "In Indent mode, empty lines stay empty so vertical spacing is preserved.",
        },
        { q: "Is my text uploaded?", a: "No. Indenting runs entirely in your browser." },
      ]}
    />
  );
}
