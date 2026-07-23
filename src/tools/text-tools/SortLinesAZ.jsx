import { ArrowDownAZ } from "lucide-react";
import TextTransformTool from "./TextTransformTool";
import { optionCheckbox, optionSelect } from "./textToolOptions";

function sortLines(text, { direction, caseInsensitive, ignoreEmpty }) {
  let lines = text.split(/\r?\n/);
  if (ignoreEmpty) lines = lines.filter((l) => l.length > 0);
  const descending = direction === "za";
  const sorted = [...lines].sort((a, b) => {
    const aa = caseInsensitive ? a.toLowerCase() : a;
    const bb = caseInsensitive ? b.toLowerCase() : b;
    if (aa < bb) return descending ? 1 : -1;
    if (aa > bb) return descending ? -1 : 1;
    return 0;
  });
  return { output: sorted.join("\n"), count: sorted.length, direction };
}

export default function SortLinesAZ() {
  return (
    <TextTransformTool
      seoPage="sortLinesAZ"
      icon={ArrowDownAZ}
      title="Sort Lines"
      subtitle="Sort lines alphabetically A–Z or Z–A. Optionally ignore case and skip blank lines."
      path="/text-tools/sort-lines-az"
      formLabel="Sort lines"
      outputLabel="Sorted lines"
      placeholder={"zebra\napple\nBanana\napple"}
      outputPlaceholder="Sorted lines will appear here…"
      initialOptions={{ direction: "az", caseInsensitive: false, ignoreEmpty: false }}
      transform={sortLines}
      getStats={(_, { count, direction }) =>
        `Sorted ${count} line${count === 1 ? "" : "s"} ${direction === "za" ? "Z–A" : "A–Z"}.`
      }
      renderOptions={({ options, setOption }) => (
        <>
          {optionSelect({
            id: "sort-direction",
            label: "Direction",
            value: options.direction,
            onChange: (v) => setOption("direction", v),
            children: (
              <>
                <option value="az">A–Z (ascending)</option>
                <option value="za">Z–A (descending)</option>
              </>
            ),
          })}
          {optionCheckbox({
            label: "Case-insensitive",
            checked: options.caseInsensitive,
            onChange: (v) => setOption("caseInsensitive", v),
          })}
          {optionCheckbox({
            label: "Ignore empty lines",
            checked: options.ignoreEmpty,
            onChange: (v) => setOption("ignoreEmpty", v),
          })}
        </>
      )}
      example={{
        caption: "Case-sensitive A–Z sort keeps capital letters before lowercase in typical Unicode order.",
        before: "zebra\napple\nBanana\napple",
        after: "Banana\napple\napple\nzebra",
      }}
      faqs={[
        { q: "Is Sort Lines free?", a: "Yes. Sort text lines A–Z or Z–A with no signup." },
        {
          q: "Can I sort Z–A?",
          a: "Yes. Choose Z–A (descending) in the Direction control. The old /sort-lines-za URL redirects here.",
        },
        {
          q: "Is sorting stable for duplicates?",
          a: "Equal lines keep relative order from the JavaScript sort implementation; duplicates stay adjacent after sorting.",
        },
        { q: "Is my text uploaded?", a: "No. Sorting runs entirely in your browser." },
      ]}
    />
  );
}
