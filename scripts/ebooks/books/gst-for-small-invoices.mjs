// Practice material for "GST for Small Invoices".
// Rates are those in force after the GST rate rationalisation of 22 September 2025:
// 5% and 18% as the main slabs, 40% for a short list of luxury and sin goods, with
// 3% for gold and silver, 0.25% for rough diamonds, and nil or exempt supplies.
import { inr, inr2 } from "../lib/calc.mjs";

const Rs = (n) => `Rs. ${inr(n)}`;
const Rs2 = (n) => `Rs. ${inr2(n)}`;
const add = (base, rate) => ({ base, gst: (base * rate) / 100, total: base * (1 + rate / 100) });
const remove = (total, rate) => {
  const base = (total * 100) / (100 + rate);
  return { base, gst: total - base, total };
};

// A small set of everyday invoices for problems: [who, place, item, amount, rate, inclusive, inter]
const INV = [
  ["A tailor", "Surat", "stitching charges", 4500, 5, false, false],
  ["A web designer", "Pune", "a landing page", 38000, 18, false, false],
  ["A café", "Kochi", "a catering order", 12600, 5, true, false],
  ["A furniture maker", "Jodhpur", "a dining table sold to a buyer in Delhi", 65000, 18, false, true],
  ["A photographer", "Jaipur", "a wedding shoot", 85000, 18, false, false],
  ["A tutor running a coaching centre", "Patna", "a term's fees", 24000, 18, true, false],
  ["A software consultant", "Bengaluru", "a month's retainer to a client in Hyderabad", 120000, 18, false, true],
  ["A printer", "Sivakasi", "printed cartons", 52000, 18, false, false],
  ["A jeweller", "Thrissur", "a gold chain", 180000, 3, false, false],
  ["A dairy", "Anand", "packaged paneer", 9500, 5, false, false],
];

export default {
  checked: "October 2026",
  welcome:
    "This book is for freelancers, shopkeepers and small firms who issue and receive GST invoices. It explains how to add and remove GST correctly, when to charge CGST and SGST or IGST, how the rates changed in September 2025, what a valid invoice must show, how input tax credit works, which returns to file and when, and the common mistakes that cost small businesses money. It does not replace the law or a tax professional, but it should make your next invoice correct.",

  chapters: [
    {
      title: "The rates after September 2025",
      paragraphs: [
        "From 22 September 2025, most goods and services moved into two main GST rates, 5 percent and 18 percent, replacing the earlier 5, 12, 18 and 28 percent structure. A separate 40 percent rate applies to a short list of luxury and sin goods. Compensation cess was removed for most items. A few special rates continue, such as 3 percent on gold and silver and 0.25 percent on rough diamonds.",
      ],
      sections: [
        {
          table: {
            caption: "Broad rate structure. The rate for a specific item depends on its HSN or SAC code; check the official notifications.",
            headers: ["Rate", "Typical items"],
            widths: [0.8, 3.2],
            rows: [
              ["Nil or exempt", "Fresh produce, milk, many educational and health services, some essential items"],
              ["5%", "Many food items, packaged staples, some textiles, some transport and restaurant services"],
              ["18%", "Most services including professional, IT and consultancy, most manufactured goods"],
              ["40%", "A short list of luxury and sin goods, such as certain tobacco products and luxury vehicles"],
              ["3%", "Gold, silver and jewellery"],
              ["0.25%", "Rough and semi-precious stones in specified cases"],
            ],
          },
        },
        {
          heading: "Invoices from before the change",
          paragraphs: [
            "Bills issued before 22 September 2025 may show 12 or 28 percent. Do not reissue them at new rates. For supplies that straddle the change, the date of supply rules, based on the dates of invoice, payment and delivery, decide which rate applies. The site's GST calculator keeps the old rates for checking older bills.",
          ],
        },
        {
          heading: "Finding your rate",
          paragraphs: [
            "Goods are classified by HSN code and services by SAC code. The code decides the rate, not the name you give the product. Look up the code in the CBIC rate finder or the GST portal's search, and keep a note of the code and rate for each item you sell. If two codes could apply, take professional advice; misclassification is a common source of disputes.",
          ],
        },
      ],
    },
    {
      title: "Adding and removing GST",
      paragraphs: [
        "Two calculations cover almost every invoice. When you know the price before tax, multiply. When you know the price including tax, divide.",
      ],
      sections: [
        {
          heading: "Adding GST to a price",
          paragraphs: [
            `Price including GST = base × (1 + rate ÷ 100). For a base of ${Rs(10000)} at 18 percent, GST is ${Rs(1800)} and the total is ${Rs(11800)}.`,
          ],
        },
        {
          heading: "Removing GST from an inclusive price",
          paragraphs: [
            `Base = inclusive price × 100 ÷ (100 + rate). For ${Rs(11800)} including 18 percent, the base is ${Rs(10000)} and GST is ${Rs(1800)}.`,
            `The common mistake is to take 18 percent off the inclusive price. That gives ${Rs(11800 * 0.82)}, not ${Rs(10000)}, because 18 percent of the larger figure is more than the tax inside it. The tax inside an 18 percent inclusive price is 18 ÷ 118, about ${((18 / 118) * 100).toFixed(2)} percent of it.`,
          ],
          table: {
            caption: "Share of an inclusive price that is GST.",
            headers: ["Rate", "GST as share of inclusive price", "Base as share"],
            rows: [3, 5, 18, 40].map((r) => [`${r}%`, `${((r / (100 + r)) * 100).toFixed(2)}%`, `${((100 / (100 + r)) * 100).toFixed(2)}%`]),
          },
        },
        {
          heading: "Rounding",
          paragraphs: [
            "Compute tax on each line, round to the paisa, then total. Many businesses round the invoice total to the nearest rupee and show a round-off line. Be consistent, and make sure the tax shown matches the base times the rate for each line.",
          ],
        },
      ],
    },
    {
      title: "CGST and SGST, or IGST",
      paragraphs: [
        "GST is split between the centre and the states. Which taxes you charge depends on whether the supplier's location and the place of supply are in the same state.",
      ],
      sections: [
        {
          heading: "Within a state",
          paragraphs: [
            `For an intra-state supply, charge CGST and SGST, each at half the rate. At 18 percent on ${Rs(50000)}, that is ${Rs(4500)} CGST and ${Rs(4500)} SGST. In a union territory without a legislature, UTGST replaces SGST.`,
          ],
        },
        {
          heading: "Across states",
          paragraphs: [
            `For an inter-state supply, charge IGST at the full rate: ${Rs(9000)} on the same ${Rs(50000)}. The buyer in another state claims the IGST as input tax credit.`,
          ],
        },
        {
          heading: "Place of supply",
          paragraphs: [
            "For goods, the place of supply is usually where delivery ends. For most services to a registered business, it is the recipient's location. For services to an unregistered person, it is usually the recipient's address on record, or the supplier's location if none. Special rules apply to events, property-related services, transport and online services. Getting this wrong charges the wrong tax, which the buyer cannot use and you must correct.",
          ],
        },
        {
          heading: "Exports",
          paragraphs: [
            "Exports of goods and services are zero-rated. You can export without paying IGST under a letter of undertaking and claim a refund of input credit, or pay IGST and claim a refund of it. Services to a foreign client qualify as exports only if conditions are met, including payment in convertible foreign exchange or permitted rupee routes.",
          ],
        },
      ],
    },
    {
      title: "What a tax invoice must show",
      paragraphs: [
        "A registered supplier must issue a tax invoice for taxable supplies. Missing details can block your buyer's input tax credit, which is a quick way to lose a client.",
      ],
      sections: [
        {
          bullets: [
            "Your name, address and GSTIN.",
            "A consecutive invoice number, unique for the financial year, up to 16 characters.",
            "Date of issue.",
            "Buyer's name, address and GSTIN if registered.",
            "Place of supply, with the state name, for inter-state supplies.",
            "HSN or SAC code: at least 4 digits if turnover is up to Rs. 5 crore, 6 digits above that, for B2B invoices.",
            "Description, quantity and unit for goods.",
            "Taxable value after discounts.",
            "Rate and amount of CGST and SGST, or IGST.",
            "Total value.",
            "Whether tax is payable under reverse charge.",
            "Signature or digital signature of the supplier or authorised person.",
          ],
        },
        {
          heading: "Bill of supply",
          paragraphs: [
            "For exempt supplies, or if you are under the composition scheme, issue a bill of supply instead, which shows no tax.",
          ],
        },
        {
          heading: "E-invoicing",
          paragraphs: [
            "Businesses whose aggregate turnover in any year since 2017-18 has exceeded Rs. 5 crore must generate e-invoices for B2B supplies through the Invoice Registration Portal, which returns an invoice reference number and QR code. Smaller businesses are not required to, but it is worth knowing in case a large client asks.",
          ],
        },
      ],
    },
    {
      title: "Registration and the composition scheme",
      paragraphs: [
        "Not every small business must register. Registration is compulsory when aggregate turnover crosses a threshold, and in some cases regardless of turnover.",
      ],
      sections: [
        {
          heading: "Thresholds",
          table: {
            caption: "Aggregate turnover thresholds for compulsory registration. Some states have lower limits.",
            headers: ["Business", "Most states", "Special category states"],
            rows: [["Supplying only goods", "Rs. 40 lakh", "Rs. 20 lakh"], ["Supplying services, or goods and services", "Rs. 20 lakh", "Rs. 10 lakh"]],
          },
          paragraphs: [
            "Registration is required regardless of turnover for inter-state supplies of goods, e-commerce sellers in many cases, and those liable under reverse charge, among others. Inter-state supply of services up to the threshold is generally allowed without registration.",
          ],
        },
        {
          heading: "Voluntary registration",
          paragraphs: [
            "A business below the threshold can register voluntarily. It can then charge GST and claim input credit, which helps when clients are registered businesses who want to claim credit. It also brings monthly or quarterly compliance.",
          ],
        },
        {
          heading: "Composition scheme",
          paragraphs: [
            "Small businesses with turnover up to Rs. 1.5 crore, or Rs. 75 lakh in some states, can opt for composition: pay tax at a low flat rate on turnover, typically 1 percent for traders and manufacturers and 5 percent for restaurants, with a separate option at 6 percent for small service providers up to Rs. 50 lakh. In exchange, they cannot collect GST from customers, cannot claim input credit and cannot make inter-state supplies of goods.",
            "Composition suits businesses selling mainly to consumers. It suits less well those selling to registered businesses, which cannot claim credit on purchases from a composition dealer.",
          ],
        },
      ],
    },
    {
      title: "Input tax credit",
      paragraphs: [
        "Input tax credit lets a registered business deduct the GST it paid on purchases used for business from the GST it collects on sales. It is what makes GST a tax on value added rather than on every transaction.",
      ],
      sections: [
        {
          heading: "Conditions",
          bullets: [
            "You hold a valid tax invoice or debit note.",
            "You have received the goods or services.",
            "The supplier has reported the invoice in its GSTR-1, so it appears in your GSTR-2B.",
            "The supplier has paid the tax to the government.",
            "You have filed your own return.",
            "You pay the supplier within 180 days of the invoice date, or reverse the credit until you do.",
          ],
        },
        {
          heading: "Blocked credits",
          paragraphs: [
            "Credit is not allowed on some items even for business use: most motor vehicles for passengers, food and beverages, club memberships, personal consumption, and works contracts for building immovable property, among others. Check the list before assuming credit.",
          ],
        },
        {
          heading: "An example",
          paragraphs: [
            `A furniture maker buys wood for ${Rs(40000)} plus 18 percent GST, ${Rs(7200)}. She sells furniture for ${Rs(65000)} plus 18 percent, ${Rs(11700)}. Her GST payable is ${Rs(11700)} minus ${Rs(7200)} credit, ${Rs(4500)}, which is 18 percent of the ${Rs(25000)} value she added.`,
          ],
        },
      ],
    },
    {
      title: "Returns and dates",
      paragraphs: [
        "Registered businesses file returns monthly or quarterly. The main ones for a small business are GSTR-1, reporting sales, and GSTR-3B, a summary return with payment.",
      ],
      sections: [
        {
          table: {
            caption: "Usual due dates. Check the portal for extensions.",
            headers: ["Return", "Monthly filers", "QRMP (quarterly) filers"],
            widths: [1.2, 1.4, 2],
            rows: [
              ["GSTR-1 (sales)", "11th of next month", "13th after the quarter; optional invoice upload by the 13th in the first two months"],
              ["GSTR-3B (summary and tax)", "20th of next month", "22nd or 24th after the quarter, by state"],
              ["Tax payment under QRMP", "-", "By the 25th of each of the first two months, using PMT-06"],
              ["GSTR-9 (annual)", "31 December after the year", "Optional below set turnover limits"],
              ["CMP-08 (composition)", "-", "18th after each quarter"],
            ],
          },
        },
        {
          heading: "QRMP",
          paragraphs: [
            "Businesses with turnover up to Rs. 5 crore can choose the Quarterly Return Monthly Payment scheme: returns quarterly, tax monthly. It reduces filings to four GSTR-1s and four GSTR-3Bs a year.",
          ],
        },
        {
          heading: "Late fees and interest",
          paragraphs: [
            "Late filing attracts a fee per day, capped, and lower for nil returns. Late payment of tax attracts interest at 18 percent a year on the amount paid late. Missing returns for several periods can lead to suspension of registration, which blocks your clients' credit too.",
          ],
        },
      ],
    },
    {
      title: "Reverse charge, e-way bills and other special cases",
      paragraphs: ["A few situations change who pays the tax or what documents must travel with the goods."],
      sections: [
        { label: "Reverse charge", paragraphs: ["For certain supplies, the recipient pays GST instead of the supplier: for example, legal services from an advocate to a business, goods transport agency services in many cases, and some supplies from unregistered persons as notified. The recipient pays the tax in cash and can usually claim it back as credit."] },
        { label: "E-way bill", paragraphs: ["Moving goods worth more than Rs. 50,000 generally requires an e-way bill generated on the portal before movement, with transporter details. Some states set different limits for intra-state movement."] },
        { label: "Advances", paragraphs: ["For services, GST is due on advances received, at the time of receipt, with a receipt voucher. For goods, GST on advances is generally not required for most taxpayers."] },
        { label: "Discounts", paragraphs: ["A discount shown on the invoice reduces the taxable value. A later discount reduces it only if agreed in advance and linked to specific invoices, with the buyer reversing credit; otherwise, it does not reduce GST."] },
        { label: "Free samples and gifts", paragraphs: ["Credit on goods given away free is generally blocked; gifts to employees above a value limit are treated as supplies."] },
        { label: "Online sellers", paragraphs: ["E-commerce operators collect tax at source on payments to sellers; sellers claim it as credit. Most sellers on marketplaces must register regardless of turnover, with some relaxations for small sellers of goods within a state."] },
      ],
    },
    {
      title: "Credit notes, debit notes and corrections",
      paragraphs: [
        "Invoices go wrong: prices change, goods come back, a rate was wrong. GST provides documents to correct them without cancelling the original.",
      ],
      sections: [
        {
          heading: "Credit note",
          paragraphs: [
            "Issued when the value or tax on an invoice was too high, or goods are returned. It reduces your output tax for the period in which you report it. It must reference the original invoice and be issued by 30 November after the end of the financial year of the supply, or before the annual return if earlier.",
          ],
        },
        {
          heading: "Debit note",
          paragraphs: [
            "Issued when the value or tax was too low. It increases your output tax, and the buyer can claim credit on it.",
          ],
        },
        {
          heading: "Wrong tax type",
          paragraphs: [
            "If you charged CGST and SGST instead of IGST, or the reverse, you pay the correct tax and claim a refund of the wrong one. The buyer's credit depends on the correction too, so fix it quickly.",
          ],
        },
      ],
    },
    {
      title: "GST money is not yours",
      paragraphs: [
        "The GST you collect belongs to the government from the moment the customer pays. Treating it as revenue is the most common way small businesses end up unable to pay their returns.",
      ],
      sections: [
        {
          steps: [
            "Open a separate current account or sub-account for GST.",
            "When a customer pays, move the GST portion there the same day.",
            "Pay the monthly or quarterly liability from that account.",
            "Reconcile it monthly with your sales register and GSTR-1.",
          ],
          note: "If your margins are thin, remember that your price excluding GST is your revenue. Quoting 'inclusive' prices to win business means absorbing the tax yourself.",
        },
      ],
    },
    {
      title: "Pricing with GST in mind",
      paragraphs: [
        "GST does not change what your work is worth, but it changes how a price is perceived. A few habits keep your margin safe and your clients clear.",
      ],
      sections: [
        {
          heading: "Quote the base, show the tax",
          paragraphs: [
            "For registered business clients, quote your price before GST and show the tax as a separate line. They will claim it back, so the base is what matters to them. For consumers, show the inclusive price prominently, since that is what they pay, with the tax split shown on the bill.",
          ],
        },
        {
          heading: "Working back from a target",
          paragraphs: [
            `If you need ${Rs(40000)} for a job and the client wants a single figure, the all-in price at 18 percent is ${Rs(47200)}. Quoting ${Rs(40000)} all-in leaves you ${Rs2(remove(40000, 18).base)} after tax, a cut of more than 15 percent.`,
          ],
        },
        {
          heading: "Rate changes and contracts",
          paragraphs: [
            "Long contracts should say that GST will be charged at the rate applicable at the time of supply. When rates fall, as many did in September 2025, customers expect lower prices; anti-profiteering expectations mean passing on rate cuts is wise even where not strictly enforced in your case.",
          ],
        },
        {
          heading: "Competing with unregistered sellers",
          paragraphs: [
            "An unregistered competitor below the threshold does not charge GST. Consumers may see your price as higher. Registered business clients, however, prefer you because they get credit. Know which kind of customer you serve before deciding whether voluntary registration helps or hurts.",
          ],
        },
      ],
    },
    {
      title: "Books and records to keep",
      paragraphs: [
        "GST law requires registered businesses to keep accounts at their principal place of business, and to retain them for a set number of years after the annual return. Good records also make returns quick.",
      ],
      sections: [
        {
          bullets: [
            "Sales register: every invoice, credit note and debit note issued, with date, buyer, value, rate and tax.",
            "Purchase register: every invoice received, with supplier GSTIN, tax and whether credit was claimed.",
            "Stock records for goods: opening, purchases, sales and closing quantities.",
            "Payments and receipts with bank references, to support the 180-day rule.",
            "Returns filed, challans and acknowledgements.",
            "E-way bills, delivery challans and transport documents.",
            "Contracts and purchase orders, especially where discounts or rate terms are agreed.",
          ],
          paragraphs: [
            "Accounting software that generates GST-compliant invoices and exports data for GSTR-1 saves hours each month. Even a well-kept spreadsheet works for a small business if every invoice is entered the day it is issued.",
          ],
        },
        {
          heading: "Monthly reconciliation",
          steps: [
            "Match your sales register with the GSTR-1 you are about to file.",
            "Match your purchase register with GSTR-2B and chase suppliers for missing invoices.",
            "Match tax paid with your GST bank account and the electronic cash ledger.",
            "Note any differences and their reasons before filing GSTR-3B.",
          ],
        },
      ],
    },
    {
      title: "GST for service freelancers",
      paragraphs: [
        "Designers, developers, writers, photographers, consultants and tutors make up a large share of small GST registrants. Their questions are mostly the same.",
      ],
      sections: [
        { label: "Which rate?", paragraphs: ["Most professional and consultancy services, including design, development, writing, photography and marketing, are taxed at 18 percent. Check the SAC code for your service; a few services have lower rates or exemptions."] },
        { label: "Which tax?", paragraphs: ["For a registered client, the place of supply is usually the client's location. If the client is in your state, charge CGST and SGST; otherwise IGST. For an individual client, it is usually the client's address on record."] },
        { label: "Foreign clients", paragraphs: ["Services to foreign clients paid in foreign exchange generally qualify as exports. File a letter of undertaking once a year on the portal and invoice without IGST. Keep the foreign remittance certificates."] },
        { label: "Platforms and marketplaces", paragraphs: ["If you sell services through an online platform, check whether the platform is responsible for GST on your services, as it is for some categories such as ride-hailing and food delivery. Otherwise, you charge GST yourself."] },
        { label: "Expenses you can claim", paragraphs: ["Laptops, software subscriptions, co-working fees, internet, professional courses related to your work, and phone bills used for business can carry input credit if the supplier charged GST and you hold a valid invoice in your name and GSTIN."] },
        { label: "Advances", paragraphs: ["For services, GST is due when you receive an advance. Issue a receipt voucher, pay tax on it, and adjust it in the final invoice."] },
        { label: "Income tax is separate", paragraphs: ["GST collected is not your income. Your income for income-tax purposes is the base amount, less expenses. Many freelancers use the presumptive scheme for income tax, which is unrelated to GST."] },
      ],
    },
    {
      title: "Mistakes that cost small businesses",
      paragraphs: ["Most GST trouble for small businesses comes from a short list of avoidable errors."],
      sections: [
        { label: "Treating GST as revenue", paragraphs: ["Spending collected tax and being unable to pay the return. Separate it on the day it arrives."] },
        { label: "Wrong tax type", paragraphs: ["Charging CGST and SGST on inter-state supplies, or IGST within a state. Check place of supply on every invoice."] },
        { label: "Taking 18 percent off an inclusive price", paragraphs: ["Understating the base and overstating tax. Divide by 1.18 instead."] },
        { label: "Claiming credit not in GSTR-2B", paragraphs: ["Leads to notices and reversals with interest. Match before claiming."] },
        { label: "Late or missed returns", paragraphs: ["Late fees, interest and eventually suspension, which blocks clients' credit."] },
        { label: "Not updating rates", paragraphs: ["Continuing old rates after a change, as many did after 22 September 2025. Update software on the day."] },
        { label: "Missing reverse charge", paragraphs: ["Not paying tax on legal fees, transport and other reverse-charge supplies."] },
        { label: "Unpaid suppliers past 180 days", paragraphs: ["Forced credit reversal with interest. Pay GST-carrying invoices on time."] },
        { label: "Poor invoices", paragraphs: ["Missing GSTIN, HSN or place of supply, which can block the buyer's credit and harm relationships."] },
        { label: "Ignoring notices", paragraphs: ["Portal notices about mismatches have deadlines. Responding early is usually simple; ignoring them leads to demands."] },
      ],
    },
    {
      title: "A year of GST for a small shop",
      paragraphs: [
        "Here is one illustrative year for a regular-registered hardware shop in Coimbatore with yearly sales of about Rs. 1.2 crore, mostly at 18 percent, filing under QRMP.",
      ],
      sections: [
        {
          table: {
            caption: "Quarterly summary. Figures rounded; illustrative.",
            headers: ["Quarter", "Taxable sales", "Output GST", "Input credit", "Cash paid"],
            rows: [
              ["Apr-Jun", "28,00,000", "5,04,000", "3,96,000", "1,08,000"],
              ["Jul-Sep", "27,00,000", "4,86,000", "3,78,000", "1,08,000"],
              ["Oct-Dec", "34,00,000", "6,12,000", "4,86,000", "1,26,000"],
              ["Jan-Mar", "31,00,000", "5,58,000", "4,32,000", "1,26,000"],
            ],
          },
          paragraphs: [
            "The festival quarter has the highest sales and highest tax. Because input credit tracks purchases, the cash paid each quarter is a modest share of output tax, reflecting the value the shop adds.",
            "The owner moves the GST portion of each day's takings into a separate account, pays by the 25th of each month under QRMP, files the quarterly returns, and reconciles purchases with GSTR-2B every month. In December she files the annual return with her accountant.",
          ],
        },
        {
          heading: "What went wrong once",
          paragraphs: [
            "In the October quarter a supplier filed late, so Rs. 40,000 of credit was missing from GSTR-2B. The owner paid that amount in cash and reclaimed it in the next quarter. Since then she pays that supplier only after checking its filing status.",
          ],
        },
      ],
    },
    {
      title: "Notices and how to respond",
      paragraphs: [
        "The GST system matches data across returns and taxpayers. Mismatches generate notices on the portal, which also arrive by email. Most can be resolved without a visit.",
      ],
      sections: [
        {
          table: {
            caption: "Common notices for small businesses.",
            headers: ["Notice about", "Usual cause", "Usual response"],
            widths: [1.3, 1.8, 2],
            rows: [
              ["Difference between GSTR-1 and GSTR-3B", "Sales reported in one return but not the other", "Pay any tax short with interest, or explain timing differences"],
              ["Excess credit compared with GSTR-2B", "Credit claimed for invoices suppliers did not report", "Reverse with interest, or show the supplier has since reported"],
              ["Non-filing of returns", "Missed returns", "File pending returns with late fees"],
              ["E-way bill mismatches", "Goods moved without matching invoices", "Reconcile and explain"],
              ["Suspected fake invoices from a supplier", "Supplier's registration cancelled", "Show genuine purchase with payment and delivery proof; reverse credit if needed"],
            ],
          },
          paragraphs: [
            "Read the notice fully, note the deadline, gather invoices and bank statements, and reply on the portal. If the amount is significant or the issue complex, involve a professional early. Late replies lose options.",
          ],
        },
      ],
    },
    {
      title: "How GST moves through a chain",
      paragraphs: [
        "GST is collected in small pieces at every stage of a supply chain, but the final burden falls on the consumer. Following one product through the chain shows why input credit matters.",
      ],
      sections: [
        {
          table: {
            caption: "A wooden chair at 18 percent through three businesses. Each claims credit on what it paid.",
            headers: ["Stage", "Sale price before GST", "GST charged", "Credit claimed", "GST paid in cash"],
            rows: [
              ["Timber supplier", "2,000", "360", "0", "360"],
              ["Furniture maker", "5,000", "900", "360", "540"],
              ["Retail shop", "7,000", "1,260", "900", "360"],
              ["Total to government", "", "", "", "1,260"],
            ],
          },
          paragraphs: [
            "The consumer pays Rs. 8,260 for the chair, of which Rs. 1,260 is GST, exactly 18 percent of the final price. Each business paid tax only on the value it added. If any business in the chain cannot claim credit, because a supplier did not file or an invoice was wrong, the tax is paid twice on part of the value, and someone's margin absorbs it.",
            "That is why small suppliers who file late or issue faulty invoices lose business: their buyers end up paying extra tax.",
          ],
        },
      ],
    },
    {
      title: "Questions to ask your accountant",
      paragraphs: ["Even if someone else files your returns, you remain responsible for them. These questions keep you informed."],
      sections: [
        {
          steps: [
            "Which rate and HSN or SAC applies to each thing I sell, and where is that written down?",
            "Am I on monthly filing or QRMP, and what are my exact dates?",
            "How much input credit did I lose last quarter, and why?",
            "Which of my suppliers file late?",
            "Do any of my purchases fall under reverse charge?",
            "What notices have come on the portal, and what was the response?",
            "Is my composition or regular status still right for my business?",
            "What should I change in my invoices or software?",
          ],
        },
      ],
    },
    {
      title: "GST on everyday business costs",
      paragraphs: [
        "Knowing roughly what GST you pay on common costs helps you estimate input credit and spot invoices that look wrong. Rates below are typical after September 2025; always check the invoice and the code.",
      ],
      sections: [
        {
          table: {
            caption: "Typical GST on small-business costs and whether credit is usually available.",
            headers: ["Cost", "Typical rate", "Credit usually available?"],
            widths: [1.8, 0.9, 1.6],
            rows: [
              ["Commercial rent", "18%", "Yes, if used for business"],
              ["Laptops and phones", "18%", "Yes, for business use"],
              ["Software subscriptions", "18%", "Yes; foreign services may be under reverse charge"],
              ["Internet and mobile bills", "18%", "Yes, for business use"],
              ["Accounting and legal fees", "18%", "Yes; advocate fees under reverse charge"],
              ["Packaging material", "5% or 18% by item", "Yes"],
              ["Goods transport", "5% or 12% by option", "Depends on the option chosen"],
              ["Staff meals and refreshments", "5% to 18%", "Generally blocked"],
              ["Passenger car", "Varies by type", "Generally blocked"],
              ["Hotel stay for business travel", "5% or 18% by tariff", "Yes, if invoice carries your GSTIN"],
              ["Courier", "18%", "Yes"],
            ],
          },
          paragraphs: [
            "When travelling for work, give your GSTIN to hotels and airlines so invoices carry it; otherwise the credit is lost. For foreign software services bought by a registered business, GST is often payable by you under reverse charge and then claimable.",
          ],
        },
      ],
    },
    {
      title: "GST myths, checked",
      paragraphs: ["Beliefs that cause wrong invoices and lost money."],
      sections: [
        { label: "Myth: Small businesses do not need to bother with GST.", paragraphs: ["Below the threshold, registration is optional, but many small businesses must register anyway, for example if they sell goods across states or on marketplaces."] },
        { label: "Myth: GST is a cost to my business.", paragraphs: ["For a registered business that claims credit, GST passes through; the consumer bears it. It becomes a cost only when credit is lost or prices are set inclusive."] },
        { label: "Myth: 18 percent of the bill is the tax.", paragraphs: ["Only if the bill is before tax. On an inclusive bill, the tax is 18 ÷ 118 of it."] },
        { label: "Myth: I can claim credit on anything I buy.", paragraphs: ["Credit is allowed only on business purchases, with valid invoices in GSTR-2B, and not on blocked items."] },
        { label: "Myth: Nil returns are optional.", paragraphs: ["Returns are due for every period while registered, sales or not."] },
        { label: "Myth: A proforma invoice settles GST.", paragraphs: ["Only a tax invoice does. A proforma is a quotation."] },
        { label: "Myth: Composition is always cheaper.", paragraphs: ["It is simpler, but without credit and without collecting tax from customers, it can cost more for businesses with taxed inputs or business clients."] },
      ],
    },
    {
      title: "The first ninety days after registering",
      paragraphs: ["A new registration brings a few one-time tasks. Doing them in the first weeks avoids months of small problems."],
      sections: [
        {
          steps: [
            "Download the registration certificate and display the GSTIN at your place of business and on your website and invoices.",
            "Decide monthly or quarterly filing and set calendar reminders for every return and payment date.",
            "Set up invoice templates or billing software with your GSTIN, state code, HSN or SAC and correct rates.",
            "Open a separate bank account or sub-account for GST.",
            "Tell suppliers your GSTIN so their invoices carry it and your credit appears in GSTR-2B.",
            "List your products or services with their codes and rates in one place.",
            "If you export services, file the letter of undertaking before the first export invoice.",
            "File the first returns on time, even if they are nil.",
          ],
        },
        {
          heading: "Stock on the day you register",
          paragraphs: [
            "A business registering for the first time can, within limits, claim credit on inputs held in stock on the day before registration, if it has the purchase invoices. File the declaration on the portal within the time allowed.",
          ],
        },
        {
          heading: "Changing details later",
          paragraphs: [
            "Address changes, new places of business, partners or bank accounts must be updated through an amendment on the portal. Some changes need approval; others are immediate. Out-of-date details are a common reason for notices and failed refunds.",
          ],
        },
      ],
    },
    {
      title: "A sample invoice, annotated",
      paragraphs: [
        "Here is a complete tax invoice for a small design studio, laid out as plain text so every required element is visible. Your software will format it differently, but the content should match.",
      ],
      sections: [
        {
          code: [
            "TAX INVOICE",
            "Studio Kite Design, 14 MG Road, Pune 411001",
            "GSTIN: 27ABCDE1234F1Z5         State: Maharashtra (27)",
            "",
            "Invoice no: SKD/2026-27/0042   Date: 14 October 2026",
            "Bill to: Orchid Foods Pvt Ltd, Plot 7, Hinjewadi, Pune",
            "GSTIN: 27PQRSX6789K1Z2         Place of supply: Maharashtra (27)",
            "",
            "Description                      SAC      Qty   Rate      Amount",
            "Brand identity design            998391   1     60,000    60,000.00",
            "Packaging artwork, 3 SKUs        998391   3     8,000     24,000.00",
            "Less: discount                                            -4,000.00",
            "Taxable value                                             80,000.00",
            "CGST @ 9%                                                  7,200.00",
            "SGST @ 9%                                                  7,200.00",
            "Total                                                     94,400.00",
            "Amount in words: Ninety-four thousand four hundred rupees only",
            "Tax payable under reverse charge: No",
            "",
            "Bank: XYZ Bank, A/c 1234567890, IFSC XYZB0001234",
            "Payment due within 30 days.",
            "For Studio Kite Design (authorised signatory)",
          ].join("\n"),
          codeCaption: "An intra-state invoice at 18 percent. Names and numbers are fictional.",
          after: [
            "Note the discount shown before tax, which reduces the taxable value; the place of supply with its state code; the SAC on each line; the split of 18 percent into 9 percent CGST and 9 percent SGST; the reverse charge line; and a unique invoice number with the year. If the client were in Karnataka, the tax lines would be replaced by IGST @ 18%: 14,400.00, and the place of supply would read Karnataka (29).",
          ],
        },
      ],
    },
  ],

  scenarioIntro:
    "Eighteen small businesses and freelancers with real invoicing decisions. Rates are those after 22 September 2025. Names and places are illustrations.",

  scenarios: [
    {
      title: "A freelancer's first GST invoice",
      paragraphs: [
        "Aditi, a graphic designer in Pune, registered for GST when her yearly billing approached Rs. 20 lakh. Her first invoice was to a client in Pune for a brochure design worth Rs. 30,000.",
        `Design services are taxed at 18 percent. Within Maharashtra she charged CGST of ${Rs(2700)} and SGST of ${Rs(2700)}, totalling ${Rs(35400)}. She used SAC 998391 for specialty design services and numbered the invoice 2026-27/001.`,
        "Her client asked her to show her GSTIN prominently and to report the invoice in GSTR-1 promptly, because the client's input credit depends on it. She set a monthly reminder for the 11th.",
        "She also added a line on every invoice with her bank details and payment terms, and a note that payment within 30 days helps the client keep its input credit, since unpaid invoices beyond 180 days force a reversal."
      ],
      lesson: "Register on time, use the right SAC code and tax split, and report sales promptly so clients can claim credit.",
    },
    {
      title: "An 'inclusive' price that cost the seller",
      paragraphs: [
        "Ramesh, who sells handcrafted bags in Jaipur, quoted Rs. 2,360 per bag to a retailer, meaning to add GST. The retailer understood the price as inclusive and paid Rs. 2,360.",
        `At 5 percent, the GST inside Rs. 2,360 is ${Rs2(remove(2360, 5).gst)} and the base is ${Rs2(remove(2360, 5).base)}. Ramesh had expected Rs. 2,360 plus 5 percent, ${Rs(2478)}. On 200 bags he lost about ${Rs((2478 - 2360) * 200)}.`,
        "His quotes now always say 'plus GST at the applicable rate' or show the base, GST and total on separate lines.",
        "He also checked the price lists he had shared on messaging apps, where several older quotes simply said a rupee figure with no mention of tax. He replaced them with a single sheet showing base, GST and total for each product."
      ],
      lesson: "Always state whether a price includes GST. Ambiguity is resolved against the seller.",
    },
    {
      title: "IGST for an out-of-state client",
      paragraphs: [
        "Sunil, a software consultant in Bengaluru, billed a client in Hyderabad Rs. 1.2 lakh for a month's work. He charged CGST and SGST by habit.",
        `The client's accountant pointed out that the place of supply was Telangana, so IGST of ${Rs(21600)} should have been charged, not Karnataka's CGST and SGST. The client could not claim credit for the wrong taxes.`,
        "Sunil issued a credit note against the original invoice, a fresh invoice with IGST, paid the IGST and claimed a refund of the CGST and SGST he had paid. It took two months to straighten out.",
        "His client's finance team now sends him a short checklist with each purchase order: place of supply, GSTIN, SAC code and PO number. He keeps it as a template for every new client in another state."
      ],
      lesson: "Check the place of supply on every invoice. Wrong tax type blocks the client's credit.",
    },
    {
      title: "Composition or regular for a sweet shop",
      paragraphs: [
        "Lakshmi runs a sweet shop in Madurai with turnover of about Rs. 90 lakh, selling mainly to walk-in customers. Her accountant compared the composition scheme with regular registration.",
        "Under composition she would pay a flat rate on turnover and could not collect GST from customers or claim credit on purchases. Under regular registration she would charge 5 percent on most sweets, claim credit on packaging and other inputs, and file more returns.",
        "Since her customers are consumers who cannot use credit, and her purchases carry little GST, composition kept her prices simpler and paperwork lighter. She reviews the choice each year as her business grows.",
        "Her accountant also reminded her that composition dealers cannot supply through most e-commerce operators and cannot make inter-state sales of goods, so if she starts shipping sweets to other states for festivals, she will need to move to regular registration."
      ],
      lesson: "Composition suits businesses selling to consumers with few taxed inputs. Review it as turnover and customers change.",
    },
    {
      title: "Input credit lost to a late supplier",
      paragraphs: [
        "Faizal runs a printing unit in Sivakasi. He bought paper for Rs. 5 lakh plus 18 percent GST and claimed the Rs. 90,000 credit.",
        "His supplier filed GSTR-1 late, so the invoice did not appear in Faizal's GSTR-2B for that month. He had to reverse the credit and pay the tax in cash, then reclaim it the following month once the invoice appeared.",
        "He now checks GSTR-2B before claiming credit each month and prefers suppliers with good filing records, which the GST portal lets him check.",
        "He also learned that the supplier's filing record is public: the GST portal shows whether a GSTIN has filed recent returns. He checks new suppliers before placing large orders."
      ],
      lesson: "Claim credit only for invoices in your GSTR-2B. A supplier's late filing becomes your cash cost.",
    },
    {
      title: "Paying suppliers within 180 days",
      paragraphs: [
        "Anita's trading firm in Indore claimed credit on a Rs. 2 lakh purchase but did not pay the supplier for seven months during a cash squeeze.",
        "The law requires payment within 180 days of the invoice date to keep the credit. After 180 days she had to reverse the Rs. 36,000 credit with interest, then reclaim it when she finally paid.",
        "She now tracks payables by invoice date and pays GST-heavy invoices first when cash is short.",
        "She also explained the rule to her purchase staff, so that when cash is tight they know which invoices have a tax deadline attached and which can wait.",
        "The interest on the reversed credit was small, but the cash outflow came at the worst time. Paying the supplier a little earlier would have cost less than the scramble."
      ],
      lesson: "Unpaid supplier invoices beyond 180 days force a credit reversal with interest.",
    },
    {
      title: "A café's restaurant rate",
      paragraphs: [
        "Meera opened a café in Kochi. Restaurant services, outside hotels with high room tariffs, are generally taxed at 5 percent without input credit.",
        `A bill of ${Rs(1200)} before tax becomes ${Rs(1260)}: ${Rs(30)} CGST and ${Rs(30)} SGST. She cannot claim credit on the GST in her rent or equipment.`,
        "She priced the menu with tax shown separately, as the law requires, and checked that her billing software applied 5 percent and printed her GSTIN and the tax split on every bill.",
        "She also displays the GST registration number at the counter and on the menu, which the law requires for registered businesses, and keeps the bill format checked by her accountant after any menu change."
      ],
      lesson: "Restaurant services usually carry 5 percent without credit. Build that into prices and the billing system.",
    },
    {
      title: "A coaching centre's fees",
      paragraphs: [
        "Ravi runs a coaching centre in Patna for competitive exams. Commercial coaching is taxed at 18 percent; education by schools and recognised institutions leading to a qualification recognised by law is generally exempt.",
        `His term fee of ${Rs(24000)} was meant to be inclusive. The base is ${Rs2(remove(24000, 18).base)} and GST ${Rs2(remove(24000, 18).gst)}. He had been treating the whole Rs. 24,000 as income.`,
        "He reworked his fee structure to show fees plus GST, explained the change to parents, and registered when his turnover crossed the services threshold.",
        "Some parents asked why fees had risen. He showed them the base fee was unchanged and the GST was now shown separately as the law requires, which most accepted once they saw the breakdown."
      ],
      lesson: "Commercial coaching attracts GST. Check whether your education service is exempt or taxable before pricing.",
    },
    {
      title: "Selling on a marketplace",
      paragraphs: [
        "Nisha sells handmade candles on an online marketplace from Bhopal. She registered for GST because most marketplace sellers must.",
        "The marketplace deducts tax collected at source of 1 percent on her net sales and pays it to the government. It appears in her electronic cash ledger, and she uses it to pay her GST.",
        "She reconciles the marketplace's monthly statement with her own sales register, since returns and cancellations change the net figure on which TCS is collected.",
        "She also keeps the marketplace's GST reports for each month alongside her own records, since the platform files a statement showing the TCS collected, which must match what appears in her ledger."
      ],
      lesson: "Marketplace sellers usually need GST registration. TCS deducted by the platform is credited to your cash ledger.",
    },
    {
      title: "Credit note for returned goods",
      paragraphs: [
        "Gopal, a furniture maker in Jodhpur, sold a table for Rs. 65,000 plus 18 percent IGST to a buyer in Delhi. The buyer returned it damaged in transit.",
        `Gopal issued a credit note for ${Rs(65000)} plus ${Rs(11700)} IGST, referencing the original invoice, and reported it in GSTR-1. His output tax for the month fell by ${Rs(11700)}.`,
        "The buyer reversed the credit it had claimed. Gopal also claimed from the transporter's insurance for the damage.",
        "He also photographed the damaged table at delivery and kept the transporter's acknowledgment, which supported both the insurance claim and the credit note.",
        "He also checked that the credit note was issued before the deadline for the financial year, since late credit notes cannot reduce tax."
      ],
      lesson: "Use a credit note referencing the original invoice when goods come back. Both sides adjust tax.",
    },
    {
      title: "A legal fee under reverse charge",
      paragraphs: [
        "Sunita's firm in Lucknow paid an advocate Rs. 50,000 for drafting contracts. The advocate's bill showed no GST.",
        "Legal services by an advocate to a business are under reverse charge: the business pays GST. Sunita's firm paid 18 percent, Rs. 9,000, in cash through its return and claimed the same amount as input credit.",
        "The net cash cost was nil, but missing it would have meant interest and a mismatch. Her accountant now flags every invoice from advocates and goods transport agencies.",
        "Her firm keeps a list of supplier categories that fall under reverse charge, reviewed when a new kind of service is bought for the first time.",
        "The advocate's bill correctly carried a note that tax was payable by the recipient, which is how the accountant spotted it."
      ],
      lesson: "Check whether a supply is under reverse charge. The tax is yours to pay, and usually yours to claim back.",
    },
    {
      title: "Discount after the invoice",
      paragraphs: [
        "Mohan, a distributor in Nagpur, gave a retailer a year-end volume discount of 2 percent on purchases worth Rs. 20 lakh, decided in March.",
        "Because the discount was not agreed in advance in the contract, it could not reduce the GST already charged. He issued a commercial credit note without GST.",
        "For the next year he wrote the volume discount terms into the agreement at the start, linking them to invoices, so a GST credit note can be issued when targets are met.",
        "He also confirmed with the retailer that it would reverse any credit linked to the discount where the law required, since both sides must match.",
        "The retailer appreciated the clarity: under the new terms, both sides know in advance how discounts will appear in their returns."
      ],
      lesson: "Post-sale discounts reduce GST only if agreed in advance and linked to invoices. Write the terms in the contract.",
    },
    {
      title: "Export of design services",
      paragraphs: [
        "Karan, a UI designer in Ahmedabad, works for a client in Singapore and is paid in US dollars.",
        "Services to a foreign client, paid in convertible foreign exchange, with the place of supply outside India, generally qualify as exports, which are zero-rated. He filed a letter of undertaking on the GST portal and invoiced without IGST.",
        "He reports the exports in GSTR-1 and keeps the bank's foreign inward remittance certificates as proof of payment. He can claim refunds of input credit on his laptop and software.",
        "He also checked with his bank that the foreign inward remittance certificates showed the purpose code for software or design services, since mismatched purpose codes cause questions in refund claims."
      ],
      lesson: "Exports of services can be zero-rated under a letter of undertaking. Keep proof of foreign payment.",
    },
    {
      title: "Wrong rate after the rate change",
      paragraphs: [
        "Priya's electronics shop in Chennai continued charging 28 percent on air conditioners for two weeks after 22 September 2025, when the rate had fallen to 18 percent.",
        "Customers who noticed complained. She had collected more tax than due. She issued credit notes and refunds to the customers she could identify and paid the tax actually collected where she could not, since tax collected must be deposited.",
        "She now checks rate notifications on the CBIC site when changes are announced and updates her billing software the night before they take effect.",
        "She also realised that her supplier's invoices for stock bought before the change still showed 28 percent, and that her own input credit on that stock was unaffected: credit follows the tax actually paid on purchases."
      ],
      lesson: "Update billing software on the day rates change. Over-collected tax must be refunded or deposited.",
    },
    {
      title: "A jeweller's 3 percent",
      paragraphs: [
        `Rajan, a jeweller in Thrissur, sold a gold chain worth ${Rs(180000)}. GST at 3 percent is ${Rs(5400)}, split into ${Rs(2700)} each of CGST and SGST.`,
        "Making charges, when billed separately for job work on a customer's gold, are taxed at a different rate under job-work rules. He keeps them clearly separated on invoices.",
        "For purchases of old gold from customers, he follows the rules on second-hand goods and keeps records of the customer's identity as required for high-value cash transactions.",
        "He also keeps a hallmarking record for each item, since jewellery sales must meet hallmarking rules as well as GST, and both are checked in inspections.",
        "When customers ask why the tax line is so small compared with other purchases, he explains that gold has its own low rate, and shows the rate on the bill."
      ],
      lesson: "Gold carries 3 percent; job-work making charges are treated separately. Keep each line clear.",
    },
    {
      title: "Late returns and a suspended registration",
      paragraphs: [
        "Deepak, a small contractor in Ranchi, did not file GSTR-3B for six months during an illness. His registration was suspended, and his clients' credit on his invoices was blocked.",
        "Two clients withheld payment until he resolved it. He filed the pending returns with late fees and interest and applied for revocation of the suspension.",
        "He now uses an accountant on a small monthly fee and files nil returns on time even when there is no business, since those carry a lower late fee and keep the registration clean.",
        "He also applied for revocation within the time allowed after filing, which is required to restore a suspended registration; missing that window would have meant a fresh registration."
      ],
      lesson: "File returns on time, even nil returns. Suspension hurts your clients and your cash flow.",
    },
    {
      title: "Keeping GST in a separate account",
      paragraphs: [
        "Farah, a caterer in Hyderabad, used to pay GST from her business account each month. In a busy wedding season she spent the cash on supplies and could not pay the Rs. 1.8 lakh due.",
        "She paid late with 18 percent interest. Afterwards she opened a sub-account and set up a rule: when a client pays, the GST portion moves there the same day.",
        "The account balance now always equals her pending liability, and she sleeps better in the season when cash moves fastest.",
        "She also keeps the GST account at a different bank from her main account, which she says makes it psychologically harder to dip into.",
        "In the first year, the separate account also showed her how much of each wedding booking was really hers, which changed how she priced the next season."
      ],
      lesson: "Separate GST collected from business cash on the day it comes in.",
    },
    {
      title: "Voluntary registration below the threshold",
      paragraphs: [
        "Vikram, a consultant in Gurugram with Rs. 12 lakh of yearly billing, worked mainly for registered companies. They preferred suppliers with GSTINs so they could claim credit.",
        "He registered voluntarily, charged 18 percent, and claimed credit on his laptop, software subscriptions and co-working fees. His clients paid the extra GST and claimed it back.",
        "The cost was monthly or quarterly returns. He chose QRMP to file quarterly, which kept the work manageable.",
        "He also added a line to his invoices showing his GSTIN and state code, which his clients' accounts teams use to match his invoices in their GSTR-2B.",
        "One small client without a GSTIN complained about the 18 percent; Vikram offered a slightly lower base price for that client to keep the relationship."
      ],
      lesson: "Below the threshold, voluntary registration can help when clients are registered businesses.",
    },
    {
      title: "A supplier's cancelled registration",
      paragraphs: [
        "Harish, a hardware trader in Vadodara, bought steel worth Rs. 4 lakh plus GST from a new supplier offering low prices. Months later, a notice said the supplier's registration had been cancelled from an earlier date and questioned Harish's Rs. 72,000 credit.",
        "He produced the tax invoice, the e-way bill, the transporter's receipt, the bank transfer and his stock register showing the goods. The officer accepted that the purchase was genuine for part of the period; for invoices after the cancellation date, he had to reverse the credit.",
        "He now checks every new supplier's GSTIN status and filing history on the portal before the first order, and pays only by bank transfer to the account in the supplier's name.",
      ],
      lesson: "Verify new suppliers on the portal and keep proof of genuine purchases. Credit depends on the supplier's compliance too.",
    },
    {
      title: "A café moves from composition to regular",
      paragraphs: [
        "Asha's café in Mysuru grew past the composition limit after opening a second outlet. She had to move to regular registration.",
        "Under composition she had paid a flat 5 percent of turnover without charging customers. Under regular registration for restaurants she charges 5 percent to customers without input credit, so her cost structure stayed similar, but she now files GSTR-1 and GSTR-3B instead of the simpler composition returns.",
        "She updated her billing software to print the tax split, changed menus to show prices with GST indicated, and filed the stock intimation required at the change of scheme.",
        "She also told her regular customers about the change on a small card at the counter, since bills would now show GST separately where they had not before."
      ],
      lesson: "Crossing the composition limit means a change of scheme, documents and returns. Plan it before you open the next outlet.",
    },
    {
      title: "A tailor's first registration",
      paragraphs: [
        "Salma, a tailor in Hyderabad, crossed Rs. 20 lakh of yearly stitching charges as her boutique grew. Tailoring services carry GST at 5 percent.",
        `On a bridal blouse priced at ${Rs(4500)} before tax, she now charges ${Rs(225)} GST: ${Rs2(112.5)} CGST and ${Rs2(112.5)} SGST. She uses a simple billing app that prints her GSTIN.`,
        "She chose QRMP for quarterly returns, opened a separate account for GST, and asked her nephew, an accountant, to check the first two returns with her. After that she files them herself in under an hour.",
        "Her customers barely noticed the change; at 5 percent the tax on a typical order is small, and the printed bill made her shop look more established."
      ],
      lesson: "A small service business can manage GST itself with a billing app, QRMP and a separate account.",
    },
    {
      title: "A refund on exports",
      paragraphs: [
        "Vivek, a developer in Pune, exports most of his services and pays GST on his co-working space, laptop and software. Without domestic sales, his input credit kept accumulating.",
        "Because his exports were under a letter of undertaking, he could claim a refund of accumulated input credit. He filed the refund application on the portal with the export invoices and foreign remittance certificates.",
        "The refund arrived after processing. He now files refund claims quarterly so that credit does not pile up.",
        "His accountant reminded him that the refund depends on the foreign remittance actually arriving; invoices without payment proof cannot be counted as exports for the refund.",
        "He keeps a simple sheet listing each export invoice, its foreign remittance and the refund period it belongs to, which makes each claim quick to prepare."
      ],
      lesson: "Exporters under LUT can claim refunds of accumulated input credit. File regularly with proof of foreign payment.",
    },
    {
      title: "Hotel invoices without a GSTIN",
      paragraphs: [
        "Rohan, a consultant in Delhi, travels often for clients. For a year he booked hotels through apps without entering his GSTIN, and the invoices came in his personal name.",
        "His accountant pointed out that about Rs. 40,000 of hotel GST had been lost as credit. Hotels can issue invoices with a GSTIN only if it is given at booking or check-in, and an invoice cannot simply be changed later.",
        "He saved his GSTIN and business name in every booking app and now checks each invoice before checking out. The next year's credit on travel covered his software subscriptions entirely.",
        "He also keeps a scanned copy of each hotel invoice in the month's folder, since GSTR-2B shows the credit but not the details his clients sometimes ask to see."
      ],
      lesson: "Give your GSTIN at booking and check-in. Credit on business travel needs the invoice in your business name.",
    },
    {
      title: "Discount shown on the invoice",
      paragraphs: [
        "Kavita, a fabric wholesaler in Surat, gives retailers a 5 percent discount for bulk orders. She had been invoicing the full price and then giving a separate cash discount.",
        `On an order of ${Rs(200000)} at 5 percent GST, charging tax on the full price meant ${Rs(10000)} of GST, against ${Rs(9500)} if the discount had been shown on the invoice. Her retailers complained that they paid tax on a price they never paid.`,
        "She now shows the discount on the invoice, so GST is charged on the reduced value. Retailers get the benefit, and her invoices match the money actually received.",
        "Her accountant also noted that the change made reconciliation easier: the amounts in GSTR-1 now matched the payments in her bank account."
      ],
      lesson: "Discounts shown on the invoice reduce the taxable value. Separate cash discounts usually do not.",
    },
    {
      title: "A builder's works contract",
      paragraphs: [
        "Prakash, a small contractor in Nashik, renovated an office for a company, supplying materials and labour together for Rs. 8 lakh. This is a works contract service, taxed as a service, generally at 18 percent.",
        "The company could not claim credit on the GST, because credit on works contracts for constructing or renovating immovable property is generally blocked, except where it is plant and machinery or input for further works contracts.",
        "Prakash claimed credit on materials he bought, since he was supplying a works contract service himself. He kept the contract, measurement sheets and invoices together, since works contracts are frequently questioned.",
        "His invoices described the service clearly as a works contract with the correct SAC, rather than splitting materials and labour artificially.",
      ],
      lesson: "Works contracts are services. Credit rules differ for the contractor and the client; describe them correctly.",
    },
    {
      title: "Two states, two registrations",
      paragraphs: [
        "Neeraj runs a small electronics repair business with shops in Bengaluru and Hosur, in Karnataka and Tamil Nadu. Each state needs its own GST registration under the same PAN.",
        "When he moved spare parts from Bengaluru to Hosur, it counted as a supply between distinct persons, and he issued a tax invoice with IGST, which the Hosur registration claimed as credit.",
        "He files separate returns for each registration and keeps stock records for each shop. The arrangement doubled his paperwork, but kept both shops compliant and let each claim its own credit.",
        "He also checked whether services provided by the head office to the branch, such as accounting, needed to be valued and invoiced, and followed his accountant's advice on the valuation rules for related persons."
      ],
      lesson: "Each state needs its own registration. Movements between your own branches in different states are supplies.",
    },
    {
      title: "A photographer's wedding season",
      paragraphs: [
        `Deepa, a wedding photographer in Jaipur, takes bookings months ahead with a 30 percent advance. For a ${Rs(150000)} package, the advance is ${Rs(45000)}, on which GST at 18 percent is due when received.`,
        "She issues a receipt voucher for each advance, pays GST on it in that month's return, and adjusts it in the final invoice after the wedding. In the busy months she receives many advances and pays tax well before the work is done.",
        "When a couple cancelled and she refunded part of the advance, she issued a refund voucher and adjusted the tax. She now keeps a sheet of advances, refunds and final invoices for each booking, so that every rupee of tax is traceable.",
        "Her cash flow improved once she started setting the GST on each advance aside the same day, since in October and November the tax due is larger than her monthly income from completed work.",
      ],
      lesson: "For services, GST is due on advances. Track receipt vouchers and set the tax aside when the advance arrives.",
    },
  ],

  problemIntro: "Use the formulas in this book or the site's GST calculator. Round to the paisa where shown.",

  problems: [
    ...INV.map(([who, place, item, amt, rate, inclusive, inter], i) => {
      const r = inclusive ? remove(amt, rate) : add(amt, rate);
      const split = inter ? [`IGST at ${rate}% = ${inr2(r.gst)}.`] : [`CGST at ${rate / 2}% = ${inr2(r.gst / 2)}.`, `SGST at ${rate / 2}% = ${inr2(r.gst / 2)}.`];
      return {
        title: `${who} in ${place}`,
        q: [`${who} in ${place} bills ${Rs(amt)} for ${item}, ${inclusive ? "including" : "before"} GST at ${rate} percent. ${inter ? "The buyer is in another state." : "The buyer is in the same state."} Work out the base, the tax split and the total.`],
        steps: [
          inclusive ? `Base = ${inr(amt)} × 100 ÷ ${100 + rate} = ${inr2(r.base)}.` : `GST = ${inr(amt)} × ${rate}% = ${inr2(r.gst)}.`,
          ...split,
          `Total = ${inr2(r.total)}.`,
        ],
        answer: `Base ${Rs2(r.base)}, GST ${Rs2(r.gst)}, total ${Rs2(r.total)}${inter ? " as IGST" : ", split equally into CGST and SGST"}.`,
      };
    }),
    {
      title: "The 18 percent mistake",
      q: ["A customer pays Rs. 5,900 including 18 percent GST. A clerk records GST as 18 percent of Rs. 5,900. What did the clerk record, and what is correct?"],
      steps: ["Clerk: 5,900 × 18% = 1,062.", "Correct: 5,900 × 18 ÷ 118 = 900."],
      answer: "The clerk overstated GST by Rs. 162. Correct GST is Rs. 900 on a base of Rs. 5,000.",
    },
    {
      title: "Input credit",
      q: ["A trader buys stock for Rs. 3 lakh plus 18 percent and sells it for Rs. 4.2 lakh plus 18 percent, within the state. GST payable?"],
      steps: ["Output = 4,20,000 × 18% = 75,600.", "Input = 3,00,000 × 18% = 54,000.", "Payable = 21,600."],
      answer: "Rs. 21,600, split as Rs. 10,800 CGST and Rs. 10,800 SGST after setting off credit by the rules.",
    },
    {
      title: "Mixed-rate invoice",
      q: ["An invoice has a Rs. 8,000 item at 5 percent and a Rs. 12,000 item at 18 percent. Total GST and invoice value?"],
      steps: ["5%: 400.", "18%: 2,160.", "Total GST 2,560."],
      answer: "GST Rs. 2,560; invoice Rs. 22,560.",
    },
    {
      title: "Old rate versus new",
      q: ["An item was taxed at 12 percent before 22 September 2025 and 5 percent after. On a base of Rs. 10,000, how much less tax does the buyer pay now?"],
      steps: ["Before: 1,200.", "After: 500."],
      answer: "Rs. 700 less.",
    },
    {
      title: "Composition tax",
      q: ["A composition trader has quarterly turnover of Rs. 18 lakh at 1 percent (0.5 percent CGST and 0.5 percent SGST). Tax for the quarter?"],
      steps: ["18,00,000 × 1%."],
      answer: "Rs. 18,000, paid from the business's own funds, not collected from customers.",
    },
    {
      title: "Reverse charge on a transport bill",
      q: ["A business pays a goods transport agency Rs. 40,000 under reverse charge at 5 percent. What does it pay and what can it claim?"],
      steps: ["Tax = 40,000 × 5% = 2,000, paid in cash."],
      answer: "Rs. 2,000 paid; credit is not available if the agency's service is under the 5 percent rate without credit. Check the notification for the option chosen.",
    },
    {
      title: "Interest on late payment",
      q: ["Rs. 60,000 of GST is paid 25 days late. Interest at 18 percent a year?"],
      steps: ["60,000 × 18% × 25 ÷ 365."],
      answer: `About ${Rs((60000 * 0.18 * 25) / 365)}.`,
    },
    {
      title: "Share of GST in a 5 percent inclusive price",
      q: ["What fraction of a 5 percent inclusive price is GST?"],
      steps: ["5 ÷ 105."],
      answer: "About 4.76 percent.",
    },
    {
      title: "E-way bill",
      q: ["A dealer sends goods worth Rs. 38,000 plus 18 percent GST to a customer in the same city. Is an e-way bill needed under the general Rs. 50,000 limit?"],
      steps: ["Consignment value including tax = 44,840.", "Below 50,000."],
      answer: "Not under the general limit, though some states have different intra-state rules.",
    },
    {
      title: "180-day reversal",
      q: ["Credit of Rs. 27,000 was claimed on an invoice dated 1 April. On 15 October the supplier is still unpaid. What happens?"],
      steps: ["More than 180 days have passed.", "Reverse the credit with interest; reclaim it when paid."],
      answer: "Reverse Rs. 27,000 with interest in the return for that period, and reclaim on payment.",
    },
    {
      title: "Price for a target margin",
      q: ["A designer wants Rs. 50,000 after GST for a project and the client insists on a single all-in figure. What all-in price should she quote at 18 percent?"],
      steps: ["All-in = 50,000 × 1.18."],
      answer: "Rs. 59,000, so that removing 18 percent GST leaves Rs. 50,000.",
    },
    {
      title: "Blocked credit",
      q: ["A firm buys a car for the director's travel for Rs. 12 lakh plus GST. Can it claim credit?"],
      steps: ["Credit on motor vehicles for transport of persons with seating up to 13 is generally blocked, except for specified businesses such as car dealers, taxi operators and driving schools."],
      answer: "Generally no.",
    },
    {
      title: "TCS on marketplace sales",
      q: ["A seller's net taxable sales through a marketplace in a month are Rs. 3.5 lakh. TCS at 1 percent?"],
      steps: ["3,50,000 × 1%."],
      answer: "Rs. 3,500, credited to the seller's electronic cash ledger.",
    },
    {
      title: "Registration threshold",
      q: ["A service provider in Maharashtra expects Rs. 18 lakh of billing this year and Rs. 26 lakh next year. When must it register?"],
      steps: ["Threshold for services is Rs. 20 lakh in most states."],
      answer: "When aggregate turnover crosses Rs. 20 lakh next year; apply within 30 days of becoming liable.",
    },
    {
      title: "Credit note effect",
      q: ["An invoice for Rs. 80,000 plus 18 percent IGST is reduced by Rs. 8,000 for a defect. Credit note value?"],
      steps: ["Taxable value 8,000; IGST 1,440."],
      answer: "Rs. 9,440 including IGST of Rs. 1,440.",
    },
    {
      title: "Round-off",
      q: ["Base Rs. 4,237.50 at 18 percent. Compute GST and the rounded total."],
      steps: ["GST = 762.75.", "Total = 5,000.25, rounded to Rs. 5,000 with a round-off of −0.25."],
      answer: "GST Rs. 762.75; total Rs. 5,000 after a Rs. 0.25 round-off.",
    },
    {
      title: "QRMP monthly payment",
      q: ["A QRMP taxpayer's liability for July is Rs. 24,000 and August Rs. 31,000. What must be paid by 25 August and 25 September?"],
      steps: ["Pay each month's liability by the 25th of the next month using PMT-06, or use the fixed-sum method."],
      answer: "Rs. 24,000 by 25 August and Rs. 31,000 by 25 September, with the quarter settled in GSTR-3B.",
    },
    {
      title: "Restaurant bill",
      q: ["A family's restaurant bill is Rs. 2,450 before GST at 5 percent. Total and split?"],
      steps: ["GST = 122.50; CGST 61.25, SGST 61.25."],
      answer: "Total Rs. 2,572.50.",
    },
    {
      title: "Export with LUT",
      q: ["A designer exports services worth USD 2,000 at Rs. 84 per dollar under a letter of undertaking. What GST is charged?"],
      steps: ["Zero-rated under LUT."],
      answer: "Nil; the invoice shows the value as an export without IGST.",
    },
    {
      title: "Value added and tax",
      q: ["Show that the GST paid to the government along a chain equals 18 percent of the final price when each stage claims full credit: wood Rs. 20,000, furniture Rs. 50,000, retail Rs. 70,000, all at 18 percent."],
      steps: ["Stage 1 pays 3,600.", "Stage 2: 9,000 − 3,600 = 5,400.", "Stage 3: 12,600 − 9,000 = 3,600.", "Total = 12,600."],
      answer: "Rs. 12,600, which is 18 percent of Rs. 70,000.",
    },
    {
      title: "Freelancer's quarter",
      q: ["A designer under QRMP bills Rs. 2.4 lakh in a quarter, all at 18 percent within the state, and has Rs. 32,000 of eligible input credit. Tax payable for the quarter?"],
      steps: ["Output = 43,200.", "Payable = 43,200 − 32,000 = 11,200."],
      answer: "Rs. 11,200, paid in monthly instalments or as settled in the quarterly return.",
    },
    {
      title: "Advance for services",
      q: ["A consultant receives a Rs. 59,000 advance, inclusive of 18 percent GST, for a project in the same state. GST due on receipt?"],
      steps: ["Base = 59,000 ÷ 1.18 = 50,000.", "GST = 9,000."],
      answer: "Rs. 9,000, split into CGST and SGST, paid in the return for the month of receipt.",
    },
    {
      title: "Margin scheme",
      q: ["A used-goods dealer buys a phone for Rs. 12,000 without credit and sells it for Rs. 15,000. Under the margin scheme at 18 percent, what is the GST?"],
      steps: ["Margin = 3,000 inclusive of tax.", "GST = 3,000 × 18 ÷ 118."],
      answer: `About ${Rs2((3000 * 18) / 118)}.`,
    },
    {
      title: "Correcting a wrong tax type",
      q: ["A supply of Rs. 40,000 at 18 percent to another state was billed with CGST and SGST of Rs. 3,600 each. What corrections are needed?"],
      steps: ["IGST due: 7,200.", "Pay IGST; claim a refund of the Rs. 7,200 CGST and SGST paid."],
      answer: "Pay Rs. 7,200 IGST, issue corrected documents, and apply for a refund of Rs. 7,200 of CGST and SGST.",
    },
    {
      title: "Composition limit",
      q: ["A trader in a state with a Rs. 1.5 crore composition limit expects Rs. 1.62 crore this year. What should he do?"],
      steps: ["Turnover will exceed the limit.", "He must move to regular registration from the day the limit is crossed."],
      answer: "Switch to regular registration when turnover crosses Rs. 1.5 crore, start charging GST and claim eligible credit from then.",
    },
    {
      title: "Credit on a laptop",
      q: ["A freelancer buys a laptop for Rs. 90,000 plus 18 percent GST, with a tax invoice in her GSTIN. Credit available?"],
      steps: ["GST = 16,200.", "Used for business, invoice in her name, appears in GSTR-2B."],
      answer: "Rs. 16,200.",
    },
    {
      title: "Late fee for nil returns",
      q: ["Why should a business with no sales still file returns on time?", "What happens otherwise?"],
      steps: ["Returns are due for every period while registered.", "Late fees apply even to nil returns, though at a lower rate, and continued non-filing can lead to suspension."],
      answer: "File nil returns on time to avoid fees and protect the registration.",
    },
    {
      title: "Quarterly cash flow",
      q: ["Using the hardware shop table in this book, what share of output GST did the shop pay in cash over the year?"],
      steps: ["Output total = 21,60,000.", "Cash total = 4,68,000.", "4,68,000 ÷ 21,60,000."],
      answer: "About 21.7 percent; the rest was covered by input credit.",
    },
    {
      title: "Chain without credit",
      q: ["In the chair example, if the retail shop cannot claim the Rs. 900 credit, how much extra tax does the chain pay?"],
      steps: ["The retailer pays 1,260 in cash instead of 360."],
      answer: "Rs. 900 extra, which comes out of someone's margin or the consumer's price.",
    },
    {
      title: "Tailoring invoice",
      q: ["Stitching charges of Rs. 6,800 at 5 percent within the state. GST split and total?"],
      steps: ["GST = 340; CGST 170, SGST 170."],
      answer: "Total Rs. 7,140.",
    },
    {
      title: "Refund of accumulated credit",
      q: ["An exporter under LUT has Rs. 54,000 of input credit for the quarter and no domestic output tax. What can be refunded?"],
      steps: ["Under LUT, unutilised credit on zero-rated supplies can be refunded under the formula in the rules."],
      answer: "Up to Rs. 54,000, subject to the refund formula and documents.",
    },
    {
      title: "Credit on a business trip",
      q: ["A hotel bill of Rs. 12,000 plus 18 percent GST carries your GSTIN. Flights cost Rs. 9,000 plus 5 percent with your GSTIN. Total credit?"],
      steps: ["Hotel: 2,160.", "Flights: 450."],
      answer: "Rs. 2,610.",
    },
    {
      title: "Commission income",
      q: ["A registered agent earns Rs. 75,000 commission from a principal in another state. GST?"],
      steps: ["18% IGST on 75,000."],
      answer: "Rs. 13,500 IGST; invoice total Rs. 88,500.",
    },
    {
      title: "Inclusive restaurant bill",
      q: ["A café's menu price of Rs. 315 is inclusive of 5 percent GST. Base and GST?"],
      steps: ["Base = 315 ÷ 1.05 = 300.", "GST = 15."],
      answer: "Base Rs. 300; GST Rs. 15.",
    },
    {
      title: "Discount on the invoice",
      q: ["Goods listed at Rs. 50,000 with a 10 percent discount on the invoice, at 18 percent GST. Taxable value and GST?"],
      steps: ["Taxable value = 45,000.", "GST = 8,100."],
      answer: "Taxable value Rs. 45,000; GST Rs. 8,100; total Rs. 53,100.",
    },
    {
      title: "Lost travel credit",
      q: ["A consultant spends Rs. 2.2 lakh a year on hotels at 18 percent but gives no GSTIN. What credit is lost?"],
      steps: ["2,20,000 × 18%."],
      answer: "Rs. 39,600 a year.",
    },
    {
      title: "Converting the sample invoice to IGST",
      q: ["Rewrite the tax lines of the sample invoice if the client were in Karnataka."],
      steps: ["Taxable value stays 80,000.", "IGST at 18% = 14,400."],
      answer: "IGST @ 18%: Rs. 14,400; total Rs. 94,400; place of supply Karnataka (29).",
    },
    {
      title: "Branch transfer",
      q: ["Stock worth Rs. 1.5 lakh moves from a Karnataka registration to a Tamil Nadu registration of the same business at 18 percent. Tax and credit?"],
      steps: ["IGST = 27,000 charged by the Karnataka branch.", "Credit of 27,000 for the Tamil Nadu branch."],
      answer: "Rs. 27,000 IGST, fully claimable by the receiving branch.",
    },
    {
      title: "Works contract",
      q: ["A renovation works contract of Rs. 6 lakh at 18 percent for an office. GST, and can the client claim it?"],
      steps: ["GST = 1,08,000.", "Credit on works contracts for immovable property is generally blocked for the client."],
      answer: "Rs. 1,08,000 GST, generally not claimable by the client.",
    },
    {
      title: "Advance and final invoice",
      q: ["A Rs. 1.5 lakh photography package at 18 percent: 30 percent advance in July, balance after the event in November. GST in each month?"],
      steps: ["Advance 45,000 (treated as inclusive or exclusive as agreed; here exclusive): GST 8,100 in July.", "Balance 1,05,000: GST 18,900 in November."],
      answer: "Rs. 8,100 in July and Rs. 18,900 in November, Rs. 27,000 in total.",
    },
    {
      title: "Interest on delayed payment",
      q: ["A client pays an 18 percent invoice of Rs. 2 lakh three months late, and you charge 1.5 percent a month interest. GST on the interest?"],
      steps: ["Interest = 2,00,000 × 1.5% × 3 = 9,000.", "GST = 1,620."],
      answer: "Rs. 1,620, invoiced with the interest.",
    },
    {
      title: "Composite supply",
      q: ["A shop sells a fan for Rs. 3,000 at 18 percent and charges Rs. 200 for delivery on the same invoice. Total GST?"],
      steps: ["Delivery is part of the composite supply; taxed at 18 percent.", "3,200 × 18% = 576."],
      answer: "Rs. 576; invoice total Rs. 3,776.",
    },
  ],

  exercises: {
    warmup: [
      { q: "What are the two main GST rates after 22 September 2025?", a: "5 percent and 18 percent, with 40 percent for a short list of luxury and sin goods." },
      { q: "When do you charge IGST?", a: "When the supply is inter-state: the supplier's location and the place of supply are in different states." },
      { q: "How do you remove GST from an inclusive price?", a: "Divide by (1 + rate ÷ 100), or multiply by 100 ÷ (100 + rate)." },
      { q: "What is GSTR-2B?", a: "An auto-generated statement of input credit available from suppliers' filed GSTR-1s." },
      { q: "What is the e-invoicing turnover threshold?", a: "Rs. 5 crore of aggregate turnover in any year since 2017-18." },
      { q: "What document does a composition dealer issue?", a: "A bill of supply, without tax." },
      { q: "What rate applies to gold?", a: "3 percent." },
      { q: "What is a receipt voucher?", a: "A document issued when an advance is received for a supply, showing tax where applicable." },
      { q: "What is QRMP?", a: "Quarterly Return Monthly Payment, for businesses with turnover up to Rs. 5 crore." },
      { q: "Does a discount shown on the invoice reduce GST?", a: "Yes. It reduces the taxable value." },
    ],
    practice: [
      { q: "Rs. 15,000 plus 18 percent within the state: CGST, SGST, total?", a: "CGST Rs. 1,350, SGST Rs. 1,350, total Rs. 17,700." },
      { q: "Rs. 6,300 including 5 percent: base and GST?", a: "Base Rs. 6,000, GST Rs. 300." },
      { q: "Rs. 2,36,000 including 18 percent: base and GST?", a: "Base Rs. 2,00,000, GST Rs. 36,000." },
      { q: "Output GST Rs. 48,000, eligible input credit Rs. 31,500. Payable?", a: "Rs. 16,500." },
      { q: "List six items a tax invoice must show.", a: "Any six of: supplier name, address and GSTIN; invoice number; date; buyer details and GSTIN; place of supply; HSN or SAC; taxable value; rate and amount of tax; total; reverse charge indicator; signature." },
      { q: "A consultant has Rs. 15 lakh of billing. Must she register?", a: "Not compulsorily, in most states, unless another rule applies; she can register voluntarily." },
      { q: "A freelancer's all-in price must leave Rs. 75,000 after 18 percent GST. What price?", a: "Rs. 88,500." },
      { q: "A designer in Kochi bills a registered client in Chennai. Which tax applies?", a: "IGST, because the place of supply is the client's location in another state." },
      { q: "List four records a GST-registered shop must keep.", a: "Sales register, purchase register, stock records, payment records, returns and challans, e-way bills." },
      { q: "Stitching charges of Rs. 3,200 at 5 percent. Total with GST?", a: "Rs. 3,360." },
      { q: "List four tasks in the first month after GST registration.", a: "Display the GSTIN; set up invoices with correct details; open a separate GST account; tell suppliers your GSTIN; set return reminders." },
      { q: "A customer pays late and you charge Rs. 500 interest on an 18 percent supply. GST on the interest?", a: "Rs. 90, since interest for late payment takes the rate of the supply." },
      { q: "Rewrite the sample invoice's tax lines for a 5 percent supply of Rs. 80,000 within the state.", a: "CGST @ 2.5%: Rs. 2,000; SGST @ 2.5%: Rs. 2,000; total Rs. 84,000." },
    ],
    stretch: [
      { q: "An invoice wrongly charged CGST and SGST on an inter-state supply of Rs. 1 lakh at 18 percent. What must be done?", a: "Pay IGST of Rs. 18,000, issue corrected documents, and claim a refund of the CGST and SGST paid; the buyer's credit follows the corrected invoice." },
      { q: "Compare composition at 1 percent with regular GST at 5 percent for a shop with Rs. 80 lakh sales to consumers and Rs. 50 lakh of purchases carrying 5 percent GST.", a: "Composition: Rs. 80,000 tax, paid from margin. Regular: output Rs. 4 lakh minus credit Rs. 2.5 lakh = Rs. 1.5 lakh, collected from customers. Composition costs less paperwork but comes from margin; regular passes the tax to customers but raises prices." },
      { q: "Explain why a buyer may hold payment when your registration is suspended.", a: "Their input credit on your invoices may be blocked or questioned, so they risk paying tax twice." },
      { q: "A discount of 3 percent is given in March on the year's purchases without prior agreement. Can GST be reduced?", a: "No. It must be issued as a commercial credit note without GST adjustment." },
      { q: "A seller's GSTR-2B shows Rs. 40,000 of credit, its purchase register Rs. 46,000. What should it claim?", a: "Rs. 40,000, and follow up with suppliers on the Rs. 6,000 not reported." },
      { q: "Explain why a shop's cash GST payment is usually much smaller than its output GST.", a: "Input credit on purchases is set off against output tax, so cash paid reflects tax on the value added." },
      { q: "A supplier's registration is cancelled after you claimed credit on its invoice. What do you need to show to keep the credit?", a: "That the purchase was genuine: tax invoice, delivery proof, payment through bank, and that the supplier was registered at the time." },
      { q: "Show why the government receives exactly 18 percent of the final price along a chain where every business claims credit.", a: "Each stage pays tax on its value added; the sum of values added is the final price, so the sum of tax is 18 percent of it." },
      { q: "Explain why packing and delivery charged by the supplier are usually taxed at the rate of the goods.", a: "They are part of a composite supply whose principal supply is the goods, so the whole takes the principal supply's rate." },
    ],
    challenge: [
      { q: "Design a monthly GST routine for a two-person design studio.", a: "Issue invoices with correct SAC and place of supply; move GST to a separate account on receipt; reconcile sales with GSTR-1 by the 10th; download GSTR-2B and match purchases; file GSTR-1 and GSTR-3B on time or use QRMP; keep invoices, credit notes and bank statements together." },
      { q: "A client in another state wants a single all-inclusive figure. How do you protect your margin?", a: "Compute the all-in figure as your base times (1 + 18 percent), state that it includes IGST, and show base and IGST on the invoice." },
      { q: "Argue for and against voluntary registration for a freelancer with Rs. 10 lakh billing, half to registered companies.", a: "For: registered clients can claim credit; you claim credit on equipment and software. Against: compliance work; unregistered clients pay 18 percent more. Decide by the share of registered clients and the input credit available." },
      { q: "Explain how GST collected becomes a cash-flow risk and three habits that prevent it.", a: "Collected tax mixes with revenue and is spent before the return is due. Separate account on receipt; monthly reconciliation; paying tax first when cash is short." },
      { q: "A product's rate dropped from 28 to 18 percent on 22 September 2025. A customer paid an advance on 15 September and took delivery on 30 September with the invoice on that date. Which rate applies?", a: "Time of supply rules decide; with the invoice and delivery after the change, generally the new rate applies to the goods, but advances and invoice timing need checking under the rules for change in rate." },
      { q: "Prepare a one-page GST policy for a new employee who issues invoices in a small firm.", a: "Check buyer GSTIN and place of supply; use the right HSN or SAC and rate; show base, tax split and total; number invoices consecutively; report every invoice that day in the register; never change a filed invoice, issue a credit or debit note instead; escalate any reverse-charge or export case." },
      { q: "Your largest client says your invoices keep missing from its GSTR-2B. Diagnose three possible causes and fixes.", a: "GSTR-1 filed late or not at all: file on time. Client's GSTIN entered wrongly: correct through amendment. Invoice reported as B2C instead of B2B: amend in the next GSTR-1." },
    ],
  },

  faqs: [
    {
      group: "Rates and calculations",
      items: [
        ["What changed in GST in September 2025?", "From 22 September 2025 most items moved to 5 or 18 percent, the 12 and 28 percent slabs were largely removed, and a 40 percent rate was introduced for a short list of luxury and sin goods."],
        ["How do I know the GST rate for my product?", "Find its HSN code, or SAC code for services, and check the rate in the CBIC rate notifications or the GST portal's search."],
        ["How do I add GST?", "Multiply the price before tax by (1 + rate ÷ 100). For 18 percent, multiply by 1.18; for 5 percent, by 1.05. Show the base, the tax and the total separately on the invoice."],
        ["How do I remove GST from an inclusive price?", "Divide by (1 + rate ÷ 100). For 18 percent, divide by 1.18. Do not take 18 percent of the inclusive price."],
        ["Is GST charged on GST?", "No. GST is charged on the taxable value, which excludes GST itself, though it includes some other taxes and charges."],
        ["Why does my invoice have CGST and SGST?", "Because the supply is within one state: the supplier and the place of supply are in the same state. The rate is split equally, so an 18 percent supply shows 9 percent CGST and 9 percent SGST."],
        ["Is there GST on a deposit or advance?", "For services, GST is generally due when an advance is received. For goods, most taxpayers need not pay GST on advances."],
        ["Do I round GST to the rupee?", "Tax is computed to the paisa. The invoice total is often rounded to the nearest rupee with a round-off line."],
      ],
    },
    {
      group: "Registration",
      items: [
        ["When must I register for GST?", "When aggregate turnover exceeds Rs. 40 lakh for goods or Rs. 20 lakh for services in most states, lower in special category states, or regardless of turnover in specified cases such as inter-state supply of goods."],
        ["How long does registration take?", "Applications are processed on the GST portal, often within a week if documents and Aadhaar authentication are in order. Physical verification can lengthen it."],
        ["Do freelancers working for foreign clients need GST?", "If turnover crosses the threshold, yes. Exports are zero-rated, so registration lets them claim refunds of input credit."],
        ["Can I register voluntarily?", "Yes. Voluntary registration lets you charge GST and claim input credit on purchases, which helps if your clients are registered businesses. You then have to file returns on time like any registered taxpayer."],
        ["What is aggregate turnover?", "The total value of taxable, exempt, export and inter-state supplies across India under the same PAN, excluding GST itself."],
        ["Do I need separate registration in each state?", "Yes, for each state from which you make taxable supplies. One PAN can hold several state registrations, and supplies between them may themselves be taxable."],
        ["Can I cancel registration if turnover falls?", "Yes, if you are no longer liable to be registered. Apply on the portal, pay tax on stock held if required, and file a final return within the time limit."],
      ],
    },
    {
      group: "Invoices",
      items: [
        ["What must a tax invoice include?", "Supplier and buyer details, GSTINs, invoice number and date, place of supply, HSN or SAC, value, rate and amount of each tax, total, reverse charge indicator and signature."],
        ["Can invoice numbers restart every year?", "Yes, they must be unique within a financial year, up to 16 characters, often with the year as a prefix."],
        ["Is a handwritten invoice valid?", "Yes, if it has all the required details, though most businesses now use software. E-invoicing is mandatory above Rs. 5 crore turnover."],
        ["Do I need HSN codes on every invoice?", "For B2B invoices, 4-digit HSN is required up to Rs. 5 crore of turnover and 6-digit above. B2C rules are lighter for small businesses."],
        ["What is a bill of supply?", "A document issued instead of a tax invoice for exempt supplies or by composition dealers. It shows the value but no tax, because no GST is charged on it."],
        ["How do I correct an invoice?", "Issue a credit note if the value or tax was too high, or a debit note if too low, referring to the original invoice."],
        ["Is a proforma invoice a tax invoice?", "No. A proforma invoice is a quotation or a request for advance payment. It does not create tax liability or credit. Issue a proper tax invoice when the supply is made."],
      ],
    },
    {
      group: "Input tax credit",
      items: [
        ["What is input tax credit?", "The GST you paid on purchases used for your business, which you can deduct from the GST you collect on sales. It ensures tax is paid only on the value each business adds."],
        ["Why can I not claim credit for an invoice?", "Common reasons: the supplier has not filed GSTR-1, so it is missing from GSTR-2B; the item is blocked; or you have not received the goods."],
        ["Can I claim credit on rent?", "Yes, on GST charged for commercial premises used for business, if the landlord is registered and the invoice appears in your GSTR-2B. Residential rent for business use falls under reverse charge in some cases."],
        ["Can I claim credit on a car?", "Generally not for passenger vehicles seating up to 13, except for businesses that deal in cars, transport passengers, or train drivers. Goods vehicles used for business are allowed."],
        ["Can I claim credit on food for staff?", "Generally not. Credit on food and beverages is blocked unless providing them is obligatory under a law, or they are used to make the same kind of supply."],
        ["What happens if I do not pay my supplier?", "If you have not paid within 180 days of the invoice date, you must reverse the credit, with interest. You can reclaim it once you pay."],
        ["Is there a time limit to claim credit?", "Yes, generally by 30 November after the end of the financial year, or the annual return date if earlier."],
      ],
    },
    {
      group: "Returns and payments",
      items: [
        ["What returns must a small business file?", "GSTR-1 for sales and GSTR-3B for summary and payment, monthly or quarterly under QRMP, and an annual return above set limits."],
        ["What is QRMP?", "The Quarterly Return Monthly Payment scheme for businesses up to Rs. 5 crore turnover: quarterly returns with monthly tax payments."],
        ["What if I miss a return date?", "Late fee per day, capped, and interest at 18 percent on late tax. Repeated misses can lead to suspension of registration."],
        ["Do I need to file if I had no sales?", "Yes. A registered business must file returns for every period. Nil returns can be filed quickly, even by SMS in many cases, and carry a lower late fee if delayed."],
        ["How do I pay GST?", "Create a challan on the portal and pay by net banking, card, UPI or NEFT. The payment reaches your electronic cash ledger and is used in the return."],
        ["What is the electronic credit ledger?", "A record on the GST portal showing your available input tax credit, by type of tax. It is used to pay output tax in your returns, following the order of set-off in the rules."],
        ["What is GSTR-9?", "The annual return summarising the year's sales, purchases, tax and credit. It is mandatory above a set turnover limit and optional below it."],
      ],
    },
    {
      group: "Special situations",
      items: [
        ["What is reverse charge?", "A mechanism where the recipient, not the supplier, pays GST for specified supplies, such as legal services and some transport."],
        ["When is an e-way bill required?", "Generally when goods worth more than Rs. 50,000 are moved, whether for sale or otherwise, with state-specific rules for movement within a state. It is generated on the e-way bill portal before movement."],
        ["Are exports taxed?", "Exports are zero-rated: either supplied without IGST under a letter of undertaking with a refund of input credit, or with IGST and a refund of that tax."],
        ["Do online sellers have special rules?", "Yes. Most sellers on e-commerce platforms must register regardless of turnover, with relaxations for some small sellers of goods within a state, and platforms collect 1 percent TCS on net taxable sales."],
        ["Is GST charged on second-hand goods?", "Registered dealers in used goods can, in specified cases, pay GST only on their margin between purchase and sale price, if they did not claim credit on the purchase."],
        ["How is GST charged on job work?", "Job work services have their own rates, often lower; materials owned by the principal are not taxed again when sent for job work under the rules."],
        ["What if I sold at the old rate after a rate change?", "Excess tax collected must be refunded to customers or deposited with the government; issue credit notes where possible."],
      ],
    },
    {
      group: "Freelancers and small firms",
      items: [
        ["Do I charge GST on work for a foreign client?", "If the service qualifies as an export, it is zero-rated: invoice without IGST under a letter of undertaking, and keep proof of payment in foreign exchange."],
        ["Can I claim GST on my laptop and phone?", "Yes, if bought with a tax invoice in your GSTIN, used for business, and the invoice appears in GSTR-2B. Personal use portions should not be claimed."],
        ["Do I charge GST on an advance?", "For services, yes: GST is due on advances received. Issue a receipt voucher and adjust in the final invoice."],
        ["My client deducted TDS on my invoice. Does that affect GST?", "Income-tax TDS is separate from GST. Charge GST on the full taxable value; the client deducts income-tax TDS from the base under income-tax rules."],
        ["Do I need GST for teaching online?", "If your turnover crosses the threshold, generally yes, unless your service is exempt education. Commercial coaching is taxable at 18 percent."],
        ["Should I use software for GST invoices?", "It helps: it applies rates, splits taxes correctly, numbers invoices and exports data for returns. A careful spreadsheet can work for a very small business."],
        ["Should I check a supplier's GSTIN before buying?", "Yes. The GST portal shows whether a GSTIN is active and whether returns have been filed. Buying from a non-filing supplier risks your input credit."],
        ["Can I claim credit if my supplier's registration is later cancelled?", "For genuine purchases before the cancellation date, with full documentation, credit may be allowed. For invoices after cancellation, it is not. Keep invoices, transport documents and bank payment proof."],
        ["How often can exporters claim refunds?", "Refund applications can be filed for each tax period or for several periods together, within two years of the relevant date. Filing regularly, such as quarterly, avoids credit piling up and keeps the documents fresh."],
        ["Can I claim credit on stock bought before registration?", "Within limits, yes: on inputs held in stock on the day before registration, with invoices, if you declare them on the portal within the time allowed."],
        ["Can a hotel change my invoice later to add my GSTIN?", "Generally no. The invoice must carry your GSTIN when it is issued, and the hotel reports it in its own return. Give your GSTIN and business name at booking or check-in, and check the invoice before you leave."],
        ["Does a discount on the invoice reduce GST?", "Yes. A discount shown on the invoice at the time of supply reduces the taxable value, so GST is charged on the lower amount."],
        ["Is moving stock between my own shops in different states taxable?", "Yes. Registrations in different states under one PAN are distinct persons, so a transfer between them is a supply with IGST, claimable as credit by the receiving branch."],
        ["Can a company claim credit on office renovation?", "Generally not, because credit on works contracts and goods for constructing immovable property is blocked, except for plant and machinery."],
        ["What happens if a client never pays my invoice?", "You still owe the GST on the invoice, but a credit note is not allowed simply for non-payment. Income-tax rules separately allow bad debts as expenses in some cases."],
      ],
    },
    {
      group: "Costs and credit in practice",
      items: [
        ["Can I claim GST on hotel stays for work?", "Yes, if the hotel invoice carries your GSTIN and the stay is for business. Give your GSTIN at check-in; credit is lost on invoices issued to you without it."],
        ["Is GST on foreign software my responsibility?", "For a registered business importing services, GST is often payable under reverse charge, then claimable as credit. Unregistered individuals are charged by the foreign provider where it is registered in India."],
        ["Can I claim credit on staff gifts?", "Credit on goods given as gifts is generally blocked. Gifts to employees above a value limit are also treated as supplies."],
        ["What if a supplier charges the wrong rate?", "Ask the supplier for a corrected invoice or a credit note before you claim credit. Credit claimed on tax wrongly charged can be questioned, and the supplier's own return will need correcting too."],
        ["Does GST apply to commission I earn?", "Yes, commission and brokerage are taxable services, generally at 18 percent, if you are registered or required to be."],
        ["Is there GST on renting a house to a company?", "Renting residential property to a registered business may attract GST under reverse charge, paid by the business. Rules for residential rent were revised in recent years; check the current notification."],
      ],
    },
    {
      group: "Quick checks",
      items: [
        ["How can I check if a GSTIN is genuine?", "Search it on the GST portal's taxpayer search. It shows the business name, status, registration date and return filing history."],
        ["Is GST charged on delivery charges?", "Delivery charged by the supplier as part of a supply usually takes the rate of the main supply. Separate transport services have their own rates."],
        ["Do I charge GST on packing charges?", "Packing included in the supply is part of the taxable value and takes the rate of the goods."],
        ["Can I issue an invoice before supplying?", "For goods, an invoice is issued before or at the time of removal or delivery; for services, within 30 days of supply in most cases. Do not issue invoices for supplies that will not happen."],
        ["Is interest on late payment by a customer taxable?", "Yes, interest or late fees charged for delayed payment are added to the value of the supply and taxed at the same rate."],
        ["Do I need to show GST separately on a consumer bill?", "Yes, a tax invoice shows the tax amount, even when the customer sees an inclusive price on a tag or menu."],
      ],
    },
  ],

  glossary: [
    ["Aggregate turnover", "Total value of supplies under one PAN across India, excluding GST, used for thresholds."],
    ["Bill of supply", "A document issued for exempt supplies or by composition dealers, without tax."],
    ["CGST", "Central GST, charged with SGST on intra-state supplies."],
    ["Composition scheme", "A simplified scheme for small businesses paying a flat rate on turnover without credit."],
    ["Credit note", "A document reducing the value or tax of an earlier invoice."],
    ["Debit note", "A document increasing the value or tax of an earlier invoice."],
    ["E-invoice", "An invoice registered on the government portal with a reference number and QR code, mandatory above Rs. 5 crore turnover."],
    ["E-way bill", "An electronic document required for movement of goods above a value limit."],
    ["Exempt supply", "A supply on which no GST is charged by law, with credit on related inputs generally not allowed."],
    ["GSTIN", "The 15-character GST registration number."],
    ["GSTR-1", "The return reporting outward supplies."],
    ["GSTR-2B", "An auto-generated statement of input credit available from suppliers' returns."],
    ["GSTR-3B", "The summary return with tax payment."],
    ["HSN", "Harmonised System of Nomenclature code classifying goods."],
    ["IGST", "Integrated GST, charged on inter-state supplies and imports."],
    ["Inclusive price", "A price that already includes GST."],
    ["Input tax credit", "GST paid on business purchases, deductible from output tax."],
    ["Letter of undertaking", "A filing that allows exports without paying IGST."],
    ["Nil-rated", "A supply taxed at 0 percent."],
    ["Output tax", "GST charged on your sales."],
    ["Place of supply", "The location that decides whether a supply is intra-state or inter-state."],
    ["QRMP", "Quarterly Return Monthly Payment scheme for small taxpayers."],
    ["Reverse charge", "A mechanism where the recipient pays GST."],
    ["SAC", "Services Accounting Code classifying services."],
    ["SGST", "State GST, charged with CGST on intra-state supplies."],
    ["Taxable value", "The value on which GST is charged, after discounts on the invoice."],
    ["TCS", "Tax collected at source by e-commerce operators on sellers' sales."],
    ["Time of supply", "The point at which GST liability arises, based on invoice, payment and delivery dates."],
    ["UTGST", "Union Territory GST, replacing SGST in union territories without a legislature."],
    ["Zero-rated supply", "Exports and supplies to special economic zones, taxed at nil with credit refundable."],
    ["Receipt voucher", "A document issued when an advance is received for a supply."],
    ["Refund voucher", "A document issued when an advance is refunded without a supply."],
    ["Composite supply", "A bundle of supplies naturally sold together, taxed at the rate of the principal supply."],
    ["Distinct person", "Each state registration of the same PAN, treated as a separate person for GST."],
    ["Works contract", "A contract for building, repairing or renovating immovable property involving goods and services."],
  ],

  references: [
    { title: "GST rate notifications, September 2025", who: "Central Board of Indirect Taxes and Customs", where: "cbic-gst.gov.in", note: "The official rates from 22 September 2025 by HSN and SAC." },
    { title: "Central Goods and Services Tax Act, 2017 and Rules", who: "Government of India", where: "cbic-gst.gov.in", note: "Registration, invoices, input credit, returns and penalties." },
    { title: "GST portal", who: "Goods and Services Tax Network", where: "gst.gov.in", note: "Registration, returns, payments, GSTR-2B and taxpayer search." },
    { title: "E-invoice system", who: "GSTN and NIC", where: "einvoice1.gst.gov.in", note: "Invoice Registration Portal for businesses above the e-invoice threshold." },
    { title: "E-way bill system", who: "National Informatics Centre", where: "ewaybillgst.gov.in", note: "Generation and rules for e-way bills." },
    { title: "GST rate finder", who: "CBIC", where: "cbic-gst.gov.in, GST rates", note: "Search rates by product or service description and code." },
    { title: "Your state's GST department", who: "State commercial tax departments", where: "Each state's website", note: "State-specific rules, such as intra-state e-way bill limits and composition limits." },
  ],
};
