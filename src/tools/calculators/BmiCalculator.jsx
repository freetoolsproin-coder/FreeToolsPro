import React, { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Check,
  Copy,
  Gauge,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";

const BMI_CATEGORIES = [
  { id: "underweight", label: "Underweight", min: 0, max: 18.4, accent: "#f59e0b", tip: "Consider nutrient-dense meals and professional guidance if needed." },
  { id: "normal", label: "Healthy", min: 18.5, max: 24.9, accent: "#14b8a6", tip: "You’re in the WHO healthy range—keep balanced habits." },
  { id: "overweight", label: "Overweight", min: 25, max: 29.9, accent: "#fb923c", tip: "Small, consistent habits around movement and nutrition help most." },
  { id: "obese", label: "Obese", min: 30, max: Infinity, accent: "#f87171", tip: "BMI is a screening signal—pair it with clinical advice for decisions." },
];

const LBS_TO_KG = 0.45359237;
const INCH_TO_M = 0.0254;

const FAQS = [
  {
    q: "Is this BMI Calculator free?",
    a: "Yes. Calculate as often as you like—no account, watermark, or paywall.",
  },
  {
    q: "Is BMI accurate?",
    a: "BMI is a widely used adult screening tool. It does not measure body fat or muscle mass directly, so athletes may read higher while remaining healthy.",
  },
  {
    q: "Can I use metric and imperial units?",
    a: "Yes. Switch between cm/kg and ft/in/lbs anytime. Results update instantly.",
  },
  {
    q: "Does the tool store my height or weight?",
    a: "No. Everything runs locally in your browser. Nothing is uploaded or saved on our servers.",
  },
  {
    q: "Can children use this calculator?",
    a: "This tool is intended for adults. Children and teens need age- and sex-specific percentile charts.",
  },
];

function classifyBmi(value) {
  return BMI_CATEGORIES.find((c) => value >= c.min && value <= c.max) || BMI_CATEGORIES[3];
}

function spectrumPosition(bmi) {
  // Map BMI onto a 0–100 visual scale across the four bands
  if (bmi <= 18.5) return Math.max(2, (bmi / 18.5) * 25);
  if (bmi <= 24.9) return 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 30;
  if (bmi <= 29.9) return 55 + ((bmi - 25) / (29.9 - 25)) * 20;
  return Math.min(98, 75 + ((bmi - 30) / 15) * 25);
}

function computeBmi({ unitSystem, heightCm, heightFt, heightIn, weight }) {
  const weightNum = Number(weight);
  let heightM = 0;

  if (unitSystem === "metric") {
    heightM = Number(heightCm) / 100;
  } else {
    const totalInches = Number(heightFt) * 12 + Number(heightIn || 0);
    heightM = totalInches * INCH_TO_M;
  }

  if (!heightM && !weightNum) return null;
  if (!heightM || !weightNum) {
    return { error: "Enter both height and weight to continue." };
  }
  if (heightM <= 0 || weightNum <= 0) {
    return { error: "Height and weight must be greater than zero." };
  }

  const weightKg = unitSystem === "metric" ? weightNum : weightNum * LBS_TO_KG;
  const value = Number((weightKg / heightM ** 2).toFixed(1));
  const category = classifyBmi(value);

  const minKg = BMI_CATEGORIES[1].min * heightM ** 2;
  const maxKg = BMI_CATEGORIES[1].max * heightM ** 2;

  const ideal =
    unitSystem === "metric"
      ? { min: `${minKg.toFixed(1)} kg`, max: `${maxKg.toFixed(1)} kg` }
      : {
          min: `${Math.round(minKg / LBS_TO_KG)} lbs`,
          max: `${Math.round(maxKg / LBS_TO_KG)} lbs`,
        };

  return {
    error: null,
    value,
    category,
    ideal,
    position: spectrumPosition(value),
    heightM,
    weightKg,
  };
}

export default function BmiCalculator() {
  const [unitSystem, setUnitSystem] = useState("metric");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  const result = useMemo(
    () => computeBmi({ unitSystem, heightCm, heightFt, heightIn, weight }),
    [unitSystem, heightCm, heightFt, heightIn, weight]
  );

  const showResult = Boolean(result && !result.error);
  const hasInput = Boolean(heightCm || heightFt || heightIn || weight);

  const switchUnits = (next) => {
    setUnitSystem(next);
    setHeightCm("");
    setHeightFt("");
    setHeightIn("");
    setWeight("");
    setCopied(false);
  };

  const reset = () => {
    setHeightCm("");
    setHeightFt("");
    setHeightIn("");
    setWeight("");
    setCopied(false);
  };

  const copyResult = async () => {
    if (!showResult) return;
    const text = `My BMI is ${result.value} (${result.category.label}). Healthy range for my height: ${result.ideal.min} – ${result.ideal.max}. Calculated with FreeToolsPro.`;
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
    const text = `My BMI is ${result.value} — ${result.category.label}. Check yours on FreeToolsPro.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My BMI", text, url: window.location.href });
        return;
      } catch {
        /* cancelled */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Seo page="bmiCalculator" />

      <div className="relative">
        {/* Hero · one composition */}
        <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[0.4fr_0.6fr] lg:gap-12">
            <div className="age-rise max-w-xl">
              <h1 className="age-display text-[clamp(1.85rem,4.2vw,3rem)] font-semibold leading-[1.1] text-[var(--age-ink)]">
                Know your BMI—in one glance.
              </h1>
              <p className="mt-4 max-w-md text-[1.05rem] leading-7 text-[var(--age-ink-soft)]">
                Instant WHO classification, healthy weight band, and private local math—no signup.
              </p>

              <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-[var(--age-ink-soft)]">
                <li className="inline-flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-[var(--age-teal)]" aria-hidden="true" />
                  Instant
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--age-teal)]" aria-hidden="true" />
                  Private by design
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Gauge className="h-3.5 w-3.5 text-[var(--age-teal)]" aria-hidden="true" />
                  Metric &amp; imperial
                </li>
              </ul>
            </div>

            <div
              className="age-rise age-rise-delay-2 rounded-[1.35rem] border border-[var(--age-line)] bg-[var(--age-surface)] p-5 shadow-[0_24px_80px_rgba(7,16,31,0.08)] backdrop-blur-xl sm:p-7"
              role="form"
              aria-label="BMI calculator"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--age-ink)] text-white">
                  <Activity className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--age-ink)]">Calculate BMI</p>
                  <p className="text-xs text-[var(--age-ink-soft)]">Results update as you type</p>
                </div>
              </div>

              <div className="mt-5 flex gap-1 rounded-[14px] border border-[var(--age-line)] bg-white/60 p-1">
                {[
                  { id: "metric", label: "Metric · cm / kg" },
                  { id: "imperial", label: "Imperial · ft / lbs" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => switchUnits(opt.id)}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
                      unitSystem === opt.id
                        ? "bg-[var(--age-ink)] text-white shadow-sm"
                        : "text-[var(--age-ink-soft)] hover:text-[var(--age-ink)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="bmi-height" className="mb-1.5 block text-sm font-medium text-[var(--age-ink-soft)]">
                    Height
                  </label>
                  {unitSystem === "metric" ? (
                    <div className="relative">
                      <input
                        id="bmi-height"
                        type="number"
                        inputMode="decimal"
                        min="1"
                        placeholder="e.g. 170"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        className="age-input pr-12"
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--age-ink-soft)]">
                        cm
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <input
                          id="bmi-height"
                          type="number"
                          inputMode="numeric"
                          min="1"
                          placeholder="Feet"
                          value={heightFt}
                          onChange={(e) => setHeightFt(e.target.value)}
                          className="age-input pr-10"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--age-ink-soft)]">
                          ft
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          max="11"
                          placeholder="Inches"
                          value={heightIn}
                          onChange={(e) => setHeightIn(e.target.value)}
                          className="age-input pr-10"
                          aria-label="Height inches"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--age-ink-soft)]">
                          in
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="bmi-weight" className="mb-1.5 block text-sm font-medium text-[var(--age-ink-soft)]">
                    Weight
                  </label>
                  <div className="relative">
                    <input
                      id="bmi-weight"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      placeholder={unitSystem === "metric" ? "e.g. 68" : "e.g. 150"}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="age-input pr-12"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--age-ink-soft)]">
                      {unitSystem === "metric" ? "kg" : "lbs"}
                    </span>
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
                    const el = document.getElementById("bmi-results");
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

        {/* Results */}
        <section
          id="bmi-results"
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
                  Your BMI appears here
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--age-ink-soft)]">
                  Enter height and weight to unlock classification, spectrum position, and a healthy
                  weight band.
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
                <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="p-6 sm:p-9 lg:p-10">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                      <span className="age-live-dot" aria-hidden="true" />
                      Body mass index
                    </div>

                    <div className="age-display mt-4 flex flex-wrap items-end gap-3">
                      <span
                        className="text-[clamp(3.5rem,10vw,5rem)] font-semibold leading-none tracking-tight"
                        style={{ color: result.category.accent }}
                      >
                        {result.value}
                      </span>
                      <span className="mb-2 text-lg font-medium text-white/45">BMI</span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-white/65">
                      Classified as{" "}
                      <span className="font-semibold text-white">{result.category.label}</span>
                      {" · "}
                      {result.category.tip}
                    </p>

                    <div className="mt-8">
                      <div className="mb-2 flex justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35 sm:text-xs">
                        <span>Under</span>
                        <span>Healthy</span>
                        <span>Over</span>
                        <span>Obese</span>
                      </div>
                      <div className="relative h-2.5 overflow-hidden rounded-full bg-white/10">
                        <div className="absolute inset-0 flex">
                          <div className="h-full w-[25%] bg-amber-400/80" />
                          <div className="h-full w-[30%] bg-teal-400/90" />
                          <div className="h-full w-[20%] bg-orange-400/80" />
                          <div className="h-full w-[25%] bg-red-400/80" />
                        </div>
                        <motion.div
                          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--age-ink)] shadow-lg"
                          style={{ left: `calc(${result.position}% - 8px)` }}
                          initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.35 }}
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-2 text-xs text-white/40">
                        Marker shows where {result.value} sits on the WHO spectrum
                      </p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={copyResult}
                        className="age-btn-primary bg-white text-[var(--age-ink)] hover:bg-teal-50"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-teal-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
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
                      Healthy weight band
                    </p>
                    <p className="age-display mt-3 text-3xl font-semibold tracking-tight text-teal-300 sm:text-4xl">
                      {result.ideal.min}
                      <span className="mx-2 text-lg font-medium text-white/35">–</span>
                      {result.ideal.max}
                    </p>
                    <p className="mt-3 text-sm text-white/55">
                      For your height, this is the statistically healthy BMI weight range (18.5–24.9).
                    </p>

                    <div className="mt-8 space-y-3 text-sm text-white/60">
                      <div className="flex justify-between border-b border-white/10 pb-3">
                        <span>Height used</span>
                        <span className="font-semibold tabular-nums text-white">
                          {(result.heightM * 100).toFixed(0)} cm
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-3">
                        <span>Weight used</span>
                        <span className="font-semibold tabular-nums text-white">
                          {result.weightKg.toFixed(1)} kg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Privacy</span>
                        <span className="inline-flex items-center gap-1.5 font-medium text-teal-300">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Local only
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <ToolContentLayout
          category="calculators"
          currentToolPath="/calculators/bmi-calculator"
          howBody="FreeToolsPro BMI Calculator converts height and weight into Body Mass Index, then maps you onto standard adult ranges. Use it for fitness check-ins, lifestyle tracking, or a quick health screen—always privately in the browser."
          steps={[
            {
              title: "Pick your units",
              body: "Switch metric or imperial. Inputs clear when you change systems so values stay consistent.",
            },
            {
              title: "Enter height & weight",
              body: "Results update live—BMI score, category, spectrum marker, and healthy weight band.",
            },
            {
              title: "Copy or share",
              body: "One tap copies a clean summary, or share via the system sheet / WhatsApp.",
            },
          ]}
          faqs={FAQS}
          examplePairs={[
            {
              input: "Height: 170 cm\nWeight: 68 kg",
              result: "BMI: 23.5 (Healthy range)\nHealthy weight band: ~53–72 kg at this height",
            },
          ]}
          privacyStatement="Height and weight values are processed only in your browser. FreeToolsPro does not upload or store body metrics on its servers for this calculator."
          limitations={[
            "BMI is an adult screening tool—it does not measure body fat or muscle directly.",
            "Not intended for children or teens who need percentile charts.",
            "Athletes and very muscular adults may read higher while remaining healthy.",
          ]}
          trustBullets={[
            "Runs locally—inputs never leave the device",
            "No signup wall between you and the answer",
            "Responsive, keyboard-friendly, clear contrast",
          ]}
          ctaLabel="Calculate now"
        />
      </div>
    </>
  );
}
