import { ArrowUpDown } from "lucide-react";
import TextTransformTool from "./TextTransformTool";

function reverseLines(text) {
  const lines = text.split(/\r?\n/);
  return { output: [...lines].reverse().join("\n"), count: lines.length };
}

export default function ReverseLines() {
  return (
    <TextTransformTool
      seoPage="reverseLines"
      icon={ArrowUpDown}
      title="Reverse Lines"
      subtitle="Flip the order of lines so the last line becomes first."
      path="/text-tools/reverse-lines"
      formLabel="Reverse lines"
      outputLabel="Reversed lines"
      placeholder={"first\nsecond\nthird"}
      outputPlaceholder="Reversed lines will appear here…"
      transform={reverseLines}
      getStats={(_, { count }) => `Reversed ${count} line${count === 1 ? "" : "s"}.`}
      example={{
        caption: "Only line order flips—text on each line stays the same.",
        before: "first\nsecond\nthird",
        after: "third\nsecond\nfirst",
      }}
      faqs={[
        { q: "Is Reverse Lines free?", a: "Yes. Reverse line order with no signup." },
        {
          q: "Does it reverse characters?",
          a: "No. Only the order of whole lines is reversed; text on each line stays the same.",
        },
        { q: "Is my text uploaded?", a: "No. Reversing runs entirely in your browser." },
      ]}
    />
  );
}
