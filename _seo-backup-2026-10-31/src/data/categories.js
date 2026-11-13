// Category hubs, in priority order (most-used first). `path` is the hub URL; tools keep their own legacy URLs.
// `short` is the label in the top navigation, tool boxes and filter chips. `nav: "main"` shows the link in the
// header bar; "more" puts it under the header's More menu (on phones every section is in the scrolling row).
export const CATEGORIES = [
  {
    id: "finance",
    short: "Money",
    nav: "main",
    path: "/finance-calculators",
    name: "Money & loans",
    title: "Free Finance Calculators: EMI, SIP, FD, PPF, Loans | FreeToolsPro",
    description:
      "Free EMI, SIP, FD, RD, PPF, loan and retirement calculators with year-by-year tables. Built for Indian rupees, rates and schemes.",
    intro:
      "Plan loans, savings and investments with calculators that show the full schedule, not just one number. Rates and limits default to current Indian bank and scheme values, and you can change every input.",
  },
  {
    id: "pdf",
    short: "PDF",
    nav: "main",
    path: "/pdf-tools",
    name: "PDF tools",
    title: "Free PDF Tools: Merge, Split, Rotate, JPG to PDF | FreeToolsPro",
    description:
      "Merge, split and rotate PDFs, convert JPG to PDF and PDF to JPG. Free, no watermark, and your files never leave your device.",
    intro: "Common PDF jobs without an upload queue or a watermark. Your files are read and written inside your browser.",
  },
  {
    id: "tax",
    short: "Tax & salary",
    nav: "main",
    path: "/tax-salary-tools",
    name: "Tax & salary",
    title: "Income Tax, GST & Salary Calculators (FY 2026-27) | FreeToolsPro",
    description:
      "Income tax for FY 2026-27 under the new and old regimes, HRA, GST, in-hand salary, PF and gratuity calculators. Free, with slab-wise breakdowns.",
    intro:
      "Work out tax, take-home pay and statutory benefits using the slabs and limits for FY 2026-27 (AY 2027-28). Each calculator shows how it got the answer so you can check it against your payslip or Form 16.",
  },
  {
    id: "image",
    short: "Image",
    nav: "main",
    path: "/image-tools",
    name: "Image tools",
    title: "Free Image Tools: Compress, Resize, Convert, Crop | FreeToolsPro",
    description:
      "Compress, resize, crop and convert JPG, PNG and WebP images, make favicons and QR codes. Images are processed on your device and never uploaded.",
    intro: "Edit images without uploading them. Processing happens on your device, so even large batches are quick and private.",
  },
  {
    id: "everyday",
    short: "Everyday",
    nav: "more",
    path: "/everyday-calculators",
    name: "Everyday calculators",
    title: "Everyday Calculators: Age, Percentage, BMI, Dates, Units | FreeToolsPro",
    description:
      "Free age, percentage, BMI, calorie, date difference and unit conversion calculators. Instant answers on any device.",
    intro: "Quick answers for dates, percentages, health numbers and unit conversions, including Indian land units like gaj and guntha.",
  },
  {
    id: "text",
    short: "Text",
    nav: "main",
    path: "/text-tools",
    name: "Text tools",
    title: "Free Text Tools: Word Counter, Case Converter & More | FreeToolsPro",
    description:
      "Count words, change case, remove duplicate lines, sort, trim and clean text online. Free text tools that work as you type.",
    intro: "Clean up, count and reshape text as you type. Nothing you paste is sent anywhere; it stays in your browser tab.",
  },
  {
    id: "student",
    short: "Student",
    nav: "main",
    path: "/student-tools",
    name: "Student tools",
    title: "Student Calculators: CGPA, GPA, Marks, Attendance & Study Plan | FreeToolsPro",
    description:
      "Free CGPA, GPA, CGPA to percentage, marks, attendance, study-hours and exam countdown calculators for Indian schools and colleges. No sign-up.",
    intro:
      "Quick answers for the numbers students chase every term: your GPA and CGPA, percentage conversions, marks and grades, the attendance you need to stay eligible, a weekly study-hours plan and how many days are left before the exam.",
  },
  {
    id: "study",
    short: "AI Study",
    nav: "main",
    path: "/ai-study-tools",
    name: "AI Study",
    title: "AI Study Tools: Notes Summarizer, Flashcards, Quiz Maker | FreeToolsPro",
    description:
      "Free AI study tools: summarize notes, make flashcards and quizzes, explain concepts simply and build a revision timetable. Runs in your browser, no sign-up.",
    intro:
      "Paste your notes once and turn them into everything you need to revise: a summary and Cornell notes, flashcards with spaced repetition, a practice quiz, clear explanations of hard concepts and a day-by-day revision plan. The language engine runs on your device, so your notes stay private and every answer comes from your own material.",
  },
  {
    id: "creator",
    short: "Creator",
    nav: "more",
    path: "/creator-tools",
    name: "Creator tools",
    title: "Free Creator Tools: YouTube Thumbnail, Hashtags, Social Image Sizes | FreeToolsPro",
    description:
      "Make YouTube thumbnails and Open Graph images, resize photos for every social platform, check YouTube titles and organize hashtags. Free.",
    intro:
      "Everything between finishing a video or post and publishing it: the right image sizes, a thumbnail that reads on a phone, and titles, descriptions and hashtags that fit each platform's limits.",
  },
  {
    id: "developer",
    short: "Developer",
    nav: "main",
    path: "/developer-tools",
    name: "Developer tools",
    title: "Free Developer Tools: JSON, YAML, SQL, Regex, JWT | FreeToolsPro",
    description:
      "Format and validate JSON, convert JSON to CSV, XML, YAML and TypeScript, format SQL, test regex and decode JWTs. Free and private.",
    intro:
      "Formatters, converters and debuggers for the data you handle every day. Everything runs locally, so it is safe for API responses and tokens you would not paste into a server.",
  },
  {
    id: "encoding",
    short: "Encoding",
    nav: "more",
    path: "/encoding-tools",
    name: "Encoding & security",
    title: "Base64, URL Encode, Hash & Password Tools | FreeToolsPro",
    description:
      "Base64 and URL encode/decode, HTML escape, MD5 and SHA-256 hashes, UUIDs and strong password generation. Free, offline-capable tools.",
    intro: "Encode, decode, hash and generate secrets with tools that use your browser's built-in cryptography.",
  },
  {
    id: "writing",
    short: "Writing",
    nav: "more",
    path: "/writing-tools",
    name: "Writing helpers",
    title: "Free Writing Tools: Summarizer, Email Writer, Prompt Builder | FreeToolsPro",
    description:
      "Summarize text, draft emails and cover letters, organize meeting notes, build AI prompts and sharpen resume bullets. Free, private, no sign-up.",
    intro:
      "Helpers for the writing that eats up a working day. They run in your browser with clear rules rather than a hidden AI, so your drafts and notes never leave your device.",
  },
  {
    id: "seo",
    short: "SEO",
    nav: "main",
    path: "/seo-tools",
    name: "SEO tools",
    title: "Free SEO Tools: SERP Preview, Meta Tags, Robots.txt, Sitemap | FreeToolsPro",
    description:
      "Preview Google snippets, check meta title length, test robots.txt rules, validate sitemaps, and check Open Graph, canonical and HTTP headers. Free.",
    intro:
      "Check the tags and files search engines read before you publish. Paste your HTML, robots.txt, sitemap or response headers and get a clear list of what is right and what to fix.",
  },
  {
    id: "design",
    short: "CSS & design",
    nav: "more",
    path: "/seo-design-tools",
    name: "CSS & design",
    title: "CSS Generators: Gradient, Box Shadow, Glassmorphism & Color | FreeToolsPro",
    description:
      "CSS gradient, box shadow and glassmorphism generators and a colour picker with HEX, RGB and HSL conversion. Live previews, copy-ready code.",
    intro: "Generate CSS with a live preview, then copy the code straight into your project. For meta tags, Open Graph and robots.txt, see the SEO tools.",
  },
];

export const categoryById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
