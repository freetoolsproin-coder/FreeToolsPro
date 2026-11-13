// Extra copy for each category hub, shown below the tool grid: a short guide that helps people pick the
// right tool, and a few questions that also become FAQPage JSON-LD. Keyed by category id.
// Links use [label](/path) and must point at a tool or hub that exists (checked in scripts/check-catalog.mjs).
// Keep every claim true for the tools as built; update alongside SITE.updated when rates or rules change.

export const HUB_CONTENT = {
  finance: {
    heading: "Which money calculator do you need?",
    paras: [
      "For a loan you are about to take, start with the [EMI calculator](/calculators/emi-calculator): it shows the monthly instalment, total interest and a year-by-year amortization schedule. The [home loan](/loan-calculators/home-loan-calculator), [car loan](/loan-calculators/car-loan-calculator) and [personal loan](/loan-calculators/personal-loan-calculator) calculators add the details that matter for each one, such as down payment and processing fee. If you already have a loan, the [prepayment calculator](/loan-calculators/loan-prepayment-calculator) shows how much interest and tenure a part-payment saves.",
      "For saving and investing, the [SIP calculator](/calculators/sip-calculator) and [lumpsum calculator](/mutual-fund-tools/lumpsum-calculator) project mutual fund growth at the return you assume, while the [FD](/banking-tools/fd-calculator), [RD](/banking-tools/rd-calculator) and [PPF](/calculators/ppf-calculator) calculators use the interest rate you enter or the current scheme rate. For long-term plans, work backwards with the [goal planner](/mutual-fund-tools/goal-planner), [retirement planner](/retirement-tools/retirement-planner) or [FIRE calculator](/mutual-fund-tools/fire-calculator), and use the [inflation calculator](/calculators/inflation-calculator) to see what a target will really cost.",
    ],
    faqs: [
      ["Are the returns shown by the SIP and lumpsum calculators guaranteed?", "No. Mutual fund returns vary from year to year and can be negative. The calculators project growth at a steady rate you choose, which is useful for planning but is not a forecast. FD, RD and PPF figures are firmer because their rates are fixed for the period or set by the government."],
      ["Why does my bank's EMI differ slightly from the calculator?", "Banks may round the rate, count interest daily, add processing fees or insurance to the loan, or start the first EMI part-way through a month. The calculator uses the standard reducing-balance EMI formula, so small differences of a few rupees are normal."],
      ["Can I share a calculation?", "Yes. Each calculator has a 'Copy link with these values' option. The link opens the same calculator with your numbers filled in, and nothing is stored on our side."],
    ],
  },

  pdf: {
    heading: "Picking the right PDF tool",
    paras: [
      "Most PDF jobs come down to a few steps. To turn scans or phone photos into one document, use [JPG to PDF](/pdf-tools/jpg-to-pdf). To combine several PDFs for an application, use the [PDF merger](/pdf-tools/pdf-merger) and put the main form first. To send only some pages, [split the PDF](/pdf-tools/pdf-splitter) by page ranges, and to fix the order, [reorder the pages](/pdf-tools/reorder-pdf-pages) or [rotate](/pdf-tools/rotate-pdf) the sideways ones.",
      "When a portal rejects a file for being too large, try [Compress PDF](/pdf-tools/compress-pdf). If you need a page as an image, for example to post it or paste it into a slide, use [PDF to JPG](/pdf-tools/pdf-to-jpg); to copy the words out, use [PDF to text](/pdf-tools/pdf-to-text). Every tool reads and writes the file inside your browser, so ID proofs and bank statements are never uploaded.",
    ],
    faqs: [
      ["Do these PDF tools upload my files?", "No. The PDF is opened and saved by your browser on your own device. Nothing is sent to a server, which is why there is no upload wait and no file is left behind on our side."],
      ["Can I edit a password-protected PDF?", "You need to remove the password first, using the app that created the file or one that knows the password. Once the file opens without a password, it can be merged, split or rotated here."],
      ["Is there a file size or page limit?", "There is no limit set by a server. Very large files depend on your device's memory, so a phone may struggle with a file that a laptop handles easily."],
    ],
  },

  tax: {
    heading: "Working out tax and take-home pay",
    paras: [
      "The [income tax calculator](/tax-tools/income-tax-calculator) applies the FY 2026-27 slabs, the standard deduction, the 87A rebate and cess, and shows how each part of the tax is worked out. If you are not sure which regime suits you, the [old vs new regime calculator](/tax-tools/old-vs-new-tax-regime) puts both side by side using your actual deductions. The new regime is the default, so if you claim large deductions such as home loan interest, 80C investments and HRA, it is worth checking whether the old regime still saves you money.",
      "For salary questions, the [in-hand salary calculator](/salary-hr/in-hand-salary-calculator) turns CTC into monthly take-home pay, the [HRA calculator](/tax-tools/hra-calculator) works out the exempt part of house rent allowance under the old regime, and the [EPF](/salary-hr/pf-calculator) and [gratuity](/calculators/gratuity-calculator) calculators estimate what you build up over the years. Businesses can add or remove GST on a price with the [GST calculator](/business-tools/gst-calculator).",
    ],
    faqs: [
      ["Which financial year do these calculators use?", "FY 2026-27 (assessment year 2027-28). The slabs, rebate and limits are reviewed when the rules change, and the date each page was last reviewed is shown at the bottom of the page."],
      ["Is income up to ₹12 lakh tax-free under the new regime?", "Under the new regime, the 87A rebate cancels the tax when taxable income is ₹12 lakh or less. For salaried people, the ₹75,000 standard deduction means a salary of about ₹12.75 lakh can be effectively tax-free. Income just above the limit gets marginal relief."],
      ["Can I file my return using these results?", "Use them to plan and to check your payslip, Form 16 or advance tax. They are estimates, not tax advice. For the actual return, rely on the income tax portal and, where your situation is complex, a chartered accountant."],
    ],
  },

  image: {
    heading: "Getting an image to the right size and format",
    paras: [
      "Forms and websites usually ask for one of three things: a smaller file, exact pixel dimensions, or a particular format. Use the [image compressor](/image-tools/image-compressor) to bring a photo under a size limit such as 50 KB or 200 KB by entering a target size, the [image resizer](/image-tools/image-resizer) to set width and height in pixels or centimetres, and the [image converter](/image-tools/image-format-converter) to switch between JPG, PNG and WebP. The [cropper](/image-tools/image-cropper) trims a photo to a square, portrait, widescreen or 35 × 45 mm passport ratio.",
      "JPG suits photos and keeps files small, PNG keeps sharp edges and transparency for logos and screenshots, and WebP is often smaller than both for use on websites. For a site you are building, the [favicon generator](/image-tools/favicon-generator) makes browser and Apple touch icons, and [image to Base64](/image-tools/image-to-base64) produces a data URI for small inline images. Every image is processed on your device and never uploaded.",
    ],
    faqs: [
      ["How do I reduce a photo to under a set size, like 100 KB?", "Open the image compressor, add the photo and enter the target size in KB, or lower the quality and maximum width yourself while watching the file size, then download it. Reducing the pixel size has the biggest effect on large phone photos."],
      ["Will compressing a JPG make it look worse?", "JPG compression removes detail you are unlikely to notice at moderate settings. At very low quality you will see blocky areas, so check the preview before downloading. Each re-save of a JPG loses a little more, so keep the original."],
      ["Are my images uploaded anywhere?", "No. Images are read and processed by your browser on your own device. Nothing is sent to a server."],
    ],
  },

  everyday: {
    heading: "Quick answers for dates, percentages and units",
    paras: [
      "For anything involving dates, choose by the question you are asking. The [age calculator](/calculators/age-calculator) gives an exact age in years, months and days. The [date difference calculator](/developer-tools/date-difference) counts the days between two dates, the [working days calculator](/calculators/working-days-calculator) leaves out weekends, including the 2nd and 4th Saturdays that Indian banks take off, and [add or subtract dates](/calculators/date-add-subtract-calculator) finds the date a number of days or months away. For clock times, use the [time duration calculator](/calculators/time-duration-calculator).",
      "The [percentage calculator](/calculators/percentage-calculator) handles 'what is X% of Y', percentage change and marks percentage. The [unit converter](/trending-tools/unit-converter) covers length, weight, area and temperature, including Indian land units. For health numbers, the [BMI calculator](/calculators/bmi-calculator) and [calorie calculator](/calculators/calorie-calculator) give estimates for adults that are a starting point for a conversation with a doctor, not a diagnosis.",
    ],
    faqs: [
      ["Does the date difference include the end date?", "By default the count runs from the start date up to the end date without counting the end date itself. Turn on the option to include the end date when you need both days counted, for example for a leave period."],
      ["How do I calculate a percentage increase?", "Subtract the old value from the new value, divide by the old value and multiply by 100. The percentage calculator's change mode does this for you and also shows a decrease as a negative percentage."],
      ["Which BMI ranges are used?", "The BMI calculator shows both the WHO ranges and the lower cut-offs often used for Asian adults, because health risks tend to rise at a lower BMI in South Asian populations."],
    ],
  },

  text: {
    heading: "Cleaning up and measuring text",
    paras: [
      "The [word counter](/text-tools/word-counter) and [character counter](/text-tools/character-counter) are for writing to a limit: an essay word count, a social post, an SMS or a meta description. The [case converter](/text-tools/case-converter) fixes text typed in capitals or changes it to title case, sentence case and the forms programmers use.",
      "For lists and data copied from spreadsheets or emails, the [duplicate line remover](/text-tools/duplicate-line-remover), [remove empty lines](/text-tools/remove-empty-lines), [sort lines](/text-tools/sort-lines-az) and [trim text](/text-tools/trim-text) tools each do one clean-up job, and you can run them one after another. Everything you paste stays in your browser tab.",
    ],
    faqs: [
      ["How are words counted?", "A word is any run of letters or numbers separated by spaces or punctuation, which matches the way most word processors count. Hyphenated words count as one word."],
      ["Can I remove duplicates while keeping the original order?", "Yes. The duplicate line remover keeps the first time each line appears and removes later copies, so the order of the remaining lines does not change."],
      ["Is the text I paste saved or sent anywhere?", "No. The tools work on the text inside your browser and do not send it to a server."],
    ],
  },

  student: {
    heading: "The numbers students check most",
    paras: [
      "Universities and boards convert grades differently, so pick the formula that matches yours. The [CGPA to percentage calculator](/student-tools/cgpa-to-percentage-calculator) includes the CBSE method (CGPA × 9.5), VTU's formula and a custom multiplier. The [CGPA calculator](/student-tools/cgpa-calculator) combines semester SGPAs weighted by credits and tells you what you need next semester to reach a target, while the [GPA calculator](/calculators/gpa-calculator) works out a semester from subject grades and credits.",
      "To stay eligible for exams, the [attendance calculator](/student-tools/attendance-calculator) shows how many classes you must attend to reach a limit such as 75%, or how many you can miss. The [marks and grade calculator](/student-tools/marks-grade-calculator) converts marks to a percentage and grade, and the [exam countdown](/student-tools/exam-countdown) and [study hours planner](/student-tools/study-hours-planner) help you turn the time left into a plan.",
    ],
    faqs: [
      ["Which CGPA to percentage formula should I use?", "Use the one your board or university states on the marksheet or in its regulations. CBSE uses CGPA × 9.5, many universities multiply by 10, and some, such as VTU, subtract a fixed amount first. If an application asks for a percentage, check whether it names a formula."],
      ["How is the attendance needed worked out?", "The calculator compares classes attended with classes held. To reach a target such as 75%, it finds how many more classes in a row you need to attend; if you are above the target, it shows how many you could miss and still stay at or above it."],
      ["Do I need an account to save results?", "No account is needed. Calculators update as you type, and you can copy a link with your values to come back to them."],
    ],
  },

  study: {
    heading: "Turning your notes into revision material",
    paras: [
      "Start by pasting a chapter or lecture notes into the [notes summarizer](/ai-study-tools/notes-summarizer) to get the key points, Cornell-style notes and a glossary. Then use the same notes to make [flashcards](/ai-study-tools/flashcard-generator) for spaced repetition and a [practice quiz](/ai-study-tools/quiz-generator) with multiple-choice and true/false questions. When a topic does not make sense, the [concept explainer](/ai-study-tools/concept-explainer) breaks it down in simpler language.",
      "Finally, put it on a calendar with the [revision plan generator](/ai-study-tools/revision-plan-generator), which spreads topics across the days before your exam and brings them back at increasing intervals. The tools work from the material you give them, so the better your notes, the better the output; check anything important against your textbook.",
    ],
    faqs: [
      ["Are my notes sent to an AI service?", "No. The language processing runs in your browser on your own device, so your notes are not uploaded and no account is needed."],
      ["How accurate are the generated questions and summaries?", "They are built only from the text you paste, so they reflect your notes, including any mistakes in them. Treat them as a study aid and check key facts against your textbook or teacher's material."],
      ["What is spaced repetition?", "It is a way of reviewing material at increasing gaps, such as one day, three days and a week later, just before you would forget it. The flashcard tool and the revision planner both use this idea."],
    ],
  },

  creator: {
    heading: "From finished video to published post",
    paras: [
      "Every platform crops images differently, so begin with the right size. The [YouTube thumbnail maker](/creator-tools/youtube-thumbnail-maker) works on a 1280×720 canvas, the [social media image resizer](/image-tools/social-media-image-resizer) fits one photo to Instagram, YouTube, X, LinkedIn and Facebook sizes, and the [Open Graph image generator](/creator-tools/og-image-generator) makes the 1200×630 card shown when a link is shared.",
      "Before publishing, check your [YouTube title and description](/creator-tools/youtube-title-description-helper) against length limits and chapter formatting, and clean up tags with the [hashtag organizer](/creator-tools/hashtag-organizer). The [YouTube money calculator](/social-media-tools/youtube-money-calculator) gives a rough earnings range from views and RPM; real earnings vary a lot by niche, audience country and season.",
    ],
    faqs: [
      ["What size should a YouTube thumbnail be?", "1280×720 pixels, a 16:9 ratio. Keep text large and away from the bottom-right corner, where YouTube shows the video length."],
      ["How accurate is the YouTube earnings estimate?", "It multiplies views by the RPM you enter. RPM differs widely between channels, so use figures from your own YouTube Studio analytics where you can. The result is a planning range, not a promise."],
      ["Are my images uploaded?", "No. Thumbnails and resized images are drawn in your browser and downloaded directly to your device."],
    ],
  },

  developer: {
    heading: "Formatting, converting and debugging data",
    paras: [
      "Paste an API response into the [JSON formatter](/developer-tools/json-formatter) to make it readable, or the [JSON validator](/json-tools/json-validator) to find the exact line of a syntax error. To move data between formats, use [JSON to CSV](/json-tools/json-to-csv) for spreadsheets, [CSV to JSON](/developer-tools/csv-to-json), [JSON to YAML](/developer-tools/json-to-yaml) and [YAML to JSON](/developer-tools/yaml-to-json) for config files, or [JSON to TypeScript](/json-tools/json-to-typescript) to generate interfaces. [JSON compare](/json-tools/json-compare) lists what changed between two versions.",
      "For debugging, the [regex tester](/developer-tools/regex-tester) highlights matches as you type, the [JWT decoder](/developer-tools/jwt-decoder) shows a token's header and claims, and the [timestamp converter](/developer-tools/timestamp-converter) turns Unix time into a readable date in IST or UTC. The [SQL formatter](/developer-tools/sql-formatter) and the HTML, CSS and JavaScript minifiers round out the set. Everything runs locally, so it is safe for tokens and data you would not paste into a server.",
    ],
    faqs: [
      ["Is it safe to paste API keys or JWTs here?", "The tools run in your browser and do not send what you paste to a server. Even so, treat production secrets with care and rotate any key that has been exposed somewhere it should not be."],
      ["Does the JWT decoder verify the signature?", "No. Decoding only reads the header and payload, which are Base64URL-encoded and readable by anyone. Verifying a signature needs the secret or public key and should happen on your server."],
      ["Why does JSON to CSV flatten nested objects?", "CSV is a flat table, so nested fields are turned into column names joined by dots, such as address.city. Arrays of objects work best: each object becomes a row."],
    ],
  },

  encoding: {
    heading: "Encoding is not encryption",
    paras: [
      "[Base64 encode](/encoding-tools/base64-encode) and [decode](/encoding-tools/base64-decode), [URL encode](/encoding-tools/url-encode) and [decode](/encoding-tools/url-decode), and [HTML escape](/html-tools/html-escape) change how data is written so it survives being sent through email, URLs or web pages. Anyone can reverse them, so they do not protect anything. The [URL parser](/http-tools/url-parser) splits a link into its parts and decodes the query string.",
      "Hashes are one-way: the [SHA-256 generator](/hash-tools/sha256-generator) and [MD5 generator](/hash-tools/md5-generator) produce a fingerprint for checking that a file or text has not changed. MD5 is fine for checksums but should not be used for security. For accounts, use the [password generator](/trending-tools/password-generator) and test existing passwords with the [password strength checker](/security-tools/password-strength-checker); the [UUID generator](/hash-tools/uuid-generator) creates unique IDs for databases and testing. All of these use your browser's built-in functions.",
    ],
    faqs: [
      ["Is Base64 a safe way to hide a password?", "No. Base64 is an encoding that anyone can decode in a second. To protect a secret, use proper encryption, and to store passwords, use a slow password-hashing method on the server."],
      ["Are generated passwords sent anywhere?", "No. Passwords are generated with your browser's cryptographic random number generator and are never sent to a server or stored."],
      ["What is the difference between UUID v4 and v7?", "Version 4 is completely random. Version 7 starts with a timestamp, so IDs created later sort after earlier ones, which can make database indexes more efficient."],
    ],
  },

  writing: {
    heading: "Writing faster without giving up your drafts",
    paras: [
      "The [text summarizer](/writing-tools/text-summarizer) pulls the key sentences out of an article or report, and the [meeting notes organizer](/writing-tools/meeting-notes-organizer) turns rough notes into decisions, action items and owners. For job hunting, the [email and cover letter writer](/writing-tools/email-writer) starts you from a clear structure, and the [resume bullet improver](/writing-tools/resume-bullet-improver) suggests stronger action verbs and points out where a number would show impact.",
      "If you use ChatGPT, Claude or Gemini, the [prompt builder](/writing-tools/prompt-builder) helps you write a prompt with a role, context, constraints and the output format you want. These helpers follow clear rules in your browser rather than sending your text to an AI service, so read the result and add the details only you know.",
    ],
    faqs: [
      ["Do these writing tools use AI?", "They work with rules that run in your browser, not with a remote AI model. That keeps your drafts private and the results predictable. The prompt builder creates prompts for you to use in an AI assistant of your choice."],
      ["Can I use the cover letter template as it is?", "Use it as a starting point. Replace the placeholders with specific achievements and details about the role, because a letter that could be sent to any company is easy for a recruiter to spot."],
      ["Is my text stored?", "No. What you type stays in your browser tab and is not sent to a server."],
    ],
  },

  seo: {
    heading: "Checking a page before you publish it",
    paras: [
      "Start with what searchers see. The [SERP snippet preview](/seo-tools/serp-snippet-preview) and the [meta title and description checker](/seo-tools/meta-title-description-checker) show whether your title and description will be cut off on desktop and mobile, and the [meta tag generator](/developer-tools/meta-tag-generator) writes the tags for you. For link previews on WhatsApp, X and LinkedIn, generate tags with the [Open Graph generator](/seo-tools/open-graph-generator) and check them in the [Open Graph preview](/seo-tools/open-graph-preview).",
      "Then check what crawlers read. Build a robots.txt with the [robots.txt generator](/developer-tools/robots-generator), test URLs against it with the [robots.txt tester](/seo-tools/robots-txt-tester), and check your sitemap with the [sitemap validator](/seo-tools/sitemap-validator). The [canonical checker](/developer-tools/canonical-checker) and [HTTP header checker](/http-tools/http-header-checker) catch duplicate-URL and redirect problems that quietly hold pages back.",
    ],
    faqs: [
      ["How long should a title tag be?", "Google cuts titles by pixel width, which usually works out at about 50 to 60 characters. Put the most important words first so they show even if the end is cut off."],
      ["Does blocking a page in robots.txt remove it from Google?", "No. robots.txt stops crawling, not indexing, and a blocked page can still appear in results if other sites link to it. To keep a page out of search, allow crawling and add a noindex robots meta tag."],
      ["Is rel=canonical a command?", "It is a strong hint. Google usually follows it, but may choose a different URL if the signals conflict, for example when internal links, redirects and the sitemap point somewhere else."],
    ],
  },

  design: {
    heading: "CSS you can copy straight into your project",
    paras: [
      "Each generator shows a live preview and the exact CSS behind it. The [gradient generator](/trending-tools/gradient-generator) builds linear and radial gradients, the [box shadow generator](/css-tools/css-shadow-generator) layers soft or sharp shadows, and the [glassmorphism generator](/trending-tools/glassmorphism-generator) produces the frosted-glass look with backdrop blur.",
      "The [color picker](/trending-tools/color-picker) converts between HEX, RGB and HSL and checks the contrast between text and background colours, so you can tell whether a pairing is readable. For meta tags, Open Graph and robots.txt, see the [SEO tools](/seo-tools).",
    ],
    faqs: [
      ["Does glassmorphism work in every browser?", "The effect relies on backdrop-filter, which current versions of Chrome, Edge, Safari and Firefox support. In older browsers the panel shows the semi-transparent background without the blur."],
      ["What contrast ratio should text have?", "WCAG recommends at least 4.5:1 for normal text and 3:1 for large text. The color picker shows the ratio for the two colours you choose."],
      ["Can I use the generated CSS in commercial projects?", "Yes. The code is generated from your settings and is yours to use anywhere."],
    ],
  },
};

const LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

/** Splits "text [label](/path) more" into ["text ", { label, href }, " more"] for rendering. */
export function linkParts(text) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push({ label: m[1], href: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** The same text with link markup removed (for JSON-LD and plain-text outputs). */
export const plainText = (text) => text.replace(LINK, "$1");

/** Every internal link used in the hub copy, as [categoryId, href]. */
export const hubLinks = () =>
  Object.entries(HUB_CONTENT).flatMap(([id, c]) => [...c.paras, ...c.faqs.flat()].flatMap((t) => [...t.matchAll(LINK)].map((m) => [id, m[2]])));
