import { ShieldCheck, Sparkles, Zap } from "lucide-react";
import Seo from "../components/Seo";
import ToolCard from "../components/ToolCard";
import { tools } from "../data/toolDefinitions";

const developerTools = tools.filter((tool) => tool.category === "developer-tools");

export default function DevHome() {
  return (
    <>
      <Seo page="tools" />

      <main className="ftp-page min-h-screen">
        <section className="toolsbg relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-teal-200">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Developer tools
              </span>
              <h1 className="ftp-display mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Utilities that keep projects moving
              </h1>
              <p className="mt-4 text-[1.05rem] leading-7 text-white/60">
                From JSON and JWT to SEO generators and network checks—validate, format, and ship
                faster.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Fast and precise",
                body: "Instant results for formatting, validation, and technical checks.",
              },
              {
                icon: ShieldCheck,
                title: "Secure by design",
                body: "Most tools run in your browser so sensitive content stays with you.",
              },
              {
                icon: Sparkles,
                title: "Built for real workflows",
                body: "Debug, SEO setup, content checks, and everyday technical tasks.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-[1.25rem] border border-[var(--ftp-line)] bg-white/65 p-7 backdrop-blur-sm"
              >
                <Icon className="h-7 w-7 text-teal-700" aria-hidden="true" />
                <h2 className="ftp-display mt-4 text-xl font-semibold tracking-tight text-[var(--ftp-ink)]">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--ftp-ink-soft)]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="ftp-display text-2xl font-semibold tracking-tight text-[var(--ftp-ink)]">
              Developer tools
            </h2>
            <p className="mt-2 text-[var(--ftp-ink-soft)]">
              Popular utilities for formatting, validating, analyzing, and shipping.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {developerTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
