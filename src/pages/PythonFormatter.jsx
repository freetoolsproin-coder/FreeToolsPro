import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Helmet } from "react-helmet-async";
import { Copy, Sparkles } from "lucide-react";

export default function PythonFormatter() {
  const [code, setCode] = useState(
    "def add(a,b):\n return a+b"
  );
  const [formatted, setFormatted] = useState("");
  const [loading, setLoading] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const [error, setError] = useState("");

  /* ---------------- LOAD PYODIDE + BLACK ---------------- */
  useEffect(() => {
    const loadPyodide = async () => {
      const py = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
      });
      await py.loadPackage("micropip");
      await py.runPythonAsync(`
        import micropip
        await micropip.install("black")
      `);
      setPyodide(py);
    };
    loadPyodide();
  }, []);

  /* ---------------- FORMAT USING BLACK ---------------- */
  const formatCode = async () => {
    if (!pyodide) return;

    setLoading(true);
    setError("");

    try {
      const result = await pyodide.runPythonAsync(`
from black import format_str, FileMode
formatted = format_str("""${code.replace(/"""/g, '\\"\\"\\"')}""", mode=FileMode())
formatted
      `);
      setFormatted(result);
    } catch (e) {
      setError("❌ Invalid Python syntax");
    }

    setLoading(false);
  };

  return (
    <>
      {/* ---------------- SEO ---------------- */}
      <Helmet>
        <title>Python Formatter Online – Black Formatter Tool</title>
        <meta
          name="description"
          content="Format Python code instantly using Black formatter online. Free, fast, secure Python formatter with VS Code editor."
        />
        <script type="application/ld+json">
          {JSON.stringify(FAQ_SCHEMA)}
        </script>
      </Helmet>

      <main className="min-h-screen bg-black p-6">
        <section className="max-w-7xl mx-auto glass glow p-6 rounded-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">
            🐍 Python Formatter
          </h1>
          <p className="text-gray-300 mb-6">
            Format Python code using the official{" "}
            <span className="text-blue-400 font-semibold">Black</span>{" "}
            formatter — right in your browser.
          </p>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* INPUT */}
            <div className="rounded-xl overflow-hidden border border-white/10">
              <div className="bg-black/40 px-4 py-2 text-sm text-gray-300">
                Input Python Code
              </div>
              <Editor
                height="400px"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                }}
              />
            </div>

            {/* OUTPUT */}
            <div className="rounded-xl overflow-hidden border border-white/10">
              <div className="bg-black/40 px-4 py-2 text-sm text-gray-300">
                Formatted Output
              </div>
              <Editor
                height="400px"
                defaultLanguage="python"
                theme="vs-dark"
                value={formatted}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                }}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 mt-4 font-medium">{error}</p>
          )}

          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={formatCode}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              <Sparkles size={18} />
              {loading ? "Formatting..." : "Format with Black"}
            </button>

            <button
              onClick={() =>
                navigator.clipboard.writeText(formatted)
              }
              disabled={!formatted}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition"
            >
              <Copy size={18} /> Copy Output
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

/* ---------------- FAQ SCHEMA ---------------- */
const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a Python formatter?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "A Python formatter automatically formats Python code to follow consistent style rules such as indentation, spacing, and line length.",
      },
    },
    {
      "@type": "Question",
      name: "Which formatter does this tool use?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "This tool uses Black, the official and most widely used Python code formatter.",
      },
    },
    {
      "@type": "Question",
      name: "Is this Python formatter free?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes, this Python formatter is completely free and runs entirely in your browser.",
      },
    },
  ],
};
