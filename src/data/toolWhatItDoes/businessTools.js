export default {
  "/business-tools/salary-calculator": {
    paragraphs: [
      "The Salary Calculator translates your Cost to Company (CTC) offer into a realistic monthly in-hand figure for Indian employees. Instead of guessing how much lands in your bank account after statutory deductions and income tax, you enter your annual CTC, monthly rent, bonus, and optional investments to see a structured breakdown of gross pay, allowances, employer contributions, and take-home salary. The tool is built around how Indian payroll actually works—Basic, HRA, special allowances, PF, professional tax, and TDS are all modeled so you can compare offers or plan your budget before accepting a role.",
      "Whether you are negotiating a job switch, evaluating a promotion, or helping HR explain compensation to candidates, clarity on in-hand salary prevents costly misunderstandings. A ₹12 lakh CTC does not mean ₹1 lakh per month in your account; employer PF, gratuity provisions, and tax withholding shrink the number you can spend. This calculator surfaces those layers instantly so you can ask smarter questions about structure, not just headline CTC.",
    ],
    sections: [
      {
        title: "From CTC to in-hand salary",
        paragraphs: [
          "CTC includes everything the company spends on you—salary components, employer Provident Fund, gratuity accrual, and sometimes insurance or variable pay. The calculator splits your CTC into monthly gross components, then applies employee-side deductions. Basic salary typically forms the foundation for PF and HRA calculations; special allowances fill the remainder of your package. Employer PF is shown for transparency but does not reduce your bank credit; employee PF and income tax do.",
          "Enter your monthly CTC figure (or derive it from annual CTC) and watch gross pay, total deductions, and net in-hand update live. Bonus and other income fields let you see how a joining bonus or freelance side income affects annual tax liability without changing your recurring monthly slip. Export and share options help you save a snapshot for comparison across multiple offers.",
        ],
      },
      {
        title: "HRA, metro city rules, and rent",
        paragraphs: [
          "House Rent Allowance is one of the most misunderstood parts of Indian salary structure. If you pay rent, a portion of HRA may be exempt from tax depending on Basic salary, actual rent paid, and whether you live in a metro (Delhi, Mumbai, Kolkata, Chennai) or non-metro city. The tool applies standard HRA exemption logic: it considers 50% of Basic for metro and 40% for non-metro, compares that with actual rent minus 10% of Basic, and uses the least of the eligible amounts.",
          "Toggle metro vs non-metro and enter your monthly rent to see how much HRA stays taxable versus exempt. This is especially useful when choosing between a higher CTC with lower Basic or a balanced structure—HRA benefit scales with Basic, not with headline CTC alone.",
        ],
      },
      {
        title: "Deductions under Section 80C, 80D, and NPS",
        paragraphs: [
          "Beyond standard PF and professional tax, you can model tax-saving investments: Section 80C (up to ₹1.5 lakh on instruments like PPF, ELSS, home loan principal), Section 80D medical insurance premiums, Section 80CCD(1B) additional NPS contribution, and Leave Travel Allowance where applicable. These reduce taxable income under the old tax regime and can materially increase in-hand salary if you fully utilize available limits.",
          "Adjust deduction amounts to match your actual ELSS SIP, insurance policy, or NPS tier-1 deposits. The calculator recalculates TDS monthly and annual tax so you see the rupee impact of each ₹10,000 invested—not just a generic “save tax” message.",
        ],
      },
      {
        title: "Old regime vs new regime",
        paragraphs: [
          "India offers two income tax regimes: the new regime with lower slab rates but fewer deductions, and the old regime with higher rates but allowances for 80C, HRA, LTA, and other exemptions. The Salary Calculator lets you switch regimes instantly and compare net in-hand side by side. For many salaried renters with heavy 80C usage, the old regime wins; for others with minimal deductions, the new regime’s lower slabs produce more take-home pay.",
          "Use regime comparison when your employer asks which option to lock for the financial year. The tool applies current slab logic and standard rebate thresholds so you get a planning estimate—always verify final TDS with your CA or payroll team before making irreversible declarations.",
        ],
      },
    ],
  },

  "/business-tools/gst-calculator": {
    paragraphs: [
      "The GST Calculator helps businesses and freelancers compute Goods and Services Tax on Indian transactions without opening a spreadsheet. Enter an amount, pick a GST rate slab, and choose whether your price is exclusive or inclusive of tax. The tool instantly shows base value, total GST, and the final invoice amount—split into CGST and SGST for intra-state sales or IGST for inter-state supplies.",
      "GST compliance depends on getting the math right on every line item. A quote marked “₹10,000 plus GST” differs from “₹10,000 inclusive of GST” by more than most people expect at 18%. This calculator removes ambiguity before you send an invoice, raise a purchase order, or reconcile vendor bills.",
    ],
    sections: [
      {
        title: "Exclusive vs inclusive pricing",
        paragraphs: [
          "In exclusive mode, the amount you enter is the pre-tax value. GST is added on top: for 18%, ₹10,000 base becomes ₹1,800 tax and ₹11,800 total. In inclusive mode, the amount already contains GST; the calculator backs out the base value and tax component using the formula tax = amount × rate ÷ (100 + rate). That reverse calculation is what accountants use when a customer pays a round GST-inclusive figure.",
          "Switch modes with one click to see both perspectives. Sellers usually think exclusive; retail price tags are often inclusive. Matching the mode to your document prevents under-billing or overstating revenue in your books.",
        ],
      },
      {
        title: "CGST, SGST, and IGST breakdown",
        paragraphs: [
          "For intra-state transactions (supplier and buyer in the same state), GST is levied as Central GST and State GST—each half of the total rate. At 18%, you see 9% CGST and 9% SGST. For inter-state transactions, Integrated GST applies at the full rate with no CGST/SGST split. Select the supply type and the calculator allocates amounts correctly for your invoice footer or GSTR line entry.",
          "This split matters for filing: wrong tax type on an invoice can block input tax credit for your buyer. Use IGST when dispatch crosses state borders; use CGST+SGST for local B2B and B2C sales within your state registration.",
        ],
      },
      {
        title: "Standard GST rate slabs in India",
        paragraphs: [
          "India uses multiple GST slabs—0%, 5%, 12%, 18%, and 28%—plus cess on certain goods. The calculator supports quick selection of common rates so you can compare how the same base price behaves at 5% vs 12% vs 18%. A slab comparison view shows total payable at each rate side by side, useful when product classification is uncertain and you need to bracket your pricing.",
          "Essential goods, processed food, and services fall under different slabs; always confirm HSN/SAC classification with your tax advisor. This tool handles arithmetic only—it does not replace legal classification—but it ensures once you know the rate, every rupee of tax and base is accurate to two decimal places.",
        ],
      },
      {
        title: "Everyday business use cases",
        paragraphs: [
          "Freelancers use it to add 18% GST on service invoices. Shop owners back out tax from MRP-style inclusive prices. Procurement teams verify vendor quotes by checking whether quoted ₹1,00,000 is pre- or post-GST before approval. E-commerce sellers reconcile platform settlements against expected GST on commission-inclusive payouts.",
          "Because calculations update live as you type, you can iterate on discount scenarios or bulk order totals without re-entering formulas. Copy the breakdown into your billing software or share with clients who ask for transparent tax splits on proposals.",
        ],
      },
    ],
  },

  "/business-tools/invoice-template-creator": {
    paragraphs: [
      "The Invoice Template Creator lets you build clean, professional invoices in the browser with a live preview that updates as you type. Add your business name, client details, invoice number, date, line items with quantity and rate, and tax percentage—then watch a formatted invoice assemble on the right side of the screen. No Word template, no design software, and no account required.",
      "Small businesses, consultants, and freelancers often lose hours formatting documents that should take minutes. This tool focuses on speed and clarity: standard invoice sections (header, bill-to, item table, subtotal, tax, grand total) are pre-structured so you only fill in the numbers and descriptions that change from job to job.",
      "Indian service providers often need GST-ready line totals without wrestling with merged cells or broken table borders in desktop editors. The live preview keeps rupee formatting consistent and shows tax as a separate line so clients can reconcile accounts payable quickly.",
    ],
    sections: [
      {
        title: "Live preview as you edit",
        paragraphs: [
          "Every field connects directly to the preview pane. Change the invoice number from INV-001 to INV-042 and the preview reflects it immediately. Add a second line item for “Website maintenance” at ₹5,000 and the subtotal, tax, and total recalculate without a submit button. That live sync eliminates the edit-refresh-print loop common with static PDF templates.",
          "The preview uses readable typography and spacing suited for printing or sending as a PDF from your browser’s print dialog. What you see is what your client receives—no surprise layout shifts when moving from editor to output.",
        ],
      },
      {
        title: "Line items, quantities, and rates",
        paragraphs: [
          "Build an itemized table with description, quantity, unit rate, and computed line amount. Add rows for multiple services or products; remove rows you do not need. Quantity defaults to 1 for flat-fee work but scales for hourly billing (e.g., 12 hours × ₹800) or product shipments (50 units × ₹120). Each row contributes to subtotal automatically.",
          "Tax is applied as a percentage on subtotal—typically 18% GST for many Indian services—so you can adjust the rate field when supplying at 5%, 12%, or zero-rated categories. Grand total always equals subtotal plus tax with no manual summation.",
        ],
      },
      {
        title: "Copy, print, and reuse",
        paragraphs: [
          "When the invoice looks right, copy the formatted text for email body or paste into accounting tools. Use browser print to save a PDF with your letterhead-ready layout. Reset fields to start a fresh invoice while keeping your business name preset for the next client.",
          "Invoice numbers and dates help you maintain sequential billing records. Set today’s date by default and edit for backdated or scheduled invoices. Consistent numbering (INV-2024-001, INV-2024-002) supports audit trails and reduces payment disputes.",
        ],
      },
      {
        title: "Who benefits most",
        paragraphs: [
          "Consultants billing one-off projects get a polished document without subscribing to full accounting suites. Agencies prototyping invoice branding can iterate on copy and line structure before investing in custom design. Tutors, photographers, repair shops, and market vendors who invoice occasionally avoid maintaining heavyweight templates in office suites.",
          "The tool does not replace GST registration, e-invoicing mandates, or legal invoice fields required in your jurisdiction—it gives you a fast, accurate starting point for informal and standard B2B billing where a clear itemized PDF is enough to get paid.",
          "You can also add bank details, payment terms, or notes in item descriptions when your workflow requires them—descriptions accept free text so “50% advance due on acceptance” travels with the line item into the printed preview.",
        ],
      },
    ],
  },

  "/business-tools/quotation-generator": {
    paragraphs: [
      "The Quotation Generator produces structured business quotes with itemized pricing, discounts, tax, and validity dates—ready to copy into email or proposals. Enter your company name, client name, quote reference, line items, discount percentage, and GST rate; the tool calculates subtotal, discount amount, taxable value, tax, and final quote total in real time.",
      "A quotation is often the first formal document a prospect sees. Messy math or missing validity dates slow approvals and invite renegotiation. This generator enforces a professional layout and consistent arithmetic so your price looks credible before the deal reaches procurement.",
      "Sales teams use it to respond to RFPs the same day—no waiting on finance to format Excel. Contractors quote materials and labor on separate rows so homeowners see where budget goes. SaaS vendors bundle onboarding and subscription fees with transparent tax on the discounted bundle.",
    ],
    sections: [
      {
        title: "Building itemized quotes",
        paragraphs: [
          "Each line item captures description, quantity, and unit rate. The extended price multiplies qty × rate and rolls into subtotal. Add services (“Annual AMC”), materials (“Hardware kit”), or bundled SKUs on separate rows so clients understand what they are paying for. Remove or duplicate rows as quotes grow from simple one-liners to multi-phase project breakdowns.",
          "Unlike a plain spreadsheet, the quote template includes labeled sections for company, client, quote number, date, and validity—fields procurement teams expect when comparing vendors.",
        ],
      },
      {
        title: "Discounts before tax",
        paragraphs: [
          "Enter a discount percentage to model early-payment incentives, volume deals, or negotiated reductions. Discount applies to subtotal first; tax is calculated on the post-discount taxable amount, matching standard Indian commercial practice where GST is on the net consideration after trade discounts stated on the quote.",
          "Example: ₹1,00,000 subtotal with 10% discount yields ₹90,000 taxable; 18% GST adds ₹16,200 for ₹1,06,200 total. The generator shows each intermediate figure so clients never have to reverse-engineer your math.",
        ],
      },
      {
        title: "Tax and total presentation",
        paragraphs: [
          "Set GST or VAT percentage to match your service category. Tax displays separately from subtotal and discount, which helps B2B buyers who claim input tax credit see the exact tax component. Grand total is prominent for sign-off while supporting lines remain visible for finance review.",
          "Adjust tax rate per quote when mixing exempt and taxable lines is not needed—use a blended rate for simple quotes or align with your accountant’s guidance on split invoices for complex deals.",
        ],
      },
      {
        title: "Validity period and follow-up",
        paragraphs: [
          "Specify validity in days (default 30) and the tool computes a “valid until” date from today. Expiry dates create urgency and protect you from honor-price requests months later when costs have risen. Quote numbers (QT-001, QT-2024-15) track versions when you revise pricing after client feedback.",
          "Copy the finished quote to clipboard for WhatsApp, email, or CRM paste. Reset to draft the next opportunity without losing your company defaults. Pair with the Invoice Template Creator when a quote converts to a bill—same line items, new document type.",
          "Version control is simple: bump the quote number when scope changes and paste the new totals into your thread so legal and finance always reference the latest figures. Including validity on every revision avoids stale pricing disputes after material costs move.",
        ],
      },
      {
        title: "Winning more approvals",
        paragraphs: [
          "Procurement portals reject quotes that hide discount math or omit tax lines. Showing subtotal, discount, taxable base, GST, and total in one view matches how approvers read commercial bids. Sales reps close faster when finance does not send the document back for rework.",
          "Use consistent quote numbering in your CRM so accepted QT-2024-18 maps cleanly to invoice INV-2024-18 later. That traceability shortens month-end reconciliation and helps auditors link pipeline to revenue recognition without digging through email attachments.",
        ],
      },
    ],
  },

  "/business-tools/inventory-calculator": {
    paragraphs: [
      "The Inventory Calculator computes Cost of Goods Sold (COGS), average inventory, and inventory turnover ratio from your opening stock, purchases, closing stock, and optional sales figures. It is designed for retailers, wholesalers, and small manufacturers who need quick operational metrics without importing data into a full ERP report.",
      "Inventory ties up cash. Knowing how fast stock moves and what it cost to sell helps you order smarter, negotiate with suppliers, and spot shrinkage or counting errors before they compound across quarters.",
      "Accountants derive the same COGS figure for gross profit on the income statement; operations teams use turnover to decide reorder points. This calculator bridges both views from four numbers you already have in your stock register.",
    ],
    sections: [
      {
        title: "Cost of Goods Sold (COGS)",
        paragraphs: [
          "COGS answers: what did the inventory I sold actually cost? The standard formula is Opening Stock + Purchases − Closing Stock. Opening stock is value at period start; purchases add everything bought during the period; closing stock is what remains unsold at period end. The difference represents the cost attributed to goods that left your warehouse—whether sold, transferred, or written off should be reflected in how you set closing stock.",
          "Enter amounts in rupees (or your reporting currency). The calculator updates COGS instantly when any input changes, so you can test sensitivity—what if closing stock is ₹50,000 higher after a delayed shipment?",
        ],
      },
      {
        title: "Average inventory",
        paragraphs: [
          "Average inventory smooths point-in-time spikes from seasonal buying. This tool uses the common shortcut: (Opening Stock + Closing Stock) ÷ 2. That midpoint estimate pairs with COGS to produce turnover metrics when sales or COGS-based formulas are applied. For businesses with highly uneven purchases, a more advanced weighted average from monthly counts improves accuracy—but for monthly reviews, the opening-closing average is standard.",
          "Average inventory also contextualizes how much capital sits in stock relative to sales velocity. High average inventory with low COGS signals overstocking; the opposite may mean stockouts risk.",
        ],
      },
      {
        title: "Inventory turnover ratio",
        paragraphs: [
          "Turnover measures how many times inventory cycles through sales in a period. When you provide sales revenue, the calculator can relate movement to top-line activity; the core metric shown uses COGS ÷ Average Inventory—how efficiently stock converts to cost of sales. Higher turnover generally means leaner operations; very high turnover may indicate understocking and missed sales.",
          "Industry benchmarks vary: grocery turns fast; luxury furniture turns slow. Track your ratio month over month rather than chasing a universal target number.",
        ],
      },
      {
        title: "Practical reporting workflow",
        paragraphs: [
          "Run the calculator at month-end with figures from your stock ledger and purchase register. Compare COGS to gross margin in your P&L to verify counts. If turnover drops suddenly, investigate dead stock, pricing changes, or data entry mistakes in closing inventory.",
          "Reset restores sample defaults for learning; replace with your live numbers for real decisions. Export mentally by noting the three outputs for management dashboards—no login, no CSV upload, just arithmetic you can trust in supplier meetings and bank reviews.",
          "Optional sales input lets you relate inventory movement to revenue when COGS alone does not tell the full story—useful for seasonal businesses comparing festival-quarter sell-through against average stock held.",
        ],
      },
      {
        title: "Interpreting results with your team",
        paragraphs: [
          "Share COGS and turnover in weekly ops reviews alongside top sellers and dead SKUs. When turnover falls while sales rise, margin mix may have shifted toward higher-cost goods. When COGS jumps without matching sales, verify physical counts before blaming demand.",
          "Banks reviewing working-capital limits often ask how quickly inventory converts to cash. Having turnover and average inventory ready signals disciplined stock management even for businesses without formal ERP dashboards.",
        ],
      },
    ],
  },

  "/business-tools/payroll-calculator": {
    paragraphs: [
      "The Payroll Calculator estimates monthly gross pay, statutory deductions, and net salary from basic salary, HRA percentage, special allowance, PF contribution rate, and professional tax. It is aimed at HR executives, startup founders setting first payslips, and employees verifying that payroll software matches expected take-home.",
      "Payroll errors erode trust faster than almost any HR issue. A transparent breakdown—Basic, HRA, special allowance, gross, PF, professional tax, net—helps you explain payslips and catch configuration mistakes before salaries are transferred.",
      "Unlike full payroll suites, this calculator focuses on the monthly structure most Indian employees see on payslip line one through net before TDS—ideal for offer-letter drafting, bench-marking vendor quotes, or teaching new HR hires how components flow.",
    ],
    sections: [
      {
        title: "Gross pay composition",
        paragraphs: [
          "Gross salary is the sum of earnings before deductions. Enter basic salary as the core component; HRA is computed as a percentage of Basic (common structures use 40–50% depending on city and company policy). Special allowance covers the flexible bucket—transport, meal, or residual balancing amount in many Indian salary templates.",
          "The calculator displays each component separately and sums to gross. Adjust HRA percent to mirror your offer letter: a ₹40,000 basic with 40% HRA adds ₹16,000 housing component before allowances.",
        ],
      },
      {
        title: "Provident Fund (PF) deduction",
        paragraphs: [
          "Employee PF is typically 12% of Basic salary (subject to wage ceiling rules in formal payroll; this tool applies the percentage you enter for estimation). Employer PF is not deducted from employee net in most displays but affects company cost—here the focus is employee-side PF reducing take-home.",
          "Change PF percentage when modeling voluntary higher contribution or smaller statutory applicability. Startups often use minimum Basic to limit PF impact; larger bases increase both retirement savings and current deduction.",
        ],
      },
      {
        title: "Professional tax and total deductions",
        paragraphs: [
          "Professional tax varies by state—Maharashtra, Karnataka, and others apply slab-based monthly amounts capped per year. Enter your state’s typical deduction (often ₹200/month for salaried mid-brackets) as a flat figure for net pay estimation. Total deductions equal PF plus professional tax plus any other items you treat as fixed for this simplified model.",
          "Net salary is gross minus deductions—the amount closest to what appears in your bank account before income tax TDS, which depends on annual declarations and lies outside this monthly structural calculator.",
        ],
      },
      {
        title: "Using results for payroll setup",
        paragraphs: [
          "Founders use the output to check that CTC splits produce livable net pay. HR compares tool results against payroll vendor test runs before go-live. Employees sanity-check first payslip after a hike in Basic or HRA.",
          "Reset returns sensible defaults for experimentation. Tune inputs live—see how raising special allowance vs Basic shifts PF deduction and net differently because PF anchors on Basic, not on gross. That insight alone prevents many “why did my net drop?” support tickets.",
        ],
      },
      {
        title: "Structuring offers and compliance awareness",
        paragraphs: [
          "When designing CTC, founders often inflate special allowance to reach a target gross while keeping Basic low for PF savings. This calculator shows the employee-side cost of that trade-off instantly so offers stay competitive and compliant with how your payroll provider will actually configure the run.",
          "Professional tax slabs differ by state and gender in some jurisdictions; update the flat PT field to match your registered office location. For multi-state teams, run the calculator once per state template before uploading structures to your HRMS.",
          "Pair results with the Salary Calculator when you need annual tax regime comparison—payroll here is monthly structural net; tax withholding depends on declarations, HRA proofs, and regime choice at year level.",
        ],
      },
    ],
  },
  "/business-tools/rent-receipt-generator": {
    paragraphs: [
      "The Rent Receipt Generator builds printable rent receipts for HRA claims and landlord records from the tenant, landlord, amount, and period you enter.",
      "Employers and tax rules vary—confirm required fields (revenue stamp, landlord PAN where applicable) before you submit proofs.",
    ],
    sections: [
      {
        title: "Example",
        paragraphs: [
          "Enter landlord name, tenant name, monthly rent, and address, then print or PDF the receipt for a specific month’s HRA documentation.",
        ],
      },
      {
        title: "Limits",
        paragraphs: [
          "This is a document helper, not tax advice. Fake or backdated receipts can create compliance issues—only generate accurate records.",
        ],
      },
    ],
  },
  "/business-tools/pan-card-name-checker": {
    paragraphs: [
      "The PAN Card Name Checker validates PAN format and helps interpret structure cues such as the entity-type character in the number.",
      "It does not prove a PAN is allotted or linked to a person—only that the string looks structurally valid.",
    ],
    sections: [
      {
        title: "Example",
        paragraphs: [
          "Paste a 10-character PAN to confirm length, letter/digit pattern, and checksum-style expectations before you type it into a payment form.",
        ],
      },
      {
        title: "Limits",
        paragraphs: [
          "Always verify PAN status through official Income Tax portals when onboarding vendors or filing returns.",
        ],
      },
    ],
  },
  "/business-tools/ifsc-code-finder": {
    paragraphs: [
      "The IFSC Code Finder validates IFSC format and helps look up common bank branch codes for NEFT/IMPS/RTGS forms.",
      "Banks occasionally reorganize branches—confirm the code on your bank’s site or passbook for high-value transfers.",
    ],
    sections: [
      {
        title: "Example",
        paragraphs: [
          "Enter a bank and branch hint or paste an IFSC to check the 11-character pattern before saving a payee.",
        ],
      },
      {
        title: "Limits",
        paragraphs: [
          "Wrong IFSC can delay or misroute funds. Double-check with the beneficiary for first-time payees.",
        ],
      },
    ],
  },
};
