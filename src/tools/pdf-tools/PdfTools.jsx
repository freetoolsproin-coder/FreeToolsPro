import { useState, lazy, Suspense } from "react";
import { FileText, Image, Edit3 } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const PdfToWord = lazy(() => import("./PdfToWord"));
const PdfToJpg = lazy(() => import("./PdfToJpg"));
const PdfEditor = lazy(() => import("./PdfEditor"));

const TABS = [
  { id: "word", label: "PDF to Word", icon: FileText },
  { id: "jpg", label: "PDF to JPG", icon: Image },
  { id: "edit", label: "PDF Editor", icon: Edit3 },
];

export default function PdfTools() {
  const [active, setActive] = useState("word");

  // One URL → one SEO title (do not swap titles by tab; that looks like doorway pages).
  return (
    <>
      <Seo page="pdfConverter" />

      <ToolHeroShell
        category="pdf-tools"
        icon={FileText}
        title="PDF Tools"
        subtitle="Export PDF pages to JPG in your browser, add simple text edits, or use PDF to Word when a conversion API is configured."
        formLabel="Start here"
        layout="split"
        panel="light"
        columns="40fr 60fr"
      >
        <section className="rounded-3xl bg-amber/10 backdrop-blur-xl">
          <div className="sticky top-0 z-20 rounded-t-3xl bg-amber/40 backdrop-blur-xl">
            <div className="scrollbar-hide flex justify-center gap-2 overflow-x-auto">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActive(id)}
                  className={`flex items-center justify-center gap-2 font-light transition-all ${
                    active === id ? "btnActive" : "text-white hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="animate-fade-in justify-center p-4 sm:p-6 md:p-0">
            <Suspense fallback={<div>Loading...</div>}>
              {active === "word" && <PdfToWord />}
              {active === "jpg" && <PdfToJpg />}
              {active === "edit" && <PdfEditor />}
            </Suspense>
          </div>
        </section>
      </ToolHeroShell>

      <ToolContentLayout category="pdf-tools" currentToolPath="/pdf-tools/pdf-converter" />
    </>
  );
}
