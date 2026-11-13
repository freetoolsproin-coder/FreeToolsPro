import { EBOOKS } from "../../data/ebooks.js";
import { BookOpen, Download } from "lucide-react";
import { CrumbBar } from "./Crumbs.jsx";

const TOPICS = [];
for (const book of EBOOKS) {
  if (!TOPICS.some((t) => t.cat === book.cat)) TOPICS.push({ cat: book.cat, topic: book.topic });
}

export function EbooksPage({ books }) {
  const bySlug = new Map(books.map((b) => [b.slug, b]));
  return (
    <div className="ebooks">
      <section className="hub-hero ebooks__hero">
        <div className="wrap">
          <CrumbBar trail={[["/", "Home"], [null, "Ebooks"]]} />
          <div className="hub-hero__in">
            <span className="hub-hero__icon">
              <BookOpen size={30} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div>
              <h1 className="hub-hero__title">{EBOOKS.length} Free eBooks</h1>
              <p className="hub-hero__lede">
                Original PDF books by Lalaji Prashanth Kumar, about 90 pages each, on money, tax, study, files and writing. Download any of them. No signup.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="wrap ebooks__body" aria-labelledby="ebooks-h">
        <h2 id="ebooks-h" className="visually-hidden">
          Downloadable ebooks
        </h2>
        <fieldset className="mix__filters">
          <legend className="visually-hidden">Show ebooks about</legend>
          <input type="radio" name="ebookcat" id="e-all" value="all" defaultChecked />
          <label htmlFor="e-all">
            All <span>{EBOOKS.length}</span>
          </label>
          {TOPICS.map((t) => (
            <span key={t.cat} className="mix__chip">
              <input type="radio" name="ebookcat" id={`e-${t.cat}`} value={t.cat} />
              <label htmlFor={`e-${t.cat}`} className={`cat-${t.cat}`}>
                {t.topic} <span>{EBOOKS.filter((b) => b.cat === t.cat).length}</span>
              </label>
            </span>
          ))}
        </fieldset>
        <ul className="ebooks__grid">
          {EBOOKS.map((book) => {
            const file = bySlug.get(book.slug);
            return (
              <li key={book.slug} className={`ebook cat-${book.cat}`}>
                <article className="ebook__card">
                  <div className="ebook__cover" aria-hidden="true">
                    <span className="ebook__topic">{book.topic}</span>
                    <strong>{book.title}</strong>
                  </div>
                  <div className="ebook__copy">
                    <h3>{book.title}</h3>
                    <p>{book.blurb}</p>
                    <p className="ebook__meta">
                      By Lalaji Prashanth Kumar
                      <br />
                      PDF
                      {file?.pages ? ` · ${file.pages} pages` : ""}
                      {file?.size ? ` · ${file.size}` : ""}
                    </p>
                    <a className="btn btn--primary btn--sm" href={`/ebooks/${book.slug}.pdf`} download>
                      <Download size={15} strokeWidth={2.2} aria-hidden="true" />
                      Download
                    </a>
                    {book.related?.length > 0 && (
                      <p className="ebook__related">
                        Related:{" "}
                        {book.related.map((tool, i) => (
                          <span key={tool.path}>
                            {i > 0 ? ", " : ""}
                            <a href={tool.path}>{tool.name}</a>
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
