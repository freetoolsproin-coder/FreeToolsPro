// Home, catalog, category hub and legal page bodies. Server-rendered.
import { CATEGORIES, TOOLS, POPULAR, toolsIn, toolById } from "../../data/catalog.js";
import { SITE } from "../../data/site.js";
import { ABOUT, EXAMPLES, HOME_FAQS } from "../../data/home.js";
import { ToolIcon, CategoryIcon, SearchIcon, ChevronRight, CircleCheck, SlidersHorizontal, Download, Zap, LinkIcon, IndianRupee, UserX, Command, Lock } from "./icons.jsx";
import { CrumbBar } from "./Crumbs.jsx";
import { HeroCommand } from "./HeroCommand.jsx";

function SearchBox({ big = false, autofocus = false }) {
  return (
    <form className={`search ${big ? "search--big" : ""}`} action="/tools" method="get" role="search" data-search>
      <label htmlFor="q" className="visually-hidden">
        Search {TOOLS.length} tools
      </label>
      <SearchIcon size={21} strokeWidth={2} aria-hidden="true" className="search__icon" />
      <input id="q" name="search" type="search" className="search__input" placeholder="Search: EMI, compress photo, JSON…" autoComplete="off" autoFocus={autofocus} />
      <kbd className="search__kbd" aria-hidden="true">/</kbd>
      <ul className="search__results" role="listbox" id="search-results" hidden />
    </form>
  );
}

/* Short category names for the tool boxes and filter chips (from categories.js). Colours live in global.css (.cat-<id>). */
const CAT_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.short]));


const Chevron = () => <ChevronRight className="tbox__chev" size={15} strokeWidth={2.2} aria-hidden="true" />;

/**
 * One tool as a box.
 * variant "home": category label + short line. "hub": "Most used" tag + full description.
 * "catalog": "Most used" tag + short line (the section heading already names the category).
 */
function ToolBox({ tool, variant = "home" }) {
  const cat = CATEGORIES.find((c) => c.id === tool.cat);
  const tagged = variant !== "home";
  return (
    <li className={`tbox cat-${tool.cat}`} data-tool={`${tool.name} ${tool.short}`.toLowerCase()} data-n={tool.name} data-s={tool.short} data-c={cat?.name} data-p={tool.path} data-pop={tool.popular ? 1 : undefined}>
      <a href={tool.path}>
        <span className="tbox__top">
          <span className="tbox__icon">
            <ToolIcon tool={tool} size={19} />
          </span>
          {tagged ? tool.popular && <span className="tbox__tag">Most used</span> : <span className="tbox__cat">{CAT_LABEL[tool.cat] || cat?.name}</span>}
        </span>
        <span className="tbox__name">{tool.name}</span>
        <span className="tbox__short">{variant === "hub" ? tool.description : tool.short}</span>
        <span className="tbox__go">
          Open tool
          <Chevron />
        </span>
      </a>
    </li>
  );
}

function Check() {
  return <CircleCheck className="check-icon" size={17} strokeWidth={2.2} aria-hidden="true" />;
}

/** Section intro used across the home page. */
function SecHead({ id, eyebrow, title, children, center = true }) {
  return (
    <header className={`hsec ${center ? "hsec--center" : ""}`}>
      <p className="hsec__eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {children && <p>{children}</p>}
    </header>
  );
}

/** Every toolkit as a card: icon, count, description and its top tools. The first card is wide. */
function Toolkits() {
  return (
    <section className="tk wrap" aria-labelledby="tk-h">
      <SecHead id="tk-h" eyebrow="Toolkits" title="Everything you need, organised">
        {CATEGORIES.length} toolkits and {TOOLS.length} tools for money, documents, study and code.
      </SecHead>
      <ul className="tk__grid">
        {CATEGORIES.map((c, i) => {
          const tools = toolsIn(c.id);
          const wide = i === 0;
          return (
            <li key={c.id} className={`tk__card spot cat-${c.id} ${wide ? "tk__card--wide" : ""}`}>
              <div className="tk__top">
                <span className="tk__icon">
                  <CategoryIcon id={c.id} size={20} />
                </span>
                <span className="tk__count">{tools.length} tools</span>
              </div>
              <h3 className="tk__name">
                <a href={c.path}>{c.name}</a>
              </h3>
              <p className="tk__desc">{c.description}</p>
              <ul className="tk__tools">
                {tools.slice(0, wide ? 6 : 3).map((t) => (
                  <li key={t.id}>
                    <a href={t.path}>
                      <ToolIcon tool={t} size={14} />
                      {t.name}
                    </a>
                  </li>
                ))}
              </ul>
              <a className="tk__open" href={c.path} aria-label={`Open ${c.name}`}>
                Open {c.short || c.name}
                <ChevronRight size={15} strokeWidth={2.2} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Three real steps: the order every tool works in. */
function HowItWorks() {
  const steps = [
    [SearchIcon, "Find your tool", "Search by what you want to do, like “compress photo” or “EMI”, or press Ctrl K on any page."],
    [SlidersHorizontal, "Enter your numbers or files", "Results update as you type. Images, PDFs and notes are processed right in your browser."],
    [Download, "Download, copy or share", "Save the file, copy the result, or share a calculator link with your values filled in."],
  ];
  return (
    <section className="how wrap" aria-labelledby="how-h">
      <SecHead id="how-h" eyebrow="How it works" title="From question to answer in three steps" />
      <ol className="how__steps">
        {steps.map(([Icon, t, d], i) => (
          <li key={t} className="how__step">
            <span className="how__num" aria-hidden="true">
              {i + 1}
            </span>
            <span className="how__icon">
              <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
            </span>
            <h3>{t}</h3>
            <p>{d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** What the site actually does differently. Every line is true of the product today. */
function Features() {
  const items = [
    [Lock, "Files stay on your device", "Images, PDFs and study notes are processed inside your browser and never uploaded to us."],
    [IndianRupee, "Built for India", "Lakh and crore, FY 2026-27 tax slabs, GST rates, PPF and EPF rules, CBSE grades and exam photo sizes."],
    [UserX, "No sign-up, no watermark", "Open any tool and use it straight away. There is no account and no daily limit."],
    [Zap, "Fast on any phone", "Pages are plain HTML, and only the tool you open loads its code, even on slow mobile data."],
    [LinkIcon, "Share your numbers", "Calculators can copy a link with your values filled in, so someone else sees the same result."],
    [Command, "Search from anywhere", "Press Ctrl K (⌘ K on a Mac) on any page to find a tool by name or by task."],
  ];
  return (
    <section className="feat wrap" aria-labelledby="feat-h">
      <SecHead id="feat-h" eyebrow="Why FreeToolsPro" title="Simple tools, carefully built" />
      <ul className="feat__grid">
        {items.map(([Icon, t, d]) => (
          <li key={t} className="feat__item spot">
            <span className="feat__icon">
              <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
            </span>
            <h3>{t}</h3>
            <p>{d}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <HeroCommand />

      {/* Everything below the hero shares its dark palette (site tokens re-tinted in .hdark). */}
      <div className="hlight">
        <Toolkits />
        <HowItWorks />
        <Features />

        <section className="qa2 wrap" aria-labelledby="answers-h">
          <SecHead id="answers-h" eyebrow="Worked examples" title="Quick answers">
            Common questions, worked out with our own calculators. Open one to try your own numbers.
          </SecHead>
          {/* Wide cards at 0, 3 and 4 fill a 3-column grid without gaps: [wide, 1] [1, wide] [wide, 1]. */}
          <ul className="bento">
            {EXAMPLES.map((e, i) => {
              const fig = e.fig;
              const tool = Object.values(toolById).find((t) => e.path.split("?")[0] === t.path);
              return (
                <li key={e.q} className={`bento__card ${[0, 3, 4].includes(i) ? "bento__card--wide" : ""} cat-${tool?.cat || "finance"}`}>
                  <a href={e.path}>
                    <span className="bento__tool">
                      {tool && <ToolIcon tool={tool} size={15} />}
                      {e.tool}
                    </span>
                    <h3>{e.q}</h3>
                    {fig && <p className="bento__fig">{fig}</p>}
                    <p className="bento__txt">{e.a}</p>
                    <span className="bento__go">
                      Try your own numbers
                      <ChevronRight size={15} strokeWidth={2.2} aria-hidden="true" />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="hfaq2 wrap" aria-labelledby="faq-h">
          <div className="hfaq2__about">
            <p className="hsec__eyebrow">About</p>
            <h2 id="faq-h">About {SITE.name}</h2>
            <p>{ABOUT}</p>
            <p className="hfaq2__mail">
              Questions or a tool request? <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </div>
          <div className="faq faq--dark">
            {HOME_FAQS.map(([q, a]) => (
              <details key={q} className="faq__item">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="hcta wrap" aria-labelledby="cta-h">
          <div className="hcta__box">
            <div>
              <h2 id="cta-h">Find the right tool in seconds</h2>
              <p>Search all {TOOLS.length} tools from any page.</p>
            </div>
            <div className="hcta__actions">
              <a className="hx__btn hx__btn--primary" href="/tools" data-kpal-open>
                Search tools
                <kbd className="hcta__kbd" data-kbd>
                  Ctrl K
                </kbd>
              </a>
              <a className="hx__btn hx__btn--ghost" href="/tools">
                Explore All Tools
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export function CatalogPage() {
  return (
    <>
      <section className="hub-hero cat-all">
        <div className="wrap">
          <CrumbBar trail={[["/", "Home"], [null, "All tools"]]} />
          <div className="hub-hero__in">
            <span className="hub-hero__icon">
              <SearchIcon size={30} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div>
              <h1 className="hub-hero__title">All {TOOLS.length} tools</h1>
              <p className="hub-hero__lede">Every tool on {SITE.name}, grouped by what it helps with. Start typing to filter the list, or jump to a toolkit.</p>
              <SearchBox big autofocus />
            </div>
          </div>
          <nav className="catalog__jump" aria-label="Jump to a toolkit" data-jumpnav>
            <ul className="hub__chips">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <a href={`#c-${c.id}`} className={`cat-${c.id}`} data-jump={`sec-${c.id}`}>
                    <CategoryIcon id={c.id} size={16} className="hub__chip-icon" />
                    {CAT_LABEL[c.id] || c.name}
                    <span>{toolsIn(c.id).length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
      <div className="wrap catalog">
        <section className="catalog__results" data-results hidden aria-live="polite">
          <header className="catalog__head">
            <h2 data-results-title>Matching tools</h2>
            <button type="button" className="catalog__clear" data-results-clear>
              Clear search
            </button>
          </header>
          <ul className="mix__grid" data-results-list />
        </section>
        <p className="catalog__empty" hidden data-empty>
          No tool matches that search. Try fewer or simpler words, like “loan”, “pdf” or “compress photo”.
        </p>
        {CATEGORIES.map((c) => {
          const tools = toolsIn(c.id);
          const ordered = tools; // already in priority order
          return (
            <section key={c.id} id={`sec-${c.id}`} className={`catalog__sec cat-${c.id}`} data-cat aria-labelledby={`c-${c.id}`}>
              <header className="catalog__head">
                <span className="catalog__icon">
                  <CategoryIcon id={c.id} size={22} />
                </span>
                <h2 id={`c-${c.id}`}>
                  <a href={c.path}>{c.name}</a>
                </h2>
                <span className="catalog__count">
                  <span data-count>{tools.length}</span> tools
                </span>
                <a className="catalog__open" href={c.path}>
                  Open toolkit
                  <Chevron />
                </a>
              </header>
              <ul className="mix__grid">
                {ordered.map((t) => (
                  <ToolBox key={t.id} tool={t} variant="catalog" />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}

export function HubPage({ cat }) {
  const tools = toolsIn(cat.id);
  const ordered = tools; // already in priority order
  const others = CATEGORIES.filter((c) => c.id !== cat.id);
  return (
    <>
      <section className={`hub-hero cat-${cat.id}`}>
        <div className="wrap">
          <CrumbBar trail={[["/", "Home"], [null, cat.name]]} />
          <div className="hub-hero__in">
            <span className="hub-hero__icon">
              <CategoryIcon id={cat.id} size={30} />
            </span>
            <div>
              <h1 className="hub-hero__title">{cat.name}</h1>
              <p className="hub-hero__lede">{cat.intro}</p>
              <ul className="hub-hero__facts">
                <li>
                  <Check /> {tools.length} free tools
                </li>
                <li>
                  <Check /> No sign-up
                </li>
                <li>
                  <Check /> Runs in your browser
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <div className="wrap hub">
        <ul className="mix__grid hub__grid">
          {ordered.map((t) => (
            <ToolBox key={t.id} tool={t} variant="hub" />
          ))}
        </ul>
        <nav className="hub__others" aria-labelledby="others-h">
          <h2 id="others-h">Explore other toolkits</h2>
          <ul className="hub__chips">
            {others.map((c) => (
              <li key={c.id}>
                <a href={c.path} className={`cat-${c.id}`}>
                  <CategoryIcon id={c.id} size={16} className="hub__chip-icon" />
                  {c.name}
                  <span>{toolsIn(c.id).length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

export function NotFound() {
  return (
    <div className="wrap page-head notfound">
      <h1>This page isn't here</h1>
      <p className="page-head__lede">The tool may have moved or been merged into another one. Search for it below, or start from the full list of {TOOLS.length} tools.</p>
      <SearchBox autofocus />
      <p>
        <a className="btn btn--primary" href="/tools">
          See all tools
        </a>
      </p>
      <h2>Popular right now</h2>
      <ul className="mix__grid">
        {POPULAR.map((t) => (
          <ToolBox key={t.id} tool={t} />
        ))}
      </ul>
    </div>
  );
}

export function LegalPage({ page, updated = SITE.updated }) {
  const Body = page.body;
  return (
    <div className="wrap legal">
      <header className="page-head">
        <h1>{page.title}</h1>
        <p className="muted">Last updated {new Date(updated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
      </header>
      <div className="prose">
        <Body />
      </div>
    </div>
  );
}
