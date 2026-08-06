import { useState } from "react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark, inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

/**
 * Generic input → action → output tool shell used by many developer utilities.
 */
export default function IoToolShell({
  seoKey,
  category,
  path,
  icon: Icon,
  title,
  subtitle,
  placeholder = "Paste input…",
  actionLabel = "Run",
  transform,
  sample = "",
  exampleOutput = "",
  examplePairs = null,
  multiline = true,
  extraControls = null,
  outputLabel = "Output",
}) {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [meta, setMeta] = useState(null);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setError("");
    setMeta(null);
    try {
      const result = await transform(input);
      if (result && typeof result === "object" && "output" in result) {
        setOutput(result.output ?? "");
        setMeta(result.meta || null);
        if (result.error) setError(result.error);
      } else {
        setOutput(result == null ? "" : String(result));
      }
    } catch (e) {
      setError(e.message || "Something went wrong");
      setOutput("");
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <Seo page={seoKey} />
      <ToolHeroShell
        category={category}
        icon={Icon}
        title={title}
        subtitle={subtitle}
        layout="stack"
        panel="light"
        formLabel="Try it"
      >
        {extraControls}
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block text-sm text-[var(--ftp-ink-soft)]">
            Input
            {multiline ? (
              <textarea
                className={`${textareaDark} mt-1.5 min-h-[220px]`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
              />
            ) : (
              <input
                className={`${inputDark} mt-1.5`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
              />
            )}
          </label>
          <label className="block text-sm text-[var(--ftp-ink-soft)]">
            {outputLabel}
            <textarea
              className={`${textareaDark} mt-1.5 min-h-[220px]`}
              value={output}
              readOnly
              placeholder="Result appears here…"
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={run}
            className="rounded-[14px] bg-[var(--ftp-ink)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            {actionLabel}
          </button>
          <button
            type="button"
            onClick={copy}
            className="rounded-[14px] border border-[var(--ftp-line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--ftp-ink)]"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => {
              setInput("");
              setOutput("");
              setError("");
              setMeta(null);
            }}
            className="rounded-[14px] border border-[var(--ftp-line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--ftp-ink-soft)]"
          >
            Clear
          </button>
        </div>
        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
        {meta ? <p className="mt-3 text-sm text-[var(--ftp-ink-soft)]">{meta}</p> : null}
      </ToolHeroShell>
      <ToolContentLayout
        category={category}
        currentToolPath={path}
        examplePairs={
          examplePairs ||
          (sample || exampleOutput
            ? [{ input: sample || "Sample input", result: exampleOutput || "Transformed output appears above." }]
            : undefined)
        }
      />
    </>
  );
}

export { inputDark, selectDark, textareaDark };
