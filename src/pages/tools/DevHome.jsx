import { motion } from "framer-motion";
import {
  Tags,
  Braces,
  KeyRound,
  Binary,
  Network,
  Bot, FileText,
} from "lucide-react";
import GlassHero from "../../components/GlassHero";
import GlassToolCard from "../../components/GlassToolCard";
import Seo from "../../components/Seo";

const tools = [
  {
    title: "Meta Tag Generator",
    desc: "Generate SEO-friendly meta tags instantly.",
    to: "/tools/meta-tag-generator",
    icon: Tags,
  },
  {
    title: "JSON Formatter",
    desc: "Format & validate JSON data.",
    to: "/tools/json-formatter",
    icon: Braces,
  },
  {
    title: "JWT Decoder",
    desc: "Decode JWT tokens securely in-browser.",
    to: "/tools/jwt-decoder",
    icon: KeyRound,
  },
  {
    title: "Base64 Encoder",
    desc: "Encode & decode Base64 strings.",
    to: "/tools/base64",
    icon: Binary,
  },
  {
    title: "Sitemap Generator",
    desc: "Create XML sitemaps easily.",
    to: "/tools/sitemap",
    icon: Network,
  },
  {
    title: "Robots.txt Generator",
    desc: "Generate robots.txt files for SEO.",
    to: "/tools/robots",
    icon: Bot,
  },
  /* 🔥 NEW: PDF TOOLS */
  {
    title: "PDF Tools",
    desc: "Convert & edit PDFs (Word, JPG, Editor).",
    to: "/tools/pdf-tools",
    icon: FileText,
  },
];

export default function DevHome() {
  return (
    <>

      <Seo page="toolsHome" />
      <main className="relative min-h-screen overflow-hidden">

        {/* Hero */}
        <GlassHero />

        {/* Tools */}
        <section className="relative max-w-6xl mx-auto px-4 pb-28 pt-10">
          <h2 class="text-4xl font-bold text-center mb-4 subtitle">Free Online <span>Developer Tools</span></h2>
          <div className=" relative rounded-[32px] p-6 md:p-10">

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center devTools">
              {tools.map((tool) => (
                <GlassToolCard
                  key={tool.to}   // ✅ unique & stable
                  {...tool}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

    </>
  );
}
