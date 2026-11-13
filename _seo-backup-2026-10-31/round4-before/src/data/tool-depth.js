// Method, limitations and sources for each tool page ("How it's calculated" / "How it works",
// "Limitations", "Sources"). Keyed by tool id. Every statement here describes what the code in
// src/tools/ actually does; if you change a tool's logic, update its entry.
// `how`: plain-language method. `formula`: optional one-line formula (calculators).
// `limits`: tool-specific caveats (engine-wide caveats are added from ENGINE_LIMITS).
// `src`: [label, url] pairs: official or primary sources only.

const ITD = ["Income Tax Department, e-filing portal", "https://www.incometax.gov.in/iec/foportal/"];
const ITI = ["Income Tax India (Acts, rules and tax calculator)", "https://incometaxindia.gov.in/"];
const RBI = ["Reserve Bank of India", "https://www.rbi.org.in/"];
const DICGC = ["DICGC: deposit insurance up to ₹5 lakh per bank", "https://www.dicgc.org.in/"];
const EPFO = ["Employees' Provident Fund Organisation", "https://www.epfindia.gov.in/"];
const NSI = ["National Savings Institute: small savings schemes", "https://www.nsiindia.gov.in/"];
const DEA = ["Department of Economic Affairs: quarterly small savings rates", "https://dea.gov.in/"];
const AMFI = ["AMFI: mutual fund investor education", "https://www.amfiindia.com/"];
const SEBI = ["SEBI investor website", "https://investor.sebi.gov.in/"];
const PFRDA = ["PFRDA: National Pension System", "https://www.pfrda.org.in/"];
const LABOUR = ["Ministry of Labour & Employment (Payment of Gratuity Act)", "https://labour.gov.in/"];
const GST = ["GST portal", "https://www.gst.gov.in/"];
const CBIC = ["CBIC: GST rates and notifications", "https://cbic-gst.gov.in/"];
const MOSPI = ["MoSPI: Consumer Price Index releases", "https://mospi.gov.in/"];
const CBSE = ["Central Board of Secondary Education", "https://www.cbse.gov.in/"];
const WHO_ASIA = ["WHO expert consultation: BMI for Asian populations (Lancet, 2004)", "https://pubmed.ncbi.nlm.nih.gov/14726171/"];
const MIFFLIN = ["Mifflin et al., resting energy expenditure equation (1990)", "https://pubmed.ncbi.nlm.nih.gov/2305711/"];
const G_TITLE = ["Google Search Central: title links", "https://developers.google.com/search/docs/appearance/title-link"];
const G_SNIP = ["Google Search Central: snippets and meta descriptions", "https://developers.google.com/search/docs/appearance/snippet"];
const G_CANON = ["Google Search Central: canonical URLs", "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls"];
const G_ROBOTS = ["Google Search Central: robots.txt", "https://developers.google.com/search/docs/crawling-indexing/robots/intro"];
const RFC9309 = ["RFC 9309: Robots Exclusion Protocol", "https://www.rfc-editor.org/rfc/rfc9309"];
const SITEMAPS = ["sitemaps.org protocol", "https://www.sitemaps.org/protocol.html"];
const OGP = ["The Open Graph protocol", "https://ogp.me/"];
const RFC8259 = ["RFC 8259: the JSON format", "https://www.rfc-editor.org/rfc/rfc8259"];
const RFC4648 = ["RFC 4648: Base64 encoding", "https://www.rfc-editor.org/rfc/rfc4648"];
const RFC3986 = ["RFC 3986: URI syntax and percent-encoding", "https://www.rfc-editor.org/rfc/rfc3986"];
const RFC7519 = ["RFC 7519: JSON Web Token", "https://www.rfc-editor.org/rfc/rfc7519"];
const RFC9562 = ["RFC 9562: UUIDs (v4 and v7)", "https://www.rfc-editor.org/rfc/rfc9562"];
const RFC4180 = ["RFC 4180: CSV format", "https://www.rfc-editor.org/rfc/rfc4180"];
const YAML = ["YAML 1.2 specification", "https://yaml.org/spec/1.2.2/"];
const FIPS = ["NIST FIPS 180-4: Secure Hash Standard", "https://csrc.nist.gov/pubs/fips/180-4/upd1/final"];
const RFC1321 = ["RFC 1321: MD5", "https://www.rfc-editor.org/rfc/rfc1321"];
const GFM = ["GitHub Flavored Markdown spec", "https://github.github.com/gfm/"];
const MDN_RE = ["MDN: JavaScript regular expressions", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions"];
const WCAG = ["W3C WCAG 2.2: contrast minimum", "https://www.w3.org/TR/WCAG22/#contrast-minimum"];
const YT_THUMB = ["YouTube Help: add custom thumbnails", "https://support.google.com/youtube/answer/72431"];
const RFC9110 = ["RFC 9110: HTTP semantics", "https://www.rfc-editor.org/rfc/rfc9110"];

/** Caveats that apply to every tool of an engine. */
export const ENGINE_LIMITS = {
  calc: ["Results are estimates for planning, rounded to the nearest rupee. Banks, employers and the tax department may round, time or define inputs differently."],
  image: ["Images are re-encoded in your browser, which removes EXIF metadata such as camera details and GPS location."],
  pdf: ["Password-protected PDFs must be unlocked first. Very large files are limited by your device's memory."],
  text: ["Processing happens in your browser tab; very large inputs (several MB) may slow it down."],
  builder: ["Generated code is a starting point: test it in the browsers your visitors use."],
  canvas: ["Text is drawn with fonts available in your browser, so the exact look can vary slightly between devices."],
  study: ["Output is built only from the text you paste, using rules that run on your device rather than a large AI model, so it reflects your notes, including any mistakes in them."],
  unit: [],
  qr: [],
};

const calcSrcLoan = [RBI];

export const DEPTH = {
  // ---------- money & loans ----------
  "emi-calculator": {
    how: "The EMI uses the standard reducing-balance formula that banks use. Each month, interest is charged on the outstanding balance, and the rest of the EMI repays principal, so early EMIs are mostly interest and later ones mostly principal.",
    formula: "EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan amount, r the monthly rate (annual rate ÷ 12 ÷ 100) and n the number of months",
    limits: ["Assumes a fixed rate for the whole tenure. Floating-rate loans change when the lender resets the rate.", "Processing fees, insurance and pre-EMI interest are not included."],
    src: calcSrcLoan,
  },
  "home-loan-calculator": {
    how: "The loan amount is the property price minus your down payment. The EMI is then worked out with the reducing-balance formula, and the total cost adds the down payment to all EMIs.",
    formula: "Loan = price − down payment; EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)",
    limits: ["Stamp duty, registration, processing fees and insurance are not included.", "Assumes a fixed rate; most home loans in India are floating-rate."],
    src: [RBI, ITD],
  },
  "car-loan-calculator": {
    how: "The loan is the on-road price minus the down payment. The EMI uses the reducing-balance formula, and the total cost of the car adds the down payment to all EMIs.",
    formula: "Loan = on-road price − down payment; EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)",
    limits: ["Dealer offers, insurance bundled into the loan and processing fees are not included."],
    src: calcSrcLoan,
  },
  "personal-loan-calculator": {
    how: "The EMI uses the reducing-balance formula. The processing fee is shown separately with 18% GST added, because lenders usually deduct it from the amount they pay out.",
    formula: "EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1); fee = P × fee% × 1.18",
    limits: ["Some lenders quote a flat rate; a flat rate costs more than the same reducing rate."],
    src: calcSrcLoan,
  },
  "sip-calculator": {
    how: "The calculator adds each monthly instalment at the start of the month and grows the balance at the monthly equivalent of your expected return. With a step-up, the instalment rises by that percentage every 12 months.",
    formula: "Each month: balance = (balance + instalment) × (1 + annual return ÷ 1200)",
    limits: ["Mutual fund returns are not fixed. Real returns vary year to year and can be negative.", "Expense ratios, exit loads and capital gains tax are not deducted."],
    src: [AMFI, SEBI],
  },
  "lumpsum-calculator": {
    how: "A one-time investment compounds once a year at the return you expect.",
    formula: "Future value = P × (1 + r ÷ 100)^years",
    limits: ["Market returns are not fixed, and taxes and fund expenses are not deducted."],
    src: [AMFI, SEBI],
  },
  "fd-calculator": {
    how: "Interest is compounded at the frequency you choose; most Indian banks compound quarterly. The effective annual yield shows what the rate is worth after compounding.",
    formula: "Maturity = P × (1 + r ÷ (100 × n))^(n × years), where n is compoundings per year",
    limits: ["TDS and income tax on FD interest are not deducted.", "Senior-citizen and special-tenure rates differ by bank; enter the rate your bank quotes."],
    src: [RBI, DICGC],
  },
  "rd-calculator": {
    how: "Each monthly deposit earns interest compounded quarterly from the month it is made until maturity, which is how most Indian banks calculate recurring deposits.",
    formula: "Maturity = Σ R × (1 + r ÷ 400)^(4k ÷ 12) for each deposit k months before maturity",
    limits: ["Missed instalments and penalties are not modelled.", "TDS on interest is not deducted."],
    src: [RBI, DICGC],
  },
  "ppf-calculator": {
    how: "Each year's deposit is added at the start of the year, and the balance earns the PPF rate once a year. The current rate is set by the government every quarter.",
    formula: "Each year: balance = (balance + deposit) × (1 + rate ÷ 100)",
    limits: ["PPF interest is calculated monthly on the lowest balance between the 5th and the end of the month; the calculator assumes deposits by 5 April.", "The rate can change every quarter; the calculator keeps one rate for the whole period."],
    src: [NSI, DEA],
  },
  "compound-interest-calculator": {
    how: "Your chosen compounding frequency is converted to an equivalent monthly rate, so monthly additions can be added and grown on the same schedule.",
    formula: "Monthly rate = (1 + r ÷ (100 × n))^(n ÷ 12) − 1; each month: balance = balance × (1 + monthly rate) + addition",
    limits: ["Assumes the rate stays the same for the whole period and ignores tax on interest."],
  },
  "simple-interest-calculator": {
    how: "Simple interest is charged only on the original principal. Months are converted to years by dividing by 12, and days by dividing by 365.",
    formula: "SI = P × R × T ÷ 100; total = P + SI",
    limits: ["Most bank deposits and loans compound interest; use the compound interest or FD calculator for those."],
  },
  "swp-calculator": {
    how: "Each month the balance grows at the monthly equivalent of your expected return, and then the withdrawal is taken out. If withdrawals exceed what the balance earns, it eventually runs out, and the calculator shows when.",
    formula: "Each month: balance = balance × (1 + annual return ÷ 1200) − withdrawal",
    limits: ["Market returns vary, so a real SWP can run out sooner or later than shown.", "Capital gains tax on each withdrawal is not deducted."],
    src: [AMFI, SEBI],
  },
  "nps-calculator": {
    how: "Monthly contributions grow until age 60 at your expected return. At 60, the share you choose buys an annuity, and the monthly pension is that amount times the annuity rate, divided by 12.",
    formula: "Corpus = monthly SIP growth to 60; pension = corpus × annuity share × annuity rate ÷ 12",
    limits: ["Returns depend on your fund choices and markets.", "Withdrawal and annuity rules are set by PFRDA and can change; check them before you retire."],
    src: [PFRDA],
  },
  "inflation-calculator": {
    how: "Today's cost is grown by the inflation rate every year to show the future cost. The purchasing-power figure does the reverse, showing what today's money will buy then.",
    formula: "Future cost = cost × (1 + i ÷ 100)^years; future buying power = amount ÷ (1 + i ÷ 100)^years",
    limits: ["Real inflation varies year to year and differs between items such as food, education and health care."],
    src: [MOSPI],
  },
  "loan-prepayment-calculator": {
    how: "The calculator runs the loan month by month, applies your prepayment at the month you choose, and then either keeps the EMI and shortens the tenure, or keeps the tenure and lowers the EMI. Interest saved is the difference from the original schedule.",
    limits: ["Some lenders charge a prepayment fee; RBI rules bar it on floating-rate loans to individuals.", "Lenders may round the new EMI or tenure differently."],
    src: [RBI],
  },
  "loan-eligibility-calculator": {
    how: "Lenders cap the share of your monthly income that can go to EMIs (FOIR). The calculator subtracts your existing EMIs from that limit to find the largest new EMI, then works backwards to the loan that EMI supports.",
    formula: "Max EMI = income × FOIR − existing EMIs; loan = EMI × ((1 + r)^n − 1) ÷ (r × (1 + r)^n)",
    limits: ["Credit score, age, employer category and the property's value also affect what a lender sanctions."],
    src: [RBI],
  },
  "retirement-planner": {
    how: "Your monthly expenses are grown by inflation to your retirement age. The corpus is the amount that, invested at your post-retirement return, pays those inflation-rising expenses until the age you plan for. Your existing savings are grown to retirement, and the monthly SIP needed covers the gap.",
    formula: "Corpus = yearly expense at retirement × (1 − ((1 + g) ÷ (1 + r))^n) ÷ (r − g) × (1 + r)",
    limits: ["Assumes steady inflation and returns; real ones vary.", "Health costs often rise faster than general inflation."],
    src: [AMFI, PFRDA],
  },
  "goal-planner": {
    how: "The goal's cost is grown by inflation to the target year. Savings you already have are grown at your expected return, and the monthly SIP needed covers what remains.",
    formula: "Future cost = cost × (1 + inflation)^years; SIP = gap × i ÷ (((1 + i)^n − 1) × (1 + i))",
    limits: ["Market returns are not fixed, and taxes and fund expenses are not deducted."],
    src: [AMFI],
  },
  "fire-calculator": {
    how: "Your annual expenses are grown by inflation to your target age. The FIRE number is those expenses divided by your safe withdrawal rate. Your existing investments are grown at your expected return, and the monthly investment needed covers the rest.",
    formula: "FIRE number = annual expenses at FIRE age ÷ withdrawal rate",
    limits: ["A safe withdrawal rate is a rule of thumb, not a guarantee; a lower rate is more cautious."],
  },
  "credit-card-payoff-calculator": {
    how: "Each month, interest (plus 18% GST on that interest if selected) is added to the balance and your payment is subtracted, until the balance reaches zero.",
    formula: "Each month: balance = balance + balance × APR ÷ 1200 × 1.18 − payment",
    limits: ["Assumes no new spending, fees or minimum-due penalties.", "Card issuers calculate interest on daily balances, so real figures differ a little."],
    src: [RBI],
  },
  "roi-calculator": {
    how: "ROI compares the gain with the amount invested. CAGR spreads that growth evenly over the holding period, so you can compare investments held for different lengths of time.",
    formula: "ROI = (returned − invested) ÷ invested × 100; CAGR = (returned ÷ invested)^(1 ÷ years) − 1",
    limits: ["Does not account for money added or withdrawn during the period; use XIRR for that."],
  },
  "profit-margin-calculator": {
    how: "Margin is profit as a share of the selling price; markup is profit as a share of the cost. The same sale has a higher markup than margin.",
    formula: "Margin = (price − cost) ÷ price × 100; markup = (price − cost) ÷ cost × 100",
    limits: ["Uses the cost you enter; overheads, GST and discounts are not included unless you add them to the cost."],
  },
  "break-even-calculator": {
    how: "Each unit sold contributes its price minus its variable cost towards fixed costs. Break-even is the number of units at which those contributions cover all fixed costs.",
    formula: "Break-even units = fixed costs ÷ (price − variable cost per unit)",
    limits: ["Assumes price and variable cost stay the same at every sales volume."],
  },

  // ---------- tax & salary ----------
  "income-tax-calculator": {
    how: "The standard deduction is taken off your gross income, the FY 2026-27 slabs are applied band by band, and then the Section 87A rebate (with marginal relief just above ₹12 lakh under the new regime), surcharge on high incomes and 4% health and education cess are applied.",
    formula: "Tax = (slab tax − 87A rebate) × (1 + surcharge) × 1.04",
    limits: ["Special-rate income such as capital gains, lottery winnings and crypto is not handled; include only normally taxed income.", "Under the old regime, enter your deductions yourself; the calculator does not check eligibility."],
    src: [ITD, ITI],
  },
  "old-vs-new-tax-regime": {
    how: "Tax is worked out twice on the same income: under the new regime with its standard deduction only, and under the old regime with the deductions you enter (80C capped at ₹1.5 lakh, 80D, HRA, home loan interest and others). The lower total is the better choice.",
    limits: ["Deduction limits and eligibility are your responsibility to check.", "Salaried people can switch regime each year; business income has stricter rules."],
    src: [ITD, ITI],
  },
  "in-hand-salary-calculator": {
    how: "Basic pay is taken as a share of CTC. Employer PF and gratuity (if part of CTC) are removed to get gross salary, then employee PF, professional tax and income tax under your chosen regime are deducted to get take-home pay.",
    limits: ["Salary structures differ: allowances, variable pay and reimbursements can change the result.", "Professional tax varies by state; enter your state's amount."],
    src: [ITD, EPFO],
  },
  "hra-calculator": {
    how: "Under Section 10(13A), the exempt HRA is the lowest of three amounts: the HRA you receive, rent paid minus 10% of salary, and 50% of salary in the eight listed metros or 40% elsewhere. Salary here means basic plus DA.",
    formula: "Exempt HRA = min(HRA received, rent − 10% of salary, 50% or 40% of salary)",
    limits: ["HRA exemption is available only under the old regime.", "If annual rent is above ₹1 lakh, your employer needs your landlord's PAN."],
    src: [ITI],
  },
  "gratuity-calculator": {
    how: "For employers covered by the Payment of Gratuity Act, gratuity is 15 days' wages for each completed year, using 26 working days a month; a final part-year of more than six months counts as a full year. For employers not covered, 30 days a month is used and only completed years count.",
    formula: "Covered: 15 ÷ 26 × last basic + DA × years; not covered: 15 ÷ 30 × last basic + DA × years",
    limits: ["Usually needs five years of continuous service.", "Up to ₹20 lakh is tax-free for most private-sector employees."],
    src: [LABOUR, ITI],
  },
  "pf-calculator": {
    how: "Each month, 12% of basic + DA from you and the employer's share after the pension (EPS) portion is added to the balance, and interest is credited at the EPF rate. Your basic pay rises by the yearly increase you enter.",
    limits: ["The EPF rate is declared each year and may change.", "The employer's pension (EPS) share goes to the pension scheme and is not part of this balance."],
    src: [EPFO],
  },
  "gst-calculator": {
    how: "To add GST, the rate is applied to the net price. To remove GST from an inclusive price, the price is divided by (1 + rate). Within a state the tax splits equally into CGST and SGST; between states it is charged as IGST.",
    formula: "Add: GST = net × rate ÷ 100; remove: net = gross × 100 ÷ (100 + rate)",
    limits: ["Check the correct rate for your goods or service; rates are set by the GST Council and change from time to time."],
    src: [GST, CBIC],
  },

  // ---------- everyday ----------
  "age-calculator": {
    how: "Whole years and months are counted from your date of birth, and the remaining days are counted using the actual length of each month, so leap years are handled correctly.",
    limits: ["For official purposes, use the age shown on your birth certificate or ID."],
  },
  "percentage-calculator": {
    how: "Each mode uses one formula: what percent A is of B, A percent of B, and the percentage change from A to B.",
    formula: "A as % of B = A ÷ B × 100; change = (B − A) ÷ A × 100",
  },
  "bmi-calculator": {
    how: "BMI is your weight in kilograms divided by the square of your height in metres. It is shown against the WHO ranges and the lower cut-offs suggested for Asian adults.",
    formula: "BMI = weight (kg) ÷ height (m)²",
    limits: ["BMI does not measure body fat directly and can mislead for athletes, older adults and during pregnancy.", "Not for children and teenagers, who need age-specific charts."],
    src: [WHO_ASIA],
  },
  "calorie-calculator": {
    how: "Your resting energy (BMR) is estimated with the Mifflin-St Jeor equation and multiplied by an activity factor to give maintenance calories.",
    formula: "BMR = 10 × kg + 6.25 × cm − 5 × age + 5 (men) or − 161 (women); maintenance = BMR × activity factor",
    limits: ["An estimate for healthy adults; real needs vary by person.", "For weight loss with a medical condition, ask a doctor or registered dietitian."],
    src: [MIFFLIN],
  },
  "date-difference": {
    how: "The days between two dates are counted on the calendar, then also shown as weeks, as calendar months and days, and as Monday–Friday working days. You can choose to include the end date.",
    limits: ["Working days here leave out only Saturdays and Sundays; use the working days calculator for holidays and other weekly offs."],
  },
  "working-days-calculator": {
    how: "Every date in the range is checked against the weekly days off you choose, including the 2nd and 4th Saturday pattern of Indian banks, and against the holidays you list.",
    limits: ["Public holidays differ by state and organisation, so add your own list."],
  },
  "date-add-subtract-calculator": {
    how: "Years and months are added on the calendar first, then days. If the result falls on a day the month does not have, such as 31 February, it moves to the last day of that month.",
  },
  "time-duration-calculator": {
    how: "The end time minus the start time, minus breaks, gives the duration. If the end is earlier than the start, the shift is treated as running past midnight.",
  },
  "unit-converter": {
    how: "Every unit is converted through one base unit in its category, such as metres for length or square metres for area, using standard conversion factors.",
    limits: ["Traditional land units such as bigha and guntha vary by state; check the local value before a property deal."],
  },
  "youtube-money-calculator": {
    how: "Estimated earnings are your views divided by 1,000, multiplied by the RPM you enter. RPM is what you earn per thousand views after YouTube's share.",
    formula: "Earnings = views ÷ 1,000 × RPM",
    limits: ["RPM varies widely by niche, audience country and season; use your own YouTube Studio figures where you can."],
  },

  // ---------- student ----------
  "cgpa-to-percentage-calculator": {
    how: "The calculator applies the formula your board or university uses: CBSE multiplies CGPA by 9.5, many universities multiply by 10, VTU subtracts 0.75 before multiplying by 10, and a 4-point GPA is divided by 4.",
    formula: "CBSE: CGPA × 9.5; VTU: (CGPA − 0.75) × 10; 4-point: GPA ÷ 4 × 100",
    limits: ["Use the formula printed on your marksheet or in your university's regulations; they differ and can change."],
    src: [CBSE],
  },
  "cgpa-calculator": {
    how: "Each semester's SGPA is weighted by its credits, so a semester with more credits counts for more. The target planner works out the SGPA needed in the coming semesters to reach a target CGPA.",
    formula: "CGPA = Σ (SGPA × credits) ÷ Σ credits",
    limits: ["Some universities use a simple average instead of credit weighting; choose that option if yours does."],
  },
  "gpa-calculator": {
    how: "Each subject's grade is converted to grade points on the scale you choose, multiplied by its credits, and the total is divided by total credits.",
    formula: "SGPA = Σ (grade points × credits) ÷ Σ credits",
    limits: ["Grade-point scales differ between universities; check yours."],
  },
  "marks-grade-calculator": {
    how: "Marks are added up and divided by the maximum to give a percentage, and each subject is graded on the scale you choose. The best-of-five option uses your five highest subjects.",
    limits: ["Boards change grading rules; check the current CBSE or state board circular."],
    src: [CBSE],
  },
  "attendance-calculator": {
    how: "Current attendance is classes attended divided by classes held. If you are below the target, the calculator finds how many classes in a row you must attend; if above, how many you can miss and stay at or above it.",
    formula: "Classes needed = ⌈(target × held − 100 × attended) ÷ (100 − target)⌉",
    limits: ["Assumes every class counts equally; labs and medical leave may be counted differently by your college."],
  },
  "exam-countdown": {
    how: "Days left are counted from today to the exam, rest days are removed, and the study hours available are divided across the topics you have left, keeping the revision days you set aside free.",
  },
  "study-hours-planner": {
    how: "Your weekly study time is split across subjects in proportion to their difficulty or weight, then divided into focus sessions of the length you choose.",
  },

  // ---------- AI study ----------
  "notes-summarizer": {
    how: "Sentences are scored by how many of the notes' key terms they contain and where they appear, and the top-scoring ones are kept in their original order. Definitions ('X is …') become the glossary, and each kept sentence gets a cue question for Cornell notes.",
    limits: ["It selects your own sentences rather than rewriting them, so the summary is only as clear as the notes."],
  },
  "flashcard-generator": {
    how: "Definitions, key terms and fact sentences in your notes are turned into question-and-answer cards. Reviewing uses spaced repetition: cards you know come back after longer gaps, and cards you miss come back sooner.",
    limits: ["Check each card; a sentence taken out of context can make a misleading question."],
  },
  "quiz-generator": {
    how: "Key terms are removed from your sentences to make multiple-choice and fill-in questions, with wrong options drawn from other terms in the same notes. True/false questions swap a term for a related one.",
    limits: ["Questions test recall of your notes, not deeper understanding; mix in past papers."],
  },
  "concept-explainer": {
    how: "The explainer pulls the sentences about a concept from your notes and restates them as a short definition, the key points and an example where one exists. If you choose, it can look up a short introduction on Wikipedia; only the concept name is sent.",
    limits: ["Wikipedia text can be incomplete or change; confirm important facts with your textbook."],
  },
  "revision-plan-generator": {
    how: "Topics are spread across the days before your exam, and each one is brought back for review at increasing intervals, so you revisit material just before you are likely to forget it.",
  },

  // ---------- PDF ----------
  "pdf-merger": { how: "The pages of each PDF are copied, in your chosen order, into one new PDF file using the pdf-lib library in your browser. The pages themselves are not re-rendered, so text stays selectable." },
  "pdf-splitter": { how: "The pages you list are copied into one or more new PDF files, without re-rendering, so text and links on those pages stay as they were." },
  "rotate-pdf": { how: "The rotation setting of the chosen pages is changed and the file is saved again. Page content is not re-rendered, so quality does not change." },
  "reorder-pdf-pages": { how: "Thumbnails of each page let you drag pages into a new order, delete or rotate them. The pages are then copied into a new PDF in that order." },
  "jpg-to-pdf": { how: "Each image becomes one page, scaled to fit the page size and margin you choose. JPG and PNG images are embedded as they are; other formats are converted to JPG first." },
  "pdf-to-jpg": { how: "Each page is drawn with pdf.js at the resolution you choose and saved as a JPG or PNG image." },
  "compress-pdf": {
    how: "Each page is redrawn as an image at a lower resolution and saved as JPEG, then placed into a new PDF. With a target size, the tool steps down resolution and quality until the file fits.",
    limits: ["Because pages become images, text in the compressed copy can no longer be selected, searched or copied, and links stop working. Keep the original.", "Files that are already mostly text may not get smaller; the tool tells you when that happens."],
  },
  "pdf-to-text": {
    how: "The text layer of each page is read with pdf.js and joined in reading order, optionally merging lines into paragraphs.",
    limits: ["Scanned PDFs are pictures of pages and have no text layer; they need OCR software.", "Multi-column layouts and tables may come out in a different order."],
  },

  // ---------- image ----------
  "image-compressor": {
    how: "The image is redrawn on a canvas and saved as JPG or WebP at the quality you set. With a target size in KB, the tool searches for the highest quality that fits, and you can also cap the width to shrink large photos further.",
    limits: ["PNG files are lossless, so quality settings do not shrink them much; convert to JPG or WebP for a smaller file."],
  },
  "image-resizer": { how: "The image is redrawn on a canvas at the size you choose in pixels, as a percentage, or in centimetres converted to pixels at the DPI you set. Presets include the 3.5 × 4.5 cm passport and exam photo size." },
  "image-format-converter": { how: "The image is decoded by your browser and saved again in the format you choose. Converting to JPG fills transparent areas with a background colour, because JPG has no transparency." },
  "image-cropper": { how: "You choose an aspect ratio, including a 35 × 45 mm passport ratio, and the selected area is cut out and saved at full resolution." },
  "social-media-image-resizer": { how: "Your image is fitted to the exact pixel size of the platform preset you pick: cropped to fill, fitted whole on a plain background, or fitted on a blurred copy of itself." },
  "favicon-generator": { how: "Your image is scaled to the standard icon sizes and saved as PNG files and a .ico file containing 16, 32 and 48 pixel versions, with the HTML tags to link them." },
  "image-to-base64": { how: "The file's bytes are read and encoded as Base64, then wrapped as a data URI with ready-to-use HTML and CSS snippets.", limits: ["Base64 makes files about a third larger; use it only for small icons and images."], src: [RFC4648] },
  "qr-code-generator": { how: "Your link, UPI details, Wi-Fi settings or text are encoded with the qrcode library into a static QR code. Nothing is tracked and the code never expires, because the data is in the pattern itself.", limits: ["Test the code with your phone before printing; low colour contrast can make it hard to scan."] },

  // ---------- creator ----------
  "youtube-thumbnail-maker": { how: "A 1280 × 720 canvas combines your image, text and colours, and is downloaded as a JPG or PNG ready to upload.", src: [YT_THUMB] },
  "og-image-generator": { how: "A 1200 × 630 canvas is laid out with your title, text and colours and downloaded as an image for the og:image tag.", src: [OGP] },
  "hashtag-organizer": { how: "Hashtags are split out of your text, cleaned of duplicates and stray symbols, counted against platform limits and grouped." },
  "youtube-title-description-helper": { how: "Your title and description are checked against YouTube's length limits and what shows before the 'more' cut, and timestamps are checked for valid chapter formatting." },

  // ---------- text ----------
  "word-counter": { how: "A word is any run of letters or numbers, with hyphens and apostrophes inside words kept as one word. Characters are counted as the letters you see, so emoji and accented letters count once. Reading time assumes about 230 words a minute and speaking time about 140." },
  "character-counter": { how: "Characters are counted as visible symbols, and the count is compared with common limits such as posts on X, SMS segments and meta tags." },
  "case-converter": { how: "Text is converted with fixed rules: upper, lower, sentence and title case for writing, and camelCase, snake_case and kebab-case for code." },
  "fancy-text-generator": { how: "Each letter is swapped for a look-alike character from Unicode's mathematical and decorative alphabets, so the styled text can be pasted anywhere that accepts Unicode.", limits: ["Screen readers may read styled characters oddly, and some apps show them as boxes."] },
  "slug-generator": { how: "Text is lower-cased, accents are removed, anything that is not a letter or number becomes a hyphen, and optional stop words are dropped." },
  "lorem-ipsum-generator": { how: "Placeholder text is built from the classic lorem ipsum word list into the number of words, sentences or paragraphs you ask for." },
  "duplicate-line-remover": { how: "Lines are compared one by one and only the first occurrence of each is kept, optionally ignoring case and surrounding spaces." },
  "remove-empty-lines": { how: "Lines that are empty or contain only spaces are removed, or runs of blank lines are collapsed into one." },
  "sort-lines-az": { how: "Lines are sorted alphabetically using language-aware comparison, so accented letters and numbers sort naturally." },
  "number-lines": { how: "A number and separator are added to the start of each line, or existing leading numbers are removed." },
  "trim-text": { how: "Spaces at the start and end of each line are removed and runs of spaces inside lines can be collapsed into one." },
  "text-summarizer": { how: "Sentences are scored by how many of the text's most frequent meaningful words they contain, and the highest-scoring ones are kept in their original order.", limits: ["It picks existing sentences rather than rewriting them."] },

  // ---------- writing ----------
  "email-writer": { how: "Your details are placed into a structured template for the kind of email or letter you choose." },
  "resume-bullet-improver": { how: "Each bullet is checked for a weak opening, pronouns, tense, passive voice and a missing number, and a rewrite is suggested starting with a strong action verb." },
  "prompt-builder": { how: "Your role, task, context, constraints and answer format are assembled into a structured prompt you can paste into any AI assistant." },
  "meeting-notes-organizer": { how: "Lines are sorted into attendees, decisions, action items, open questions and notes by their wording, and owners and due dates are picked out where they are written." },

  // ---------- developer ----------
  "json-formatter": { how: "Your JSON is parsed with the browser's JSON parser and printed again with consistent indentation. If it does not parse, the error is shown with its line and column.", src: [RFC8259] },
  "json-validator": { how: "The text is parsed with the browser's JSON parser; on failure the exact line and column of the problem is shown, with a hint for common mistakes such as trailing commas.", src: [RFC8259] },
  "json-minifier": { how: "The JSON is parsed and printed again without any spaces or line breaks.", src: [RFC8259] },
  "json-to-csv": { how: "Each object in an array becomes a row. Nested objects are flattened into column names joined by dots, and values containing commas or quotes are escaped.", src: [RFC4180] },
  "csv-to-json": { how: "The delimiter is detected, the first row is used as keys and each following row becomes an object. Quoted fields with commas or line breaks are handled.", src: [RFC4180] },
  "json-to-yaml": { how: "The JSON is parsed and written out as YAML with the js-yaml library.", src: [YAML] },
  "yaml-to-json": { how: "The YAML is parsed with the js-yaml library and printed as formatted JSON.", limits: ["Comments and anchors in YAML are not carried over to JSON."], src: [YAML] },
  "json-to-xml": { how: "Keys become element names and arrays become repeated elements, with characters that XML does not allow escaped." },
  "xml-to-json": { how: "The XML is parsed by your browser and converted element by element into JSON. Attributes are kept as keys starting with @." },
  "json-to-typescript": { how: "Types are inferred from the values in your JSON. Nested objects become their own interfaces, and arrays with mixed values become union types." },
  "json-compare": { how: "Both documents are parsed and walked key by key, and every added, removed or changed value is listed by its path. Key order is ignored." },
  "sql-formatter": { how: "The query is re-indented and keywords are capitalised with the sql-formatter library, using the dialect you choose." },
  "html-minifier": { how: "Comments and unnecessary whitespace are removed, while the contents of pre, textarea, script and style blocks are left as they are." },
  "css-minifier": { how: "Comments, whitespace and the last semicolon in each block are removed. Values are not rewritten." },
  "css-beautifier": { how: "Rules are re-indented with one declaration per line." },
  "javascript-minifier": { how: "Comments and whitespace are removed without renaming or rewriting code. Strings, template literals and regular expressions are copied exactly, and line breaks are kept wherever removing them could change automatic semicolon insertion.", limits: ["It does not shorten variable names, so a build tool such as esbuild or Terser will produce smaller files."] },
  "markdown-to-html": { how: "Markdown is converted with the marked library, including GitHub-style tables and task lists.", src: [GFM] },
  "regex-tester": { how: "Your pattern runs with your browser's JavaScript regular expression engine, and every match and capture group is highlighted.", limits: ["JavaScript regex syntax differs from PCRE, Python and Java in places such as lookbehind support and named groups."], src: [MDN_RE] },
  "jwt-decoder": { how: "The header and payload are Base64URL-decoded and shown as JSON, with exp, iat and nbf times converted to readable dates.", limits: ["Decoding does not verify the signature; do that on your server with the key."], src: [RFC7519] },
  "timestamp-converter": { how: "Unix timestamps in seconds or milliseconds are converted to dates in IST and UTC, and dates back to timestamps." },
  "uuid-generator": { how: "UUIDs are made from your browser's cryptographic random number generator. Version 7 puts a millisecond timestamp first so IDs sort by creation time.", src: [RFC9562] },

  // ---------- encoding & security ----------
  "base64-encode": { how: "Text is converted to UTF-8 bytes and then Base64-encoded, with an option for the URL-safe alphabet.", src: [RFC4648] },
  "base64-decode": { how: "Base64 or URL-safe Base64 is decoded to bytes and shown as UTF-8 text.", src: [RFC4648] },
  "url-encode": { how: "Characters that are not allowed in URLs are percent-encoded from their UTF-8 bytes. Component mode also encodes characters like / ? & =, full-URL mode leaves them.", src: [RFC3986] },
  "url-decode": { how: "Percent-encoded sequences are decoded back to UTF-8 text, with an option to treat + as a space.", src: [RFC3986] },
  "url-parser": { how: "The URL is parsed with the browser's URL parser into protocol, host, port, path, query parameters and fragment, with each value decoded.", src: [RFC3986] },
  "html-escape": { how: "Characters with special meaning in HTML, such as < > & and quotes, are converted to entities, or entities are converted back." },
  "binary-converter": { how: "Text is converted to UTF-8 bytes and each byte is shown in binary, hexadecimal, decimal or octal; the reverse turns byte values back into text." },
  "sha256-generator": { how: "Hashes are computed with your browser's built-in Web Crypto API (SHA-1, SHA-256 and SHA-512).", src: [FIPS] },
  "md5-generator": { how: "The MD5 digest of the UTF-8 text is calculated in your browser.", limits: ["MD5 is broken for security; use it only for checksums, never for passwords."], src: [RFC1321] },
  "password-generator": { how: "Passwords and passphrases are built from your browser's cryptographic random number generator.", limits: ["Store generated passwords in a password manager."] },
  "password-strength-checker": { how: "Strength is estimated in bits from the password's length and character variety, with a warning for common passwords and simple variations of them, such as letters swapped for numbers. Crack time assumes 100 guesses a second online and 10 billion offline.", limits: ["An estimate only; a password that has appeared in a data breach is weak whatever its score."] },

  // ---------- SEO ----------
  "meta-tag-generator": { how: "Your title, description and options are written out as standard meta tags, with a preview of how the result may look in Google.", src: [G_TITLE, G_SNIP] },
  "serp-snippet-preview": { how: "Your title and description are measured in estimated pixel width, using character widths close to Google's fonts, and cut where Google typically truncates them.", limits: ["Google may rewrite titles and descriptions, so the live result can differ."], src: [G_TITLE, G_SNIP] },
  "meta-title-description-checker": { how: "Length is measured in characters and in estimated pixel width, and both fields are checked for the focus keyword you enter.", src: [G_TITLE, G_SNIP] },
  "keyword-density-checker": { how: "Words, two-word and three-word phrases are counted and shown as a share of all words, optionally ignoring common stop words.", limits: ["There is no ideal keyword density; write for readers and use this to spot accidental repetition."] },
  "robots-generator": { how: "Your choices are written out as robots.txt groups, including rules for AI crawlers, and a Sitemap line.", src: [G_ROBOTS, RFC9309] },
  "robots-txt-tester": { how: "Your robots.txt is parsed the way RFC 9309 describes: the most specific user-agent group applies, and the longest matching Allow or Disallow rule wins.", limits: ["Blocking a URL stops crawling, not indexing; use noindex to keep a page out of results."], src: [RFC9309, G_ROBOTS] },
  "sitemap-validator": { how: "The XML you paste is parsed and checked against the sitemap protocol: valid structure, absolute URLs, the 50,000-URL and 50 MB limits, lastmod date format and duplicate URLs.", limits: ["It checks the file you paste; it does not fetch the URLs to confirm they return 200."], src: [SITEMAPS] },
  "open-graph-generator": { how: "Your title, description, image and URL are written out as Open Graph and X card tags.", src: [OGP] },
  "open-graph-preview": { how: "The og: and twitter: tags in the HTML you paste are read and shown as approximate Facebook, X, LinkedIn and WhatsApp cards.", limits: ["Platforms cache previews; use their own debugging tools to refresh a changed card."], src: [OGP] },
  "canonical-checker": { how: "The HTML you paste is checked for the rel=canonical tag, how many there are, whether the URL is absolute, and conflicts with robots meta tags.", src: [G_CANON] },
  "http-header-checker": { how: "The response headers you paste (for example from curl -sIL) are checked for status codes, redirect chains, caching and security headers.", limits: ["It reads headers you paste; it does not request the URL itself."], src: [RFC9110] },

  // ---------- design ----------
  "color-picker": { how: "Colours are converted between HEX, RGB and HSL, and the contrast ratio between two colours is calculated with the WCAG formula.", formula: "Contrast = (L1 + 0.05) ÷ (L2 + 0.05), where L is relative luminance", src: [WCAG] },
  "gradient-generator": { how: "Your colour stops, angle and type are written out as a CSS linear-gradient or radial-gradient with a live preview." },
  "css-shadow-generator": { how: "Each shadow layer's offset, blur, spread and colour is combined into one box-shadow value." },
  "glassmorphism-generator": { how: "A semi-transparent background, backdrop-filter blur and saturation, border and radius are combined into CSS, with the -webkit- prefix for Safari." },
};
