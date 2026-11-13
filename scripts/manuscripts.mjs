import { emiBook, sipBook, savingsBook, cardBook } from "./parts-money.mjs";
import { taxBook, salaryBook, gstBook } from "./parts-tax.mjs";
import { studentBook, emailBook, filesBook, seoBook, codeBook, privacyBook, everydayBook, youtubeBook } from "./parts-rest.mjs";
import { volumeFor } from "./parts-volume.mjs";

const BUILDERS = {
  "emi-and-home-loans": emiBook,
  "sip-versus-lumpsum": sipBook,
  "ppf-fd-and-nps": savingsBook,
  "paying-off-a-credit-card": cardBook,
  "income-tax-for-salaried-people": taxBook,
  "salary-pf-and-take-home": salaryBook,
  "gst-for-small-invoices": gstBook,
  "cgpa-attendance-and-exams": studentBook,
  "emails-and-meeting-notes": emailBook,
  "images-and-pdf-files": filesBook,
  "seo-for-a-small-website": seoBook,
  "json-csv-and-everyday-code": codeBook,
  "passwords-and-browser-privacy": privacyBook,
  "percentages-units-and-dates": everydayBook,
  "youtube-titles-and-thumbnails": youtubeBook,
};

function toolsChapter(book) {
  return {
    title: "Try the numbers on the site",
    paragraphs: [
      "The tools below are the ones that match this book. They run in your browser on FreeToolsPro. Type your own figures after you have followed one worked file with a pencil. The book is the shape. The tool is your data.",
    ],
    sections: (book.related || []).map((tool) => ({
      heading: tool.name,
      paragraphs: [`Open freetoolspro.in${tool.path}. Nothing you type is uploaded to the site. If the tool's result and this book disagree by more than rounding, trust the tool's labels and re-read which input you used.`],
    })),
  };
}

export function manuscriptFor(book) {
  const build = BUILDERS[book.slug];
  if (!build) throw new Error(`No manuscript for ${book.slug}`);
  const chapters = build();
  chapters.push(...volumeFor(book.slug));
  chapters.push(toolsChapter(book));
  return { chapters };
}
