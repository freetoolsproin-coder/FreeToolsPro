import { useState } from "react";
import Seo from "../../components/Seo";

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <>

      <Seo page="metatagGenerator" />
      <main className="min-h-screen bg-green bg-gray-50 flex justify-center items-center px-4">
        <Seo
          title="Meta Tag Generator – Free SEO Tool"
          description="Generate SEO-friendly meta tags instantly"
        />

        <section className="bg-white max-w-xl w-full p-6 rounded-2xl shadow-2xl">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Meta Tag Generator
          </h1>

          <input
            placeholder="Page Title"
            className="w-full border p-3 rounded mb-3"
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Meta Description"
            className="w-full border p-3 rounded mb-4"
            onChange={(e) => setDesc(e.target.value)}
          />

          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {`<title>${title}</title>
            <meta name="description" content="${desc}" />`}
          </pre>
        </section>
      </main>

    </>
  );
}
