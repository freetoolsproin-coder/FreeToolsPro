// Original PDF books. Files are written to public/ebooks by scripts/write-ebooks.mjs.
export const EBOOKS = [
  {
    slug: "emi-and-home-loans",
    title: "EMI and Home Loans in Plain Language",
    blurb: "How EMI, tenure, interest and prepayment change what a loan really costs.",
    topic: "Money",
    cat: "finance",
    intro:
      "An EMI is the fixed amount you pay every month on a loan. The first payments are mostly interest. Later payments pay down the principal. This guide shows how the pieces fit, so a quote from a bank is easier to read.",
    sections: [
      {
        heading: "What the EMI is made of",
        paragraphs: [
          "Three numbers decide the EMI: the amount you borrow, the yearly interest rate, and the number of months. A longer tenure makes the monthly payment smaller and the total interest larger. A shorter tenure does the opposite.",
          "On a home loan the bank also looks at processing fees, insurance and the stamp duty you pay up front. Those costs are not inside the EMI, so add them when you compare two offers. A slightly lower rate can still be the better deal if the fees are smaller.",
        ],
      },
      {
        heading: "Rate, tenure and the total you pay",
        paragraphs: [
          "Interest is charged on the balance that is still outstanding, not on the original loan every month. That is why extra payments early in the loan save more than the same payment near the end.",
          "A floating rate can move when the lender's benchmark changes. Your EMI may stay the same while the tenure grows, or the EMI may rise. Ask which of those the lender will do, and keep a small buffer in the monthly budget for a rate increase.",
        ],
      },
      {
        heading: "Prepayment without surprises",
        paragraphs: [
          "Paying a lump sum reduces the principal. You can then ask for a lower EMI or a shorter tenure. Shortening the tenure usually saves more interest, if the higher EMI still fits your salary.",
          "Check the prepayment charge before you transfer the loan or pay it down. Many floating-rate home loans for individuals have no prepayment fee, but a fixed-rate loan or a loan to a business often does. Get the rule in writing for your account.",
        ],
      },
      {
        heading: "A sensible way to compare offers",
        paragraphs: [
          "Compare loans on the same amount, the same tenure and the same fee assumptions. Look at the total interest, not only the EMI. A lower EMI over 30 years can cost far more than a slightly higher EMI over 20 years.",
          "Run your own numbers on the EMI calculator, then try a prepayment a few years in. Use the result as a plan, and confirm the final figures with the lender's sanction letter before you sign.",
        ],
      },
    ],
    related: [
      { name: "EMI calculator", path: "/calculators/emi-calculator" },
      { name: "Home loan calculator", path: "/loan-calculators/home-loan-calculator" },
      { name: "Loan prepayment calculator", path: "/loan-calculators/loan-prepayment-calculator" },
    ],
  },
  {
    slug: "sip-versus-lumpsum",
    title: "SIP, Lumpsum and a Savings Goal",
    blurb: "When a monthly SIP helps, when a lumpsum helps, and how to pick a goal amount.",
    topic: "Money",
    cat: "finance",
    intro:
      "A SIP invests a fixed amount every month. A lumpsum invests once. Neither is magic. The useful question is how much you need by a date, and what monthly amount gets you close if the return is only average.",
    sections: [
      {
        heading: "What compounding is doing",
        paragraphs: [
          "Returns earn their own returns. Over a short period the effect is small. Over 10 or 15 years it is most of the result, which is why stopping a SIP in the first few years wastes the part that matters later.",
          "A calculator assumes a steady yearly return. Real markets move around that average. Treat the final figure as a range, not a promise, and try the same goal at a lower return so the plan still works in a weak decade.",
        ],
      },
      {
        heading: "SIP or lumpsum",
        paragraphs: [
          "A SIP fits money that arrives as salary. You do not have to guess the best day to invest. A lumpsum fits money you already have, such as a bonus or a maturity, if you can leave it invested for years.",
          "If a large sum makes you nervous, you can still invest it in a few steps over several months. That is a pacing choice. It does not remove market risk. The longer the money can stay invested, the less the start date matters.",
        ],
      },
      {
        heading: "Working backwards from a goal",
        paragraphs: [
          "Start with the future amount, the number of years and a cautious return. The goal planner turns that into a monthly SIP or a lumpsum today. Raise the target if you also need to beat inflation.",
          "Keep the goal specific: a house down payment, a course fee, or a first retirement pot. A named date makes it obvious when to stop adding risk and move the money somewhere steadier.",
        ],
      },
      {
        heading: "How to read the result",
        paragraphs: [
          "Split the result into what you put in and what growth added. If growth is tiny, the horizon is too short for a volatile investment, and a deposit may fit better.",
          "Review the SIP once a year when your salary changes. Increase it then, rather than every time the market falls or rises. The calculators on this site run in your browser, so the amounts stay on your device.",
        ],
      },
    ],
    related: [
      { name: "SIP calculator", path: "/calculators/sip-calculator" },
      { name: "Lumpsum calculator", path: "/mutual-fund-tools/lumpsum-calculator" },
      { name: "Goal planner", path: "/mutual-fund-tools/goal-planner" },
    ],
  },
  {
    slug: "ppf-fd-and-nps",
    title: "PPF, Fixed Deposits and NPS",
    blurb: "A plain comparison of three common ways to save in India.",
    topic: "Money",
    cat: "finance",
    intro:
      "PPF, bank fixed deposits and NPS solve different jobs. One locks money for a long public-scheme term, one is a simple deposit, and one is aimed at retirement. Mixing them up is how people pick a product that does not match the date they need the cash.",
    sections: [
      {
        heading: "Public Provident Fund",
        paragraphs: [
          "PPF is a long lock-in with a rate set by the government and interest that compounds yearly. It suits money you will not need for the full term. Partial withdrawal rules exist, but they are limited, so do not park an emergency fund here.",
          "The yearly deposit has a cap. Interest is declared for a quarter at a time, so a calculator that uses today's rate is a sketch of the future balance, not a guarantee for the next 15 years.",
        ],
      },
      {
        heading: "Fixed deposits and recurring deposits",
        paragraphs: [
          "A fixed deposit pays a stated rate for a stated period. Compounding may be quarterly, which is why the maturity amount is a little higher than a simple yearly multiplication. Senior citizen rates and special tenures change the result.",
          "A recurring deposit is the same idea with a monthly contribution. Tax on interest depends on your slab and on whether the bank deducts TDS. Ask the bank for the maturity figure and the TDS rule before you lock a large sum.",
        ],
      },
      {
        heading: "NPS at retirement",
        paragraphs: [
          "NPS invests toward retirement, with a mix of equity, corporate debt and government debt that you choose within the rules. The balance moves with markets. It is not a fixed maturity like an FD.",
          "At exit, part of the corpus has to be used to buy an annuity, within the limits in force at the time, and the rest can be withdrawn. Model a few return rates. A single optimistic rate hides how wide the outcome can be.",
        ],
      },
      {
        heading: "Matching the product to the date",
        paragraphs: [
          "Money needed within a few years belongs in a deposit or another steady option. Money for a decade or for retirement can take a PPF or NPS allocation you can leave alone.",
          "Write down the date and the amount first, then open the matching calculator. A product is a good fit only when the lock-in ends before you need the cash.",
        ],
      },
    ],
    related: [
      { name: "PPF calculator", path: "/calculators/ppf-calculator" },
      { name: "FD calculator", path: "/banking-tools/fd-calculator" },
      { name: "NPS calculator", path: "/retirement-tools/nps-calculator" },
    ],
  },
  {
    slug: "paying-off-a-credit-card",
    title: "Paying Off a Credit Card",
    blurb: "Why the minimum due keeps a balance alive, and how a fixed payment shortens it.",
    topic: "Money",
    cat: "finance",
    intro:
      "Credit card interest is charged on what you do not pay by the due date. The minimum amount due is designed to keep the account in good standing. It is not designed to clear the balance quickly.",
    sections: [
      {
        heading: "Interest on the unpaid part",
        paragraphs: [
          "If you pay the full statement balance by the due date, purchases in that cycle usually stay inside the interest-free period. If you pay less, interest starts on the unpaid amount, and new purchases may lose that free period too. Read your card's terms for the exact rule.",
          "The yearly rate on a card is much higher than a typical home loan. A balance that looks manageable at the minimum payment can take years, because most of each small payment is interest.",
        ],
      },
      {
        heading: "A fixed monthly payment",
        paragraphs: [
          "Pick an amount you can pay every month that is well above the minimum. The payoff calculator shows how many months that takes and how much interest you still pay. Raising the payment by a small fixed sum often cuts many months off the end.",
          "Stop adding new spending on that card while you pay it down, or the balance barely moves. If you need the card for one bill, pay that bill in the same month so it does not join the old balance.",
        ],
      },
      {
        heading: "More than one card",
        paragraphs: [
          "List each balance, its rate and its minimum. Put extra money toward the highest rate, and pay the minimums on the rest. When the first card is clear, move that whole payment onto the next one.",
          "A personal loan at a lower rate can replace card debt, but only if you do not run the cards back up. Add the loan fee into the comparison. A cheaper rate with a long new tenure can still cost more.",
        ],
      },
      {
        heading: "Staying clear after the balance is gone",
        paragraphs: [
          "Keep one card if it helps you build a record, and pay it in full. A written limit for monthly card spending is more useful than hiding the card and then using it in an emergency with no plan.",
          "Check the statement date and the due date. Paying a few days before the due date avoids a late fee, which is separate from interest and easy to miss.",
        ],
      },
    ],
    related: [
      { name: "Credit card payoff calculator", path: "/banking-tools/credit-card-payoff-calculator" },
      { name: "Personal loan calculator", path: "/loan-calculators/personal-loan-calculator" },
    ],
  },
  {
    slug: "income-tax-for-salaried-people",
    title: "Income Tax for Salaried People",
    blurb: "How the new and old regimes differ for FY 2026-27, in everyday language.",
    topic: "Tax",
    cat: "tax",
    intro:
      "This is a short map of salary tax in India for FY 2026-27, not personal tax advice. Slabs, the rebate and deductions change only when the law changes. Confirm the year's rules, or use the calculator, before you file.",
    sections: [
      {
        heading: "The order of the calculation",
        paragraphs: [
          "Start with gross income. Subtract the standard deduction if you are salaried, then any other deductions your regime allows. What remains is taxed slab by slab. A rebate may cancel tax at lower incomes. High incomes can add a surcharge. Health and education cess is 4% on the tax after that.",
          "Under the new regime for this year, salaried income up to Rs. 12.75 lakh is often effectively tax-free because of the Rs. 75,000 standard deduction and the Section 87A rebate on taxable income up to Rs. 12 lakh. Just above that line, marginal relief stops the tax from jumping by more than the extra income.",
        ],
      },
      {
        heading: "New regime or old regime",
        paragraphs: [
          "The new regime has wider slabs and few deductions. The old regime has higher rates and still allows items such as Section 80C, Section 80D, HRA and home-loan interest, within their caps.",
          "The old regime wins only when those deductions are large enough to beat the lower new-regime rates. Count deductions you would claim anyway. An investment you buy only to save tax can cost more than the tax it saves.",
        ],
      },
      {
        heading: "What salary slips already show",
        paragraphs: [
          "Form 16 and your payslips list gross pay, exemptions, and TDS already deducted. The return should match those figures. Other income, such as interest or capital gains, is added on top and some of it is taxed at special rates.",
          "Salaried people without business income can usually choose a regime each year. Tell your employer early so monthly TDS is close to the final tax. A big mismatch means a large bill or a long wait for a refund.",
        ],
      },
      {
        heading: "Using the calculators",
        paragraphs: [
          "Enter income and the deductions you can support with proofs. Compare both regimes on the same income. Then read the slab table so you know the rate on the last rupee, which is what a bonus is taxed at.",
          "The Income-tax Act 2025 renames some sections from 1 April 2026. The slabs, standard deduction and rebate described here for FY 2026-27 follow the same arithmetic the calculator uses. When in doubt, check the official notice or a tax professional.",
        ],
      },
    ],
    related: [
      { name: "Income tax calculator", path: "/tax-tools/income-tax-calculator" },
      { name: "Old vs new tax regime", path: "/tax-tools/old-vs-new-tax-regime" },
      { name: "HRA exemption calculator", path: "/tax-tools/hra-calculator" },
    ],
  },
  {
    slug: "salary-pf-and-take-home",
    title: "Salary, PF and Take-Home Pay",
    blurb: "Why CTC is not the amount that reaches your account, and how PF and gratuity fit in.",
    topic: "Tax",
    cat: "tax",
    intro:
      "Cost to company includes money the employer spends on you that you never see as cash. Provident fund, gratuity, tax and professional tax all open a gap between CTC and the salary credited each month.",
    sections: [
      {
        heading: "Reading a CTC sheet",
        paragraphs: [
          "Basic pay is the base. Allowances sit on top. The employer's PF contribution and a gratuity provision are often inside CTC even though they are not paid to you monthly. A joining bonus and variable pay may be listed as well, and they may not arrive every month.",
          "When you compare two offers, line up in-hand pay, employer PF and the benefits you would actually use. Two packages with the same CTC can differ by thousands a month.",
        ],
      },
      {
        heading: "What comes out of the monthly pay",
        paragraphs: [
          "Your own PF contribution, professional tax where the state charges it, and income tax are deducted before the credit. Professional tax is zero in some states. Tax depends on the regime you chose and on the proofs you submitted.",
          "A higher basic pay raises PF and gratuity and can lower in-hand pay. A lower basic leaves more in allowances, which may be taxable. Neither choice is free.",
        ],
      },
      {
        heading: "EPF over a career",
        paragraphs: [
          "Each month, 12% of basic plus dearness allowance is your contribution, and the employer adds a matching share. Part of the employer's share, up to a cap, goes to the pension scheme. The rest, plus interest, stays in EPF.",
          "Interest compounds. Withdrawing the balance every time you change jobs breaks that. Transfer it with your UAN instead. Withdrawals after five years of continuous service are generally tax-free. Earlier withdrawals can be taxed. Interest on very large employee contributions can also be taxable.",
        ],
      },
      {
        heading: "Gratuity when you leave",
        paragraphs: [
          "Under the Payment of Gratuity Act, gratuity is 15 days of last drawn basic plus DA for each completed year, with a month taken as 26 working days. A final part-year of more than six months can count as a full year. Five years of service is the usual eligibility, with exceptions such as death or disability.",
          "Tax-free gratuity has an upper limit. Keep appointment letters and slips. Use the in-hand, PF and gratuity calculators with your real basic pay so the offer letter and your budget tell the same story.",
        ],
      },
    ],
    related: [
      { name: "In-hand salary calculator", path: "/salary-hr/in-hand-salary-calculator" },
      { name: "PF calculator", path: "/salary-hr/pf-calculator" },
      { name: "Gratuity calculator", path: "/calculators/gratuity-calculator" },
    ],
  },
  {
    slug: "gst-for-small-invoices",
    title: "GST for Small Invoices",
    blurb: "How to add GST, remove it from a tax-inclusive price, and split CGST, SGST and IGST.",
    topic: "Tax",
    cat: "tax",
    intro:
      "Most GST mistakes on a small invoice come from adding tax to a price that already includes it, or from splitting the tax the wrong way between centre and state. The arithmetic is short once you see the base price.",
    sections: [
      {
        heading: "Adding GST",
        paragraphs: [
          "Start with the price before tax and multiply by the rate. At 18%, GST on Rs. 1,000 is Rs. 180, so the bill is Rs. 1,180. At 5% the tax on the same base is Rs. 50.",
          "Since 22 September 2025 most goods and services fall in the 5% or 18% slab, with 40% for a short list of luxury and sin goods. Older 12% and 28% rates still matter when you check a bill issued before that change.",
        ],
      },
      {
        heading: "Removing GST from an inclusive price",
        paragraphs: [
          "If a price already includes GST, divide by one plus the rate. Rs. 1,180 at 18% is a base of Rs. 1,000 and GST of Rs. 180. Subtracting 18% from 1,180 gives the wrong tax.",
          "Round to the nearest rupee only at the end, the way your invoice software does. Rounding each line and then adding can disagree with a single tax line by a rupee.",
        ],
      },
      {
        heading: "CGST, SGST and IGST",
        paragraphs: [
          "A supply inside the same state splits GST equally into CGST and SGST. The Rs. 180 above is Rs. 90 each. A supply to another state is IGST for the full Rs. 180.",
          "The place of supply rules decide which of those applies. When you are unsure, confirm the place of supply before you print the invoice. The calculator shows both splits so you can match the invoice format.",
        ],
      },
      {
        heading: "Keeping the tax separate",
        paragraphs: [
          "GST you collect is not your revenue. Set it aside so the return does not depend on cash that was already spent. Your own input tax, where you are allowed to claim it, reduces what you pay.",
          "If the rate for an item is unclear, check its HSN or SAC code against the official list. A calculator applies the rate you choose. It does not decide the rate for you.",
        ],
      },
    ],
    related: [
      { name: "GST calculator", path: "/business-tools/gst-calculator" },
    ],
  },
  {
    slug: "cgpa-attendance-and-exams",
    title: "CGPA, Attendance and Exam Dates",
    blurb: "Convert grades, see if attendance is enough, and count the days left before a paper.",
    topic: "Student",
    cat: "student",
    intro:
      "Colleges ask for marks as a percentage, a CGPA, or a letter grade, and they set a minimum attendance. This guide is the arithmetic behind those three checks so a form or a final week is less confusing.",
    sections: [
      {
        heading: "CGPA and percentage",
        paragraphs: [
          "Many Indian universities convert CGPA to a percentage by multiplying by 9.5, but some print a different factor on the marksheet. Use the factor your university states. A calculator that assumes 9.5 will not match a college that uses another rule.",
          "CGPA is an average of grade points, weighted by credits. A low grade in a high-credit subject pulls the CGPA down more than the same grade in a one-credit lab. That is why improving the heavy subjects changes the result faster.",
        ],
      },
      {
        heading: "Marks and letter grades",
        paragraphs: [
          "A marks-to-grade table is a set of cutoffs. Enter the score and the scheme your board uses. CBSE-style grades and a college's internal scheme are not the same table.",
          "If you know the marks you still need, work backwards from the cutoff. The gap between your current score and the next grade is the only number that matters for that paper.",
        ],
      },
      {
        heading: "Attendance before it is too late",
        paragraphs: [
          "Attendance is classes attended divided by classes held. If the rule is 75%, and 40 classes have been held, you need 30 already attended. Each class you miss raises the number you must still attend.",
          "Put the classes already held and attended into the calculator before the term is crowded. It tells you how many of the remaining classes you can miss. Guessing from a percentage on the notice board hides that count.",
        ],
      },
      {
        heading: "Days left before the exam",
        paragraphs: [
          "The exam countdown is the number of days between today and the paper. Count working days if you only revise on those days. A date difference that includes weekends will look more generous than your real revision time.",
          "Split the syllabus by the number of days you will actually study, and leave the last day for a pass over the whole paper. The tools for CGPA, attendance and the countdown are all on the student page.",
        ],
      },
    ],
    related: [
      { name: "CGPA to percentage", path: "/student-tools/cgpa-to-percentage-calculator" },
      { name: "Marks to grade", path: "/student-tools/marks-grade-calculator" },
      { name: "Attendance calculator", path: "/student-tools/attendance-calculator" },
      { name: "Exam countdown", path: "/student-tools/exam-countdown" },
    ],
  },
  {
    slug: "emails-and-meeting-notes",
    title: "Clear Emails and Meeting Notes",
    blurb: "A short structure for messages people can answer, and notes people can use.",
    topic: "Writing",
    cat: "writing",
    intro:
      "Most work email fails because the reader cannot see the ask. Most meeting notes fail because they record talk instead of decisions. A simple shape fixes both, before any tool rewrites a word.",
    sections: [
      {
        heading: "One email, one job",
        paragraphs: [
          "Put the action in the subject line: the decision you need, or the date. In the first lines, say what you want and by when. Background comes after that, for the reader who needs it.",
          "If you need a yes or no, ask it as a yes or no. If you need a choice, list two or three options and say which one you recommend. A paragraph of context with no question gets a slow reply.",
        ],
      },
      {
        heading: "Tone without padding",
        paragraphs: [
          "Short is polite when the point is clear. Extra apologies and stacked clauses make the request harder to find. Read the mail once as if you did not write it, and delete any sentence that does not help the reader act.",
          "Match the level of detail to the reader. A manager needs the decision and the risk. A teammate who will do the work needs the steps. The same facts can be two different mails.",
        ],
      },
      {
        heading: "Notes that survive the meeting",
        paragraphs: [
          "During the meeting, separate decisions, open questions and owners. A transcript of who said what is hard to use the next morning. Three lists are enough.",
          "Each action needs a name and a date. 'We should look at this' is not an action. If nobody owns it, write that down too, so it does not look decided.",
        ],
      },
      {
        heading: "Using a draft as a start",
        paragraphs: [
          "The email writer and the meeting-notes organiser on this site turn rough points into that shape. They run in the browser. Edit the result. A tool does not know which fact is sensitive or which date slipped.",
          "Keep a few of your own sent mails that got a fast, useful reply. Copy their shape next time. Your examples will beat a generic template.",
        ],
      },
    ],
    related: [
      { name: "Email writer", path: "/writing-tools/email-writer" },
      { name: "Meeting notes organiser", path: "/writing-tools/meeting-notes-organizer" },
      { name: "Word counter", path: "/text-tools/word-counter" },
    ],
  },
  {
    slug: "images-and-pdf-files",
    title: "Images and PDF Files",
    blurb: "Compress, resize, combine and split files without sending them to a server.",
    topic: "PDF",
    cat: "pdf",
    intro:
      "Photos and PDFs get shared more often than they get explained. This guide covers the few operations people repeat: making a file smaller, turning pictures into a PDF, and taking a PDF apart. On this site the file stays in your browser.",
    sections: [
      {
        heading: "Making an image smaller",
        paragraphs: [
          "File size and pixel size are different. Compressing keeps the dimensions and throws away detail the eye barely sees. Resizing changes the pixel width and height, which is what you want for a form that asks for a passport-size file under a limit.",
          "Save a copy. Compression does not improve a blurry photo, and a heavy compress cannot be undone from the small file alone. PNG is useful for screenshots and logos. JPEG is usually smaller for photos.",
        ],
      },
      {
        heading: "Pictures into one PDF",
        paragraphs: [
          "A set of document photos becomes one PDF when each image is placed on a page. A4 with a small margin looks like a scan. A page fitted to the image keeps the whole photo without white bars.",
          "Order the files before you create the PDF. Rotating one sideways page later is possible, but it is quicker to rotate the image first. Nothing is uploaded. The download is built on your device.",
        ],
      },
      {
        heading: "Merge, split and rotate",
        paragraphs: [
          "Merging copies pages from each PDF into a new file, in the order you set. Splitting uses ranges such as 1-3, 5. You can keep those pages together or make one file per range. Quality stays as it was, because the pages are copied, not photographed again.",
          "Rotate when a scan came out sideways. You can turn every page, only odd or even pages, or a list of page numbers. Reorder when a page was scanned in the wrong place. Delete blank pages in that same view.",
        ],
      },
      {
        heading: "Limits to expect",
        paragraphs: [
          "The practical limit is your device memory. Phones handle everyday documents. A very large scan can fail on a low-memory phone even though the same file is fine on a laptop. Close other heavy tabs if a file will not open.",
          "These tools do not unlock a password-protected PDF and they do not send the file to FreeToolsPro. If a form still rejects the download, check the site's asked format and size, then resize or compress again.",
        ],
      },
    ],
    related: [
      { name: "Image compressor", path: "/image-tools/image-compressor" },
      { name: "JPG to PDF", path: "/pdf-tools/jpg-to-pdf" },
      { name: "Merge PDF", path: "/pdf-tools/pdf-merger" },
      { name: "Split PDF", path: "/pdf-tools/pdf-splitter" },
    ],
  },
  {
    slug: "seo-for-a-small-website",
    title: "SEO for a Small Website",
    blurb: "Titles, descriptions, canonicals and a sitemap, checked before you publish.",
    topic: "SEO",
    cat: "seo",
    intro:
      "A small site is easier to fix than a large one, because every page can have a deliberate title and description. Search engines still need those basics, a canonical URL, and a sitemap that lists only real pages.",
    sections: [
      {
        heading: "The title and the description",
        paragraphs: [
          "The title is the blue link. Put the subject first, and keep it short enough that it is not cut off in the results. The description is the grey text under it. It does not directly rank the page, but it is what a person reads before they click.",
          "Write the description as a sentence about that page, not a list of every topic on the site. Check the length in the snippet preview. A title that repeats the same words on every page wastes the one line you control.",
        ],
      },
      {
        heading: "One address per page",
        paragraphs: [
          "A canonical tag tells search engines which URL is the main copy when the same page opens under more than one address. Use the full https address, and use the same one in the sitemap.",
          "Parameters used for tracking, and www versus non-www, are common duplicates. Pick one host, redirect the other, and point the canonical at the one you keep.",
        ],
      },
      {
        heading: "Sitemap and robots.txt",
        paragraphs: [
          "A sitemap is a list of URLs you want crawled. Leave out thin duplicates, admin pages and old addresses that now redirect. An address in the sitemap that returns 404 wastes crawl attention.",
          "robots.txt can block whole folders. It does not hide a URL that other sites already link to. Use noindex on a page that must stay reachable but should not appear in results. Test the file before you rely on it.",
        ],
      },
      {
        heading: "A pass before you publish",
        paragraphs: [
          "Read the title, the description and the canonical together. Then check the Open Graph title and image, because that is what chat apps and social posts show, which can differ from the search snippet.",
          "The SEO tools on this site preview the snippet, check title length, and validate a sitemap or robots file. They do not submit the site to Google. That step still happens in your own search console.",
        ],
      },
    ],
    related: [
      { name: "SERP snippet preview", path: "/seo-tools/serp-snippet-preview" },
      { name: "Meta title checker", path: "/seo-tools/meta-title-description-checker" },
      { name: "Sitemap validator", path: "/seo-tools/sitemap-validator" },
    ],
  },
  {
    slug: "passwords-and-browser-privacy",
    title: "Passwords and Browser Privacy",
    blurb: "What a strong password is, what stays on your device, and what a hash is for.",
    topic: "Privacy",
    cat: "encoding",
    intro:
      "A password is a secret you can remember or store. A hash is a fingerprint of some text. Encoding such as Base64 is neither encryption nor a password. Mixing those up is how people 'hide' a secret in a way that anyone can reverse.",
    sections: [
      {
        heading: "A password that holds up",
        paragraphs: [
          "Length matters more than a clever substitution. A long phrase of ordinary words is stronger than a short word with a symbol swapped in. Use a different password for email, banking and every other account that can reset the rest.",
          "A generator can pick a random password. Store it in a password manager. Writing it in a note on the same phone as the account is only a small step up from reusing one password everywhere.",
        ],
      },
      {
        heading: "Strength is not the same as a breach",
        paragraphs: [
          "A strength checker looks at length and variety. It cannot know whether that exact password already appears in a leaked list. A long unique password is the practical answer. Change it when a service tells you it was exposed.",
          "Two-factor login protects you when a password does leak. Prefer an app or a hardware key over a code sent by SMS when the service offers it.",
        ],
      },
      {
        heading: "Hashes, Base64 and encryption",
        paragraphs: [
          "A hash such as SHA-256 turns text into a fixed fingerprint. You cannot turn the fingerprint back into the text. Sites store hashes so they can check a password without keeping the password. MD5 is old. Do not use it for new passwords.",
          "Base64 is a way to write bytes as text. Anyone can decode it. It is not a lock. Encryption, which these pages do not claim to provide, is what actually hides a message from someone who has the file.",
        ],
      },
      {
        heading: "What these tools send away",
        paragraphs: [
          "The password generator, strength check and hash tools in this set run in the browser. Your input is not uploaded to FreeToolsPro. Ads on the wider site are a separate matter, covered in the cookie policy.",
          "Do not type a real password into a page you do not trust, including this one, if you can avoid it. Generate a new password, or hash a sample, when you only need to learn how the tool works.",
        ],
      },
    ],
    related: [
      { name: "Password generator", path: "/trending-tools/password-generator" },
      { name: "Password strength checker", path: "/security-tools/password-strength-checker" },
      { name: "SHA-256 generator", path: "/hash-tools/sha256-generator" },
    ],
  },
];
