import { useState, lazy, Suspense } from "react";
import { FileText, Image, Edit3, Loader2 } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const PdfToWord = lazy(() => import("./PdfToWord"));
const PdfToJpg = lazy(() => import("./PdfToJpg"));
const PdfEditor = lazy(() => import("./PdfEditor"));

const TABS = [
  {
    id: "word",
    label: "PDF to Word",
    short: "Word",
    icon: FileText,
    hint: "Editable document from PDF text",
  },
  {
    id: "jpg",
    label: "PDF to JPG",
    short: "JPG",
    icon: Image,
    hint: "Page images in your browser",
  },
  {
    id: "edit",
    label: "PDF Editor",
    short: "Editor",
    icon: Edit3,
    hint: "Add text overlays and download",
  },
];

const fallback = (
  <div className="flex min-h-[220px] items-center justify-center gap-2 text-sm text-[var(--ftp-ink-soft)]">
    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
    Loading tool…
  </div>
);

export default function PdfTools() {
  const [active, setActive] = useState("word");
  const activeTab = TABS.find((t) => t.id === active) || TABS[0];

  return (
    <>
      <Seo page="pdfConverter" />

      <ToolHeroShell
        category="pdf-tools"
        icon={FileText}
        title="PDF Converter"
        subtitle="Convert PDF to Word or JPG, or add simple text edits — all in your browser, no install required."
        formLabel={activeTab.label}
        formHint={activeTab.hint}
        layout="stack"
        wide
      >
        <div className="rounded-2xl border border-[var(--ftp-line)] bg-white p-4 sm:p-6">
          <div
            className="mb-6 flex flex-wrap gap-2 rounded-xl bg-[var(--ftp-porcelain)] p-1.5"
            role="tablist"
            aria-label="PDF converter modes"
          >
            {TABS.map(({ id, label, short, icon: Icon }) => {
              const selected = active === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-label={label}
                  aria-selected={selected}
                  onClick={() => setActive(id)}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition sm:flex-none sm:px-4 ${
                    selected
                      ? "bg-white text-[var(--ftp-ink)] shadow-sm ring-1 ring-black/5"
                      : "text-[var(--ftp-ink-soft)] hover:text-[var(--ftp-ink)]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span aria-hidden="true" className="sm:hidden">
                    {short}
                  </span>
                  <span aria-hidden="true" className="hidden sm:inline">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          <Suspense key={active} fallback={fallback}>
            {active === "word" ? <PdfToWord /> : null}
            {active === "jpg" ? <PdfToJpg /> : null}
            {active === "edit" ? <PdfEditor /> : null}
          </Suspense>
        </div>
      </ToolHeroShell>

      <ToolContentLayout category="pdf-tools" currentToolPath="/pdf-tools/pdf-converter" />
    </>
  );
}
