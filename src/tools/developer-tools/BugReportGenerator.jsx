import { useMemo, useState } from "react";
import { Bug, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark, inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function BugReportGenerator() {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState("");
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");
  const [environment, setEnvironment] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!title.trim() && !steps.trim()) return "";
    return [
      `# Bug: ${title.trim() || "Untitled"}`,
      "",
      `**Severity:** ${severity}`,
      "",
      "## Steps to reproduce",
      steps.trim() || "_Add numbered steps._",
      "",
      "## Expected",
      expected.trim() || "_What should happen._",
      "",
      "## Actual",
      actual.trim() || "_What actually happened._",
      "",
      "## Environment",
      environment.trim() || "_Browser, OS, app version, etc._",
      "",
      "## Notes",
      "- Attach screenshots or logs if available.",
    ].join("\n");
  }, [title, steps, expected, actual, environment, severity]);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="bugReportGenerator" />
      <ToolHeroShell
        icon={Bug}
        title="Bug Report Generator"
        subtitle="Fill in the form and generate a clear Markdown bug report for GitHub, Jira, or Linear."
        category="developer-tools"
        layout="stack"
        formLabel="Build report"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="bug-title">
              Title
            </label>
            <input
              id="bug-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Checkout button does nothing on mobile"
              className={inputDark}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="severity">
              Severity
            </label>
            <select
              id="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className={selectDark}
            >
              {["Critical", "High", "Medium", "Low"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="env">
              Environment
            </label>
            <input
              id="env"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              placeholder="Chrome 126 / Windows 11 / staging"
              className={inputDark}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="steps">
              Steps to reproduce
            </label>
            <textarea
              id="steps"
              rows={4}
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder={"1. Open checkout\n2. Tap Pay\n3. Observe"}
              className={textareaDark}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="expected">
              Expected
            </label>
            <textarea
              id="expected"
              rows={3}
              value={expected}
              onChange={(e) => setExpected(e.target.value)}
              className={textareaDark}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="actual">
              Actual
            </label>
            <textarea
              id="actual"
              rows={3}
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              className={textareaDark}
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="bug-out">
              Markdown report
            </label>
            <button type="button" onClick={copy} disabled={!output} className="age-btn-ghost px-3 py-1.5 text-xs">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            id="bug-out"
            readOnly
            rows={12}
            value={output}
            placeholder="Report preview…"
            className={textareaDark}
          />
        </div>
      </ToolHeroShell>
      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/bug-report-generator"
        faqs={[
          { q: "Is this Bug Report Generator free?", a: "Yes—create unlimited Markdown reports." },
          {
            q: "Where can I paste the output?",
            a: "GitHub Issues, GitLab, Jira, Linear, Azure DevOps, or any Markdown-friendly tracker.",
          },
          {
            q: "Is my report stored?",
            a: "No. Everything stays in your browser until you copy it.",
          },
        ]}
      />
    </>
  );
}
