import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ToolCard, { CollectionCard } from "../components/ToolCard";
import Seo from "../components/Seo";
import { tools } from "../data/toolDefinitions";
import {
  getCollectionStats,
  getRecentlyAddedTools,
  getTrendingTools,
  HOME_CATEGORY_LIST,
} from "../data/homeSections";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const trending = useMemo(() => getTrendingTools(8), []);
  const recentlyAdded = useMemo(() => getRecentlyAddedTools(8), []);
  const collections = useMemo(() => getCollectionStats(), []);

  const filteredTools = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return tools
      .filter((tool) => !tool.isPageLink)
      .filter((tool) => {
        const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
        const matchesSearch =
          !search ||
          tool.name.toLowerCase().includes(search) ||
          tool.desc.toLowerCase().includes(search) ||
          tool.keywords?.some((keyword) => keyword.toLowerCase().includes(search));
        return matchesCategory && matchesSearch;
      });
  }, [searchTerm, activeCategory]);

  const showBrowseOnly = Boolean(searchTerm.trim());

  return (
    <div className="ftp-page">
      <Seo page="home" />
      <Hero onSearch={setSearchTerm} searchValue={searchTerm} />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {!showBrowseOnly ? (
          <>
            <section className="mb-14" aria-labelledby="trending-heading">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="ftp-section-label">Discover</p>
                  <h2 id="trending-heading" className="ftp-section-title mt-2">
                    Trending
                  </h2>
                </div>
                <Link
                  to="/tools?cat=trending-tools"
                  className="text-sm font-semibold text-[var(--ftp-ink-soft)] transition hover:text-[var(--ftp-ink)]"
                >
                  View all
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {trending.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>

            <section className="mb-14" aria-labelledby="recent-heading">
              <div className="mb-6">
                <p className="ftp-section-label">New</p>
                <h2 id="recent-heading" className="ftp-section-title mt-2">
                  Recently added
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {recentlyAdded.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>

            <section className="mb-14" aria-labelledby="blog-heading">
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
                <Link
                  to="/blog"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--ftp-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Visit the blog
                </Link>
              </div>
            </section>

            <section className="mb-16" aria-labelledby="collections-heading">
              <div className="mb-6">
                <p className="ftp-section-label">Browse</p>
                <h2 id="collections-heading" className="ftp-section-title mt-2">
                  Popular collections
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {collections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </section>
          </>
        ) : null}

        <section aria-labelledby="browse-heading">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="ftp-section-label">Catalog</p>
              <h2 id="browse-heading" className="ftp-section-title mt-2">
                {showBrowseOnly ? "Search results" : "Browse all"}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {HOME_CATEGORY_LIST.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`ftp-chip ${activeCategory === category.id ? "ftp-chip--active" : ""}`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {filteredTools.length ? (
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

        <section className="cont-text border-t border-[var(--ftp-line)] pt-12 pb-6 text-left">
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
              mortgage, stock/option profit, and gratuity tools.
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
