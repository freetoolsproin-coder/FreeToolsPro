/**
 * Category-specific editorial defaults for tool pages.
 * Supplies how-to, examples, use cases, tips, benefits, and FAQs when a tool omits them.
 */

export const CATEGORY_HOW_TO = {
  calculators: {
    howTitle: "Enter numbers once—read a clear breakdown.",
    howBody:
      "FreeToolsPro calculators turn everyday finance and health inputs into transparent results. You fill the fields above; the page shows totals, schedules, or ranges you can copy into notes or spreadsheets. Formulas are described on the page so you can sanity-check the math before you rely on it for a decision.",
    whyBody:
      "Use these calculators when you want a fast estimate before talking to a bank, planner, or clinician—not as a substitute for their official figures.",
    steps: [
      {
        title: "Choose realistic inputs",
        body: "Use rates, dates, and amounts that match your scenario—wrong tenure or interest assumptions produce misleading totals.",
      },
      {
        title: "Review the live result",
        body: "Totals, EMI schedules, or health ranges update as you edit. Compare against your bank or planner if the decision is large.",
      },
      {
        title: "Copy or screenshot what you need",
        body: "Save the summary for records, then try a related calculator (for example EMI after SIP) if you are planning a full budget.",
      },
      {
        title: "Treat it as guidance",
        body: "Online calculators approximate; lenders, tax rules, and medical advice can differ. Confirm critical figures with a professional when needed.",
      },
    ],
    examples: [
      "Model a home loan with your real principal, rate, and tenure, then compare total interest if you shorten the tenure by two years.",
      "For health calculators, enter current measurements once, note the range, and re-check after lifestyle changes instead of guessing from memory.",
    ],
    useCases: [
      "Comparing EMI options before applying for a loan",
      "Rough SIP or inflation planning for personal finance notes",
      "Quick BMI or calorie estimates while tracking habits",
      "Classroom demos of amortization or compound growth",
    ],
    tips: [
      "Match the interest type (reducing vs flat) to what your lender quotes.",
      "Change one input at a time so you can see what moved the result.",
      "Screenshot results with the date if you will discuss them with an advisor later.",
    ],
    benefits: [
      "Transparent totals and schedules you can re-check",
      "No signup for standard calculator use",
      "Works on phone and desktop",
      "Related finance and health tools on FreeToolsPro",
    ],
    faqs: [
      {
        q: "Are calculator results official?",
        a: "No. They are educational estimates based on the inputs you enter. Always verify loans, taxes, and medical decisions with the relevant institution or professional.",
      },
      {
        q: "Do you store my salary or loan numbers?",
        a: "Most calculators run in your browser. Values are not uploaded to FreeToolsPro for the core calculation unless a feature explicitly needs a network call.",
      },
    ],
    privacyNote:
      "Calculator inputs such as amounts and dates typically stay on your device for the live result. Do not share screenshots that contain sensitive financial data on public channels.",
    trustBullets: [
      "Transparent estimates you can cross-check",
      "No signup required for standard calculators",
      "Works on phone and desktop",
      "Related tools for the next planning step",
    ],
  },

  "text-tools": {
    howTitle: "Paste text, transform it, copy the clean result.",
    howBody:
      "Text tools on FreeToolsPro clean, wrap, sort, number, or rewrite copy without installing an editor plugin. Processing is designed to run in your browser so drafts and lists stay on your device while you iterate.",
    whyBody:
      "Reach for text tools when you need a clean list, consistent wrapping, or a quick rewrite pass without opening a full word processor.",
    steps: [
      {
        title: "Paste or type your source text",
        body: "Use the input panel above. Large lists and paragraphs are fine—start with a sample if you are testing a new option.",
      },
      {
        title: "Pick options that match the job",
        body: "Width, indent style, case sensitivity, or tone controls change the output. Adjust until the preview matches what you need.",
      },
      {
        title: "Copy the output",
        body: "Use Copy to move the result into email, docs, code, or spreadsheets. Keep the original paste until you confirm the transform.",
      },
      {
        title: "Chain related tools if needed",
        body: "For example trim, then sort, then number lines—or unwrap OCR text before editing. Related tools on this page suggest the next step.",
      },
    ],
    examples: [
      "Paste a messy bullet list, trim whitespace, sort A–Z, then number lines before dropping it into a doc.",
      "Unwrap OCR text that has hard line breaks, then justify or wrap to a target column width for email.",
    ],
    useCases: [
      "Cleaning CSV-like lists before a spreadsheet paste",
      "Preparing code samples or notes with consistent indentation",
      "Sorting name or URL lists for reviews",
      "Draft rewrites before sending client email",
    ],
    tips: [
      "Keep a backup of the original paste until you confirm the transform.",
      "Test options on a short sample before running a huge document.",
      "Avoid pasting passwords or private keys on shared screens.",
    ],
    benefits: [
      "Live preview as you type",
      "Copy-ready output in one click",
      "Browser-local transforms when possible",
      "Related text utilities on every page",
    ],
    faqs: [
      {
        q: "Will this change my original file?",
        a: "No. FreeToolsPro works on the text you paste into the page. Your disk files are unchanged until you paste the result back yourself.",
      },
      {
        q: "Is pasted text uploaded to a server?",
        a: "Standard trim, wrap, sort, and line tools run locally in the browser. Prefer not to paste secrets on shared machines.",
      },
    ],
    privacyNote:
      "Line and copy transforms run in your browser. Avoid pasting passwords, private keys, or confidential customer data on shared screens.",
    trustBullets: [
      "Live preview as you type",
      "Copy-ready output in one click",
      "Browser-local transforms when possible",
      "Related text utilities on every page",
    ],
  },

  "developer-tools": {
    howTitle: "Validate, convert, and explain without leaving the browser.",
    howBody:
      "Developer tools help you format configs, convert data shapes, test regex, and sketch SQL or diagrams quickly. They are helpers for review and teaching—not a replacement for your production compiler, database, or CI pipeline.",
    whyBody:
      "Use these utilities for quick checks during debugging, code review, and teaching—then re-run critical work in your real toolchain.",
    steps: [
      {
        title: "Paste a realistic sample",
        body: "Use a representative snippet (not production secrets). Incomplete samples produce weak explanations or false validation confidence.",
      },
      {
        title: "Run the transform or check",
        body: "Formatters, converters, and testers update as you edit. Read error messages carefully before copying output into a repo.",
      },
      {
        title: "Copy into your toolchain",
        body: "Paste results into editors, PRs, or tickets. Re-run critical SQL, YAML, or regex in the target runtime.",
      },
      {
        title: "Know the limits",
        body: "Heuristic validators and explainers are not full language servers. Dialect differences and edge cases still need your judgment.",
      },
    ],
    examples: [
      "Paste messy JSON, format it, then copy a minimal failing subset into a unit test fixture.",
      "Draft a regex in the tester with happy-path and fail cases before shipping it to production validation.",
    ],
    useCases: [
      "Formatting API payloads during debugging",
      "Converting CSV/JSON/YAML between teammates’ preferred shapes",
      "Teaching SQL or regex with live examples",
      "Quick SEO and site health checks before a deeper audit",
    ],
    tips: [
      "Redact tokens and PII before pasting samples.",
      "Prefer the smallest fixture that reproduces the bug.",
      "Confirm dialect and runtime behavior outside the browser for production changes.",
    ],
    benefits: [
      "Fast format and convert workflows",
      "No install for everyday snippets",
      "Clear limits called out on-page",
      "Related regex, SQL, and YAML tools",
    ],
    faqs: [
      {
        q: "Can I trust formatter output in production?",
        a: "Use it as a draft. Always run your project’s linter, compiler, or database console on critical changes before deploy.",
      },
      {
        q: "Should I paste API keys here?",
        a: "No. Redact secrets. Prefer sample data. Client-side tools still appear on screen and may be logged by browser extensions.",
      },
    ],
    privacyNote:
      "Prefer sanitized samples. Do not paste production credentials, private keys, or customer PII into shared or recorded sessions.",
    trustBullets: [
      "Fast format and convert workflows",
      "No install for everyday snippets",
      "Clear limits called out on-page",
      "Related regex, SQL, and YAML tools",
    ],
  },

  "image-tools": {
    howTitle: "Upload or select an image, adjust, then download.",
    howBody:
      "Image tools resize, compress, convert, or extract text so you can prepare assets for the web without a heavy desktop suite. Check output quality before publishing—aggressive compression can soften detail.",
    whyBody:
      "Use image tools when you need a quick web-ready asset, OCR pass, or format change without launching a full editor.",
    steps: [
      {
        title: "Add your image",
        body: "Choose a clear source file. Extremely large images may be slower in-browser; try a smaller export if the tab struggles.",
      },
      {
        title: "Set size, format, or options",
        body: "Pick dimensions, quality, or conversion targets that match your destination (social, web, print proof).",
      },
      {
        title: "Preview and download",
        body: "Confirm the result looks acceptable, then download. Keep the original file as a backup.",
      },
    ],
    examples: [
      "Resize a hero image to a common web width, then compress until the file size fits your CMS limit while edges stay sharp.",
      "Run OCR on a screenshot of a receipt, copy the text, then trim and sort lines in a text tool if needed.",
    ],
    useCases: [
      "Preparing social and blog images",
      "Converting formats for CMS uploads",
      "Extracting text from screenshots",
      "Creating favicons or simple branded assets",
    ],
    tips: [
      "Keep the original file; treat downloads as derivatives.",
      "Preview at 100% zoom before publishing compressed images.",
      "Avoid uploading IDs or confidential scans unless necessary and allowed.",
    ],
    benefits: [
      "Quick resize and convert paths",
      "Preview before you download",
      "Mobile-friendly controls",
      "Related image utilities nearby",
    ],
    faqs: [
      {
        q: "Does FreeToolsPro keep my photos?",
        a: "Many image tools process files in the browser. When a server step is required, use only images you are allowed to process and avoid sensitive documents unless necessary.",
      },
      {
        q: "Will quality always match Photoshop?",
        a: "Browser tools are optimized for convenience. For print-critical or retouching work, use a dedicated editor after a first pass here.",
      },
    ],
    privacyNote:
      "Avoid uploading IDs, medical images, or confidential scans unless you understand how that specific tool processes files.",
    trustBullets: [
      "Quick resize and convert paths",
      "Preview before you download",
      "Mobile-friendly controls",
      "Related image utilities nearby",
    ],
  },

  "pdf-tools": {
    howTitle: "Prepare PDFs for sharing, conversion, or lighter files.",
    howBody:
      "PDF tools help you convert, merge, or manage documents for everyday sharing. Always keep an original copy—PDF transforms can be lossy depending on the operation.",
    whyBody:
      "Use PDF tools when you need a browser-first pass for convert, merge, or light edits before emailing or uploading a packet.",
    steps: [
      {
        title: "Select your PDF",
        body: "Use a file you are allowed to process. Password-protected or corrupted PDFs may fail until unlocked or repaired elsewhere.",
      },
      {
        title: "Choose the operation",
        body: "Convert, merge, or edit options depend on the tool. Read on-page notes about limits before large batches.",
      },
      {
        title: "Download and verify",
        body: "Open the output in a PDF reader to confirm pages and text look correct before deleting the source.",
      },
    ],
    examples: [
      "Merge a cover letter and signed scan into one attachment, then rename clearly before upload.",
      "Convert a digitally created PDF to Word for light redlines, then re-export to PDF for signature.",
    ],
    useCases: [
      "Combining multi-file loan or onboarding packets",
      "Creating editable drafts from digitally born PDFs",
      "Exporting pages to images for slides or previews",
      "Everyday document prep without desktop Acrobat",
    ],
    tips: [
      "Keep immutable originals until recipients confirm the output.",
      "Review page order and fonts after conversion.",
      "Prefer offline tools for highly sensitive legal or medical PDFs.",
    ],
    benefits: [
      "Practical PDF workflows in the browser",
      "Verify output before sharing",
      "Keep originals as backup",
      "Related document tools listed",
    ],
    faqs: [
      {
        q: "Is my PDF stored on FreeToolsPro?",
        a: "Processing depends on the tool. Prefer not to upload confidential contracts or identity documents to any online tool unless required and allowed by your policy.",
      },
      {
        q: "Can every PDF be converted perfectly?",
        a: "Complex layouts, scanned pages, and fonts can limit fidelity. Review the output page by page for important documents.",
      },
    ],
    privacyNote:
      "Treat PDFs with personal or legal data carefully. Prefer local desktop software for highly sensitive files when possible.",
    trustBullets: [
      "Practical PDF workflows",
      "Verify output before sharing",
      "Keep originals as backup",
      "Related document tools listed",
    ],
  },

  "business-tools": {
    howTitle: "Fill business fields—get documents or totals you can reuse.",
    howBody:
      "Business tools support invoices, payroll-style math, GST helpers, and similar office tasks. Outputs are templates and estimates; your accountant or local rules may require adjustments.",
    whyBody:
      "Use business tools to draft invoices, receipts, and office math quickly—then confirm statutory figures with your books and advisor.",
    steps: [
      {
        title: "Enter company and line details",
        body: "Use accurate names, rates, and quantities. Small input errors show up as wrong totals on invoices or slips.",
      },
      {
        title: "Generate the preview",
        body: "Review totals and wording. Edit until the document matches what you would send to a client or employee.",
      },
      {
        title: "Export or copy",
        body: "Download or copy the result into your records. Retain supporting calculations for audits when required.",
      },
    ],
    examples: [
      "Draft an invoice with line items and tax, review the preview, then export for your client email.",
      "Estimate payroll or GST components, then reconcile against your accounting software before filing.",
    ],
    useCases: [
      "Small-business invoice and quotation drafts",
      "Quick GST or salary estimates for planning",
      "Rent receipt and similar office paperwork",
      "Teaching basic business document structure",
    ],
    tips: [
      "Confirm tax rates against official sources before filing.",
      "Keep supporting calculations with the exported document.",
      "Avoid pasting full employee PII on shared browsers when a private system is available.",
    ],
    benefits: [
      "Fast drafts for common business tasks",
      "Editable before you send",
      "Educational estimates, not legal advice",
      "Related finance tools nearby",
    ],
    faqs: [
      {
        q: "Does this replace accounting software?",
        a: "No. FreeToolsPro helpers draft and estimate. Use compliant books and professional advice for filings and payroll compliance.",
      },
      {
        q: "Are tax rates always current?",
        a: "Rates and rules change. Confirm GST and statutory figures against official sources before filing.",
      },
    ],
    privacyNote:
      "Avoid pasting full employee PII or client bank details into public browsers when a private accounting system is available.",
    trustBullets: [
      "Fast drafts for common business tasks",
      "Editable before you send",
      "Educational estimates, not legal advice",
      "Related finance tools nearby",
    ],
  },

  "social-media-tools": {
    howTitle: "Draft captions, bios, and content ideas faster.",
    howBody:
      "Social tools help you brainstorm bios, captions, and related copy. Tone and platform limits still matter—edit for your brand voice before posting.",
    whyBody:
      "Use these tools when you need a stronger first draft for bios, captions, prompts, or resumes—then edit so the voice sounds like you.",
    steps: [
      {
        title: "Describe the topic or paste a draft",
        body: "Clear inputs produce better suggestions. Mention audience and platform when the form asks.",
      },
      {
        title: "Generate and shortlist",
        body: "Pick lines that sound like you. Avoid copying generic phrases that other accounts may also use.",
      },
      {
        title: "Edit, then post elsewhere",
        body: "FreeToolsPro drafts copy; you publish in the social app. Check character limits and hashtag rules there.",
      },
    ],
    examples: [
      "Draft three caption variants for one product photo, then pick the one that matches your brand tone.",
      "Optimize a vague AI prompt with role and constraints before pasting it into your chat model.",
    ],
    useCases: [
      "Bio and caption brainstorming",
      "Prompt cleanup for AI writing sessions",
      "Resume and interview prep drafts",
      "YouTube and Instagram packaging helpers",
    ],
    tips: [
      "Always edit drafts for brand voice and factual claims.",
      "Check platform character limits before posting.",
      "Don’t paste private customer messages into public drafting tools.",
    ],
    benefits: [
      "Quick creative starting points",
      "Edit before you publish",
      "No account required to draft",
      "Related writing tools nearby",
    ],
    faqs: [
      {
        q: "Will using this guarantee more reach?",
        a: "No. Captions and bios help clarity; reach depends on platform algorithms, timing, and audience engagement.",
      },
      {
        q: "Can I use outputs commercially?",
        a: "Edit drafts to match your brand. You are responsible for claims, trademarks, and platform policy compliance in what you publish.",
      },
    ],
    privacyNote:
      "Do not paste private customer messages or unpublished campaign secrets into public drafting tools on shared devices.",
    trustBullets: [
      "Quick creative starting points",
      "Edit before you publish",
      "No account required to draft",
      "Related writing tools nearby",
    ],
  },

  "trending-tools": {
    howTitle: "Open the utility, try a sample, keep what works.",
    howBody:
      "Trending utilities cover everyday jobs—passwords, QR codes, converters, detectors, and similar helpers. Read each tool’s limits so you know when to switch to a specialized app.",
    whyBody:
      "Use trending utilities for everyday tasks like passwords, QR codes, and converters when you need a quick helper without installing another app.",
    steps: [
      {
        title: "Start with a safe sample",
        body: "Test with non-sensitive data first so you understand options before using real credentials or documents.",
      },
      {
        title: "Configure and generate",
        body: "Adjust settings, review the live output, and copy or download when ready.",
      },
      {
        title: "Use responsibly",
        body: "Password and security-related tools are aids only. Follow your organization’s security policies for production secrets.",
      },
    ],
    examples: [
      "Generate a strong password with length and symbol options, copy it into your password manager—not a plain text note.",
      "Create a QR code for a URL, scan it with your phone, then confirm the destination before printing stickers.",
    ],
    useCases: [
      "Everyday password and QR generation",
      "Unit and currency conversion checks",
      "Quick color and design experiments",
      "Light content checks before a deeper review",
    ],
    tips: [
      "Never store production passwords only in a browser tab history.",
      "Verify QR destinations before printing or sharing.",
      "Read each tool’s limits when results look “too perfect.”",
    ],
    benefits: [
      "Popular utilities in one catalog",
      "Fast try-before-you-commit flow",
      "Clear free access for standard use",
      "Browse related tools anytime",
    ],
    faqs: [
      {
        q: "Why is this tool in Trending?",
        a: "Trending groups popular everyday utilities. Availability can grow over time as we add more high-demand tools.",
      },
      {
        q: "Is every trending tool fully offline?",
        a: "Many are browser-local; some need a network call. The tool page and Privacy Policy describe the general model.",
      },
    ],
    privacyNote:
      "Use non-production samples when exploring new utilities. Never paste live production passwords into experimental pages.",
    trustBullets: [
      "Popular utilities in one catalog",
      "Fast try-before-you-commit flow",
      "Clear free access for standard use",
      "Browse related tools anytime",
    ],
  },
};

export function getCategoryHowTo(category) {
  return CATEGORY_HOW_TO[category] || null;
}
