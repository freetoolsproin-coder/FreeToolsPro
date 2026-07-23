import { useEffect, useState } from "react";
import { Monitor } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

function readMetrics() {
  return {
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    colorDepth: window.screen.colorDepth,
  };
}

const METRIC_LABELS = [
  { key: "screenWidth", label: "Screen width", unit: "px" },
  { key: "screenHeight", label: "Screen height", unit: "px" },
  { key: "availWidth", label: "Available width", unit: "px" },
  { key: "availHeight", label: "Available height", unit: "px" },
  { key: "innerWidth", label: "Window inner width", unit: "px" },
  { key: "innerHeight", label: "Window inner height", unit: "px" },
  { key: "devicePixelRatio", label: "Device pixel ratio", unit: "" },
  { key: "colorDepth", label: "Color depth", unit: "bit" },
];

export default function ScreenResolutionDetector() {
  const [metrics, setMetrics] = useState(() =>
    typeof window !== "undefined" ? readMetrics() : null
  );

  useEffect(() => {
    const update = () => setMetrics(readMetrics());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <>
      <Seo page="screenResolutionDetector" />

      <ToolHeroShell
        icon={Monitor}
        title="Screen Resolution Detector"
        subtitle="View your screen dimensions, available viewport, device pixel ratio, and color depth. Updates on resize."
        category="developer-tools"
        layout="stack"
        formLabel="Live metrics"
        formHint="Resize the window to refresh values"
      >
        {metrics ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {METRIC_LABELS.map(({ key, label, unit }) => (
              <div
                key={key}
                className="rounded-[14px] border border-[var(--ftp-line)] bg-white px-4 py-3"
              >
                <p className="text-sm text-[var(--ftp-ink-soft)]">{label}</p>
                <p className="age-display mt-1 text-2xl font-semibold text-[var(--ftp-ink)]">
                  {metrics[key]}
                  {unit ? (
                    <span className="ml-1 text-sm font-medium text-[var(--ftp-ink-soft)]">
                      {unit}
                    </span>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--ftp-ink-soft)]">Loading screen metrics...</p>
        )}

        <p className="mt-4 text-xs text-[var(--ftp-ink-soft)]">
          Screen values reflect your display. Window inner values reflect the current browser viewport and update when you resize.
        </p>
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/screen-resolution-detector"
      />
    </>
  );
}
