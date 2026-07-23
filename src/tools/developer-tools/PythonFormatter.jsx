import { useEffect, useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
import { Copy, Sparkles, RefreshCw, CheckCircle, Code2 } from "lucide-react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

// Configure Monaco loader outside the component to avoid running on every render
loader.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs",
  },
});

export default function PythonFormatter() {
  const [code, setCode] = useState("def add(a,b):\n    return a+b\n\nmy_list = [1,2,3,]");
  const [formatted, setFormatted] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  /* ---------------- LOAD PYODIDE & BLACK FORMATTER ---------------- */
  useEffect(() => {
    let isMounted = true;

    const initPyodide = async () => {
      try {
        // 1. Dynamically inject the Pyodide CDN script into the DOM if not already present
        if (!window.loadPyodide) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
            script.async = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error("Failed to load Pyodide script from CDN."));
            document.body.appendChild(script);
          });
        }

        // 2. Initialize Pyodide environment
        const py = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/",
        });

        // 3. Install micro-pip and Black formatter package
        await py.loadPackage("micropip");
        await py.runPythonAsync(`
          import micropip
          await micropip.install("black")
        `);

        if (isMounted) {
          setPyodide(py);
          setIsReady(true);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load the formatter environment. Please refresh the page.");
          console.error(err);
        }
      }
    };

    initPyodide();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ---------------- FORMAT CODE VIA BLACK ---------------- */
  const formatCode = async () => {
    if (!pyodide) return;

    setLoading(true);
    setError("");

    try {
      pyodide.globals.set("__raw_code__", code);

      const result = await pyodide.runPythonAsync(`
from black import format_str, FileMode

# Using industry standard default parameters (PEP 8)
mode = FileMode()
format_str(__raw_code__, mode=mode)
      `);

      setFormatted(result);
    } catch (e) {
      const errMsg = e.message.split("ValueError:").pop() || e.message;
      const isSyntaxError = errMsg.includes("IndentationError") || errMsg.includes("SyntaxError");

      setError(
        isSyntaxError
          ? `⚠️ Syntax or Indentation Error: ${errMsg.trim()}`
          : "❌ Could not format Python code. Please verify your code syntax."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!formatted) return;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="pythonFormatter" />

      <ToolHeroShell
        category="developer-tools"
        icon={Code2}
        title="Python Formatter"
        subtitle="Paste your code below to clean, align, and format it instantly."
        formLabel="Start here"
        layout="stack"
      >
<div className="flex justify-end mt-2 mb-4">
            <button
              onClick={formatCode}
              disabled={loading || !isReady}
              className="w-full sm:w-auto btnRegular text-white flex justify-end gap-2"
            >
              {loading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} className="text-indigo-200" />
              )}
              {!isReady ? "Loading Engine..." : loading ? "Formatting..." : "Clean Code"}
            </button>
          </div>

          {/* Code Editors Workspace Split */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Workspace Panel */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm flex flex-col">
                <div className="bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 flex justify-between items-center">
                  <span>Paste Raw Code</span>
                  <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                    Input
                  </span>
                </div>
                <div className="p-2 bg-[#1e1e1e]">
                  <Editor
                    height="380px"
                    defaultLanguage="python"
                    theme="vs-dark"
                    value={code}
                    onChange={(v) => setCode(v || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: "on",
                      lineNumbers: "on",
                      scrollbar: { verticalScrollbarSize: 8 },
                    }}
                  />
                </div>
              </div>

              {/* Output Workspace Panel */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm flex flex-col">
                <div className="bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 flex justify-between items-center">
                  <span>Formatted Output</span>
                  <button
                    onClick={copyToClipboard}
                    disabled={!formatted}
                    className="text-[10px] btnSmall font-semibold text-black disabled:text-slate-400 transition-colors flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <CheckCircle size={10} className="text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Copy Code
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2 bg-[#1e1e1e]">
                  <Editor
                    height="380px"
                    defaultLanguage="python"
                    theme="vs-dark"
                    value={formatted}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: "on",
                      lineNumbers: "on",
                      scrollbar: { verticalScrollbarSize: 8 },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Error logs block */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-mono text-xs overflow-x-auto whitespace-pre-wrap shadow-inner">
                {error}
              </div>
            )}
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/python-formatter" />
    </>
  );
}
