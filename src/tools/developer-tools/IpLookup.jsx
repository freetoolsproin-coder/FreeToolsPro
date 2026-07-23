import { Code2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";
import "leaflet/dist/leaflet.css";

function IpLookup() {
  const [ip, setIp] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simple IPv4/IPv6 validation regex
  const ipRegex =
    /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

  useEffect(() => {
    fetchIPData(""); // Auto-fetch user's own IP on mount
  }, []);

  const fetchIPData = async (targetIp) => {
    if (targetIp && !ipRegex.test(targetIp)) {
      setError("Please enter a valid IPv4 or IPv6 address.");
      return;
    }

    setLoading(true);
    setError("");
    setCopied(false);
    try {
      const endpoint = targetIp ? `https://ipapi.co/${targetIp}/json/` : `https://ipapi.co/json/`;
      const res = await fetch(endpoint);
      const result = await res.json();

      if (result.error) {
        setError(result.reason || "Invalid IP Address or API rate limit reached.");
        setData(null);
      } else {
        setData(result);
        setIp(result.ip);
      }
    } catch (err) {
      setError("Failed to resolve IP data. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = () => {
    if (!ip.trim()) {
      setError("IP address field cannot be empty.");
      return;
    }
    fetchIPData(ip.trim());
  };

  const copyToClipboard = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="ipLookup" />

      <ToolHeroShell
        category="developer-tools"
        icon={Code2}
        title="Advanced IP Lookup"
        subtitle="Instantly track geographical location, network routing protocol, ISP specifications, and timezone metadata."
        formLabel="Start here"
        layout="stack"
        panel="light"
      >
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-bold text-slate-800">IP lookup</h2>
            <div className="flex flex-col gap-3">
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 font-mono text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  placeholder="Enter IP (e.g., 8.8.8.8) or leave blank for your IP"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                />
                {ip ? (
                  <button
                    type="button"
                    onClick={() => setIp("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                onClick={handleLookup}
                className="btnRegular flex w-full items-center justify-center gap-1 rounded-xl px-8 py-3 font-medium text-white shadow-md transition disabled:opacity-70 sm:w-auto"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  "Run Lookup"
                )}
              </button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Your IP is fetched automatically on load. Enter another IPv4 or IPv6 address to
              look up location, ISP, and timezone data.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="mb-5 text-lg font-bold text-slate-800">Lookup results</h2>

            {error ? (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            ) : null}

            {loading && !data ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <svg className="mb-4 h-8 w-8 animate-spin text-sky-600" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-sm text-slate-500">Resolving IP data…</p>
              </div>
            ) : null}

            {!loading && !data && !error ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <Code2 className="mb-4 h-10 w-10 text-sky-600" />
                <h3 className="mb-2 text-lg font-bold text-slate-800">Awaiting lookup</h3>
                <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                  Enter an IP address and run lookup, or wait for your current IP to load.
                </p>
              </div>
            ) : null}

            {data ? (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-slate-900">
                      Network Intelligence
                    </h3>
                    <p className="text-xs text-slate-400">Realtime diagnostics payload info</p>
                  </div>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                      copied
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {copied ? "✅ JSON Copied!" : "📋 Copy Raw JSON"}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 md:col-span-2">
                    <span className="mb-1 block text-xs font-bold tracking-wider text-slate-400">
                      TARGET IP IPV4/6
                    </span>
                    <span className="select-all font-mono text-xl font-bold text-blue-600">
                      {data.ip}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="mb-1 block text-xs font-bold tracking-wider text-slate-400">
                      COUNTRY / REGION
                    </span>
                    <span className="text-base font-bold text-slate-800">
                      {data.country_name} {data.country_code ? `(${data.country_code})` : ""}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="mb-1 block text-xs font-bold tracking-wider text-slate-400">
                      REGION / STATE
                    </span>
                    <span className="text-base font-bold text-slate-800">
                      {data.region || "Not Found"}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="mb-1 block text-xs font-bold tracking-wider text-slate-400">
                      CITY / POSTAL CODE
                    </span>
                    <span className="text-base font-bold text-slate-800">
                      {data.city || "N/A"} {data.postal ? `[${data.postal}]` : ""}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="mb-1 block text-xs font-bold tracking-wider text-slate-400">
                      CARRIER NETWORK / ISP
                    </span>
                    <span className="text-base font-bold text-slate-800">
                      {data.org || "Autonomous System Private Metadata"}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="mb-1 block text-xs font-bold tracking-wider text-slate-400">
                      AUTONOMOUS SYSTEM (ASN)
                    </span>
                    <span className="font-mono text-base font-bold text-slate-700">
                      {data.asn || "N/A"}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="mb-1 block text-xs font-bold tracking-wider text-slate-400">
                      LOCAL TIMEZONE
                    </span>
                    <span className="text-base font-bold text-slate-800">
                      {data.timezone || "N/A"}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="mb-1 block text-xs font-bold tracking-wider text-slate-400">
                      REGIONAL CURRENCY
                    </span>
                    <span className="text-base font-bold text-slate-800">
                      {data.currency || "N/A"}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="mb-1 block text-xs font-bold tracking-wider text-slate-400">
                      COORDINATES
                    </span>
                    <span className="text-base font-semibold text-slate-700">
                      Lat: {data.latitude}, Lon: {data.longitude}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/ip-lookup" />
    </>
  );
}

export default IpLookup;
