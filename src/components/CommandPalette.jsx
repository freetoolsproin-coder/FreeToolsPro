import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CornerDownLeft, Search } from "lucide-react";
import { searchTools } from "../data/homeSections";
import { categories } from "../data/toolDefinitions";

const categoryLabel = Object.fromEntries(categories.map((c) => [c.id, c.name]));

function groupByCategory(list) {
  const map = new Map();
  list.forEach((tool) => {
    const key = tool.category || "other";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(tool);
  });
  return [...map.entries()];
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listId = useId();
  const navigate = useNavigate();

  const results = useMemo(() => searchTools(query, 36), [query]);
  const grouped = useMemo(() => groupByCategory(results), [results]);

  const flatResults = results;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const goTo = useCallback(
    (tool) => {
      if (!tool) return;
      close();
      navigate(tool.path);
    },
    [close, navigate]
  );

  useEffect(() => {
    const onKey = (e) => {
      const isPaletteKey = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isPaletteKey) {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    const onOpenEvent = () => openPalette();
    window.addEventListener("keydown", onKey);
    window.addEventListener("ftp:open-command-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("ftp:open-command-palette", onOpenEvent);
    };
  }, [open, close, openPalette]);

  useEffect(() => {
    if (!open) return undefined;
    const id = window.setTimeout(() => inputRef.current?.focus(), 20);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  const onInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(flatResults.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      goTo(flatResults[activeIndex]);
    }
  };

  let runningIndex = -1;

  return (
    <div
      className="ftp-cmd"
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="ftp-cmd__panel">
        <div className="ftp-cmd__input-wrap">
          <Search className="h-4 w-4 shrink-0 text-[var(--ftp-ink-soft)]" aria-hidden="true" />
          <input
            ref={inputRef}
            className="ftp-cmd__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search tools…"
            aria-controls={listId}
            aria-autocomplete="list"
          />
          <kbd className="rounded border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-1.5 py-0.5 text-[0.65rem] font-semibold text-[var(--ftp-ink-soft)]">
            Esc
          </kbd>
        </div>

        <div id={listId} className="ftp-cmd__list" role="listbox">
          {flatResults.length === 0 ? (
            <p className="ftp-cmd__empty">No tools match “{query}”.</p>
          ) : (
            grouped.map(([category, items]) => (
              <div key={category}>
                <p className="ftp-cmd__group">{categoryLabel[category] || category}</p>
                {items.map((tool) => {
                  runningIndex += 1;
                  const index = runningIndex;
                  const Icon = tool.icon;
                  const active = index === activeIndex;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      data-active={active ? "true" : "false"}
                      className="ftp-cmd__item"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => goTo(tool)}
                    >
                      <span className="ftp-cmd__item-icon">
                        {Icon ? <Icon className="h-4 w-4" strokeWidth={1.75} /> : null}
                      </span>
                      <span className="ftp-cmd__item-meta">
                        <span className="ftp-cmd__item-name">{tool.name}</span>
                        <span className="ftp-cmd__item-desc">{tool.desc}</span>
                      </span>
                      {active ? (
                        <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-[var(--ftp-ink-soft)]" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="ftp-cmd__footer">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
