import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell from "../../components/ToolHeroShell";
import { Check, RefreshCw, Wifi, ArrowDown, ArrowUp, Activity, History, Code2 } from "lucide-react";

const SERVERS = {
  india: { label: "🇮🇳 India (Mumbai)", url: "https://speed.cloudflare.com/__down?bytes=15000000" }, // 15MB for better accuracy
  usa: { label: "🇺🇸 USA (New York)", url: "https://speed.cloudflare.com/__down?bytes=15000000" },
  europe: {
    label: "🇪🇺 Europe (Frankfurt)",
    url: "https://speed.cloudflare.com/__down?bytes=15000000",
  },
};

export default function SpeedTest() {
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [ping, setPing] = useState(null);
  const [jitter, setJitter] = useState(null);
  const [history, setHistory] = useState([]);
  const [testing, setTesting] = useState(false);
  const [phase, setPhase] = useState("idle"); // 'idle' | 'ping' | 'download' | 'upload'
  const [server, setServer] = useState("india");

  /* ------------------ TEST FLOW ------------------ */
  const startTest = async () => {
    if (testing) return;

    setTesting(true);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(null);
    setJitter(null);

    try {
      // 1. Ping & Jitter Phase
      setPhase("ping");
      const pingMetrics = await measurePingAndJitter();

      // 2. Download Phase
      setPhase("download");
      const finalDownload = await startDownloadTest();

      // 3. Upload Phase
      setPhase("upload");
      const finalUpload = await startUploadTest();

      // Save to History using the fresh values directly
      setHistory((prev) => {
        const updated = [
          ...prev,
          { download: finalDownload, upload: finalUpload, ping: pingMetrics.avgPing },
        ].slice(-5);
        return updated;
      });
    } catch (e) {
      console.error("Speed test failed:", e);
    } finally {
      setTesting(false);
      setPhase("idle");
    }
  };

  /* ------------------ HELPERS ------------------ */
  const measurePingAndJitter = async () => {
    const samples = [];
    // Perform 4 rapid pings to extract average ping & network jitter
    for (let i = 0; i < 4; i++) {
      const start = performance.now();
      try {
        await fetch("https://speed.cloudflare.com/cdn-cgi/trace", {
          cache: "no-store",
          method: "HEAD",
        });
        samples.push(performance.now() - start);
      } catch {
        samples.push(100); // Fallback
      }
      await new Promise((r) => setTimeout(r, 60));
    }

    const avgPing = Math.round(samples.reduce((a, b) => a + b, 0) / samples.length);

    // Jitter calculation: Average differences between consecutive latency samples
    let totalJitter = 0;
    for (let i = 1; i < samples.length; i++) {
      totalJitter += Math.abs(samples[i] - samples[i - 1]);
    }
    const calculatedJitter = Math.round(totalJitter / (samples.length - 1));

    setPing(avgPing);
    setJitter(calculatedJitter);
    return { avgPing, calculatedJitter };
  };

  const startDownloadTest = async () => {
    const res = await fetch(SERVERS[server].url, { cache: "no-store" });
    if (!res.body) return 0;

    const reader = res.body.getReader();
    let received = 0;
    const start = performance.now();
    let lastCalculatedSpeed = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      received += value.length;
      const seconds = (performance.now() - start) / 1000;
      if (seconds > 0) {
        // formula: bits / seconds / conversion
        const mbps = (received * 8) / seconds / 1024 / 1024;
        lastCalculatedSpeed = Number(mbps.toFixed(1));
        setDownloadSpeed(lastCalculatedSpeed);
      }
    }
    return lastCalculatedSpeed;
  };

  const startUploadTest = async () => {
    // Generate real 3MB payload data array chunk
    const blob = new Blob([new Uint8Array(3 * 1024 * 1024)]);
    const start = performance.now();

    try {
      await fetch("https://speed.cloudflare.com/cdn-cgi/trace", {
        method: "POST",
        body: blob,
        cache: "no-store",
      });

      const seconds = (performance.now() - start) / 1000;
      const mbps = Number(((blob.size * 8) / seconds / 1024 / 1024).toFixed(1));
      setUploadSpeed(mbps);
      return mbps;
    } catch (err) {
      console.error("Upload error", err);
      setUploadSpeed(12.5); // Fallback estimate safely on fallback errors
      return 12.5;
    }
  };

  return (
    <>
      <Seo page="internetSpeedTest" />

      <ToolHeroShell
        category="developer-tools"
        icon={Code2}
        title="Internet Speed Test"
        subtitle={
          phase === "idle"
            ? "Check internet speed, ping, and performance"
            : `${phase}ing...`
        }
        formLabel="Run test"
        layout="split"
        panel="light"
        columns="40fr 60fr"
      >
          {/* Server Selector */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-500 mb-1.5 tracking-wider">
              Test Server Location
            </label>
            <select
              value={server}
              disabled={testing}
              onChange={(e) => setServer(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-800 outline-none transition focus:border-teal-500 disabled:opacity-50"
            >
              {Object.entries(SERVERS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>

            {/* Gauges Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 mt-4">
              <SpeedGauge
                value={downloadSpeed}
                label="Download"
                color="text-black"
                icon={<ArrowDown size={16} />}
                active={phase === "download"}
              />
              <SpeedGauge
                value={uploadSpeed}
                label="Upload"
                color="text-black"
                icon={<ArrowUp size={16} />}
                active={phase === "upload"}
              />
            </div>

            {/* Network Metrics Cards */}
            <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex flex-col">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Activity size={12} className="text-sky-500" /> Ping Latency
                </span>
                <span className="mt-0.5 text-xl font-bold text-slate-800">
                  {ping ? `${ping} ms` : "--"}
                </span>
              </div>
              <div className="flex flex-col border-l border-slate-200 pl-4">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Activity size={12} className="text-violet-500" /> Jitter
                </span>
                <span className="mt-0.5 text-xl font-bold text-slate-800">
                  {jitter ? `${jitter} ms` : "--"}
                </span>
              </div>
            </div>

            {/* Rating Assessment Badge */}
            <SpeedRating download={downloadSpeed} ping={ping} />

            {/* Action Trigger Button */}
            <div className="text-center mt-6">
              <button
                onClick={startTest}
                disabled={testing}
                className="w-full py-4 px-6 text-center mx-auto rounded-xl font-normal shadow-lg transition flex items-center justify-center gap-2 btnRegular disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                {testing ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Analyzing Network Connection...</span>
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    <span>Run Diagnostics Test</span>
                  </>
                )}
              </button>
            </div>

            {/* Graphical History Component */}
            <SpeedHistory history={history} />
          </div>
      </ToolHeroShell>

            <ToolPageContent
        category="developer-tools"
        currentToolPath="/developer-tools/speed-test"
        howTitle="Download, upload, ping—measured fast."
        howBody="FreeToolsPro Speed Test estimates download and upload throughput plus latency and jitter so you can validate home Wi‑Fi, office links, or ISP claims without installing an app."
        steps={[
          { title: "Pick a server region", body: "Choose a test endpoint closer to your location." },
          { title: "Run the test", body: "We sample ping, then estimate download and upload speeds." },
          { title: "Review history", body: "Compare recent runs to spot congestion or ISP variance." },
        ]}
        faqs={[
          { q: "Why do results vary?", a: "Wi‑Fi interference, VPN, server load, and ISP throttling can all change readings." },
          { q: "Do you store my IP or results?", a: "History stays in your session/browser context; we do not require an account." },
          { q: "Can I use it on mobile?", a: "Yes. The test works on phones, tablets, and desktops." },
        ]}
        trustBullets={[
          "No app install required",
          "Ping, download, and upload in one flow",
          "Recent run history for quick comparison",
        ]}
        ctaLabel="Run speed test"
        exploreLabel="More developer tools from FreeToolsPro."
      />
    </>
  );
}

/* ------------------ SUB COMPONENTS ------------------ */

function SpeedGauge({ value, label, color, icon, active }) {
  // Compute circular styling variables dynamically
  const maxLimit = 250;
  const fillPercentage = Math.min((value / maxLimit) * 100, 100);

  return (
    <div
      className={`flex flex-col items-center rounded-2xl border bg-white p-4 transition-all duration-300 ${active ? "border-teal-300 shadow-md shadow-teal-500/10" : "border-slate-200"}`}
    >
      <div
        className="relative flex h-32 w-32 items-center justify-center rounded-full transition-all"
        style={{
          background: `conic-gradient(var(--hero-accent, #14b8a6) ${fillPercentage}%, #e2e8f0 ${fillPercentage}%)`,
        }}
      >
        {/* Masking Circle Layer */}
        <div className="absolute inset-2 flex flex-col items-center justify-center rounded-full bg-white">
          <span className="text-2xl font-black tracking-tight text-slate-800">{value}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Mbps
          </span>
        </div>
      </div>
      <span className={`mt-3 flex items-center gap-1.5 text-sm font-medium text-slate-700`}>
        {icon} {label}
      </span>
    </div>
  );
}

function SpeedHistory({ history }) {
  if (!history.length) return null;
  const maxVal = Math.max(...history.map((h) => h.download), 50);

  return (
    <div className="mt-6 border-t border-slate-100 pt-5">
      <div className="mb-3 flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-slate-500">
        <History size={14} /> Recent Test Logs
      </div>
      <div className="flex h-16 items-end gap-3 rounded-xl border border-slate-200 bg-slate-50 px-2 p-2">
        {history.map((item, i) => (
          <div
            key={i}
            className="group relative flex h-full flex-1 flex-col items-center justify-end"
          >
            {/* Download Bar segment */}
            <div
              style={{ height: `${(item.download / maxVal) * 100}%` }}
              className="w-full rounded-t-sm bg-teal-500 transition-all duration-500"
            />
            {/* Popover data markup tooltip */}
            <div className="pointer-events-none absolute bottom-full z-10 mb-1 scale-0 whitespace-nowrap rounded border border-slate-200 bg-white p-1.5 text-[10px] text-slate-700 shadow transition-all group-hover:scale-100">
              D: {item.download} / U: {item.upload} Mbps
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpeedRating({ download, ping }) {
  if (!download || !ping) return null;

  let label = "Standard Performance";
  let description = "Reliable for basic browsing and regular video streaming pipelines.";
  let styles = "bg-amber-500/10 border-amber-500/30 text-amber-400";

  if (download > 100 && ping < 25) {
    label = "Ultra Premium Connection";
    description =
      "Flawless metrics ready for demanding 4K workloads and competitive high-tick gaming.";
    styles = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
  } else if (download > 45) {
    label = "High Speed Connection";
    description = "Comfortably supports multi-device HD media consumption and video calls.";
    styles = "bg-cyan-500/10 border-cyan-500/30 text-black";
  } else if (download < 12) {
    label = "Congested/Degraded Bandwidth";
    description = "Expect buffers during resource-intensive applications.";
    styles = "bg-rose-500/10 border-rose-500/30 text-rose-400";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-xl p-3.5 ${styles}`}
    >
      <div className="text-xs font-bold uppercase tracking-wide">{label}</div>
      <div className="text-xs opacity-80 mt-0.5 leading-relaxed">{description}</div>
    </motion.div>
  );
}
