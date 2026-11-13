// One function, askJson(), that sends a prompt to the AI provider set in .env and returns parsed JSON.
//   LLM_PROVIDER = anthropic (default) | gemini | openai
//   LLM_MODEL    = optional; each provider has a sensible default below
//   ANTHROPIC_API_KEY / GEMINI_API_KEY / OPENAI_API_KEY
import { env } from "./env.mjs";

const PROVIDERS = {
  anthropic: {
    key: "ANTHROPIC_API_KEY",
    model: "claude-sonnet-5-5",
    async call({ system, prompt, model, key, maxTokens }) {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model, max_tokens: maxTokens, system, messages: [{ role: "user", content: prompt }] }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(`Anthropic ${r.status}: ${j.error?.message || JSON.stringify(j)}`);
      return j.content.map((c) => c.text || "").join("");
    },
  },
  gemini: {
    key: "GEMINI_API_KEY",
    model: "gemini-2.5-flash",
    async call({ system, prompt, model, key, maxTokens }) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", maxOutputTokens: maxTokens },
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(`Gemini ${r.status}: ${j.error?.message || JSON.stringify(j)}`);
      return (j.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
    },
  },
  openai: {
    key: "OPENAI_API_KEY",
    model: "gpt-4.1-mini",
    async call({ system, prompt, model, key, maxTokens }) {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: JSON.stringify({ model, max_tokens: maxTokens, response_format: { type: "json_object" }, messages: [{ role: "system", content: system }, { role: "user", content: prompt }] }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(`OpenAI ${r.status}: ${j.error?.message || JSON.stringify(j)}`);
      return j.choices[0].message.content;
    },
  },
};

export function llmConfig() {
  const name = env("LLM_PROVIDER", "anthropic").toLowerCase();
  const p = PROVIDERS[name];
  if (!p) throw new Error(`LLM_PROVIDER must be one of ${Object.keys(PROVIDERS).join(", ")}`);
  return { name, provider: p, key: env(p.key), model: env("LLM_MODEL", p.model), keyName: p.key };
}

export const llmAvailable = () => !!llmConfig().key;

/** Pull the first JSON object out of a reply (models sometimes wrap it in ``` fences). */
export function parseJson(text) {
  const s = text.indexOf("{");
  const e = text.lastIndexOf("}");
  if (s < 0 || e < s) throw new Error(`No JSON in the model's reply: ${text.slice(0, 200)}`);
  return JSON.parse(text.slice(s, e + 1));
}

export async function askJson({ system, prompt, maxTokens = 1500 }) {
  const { provider, key, model, keyName } = llmConfig();
  if (!key) throw new Error(`${keyName} is not set in .env`);
  const text = await provider.call({ system: system + "\nReply with one JSON object only, no other text.", prompt, model, key, maxTokens });
  return parseJson(text);
}
