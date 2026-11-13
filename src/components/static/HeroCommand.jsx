// Home hero: "One intelligent workspace. Every tool you need."
// Left: headline, description, CTAs. Right: the Command Center (real tool search over the catalogue)
// with floating cards for five real tools. Server-rendered; src/scripts/command-center.js makes it live.
import { TOOLS, CATEGORIES, toolById, categoryById } from "../../data/catalog.js";
import { ToolIcon, CategoryIcon, SearchIcon, ChevronRight, CircleCheck } from "./icons.jsx";

// Suggested queries: each one finds a real tool in the catalogue.
const SUGGESTIONS = ["Convert JPG to PDF", "Calculate my age", "Validate JSON", "Check SEO meta tags"];
// Category filters shown in the palette (ids from src/data/categories.js).
const FILTERS = ["pdf", "image", "developer", "seo", "finance", "student"];
// Floating cards around the palette, by grid slot.
// Two above the palette (t1, t2), three below it (b1, b2, b3).
const CARDS = [
  ["jpg-to-pdf", "t1"],
  ["json-formatter", "t2"],
  ["age-calculator", "b1"],
  ["image-compressor", "b2"],
  ["meta-title-description-checker", "b3"],
];

function Result({ t, i }) {
  const cat = categoryById[t.cat];
  return (
    <li role="option" id={`cc-opt-${i}`} aria-selected={i === 0 ? "true" : "false"} className={`cc__opt cat-${t.cat}`}>
      <a href={t.path} tabIndex={-1}>
        <span className="cc__opt-icon">
          <CategoryIcon id={t.cat} size={16} />
        </span>
        <span className="cc__opt-txt">
          <span className="cc__opt-name">{t.name}</span>
          <span className="cc__opt-short">{t.short}</span>
        </span>
        <span className="cc__opt-cat">{cat?.short || cat?.name}</span>
      </a>
    </li>
  );
}

export function HeroCommand() {
  const popular = TOOLS.filter((t) => t.popular).slice(0, 5);
  const cards = CARDS.map(([id, slot]) => [toolById[id], slot]).filter(([t]) => t);
  return (
    <section className="hx" aria-labelledby="hx-title" data-hx>
      <div className="hx__bg" aria-hidden="true" />
      <div className="hx__in">
        <div className="hx__copy">
          <p className="hx__eyebrow">The all-in-one digital toolkit</p>
          <h1 className="hx__title" id="hx-title">
            <span>Less busywork.</span>
            <span>
              More <span className="hx__grad">brilliant work.</span>
            </span>
          </h1>
          <p className="hx__lede">Powerful free online tools for PDFs, developers, SEO, calculations, and everyday productivity. Get things done faster, without unnecessary complexity.</p>
          {/* Typing here drives the Command Center; without JavaScript it submits to /tools?search=… */}
          <form className="hx__search" role="search" action="/tools" method="get" data-hx-search>
            <SearchIcon size={20} strokeWidth={2} aria-hidden="true" />
            <label htmlFor="hx-q" className="visually-hidden">
              Search {TOOLS.length} tools
            </label>
            <input id="hx-q" name="search" type="search" className="hx__search-in" placeholder="Search tools, e.g. compress photo or EMI" autoComplete="off" spellCheck="false" aria-controls="cc-list" />
            <button type="submit" className="hx__search-go">
              Search
            </button>
          </form>
          <div className="hx__ctas">
            <a className="hx__btn hx__btn--primary" href="/tools">
              Explore All Tools
              <span aria-hidden="true">→</span>
            </a>
            <a className="hx__btn hx__btn--ghost" href="#cc-input" data-cc-popular>
              Discover Popular Tools
            </a>
          </div>
          <ul className="hx__trust">
            {["Free to use", "Fast and easy", "No unnecessary friction"].map((x) => (
              <li key={x}>
                <CircleCheck size={16} strokeWidth={2.2} aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </div>

        <div className="hx__stage">
          <span className="hx__ring" aria-hidden="true" />
          <span className="hx__tick hx__tick--a" aria-hidden="true" />
          <span className="hx__tick hx__tick--b" aria-hidden="true" />

          <div className="cc" id="command" data-cc>
            <div className="cc__top">
              <span className="cc__dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="cc__name">Command Center</span>
              <span className="cc__count">{TOOLS.length} tools</span>
            </div>
            <div className="cc__search">
              <SearchIcon size={18} strokeWidth={2} aria-hidden="true" />
              <label htmlFor="cc-input" className="visually-hidden">
                Search tools by name or task
              </label>
              <input
                id="cc-input"
                type="search"
                className="cc__input"
                placeholder="What do you need to do?"
                autoComplete="off"
                spellCheck="false"
                role="combobox"
                aria-expanded="true"
                aria-controls="cc-list"
                aria-autocomplete="list"
                aria-activedescendant="cc-opt-0"
              />
              <kbd className="cc__kbd" aria-hidden="true">
                Enter
              </kbd>
            </div>
            <div className="cc__filters" role="group" aria-label="Filter by category">
              <button type="button" className="cc__chip" aria-pressed="true" data-filter="all">
                All
              </button>
              <button type="button" className="cc__chip" aria-pressed="false" data-filter="popular">
                Popular
              </button>
              {FILTERS.map((id) => (
                <button key={id} type="button" className={`cc__chip cat-${id}`} aria-pressed="false" data-filter={id}>
                  <CategoryIcon id={id} size={13} />
                  {categoryById[id]?.short}
                </button>
              ))}
            </div>
            <p className="cc__label" data-cc-label>
              Popular tools
            </p>
            <ul className="cc__list" id="cc-list" role="listbox" aria-label="Matching tools">
              {popular.map((t, i) => (
                <Result key={t.id} t={t} i={i} />
              ))}
            </ul>
            <p className="cc__empty" data-cc-empty hidden>
              No tool matches that yet. Try fewer words, or <a href="/tools">browse all tools</a>.
            </p>
            <div className="cc__suggest">
              <span>Try:</span>
              {SUGGESTIONS.map((q) => (
                <button key={q} type="button" className="cc__q" data-q={q}>
                  {q}
                </button>
              ))}
            </div>
            <p className="cc__hint" aria-hidden="true">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> to move
              </span>
              <span>
                <kbd>Enter</kbd> to open
              </span>
              <span>
                <kbd>Esc</kbd> to clear
              </span>
            </p>
          </div>

          <ul className="hx__cards" aria-label="Popular tools">
            {cards.map(([t, slot]) => (
              <li key={t.id} className={`hx__slot hx__slot--${slot}`}>
                <a href={t.path} className={`hx__card cat-${t.cat}`}>
                  <span className="hx__card-icon">
                    <ToolIcon tool={t} size={16} />
                  </span>
                  <span className="hx__card-txt">
                    <span className="hx__card-name">{t.name}</span>
                    <span className="hx__card-cat">{categoryById[t.cat]?.short}</span>
                  </span>
                  <ChevronRight size={14} strokeWidth={2.2} aria-hidden="true" className="hx__card-go" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Category icons for results rendered in the browser. */}
      {CATEGORIES.map((c) => (
        <template key={c.id} data-cc-icon={c.id}>
          <CategoryIcon id={c.id} size={16} />
        </template>
      ))}
      <script type="application/json" id="cc-index" dangerouslySetInnerHTML={{ __html: JSON.stringify(TOOLS.map((t) => ({ n: t.name, s: t.short, d: t.description, p: t.path, k: t.cat, c: categoryById[t.cat]?.short, i: t.id, pop: t.popular ? 1 : 0 }))) }} />
    </section>
  );
}
