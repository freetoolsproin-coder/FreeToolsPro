import { useCallback, useState } from "react";
import { Shuffle } from "lucide-react";
import TextTransformTool from "./TextTransformTool";

function shuffleArray(arr, seed) {
  const a = [...arr];
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ShuffleLines() {
  const [seed, setSeed] = useState(() => Date.now() % 1_000_000);

  const transform = useCallback(
    (text) => {
      const lines = text.split(/\r?\n/);
      const shuffled = shuffleArray(lines, seed);
      return { output: shuffled.join("\n"), count: lines.length, seed };
    },
    [seed]
  );

  return (
    <TextTransformTool
      seoPage="shuffleLines"
      icon={Shuffle}
      title="Shuffle Lines"
      subtitle="Randomize line order. Click Reshuffle for a new mix."
      path="/text-tools/shuffle-lines"
      formLabel="Shuffle lines"
      outputLabel="Shuffled lines"
      placeholder={"one\ntwo\nthree\nfour\nfive"}
      outputPlaceholder="Shuffled lines will appear here…"
      transform={transform}
      getStats={(_, { count }) => `Shuffled ${count} line${count === 1 ? "" : "s"}.`}
      renderOptions={() => (
        <button
          type="button"
          onClick={() => setSeed((s) => (s + 1) % 1_000_000_007)}
          className="age-btn-ghost px-3 py-2 text-sm"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Reshuffle
        </button>
      )}
      example={{
        caption: "Order is randomized; click Reshuffle for another mix.",
        before: "one\ntwo\nthree\nfour",
        after: "three\none\nfour\ntwo",
      }}
      faqs={[
        { q: "Is Shuffle Lines free?", a: "Yes. Randomize lines with no signup." },
        {
          q: "Can I reshuffle?",
          a: "Yes. Use Reshuffle to generate a new random order without changing your input.",
        },
        { q: "Is my text uploaded?", a: "No. Shuffling runs entirely in your browser." },
      ]}
    />
  );
}
