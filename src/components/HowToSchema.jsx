import { Helmet } from "react-helmet-async";
import { buildHowToSchema } from "../seo/schemaFactory";

/** HowTo JSON-LD for tool step-by-step instructions. */
export default function HowToSchema({ name, description, url, steps = [] }) {
  const schema = buildHowToSchema({ name, description, url, steps });
  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
