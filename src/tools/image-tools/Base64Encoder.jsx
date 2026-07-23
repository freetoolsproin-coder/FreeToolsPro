import { useState, useEffect, useRef } from "react";
import { Copy,
  RefreshCcw,
  AlertTriangle,
  Check,
  ArrowLeftRight,
  Upload,
  Download,
  Zap,
  ZapOff, Image } from "lucide-react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

export default function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  // Auto-process on input change if live mode is active
  useEffect(() => {
    if (isLive && input) {
      // Small heuristic to check if input looks like Base64 to auto-decode,
      // but defaulting to auto-encode is safer. We'll stick to a primary flow or let them toggle.
      // For standard live mode, we default to encoding unless it's obviously a decoded state action.
      // To keep it predictable, live mode will run the *last chosen action* or default to encoding.
      autoProcess();
    } else if (!input) {
      setOutput("");
      setError("");
    }
  }, [input, isLive]);

  const autoProcess = () => {
    // If it looks like base64, we try decoding, otherwise encode.
    // Or you can explicitly track the current mode. Let's make it smart:
    const looksLikeBase64 =
      /^[A-Za-z0-9+/]*={0,2}$/.test(input.trim()) && input.trim().length % 4 === 0;
    if (looksLikeBase64 && input.length > 4) {
      runDecode();
    } else {
      runEncode();
    }
  };

  const runEncode = () => {
    if (!input) return;
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      // Convert binary array to base64 string safely
      const binString = Array.from(data, (byte) => String.fromCharCode(byte)).join("");
      setOutput(btoa(binString));
      setError("");
    } catch (err) {
      setError("Failed to encode text. Ensure data is valid.");
      setOutput("");
    }
  };

  const runDecode = () => {
    if (!input) return;
    try {
      const trimmedInput = input.trim().replace(/^data:.*;base64,/, ""); // strip data URI prefix if present
      const binString = atob(trimmedInput);
      const len = binString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binString.charCodeAt(i);
      }
      const decoder = new TextDecoder();
      setOutput(decoder.decode(bytes));
      setError("");
    } catch (err) {
      setError("Invalid Base64 string formatting.");
      setOutput("");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    // If it's a plain text file, we can just grab text, otherwise grab DataURL (Base64)
    if (file.type.startsWith("text/")) {
      reader.onload = (event) => setInput(event.target.result);
      reader.readAsText(file);
    } else {
      reader.onload = (event) => {
        // Sets the raw Base64 string or full data URI
        setInput(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "base64-output.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const swapFields = () => {
    if (!output) return;
    setInput(output);
    setOutput(input);
    setError("");
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setInput("");
    setOutput("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <Seo page="base64Encoder" />

      <ToolHeroShell
        category="image-tools"
        icon={Image}
        title="Base64 Tool suite"
        subtitle="Encode and decode text, files, or binary streams instantly."
        formLabel="Start here"
        layout="stack"
      >
{/* Workspace Panels */}
          <div className="grid md:grid-cols-2 gap-6 items-stretch mt-6">
            {/* Input Panel */}
            <div className="flex flex-col bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-300">Input Container</h4>
                  <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md font-mono">
                    {input.length} chars
                  </span>
                </div>

                {/* File Upload Hidden Setup */}
                <label className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 cursor-pointer transition">
                  <Upload size={14} />
                  <span>Upload File</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type/Paste text or drop base64 strings here..."
                className="w-full jsonTextarea h-72 bg-slate-950 text-slate-200 rounded-xl p-4 text-sm font-mono outline-none border border-slate-800 focus:border-amber-500/50 resize-none transition"
              />
            </div>

            {/* Output Panel */}
            <div className="flex flex-col bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-inner relative">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-300">Output Container</h4>
                  {output && (
                    <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md font-mono">
                      {output.length} chars
                    </span>
                  )}
                </div>

                {/* Quick Action Bar inside Output Header */}
                {output && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={downloadOutput}
                      title="Download as File"
                      className="text-slate-400 hover:text-amber-400 transition"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={copyToClipboard}
                      title="Copy Output"
                      className="text-slate-400 hover:text-amber-400 transition flex items-center gap-1"
                    >
                      {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                    </button>
                  </div>
                )}
              </div>

              <div className="w-full h-72 bg-slate-950 text-slate-300 rounded-xl p-4 text-sm font-mono overflow-auto border border-slate-800 break-all select-all">
                {output || (
                  <span className="text-slate-600 italic">Result string will display here...</span>
                )}
              </div>
            </div>
          </div>

          {/* Mid-Action Processing Bar */}
          <div className="flex flex-wrap gap-4 justify-center items-center mt-8 pt-4 border-t border-slate-800">
            <button
              onClick={runEncode}
              className="px-6 py-2.5 rounded-xl font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-2 shadow-sm"
            >
              Encode Plaintext
            </button>

            <button
              onClick={swapFields}
              disabled={!output}
              title="Swap input and output values"
              className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-700 disabled:opacity-40 disabled:hover:text-slate-400 transition"
            >
              <ArrowLeftRight size={18} />
            </button>

            <button
              onClick={runDecode}
              className="px-6 py-2.5 rounded-xl font-semibold btnRegular hover:from-amber-600 hover:to-orange-700 text-white transition shadow-md shadow-orange-950/20"
            >
              Decode Base64
            </button>

            <button
              onClick={reset}
              className="px-5 py-2.5 rounded-xl text-slate-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition flex items-center gap-2"
            >
              <RefreshCcw size={15} />
              Reset
            </button>
          </div>

          {/* Notifications / Errors */}
          {error && (
            <div className="mt-6 flex items-center gap-3 text-red-400 bg-red-950/30 border border-red-900/50 rounded-xl p-4 animate-pulse">
              <AlertTriangle size={18} className="shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
      </ToolHeroShell>

      <ToolContentLayout
        category="image-tools"
        currentToolPath="/image-tools/base64-encoder" />
    </>
  );
}
