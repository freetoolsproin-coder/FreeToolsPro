import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Copy,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";

const toISODate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatLong = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatCompact = (date) =>
  date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const FAQS = [
  {
    q: "Is this Age Calculator free?",
    a: "Yes. Exact age results are free forever—no account, watermark, or paywall.",
  },
  {
    q: "Does it account for leap years?",
    a: "Yes. Month lengths and leap days are handled automatically for precise year, month, and day splits.",
  },
  {
    q: "Can I calculate age on a future or past date?",
    a: "Use the “Age as of” field to pin any reference date. Leave it blank to use today.",
  },
  {
    q: "Is my date of birth stored?",
    a: "No. Calculation runs entirely in your browser. Nothing is uploaded or saved on our servers.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes. The layout is built for phone, tablet, and desktop with full keyboard and screen-reader support.",
  },
];

function computeAge(dobStr, asOfStr) {
  if (!dobStr) return null;

  const birth = new Date(`${dobStr}T00:00:00`);
  const asOf = new Date(`${(asOfStr || toISODate(new Date()))}T00:00:00`);

  if (Number.isNaN(birth.getTime()) || Number.isNaN(asOf.getTime())) {
    return { error: "Enter a valid date to continue." };
  }
  if (birth > asOf) {
    return { error: "Date of birth must be on or before the reference date." };
  }

  let years = asOf.getFullYear() - birth.getFullYear();
  let months = asOf.getMonth() - birth.getMonth();
  let days = asOf.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = asOf.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / 86_400_000);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = Math.floor(diffMs / 3_600_000);
  const totalMinutes = Math.floor(diffMs / 60_000);
  const totalSeconds = Math.floor(diffMs / 1000);

  const nextBirthday = new Date(asOf.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday < asOf) {
    nextBirthday.setFullYear(asOf.getFullYear() + 1);
  }
  const daysToBirthday = Math.ceil((nextBirthday.getTime() - asOf.getTime()) / 86_400_000);
  const yearProgress = Math.min(100, Math.round(((365 - daysToBirthday) / 365) * 100));

  return {
    error: null,
    birth,
    asOf,
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalHours,
    totalMinutes,
    totalSeconds,
    daysToBirthday,
    yearProgress,
    bornWeekday: birth.toLocaleDateString("en-US", { weekday: "long" }),
  };
}

export default function AgeCalculator() {
  const today = toISODate(new Date());
  const [dob, setDob] = useState("");
  const [asOf, setAsOf] = useState(today);
  const [copied, setCopied] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const reduceMotion = useReducedMotion();

  const result = useMemo(() => computeAge(dob, asOf), [dob, asOf]);
  const showResult = Boolean(result && !result.error);
  const isLiveAsOf = asOf === today;

  useEffect(() => {
    if (!showResult || !isLiveAsOf) return undefined;
    const id = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(id);
  }, [showResult, isLiveAsOf, dob]);

  const liveSeconds = useMemo(() => {
    if (!result || result.error) return 0;
    if (isLiveAsOf) {
      return Math.max(0, Math.floor((nowMs - result.birth.getTime()) / 1000));
    }
    return result.totalSeconds;
  }, [result, isLiveAsOf, nowMs]);

  const copyResult = async () => {
    if (!result || result.error) return;
    const text = `My exact age: ${result.years} years, ${result.months} months, and ${result.days} days. Calculated with FreeToolsPro.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const shareResult = async () => {
    if (!result || result.error) return;
    const text = `I am exactly ${result.years}y ${result.months}m ${result.days}d old — next birthday in ${result.daysToBirthday} days.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My exact age", text, url: window.location.href });
        return;
      } catch {
        /* user cancelled */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const reset = () => {
    setDob("");
    setAsOf(today);
    setCopied(false);
  };

  return (
    <>
      <Seo page="ageCalculator" />

      <div className="relative">
        {/* Hero · brand + tool as one composition */}
        <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[0.4fr_0.6fr] lg:gap-12">
            <div className="age-rise max-w-xl">
              <h1 className="age-display text-[clamp(1.85rem,4.2vw,3rem)] font-semibold leading-[1.1] text-[var(--age-ink)]">
                Know your exact age—down to the day.
              </h1>
              <p className="mt-4 max-w-md text-[1.05rem] leading-7 text-[var(--age-ink-soft)]">
                Instant, private, leap-year accurate. Built for forms, planning, and curiosity.
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
                  <Timer className="h-3.5 w-3.5 text-[var(--age-teal)]" aria-hidden="true" />
                  Leap-year precise
                </li>
              </ul>
            </div>

            {/* Interactive surface */}
            <div
              className="age-rise age-rise-delay-2 rounded-[1.35rem] border border-[var(--age-line)] bg-[var(--age-surface)] p-5 shadow-[0_24px_80px_rgba(7,16,31,0.08)] backdrop-blur-xl sm:p-7"
              role="form"
              aria-label="Age calculator"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--age-ink)] text-white">
                  <CalendarDays className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--age-ink)]">Calculate age</p>
                  <p className="text-xs text-[var(--age-ink-soft)]">Results update as you type</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="age-dob" className="mb-1.5 block text-sm font-medium text-[var(--age-ink-soft)]">
                    Date of birth
                  </label>
                  <input
                    id="age-dob"
                    type="date"
                    value={dob}
                    max={asOf || today}
                    onChange={(e) => setDob(e.target.value)}
                    className="age-input"
                    autoComplete="bday"
                  />
                </div>

                <div>
                  <label htmlFor="age-asof" className="mb-1.5 block text-sm font-medium text-[var(--age-ink-soft)]">
                    Age as of
                  </label>
                  <input
                    id="age-asof"
                    type="date"
                    value={asOf}
                    min={dob || undefined}
                    onChange={(e) => setAsOf(e.target.value)}
                    className="age-input"
                  />
                </div>
              </div>

              {result?.error ? (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700"
                >
                  {result.error}
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" className="age-btn-primary flex-1 sm:flex-none" onClick={() => {
                  const el = document.getElementById("age-results");
                  if (dob && el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
                }}>
                  View result
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" className="age-btn-ghost" onClick={reset} disabled={!dob && asOf === today}>
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section
          id="age-results"
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
                  Your timeline appears here
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--age-ink-soft)]">
                  Choose a date of birth to unlock years, months, days, and a live lifespan counter.
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
                      Exact age
                    </div>

                    <div className="age-display mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[clamp(3rem,9vw,4.75rem)] font-semibold leading-none tracking-tight">
                      <span>
                        <span className="text-teal-300">{result.years}</span>
                        <span className="ml-1 text-[0.45em] font-medium text-white/50">y</span>
                      </span>
                      <span>
                        <span className="text-teal-300">{result.months}</span>
                        <span className="ml-1 text-[0.45em] font-medium text-white/50">m</span>
                      </span>
                      <span>
                        <span className="text-teal-300">{result.days}</span>
                        <span className="ml-1 text-[0.45em] font-medium text-white/50">d</span>
                      </span>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-white/65">
                      Born{" "}
                      <span className="font-semibold text-white">{formatLong(result.birth)}</span>
                      {" · "}
                      As of{" "}
                      <span className="font-semibold text-white">{formatCompact(result.asOf)}</span>
                    </p>

                    <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
                      {[
                        { label: "Weeks", value: result.totalWeeks.toLocaleString() },
                        { label: "Days", value: result.totalDays.toLocaleString() },
                        { label: "Hours", value: result.totalHours.toLocaleString() },
                        {
                          label: "Seconds",
                          value: liveSeconds.toLocaleString(),
                          live: true,
                        },
                      ].map((stat) => (
                        <div key={stat.label} className="age-stat border-white/10">
                          <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                            {stat.label}
                            {stat.live ? (
                              <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-teal-400 align-middle" />
                            ) : null}
                          </p>
                          <p className="mt-1.5 font-semibold tabular-nums tracking-tight text-white">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-wrap gap-2">
                      <button type="button" onClick={copyResult} className="age-btn-primary bg-white text-[var(--age-ink)] hover:bg-teal-50">
                        {copied ? <Check className="h-4 w-4 text-teal-600" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy summary"}
                      </button>
                      <button type="button" onClick={shareResult} className="age-btn-ghost border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                        <Share2 className="h-4 w-4" />
                        Share
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 bg-white/[0.04] p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                      Next birthday
                    </p>
                    <p className="age-display mt-3 text-5xl font-semibold tracking-tight text-teal-300 sm:text-6xl">
                      {result.daysToBirthday}
                      <span className="ml-2 text-lg font-medium text-white/45">days</span>
                    </p>
                    <p className="mt-3 text-sm text-white/55">
                      Born on a {result.bornWeekday}. Year progress toward your next birthday.
                    </p>

                    <div
                      className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"
                      role="progressbar"
                      aria-valuenow={result.yearProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Progress toward next birthday"
                    >
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-sky-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${result.yearProgress}%` }}
                        transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <p className="mt-2 text-xs font-medium text-white/40">{result.yearProgress}% of this year elapsed</p>

                    <div className="mt-8 space-y-3 text-sm text-white/60">
                      <div className="flex justify-between border-b border-white/10 pb-3">
                        <span>Total minutes alive</span>
                        <span className="font-semibold tabular-nums text-white">
                          {result.totalMinutes.toLocaleString()}
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
          currentToolPath="/calculators/age-calculator"
          howBody="FreeToolsPro Age Calculator converts a date of birth into exact years, months, and days—then expands into weeks, hours, minutes, and a live second counter. It respects calendar quirks so school forms, HR checks, and personal planning stay accurate."
          steps={[
            {
              title: "Enter birth date",
              body: "Pick the date from the native calendar control. Optional: set a custom “as of” date.",
            },
            {
              title: "Read the timeline",
              body: "See exact age, weekday you were born, next-birthday countdown, and lifetime totals.",
            },
            {
              title: "Copy or share",
              body: "One tap copies a clean summary—or share via the system sheet / WhatsApp.",
            },
          ]}
          faqs={FAQS}
          examplePairs={[
            {
              input: "Date of birth: 15 May 1990\nAge as of: 2 Aug 2026",
              result:
                "36 years, 2 months, 18 days\nBorn on: Tuesday\nNext birthday in 286 days",
            },
          ]}
          privacyStatement="Birth dates and reference dates are processed only in your browser. FreeToolsPro does not upload or store date-of-birth data on its servers for this calculator."
          limitations={[
            "Uses calendar dates in your local timezone—legal age rules may depend on jurisdiction and time of day.",
            "Not a substitute for government-issued ID or official age verification.",
            "Future reference dates are supported for planning but do not predict calendar reforms.",
          ]}
          trustBullets={[
            "Runs locally—dates never leave the device",
            "No signup wall between you and the answer",
            "Responsive, keyboard-friendly, WCAG-minded contrast",
          ]}
          ctaLabel="Calculate now"
        />
      </div>
    </>
  );
}
