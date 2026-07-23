import { Helmet } from "react-helmet-async";
import { buildFaqSchema } from "../seo/schemaFactory";

/** FAQPage JSON-LD. Prefer pageUrl so @id matches the tool canonical. */
export default function FaqSchema({ faqs = [], pageUrl }) {
  const schema = buildFaqSchema(faqs, pageUrl);
  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
