// The explanatory first part of each book. Practice material lives in ../books.
import { emiBook, sipBook, savingsBook, cardBook } from "./money.mjs";
import { taxBook, salaryBook, gstBook } from "./tax.mjs";
import { studentBook, emailBook, filesBook, seoBook, codeBook, privacyBook, everydayBook, youtubeBook } from "./rest.mjs";
import { volumeFor } from "./volume.mjs";

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

export function coreFor(book) {
  const build = BUILDERS[book.slug];
  if (!build) throw new Error(`No core chapters for ${book.slug}`);
  return [...build(), ...volumeFor(book.slug)];
}
