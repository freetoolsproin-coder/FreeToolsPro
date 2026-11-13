// Home page copy. Written answer-first so search engines and AI assistants (Google, ChatGPT search,
// Claude, Perplexity) can quote it directly. The FAQs are also published as FAQPage structured data.
// Worked examples use the site's own calculators; re-check them when rates or slabs change.

export const ABOUT =
  "FreeToolsPro is a free collection of online calculators and utilities for people in India: loan EMI, SIP and income tax calculators, image and PDF tools, student calculators, AI study tools (notes summarizer, flashcards, quizzes), writing helpers, SEO checkers and developer utilities. Every tool runs in your web browser, so files and numbers are never uploaded, and nothing needs an account or an install.";

// `fig` is the headline result shown large on the home page card; keep it in step with `a`.
export const EXAMPLES = [
  {
    q: "What is the EMI on a ₹30 lakh home loan at 8.5% for 20 years?",
    a: "₹26,035 a month. Over 240 EMIs you repay about ₹62.5 lakh, of which roughly ₹32.5 lakh is interest.",
    path: "/calculators/emi-calculator?P=3000000&r=8.5&y=20",
    tool: "EMI Calculator",
    fig: "₹26,035 a month",
  },
  {
    q: "How much does a ₹10,000 monthly SIP grow to in 15 years at 12%?",
    a: "About ₹50.5 lakh. You invest ₹18 lakh; the remaining ₹32.5 lakh is estimated returns from compounding.",
    path: "/calculators/sip-calculator?p=10000&r=12&y=15",
    tool: "SIP Calculator",
    fig: "₹50.5 lakh",
  },
  {
    q: "Is a salary of ₹12.75 lakh tax-free under the new regime (FY 2026-27)?",
    a: "Yes, for salaried people. After the ₹75,000 standard deduction, taxable income is ₹12 lakh, and the Section 87A rebate brings the tax to zero.",
    path: "/tax-tools/income-tax-calculator?inc=1275000&regime=new",
    tool: "Income Tax Calculator",
    fig: "₹0 tax",
  },
  {
    q: "What is the price of a ₹1,000 item with 18% GST?",
    a: "₹1,180: ₹1,000 plus ₹180 GST. Within a state that splits into ₹90 CGST and ₹90 SGST.",
    path: "/business-tools/gst-calculator",
    tool: "GST Calculator",
    fig: "₹1,180",
  },
  {
    q: "How do I reduce a photo to under 50 KB for an exam form?",
    a: "Open the Image Compressor, set the target size to 50 KB and download. It finds the best quality that fits, on your phone, without uploading the photo.",
    path: "/image-tools/image-compressor",
    tool: "Image Compressor",
    fig: "Under 50 KB",
  },
  {
    q: "How many classes do I need to attend to reach 75% attendance?",
    a: "With 42 of 60 classes attended (70%), you need 12 classes in a row to reach 75%. The calculator works it out for any numbers.",
    path: "/student-tools/attendance-calculator",
    tool: "Attendance Calculator",
    fig: "12 classes",
  },
];

export const STEPS = [
  ["Pick a tool", "Search by what you want to do, such as “compress photo” or “EMI”, or browse a toolkit."],
  ["Enter your numbers or files", "Results update as you type. Images, PDFs and text are processed on your own device."],
  ["Copy, download or share", "Download files, copy results, or share a calculator link with your values filled in."],
];

export const HOME_FAQS = [
  ["Are FreeToolsPro tools really free?", "Yes. Every tool is free to use with no sign-up, no watermark and no daily limit. The site is supported by advertising."],
  ["Are my files uploaded to a server?", "No. Images, PDFs and text are processed inside your browser using your device's own memory, and are never sent to FreeToolsPro or anyone else."],
  ["Which income tax rules do the calculators use?", "The tax and salary calculators use the slabs, standard deduction and Section 87A rebate for FY 2026-27 (AY 2027-28) under both the new and old regimes. Each result shows the slab-wise working so you can check it."],
  ["Do the tools work on mobile phones?", "Yes. Every page is built for phones first and loads quickly on slower connections. Image and PDF tools work on Android and iPhone browsers without installing an app."],
  ["How accurate are the loan and investment calculators?", "They use the standard formulas banks and fund houses use, such as the reducing-balance EMI formula and monthly compounding for SIPs. Investment returns are estimates; actual returns depend on the market."],
  ["Can I compress a PDF or photo to a specific size in KB?", "Yes. The Image Compressor and Compress PDF tools both accept a target size, such as 50 KB, 100 KB or 500 KB, which is what many government and exam portals require."],
  ["Is there a limit on file size or number of uses?", "There is no usage limit. The practical file-size limit is your device's memory; most phones handle images up to about 50 MB and PDFs of a few hundred pages."],
  ["Who makes FreeToolsPro?", "FreeToolsPro is built and maintained for users in India. Calculations follow published rules and are reviewed regularly; the date of the last review is shown on every tool page. Suggestions and corrections are welcome at support@freetoolspro.in."],
];

// Hero task chips: what people come to do, in their words. [label, tool id]
export const TASKS = [
  ["Compress a photo to 50 KB", "image-compressor"],
  ["Calculate home loan EMI", "emi-calculator"],
  ["Merge PDF files", "pdf-merger"],
  ["Income tax for FY 2026-27", "income-tax-calculator"],
  ["CGPA to percentage", "cgpa-to-percentage-calculator"],
  ["Add GST to a price", "gst-calculator"],
  ["Make flashcards from notes", "flashcard-generator"],
  ["Format JSON", "json-formatter"],
];
