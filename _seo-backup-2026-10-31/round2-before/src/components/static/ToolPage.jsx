// Static parts of a tool page: heading block above the island, and the article below it.
import { SITE } from "../../data/site.js";
import { ToolIcon } from "./icons.jsx";
import { CrumbBar } from "./Crumbs.jsx";
import { GUIDES } from "../../data/guides/index.js";
import { AUTHOR } from "../../data/author.js";

const PRIVATE = {
  image: "Runs on your device. Images are never uploaded.",
  pdf: "Runs on your device. Files are never uploaded.",
  text: "Runs in your browser. Nothing you paste is sent anywhere.",
  calc: "Free, no sign-up. Results update as you type.",
  builder: "Live preview. Copy the code when it looks right.",
  unit: "Instant conversion as you type.",
  qr: "Static codes: no tracking, no expiry.",
  canvas: "Drawn on your device. Images are never uploaded.",
  study: "Runs in your browser. Your notes are never uploaded, and nothing needs an account.",
};

const STEPS = {
  calc: (t) => [
    "Enter your numbers in the boxes, or drag the sliders.",
    "Read the result on the right. It updates as you type.",
    t.id.includes("tax") || t.id.includes("salary") ? "Compare it with your payslip or Form 16, and adjust deductions to match." : "Open the year-by-year table, if shown, to see how the numbers change over time.",
    "Use 'Copy link with these values' to save the calculation or send it to someone.",
  ],
  text: (t) => [
    t.id === "lorem-ipsum-generator" || t.id === "uuid-generator" || t.id === "password-generator" ? "Choose the options you need." : "Paste your text into the input box, or open a file from your device.",
    "Adjust the options. The result updates instantly.",
    "Copy the result, or download it as a file where offered.",
  ],
  builder: () => ["Adjust the settings.", "Check the live preview.", "Copy the generated code into your page or stylesheet."],
  image: (t) => [`Choose ${t.id === "image-cropper" || t.id === "image-to-base64" || t.id === "favicon-generator" ? "an image" : "one or more images"}, or drop them onto the box.`, "Adjust the settings. The preview and file size update straight away.", "Download the result."],
  pdf: (t) => [t.id === "jpg-to-pdf" ? "Choose your images and put them in order." : "Choose your PDF file" + (t.id === "pdf-merger" ? "s and put them in order." : "."), "Set the options.", `Press "${{ "pdf-merger": "Merge PDFs", "pdf-splitter": "Split PDF", "rotate-pdf": "Rotate and save", "jpg-to-pdf": "Create PDF", "pdf-to-jpg": "Convert pages" }[t.id]}". The new file downloads automatically.`],
  unit: () => ["Pick a category, such as Area or Weight.", "Type a value in any unit's box.", "Read the same value in every other unit."],
  qr: () => ["Choose what the code is for: a link, UPI payment, Wi-Fi or text.", "Fill in the details and pick colours.", "Scan the preview with your phone to test it, then download PNG or SVG."],
  canvas: () => ["Add an image if you want one.", "Type your text and adjust the layout and colours.", "Download the finished image."],
  study: () => ["Paste your notes or open a file.", "Adjust the options.", "Study the result, then copy, print or export it."],
};

export function ToolHead({ tool, cat }) {
  return (
    <>
    <CrumbBar className="crumbbar--tool" trail={[["/", "Home"], [cat.path, cat.name], [null, tool.name]]} />
    <div className="tool-head">
      <h1 className={`tool-head__title cat-${tool.cat}`}>
        <span className="tool-head__icon">
          <ToolIcon tool={tool} size={26} />
        </span>
        {tool.name}
      </h1>
      <p className="tool-head__lede">{tool.description}</p>
      <p className="tool-head__note">{PRIVATE[tool.engine]}</p>
      <span hidden data-recent-tool={JSON.stringify({ n: tool.name, p: tool.path, c: tool.cat })} />
    </div>
    </>
  );
}

/** The "How to use it" steps for a tool: its own list, or the default for its engine. */
export function stepsFor(tool) {
  return tool.steps || STEPS[tool.engine](tool);
}

export function ToolArticle({ tool, cat, related }) {
  const steps = stepsFor(tool);
  const guide = GUIDES[tool.id];
  return (
    <div className="tool-body">
      <article className="prose">
        <h2>About this tool</h2>
        <p>{tool.intro}</p>
        {guide && (
          <section className="guide" aria-labelledby="guide-h">
            <h2 id="guide-h">{guide[0]}</h2>
            {guide.slice(1).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </section>
        )}
        <h2 id="how-to">How to use it</h2>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        <h2>Questions</h2>
        <div className="faq">
          {tool.faqs.map(([q, a]) => (
            <details key={q} className="faq__item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        <p className="muted small">
          Last reviewed {new Date(SITE.updated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} by <a href="/about#author">{AUTHOR.name}</a>.
          {tool.engine === "calc" ? " Results are estimates for planning. Check important figures with your bank, employer or a qualified adviser." : ""}
        </p>
      </article>
      <aside className="related" aria-labelledby="related-h">
        <h2 id="related-h" className="related__h">
          Related tools
        </h2>
        <ul>
          {related.map((t) => (
            <li key={t.id}>
              <a href={t.path} className={`cat-${t.cat}`}>
                <span className="related__icon">
                  <ToolIcon tool={t} size={17} />
                </span>
                <span className="related__name">{t.name}</span>
                <span className="related__short">{t.short}</span>
              </a>
            </li>
          ))}
        </ul>
        <a className="related__all" href={cat.path}>
          Everything in {cat.name}
        </a>
      </aside>
    </div>
  );
}

export function toolJsonLd(tool, cat) {
  const url = SITE.url + tool.path;
  const appCat = { finance: "FinanceApplication", tax: "FinanceApplication", developer: "DeveloperApplication", encoding: "SecurityApplication", image: "MultimediaApplication", pdf: "BusinessApplication", design: "DesignApplication", study: "EducationalApplication", student: "EducationalApplication" }[tool.cat] || "UtilitiesApplication";
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.name,
      url,
      description: tool.description,
      applicationCategory: appCat,
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      publisher: { "@id": `${SITE.url}/#organization` },
      dateModified: SITE.updated,
      inLanguage: "en-IN",
      isPartOf: { "@id": `${SITE.url}/#website` },
      about: tool.short,
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `How to use the ${tool.name}`,
      description: tool.intro,
      totalTime: "PT2M",
      tool: { "@type": "HowToTool", name: tool.name },
      step: stepsFor(tool).map((text, i) => ({ "@type": "HowToStep", position: i + 1, name: `Step ${i + 1}`, text })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url + "/" },
        { "@type": "ListItem", position: 2, name: cat.name, item: SITE.url + cat.path },
        { "@type": "ListItem", position: 3, name: tool.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: tool.faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ];
}
