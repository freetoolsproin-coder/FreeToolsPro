import { SITE } from "../data/site.js";

// Search engines and AI assistants are welcome. Each AI company uses separate crawlers for
// search answers, live fetches when a user asks about a page, and model training.
// To opt out of AI *training* only, change "Allow: /" to "Disallow: /" in the TRAINING group;
// search and answer bots can stay allowed so the site is still cited in ChatGPT, Claude and Perplexity.
const AI_SEARCH = [
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User", // ChatGPT fetching a page a user asked about
  "Claude-SearchBot", // Claude search index
  "Claude-User", // Claude fetching a page a user asked about
  "PerplexityBot", // Perplexity search index
  "Perplexity-User", // Perplexity fetching a page a user asked about
  "Bingbot", // Bing, Copilot and partners
  "DuckAssistBot",
  "Applebot", // Siri, Spotlight and Apple Intelligence answers
  "Amazonbot", // Alexa answers
  "MistralAI-User", // Le Chat fetching a page a user asked about
  "Meta-ExternalFetcher", // Meta AI fetching a page a user asked about
];
const TRAINING = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "Meta-ExternalAgent"];

const group = (agents, rule) => agents.map((a) => `User-agent: ${a}`).join("\n") + `\n${rule}\n`;

export const GET = () =>
  new Response(
    [
      "# FreeToolsPro: free browser-based tools. All public pages may be crawled.",
      `# Plain-text guide for AI assistants: ${SITE.url}/llms.txt (full catalogue: ${SITE.url}/llms-full.txt)`,
      "",
      group(["*"], "Allow: /"),
      "# AI search and answer engines",
      group(AI_SEARCH, "Allow: /"),
      "# AI model training",
      group(TRAINING, "Allow: /"),
      `Sitemap: ${SITE.url}/sitemap.xml`,
      "",
    ].join("\n"),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
