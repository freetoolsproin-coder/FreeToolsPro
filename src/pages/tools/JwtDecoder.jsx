import { useState } from "react";
import { Copy, AlertTriangle, ShieldCheck } from "lucide-react";
import Seo from "../../components/Seo";

function decodeBase64Url(str) {
  try {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(str);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState("");

  const decodeToken = () => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      const decodedHeader = decodeBase64Url(parts[0]);
      const decodedPayload = decodeBase64Url(parts[1]);

      if (!decodedHeader || !decodedPayload) {
        throw new Error("Failed to decode token");
      }

      setHeader(decodedHeader);
      setPayload(decodedPayload);
      setError("");
    } catch (err) {
      setError(err.message);
      setHeader(null);
      setPayload(null);
    }
  };

  const copy = async (data) => {
    await navigator.clipboard.writeText(
      JSON.stringify(data, null, 2)
    );
    alert("📋 Copied");
  };

  return (
    <>

    <Seo page="jwtDecoder" />
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-center mb-8
          bg-gradient-to-r from-cyan-400 to-blue-500
          bg-clip-text text-transparent">
          JWT Decoder
        </h1>

        {/* Input */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 mb-6">
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste JWT here..."
            className="w-full h-28 bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-mono outline-none focus:border-cyan-400"
          />

          <button
            onClick={decodeToken}
            className="mt-4 px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition font-medium flex items-center gap-2"
          >
            <ShieldCheck size={16} />
            Decode Token
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {/* Output */}
        {(header || payload) && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Header */}
            <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4">
              <h2 className="font-semibold mb-2">Header</h2>
              <button
                onClick={() => copy(header)}
                className="absolute top-4 right-4 text-cyan-400 hover:text-white"
              >
                <Copy size={18} />
              </button>
              <pre className="bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-mono overflow-auto h-64">
                {JSON.stringify(header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4">
              <h2 className="font-semibold mb-2">Payload</h2>
              <button
                onClick={() => copy(payload)}
                className="absolute top-4 right-4 text-cyan-400 hover:text-white"
              >
                <Copy size={18} />
              </button>
              <pre className="bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-mono overflow-auto h-64">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>

    </>
  );
}
