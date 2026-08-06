import { useMemo, useState } from "react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrDec = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export { inr, inrDec };

/**
 * Generic multi-field finance calculator shell.
 * fields: [{ key, label, type:'number'|'select', default, min, max, step, options? }]
 * compute(values) => { results: [{label, value, tone?}], note? }
 */
export default function FinanceCalcShell({
  seoKey,
  category,
  path,
  icon: Icon,
  title,
  subtitle,
  fields,
  compute,
  actionLabel = "Calculate",
}) {
  const initials = useMemo(() => Object.fromEntries(fields.map((f) => [f.key, f.default])), [fields]);
  const [values, setValues] = useState(initials);
  const [ran, setRan] = useState(true);

  const result = useMemo(() => {
    if (!ran) return null;
    try {
      return compute(values);
    } catch (e) {
      return { results: [], note: e.message || "Invalid inputs" };
    }
  }, [values, ran, compute]);

  const examplePairs = useMemo(() => {
    try {
      const demo = compute(initials);
      if (!demo?.results?.length) return undefined;
      const input = fields
        .map((f) => {
          const val = initials[f.key];
          const display =
            f.type === "select"
              ? f.options?.find((o) => o.value === String(val))?.label || val
              : val;
          return `${f.label}: ${display}`;
        })
        .join("\n");
      const output = demo.results.map((r) => `${r.label}: ${r.value}`).join("\n");
      return [{ input, result: output, note: demo.note }];
    } catch {
      return undefined;
    }
  }, [compute, fields, initials]);

  const set = (key, raw) => {
    const field = fields.find((f) => f.key === key);
    if (field?.type === "select") {
      setValues((v) => ({ ...v, [key]: raw }));
      return;
    }
    setValues((v) => ({ ...v, [key]: raw === "" ? "" : Number(raw) }));
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
        formLabel="Inputs"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <label key={f.key} className="text-sm text-[var(--ftp-ink-soft)]">
              {f.label}
              {f.type === "select" ? (
                <select
                  className={`${selectDark} mt-1.5`}
                  value={values[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                >
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className={`${inputDark} mt-1.5`}
                  type="number"
                  min={f.min}
                  max={f.max}
                  step={f.step ?? "any"}
                  value={values[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              )}
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setRan(true)}
          className="mt-4 rounded-[14px] bg-[var(--ftp-ink)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          {actionLabel}
        </button>

        {result?.results?.length ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.results.map((r) => (
              <div
                key={r.label}
                className="rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ftp-ink-soft)]">
                  {r.label}
                </p>
                <p
                  className={`mt-1 text-xl font-semibold ${
                    r.tone === "up"
                      ? "text-teal-700"
                      : r.tone === "down"
                        ? "text-rose-600"
                        : "text-[var(--ftp-ink)]"
                  }`}
                >
                  {r.value}
                </p>
              </div>
            ))}
          </div>
        ) : null}
        {result?.note ? (
          <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">{result.note}</p>
        ) : null}
      </ToolHeroShell>
      <ToolContentLayout category={category} currentToolPath={path} examplePairs={examplePairs} />
    </>
  );
}
