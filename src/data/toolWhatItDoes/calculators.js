export default {
  "/calculators/age-calculator": {
    paragraphs: [
      "An age calculator turns two calendar dates into a precise breakdown of years, months, and days lived or elapsed between events. Instead of mentally subtracting dates and guessing whether a birthday has passed this year, you enter a date of birth and a reference date—often today—and receive a clear age statement such as 34 years, 7 months, and 12 days. That level of detail matters for school admissions, insurance quotes, retirement planning, visa applications, and any form that asks for age in completed years rather than a rough estimate.",
      "The underlying logic follows standard calendar arithmetic. The tool compares year, month, and day components, borrowing from higher units when the day in the reference month is smaller than the birth day, and adjusting for varying month lengths including February in leap years. Leap-year rules (divisible by 4, except centuries unless divisible by 400) are applied so someone born on 29 February is handled consistently when the reference year is not a leap year. Results reflect civil calendar age, not astronomical or timezone-adjusted duration.",
      "FreeToolsPro offers this age calculator so you can verify eligibility thresholds, plan milestone celebrations, or document exact tenure without installing software. Parents confirming cut-off dates for nursery entry, HR teams calculating years of service, and genealogists measuring lifespans all benefit from the same straightforward input: pick dates, read the breakdown, and move on with confidence."
    ],
    sections: [
      {
        title: "Who uses exact age breakdowns",
        paragraphs: [
          "Government and institutional forms frequently require age as of a specific date, not merely the current year minus birth year. A child born in October may be ineligible for a January school intake even if a quick subtraction suggests they are six. Sports leagues with age bands, senior citizen discounts, and medical dosing guidelines that change at exact month boundaries all depend on completed years and sometimes months. Legal contracts referencing majority age or cooling-off periods also need unambiguous figures tied to calendar dates.",
          "Beyond compliance, exact age supports personal planning. Counting down to a 18th or 65th birthday, measuring how long a project phase has run, or stating how old a business incorporation date makes a company are everyday tasks that benefit from months and days, not just years. When you share results, quoting the full breakdown reduces back-and-forth clarification."
        ]
      },
      {
        title: "How the calculation works",
        paragraphs: [
          "Conceptually, the calculator performs cascading subtraction: years first, then months if the reference month is earlier in the year than the birth month, then days if the reference day is earlier in the month than the birth day. When borrowing is required, one month is subtracted from the month count and added to the day count using the actual length of the prior month. This mirrors how people count age on paper, which is why the output aligns with official expectations in most jurisdictions.",
          "Total days or weeks between dates can be derived separately; civil age in years-months-days is not the same as dividing total elapsed hours by 24 because calendar months are irregular. FreeToolsPro presents the conventional Y-M-D format users expect on applications. For very old dates or historical genealogy, ensure the Gregorian calendar applies to the region and period you are studying, since pre-reform calendars are outside the scope of a modern web tool."
        ]
      },
      {
        title: "Limitations and good practice",
        paragraphs: [
          "Timezone and time-of-day are ignored: only the date portion counts. Someone born late at night in one timezone and evaluated in another may see a one-day difference only if the reference date crosses midnight boundaries in a system that stored timestamps; this tool works on dates you select explicitly. Premature infant gestational age, corrected age for NICU follow-up, and cultural lunar-calendar birthdays require specialist calculators, not a standard Gregorian age tool.",
          "Always cross-check critical eligibility with the issuing authority's published rules. A calculator is an aid, not a legal determination. For recurring checks, bookmark the page and keep birth dates consistent—typos in day or month fields are the most common source of wrong output. When documenting results, note the reference date alongside the age so future readers understand the context."
        ]
      }
    ]
  },

  "/calculators/bmi-calculator": {
    paragraphs: [
      "Body Mass Index (BMI) is a widely used screening number that relates body weight to height, giving a single figure doctors, insurers, and fitness apps use to classify underweight, normal weight, overweight, and obesity ranges. The BMI Calculator on FreeToolsPro accepts measurements in metric (kilograms and centimetres) or imperial (pounds and feet/inches), converts internally to consistent units, and applies the standard formula so you do not have to memorise conversion factors or square height manually.",
      "BMI equals weight divided by height squared, with height expressed in metres when weight is in kilograms. In imperial form, the same relationship holds after converting pounds to kilograms and inches to metres, or by using the conventional 703 multiplier with pounds and inches squared. The output is a unitless index—typically between roughly 15 and 40 for adults—mapped to category bands defined by organisations such as the World Health Organization. It is a population-level screening tool, not a direct measure of body fat percentage.",
      "Use this calculator when you need a quick checkpoint before a GP visit, when tracking a weight-loss programme's direction, or when a form asks for BMI and you only have bathroom-scale and tape-measure data. Trainers screening clients, students learning public-health metrics, and travellers completing health declarations all reach for BMI because it is fast and internationally recognised, even though it has well-known blind spots."
    ],
    sections: [
      {
        title: "Metric and imperial inputs explained",
        paragraphs: [
          "In metric mode, enter weight in kilograms and height in centimetres; the tool divides centimetres by 100 to obtain metres before squaring. A person at 72 kg and 175 cm has height 1.75 m; squared that is 3.0625; BMI is 72 ÷ 3.0625 ≈ 23.5, often labelled normal weight. In imperial mode, height may be split into feet and inches to reduce entry errors; the calculator normalises to total inches, applies the 703 × weight / height² formula, and shows the same index as the metric path would for equivalent measurements.",
          "Switching systems is useful when your scale reads stones or pounds but clinical literature uses kg, or when gym equipment is labelled in mixed units. FreeToolsPro handles conversion so you compare results against WHO charts without manual arithmetic. Always measure height standing straight and weight at a consistent time of day; small input differences noticeably shift BMI at shorter heights."
        ]
      },
      {
        title: "Who benefits from BMI screening",
        paragraphs: [
          "Primary-care teams use BMI as an initial filter for discussing nutrition, activity, and further tests such as waist circumference or blood lipids. Workplace wellness programmes and insurance questionnaires often request BMI because it is cheap to collect and correlates with some population health risks. For individuals, periodic BMI checks alongside waist measurement and strength metrics help you see whether lifestyle changes are moving the needle in the intended direction.",
          "Parents should interpret child and teen BMI only against age- and sex-specific growth charts; adult cut-offs do not apply to paediatric patients. Athletes with high lean mass may register overweight by BMI while carrying low visceral fat—context matters. Older adults with muscle loss might look normal by BMI while still carrying excess fat; geriatric assessments often supplement BMI with grip strength and gait tests."
        ]
      },
      {
        title: "What BMI cannot tell you",
        paragraphs: [
          "BMI does not distinguish muscle from fat, bone density, or hydration. A rugby forward and a sedentary person of the same height and weight can share an identical index with very different metabolic profiles. It also does not show fat distribution; central adiposity carries different risk than weight carried in limbs, which is why clinicians may add waist-to-height ratio or imaging where indicated.",
          "Pregnancy, oedema, and certain medications affect weight independently of adiposity. Do not use BMI as a sole diagnostic label. FreeToolsPro provides the arithmetic faithfully; medical interpretation belongs with qualified professionals. If your BMI falls outside the normal band, treat it as a prompt for balanced conversation about diet, movement, sleep, and stress—not as a judgment of personal worth or fitness dedication."
        ]
      }
    ]
  },

  "/calculators/calorie-calculator": {
    paragraphs: [
      "A calorie calculator estimates how much energy your body needs each day by combining Basal Metabolic Rate (BMR)—calories burned at complete rest—with an activity multiplier to produce Total Daily Energy Expenditure (TDEE). From that foundation it can suggest calorie targets for maintenance, fat loss, or muscle gain, and optionally split protein, carbohydrate, and fat into gram targets aligned with common macro ratios. FreeToolsPro brings these figures together so meal planning starts from numbers tied to your sex, age, weight, height, and activity level rather than generic 2,000-calorie labels on packaging.",
      "BMR formulas such as Mifflin–St Jeor estimate maintenance energy from anthropometrics: for many adults, BMR ≈ (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + a sex constant. TDEE multiplies BMR by factors roughly from 1.2 (sedentary) through 1.9 (very active). A 30-year-old office worker and a manual labourer of the same size can differ by 600–900 kcal per day at TDEE, which explains why copy-paste diet templates fail for diverse lifestyles.",
      "Whether you are counting calories for the first time, adjusting macros for strength training, or explaining energy needs to a client, this tool translates physiology into actionable daily budgets. It supports informed decisions—how large a deficit is reasonable, whether protein is adequate for lean mass retention—while reminding you that formulas approximate metabolism, not measure it in a laboratory."
    ],
    sections: [
      {
        title: "BMR, TDEE, and macro splits",
        paragraphs: [
          "BMR covers breathing, circulation, cell repair, and organ function without deliberate exercise. TDEE adds walking, workouts, job-related movement, and non-exercise activity thermogenesis (fidgeting, standing desks). Selecting an honest activity tier matters more than choosing the newest diet trend; overstating activity inflates calorie allowances and slows fat-loss progress, while understating can leave you under-fuelled for training.",
          "Macro splits express what share of calories comes from protein (4 kcal/g), carbohydrate (4 kcal/g), and fat (9 kcal/g). A moderate approach might allocate 30% protein, 40% carbohydrate, 30% fat; endurance athletes often raise carbs, while some low-carb protocols shift toward fat. FreeToolsPro shows gram weights so you can log food in apps that track macros directly, bridging the gap between percentage templates and kitchen scales."
        ]
      },
      {
        title: "Practical use cases",
        paragraphs: [
          "Fat-loss plans typically subtract 300–500 kcal below TDEE to target gradual weight reduction while preserving muscle when protein stays near 1.6–2.2 g per kg body weight and resistance training continues. Muscle-gain phases add a modest surplus—often 200–400 kcal—because excessive surplus mostly increases fat gain. Maintenance mode matches TDEE for recomposition or habit stabilisation between diet phases.",
          "Dietitians use estimates as starting points, then adjust after two to three weeks of weighed food logs and scale trends. People with thyroid disorders, recovering from illness, or on GLP-1 medications should treat outputs as loose guides and follow clinician advice. The calculator also helps educators demonstrate why taller, heavier, younger individuals generally need more energy than shorter, lighter, older ones at the same activity level."
        ]
      },
      {
        title: "Limitations you should respect",
        paragraphs: [
          "Formula-based BMR ignores genetics, gut microbiome, sleep quality, and adaptive thermogenesis during prolonged dieting. Two people matching every input can differ by 10–15% in real expenditure. Menstrual cycle phase, heat exposure, and illness temporarily shift needs. No online TDEE is a substitute for metabolic testing if medical nutrition therapy is required.",
          "Children, pregnant or breastfeeding individuals, and those with eating disorders need specialised guidance—not generic adult equations. FreeToolsPro outputs rounded numbers for clarity; your body does not require hitting the target to the single calorie. Use weekly averages, adjust in small steps, and prioritise protein, fibre, hydration, and sleep alongside the calorie figure this tool provides."
        ]
      }
    ]
  },

  "/calculators/emi-calculator": {
    paragraphs: [
      "Equated Monthly Instalment (EMI) is the fixed payment borrowers repay each month on term loans, blending principal repayment and interest into one predictable figure. The EMI Calculator on FreeToolsPro accepts loan amount, annual interest rate, and tenure in months or years, then applies the standard amortising loan formula to show your monthly obligation before you sign a sanction letter or compare lender offers.",
      "For a reducing-balance loan, EMI derives from P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is principal, r is the monthly interest rate (annual rate divided by 12), and n is the number of monthly instalments. Because interest is charged on the outstanding balance, early payments are interest-heavy and later payments retire more principal—a pattern this EMI figure summarises without listing every row of a schedule.",
      "Home buyers sizing affordability, car shoppers comparing showroom finance, and personal-loan applicants evaluating whether a ₹5 lakh renovation fits the monthly budget all use EMI math repeatedly. FreeToolsPro keeps the arithmetic transparent so you can sanity-check bank apps, negotiate tenure instead of rate, or explain to a co-borrower why a longer term lowers EMI but raises total interest paid."
    ],
    sections: [
      {
        title: "Reading inputs and outputs",
        paragraphs: [
          "Principal should reflect the net disbursed amount you borrow, not necessarily the property sticker price minus a rough down payment—include processing fees if they are financed. Enter the nominal annual interest rate your lender quotes; the calculator converts to a monthly rate by dividing by 12. Tenure must match how the lender states the term: a five-year car loan is 60 months, while some home loans are quoted in years but billed monthly.",
          "Output EMI is usually rounded to the nearest rupee or currency unit as banks do in practice. Small rounding differences versus a lender PDF are normal. If you choose a flat-rate promotional scheme or interest-only initial years, results from a standard reducing-balance EMI model will not match; those products need specialised calculators with step-up or bullet repayment logic."
        ]
      },
      {
        title: "Who benefits from EMI estimates",
        paragraphs: [
          "First-time borrowers use EMI to apply the 40–50% debt-to-income heuristic: total EMIs should often stay below half of take-home pay, subject to lender policy. Investors comparing rental yield to mortgage EMI on an investment flat need the monthly number beside expected rent and maintenance. Small-business owners financing equipment weigh EMI against projected cash inflows from the asset.",
          "Loan officers and brokers run quick scenarios during calls; consumers should run the same scenarios independently on FreeToolsPro to avoid surprise fees buried outside the EMI line item. Comparing two offers at different rates but identical EMI can reveal hidden tenure stretching—always check total interest alongside monthly comfort."
        ]
      },
      {
        title: "Limitations and planning tips",
        paragraphs: [
          "Displayed EMI assumes fixed rate for the full tenure. Floating-rate home loans reset with benchmark changes; actual payments drift unless you refinance or prepay. Processing charges, insurance premiums bundled into EMI, moratoriums, and prepayment penalties are not part of the basic formula. Tax benefits on home loan interest reduce effective cost but do not change the cash EMI leaving your account.",
          "Use this calculator for planning and comparison, then confirm with the lender's amortisation schedule before disbursement. If EMI strains your budget, explore larger down payment, longer tenure with awareness of total interest, or a less expensive asset—not informal borrowing at higher rates to close a gap. FreeToolsPro helps you enter negotiations knowing the maths lenders use."
        ]
      }
    ]
  },

  "/calculators/sip-calculator": {
    paragraphs: [
      "Systematic Investment Plan (SIP) calculators project how regular mutual fund contributions might grow over time given an assumed rate of return. You enter a monthly investment, investment horizon in years, and expected annual return; the tool compounds each instalment as if it were invested at the end of each period, showing estimated maturity value and wealth gained over principal invested. FreeToolsPro makes this projection accessible without spreadsheet macros, helping retail investors in India and elsewhere visualise long-term compounding.",
      "Each SIP instalment is a fresh lump sum that compounds for the remaining months until the horizon ends. Mathematically, the future value of a series of equal payments at periodic rate i over n periods resembles FV = P × [((1 + i)^n − 1) / i] × (1 + i) for end-of-month investments, though implementations may vary slightly in timing assumptions. Small differences in stated return or day-count convention explain why two websites rarely match to the rupee—directional insight matters more than the last digit.",
      "Parents saving for education, salaried employees routing ₹5,000 monthly into index funds, and financial educators demonstrating why starting early beats chasing timing all rely on SIP projections. The calculator does not pick funds or predict markets; it answers a narrower question: if contributions continue and returns average X%, what corpus might you expect?"
    ],
    sections: [
      {
        title: "How SIP compounding builds wealth",
        paragraphs: [
          "Compounding means returns earn further returns. In year one, a modest gain applies to a small base; by year fifteen, the base includes fourteen years of prior contributions and accumulated gains, so the same percentage return adds more absolute rupees. SIP enforces rupee-cost averaging behaviour—you buy more units when markets dip and fewer when prices soar—which smooths entry prices psychologically even though it is not a guarantee of superior returns versus lump-sum investing in every scenario.",
          "Expected return is the most sensitive assumption. Equity-oriented SIPs historically have seen wide year-to-year swings; using 12% because a friend cited it can overstate likely outcomes. Conservative planners model 10–11% for long equity horizons and lower figures for debt hybrid funds. FreeToolsPro lets you rerun scenarios at 8%, 10%, and 12% to see a range rather than a single heroic number."
        ]
      },
      {
        title: "Practical planning scenarios",
        paragraphs: [
          "Step-up SIPs—increasing the monthly amount annually with salary hikes—are not always captured in a basic flat SIP form; mentally add 5–10% yearly contribution growth or rerun the calculator with higher monthly amounts for later career phases. Goal-based planning works backward: desired corpus, years left, assumed return, solve for required monthly SIP using trial inputs until maturity value fits the goal.",
          "Taxes, expense ratios, exit loads, and ELSS lock-in affect spendable wealth but sit outside a gross return assumption. Distributors and RIAs should pair calculator output with fund factsheets. Individuals comparing SIP in direct plans versus regular plans should reduce expected return by the ongoing expense ratio difference to approximate net compounding."
        ]
      },
      {
        title: "Limitations and disciplined expectations",
        paragraphs: [
          "Past performance does not assure future results. Market crashes early in a SIP journey can leave you below projected lines for years before recovery. The calculator assumes uninterrupted contributions; real life includes job gaps and emergency withdrawals. It also assumes a constant return each year, while actual paths are volatile sequences that produce different terminal wealth at the same arithmetic average return.",
          "Regulatory disclaimers on mutual fund advertising apply here too: projections are illustrative. Use FreeToolsPro to build habit and horizon awareness, not certainty. Review asset allocation, diversify across asset classes, maintain an emergency fund outside equities, and increase SIP amounts when income grows rather than chasing unrealistic return assumptions to meet a dream corpus on paper."
        ]
      }
    ]
  },

  "/calculators/inflation-calculator": {
    paragraphs: [
      "Inflation erodes purchasing power: the same currency buys fewer goods and services over time as prices rise. An inflation calculator answers forward and backward questions—what a basket costing ₹10,000 today might cost in ten years at a stated inflation rate, or what historical rupees equate to in today's terms. FreeToolsPro applies compound growth to price levels so you think in real purchasing power, not nominal bank balances that look larger on statements but buy less at the till.",
      "The core relationship mirrors compound interest: Future Value ≈ Present Value × (1 + inflation rate)^number of years. An average 6% annual inflation doubles rough prices in about twelve years. Deflation is rare in modern consumer economies but mathematically flips the sign, implying cheaper future baskets. Most users model positive inflation aligned with central bank targets or long-run CPI experience in their country.",
      "Retirees estimating whether a fixed pension keeps pace, journalists adjusting historical wages for comparison, and students learning macroeconomics all use inflation arithmetic. The tool supports financial planning conversations about whether savings accounts, bonds, or equity returns are likely to outpace price rises after tax—without replacing professional retirement modelling that includes cash flows and multiple expense categories."
    ],
    sections: [
      {
        title: "Forward and backward adjustments",
        paragraphs: [
          "Forward projection asks: if inflation averages 5% for 15 years, what might today's ₹8 lakh annual expenses become? Multiply by (1.05)^15 ≈ 2.08, suggesting roughly ₹16.6 lakh needed for a similar lifestyle—before lifestyle inflation from upgraded consumption. Backward adjustment deflates historical amounts: ₹50,000 salary in 2000 might equate to well over ₹2 lakh in today's rupees depending on cumulative CPI, explaining why parents' anecdotes about cheap college fees feel disconnected from current fee schedules.",
          "Choose an inflation rate consistent with your planning horizon. Trailing ten-year CPI might differ from RBI medium-term targets or from sector-specific inflation—education and healthcare often outpace headline CPI. FreeToolsPro uses the rate you supply; sensitivity analysis with 4%, 6%, and 8% reveals how fragile long plans are to assumption error."
        ]
      },
      {
        title: "Who should run inflation math",
        paragraphs: [
          "Anyone building a retirement corpus should separate nominal account growth from real growth (nominal return minus inflation). A 9% portfolio return with 6% inflation yields roughly 3% real expansion of purchasing power. Fixed-income retirees on annuities without escalation clauses face explicit inflation risk visible only when future costs are projected.",
          "Businesses pricing multi-year maintenance contracts, landlords indexing rents, and governments indexing tax brackets use related formulas with policy-specific indices. Journalists normalising GDP or wages for decade comparisons rely on the same compound logic. Students grasping why lenders charge interest above inflation to compensate savers also benefit from hands-on numbers."
        ]
      },
      {
        title: "Limitations and interpretation",
        paragraphs: [
          "Headline CPI is an average basket; your personal inflation depends on spending mix—fuel, rent, tuition, medicine weights differ. The calculator does not model variable year-by-year rates unless you rerun it per period. Hyperinflation, currency redenomination, and structural breaks in index series make long backward comparisons approximate for some economies.",
          "Nominal wage growth often partially offsets inflation; planning only future prices without income growth paints an overly bleak picture. Conversely, assuming investment returns without subtracting inflation overstates real progress. FreeToolsPro gives disciplined compound arithmetic; pair results with diversified investing, inflation-linked bonds where available, and periodic plan reviews rather than treating one projection as fate."
        ]
      }
    ]
  },

  "/calculators/ppf-calculator": {
    paragraphs: [
      "Public Provident Fund (PPF) is a long-term, government-backed savings scheme popular in India, offering tax benefits under Section 80C on contributions, tax-free interest accrual, and tax-free maturity proceeds subject to current rules. The PPF Calculator on FreeToolsPro projects account balance at maturity or after a chosen period, factoring annual contributions, the prevailing or assumed PPF interest rate, and the 15-year minimum lock-in structure extended by five-year blocks thereafter.",
      "Interest on PPF is typically compounded annually and credited yearly, calculated on the lowest balance between the fifth and last day of each month—so deposits before the 5th earn interest from that month, a detail disciplined savers calendar around. The rate is set quarterly by the government and has ranged in recent years near 7–8% annually, though you should enter the rate applicable to your planning scenario rather than relying on outdated headlines.",
      "Salaried taxpayers maximising 80C room, parents opening minor PPF accounts, and conservative investors diversifying beyond pure equity SIPs use PPF projections to see how ₹1.5 lakh yearly deposits accumulate over decades. FreeToolsPro translates scheme rules into numbers so you compare PPF alongside EPF, NPS, and debt mutual funds without manual year-by-year ledgers."
    ],
    sections: [
      {
        title: "Contribution rules and tax treatment",
        paragraphs: [
          "Minimum annual deposit requirements and maximum caps (historically ₹1.5 lakh per financial year across self and minor accounts combined under one guardian's planning) shape feasible schedules. Missing minimum deposits can render an account inactive until revived with fees and backlog contributions. Contributions qualify for 80C deduction within the overall ₹1.5 lakh 80C ceiling shared with insurance, ELSS, and other instruments.",
          "Interest and maturity amounts are exempt from income tax under current Indian law, making effective return comparison use pre-tax equivalents for taxable FDs. Partial withdrawals and loans against PPF are permitted from specified years subject to balances and limits—this basic calculator focuses on accumulation, not withdrawal scheduling. Always verify live rules on official government or bank PPF pages before acting."
        ]
      },
      {
        title: "How balances grow over time",
        paragraphs: [
          "Each year's opening balance plus contributions earns interest at the stated rate, then becomes next year's base. Because compounding is annual, intra-year contribution timing affects how much of that year's interest base each deposit enjoys—front-loading before the 5th of April can marginally improve returns versus lump sums in March. Over 15 years of maximum contributions at 7.1%, corpus can reach well over ₹40 lakh from roughly ₹22.5 lakh deposited, with interest doing heavy lifting in later years.",
          "Extensions in five-year blocks after year 15 continue compounding with optional further contributions. FreeToolsPro lets you test different contribution levels if you cannot invest the full cap every year—many users deposit ₹50,000–₹1 lakh annually and still build meaningful safety-net wealth with low credit risk compared to corporate deposits."
        ]
      },
      {
        title: "Limitations and portfolio role",
        paragraphs: [
          "PPF rates change; long projections using today's rate overstate or understate outcomes if rates cycle. Liquidity is poor by design—early exit is generally limited to specific hardships after initial years. Nomination, minor account governance, and NRI eligibility restrictions are legal details calculators omit.",
          "PPF suits long horizons and capital preservation, not beating equity over 20 years in every historical window. Use FreeToolsPro to anchor the debt portion of a retirement mosaic, not to time rate arbitrage. Pair projections with documented account statements from your bank or post office, and treat online estimates as planning aids aligned with official passbook figures at year-end."
        ]
      }
    ]
  },

  "/calculators/loan-eligibility-calculator": {
    paragraphs: [
      "Loan eligibility calculators estimate how much a lender might approve based on income, existing EMIs, interest rate, and tenure—often using Fixed Obligation to Income Ratio (FOIR) rules common among Indian banks and housing finance companies. FOIR caps the share of net monthly income that can go toward all loan obligations, typically near 50–60% for salaried applicants, leaving headroom for living expenses and new EMI. FreeToolsPro reverse-engineers approximate maximum fresh EMI and loan amount from the inputs you provide.",
      "If net income is ₹80,000 and FOIR is 50%, total EMIs may be capped around ₹40,000. Existing car and personal loan EMIs of ₹12,000 leave roughly ₹28,000 for a new home loan EMI, which at a given rate and 20-year tenure maps to a principal via standard EMI inversion. Lenders also apply age at maturity, credit score, property valuation, and employer category filters this tool cannot see.",
      "Prospective home buyers pre-qualifying before site visits, loan agents setting expectations, and co-applicants combining incomes use eligibility math to avoid falling in love with properties outside borrowing reach. The calculator supports realistic budgeting—not a sanction guarantee."
    ],
    sections: [
      {
        title: "Understanding FOIR and income inputs",
        paragraphs: [
          "Net monthly income usually means in-hand salary after tax and statutory deductions, not gross CTC. Bonuses and variable pay may be discounted or averaged over two years at underwriter discretion. Self-employed applicants face average profit computations from ITR—this calculator assumes you enter a representative net figure already aligned with bank worksheets.",
          "FOIR percentages differ: some lenders allow higher ratios for high-income brackets or when co-borrowers join. Existing obligations include credit card minimums only if treated as EMIs in bank policy; student loans, BNPL, and family support may not appear on your application but still affect true affordability—honesty protects you from over-leverage."
        ]
      },
      {
        title: "Who benefits from eligibility estimates",
        paragraphs: [
          "First-time buyers learn whether a ₹60 lakh property with ₹12 lakh down payment fits income or requires longer tenure or co-borrower income. HR and relocation teams counselling transferred employees use quick eligibility to suggest rent versus buy bands. Developers' sales teams should not replace independent checks—run your own numbers on FreeToolsPro with conservative rates.",
          "Adding a spouse's income as co-applicant often increases eligible amount more than linearly because shared expenses do not double. Conversely, overlapping applications on multiple properties can breach exposure norms invisible to a simple FOIR tool."
        ]
      },
      {
        title: "Limitations and next steps",
        paragraphs: [
          "Property-specific loan-to-value caps may limit disbursement below FOIR-permitted EMI—for example 80% LTV on a ₹50 lakh flat caps loan at ₹40 lakh regardless of income supporting ₹45 lakh. Floating rates, step-up EMIs, and moratoriums change stress tests. Credit report issues can reduce eligibility to zero independent of income.",
          "Treat output as an upper bound for shopping, then collect provisional sanctions from lenders. Include stamp duty, registration, interiors, and emergency fund outside the EMI numerator. FreeToolsPro clarifies FOIR arithmetic; final approval rests with underwriting, legal title, and your comfort with payment if rates rise or income shocks occur.",
          "If eligibility looks tight, improve credit score, clear small EMIs, extend tenure cautiously, or increase down payment before reapplying. Document co-applicant income with verifiable bank credits. Lenders may apply haircuts on variable pay; rerun the calculator with conservative income to avoid last-minute disappointment at disbursement."
        ]
      }
    ]
  },

  "/calculators/mortgage-calculator": {
    paragraphs: [
      "A mortgage calculator focuses on home-loan mathematics: given property price or loan amount, down payment, interest rate, and loan term, it computes monthly payment (PITI components may be split depending on implementation), total interest over life, and sometimes affordability hints. FreeToolsPro helps owner-occupiers and investors translate listing prices into cash outflows before engaging a lender, complementing—not replacing—official Loan Estimates and amortisation schedules.",
      "Monthly payment for principal and interest follows the same amortising EMI formula used in generic loan calculators: spread principal and interest so each payment is equal while the interest portion declines. A ₹50 lakh loan at 8.5% for 20 years produces a stable EMI near ₹43,400, with total interest paid over 20 years exceeding principal if not prepaid. Down payment reduces principal directly; even 10% more upfront can remove years of interest at the margin.",
      "Comparing 15-year versus 30-year structures (or 10 versus 20 in markets quoting years differently), evaluating whether paying points to buy down rate makes sense, and stress-testing +1% rate scenarios are everyday mortgage calculator tasks. Buyers balancing rent versus buy also need this monthly figure beside maintenance, tax, and opportunity cost of down payment capital."
    ],
    sections: [
      {
        title: "Inputs that shape home payments",
        paragraphs: [
          "Loan amount usually equals property price minus down payment plus financed closing costs if any. Rate entry should be the note rate on the mortgage, not APR unless the tool specifies APR handling. Term length dramatically affects payment size: shorter terms raise EMI but slash total interest. Property taxes, homeowner insurance, and PMI or mortgage insurance may sit outside basic P&I—add them mentally for US-style PITI or include maintenance for Indian apartments.",
          "Adjustable-rate mortgages start below fixed rates then reset; a calculator using fixed rate will mis-estimate after adjustment unless you rerun with shocked rates. Interest-only periods defer principal, producing lower initial payments and a cliff later. FreeToolsPro typically models standard fixed-rate amortisation—confirm product type before comparing output to a lender PDF."
        ]
      },
      {
        title: "Practical buyer scenarios",
        paragraphs: [
          "Upgrade buyers selling an existing home net equity into down payment to reduce new EMI. Investors compare EMI to expected rent net of vacancy and repairs for cash-flow screening. Young families may maximise tenure to pass income multipliers today while planning prepayments from bonuses—a strategy requiring discipline prepayment calculators quantify better than intuition.",
          "Refinance candidates compare new EMI and total interest against remaining balance on old loan including closing costs. Break-even months matter more than headline rate drop. Use FreeToolsPro iteratively: tweak down payment by ₹2 lakh steps and observe EMI relief to decide liquid versus locked capital."
        ]
      },
      {
        title: "Limitations and responsible borrowing",
        paragraphs: [
          "Approval depends on credit, employment stability, property legal clearance, and regulatory LTV caps. Calculators ignore tax deduction changes, capital gains on sale, and neighbourhood appreciation assumptions speculators sometimes conflate with payment math. Prepayment penalties and floating-rate benchmarks (MCLR, repo-linked) alter realised cost.",
          "Affordability is not only EMI below FOIR; maintain six-month emergency funds, insurance, and retirement SIPs. If rates or expenses rise, can you still pay? FreeToolsPro supplies the core payment trajectory for disciplined comparison—pair it with loan eligibility tools and documented lender quotes before committing years of income to a mortgage."
        ]
      }
    ]
  },

  "/calculators/stock-profit-calculator": {
    paragraphs: [
      "Stock profit calculators determine gain or loss on equity trades by comparing buy and sell prices, quantity, and associated costs such as brokerage, securities transaction tax (STT), exchange charges, stamp duty, and GST on brokerage where applicable. Net profit equals sale proceeds minus purchase cost minus all frictional charges; return on investment (ROI) expresses net gain as a percentage of capital deployed. FreeToolsPro helps Indian and international traders move beyond gross price difference to what actually hit the bank account.",
      "Buy amount is typically price per share times shares plus buy-side charges; sell amount is sell price times shares minus sell-side charges. Percentage return divides net profit by buy amount. Intraday versus delivery may change STT rates and brokerage slabs; enter charges your broker invoice shows rather than guessing flat percentages if accuracy matters for tax filing.",
      "Swing traders reviewing weekly performance, long-term investors computing realised gains after partial exits, and finance students learning friction costs all use stock profit math. The calculator supports decision post-mortems—was a winning trade eroded by churn?—and documents figures ahead of capital gains schedules.",
      "Dividend income received while holding is separate from sale profit but affects total return on capital employed; reinvested dividends change average cost if you track total return internally. For multiple partial sells, run separate rows or weighted averages and sum net outcomes for portfolio-level reporting."
    ],
    sections: [
      {
        title: "Brokerage and statutory charges",
        paragraphs: [
          "Discount brokers often charge flat per-order fees while full-service brokers use basis points on turnover with minimums. STT on delivery sells is commonly a small percent of sell value; intraday equity may use different STT treatment. Exchange transaction charges, SEBI turnover fees, stamp duty on buy side (state-dependent in India), and GST on brokerage stack into total cost ignored by naive price-difference spreadsheets.",
          "Foreign markets use different fee names—SEC fees, FINRA levies, spread costs in OTC—but the structure remains: gross price move minus all costs equals net outcome. FreeToolsPro expects you to aggregate charges into fields or per-side amounts consistent with your broker contract; always reconcile with contract notes."
        ]
      },
      {
        title: "Use cases for traders and investors",
        paragraphs: [
          "Realised profit calculation after scaling out of a multibaggers position clarifies how much capital to redeploy. Comparing two trades with identical percentage price moves but different holding periods annualises insight when paired with time—but simple ROI here is non-annualised unless you extend analysis manually.",
          "Tax planning for short-term versus long-term capital gains brackets needs accurate buy date, sell date, and cost basis including charges; this tool supports the arithmetic portion, not jurisdictional holding-period rules. Portfolio managers justifying active management to clients should report net of fees figures investors actually experience."
        ]
      },
      {
        title: "Limitations and disciplined reporting",
        paragraphs: [
          "Unrealised mark-to-market gains are not profits until sold; calculators require exit prices. Corporate actions—splits, bonuses, mergers—adjust cost basis retroactively; historical entry prices must be normalised. FIFO versus weighted-average accounting across multiple lots affects taxable gain when only part of a holding sells.",
          "Slippage, illiquid wide spreads, and margin interest are easy to omit. FreeToolsPro focuses on explicit inputs you supply; it will not fetch live broker tariffs. Use outputs for education and record-keeping, then verify against annual capital gains statements and CA advice before filing returns."
        ]
      }
    ]
  },

  "/calculators/option-profit-calculator": {
    paragraphs: [
      "Options are contracts granting the right, not obligation, to buy (call) or sell (put) an underlying asset at a strike price before or at expiry, in exchange for premium paid upfront. An option profit calculator estimates payoff at expiry or at a hypothetical underlying price, incorporating premium, lot size, and whether you are long or short the contract. FreeToolsPro supports retail F&O participants on NSE/BSE and learners worldwide translating Greek-laden jargon into rupee P&L under clear assumptions.",
      "Long call profit at expiry is max(0, spot − strike) × quantity minus premium paid; long put profit is max(0, strike − spot) × quantity minus premium. Short positions reverse the sign with theoretically unlimited risk on naked calls. Multi-leg strategies—spreads, straddles, iron condors—require summing leg payoffs; a single-leg tool teaches fundamentals before spreadsheets model combinations.",
      "Hedgers protecting equity holdings with protective puts, speculators betting on event volatility, and finance students plotting payoff diagrams all need numeric payoffs. This calculator clarifies breakeven spots and maximum loss for defined-risk long premium strategies, not replace margin system mark-to-market before expiry.",
      "Index options on Nifty and Bank Nifty dominate retail volume in India; stock options carry liquidity and gap risk on individual earnings. Always model worst-case loss on short legs before selling uncovered premium."
    ],
    sections: [
      {
        title: "Calls, puts, and lot size",
        paragraphs: [
          "Index and stock options trade in fixed lot sizes set by exchanges; P&L multiplies per-share payoff by lot size times number of lots. Premium is quoted per share but paid per lot. A Nifty call might use lot size 25 or revised quantities—enter effective units your contract uses. American versus European exercise affects early exercise on dividends or deep ITM calls; many index options in India are European, exercising at expiry only.",
          "Before expiry, option value includes time value beyond intrinsic value; this tool typically emphasises expiry or intrinsic payoff unless it states otherwise. Implied volatility crush after events can lose money even when direction is right—a lesson calculators at expiry prices illustrate by ignoring time decay path."
        ]
      },
      {
        title: "Who uses option profit estimates",
        paragraphs: [
          "Directional traders comparing limited-loss long options versus futures with margin calls. Covered call writers estimating income if stock stays below strike versus opportunity cost if called away. Risk managers quantifying hedge cost as percent of portfolio value. Educators drawing piecewise-linear payoff charts from tabulated outputs.",
          "Spread traders manually add short leg premium received to long leg premium paid to find net debit or credit and combined breakeven. FreeToolsPro single-leg clarity builds intuition before margin calculators enforce SPAN exposure. Always cross-check with broker payoff simulators that know your exact contract month and corporate action adjustments."
        ]
      },
      {
        title: "Risks and limitations",
        paragraphs: [
          "Naked short options carry margin calls and tail risk absent in long premium positions. Liquidity and wide bid-ask spreads change effective premium versus mid-price assumptions. STT on options, exchange charges, and GST affect net cash like equity trades—include them for realised figures. Tax treatment of F&O varies; business income versus capital gains classification depends on jurisdiction and activity level.",
          "Path dependency before expiry means interim drawdowns can force exits despite eventual expiry profit. FreeToolsPro is an educational and planning aid for payoff structure, not a substitute for reading circulars on position limits, ban periods, and auto square-off times. Trade defined risk until you understand margin mechanics deeply."
        ]
      }
    ]
  },

  "/calculators/gratuity-calculator": {
    paragraphs: [
      "Gratuity is a statutory end-of-service benefit in India under the Payment of Gratuity Act for eligible employees with continuous service of at least five years in covered establishments, payable on retirement, resignation after qualifying service, death, or disability. The gratuity calculator estimates amount based on last drawn salary (basic plus dearness allowance) and years of service using the formula for monthly-rated employees: (15 × last drawn salary × years of service) ÷ 26, with years rounded per rules and a cap on maximum payable gratuity revised by government notification.",
      "The factor 15/26 represents 15 days wages per completed year expressed in monthly terms. Last drawn salary means basic + DA, excluding HRA, bonuses, and allowances unless your employer policy or state law specifies otherwise. Ten years of service on ₹40,000 monthly basic+DA yields roughly (15 × 40,000 × 10) ÷ 26 ≈ ₹2,30,769 before cap—illustrative; verify with payroll.",
      "Employees nearing resignation debate whether to cross the five-year threshold, HR teams budgeting severance liabilities, and job switchers comparing offers with gratuity accrual all use gratuity estimates. FreeToolsPro applies the standard statutory formula so you discuss figures knowledgeably with employers and labour advisors."
    ],
    sections: [
      {
        title: "Eligibility and service counting",
        paragraphs: [
          "Five years continuous service is generally required; courts have held that five years and 240 days in the last year of continuous service can suffice in certain termination cases. Death or disablement may waive the five-year requirement. Establishments with ten or more employees fall under the Act; some organisations still pay ex gratia beyond statutory minimum.",
          "Broken service, unpaid leave beyond permitted limits, and absconding cases affect qualifying years—HR records prevail. Rounding of service years to nearest completed year or six-month thresholds follows statutory interpretation; calculators often use completed years you enter. Maternity leave periods count as service under amendments."
        ]
      },
      {
        title: "Tax and payment timing",
        paragraphs: [
          "Gratuity received by government employees and by private sector employees covered by the Act enjoys exemption up to specified limits under Income Tax Act sections, with overall maximum gratuity amount notified periodically (₹20 lakh ceiling has applied in recent years for private sector exempt calculations—confirm current law). Amounts above exemption are taxable. Payment is due within 30 days of becoming payable; delay attracts interest.",
          "Nomination under Form F ensures smoother payout to legal heirs. FreeToolsPro outputs gross statutory estimate; tax and settlement timing need payroll and CA input. Compare with employer-specific policies that pay higher gratuity voluntarily."
        ]
      },
      {
        title: "Limitations and employee planning",
        paragraphs: [
          "Last drawn salary definition disputes—whether commission or special allowance forms part—require employment contract review. Cap changes by notification alter exempt and payable amounts retroactively to notified dates. Employees on daily wages use a different formula (15 days wages per year based on daily rate) not captured if you enter monthly salary incorrectly.",
          "Use gratuity estimates in total compensation comparisons alongside EPF, NPS, and variable pay. FreeToolsPro demystifies the 15/26 computation; final figures come from employer gratuity trusts or insurance-funded schemes after audit of service records.",
          "Track completed years as you approach five-year milestones; leaving months early can forfeit statutory gratuity unless another qualifying event applies. Keep Form F nominations updated after marriage or family changes so payouts are not delayed in probate."
        ]
      }
    ]
  },

  "/calculators/emi-calculator-amm": {
    paragraphs: [
      "An amortization EMI calculator goes beyond a single monthly payment figure to show period-by-period principal reduction, interest component, and remaining outstanding balance across the full loan tenure. Each row of the schedule answers how much of EMI actually retires debt versus pays interest that month—critical for prepayment decisions, tax deduction documentation, and reconciling lender statements. FreeToolsPro generates this transparency without building spreadsheet templates for every rate and tenure combination.",
      "In a standard reducing-balance loan, early EMIs are interest-heavy because interest equals annual rate divided by 12 times opening balance for that month. As principal drops, interest portion shrinks and principal portion grows even though total EMI stays constant. The sum of all principal portions equals original loan amount; sum of interest portions equals total borrowing cost if no prepayment occurs.",
      "Home loan borrowers claiming Section 24(b) interest deductions, auditors matching EMI receipts to ledgers, and students learning why lenders front-load interest all rely on amortization tables. Seeing the outstanding balance after month 36 clarifies how little principal may be gone early in a long mortgage—a motivator for disciplined prepayment when affordable."
    ],
    sections: [
      {
        title: "Reading the schedule row by row",
        paragraphs: [
          "Typical columns include payment number, opening balance, EMI, principal paid, interest paid, and closing balance. Payment 1 on a ₹40 lakh, 20-year, 8.5% loan might allocate under 20% of EMI to principal; by year 15, principal share often exceeds 80%. Exporting or scrolling the full table shows cumulative interest paid to any date—useful when evaluating refinance after five years.",
          "Rounding per period can leave a few rupees residual on final payment; lenders adjust last instalment. Frequency is monthly for most retail loans; some tools allow quarterly if products demand. FreeToolsPro aligns with monthly Indian home and personal loan conventions unless noted."
        ]
      },
      {
        title: "Prepayment and partial payments",
        paragraphs: [
          "Scheduled amortization assumes no prepayment. Lump-sum prepayment reduces future interest by shrinking principal immediately; EMI may stay constant with tenure shortening or EMI may reduce at lender option. Recalculating schedule after prepayment requires rerunning with lower opening balance and possibly shorter n—static tables before prepayment overstate remaining interest after you prepay.",
          "Part-prepayment timing matters more when balance is high; ₹2 lakh extra in year 2 often saves more interest than the same ₹2 lakh in year 18. Some loans restrict prepayment frequency or charge penalties in fixed-rate years. Use amortization insight to choose windows; confirm policy with lender before transferring bonuses to loan account."
        ]
      },
      {
        title: "Limitations and practical use",
        paragraphs: [
          "Floating-rate loans reset EMI or tenure when benchmark changes; a single fixed-rate schedule becomes approximate after resets unless regenerated. Moratorium periods capitalise interest differently. Structured products with step-up EMIs need bespoke engines.",
          "FreeToolsPro amortization complements the simple EMI calculator: start with EMI for affordability, drill into schedule for lifecycle cost awareness. Match rows against annual account statements from banks; discrepancies often trace to prepayments not in your static run or rate change effective dates. Keep PDFs for tax and audit; the schedule is a map, not a payment instruction.",
          "Year-wise summaries derived from the monthly table help compare interest paid in early versus late years when negotiating balance transfer offers. Export or screenshot key milestones—balance below half, final year—to discuss prepayment strategy with family or financial planners."
        ]
      }
    ]
  },

  "/calculators/date-add-subtract-calculator": {
    paragraphs: [
      "Date add and subtract calculators perform calendar arithmetic: given a start date, add or subtract a span expressed in days, weeks, months, or years to arrive at a result date without manual counting or error-prone mental math. Deadline tracking for contracts, computing expiry after a 90-day notice period, projecting milestones by adding sprint lengths, and verifying licence renewal dates all depend on reliable date shifts that respect month-end boundaries and leap years.",
      "Adding days is linear: 15 March plus 10 days is 25 March. Adding months is contextual: 31 January plus one month is often 28 February (or 29 in leap years), not 31 February. Years behave similarly—29 February 2024 plus one year may land on 28 February 2025 in many systems. Quality calculators implement civil date rules consistently so legal and operational teams trust outputs.",
      "FreeToolsPro provides this utility for project managers, legal ops staff, HR setting probation end dates, and developers sanity-checking API date logic. It complements duration calculators that measure gaps between dates by solving the inverse problem: where does the calendar land after a defined offset?"
    ],
    sections: [
      {
        title: "Common professional use cases",
        paragraphs: [
          "Contractual notice periods stated as thirty calendar days from service of notice require adding days from a trigger date, not business days—unless the contract specifies business days, which this tool may not handle without a business-day calendar. Visa and immigration windows, return merchandise windows, and insurance freelook periods follow similar patterns.",
          "Software teams adding two-week sprints to sprint end dates, marketers scheduling campaigns three months after product launch, and educators setting assignment due dates from syllabus start all benefit. Payroll cut-offs—pay on last business day plus offset—may need manual adjustment if only calendar arithmetic is available."
        ]
      },
      {
        title: "Months, years, and edge cases",
        paragraphs: [
          "Month addition anchors on day-of-month when possible; when target month lacks that day, results clamp to last valid day. Subtracting one month from 31 March typically yields 28 or 29 February. Year addition handles leap day anniversaries by moving to 28 February when year 366 is not available. These rules mirror PHP, JavaScript, and SQL date functions in mainstream libraries—still verify against your jurisdiction's legal definition for filings.",
          "Pure day counts ignore daylight saving shifts because dates are date-only; datetime tools with zones are separate. Historical Julian versus Gregorian cutover is outside modern business use. FreeToolsPro focuses on Gregorian civil dates you select in the picker."
        ]
      },
      {
        title: "Limitations and verification habits",
        paragraphs: [
          "Business-day calculators exclude weekends and public holidays per locale; adding thirty business days differs from thirty calendar days. Fiscal periods, lunar calendars, and ISO week-year boundaries need specialised tools. Daylight or timezone boundaries matter only when timestamps include time-of-day.",
          "For statutory filings, confirm with official calendars—calculator output is a draft until a clerk accepts it. Document whether you used calendar or business days in contracts to avoid disputes. FreeToolsPro helps teams agree on a single arithmetic baseline before encoding the same rules in databases and workflow automation.",
          "When subtracting durations, reverse the operation carefully: ten days before a deadline is not the same as adding negative ten days in every library. Note your start date in meeting minutes so teams do not dispute which anchor was used months later."
        ]
      }
    ]
  },
  "/calculators/gpa-calculator": {
    paragraphs: [
      "The GPA Calculator converts course credits and letter grades into a weighted grade point average so you can estimate standing before official transcripts update.",
      "Scale systems differ by school (4.0, 10-point, plus/minus). Match the tool’s mapping to your institution’s catalog.",
    ],
    sections: [
      {
        title: "Example",
        paragraphs: [
          "Enter three courses with credits and letter grades; the calculator weights each grade by credit hours and shows the combined GPA.",
        ],
      },
      {
        title: "Limits",
        paragraphs: [
          "Unofficial estimates cannot replace registrar calculations for scholarships or graduation checks. Confirm policies for retakes and pass/fail courses.",
        ],
      },
    ],
  },
};
