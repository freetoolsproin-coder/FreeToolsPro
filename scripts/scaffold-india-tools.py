#!/usr/bin/env python3
"""Scaffold India / utility tools, registrations, SEO, and editorial stubs."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# id, component, folder, category, path, name, desc, icon, navLabel, seoKey, seoCategory
TOOLS = [
    ("epf-checker", "EpfChecker", "business-tools", "business-tools", "/business-tools/epf-checker", "EPF Checker", "Estimate EPF balance growth from monthly contribution, interest rate, and tenure.", "PiggyBank", "EPF", "epfChecker", "BusinessApplication"),
    ("gas-supply-distributor", "GasSupplyDistributor", "trending", "trending-tools", "/trending-tools/gas-supply-distributor", "Identify Gas Supply Distributor", "Find typical LPG/PNG distributor cues by city and connection type for India.", "Flame", "Gas", "gasSupplyDistributor", "UtilitiesApplication"),
    ("account-id-link-checker", "AccountIdLinkChecker", "business-tools", "business-tools", "/business-tools/account-id-link-checker", "Account & ID Link Checker", "Checklist whether PAN, Aadhaar, bank, and UPI IDs look correctly linked for common workflows.", "Link2", "ID Link", "accountIdLinkChecker", "BusinessApplication"),
    ("indian-equity-market-indices", "IndianEquityMarketIndices", "trending", "trending-tools", "/trending-tools/indian-equity-market-indices", "Indian Equity Market Indices", "Track illustrative Sensex, Nifty, and sector index snapshots for quick market context.", "CandlestickChart", "Indices", "indianEquityMarketIndices", "FinanceApplication"),
    ("gold-silver-price-tracker", "GoldSilverPriceTracker", "trending", "trending-tools", "/trending-tools/gold-silver-price-tracker", "Gold & Silver Price Tracker", "View sample gold and silver rates and convert grams to estimated value.", "Coins", "Gold", "goldSilverPriceTracker", "FinanceApplication"),
    ("pin-code-post-office-finder", "PinCodePostOfficeFinder", "trending", "trending-tools", "/trending-tools/pin-code-post-office-finder", "PIN Code & Post Office Finder", "Look up sample Indian PIN codes, post offices, districts, and states.", "MapPin", "PIN Code", "pinCodePostOfficeFinder", "UtilitiesApplication"),
    ("toll-calculator-india", "TollCalculatorIndia", "calculators", "calculators", "/calculators/toll-calculator-india", "Toll Calculator (India)", "Estimate highway toll cost by vehicle class, distance, and plaza count.", "Car", "Toll", "tollCalculatorIndia", "FinanceApplication"),
    ("government-scheme-finder", "GovernmentSchemeFinder", "trending", "trending-tools", "/trending-tools/government-scheme-finder", "Government Scheme Finder", "Browse popular Central and state scheme names by category and eligibility keywords.", "Landmark", "Schemes", "governmentSchemeFinder", "UtilitiesApplication"),
    ("job-notification-tracker", "JobNotificationTracker", "trending", "trending-tools", "/trending-tools/job-notification-tracker", "Job Notification Tracker", "Organize exam and job alerts with board, last date, and status notes.", "Briefcase", "Jobs", "jobNotificationTracker", "UtilitiesApplication"),
    ("scholarship-finder", "ScholarshipFinder", "trending", "trending-tools", "/trending-tools/scholarship-finder", "Scholarship Finder", "Filter sample scholarships by level, category, and deadline window.", "GraduationCap", "Scholarship", "scholarshipFinder", "EducationalApplication"),
    ("electricity-bill-calculator", "ElectricityBillCalculator", "calculators", "calculators", "/calculators/electricity-bill-calculator", "Electricity Bill Calculator", "Estimate electricity bill across major Indian state slabs from units consumed.", "Zap", "Power Bill", "electricityBillCalculator", "FinanceApplication"),
    ("weather", "WeatherTool", "trending", "trending-tools", "/trending-tools/weather", "Weather", "Check current weather for Indian cities using Open-Meteo (no API key).", "CloudSun", "Weather", "weather", "UtilitiesApplication"),
    ("aqi-checker", "AqiChecker", "trending", "trending-tools", "/trending-tools/aqi-checker", "AQI Checker", "View air quality category guidance and sample city AQI bands for India.", "Wind", "AQI", "aqiChecker", "UtilitiesApplication"),
    ("government-holidays", "GovernmentHolidays", "trending", "trending-tools", "/trending-tools/government-holidays", "Government Holidays", "Browse sample gazetted and restricted holiday lists by year for India.", "CalendarDays", "Holidays", "governmentHolidays", "UtilitiesApplication"),
    ("festival-calendar", "FestivalCalendar", "trending", "trending-tools", "/trending-tools/festival-calendar", "Festival Calendar", "Explore major Indian festivals by month with short cultural notes.", "PartyPopper", "Festivals", "festivalCalendar", "UtilitiesApplication"),
    ("llm-readiness-checker", "LlmReadinessChecker", "developer-tools", "developer-tools", "/developer-tools/llm-readiness-checker", "LLM-Readiness Suggestions", "Score content for AI/answer-engine readiness: entities, structure, citations, and clarity.", "Sparkles", "LLM Ready", "llmReadinessChecker", "DeveloperApplication"),
]

SHELL = '''import {{ useMemo, useState{extra_imports} }} from "react";
import {{ {icon}{extra_icons} }} from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, {{ inputDark, selectDark }} from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
{data_import}

export default function {component}() {{
{body}
  return (
    <>
      <Seo page="{seo_key}" />
      <ToolHeroShell
        category="{category}"
        icon={{{icon}}}
        title="{title}"
        subtitle="{subtitle}"
        layout="stack"
        panel="light"
        formLabel="Try it"
      >
{ui}
      </ToolHeroShell>
      <ToolContentLayout category="{category}" currentToolPath="{path}" />
    </>
  );
}}
'''


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print("wrote", path.relative_to(ROOT))


# Shared india data module
write(
    ROOT / "src/data/india/indiaToolData.js",
    r'''/** Sample / reference datasets for India utility tools (illustrative, not official). */

export const PIN_CODES = [
  { pin: "110001", office: "New Delhi GPO", district: "New Delhi", state: "Delhi" },
  { pin: "400001", office: "Mumbai GPO", district: "Mumbai", state: "Maharashtra" },
  { pin: "560001", office: "Bangalore GPO", district: "Bengaluru Urban", state: "Karnataka" },
  { pin: "600001", office: "Chennai GPO", district: "Chennai", state: "Tamil Nadu" },
  { pin: "700001", office: "Kolkata GPO", district: "Kolkata", state: "West Bengal" },
  { pin: "500001", office: "Hyderabad GPO", district: "Hyderabad", state: "Telangana" },
  { pin: "380001", office: "Ahmedabad GPO", district: "Ahmedabad", state: "Gujarat" },
  { pin: "302001", office: "Jaipur GPO", district: "Jaipur", state: "Rajasthan" },
  { pin: "226001", office: "Lucknow GPO", district: "Lucknow", state: "Uttar Pradesh" },
  { pin: "682001", office: "Ernakulam", district: "Ernakulam", state: "Kerala" },
];

export const GAS_DISTRIBUTORS = [
  { city: "Mumbai", type: "LPG", brand: "Indane", distributor: "Western Suburban Indane Agency", phone: "1800-233-3555" },
  { city: "Mumbai", type: "PNG", brand: "Mahanagar Gas", distributor: "MGL Consumer Care", phone: "022-6156-4000" },
  { city: "Delhi", type: "LPG", brand: "Bharatgas", distributor: "Delhi Bharatgas Agency", phone: "1800-22-4344" },
  { city: "Delhi", type: "PNG", brand: "IGL", distributor: "Indraprastha Gas Ltd", phone: "011-4607-4607" },
  { city: "Bengaluru", type: "LPG", brand: "HP Gas", distributor: "Bengaluru HP Agency", phone: "1800-2333-555" },
  { city: "Hyderabad", type: "LPG", brand: "Indane", distributor: "Secunderabad Indane", phone: "1800-233-3555" },
  { city: "Chennai", type: "PNG", brand: "AGP City Gas", distributor: "AGP Chennai", phone: "044-4000-4000" },
  { city: "Pune", type: "LPG", brand: "Bharatgas", distributor: "Pune Bharatgas", phone: "1800-22-4344" },
];

export const SCHEMES = [
  { name: "PM-KISAN", category: "Agriculture", level: "Central", note: "Income support for landholding farmer families." },
  { name: "Ayushman Bharat (PM-JAY)", category: "Health", level: "Central", note: "Health cover for eligible families." },
  { name: "PMAY-U", category: "Housing", level: "Central", note: "Urban housing assistance under eligible categories." },
  { name: "PMAY-G", category: "Housing", level: "Central", note: "Rural housing for eligible households." },
  { name: "Ujjwala Yojana", category: "Energy", level: "Central", note: "LPG connections for eligible women." },
  { name: "Sukanya Samriddhi", category: "Savings", level: "Central", note: "Girl-child savings account scheme." },
  { name: "APY", category: "Pension", level: "Central", note: "Atal Pension Yojana for unorganised sector." },
  { name: "NPS", category: "Pension", level: "Central", note: "National Pension System voluntary retirement savings." },
  { name: "Stand-Up India", category: "Business", level: "Central", note: "Bank loans for SC/ST and women entrepreneurs." },
  { name: "Mudra Loan", category: "Business", level: "Central", note: "Micro enterprise financing under PMMY." },
];

export const SCHOLARSHIPS = [
  { name: "National Scholarship Portal (NSP)", level: "School/College", category: "General", deadline: "Oct–Dec window (typical)" },
  { name: "INSPIRE Scholarship", level: "Undergraduate", category: "Science", deadline: "As notified" },
  { name: "Post-Matric Scholarship (SC)", level: "College", category: "SC", deadline: "State/NSP cycle" },
  { name: "Post-Matric Scholarship (OBC)", level: "College", category: "OBC", deadline: "State/NSP cycle" },
  { name: "Prime Minister's Scholarship Scheme", level: "College", category: "Defence", deadline: "As notified" },
  { name: "AICTE Pragati", level: "Engineering", category: "Girl students", deadline: "As notified" },
  { name: "UGC NET JRF", level: "Research", category: "Higher education", deadline: "Exam cycle" },
  { name: "State Merit Scholarship", level: "School", category: "Merit", deadline: "State board cycle" },
];

export const HOLIDAYS_2026 = [
  { date: "2026-01-26", name: "Republic Day", type: "Gazetted" },
  { date: "2026-03-03", name: "Holi", type: "Gazetted" },
  { date: "2026-03-21", name: "Id-ul-Fitr*", type: "Gazetted" },
  { date: "2026-04-03", name: "Good Friday", type: "Gazetted" },
  { date: "2026-04-14", name: "Ambedkar Jayanti", type: "Restricted/State" },
  { date: "2026-05-01", name: "Labour Day", type: "State" },
  { date: "2026-08-15", name: "Independence Day", type: "Gazetted" },
  { date: "2026-08-27", name: "Janmashtami", type: "Restricted/State" },
  { date: "2026-10-02", name: "Gandhi Jayanti", type: "Gazetted" },
  { date: "2026-10-19", name: "Dussehra*", type: "Gazetted" },
  { date: "2026-11-08", name: "Diwali*", type: "Gazetted" },
  { date: "2026-12-25", name: "Christmas", type: "Gazetted" },
];

export const FESTIVALS = [
  { month: "January", name: "Makar Sankranti / Pongal", note: "Harvest festivals across regions." },
  { month: "January", name: "Republic Day", note: "National celebration on 26 January." },
  { month: "March", name: "Holi", note: "Festival of colours (date varies)." },
  { month: "April", name: "Ugadi / Gudi Padwa", note: "Regional new year celebrations." },
  { month: "August", name: "Raksha Bandhan", note: "Sibling festival (date varies)." },
  { month: "August", name: "Independence Day", note: "15 August national holiday." },
  { month: "August/September", name: "Onam", note: "Kerala harvest festival." },
  { month: "September/October", name: "Navratri / Durga Puja", note: "Nine nights / regional observances." },
  { month: "October/November", name: "Diwali", note: "Festival of lights (date varies)." },
  { month: "November", name: "Guru Nanak Jayanti", note: "Sikh observance (date varies)." },
  { month: "December", name: "Christmas", note: "25 December." },
];

export const MARKET_INDICES = [
  { name: "Nifty 50", value: "24,812.40", change: "+0.62%", tone: "up" },
  { name: "Sensex", value: "81,456.20", change: "+0.55%", tone: "up" },
  { name: "Nifty Bank", value: "52,140.10", change: "-0.18%", tone: "down" },
  { name: "Nifty IT", value: "42,890.75", change: "+1.12%", tone: "up" },
  { name: "Nifty Midcap 100", value: "56,210.30", change: "+0.41%", tone: "up" },
  { name: "India VIX", value: "13.28", change: "-2.10%", tone: "down" },
];

export const METAL_RATES = {
  gold24kPerGram: 7450,
  gold22kPerGram: 6830,
  silverPerGram: 96.5,
  asOf: "Sample rates for estimation only",
};

export const POWER_SLABS = {
  Maharashtra: [
    { upto: 100, rate: 4.5 },
    { upto: 300, rate: 7.2 },
    { upto: 500, rate: 10.5 },
    { upto: Infinity, rate: 12.8 },
  ],
  Delhi: [
    { upto: 200, rate: 3.5 },
    { upto: 400, rate: 6.5 },
    { upto: 800, rate: 8.5 },
    { upto: Infinity, rate: 10.0 },
  ],
  Karnataka: [
    { upto: 100, rate: 4.2 },
    { upto: 200, rate: 6.8 },
    { upto: 500, rate: 9.5 },
    { upto: Infinity, rate: 11.2 },
  ],
  "Tamil Nadu": [
    { upto: 100, rate: 0 },
    { upto: 200, rate: 4.5 },
    { upto: 500, rate: 7.5 },
    { upto: Infinity, rate: 10.5 },
  ],
  Gujarat: [
    { upto: 100, rate: 3.8 },
    { upto: 250, rate: 5.5 },
    { upto: 500, rate: 8.0 },
    { upto: Infinity, rate: 10.2 },
  ],
  "Uttar Pradesh": [
    { upto: 100, rate: 4.0 },
    { upto: 300, rate: 6.5 },
    { upto: 500, rate: 8.8 },
    { upto: Infinity, rate: 11.0 },
  ],
  Telangana: [
    { upto: 100, rate: 3.5 },
    { upto: 200, rate: 6.0 },
    { upto: 400, rate: 8.5 },
    { upto: Infinity, rate: 10.5 },
  ],
  "West Bengal": [
    { upto: 100, rate: 5.0 },
    { upto: 300, rate: 7.5 },
    { upto: 500, rate: 9.0 },
    { upto: Infinity, rate: 11.5 },
  ],
};

export const CITIES_GEO = {
  Mumbai: { lat: 19.076, lon: 72.8777 },
  Delhi: { lat: 28.6139, lon: 77.209 },
  Bengaluru: { lat: 12.9716, lon: 77.5946 },
  Hyderabad: { lat: 17.385, lon: 78.4867 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Kolkata: { lat: 22.5726, lon: 88.3639 },
  Pune: { lat: 18.5204, lon: 73.8567 },
  Ahmedabad: { lat: 23.0225, lon: 72.5714 },
  Jaipur: { lat: 26.9124, lon: 75.7873 },
  Lucknow: { lat: 26.8467, lon: 80.9462 },
};

export const AQI_SAMPLES = [
  { city: "Delhi", aqi: 268, category: "Poor" },
  { city: "Mumbai", aqi: 112, category: "Moderate" },
  { city: "Bengaluru", aqi: 74, category: "Satisfactory" },
  { city: "Kolkata", aqi: 156, category: "Moderate" },
  { city: "Chennai", aqi: 68, category: "Satisfactory" },
  { city: "Lucknow", aqi: 221, category: "Poor" },
];
''',
)

# Individual tool bodies - compact functional UIs
BODIES = {}

BODIES["EpfChecker"] = (
    """  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(8.25);
  const [years, setYears] = useState(15);
  const [employeeShare, setEmployeeShare] = useState(12);

  const result = useMemo(() => {
    const n = Math.max(0, Number(years) || 0) * 12;
    const r = (Number(rate) || 0) / 100 / 12;
    const p = Number(monthly) || 0;
    if (n === 0) return { corpus: 0, contributed: 0, interest: 0 };
    const corpus = r === 0 ? p * n : p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const contributed = p * n;
    return { corpus, contributed, interest: corpus - contributed };
  }, [monthly, rate, years]);
""",
    """        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-[var(--ftp-ink-soft)]">Monthly contribution (₹)
            <input className={`${inputDark} mt-1.5`} type="number" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Assumed interest rate (% p.a.)
            <input className={`${inputDark} mt-1.5`} type="number" step="0.05" value={rate} onChange={(e) => setRate(e.target.value)} />
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Tenure (years)
            <input className={`${inputDark} mt-1.5`} type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} />
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Employee share note (%)
            <input className={`${inputDark} mt-1.5`} type="number" value={employeeShare} onChange={(e) => setEmployeeShare(e.target.value)} />
          </label>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ftp-ink-soft)]">Corpus</p>
            <p className="mt-1 text-xl font-semibold text-[var(--ftp-ink)]">₹{Math.round(result.corpus).toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ftp-ink-soft)]">Contributed</p>
            <p className="mt-1 text-xl font-semibold text-[var(--ftp-ink)]">₹{Math.round(result.contributed).toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ftp-ink-soft)]">Interest</p>
            <p className="mt-1 text-xl font-semibold text-[var(--ftp-ink)]">₹{Math.round(result.interest).toLocaleString("en-IN")}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">Estimate only. Actual EPF interest is declared yearly; employer share and withdrawals change balances. Employee share field is informational ({employeeShare}% typical on basic).</p>
""",
    "",
    "",
)

BODIES["GasSupplyDistributor"] = (
    """  const [city, setCity] = useState("Mumbai");
  const [type, setType] = useState("All");
  const cities = useMemo(() => [...new Set(GAS_DISTRIBUTORS.map((d) => d.city))], []);
  const rows = useMemo(() => GAS_DISTRIBUTORS.filter((d) => d.city === city && (type === "All" || d.type === type)), [city, type]);
""",
    """        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-[var(--ftp-ink-soft)]">City
            <select className={`${selectDark} mt-1.5`} value={city} onChange={(e) => setCity(e.target.value)}>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Connection type
            <select className={`${selectDark} mt-1.5`} value={type} onChange={(e) => setType(e.target.value)}>
              <option>All</option><option>LPG</option><option>PNG</option>
            </select>
          </label>
        </div>
        <ul className="mt-6 space-y-3">
          {rows.map((d) => (
            <li key={`${d.city}-${d.brand}-${d.type}`} className="rounded-xl border border-[var(--ftp-line)] bg-white p-4">
              <p className="font-semibold text-[var(--ftp-ink)]">{d.brand} · {d.type}</p>
              <p className="mt-1 text-sm text-[var(--ftp-ink-soft)]">{d.distributor}</p>
              <p className="mt-1 text-sm text-[var(--ftp-ink)]">{d.phone}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">Sample directory for guidance. Confirm your cylinder number or consumer ID on the official Indane / Bharatgas / HP Gas / city gas portals.</p>
""",
    'import { GAS_DISTRIBUTORS } from "../../data/india/indiaToolData";',
    "",
)

BODIES["AccountIdLinkChecker"] = (
    """  const [checks, setChecks] = useState({
    panAadhaar: false,
    aadhaarBank: false,
    panBank: false,
    upiBank: false,
    digilocker: false,
  });
  const score = Object.values(checks).filter(Boolean).length;
  const toggle = (key) => setChecks((c) => ({ ...c, [key]: !c[key] }));
  const items = [
    ["panAadhaar", "PAN linked with Aadhaar"],
    ["aadhaarBank", "Aadhaar seeded with bank account"],
    ["panBank", "PAN updated in bank KYC"],
    ["upiBank", "UPI ID mapped to the same bank account"],
    ["digilocker", "DigiLocker / UIDAI documents accessible"],
  ];
""",
    """        <ul className="space-y-3">
          {items.map(([key, label]) => (
            <li key={key}>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--ftp-line)] bg-white px-4 py-3 text-sm text-[var(--ftp-ink)]">
                <input type="checkbox" checked={checks[key]} onChange={() => toggle(key)} className="h-4 w-4" />
                {label}
              </label>
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4">
          <p className="text-sm font-semibold text-[var(--ftp-ink)]">Link readiness: {score} / {items.length}</p>
          <p className="mt-2 text-sm text-[var(--ftp-ink-soft)]">
            {score === items.length
              ? "Looks complete for common banking and tax workflows. Still verify on official portals."
              : "Tick items you have already verified on UIDAI, e-Filing, bank, and UPI apps. This tool does not call government APIs."}
          </p>
        </div>
""",
    "",
    "",
)

BODIES["IndianEquityMarketIndices"] = (
    """  const [filter, setFilter] = useState("");
  const rows = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return MARKET_INDICES.filter((r) => !q || r.name.toLowerCase().includes(q));
  }, [filter]);
""",
    """        <label className="block text-sm text-[var(--ftp-ink-soft)]">Filter indices
          <input className={`${inputDark} mt-1.5`} value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Nifty, Sensex, Bank…" />
        </label>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.name} className="rounded-xl border border-[var(--ftp-line)] bg-white p-4">
              <p className="text-sm font-semibold text-[var(--ftp-ink)]">{row.name}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--ftp-ink)]">{row.value}</p>
              <p className={`mt-1 text-sm font-medium ${row.tone === "up" ? "text-teal-700" : "text-rose-600"}`}>{row.change}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">Illustrative snapshot for UI practice—not live exchange data. Confirm prices on your broker or NSE/BSE before trading.</p>
""",
    'import { MARKET_INDICES } from "../../data/india/indiaToolData";',
    "",
)

BODIES["GoldSilverPriceTracker"] = (
    """  const [grams, setGrams] = useState(10);
  const [metal, setMetal] = useState("gold22k");
  const rate = metal === "gold24k" ? METAL_RATES.gold24kPerGram : metal === "silver" ? METAL_RATES.silverPerGram : METAL_RATES.gold22kPerGram;
  const total = (Number(grams) || 0) * rate;
""",
    """        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--ftp-line)] bg-white p-4 sm:col-span-1">
            <p className="text-xs uppercase tracking-wide text-[var(--ftp-ink-soft)]">24K gold / g</p>
            <p className="mt-1 text-lg font-semibold">₹{METAL_RATES.gold24kPerGram.toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-xl border border-[var(--ftp-line)] bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--ftp-ink-soft)]">22K gold / g</p>
            <p className="mt-1 text-lg font-semibold">₹{METAL_RATES.gold22kPerGram.toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-xl border border-[var(--ftp-line)] bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--ftp-ink-soft)]">Silver / g</p>
            <p className="mt-1 text-lg font-semibold">₹{METAL_RATES.silverPerGram}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-[var(--ftp-ink-soft)]">Metal
            <select className={`${selectDark} mt-1.5`} value={metal} onChange={(e) => setMetal(e.target.value)}>
              <option value="gold22k">Gold 22K</option>
              <option value="gold24k">Gold 24K</option>
              <option value="silver">Silver</option>
            </select>
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Weight (grams)
            <input className={`${inputDark} mt-1.5`} type="number" min="0" step="0.1" value={grams} onChange={(e) => setGrams(e.target.value)} />
          </label>
        </div>
        <p className="mt-6 text-2xl font-semibold text-[var(--ftp-ink)]">≈ ₹{Math.round(total).toLocaleString("en-IN")}</p>
        <p className="mt-2 text-sm text-[var(--ftp-ink-soft)]">{METAL_RATES.asOf}. Making charges and GST are not included.</p>
""",
    'import { METAL_RATES } from "../../data/india/indiaToolData";',
    "",
)

BODIES["PinCodePostOfficeFinder"] = (
    """  const [query, setQuery] = useState("");
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PIN_CODES;
    return PIN_CODES.filter((r) => r.pin.includes(q) || r.office.toLowerCase().includes(q) || r.district.toLowerCase().includes(q) || r.state.toLowerCase().includes(q));
  }, [query]);
""",
    """        <label className="block text-sm text-[var(--ftp-ink-soft)]">PIN, post office, district, or state
          <input className={`${inputDark} mt-1.5`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. 560001 or Bengaluru" />
        </label>
        <ul className="mt-6 divide-y divide-[var(--ftp-line)] rounded-xl border border-[var(--ftp-line)] bg-white">
          {matches.map((r) => (
            <li key={r.pin} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 text-sm">
              <span className="font-semibold text-[var(--ftp-ink)]">{r.pin}</span>
              <span className="text-[var(--ftp-ink-soft)]">{r.office} · {r.district}, {r.state}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">Sample PIN directory. For official delivery area checks use India Post.</p>
""",
    'import { PIN_CODES } from "../../data/india/indiaToolData";',
    "",
)

BODIES["TollCalculatorIndia"] = (
    """  const [km, setKm] = useState(120);
  const [plazas, setPlazas] = useState(3);
  const [vehicle, setVehicle] = useState("car");
  const rates = { car: 1.8, lcv: 2.9, bus: 6.2, truck: 7.5 };
  const plazaFee = { car: 85, lcv: 140, bus: 280, truck: 320 };
  const estimate = (Number(km) || 0) * rates[vehicle] + (Number(plazas) || 0) * plazaFee[vehicle];
""",
    """        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm text-[var(--ftp-ink-soft)]">Vehicle class
            <select className={`${selectDark} mt-1.5`} value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
              <option value="car">Car / Jeep / Van</option>
              <option value="lcv">LCV</option>
              <option value="bus">Bus</option>
              <option value="truck">Truck</option>
            </select>
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Distance (km)
            <input className={`${inputDark} mt-1.5`} type="number" min="0" value={km} onChange={(e) => setKm(e.target.value)} />
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Toll plazas
            <input className={`${inputDark} mt-1.5`} type="number" min="0" value={plazas} onChange={(e) => setPlazas(e.target.value)} />
          </label>
        </div>
        <p className="mt-6 text-2xl font-semibold text-[var(--ftp-ink)]">Estimated toll ≈ ₹{Math.round(estimate).toLocaleString("en-IN")}</p>
        <p className="mt-2 text-sm text-[var(--ftp-ink-soft)]">Heuristic estimate for planning. Actual plaza rates vary by highway, FASTag discounts, and return journey rules.</p>
""",
    "",
    "",
)

BODIES["GovernmentSchemeFinder"] = (
    """  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const cats = useMemo(() => ["All", ...new Set(SCHEMES.map((s) => s.category))], []);
  const rows = useMemo(() => SCHEMES.filter((s) => (category === "All" || s.category === category) && (!q.trim() || `${s.name} ${s.note}`.toLowerCase().includes(q.trim().toLowerCase()))), [q, category]);
""",
    """        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-[var(--ftp-ink-soft)]">Search
            <input className={`${inputDark} mt-1.5`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="farmer, pension, housing…" />
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Category
            <select className={`${selectDark} mt-1.5`} value={category} onChange={(e) => setCategory(e.target.value)}>
              {cats.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <ul className="mt-6 space-y-3">
          {rows.map((s) => (
            <li key={s.name} className="rounded-xl border border-[var(--ftp-line)] bg-white p-4">
              <p className="font-semibold text-[var(--ftp-ink)]">{s.name}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--ftp-ink-soft)]">{s.level} · {s.category}</p>
              <p className="mt-2 text-sm text-[var(--ftp-ink-soft)]">{s.note}</p>
            </li>
          ))}
        </ul>
""",
    'import { SCHEMES } from "../../data/india/indiaToolData";',
    "",
)

BODIES["JobNotificationTracker"] = (
    """  const [rows, setRows] = useState([
    { id: 1, title: "SSC CGL", board: "SSC", lastDate: "2026-08-15", status: "Open" },
    { id: 2, title: "IBPS PO", board: "IBPS", lastDate: "2026-09-01", status: "Upcoming" },
    { id: 3, title: "UPSC CSE Prelims", board: "UPSC", lastDate: "2026-05-20", status: "Closed" },
  ]);
  const [title, setTitle] = useState("");
  const [board, setBoard] = useState("");
  const [lastDate, setLastDate] = useState("");
  const add = () => {
    if (!title.trim()) return;
    setRows((r) => [{ id: Date.now(), title: title.trim(), board: board.trim() || "—", lastDate: lastDate || "—", status: "Open" }, ...r]);
    setTitle(""); setBoard(""); setLastDate("");
  };
""",
    """        <div className="grid gap-3 sm:grid-cols-4">
          <input className={inputDark} placeholder="Exam / post" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className={inputDark} placeholder="Board" value={board} onChange={(e) => setBoard(e.target.value)} />
          <input className={inputDark} type="date" value={lastDate} onChange={(e) => setLastDate(e.target.value)} />
          <button type="button" onClick={add} className="rounded-[14px] bg-[var(--ftp-ink)] px-4 py-3 text-sm font-semibold text-white">Add alert</button>
        </div>
        <ul className="mt-6 space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--ftp-line)] bg-white px-4 py-3 text-sm">
              <div>
                <p className="font-semibold text-[var(--ftp-ink)]">{r.title}</p>
                <p className="text-[var(--ftp-ink-soft)]">{r.board} · Last date {r.lastDate}</p>
              </div>
              <span className="rounded-full bg-[var(--ftp-porcelain)] px-3 py-1 text-xs font-semibold">{r.status}</span>
            </li>
          ))}
        </ul>
""",
    "",
    "",
)

BODIES["ScholarshipFinder"] = (
    """  const [level, setLevel] = useState("All");
  const [q, setQ] = useState("");
  const levels = useMemo(() => ["All", ...new Set(SCHOLARSHIPS.map((s) => s.level))], []);
  const rows = useMemo(() => SCHOLARSHIPS.filter((s) => (level === "All" || s.level === level) && (!q.trim() || `${s.name} ${s.category}`.toLowerCase().includes(q.trim().toLowerCase()))), [level, q]);
""",
    """        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-[var(--ftp-ink-soft)]">Level
            <select className={`${selectDark} mt-1.5`} value={level} onChange={(e) => setLevel(e.target.value)}>
              {levels.map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Search
            <input className={`${inputDark} mt-1.5`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="NSP, AICTE, merit…" />
          </label>
        </div>
        <ul className="mt-6 space-y-3">
          {rows.map((s) => (
            <li key={s.name} className="rounded-xl border border-[var(--ftp-line)] bg-white p-4">
              <p className="font-semibold text-[var(--ftp-ink)]">{s.name}</p>
              <p className="mt-1 text-sm text-[var(--ftp-ink-soft)]">{s.level} · {s.category}</p>
              <p className="mt-1 text-sm text-[var(--ftp-ink)]">Deadline: {s.deadline}</p>
            </li>
          ))}
        </ul>
""",
    'import { SCHOLARSHIPS } from "../../data/india/indiaToolData";',
    "",
)

BODIES["ElectricityBillCalculator"] = (
    """  const [state, setState] = useState("Maharashtra");
  const [units, setUnits] = useState(250);
  const [fixed, setFixed] = useState(120);
  const bill = useMemo(() => {
    const slabs = POWER_SLABS[state] || [];
    let remaining = Number(units) || 0;
    let prev = 0;
    let energy = 0;
    for (const slab of slabs) {
      const span = Math.min(remaining, slab.upto - prev);
      if (span <= 0) break;
      energy += span * slab.rate;
      remaining -= span;
      prev = slab.upto;
      if (!Number.isFinite(slab.upto)) break;
    }
    const total = energy + (Number(fixed) || 0);
    return { energy, total };
  }, [state, units, fixed]);
""",
    """        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm text-[var(--ftp-ink-soft)]">State
            <select className={`${selectDark} mt-1.5`} value={state} onChange={(e) => setState(e.target.value)}>
              {Object.keys(POWER_SLABS).map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Units (kWh)
            <input className={`${inputDark} mt-1.5`} type="number" min="0" value={units} onChange={(e) => setUnits(e.target.value)} />
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Fixed charges (₹)
            <input className={`${inputDark} mt-1.5`} type="number" min="0" value={fixed} onChange={(e) => setFixed(e.target.value)} />
          </label>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--ftp-ink-soft)]">Energy charge</p>
            <p className="mt-1 text-xl font-semibold">₹{Math.round(bill.energy).toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--ftp-ink-soft)]">Estimated total</p>
            <p className="mt-1 text-xl font-semibold">₹{Math.round(bill.total).toLocaleString("en-IN")}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">Simplified slabs for estimation. Subsidies, fuel adjustments, and taxes differ by DISCOM.</p>
""",
    'import { POWER_SLABS } from "../../data/india/indiaToolData";',
    "",
)

BODIES["WeatherTool"] = (
    """  const [city, setCity] = useState("Mumbai");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const geo = CITIES_GEO[city];
    if (!geo) return;
    setLoading(true);
    setError("");
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${geo.lat}&longitude=${geo.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather request failed");
      const json = await res.json();
      setData(json.current);
    } catch (e) {
      setError(e.message || "Could not load weather");
      setData(null);
    } finally {
      setLoading(false);
    }
  };
""",
    """        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm text-[var(--ftp-ink-soft)]">City
            <select className={`${selectDark} mt-1.5`} value={city} onChange={(e) => setCity(e.target.value)}>
              {Object.keys(CITIES_GEO).map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <button type="button" onClick={load} className="rounded-[14px] bg-[var(--ftp-ink)] px-5 py-3 text-sm font-semibold text-white">{loading ? "Loading…" : "Get weather"}</button>
        </div>
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
        {data ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--ftp-line)] bg-white p-4"><p className="text-xs uppercase text-[var(--ftp-ink-soft)]">Temp</p><p className="mt-1 text-2xl font-semibold">{data.temperature_2m}°C</p></div>
            <div className="rounded-xl border border-[var(--ftp-line)] bg-white p-4"><p className="text-xs uppercase text-[var(--ftp-ink-soft)]">Humidity</p><p className="mt-1 text-2xl font-semibold">{data.relative_humidity_2m}%</p></div>
            <div className="rounded-xl border border-[var(--ftp-line)] bg-white p-4"><p className="text-xs uppercase text-[var(--ftp-ink-soft)]">Wind</p><p className="mt-1 text-2xl font-semibold">{data.wind_speed_10m} km/h</p></div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">Uses Open-Meteo (free, no key). Click Get weather to fetch the latest reading.</p>
        )}
""",
    'import { CITIES_GEO } from "../../data/india/indiaToolData";',
    "",
)

BODIES["AqiChecker"] = (
    """  const [city, setCity] = useState("All");
  const rows = useMemo(() => (city === "All" ? AQI_SAMPLES : AQI_SAMPLES.filter((r) => r.city === city)), [city]);
""",
    """        <label className="block text-sm text-[var(--ftp-ink-soft)]">City
          <select className={`${selectDark} mt-1.5 max-w-sm`} value={city} onChange={(e) => setCity(e.target.value)}>
            <option>All</option>
            {AQI_SAMPLES.map((r) => <option key={r.city}>{r.city}</option>)}
          </select>
        </label>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {rows.map((r) => (
            <li key={r.city} className="rounded-xl border border-[var(--ftp-line)] bg-white p-4">
              <p className="font-semibold text-[var(--ftp-ink)]">{r.city}</p>
              <p className="mt-2 text-3xl font-semibold">{r.aqi}</p>
              <p className="mt-1 text-sm text-[var(--ftp-ink-soft)]">{r.category}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">Sample AQI bands for education. Check CPCB / sameer app for official live values.</p>
""",
    'import { AQI_SAMPLES } from "../../data/india/indiaToolData";',
    "",
)

BODIES["GovernmentHolidays"] = (
    """  const [type, setType] = useState("All");
  const rows = useMemo(() => HOLIDAYS_2026.filter((h) => type === "All" || h.type === type), [type]);
""",
    """        <label className="block text-sm text-[var(--ftp-ink-soft)]">Type
          <select className={`${selectDark} mt-1.5 max-w-sm`} value={type} onChange={(e) => setType(e.target.value)}>
            <option>All</option>
            <option>Gazetted</option>
            <option>Restricted/State</option>
            <option>State</option>
          </select>
        </label>
        <ul className="mt-6 divide-y divide-[var(--ftp-line)] rounded-xl border border-[var(--ftp-line)] bg-white">
          {rows.map((h) => (
            <li key={`${h.date}-${h.name}`} className="flex flex-wrap justify-between gap-2 px-4 py-3 text-sm">
              <span className="font-semibold text-[var(--ftp-ink)]">{h.name}</span>
              <span className="text-[var(--ftp-ink-soft)]">{h.date} · {h.type}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">*Festival dates marked with an asterisk can shift; confirm with the official DoPT / state calendar.</p>
""",
    'import { HOLIDAYS_2026 } from "../../data/india/indiaToolData";',
    "",
)

BODIES["FestivalCalendar"] = (
    """  const [month, setMonth] = useState("All");
  const months = useMemo(() => ["All", ...new Set(FESTIVALS.map((f) => f.month))], []);
  const rows = useMemo(() => FESTIVALS.filter((f) => month === "All" || f.month === month), [month]);
""",
    """        <label className="block text-sm text-[var(--ftp-ink-soft)]">Month / season
          <select className={`${selectDark} mt-1.5 max-w-sm`} value={month} onChange={(e) => setMonth(e.target.value)}>
            {months.map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <ul className="mt-6 space-y-3">
          {rows.map((f) => (
            <li key={`${f.month}-${f.name}`} className="rounded-xl border border-[var(--ftp-line)] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ftp-ink-soft)]">{f.month}</p>
              <p className="mt-1 font-semibold text-[var(--ftp-ink)]">{f.name}</p>
              <p className="mt-1 text-sm text-[var(--ftp-ink-soft)]">{f.note}</p>
            </li>
          ))}
        </ul>
""",
    'import { FESTIVALS } from "../../data/india/indiaToolData";',
    "",
)

BODIES["LlmReadinessChecker"] = (
    """  const [text, setText] = useState("");
  const report = useMemo(() => {
    const t = text.trim();
    if (!t) return null;
    const words = t.split(/\\s+/).filter(Boolean).length;
    const hasHeading = /^#+\\s|\\n[A-Z][^\\n]{8,}$/m.test(t) || t.split("\\n").some((l) => l.length < 60 && /:$/.test(l.trim()));
    const hasList = /(^|\\n)\\s*([-|*]|\\d+\\.)\\s+/.test(t);
    const hasQuestion = /\\?/.test(t);
    const hasUrl = /https?:\\/\\//i.test(t);
    const hasEntity = /\\b(India|API|React|Google|FreeToolsPro|₹|%[a-zA-Z]+)\\b/.test(t);
    const avgLen = words ? t.length / Math.max(1, t.split(/[.!?]+/).filter(Boolean).length) : 0;
    let score = 20;
    if (words >= 120) score += 15;
    if (words >= 300) score += 10;
    if (hasHeading) score += 15;
    if (hasList) score += 15;
    if (hasQuestion) score += 10;
    if (hasUrl) score += 10;
    if (hasEntity) score += 10;
    if (avgLen > 40 && avgLen < 220) score += 5;
    score = Math.min(100, score);
    const tips = [];
    if (words < 120) tips.push("Add more explanatory depth (120+ words helps answer engines).");
    if (!hasHeading) tips.push("Add clear section headings that mirror real questions.");
    if (!hasList) tips.push("Use bullets or numbered steps for procedures.");
    if (!hasUrl) tips.push("Cite a primary source URL where you claim facts.");
    if (!hasEntity) tips.push("Name concrete entities (products, places, standards) models can ground on.");
    if (!tips.length) tips.push("Solid structure—keep the first screen answering the core query.");
    return { score, tips, words };
  }, [text]);
""",
    """        <label className="block text-sm text-[var(--ftp-ink-soft)]">Paste page or article draft
          <textarea className={`${inputDark} mt-1.5 min-h-[180px] font-sans`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste content to score for LLM / GEO readiness…" />
        </label>
        {report ? (
          <div className="mt-6 rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-5">
            <p className="text-sm font-semibold text-[var(--ftp-ink)]">Readiness score: {report.score}/100 · {report.words} words</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--ftp-ink-soft)]">
              {report.tips.map((tip) => <li key={tip}>{tip}</li>)}
            </ul>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">Heuristic checklist for answer-engine / GEO hygiene—not a ranking guarantee.</p>
        )}
""",
    "",
    "",
)


def emit_tool(meta):
    tid, component, folder, category, path, name, desc, icon, nav, seo_key, seo_cat = meta
    body, ui, data_import, _ = BODIES[component]
    extra_imports = ", useEffect" if component == "WeatherTool" else ""
    # Weather uses useEffect? Actually uses async on button - no useEffect needed
    content = SHELL.format(
        extra_imports="",
        icon=icon,
        extra_icons="",
        data_import=data_import,
        component=component,
        body=body,
        seo_key=seo_key,
        category=category,
        title=name,
        subtitle=desc.replace('"', '\\"'),
        ui=ui,
        path=path,
    )
    folder_path = ROOT / "src" / "tools" / folder
    write(folder_path / f"{component}.jsx", content)


for meta in TOOLS:
    emit_tool(meta)

# Manifest for registration patches
manifest = ROOT / "scripts" / "_india_tools_manifest.json"
import json
manifest.write_text(json.dumps(TOOLS, indent=2), encoding="utf-8")
print("manifest", manifest)
print("done", len(TOOLS), "tools")
