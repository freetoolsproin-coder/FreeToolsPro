import { useState } from "react";
import { Tags } from "lucide-react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [author, setAuthor] = useState("");
  const [copied, setCopied] = useState(false);

  // Dynamically build the meta tag string
  const generatedCode = `<title>${title || "Page Title"}</title>
<meta name="description" content="${desc || "Page description goes here."}" />
${keywords ? `<meta name="keywords" content="${keywords}" />\n` : ""}<meta name="robots" content="${robots}" />${author ? `\n<meta name="author" content="${author}" />` : ""}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="metaTagGenerator" />

      <ToolHeroShell
        category="developer-tools"
        icon={Tags}
        title="Advanced Meta Tag Generator"
        subtitle="Create SEO-ready meta tags and preview how they appear on Google."
        formLabel="Generate"
        layout="stack"
        wide
      >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side: Inputs */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-5">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Configuration</h3>

              {/* Title Input */}
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <label className="font-medium text-gray-600">Page Title</label>
                  <span
                    className={`font-mono ${title.length > 60 ? "text-red-500" : "text-gray-400"}`}
                  >
                    {title.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g., My Awesome Website | Home"
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-blue-500 transition"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description Input */}
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <label className="font-medium text-gray-600">Meta Description</label>
                  <span
                    className={`font-mono ${desc.length > 160 ? "text-red-500" : "text-gray-400"}`}
                  >
                    {desc.length}/160
                  </span>
                </div>
                <textarea
                  placeholder="e.g., A brief description of your webpage that convinces users to click through from search results."
                  rows={3}
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-blue-500 transition"
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              {/* Keywords Input */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">
                  Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., web design, react, seo tools"
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-blue-500 transition"
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>

              {/* Advanced Settings Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">
                    Robots Directive
                  </label>
                  <select
                    className="w-full border border-gray-300 p-3 rounded-xl outline-none bg-white focus:border-blue-500 transition"
                    value={robots}
                    onChange={(e) => setRobots(e.target.value)}
                  >
                    <option value="index, follow">Index, Follow (Default)</option>
                    <option value="noindex, follow">Noindex, Follow</option>
                    <option value="index, nofollow">Index, Nofollow</option>
                    <option value="noindex, nofollow">Noindex, Nofollow</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">Author</label>
                  <input
                    type="text"
                    placeholder="e.g., John Doe"
                    className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-blue-500 transition"
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Right Side: Preview & Code Output */}
            <div className="space-y-6">
              {/* Google SERP Preview Panel */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                  Google Search Preview
                </h3>
                <div className="font-sans max-w-md">
                  <div className="text-xs text-[#202124] mb-1 truncate">
                    https://example.com <span className="text-[#70757a]">› page</span>
                  </div>
                  <div className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium leading-tight line-clamp-1 mb-1">
                    {title || "Please enter a page title"}
                  </div>
                  <div className="text-sm text-[#4d5156] leading-relaxed line-clamp-2 break-words">
                    {desc ||
                      "Please enter a meta description so search engine bots can understand your page content."}
                  </div>
                </div>
              </div>

              {/* Generated Code Output */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-700">Generated Meta Tags</h3>
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                      copied
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {copied ? "✓ Copied!" : "Copy Code"}
                  </button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm overflow-auto max-h-48 whitespace-pre-wrap">
                  {generatedCode}
                </pre>
              </div>
            </div>
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/meta-tag-generator" />
    </>
  );
}
