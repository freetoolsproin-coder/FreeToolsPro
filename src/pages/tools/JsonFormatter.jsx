import { useState } from "react";
import { Check, Copy, AlertTriangle } from "lucide-react";
import Seo from "../../components/Seo";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (err) {
      setError(err.message);
      setOutput("");
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (err) {
      setError(err.message);
      setOutput("");
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(input);
      setError("");
      alert("✅ Valid JSON");
    } catch (err) {
      setError(err.message);
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    alert("📋 Copied to clipboard");
  };

  return (
    <>

    <Seo page="jsonFormatter" />
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-center mb-8
          bg-gradient-to-r from-cyan-400 to-blue-500
          bg-clip-text text-transparent">
          JSON Formatter & Validator
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Input */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4">
            <h2 className="font-semibold mb-2">Input JSON</h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"name":"John","age":30}'
              className="w-full h-64 bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-mono outline-none focus:border-cyan-400"
            />
          </div>

          {/* Output */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 relative">
            <h2 className="font-semibold mb-2">Output</h2>

            {output && (
              <button
                onClick={copyOutput}
                className="absolute top-4 right-4 text-cyan-400 hover:text-white"
              >
                <Copy size={18} />
              </button>
            )}

            <pre className="w-full h-64 overflow-auto bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-mono">
              {output || "Formatted JSON will appear here"}
            </pre>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <button
            onClick={formatJSON}
            className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition font-medium"
          >
            Format
          </button>

          <button
            onClick={minifyJSON}
            className="px-6 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-medium"
          >
            Minify
          </button>

          <button
            onClick={validateJSON}
            className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition font-medium flex items-center gap-2"
          >
            <Check size={16} /> Validate
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <AlertTriangle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </main>

    </>
  );
}
