import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { getToolGeoContent } from "../utils/geoContent";
import { buildDefinedTermSchema } from "../seo/schemaFactory";
import { BRAND, absoluteUrl } from "../seo/brand";

/**
 * Answer-first summary + definition for GEO (generative engines & featured snippets).
 * Renders human-readable copy and DefinedTerm JSON-LD.
 */
export default function GeoSummary({
  path,
  name,
  description,
  whatItDoes,
  className = "",
}) {
  const geo = getToolGeoContent(path, { name, description, whatItDoes });
  if (!geo.summary) return null;

  const termSchema = buildDefinedTermSchema({
    name: geo.name,
    description: geo.definition,
    url: absoluteUrl(geo.path),
  });

  return (
    <>
      {termSchema ? (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(termSchema)}</script>
        </Helmet>
      ) : null}

      <section
        className={`geo-summary ${className}`.trim()}
        aria-labelledby="geo-summary-heading"
        data-geo="summary"
      >
        <p className="geo-summary__eyebrow">In short</p>
        <h2 id="geo-summary-heading" className="geo-summary__title">
          {geo.name}
        </h2>
        <p className="geo-summary__answer" data-speakable="true">
          {geo.summary}
        </p>
        <p className="geo-summary__definition">
          <span className="geo-summary__label">Definition</span>
          <dfn>{geo.name}</dfn>
          {" — "}
          {geo.definition}
        </p>
        <p className="geo-summary__entity">
          Provided by{" "}
          <Link to="/about" className="geo-summary__link">
            {BRAND.name}
          </Link>
          {geo.related.length > 0 ? (
            <>
              {" · "}
              Related:{" "}
              {geo.related.map((tool, i) => (
                <span key={tool.id}>
                  {i > 0 ? ", " : null}
                  <Link to={tool.path} className="geo-summary__link">
                    {tool.name}
                  </Link>
                </span>
              ))}
            </>
          ) : null}
        </p>
      </section>
    </>
  );
}
