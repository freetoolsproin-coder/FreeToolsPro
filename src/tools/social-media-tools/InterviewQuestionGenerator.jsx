import { useMemo, useState } from "react";
import { MessagesSquare, Copy, Check, RefreshCw } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const labelClass = "mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]";

const QUESTION_BANKS = {
  technical: [
    "Walk me through how you would design a scalable API for {role}.",
    "Explain a challenging bug you fixed in production and how you diagnosed it.",
    "How do you approach code reviews for {role} projects?",
    "Describe your testing strategy from unit tests to CI.",
    "What trade-offs would you consider when choosing a database for {role}?",
    "How do you handle performance bottlenecks under load?",
    "Explain a system you built end-to-end and the key design decisions.",
    "How do you stay current with tools and practices for {role}?",
    "Describe a time you refactored legacy code without breaking users.",
    "How would you secure sensitive data in a {role} application?",
    "What monitoring and alerting would you add on day one?",
    "How do you document architecture for teammates?",
  ],
  behavioral: [
    "Tell me about a time you missed a deadline. What happened and what changed?",
    "Describe a conflict with a teammate and how you resolved it.",
    "Share an example of leading without formal authority.",
    "When did you receive tough feedback and how did you act on it?",
    "Tell me about a project you are most proud of as a {role}.",
    "Describe a situation where you had to influence stakeholders.",
    "How do you prioritize when everything feels urgent?",
    "Give an example of adapting to a major scope change.",
    "Tell me about a mistake you owned and corrected.",
    "Describe how you onboarded into a new team quickly.",
    "When have you advocated for the user over short-term wins?",
    "Share a time you improved a team process.",
  ],
  product: [
    "How would you define success metrics for a {role} initiative?",
    "Walk me through prioritizing a backlog with limited engineering time.",
    "Describe how you validated a feature before full build.",
    "How do you gather and synthesize user feedback?",
    "Tell me about a launch that underperformed and what you learned.",
    "How would you write a PRD for a new {role} workflow?",
    "Explain how you balance stakeholder requests with user needs.",
    "Describe a roadmap trade-off you made and the reasoning.",
    "How do you partner with design and engineering on discovery?",
    "What signals would tell you to sunset a feature?",
    "How do you communicate roadmap changes to leadership?",
    "Describe an experiment you ran and how you interpreted results.",
  ],
  hr: [
    "Why are you interested in this {role} position?",
    "What motivates you at work day to day?",
    "Where do you see yourself growing in the next two years?",
    "Describe your ideal team culture.",
    "What salary range are you targeting for this {role} role?",
    "Why are you leaving your current role?",
    "What work environment helps you do your best work?",
    "How do you handle stress during busy periods?",
    "What questions do you have for us about the team?",
    "Describe a manager who helped you succeed.",
    "What non-negotiables do you have in your next role?",
    "How do your values align with working as a {role}?",
  ],
};

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function fillRole(text, role) {
  const label = role.trim() || "this role";
  return text.replace(/\{role\}/g, label);
}

export default function InterviewQuestionGenerator() {
  const [role, setRole] = useState("");
  const [type, setType] = useState("technical");
  const [count, setCount] = useState(5);
  const [shuffle, setShuffle] = useState(true);
  const [output, setOutput] = useState([]);
  const [copied, setCopied] = useState(false);

  const outputText = useMemo(
    () => output.map((q, i) => `${i + 1}. ${q}`).join("\n"),
    [output]
  );

  const generate = () => {
    const bank = QUESTION_BANKS[type] || QUESTION_BANKS.technical;
    const pool = shuffle ? shuffleArray(bank) : [...bank];
    const picked = pool.slice(0, Math.min(count, pool.length)).map((q) => fillRole(q, role));
    setOutput(picked);
  };

  const copyOutput = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="interviewQuestionGenerator" />

      <ToolHeroShell
        category="social-media-tools"
        icon={MessagesSquare}
        title="Interview Question Generator"
        subtitle="Generate role-specific interview questions from built-in banks."
        formLabel="Configure"
        layout="stack"
      >
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4 rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)]/50 p-5">
            <div>
              <label className={labelClass} htmlFor="iq-role">
                Role or job title
              </label>
              <input
                id="iq-role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className={inputDark}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="iq-type">
                  Question type
                </label>
                <select
                  id="iq-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={selectDark}
                >
                  <option value="technical">Technical</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="product">Product</option>
                  <option value="hr">HR / General</option>
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="iq-count">
                  Number of questions
                </label>
                <select
                  id="iq-count"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className={selectDark}
                >
                  {[3, 5, 7, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} questions
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--ftp-ink)]">
              <input
                type="checkbox"
                checked={shuffle}
                onChange={(e) => setShuffle(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--ftp-line)] accent-[var(--ftp-teal)]"
              />
              Shuffle question order
            </label>

            <button type="button" onClick={generate} className="age-btn-primary w-full sm:w-auto">
              <RefreshCw className="h-4 w-4" />
              Generate questions
            </button>
          </div>

          <div className="rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)]/50 p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-[var(--ftp-ink)]">Output</h2>
              {output.length > 0 && (
                <button type="button" onClick={copyOutput} className="age-btn-ghost px-3 py-2 text-sm">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            {output.length > 0 ? (
              <ol className="space-y-3">
                {output.map((q, i) => (
                  <li
                    key={`${type}-${i}-${q.slice(0, 24)}`}
                    className="rounded-xl border border-[var(--ftp-line)] bg-white p-3 text-sm text-[var(--ftp-ink)]"
                  >
                    <span className="mr-2 font-semibold text-[var(--ftp-teal)]">{i + 1}.</span>
                    {q}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-[var(--ftp-ink-soft)]">
                Choose a type and click Generate to see interview questions here.
              </p>
            )}
          </div>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="social-media-tools"
        currentToolPath="/social-media-tools/interview-question-generator"
      />
    </>
  );
}
