import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ToolCard, { CollectionCard } from "../components/ToolCard";
import HomeSeo from "../components/HomeSeo";
import ProductHuntBanner from "../components/ProductHuntBanner";
import {
  BLOG_NAV_VISIBLE,
  blogHomePath,
  blogNavHref,
  blogNavIsExternal,
} from "../../blog/data/blogSite";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [tools, setTools] = useState([]);
  const [collections, setCollections] = useState([]);
  const [categoryChips, setCategoryChips] = useState([{ id: "all", label: "All" }]);
  const [catalogReady, setCatalogReady] = useState(false);
  const catalogRef = useRef(null);

  // Load heavy tool catalog only when the browse section is near the viewport (mobile TBT win).
  useEffect(() => {
    let alive = true;
    let loaded = false;

    const load = async () => {
      if (loaded || !alive) return;
      loaded = true;
      const [{ tools: allTools }, home] = await Promise.all([
        import("../data/toolDefinitions"),
        import("../data/homeSections"),
      ]);
      if (!alive) return;
      startTransition(() => {
        setTools(allTools.filter((t) => !t.isPageLink));
        setCollections(home.getCollectionStats());
        setCategoryChips(home.getHomeCategoryList());
        setCatalogReady(true);
      });
    };

    const node = catalogRef.current;
    if (node && typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect();
            load();
          }
        },
        { rootMargin: "240px 0px" }
      );
      io.observe(node);
      // Fallback if user never scrolls: load after a long idle on mobile.
      const idleId =
        typeof window !== "undefined" && "requestIdleCallback" in window
          ? window.requestIdleCallback(() => load(), { timeout: 8000 })
          : window.setTimeout(load, 4000);
      return () => {
        alive = false;
        io.disconnect();
        if (typeof idleId === "number") window.clearTimeout(idleId);
        else window.cancelIdleCallback?.(idleId);
      };
    }

    const t = window.setTimeout(load, 1200);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, []);

  const filteredTools = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
      const matchesSearch =
        !search ||
        tool.name.toLowerCase().includes(search) ||
        tool.desc.toLowerCase().includes(search) ||
        tool.keywords?.some((keyword) => keyword.toLowerCase().includes(search));
      return matchesCategory && matchesSearch;
    });
  }, [tools, searchTerm, activeCategory]);

  const showBrowseOnly = Boolean(searchTerm.trim());

  return (
    <div className="ftp-page">
      <HomeSeo />
      <ProductHuntBanner />
      <Hero onSearch={setSearchTerm} searchValue={searchTerm} />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <section
          ref={catalogRef}
          className="mb-16 ftp-defer-paint"
          aria-labelledby="browse-heading"
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="ftp-section-label">Catalog</p>
              <h2 id="browse-heading" className="ftp-section-title mt-2">
                {showBrowseOnly ? "Search results" : "Browse all"}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryChips.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`ftp-chip ${activeCategory === category.id ? "ftp-chip--active" : ""}`}
                >
                  {category.label}
                  {typeof category.count === "number" ? (
                    <span className="ml-1 opacity-70">({category.count})</span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          {!catalogReady ? (
            <div className="grid gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-[12px] border border-[var(--ftp-line)] bg-white"
                />
              ))}
            </div>
          ) : filteredTools.length ? (
            <div className="grid gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="rounded-[12px] border border-dashed border-[var(--ftp-line)] bg-white px-6 py-20 text-center">
              <h3 className="ftp-display text-2xl font-semibold text-[var(--ftp-ink)]">
                No tools found
              </h3>
              <p className="mt-2 text-[var(--ftp-ink-soft)]">
                Try another keyword or pick a different category.
              </p>
            </div>
          )}
        </section>

        {!showBrowseOnly ? (
          <>
            <section className="mb-16 ftp-defer-paint" aria-labelledby="collections-heading">
              <div className="mb-6">
                <p className="ftp-section-label">Browse</p>
                <h2 id="collections-heading" className="ftp-section-title mt-2">
                  Popular collections
                </h2>
              </div>
              {collections.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {collections.map((collection) => (
                    <CollectionCard key={collection.id} collection={collection} />
                  ))}
                </div>
              ) : null}
            </section>

            {BLOG_NAV_VISIBLE ? (
              <section className="mb-14 ftp-defer-paint" aria-labelledby="blog-heading">
                <div className="flex flex-col gap-4 rounded-[18px] border border-[var(--ftp-line)] bg-gradient-to-br from-white/80 to-teal-50/40 px-6 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-8">
                  <div className="max-w-xl">
                    <p className="ftp-section-label">Learn</p>
                    <h2 id="blog-heading" className="ftp-section-title mt-2">
                      Guides &amp; tutorials
                    </h2>
                    <p className="mt-3 text-[0.98rem] leading-7 text-[var(--ftp-ink-soft)]">
                      SEO checklists, EMI/SIP walkthroughs, image optimization tips, PDF how-tos, and
                      JavaScript notes—each linked to free tools you can open in one click.
                    </p>
                  </div>
                  {blogNavIsExternal() ? (
                    <a
                      href={blogNavHref("/")}
                      className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--ftp-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                      rel="noopener noreferrer"
                    >
                      Visit the blog
                    </a>
                  ) : (
                    <Link
                      to={blogHomePath()}
                      className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--ftp-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Visit the blog
                    </Link>
                  )}
                </div>
              </section>
            ) : null}
          </>
        ) : null}

        <section className="cont-text border-t border-[var(--ftp-line)] pt-12 pb-6 text-left ftp-defer-paint">
          <h3 className="toolsTitle text-left">
            FreeToolsPro – All-in-One Free Online Tools Platform
          </h3>
          <p>
            FreeToolsPro brings calculators, business utilities, developer tools, image editors, PDF
            helpers, social media generators, and trending utilities into one place. Instead of
            jumping between multiple websites for EMI planning, SEO checks, invoice creation, or AI
            writing, you can complete everyday digital tasks from a single free platform that works
            in your browser.
          </p>

          <h4>What You Can Do With Our Combined Tool Collection</h4>
          <p>
            Each category solves a different workflow, and together they cover personal, professional,
            and technical needs:
          </p>
          <ul className="cont-textul">
            <li>
              Calculators: Plan finances with age, EMI, SIP, inflation, PPF, loan eligibility,
              mortgage and gratuity tools.
            </li>
            <li>
              Business Tools: Handle GST, salary, payroll, invoices, quotations, and inventory
              calculations for day-to-day operations.
            </li>
            <li>
              Developer &amp; SEO Tools: Format JSON/YAML/SQL, convert CSV and Excel, test regex,
              build flowcharts and DB schemas, generate docs and bug reports, check SSL, domain age,
              backlinks, site speed, and run quick SEO audits.
            </li>
            <li>
              Text Tools: Trim, wrap, unwrap, indent, sort, shuffle, and number lines; rewrite
              emails by tone; remove duplicates; count words; check grammar; and generate lorem
              ipsum for drafts and layouts.
            </li>
            <li>
              Image &amp; PDF Tools: Resize, convert, extract text, generate AI images, and manage
              PDF files without installing software.
            </li>
            <li>
              Social &amp; Content Tools: Create captions, bios, blog titles, YouTube tags, essays,
              stories, and resume drafts faster.
            </li>
            <li>
              Trending Utilities: Use password generators, QR tools, color pickers, unit converters,
              and currency converters for everyday tasks.
            </li>
          </ul>

          <h4>Key Advantages of Using FreeToolsPro</h4>
          <ul className="cont-textul">
            <li>Completely free to use with no forced sign-up for most tools.</li>
            <li>Browser-based tools—no downloads or heavy software installs.</li>
            <li>Fast results for calculations, conversions, checks, and content drafts.</li>
            <li>Mobile-friendly design that works on phones, tablets, and desktops.</li>
            <li>Privacy-focused workflows where many tools process data locally in your browser.</li>
            <li>One platform for finance, business, SEO, design, and productivity needs.</li>
            <li>Clear categories and search so you can find the right tool quickly.</li>
          </ul>

          <h4>Who Can Benefit From These Tools?</h4>
          <ul className="cont-textul">
            <li>
              Students &amp; Job Seekers: Calculate age or BMI, draft essays and resumes, generate
              study-friendly text, and prepare documents faster.
            </li>
            <li>
              Freelancers &amp; Small Businesses: Create invoices and quotations, estimate payroll or
              GST, track inventory basics, and manage client-ready content.
            </li>
            <li>
              Developers &amp; SEO Professionals: Validate JSON/YAML/SQL, convert CSV and Excel,
              test regex, generate robots and sitemaps, audit pages, and check indexing, SSL, and
              backlinks.
            </li>
            <li>
              Marketers &amp; Creators: Build captions, bios, blog titles, YouTube tags, and AI
              images to speed up content production.
            </li>
            <li>
              Finance Planners &amp; Home Buyers: Compare EMIs, mortgage payments, SIP returns,
              inflation impact, loan eligibility, and investment profit scenarios.
            </li>
            <li>
              Everyday Users: Convert units and currencies, generate passwords or QR codes, resize
              images, and solve common online tasks without technical skills.
            </li>
          </ul>

          <h4>How we build tools &amp; protect privacy</h4>
          <p>
            FreeToolsPro is built browser-first: whenever practical, calculators and text transforms
            run on your device so everyday inputs do not need to leave the page for the core result.
            Tool pages include working workspaces plus original explanations—what the tool does, why
            it is useful, step-by-step instructions, examples, benefits, use cases, and FAQs—so each
            page helps before you paste data.
          </p>
          <p>
            The site may show ads through Google AdSense and use analytics to understand traffic.
            Read our{" "}
            <Link to="/privacy-policy" className="underline underline-offset-2">
              Privacy Policy
            </Link>
            ,{" "}
            <Link to="/terms" className="underline underline-offset-2">
              Terms
            </Link>
            ,{" "}
            <Link to="/disclaimer" className="underline underline-offset-2">
              Disclaimer
            </Link>
            , and{" "}
            <Link to="/cookie-policy" className="underline underline-offset-2">
              Cookie Policy
            </Link>
            , or learn more{" "}
            <Link to="/about" className="underline underline-offset-2">
              About FreeToolsPro
            </Link>
            . Email{" "}
            <a href="mailto:support@freetoolspro.in" className="underline underline-offset-2">
              support@freetoolspro.in
            </a>{" "}
            or use the{" "}
            <Link to="/contact" className="underline underline-offset-2">
              Contact
            </Link>{" "}
            form.
          </p>

          <h4>How to Get the Most Value</h4>
          <p>
            Start by choosing a category above or searching for a tool by name. Open the tool, enter
            your details, and get instant results. For larger workflows, combine tools—for example,
            use a loan eligibility calculator before a mortgage calculator, run an SEO audit after
            updating meta tags, or draft content with AI writers and refine it with word or grammar
            tools. Because everything is available in one place, you save time, reduce tool-switching,
            and keep your daily digital work simple and efficient.
          </p>
          <p>
            Explore the full FreeToolsPro collection and use the right free online tool whenever you
            need accurate calculations, faster content, cleaner files, or clearer website insights.
          </p>
        </section>
      </div>
    </div>
  );
}
