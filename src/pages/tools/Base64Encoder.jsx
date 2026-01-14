import { useState } from "react";
import { Copy, RefreshCcw, AlertTriangle } from "lucide-react";
import Seo from "../../components/Seo";

export default function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const encode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setError("");
    } catch {
      setError("Failed to encode text");
      setOutput("");
    }
  };

  const decode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setError("");
    } catch {
      setError("Invalid Base64 string");
      setOutput("");
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    alert("📋 Copied to clipboard");
  };

  const reset = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <>

    <Seo page="base64Encoder" />
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">

        <h1
          className="
            text-3xl font-bold text-center mb-8
            bg-gradient-to-r from-cyan-400 to-blue-500
            bg-clip-text text-transparent
          "
        >
          Base64 Encoder / Decoder
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Input */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4">
            <h2 className="font-semibold mb-2">Input</h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text or Base64 here..."
              className="
                w-full h-64 bg-black/40
                border border-white/10 rounded-xl
                p-3 text-sm font-mono
                outline-none focus:border-cyan-400
              "
            />
          </div>

          {/* Output */}
          <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4">
            <h2 className="font-semibold mb-2">Output</h2>

            {output && (
              <button
                onClick={copy}
                className="absolute top-4 right-4 text-cyan-400 hover:text-white"
              >
                <Copy size={18} />
              </button>
            )}

            <pre
              className="
                w-full h-64 overflow-auto
                bg-black/40 border border-white/10
                rounded-xl p-3 text-sm font-mono
              "
            >
              {output || "Result will appear here"}
            </pre>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <button
            onClick={encode}
            className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition font-medium"
          >
            Encode
          </button>

          <button
            onClick={decode}
            className="px-6 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-medium"
          >
            Decode
          </button>

          <button
            onClick={reset}
            className="px-6 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition font-medium flex items-center gap-2"
          >
            <RefreshCcw size={16} />
            Reset
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
