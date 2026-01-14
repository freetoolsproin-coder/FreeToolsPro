import { useState } from "react";
import { FileText, Image, Edit3 } from "lucide-react";
import PdfToWord from "../../components/PdfToWord";
import PdfToJpg from "../../components/PdfToJpg";
import PdfEditor from "../../components/PdfEditor";
import Seo from "../../components/Seo";

const TABS = [
  { id: "word", label: "PDF to Word", icon: FileText },
  { id: "jpg", label: "PDF to JPG", icon: Image },
  { id: "edit", label: "Edit PDF", icon: Edit3 },
];

export default function PdfTools() {
  const [active, setActive] = useState("word");

  return (
    <>

    <Seo page="pdfTools" />
    <main className="min-h-screen bg-black text-white px-3 sm:px-6 py-8">

      {/* Header */}
      <header className="max-w-6xl mx-auto mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          📄 PDF Tools
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Convert, edit, and manage PDFs instantly — 100% browser based
        </p>
      </header>

      {/* Tool Container */}
      <section className="max-w-6xl mx-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl">

        {/* Tabs */}
        <div className="sticky top-0 z-20 bg-black/40 backdrop-blur-xl rounded-t-3xl border-b border-white/10">
          <div className="flex overflow-x-auto scrollbar-hide">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm sm:text-base font-medium whitespace-nowrap transition-all
                  ${
                    active === id
                      ? "text-blue-400 border-b-2 border-blue-400 bg-white/5"
                      : "text-gray-400 hover:text-white"
                  }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Content */}
        <div className="p-4 sm:p-6 md:p-8 animate-fade-in">
          {active === "word" && <PdfToWord />}
          {active === "jpg" && <PdfToJpg />}
          {active === "edit" && <PdfEditor />}
        </div>
      </section>

      {/* Footer Note */}
      <p className="text-center text-xs text-gray-500 mt-6">
        🔒 Files never leave your device · Fast · Secure · Free
      </p>
    </main>

    </>
  );
}
