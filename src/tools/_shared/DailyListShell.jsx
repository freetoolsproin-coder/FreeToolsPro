import { useMemo, useState } from "react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

/**
 * Filterable list/table shell for daily market pages.
 * rows: array of objects; columns: [{key, label}]
 */
export default function DailyListShell({
  seoKey,
  category,
  path,
  icon: Icon,
  title,
  subtitle,
  rows,
  columns,
  searchKeys = [],
  footnote = "Sample / illustrative data for planning—not a live exchange or dealer feed.",
  renderExtra = null,
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((row) =>
      searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(s))
    );
  }, [q, rows, searchKeys]);

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
        formLabel="Browse"
      >
        {searchKeys.length ? (
          <label className="block text-sm text-[var(--ftp-ink-soft)]">
            Filter
            <input
              className={`${inputDark} mt-1.5`}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
            />
          </label>
        ) : null}
        {renderExtra}
        <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--ftp-line)] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--ftp-porcelain)] text-xs uppercase tracking-wide text-[var(--ftp-ink-soft)]">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 font-semibold">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} className="border-t border-[var(--ftp-line)]">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 text-[var(--ftp-ink)]">
                      {row[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">{footnote}</p>
      </ToolHeroShell>
      <ToolContentLayout category={category} currentToolPath={path} />
    </>
  );
}
