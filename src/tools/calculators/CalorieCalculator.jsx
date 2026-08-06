import React, { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Apple,
  ArrowRight,
  Check,
  Copy,
  Flame,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import { getCategoryTheme } from "../../data/categoryThemes";

const ACTIVITY_OPTIONS = [
  { value: "1.2", label: "Sedentary", hint: "Little or no exercise" },
  { value: "1.375", label: "Lightly active", hint: "1–3 days / week" },
  { value: "1.55", label: "Moderately active", hint: "3–5 days / week" },
  { value: "1.725", label: "Very active", hint: "6–7 days / week" },
  { value: "1.9", label: "Extra active", hint: "Physical job or 2× training" },
];

const GOAL_META = {
  lose: { label: "Fat loss", delta: -500, accent: "#fb923c" },
  maintain: { label: "Maintain", delta: 0, accent: "#14b8a6" },
  gain: { label: "Muscle gain", delta: 500, accent: "#38bdf8" },
};

const FAQS = [
  {
    q: "Is this Calorie Calculator free?",
    a: "Yes. Estimate TDEE and macros as often as you like—no account or paywall.",
  },
  {
    q: "What is the Mifflin-St Jeor formula?",
    a: "It’s the modern clinical standard for estimating basal metabolic rate (BMR) from age, sex, height, and weight.",
  },
  {
    q: "What’s the difference between BMR and TDEE?",
    a: "BMR is energy at rest. TDEE multiplies BMR by your activity level to estimate total daily calories burned.",
  },
  {
    q: "Are the macro splits personalized?",
    a: "Macros adjust by goal: higher protein for fat loss, higher carbs for muscle gain, balanced for maintenance.",
  },
  {
    q: "Is my data stored?",
    a: "No. All math runs in your browser. Nothing is uploaded or saved on our servers.",
  },
];

function computeCalories({ age, weight, height, gender, method, activity, goal }) {
  const ageN = Number(age);
  const weightN = Number(weight);
  const heightN = Number(height);

  if (!age && !weight && !height) return null;
  if (!ageN || !weightN || !heightN) {
    return { error: "Enter age, weight, and height to continue." };
  }
  if (ageN <= 0 || weightN <= 0 || heightN <= 0) {
    return { error: "Values must be greater than zero." };
  }
  if (ageN > 120 || heightN > 250 || weightN > 400) {
    return { error: "Please enter realistic body metrics." };
  }

  let bmr = 0;
  if (method === "mifflin") {
    bmr =
      gender === "male"
        ? 10 * weightN + 6.25 * heightN - 5 * ageN + 5
        : 10 * weightN + 6.25 * heightN - 5 * ageN - 161;
  } else {
    bmr =
      gender === "male"
        ? 88.362 + 13.397 * weightN + 4.799 * heightN - 5.677 * ageN
        : 447.593 + 9.247 * weightN + 3.098 * heightN - 4.33 * ageN;
  }

  const maintenance = Math.round(bmr * Number(activity));
  const goalMeta = GOAL_META[goal] || GOAL_META.maintain;
  let target = maintenance + goalMeta.delta;

  const safeFloor = gender === "male" ? 1500 : 1200;
  if (target < safeFloor) target = safeFloor;

  let proteinPct = 0.3;
  let fatPct = 0.3;
  let carbPct = 0.4;
  if (goal === "lose") {
    proteinPct = 0.4;
    fatPct = 0.25;
    carbPct = 0.35;
  } else if (goal === "gain") {
    proteinPct = 0.25;
    fatPct = 0.25;
    carbPct = 0.5;
  }

  const macros = {
    protein: Math.round((target * proteinPct) / 4),
    fat: Math.round((target * fatPct) / 9),
    carbs: Math.round((target * carbPct) / 4),
  };

  const dietHints =
    goal === "lose"
      ? [
          "Prioritize lean protein and high-volume vegetables",
          "Measure oils and calorie-dense snacks",
          "Prefer fiber-rich carbs over refined ones",
        ]
      : goal === "gain"
        ? [
            "Add calorie-dense foods like oats, rice, nut butters",
            "Keep protein steady across meals",
            "Pair surplus with progressive training",
          ]
        : [
            "Balance carbs, protein, and fats across the day",
            "Keep movement consistent with your activity tag",
            "Adjust ±100–200 kcal if weight drifts",
          ];

  return {
    error: null,
    bmr: Math.round(bmr),
    maintenance,
    target,
    macros,
    goalMeta,
    dietHints,
    formula: method === "mifflin" ? "Mifflin-St Jeor" : "Harris-Benedict",
    ring: Math.min((target / 4000) * 263, 263),
  };
}

export default function CalorieCalculator() {
  const theme = getCategoryTheme("calculators");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [method, setMethod] = useState("mifflin");
  const [activity, setActivity] = useState("1.2");
  const [goal, setGoal] = useState("maintain");
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  const result = useMemo(
    () => computeCalories({ age, weight, height, gender, method, activity, goal }),
    [age, weight, height, gender, method, activity, goal]
  );

  const showResult = Boolean(result && !result.error);
  const hasInput = Boolean(age || weight || height);

  const reset = () => {
    setAge("");
    setWeight("");
    setHeight("");
    setGender("male");
    setMethod("mifflin");
    setActivity("1.2");
    setGoal("maintain");
    setCopied(false);
  };

  const copyResult = async () => {
    if (!showResult) return;
    const text = `Daily target: ${result.target} kcal (${result.goalMeta.label}). Macros — P ${result.macros.protein}g · C ${result.macros.carbs}g · F ${result.macros.fat}g. FreeToolsPro Calorie Calculator.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const shareResult = async () => {
    if (!showResult) return;
    const text = `My daily calorie target is ${result.target} kcal for ${result.goalMeta.label}. Check yours on FreeToolsPro.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My calorie target", text, url: window.location.href });
        return;
      } catch {
        /* cancelled */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Seo page="caloriesCalculator" />

      <div className="relative">
        <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[0.4fr_0.6fr] lg:gap-12">
            <div className="age-rise max-w-xl">
              <h1 className="age-display text-[clamp(1.85rem,4.2vw,3rem)] font-semibold leading-[1.1] text-[var(--age-ink)]">
                Know your daily calories—with clarity.
              </h1>
              <p className="mt-4 max-w-md text-[1.05rem] leading-7 text-[var(--age-ink-soft)]">
                BMR, TDEE, and goal-tuned macros in seconds. Private, formula-accurate, no signup.
              </p>

              <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-[var(--age-ink-soft)]">
                <li className="inline-flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-[var(--age-teal)]" aria-hidden="true" />
                  Instant TDEE
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--age-teal)]" aria-hidden="true" />
                  Private by design
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-[var(--age-teal)]" aria-hidden="true" />
                  Goal-tuned macros
                </li>
              </ul>
            </div>

            <div
              className="age-rise age-rise-delay-2 rounded-[1.35rem] border border-[var(--age-line)] bg-[var(--age-surface)] p-5 shadow-[0_24px_80px_rgba(7,16,31,0.08)] backdrop-blur-xl sm:p-7"
              role="form"
              aria-label="Calorie calculator"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--age-ink)] text-[var(--age-teal)]">
                  <Flame className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--age-ink)]">Calculate calories</p>
                  <p className="text-xs text-[var(--age-ink-soft)]">Results update as you type</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="cal-age" className="mb-1.5 block text-sm font-medium text-[var(--age-ink-soft)]">
                    Age
                  </label>
                  <input
                    id="cal-age"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    placeholder="yrs"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="age-input"
                  />
                </div>
                <div>
                  <label htmlFor="cal-gender" className="mb-1.5 block text-sm font-medium text-[var(--age-ink-soft)]">
                    Gender
                  </label>
                  <select
                    id="cal-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="age-input"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="cal-weight" className="mb-1.5 block text-sm font-medium text-[var(--age-ink-soft)]">
                    Weight
                  </label>
                  <div className="relative">
                    <input
                      id="cal-weight"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      placeholder="e.g. 70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="age-input pr-12"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--age-ink-soft)]">
                      kg
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="cal-height" className="mb-1.5 block text-sm font-medium text-[var(--age-ink-soft)]">
                    Height
                  </label>
                  <div className="relative">
                    <input
                      id="cal-height"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      placeholder="e.g. 175"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="age-input pr-12"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--age-ink-soft)]">
                      cm
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label htmlFor="cal-activity" className="mb-1.5 block text-sm font-medium text-[var(--age-ink-soft)]">
                    Activity level
                  </label>
                  <select
                    id="cal-activity"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    className="age-input"
                  >
                    {ACTIVITY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} — {opt.hint}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="cal-method" className="mb-1.5 block text-sm font-medium text-[var(--age-ink-soft)]">
                      Formula
                    </label>
                    <select
                      id="cal-method"
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="age-input text-sm"
                    >
                      <option value="mifflin">Mifflin-St Jeor</option>
                      <option value="harris">Harris-Benedict</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cal-goal" className="mb-1.5 block text-sm font-medium text-[var(--age-ink-soft)]">
                      Goal
                    </label>
                    <select
                      id="cal-goal"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="age-input text-sm"
                    >
                      <option value="lose">Fat loss</option>
                      <option value="maintain">Maintain</option>
                      <option value="gain">Muscle gain</option>
                    </select>
                  </div>
                </div>
              </div>

              {result?.error && hasInput ? (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700"
                >
                  {result.error}
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="age-btn-primary flex-1 sm:flex-none"
                  onClick={() => {
                    const el = document.getElementById("cal-results");
                    if (showResult && el) {
                      el.scrollIntoView({
                        behavior: reduceMotion ? "auto" : "smooth",
                        block: "start",
                      });
                    }
                  }}
                >
                  View result
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" className="age-btn-ghost" onClick={reset} disabled={!hasInput}>
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          id="cal-results"
          aria-live="polite"
          className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
        >
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key="empty"
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="rounded-[1.35rem] border border-dashed border-[var(--age-line)] bg-white/40 px-6 py-14 text-center backdrop-blur-sm"
              >
                <Sparkles className="mx-auto h-7 w-7 text-[var(--age-teal)]" aria-hidden="true" />
                <p className="age-display mt-4 text-xl font-semibold text-[var(--age-ink)]">
                  Your calorie target appears here
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--age-ink-soft)]">
                  Add age, height, and weight to unlock TDEE, macros, and goal-focused tips.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-[1.5rem] border border-[var(--age-line)] bg-[var(--age-ink)] text-white shadow-[0_40px_100px_rgba(7,16,31,0.28)]"
              >
                <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="p-6 sm:p-9 lg:p-10">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                      <span className="age-live-dot" aria-hidden="true" />
                      Daily target
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-6">
                      <div className="relative flex h-28 w-28 items-center justify-center">
                        <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                          <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke="var(--age-teal)"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${result.ring} 263`}
                            initial={reduceMotion ? false : { strokeDasharray: "0 263" }}
                            animate={{ strokeDasharray: `${result.ring} 263` }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </svg>
                        <div className="z-10 text-center">
                          <span className="age-display block text-2xl font-semibold leading-none text-white">
                            {result.target}
                          </span>
                          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-white/40">
                            kcal
                          </span>
                        </div>
                      </div>

                      <div>
                        <p
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-[var(--age-ink)]"
                          style={{ background: result.goalMeta.accent }}
                        >
                          <Flame className="h-3 w-3" aria-hidden="true" />
                          {result.goalMeta.label}
                        </p>
                        <p className="age-display mt-3 text-[clamp(2rem,5vw,2.75rem)] font-semibold tracking-tight text-white">
                          {result.target.toLocaleString()}
                          <span className="ml-2 text-lg font-medium text-white/45">kcal / day</span>
                        </p>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">
                          Using {result.formula}. Maintenance TDEE is {result.maintenance.toLocaleString()} kcal
                          before your goal adjustment.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-3">
                      {[
                        { label: "Protein", value: `${result.macros.protein}g`, tone: "text-sky-300" },
                        { label: "Carbs", value: `${result.macros.carbs}g`, tone: "text-amber-300" },
                        { label: "Fat", value: `${result.macros.fat}g`, tone: "text-rose-300" },
                      ].map((m) => (
                        <div
                          key={m.label}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center"
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                            {m.label}
                          </p>
                          <p className={`mt-1 text-lg font-semibold tabular-nums ${m.tone}`}>{m.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={copyResult}
                        className="age-btn-primary bg-white text-[var(--age-ink)] hover:bg-teal-50"
                      >
                        {copied ? <Check className="h-4 w-4 text-teal-600" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy summary"}
                      </button>
                      <button
                        type="button"
                        onClick={shareResult}
                        className="age-btn-ghost border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                      >
                        <Share2 className="h-4 w-4" />
                        Share
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 bg-white/[0.04] p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                      Metabolic baseline
                    </p>
                    <p className="age-display mt-3 text-4xl font-semibold tracking-tight text-[var(--age-teal)] sm:text-5xl">
                      {result.bmr.toLocaleString()}
                      <span className="ml-2 text-lg font-medium text-white/45">BMR</span>
                    </p>
                    <p className="mt-3 text-sm text-white/55">
                      Energy at rest before activity. Focus cues for {result.goalMeta.label.toLowerCase()}:
                    </p>

                    <ul className="mt-6 space-y-3">
                      {result.dietHints.map((hint) => (
                        <li key={hint} className="flex gap-2 text-sm leading-6 text-white/65">
                          <Apple className="mt-0.5 h-4 w-4 shrink-0 text-[var(--age-teal)]" aria-hidden="true" />
                          {hint}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-white/60">
                      <span>Privacy</span>
                      <span className="inline-flex items-center gap-1.5 font-medium text-[var(--age-teal)]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Local only
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <ToolContentLayout
          category="calculators"
          currentToolPath="/calculators/calorie-calculator"
          howBody="FreeToolsPro Calorie Calculator estimates basal metabolism, scales it by activity into TDEE, then applies a safe surplus or deficit for your goal—with protein, carbs, and fat targets to match."
          steps={[
            {
              title: "Enter your metrics",
              body: "Age, sex, height, and weight feed BMR using Mifflin-St Jeor or Harris-Benedict.",
            },
            {
              title: "Set activity & goal",
              body: "Activity multiplies BMR into TDEE. Goals adjust ±500 kcal with a safe floor.",
            },
            {
              title: "Use macros & share",
              body: "Copy a clean summary or share your daily target in one tap.",
            },
          ]}
          faqs={FAQS}
          examplePairs={[
            {
              input:
                "Age: 30 · Sex: female · Height: 165 cm · Weight: 62 kg\nActivity: moderately active · Goal: maintain",
              result:
                "BMR: ~1,385 kcal · TDEE: ~2,147 kcal/day\nMacros (illustrative): 161g protein · 215g carbs · 72g fat",
            },
          ]}
          privacyStatement="Body metrics and goals are processed only in your browser. FreeToolsPro does not upload or store calorie calculator inputs on its servers."
          limitations={[
            "TDEE and macro targets are estimates—not personalized medical nutrition advice.",
            "Clinical conditions, pregnancy, and medications can change energy needs.",
            "Safe calorie floors are applied but may still be inappropriate for some individuals—consult a clinician when unsure.",
          ]}
          trustBullets={[
            "Runs locally—metrics never leave the device",
            "Clinical formulas with safe calorie floors",
            "Responsive, keyboard-friendly, clear contrast",
          ]}
          ctaLabel="Calculate now"
        />
      </div>
    </>
  );
}
