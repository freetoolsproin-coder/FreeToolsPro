import { Link, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { categories, tools } from "../data/toolDefinitions";
import ToolCard from "../components/ToolCard";
import PageShell from "../components/PageShell";
import { COLLECTION_BLURBS } from "../data/homeSections";

export default function Tools() {
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("search") || "").toLowerCase();
  const categoryQuery = searchParams.get("cat");

  const categoryMeta = useMemo(() => {
    if (!categoryQuery) return null;
    return categories.find((c) => c.id === categoryQuery) || null;
  }, [categoryQuery]);

  const categoryChips = useMemo(() => {
    const realTools = tools.filter((tool) => !tool.isPageLink);
    return categories
      .map((category) => ({
        value: category.id,
        label: category.name,
        count: realTools.filter((tool) => tool.category === category.id).length,
      }))
      .filter((c) => c.count > 0);
  }, []);

  const filteredTools = useMemo(() => {
    const query = searchQuery.trim();

    return tools
      .filter((tool) => !tool.isPageLink)
      .filter((tool) => {
        const matchesSearch =
          !query ||
          tool.name.toLowerCase().includes(query) ||
          tool.desc?.toLowerCase().includes(query) ||
          tool.keywords?.some((keyword) => keyword.toLowerCase().includes(query));
        const matchesCategory = !categoryQuery || tool.category === categoryQuery;
        return matchesSearch && matchesCategory;
      });
  }, [searchQuery, categoryQuery]);

  const pageTitle = categoryMeta?.name || "All Tools";
  const pageSubtitle = categoryMeta
    ? COLLECTION_BLURBS[categoryMeta.id] ||
      `Browse ${filteredTools.length} ${categoryMeta.name.toLowerCase()} on FreeToolsPro.`
    : "Browse calculators, developer tools, image utilities, and more—organized by purpose.";

  return (
    <PageShell title={pageTitle} subtitle={pageSubtitle}>
      <div className="flex flex-wrap gap-2">
        <Link to="/tools" className={`ftp-chip ${!categoryQuery ? "ftp-chip--active" : ""}`}>
          All
        </Link>
        {categoryChips.map((category) => (
          <Link
            key={category.value}
            to={`/tools?cat=${category.value}`}
            className={`ftp-chip ${categoryQuery === category.value ? "ftp-chip--active" : ""}`}
          >
            {category.label.replace(/ Tools$/, "")} ({category.count})
          </Link>
        ))}
      </div>

      <div className="mt-8">
        {filteredTools.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-[var(--ftp-line)] bg-white p-10 text-center text-[var(--ftp-ink-soft)]">
            No tools found in this category.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
