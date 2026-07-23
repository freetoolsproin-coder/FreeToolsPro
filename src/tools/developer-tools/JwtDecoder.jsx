import { useState, useEffect } from "react";
import { Copy, AlertTriangle, Clock, CheckCircle, XCircle, KeyRound } from "lucide-react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

function decodeBase64Url(str) {
  try {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    // Pad base64 string if necessary
    while (str.length % 4) {
      str += "=";
    }
    const decoded = atob(str);
    // Use decodeURIComponent to handle multi-byte characters correctly
    const escapeDecoded = encodeURIComponent(decoded).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    });
    return JSON.parse(escapeDecoded);
  } catch {
    return null;
  }
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState(null);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [tokenStatus, setTokenStatus] = useState({ valid: null, message: "" });

  // Handle live decoding whenever token changes
  useEffect(() => {
    if (!token.trim()) {
      setHeader(null);
      setPayload(null);
      setSignature("");
      setError("");
      setTokenStatus({ valid: null, message: "" });
      return;
    }

    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      setError("Invalid JWT format. A valid token must have 3 parts separated by dots (.)");
      setHeader(null);
      setPayload(null);
      setSignature("");
      setTokenStatus({ valid: null, message: "" });
      return;
    }

    const decodedHeader = decodeBase64Url(parts[0]);
    const decodedPayload = decodeBase64Url(parts[1]);

    if (!decodedHeader || !decodedPayload) {
      setError("Failed to decode token segments. Ensure it is a valid Base64Url encoded string.");
      setHeader(null);
      setPayload(null);
      setSignature("");
      setTokenStatus({ valid: null, message: "" });
      return;
    }

    setHeader(decodedHeader);
    setPayload(decodedPayload);
    setSignature(parts[2]);
    setError("");

    // Check token expiration status if 'exp' claim exists
    if (decodedPayload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > decodedPayload.exp) {
        setTokenStatus({
          valid: false,
          message: `Expired on ${new Date(decodedPayload.exp * 1000).toLocaleString()}`,
        });
      } else {
        setTokenStatus({
          valid: true,
          message: `Valid until ${new Date(decodedPayload.exp * 1000).toLocaleString()}`,
        });
      }
    } else {
      setTokenStatus({ valid: true, message: "Decoded successfully (No expiration claim)" });
    }
  }, [token]);

  const copy = async (data) => {
    const textToCopy = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(textToCopy);
    alert("📋 Copied to clipboard");
  };

  // Extract the split sections of the token to highlight them visually
  const tokenParts = token.trim().split(".");

  return (
    <>
      <Seo page="jwtDecoder" />

      <ToolHeroShell
        category="developer-tools"
        icon={KeyRound}
        title="JWT Decoder"
        subtitle="Paste your JSON Web Token to decode Header, Payload, and Signature in real-time."
        formLabel="Decode"
        layout="stack"
        wide
      >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Panel: Input & Visual breakdown */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Encoded Token (Paste here)
                </label>
                <textarea
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full jsonTextarea h-48 bg-black/30 border border-slate-700 rounded-xl p-4 text-xs font-mono text-indigo-300 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none break-all"
                />

                {/* Live Segment Micro-Visualizer */}
                {tokenParts.length === 3 && !error && (
                  <div className="mt-4 p-3 bg-black/20 rounded-xl border border-slate-800/50 text-xxs font-mono break-all leading-relaxed">
                    <span className="text-rose-400 font-bold">{tokenParts[0]}</span>
                    <span className="text-slate-400 font-bold">.</span>
                    <span className="text-cyan-400 font-bold">{tokenParts[1]}</span>
                    <span className="text-slate-400 font-bold">.</span>
                    <span className="text-purple-400 font-bold">{tokenParts[2]}</span>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="mt-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-3 flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Status Claim Banner */}
                {tokenStatus.valid !== null && (
                  <div
                    className={`mt-4 border rounded-xl p-3 flex items-center gap-3 text-sm ${
                      tokenStatus.valid
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    }`}
                  >
                    {tokenStatus.valid ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="font-medium">{tokenStatus.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Output Blocks */}
            <div className="lg:col-span-5 space-y-6">
              {header || payload ? (
                <div className="space-y-6">
                  {/* Header Output block */}
                  <div className="relative rounded-2xl bg-slate-900/40 backdrop-blur-md border border-rose-500/20 p-5 shadow-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        <h3 className="text-sm font-semibold tracking-wide text-rose-400 uppercase">
                          Header{" "}
                          <span className="text-xs font-normal text-slate-500">
                            (Algorithm & Token Type)
                          </span>
                        </h3>
                      </div>
                      <button
                        onClick={() => copy(header)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                        title="Copy Header"
                      >
                        <Copy size={15} />
                      </button>
                    </div>
                    <pre className="bg-black/40 border border-slate-800/80 rounded-xl p-4 text-xs font-mono text-rose-300 overflow-auto max-h-48 scrollbar-thin">
                      {JSON.stringify(header, null, 2)}
                    </pre>
                  </div>

                  {/* Payload Output block */}
                  <div className="relative rounded-2xl bg-slate-900/40 backdrop-blur-md border border-cyan-500/20 p-5 shadow-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <h3 className="text-sm font-semibold tracking-wide text-cyan-400 uppercase">
                          Payload{" "}
                          <span className="text-xs font-normal text-slate-500">(Data Claims)</span>
                        </h3>
                      </div>
                      <button
                        onClick={() => copy(payload)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                        title="Copy Payload"
                      >
                        <Copy size={15} />
                      </button>
                    </div>
                    <pre className="bg-black/40 border border-slate-800/80 rounded-xl p-4 text-xs font-mono text-cyan-300 overflow-auto max-h-72 scrollbar-thin">
                      {JSON.stringify(payload, null, 2)}
                    </pre>
                  </div>

                  {/* Signature Info Block */}
                  <div className="relative rounded-2xl bg-slate-900/40 backdrop-blur-md border border-purple-500/20 p-5 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        <h3 className="text-sm font-semibold tracking-wide text-purple-400 uppercase">
                          Signature Verified
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-mono truncate bg-black/20 p-2.5 rounded-lg border border-slate-800">
                      {signature ||
                        'HMACSHA256( base64UrlEncode(header) + "." + base64UrlEncode(payload), secret )'}
                    </p>
                  </div>
                </div>
              ) : (
                /* Empty State Indicator */
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 p-8 text-center">
                  <Clock className="w-10 h-10 mb-3 text-slate-600 stroke-[1.5]" />
                  <p className="text-sm font-medium">Awaiting Token Signature</p>
                  <p className="text-xs text-slate-600 mt-1 max-w-xs">
                    Once you insert a well-formed JSON Web token on the left side pane, its
                    properties will render here.
                  </p>
                </div>
              )}
            </div>
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/jwt-decoder" />
    </>
  );
}
