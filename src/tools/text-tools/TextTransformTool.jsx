import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

/**
 * Shared Age/DuplicateLineRemover-style shell for input → transform → output text tools.
 */
export default function TextTransformTool({
  seoPage,
  icon,
  title,
  subtitle,
  path,
  formLabel,
  inputLabel = "Input text",
  outputLabel = "Result",
  placeholder = "Paste or type your text here…",
  outputPlaceholder = "Result will appear here…",
  faqs = [],
  initialOptions = {},
  renderOptions,
  transform,
  getStats,
  example,
}) {
  const [text, setText] = useState("");
  const [options, setOptions] = useState(initialOptions);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => transform(text, options), [text, options, transform]);
  const output = result?.output ?? "";

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setOption = (key, value) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const stats = text && getStats ? getStats(text, result, options) : null;

  return (
    <>
      <Seo page={seoPage} />

      <ToolHeroShell
        icon={icon}
        title={title}
        subtitle={subtitle}
        category="text-tools"
        layout="stack"
        formLabel={formLabel || title}
      >
        {renderOptions ? (
          <div className="mb-4 flex flex-wrap items-end gap-4">
            {renderOptions({ options, setOption, setOptions })}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor={`${seoPage}-in`} className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              {inputLabel}
            </label>
            <textarea
              id={`${seoPage}-in`}
              rows={14}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              className={textareaDark}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor={`${seoPage}-out`} className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                {outputLabel}
              </label>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!text}
                className="age-btn-ghost px-3 py-1.5 text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea
              id={`${seoPage}-out`}
              readOnly
              rows={14}
              value={text ? output : ""}
              placeholder={outputPlaceholder}
              className={textareaDark}
            />
          </div>
        </div>

        {stats ? (
          <p className="mt-4 rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-3 py-2 text-sm text-[var(--ftp-ink)]">
            {stats}
          </p>
        ) : null}

        {example?.before && example?.after ? (
          <div className="mt-6 rounded-[14px] border border-[var(--ftp-line)] bg-white/80 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--age-teal-deep,#0f766e)]">
              Example
            </p>
            {example.caption ? (
              <p className="mt-2 text-sm leading-6 text-[var(--ftp-ink-soft)]">{example.caption}</p>
            ) : null}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-semibold text-[var(--ftp-ink)]">Before</p>
                <pre className="whitespace-pre-wrap rounded-lg bg-[var(--ftp-porcelain)] p-3 text-xs leading-5 text-[var(--ftp-ink)]">
                  {example.before}
                </pre>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-[var(--ftp-ink)]">After</p>
                <pre className="whitespace-pre-wrap rounded-lg bg-[var(--ftp-porcelain)] p-3 text-xs leading-5 text-[var(--ftp-ink)]">
                  {example.after}
                </pre>
              </div>
            </div>
            {example.before ? (
              <button
                type="button"
                className="age-btn-ghost mt-3 px-3 py-1.5 text-xs"
                onClick={() => setText(example.before)}
              >
                Try this example
              </button>
            ) : null}
          </div>
        ) : null}
      </ToolHeroShell>

      <ToolContentLayout category="text-tools" currentToolPath={path} faqs={faqs} />
    </>
  );
}
