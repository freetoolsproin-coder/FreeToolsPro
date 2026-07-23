import { Helmet } from "react-helmet-async";
import { generateWebsiteSchema } from "../seo/schemaFactory";

/** Sitewide Organization + WebSite + platform WebApplication JSON-LD. */
export default function SoftwareSchema() {
  const schema = generateWebsiteSchema();

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
