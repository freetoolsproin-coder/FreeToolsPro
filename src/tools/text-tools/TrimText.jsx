import { Scissors } from "lucide-react";
import TextTransformTool from "./TextTransformTool";
import { optionSelect } from "./textToolOptions";

function trimText(text, { mode }) {
  const lines = text.split(/\r?\n/);
  let output;
  switch (mode) {
    case "lines":
      output = lines.map((l) => l.trim()).join("\n");
      break;
    case "leading":
      output = lines.map((l) => l.replace(/^\s+/, "")).join("\n");
      break;
    case "trailing":
      output = lines.map((l) => l.replace(/\s+$/, "")).join("\n");
      break;
    default:
      output = text.trim();
  }
  return { output };
}

export default function TrimText() {
  return (
    <TextTransformTool
      seoPage="trimText"
      icon={Scissors}
      title="Trim Text"
      subtitle="Strip leading and trailing whitespace from the whole block or each line."
      path="/text-tools/trim-text"
      formLabel="Trim text"
      outputLabel="Trimmed text"
      placeholder={"  hello world  \n  padded line  "}
      outputPlaceholder="Trimmed text will appear here…"
      initialOptions={{ mode: "lines" }}
      transform={trimText}
      getStats={(text, { output }) =>
        text === output ? "No whitespace changes needed." : "Whitespace trimmed."
      }
      renderOptions={({ options, setOption }) =>
        optionSelect({
          id: "trim-mode",
          label: "Mode",
          value: options.mode,
          onChange: (v) => setOption("mode", v),
          children: (
            <>
              <option value="lines">Trim each line</option>
              <option value="all">Trim whole text</option>
              <option value="leading">Leading only (per line)</option>
              <option value="trailing">Trailing only (per line)</option>
            </>
          ),
        })
      }
      example={{
        caption: "Per-line trim removes spaces at both ends of each line.",
        before: "  hello world  \n\tpadded line\t",
        after: "hello world\npadded line",
      }}
      faqs={[
        { q: "Is Trim Text free?", a: "Yes. Trim whitespace with no signup." },
        {
          q: "What does “trim each line” do?",
          a: "It removes spaces and tabs from the start and end of every line, keeping line breaks.",
        },
        { q: "Is my text uploaded?", a: "No. Trimming runs entirely in your browser." },
      ]}
    />
  );
}
