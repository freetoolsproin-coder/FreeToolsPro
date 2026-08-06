const LANG_CODES = {
  Hindi: "hi",
  Telugu: "te",
  English: "en",
};

function normalizePages(translated, expectedLength) {
  const list = translated.map((p) => String(p ?? ""));
  if (list.length === expectedLength) return list;
  if (list.length > expectedLength) return list.slice(0, expectedLength);
  while (list.length < expectedLength) list.push("");
  return list;
}

function chunkText(text, maxLen = 420) {
  const raw = String(text || "");
  if (raw.length <= maxLen) return [raw];
  const chunks = [];
  let rest = raw;
  while (rest.length > maxLen) {
    let cut = rest.lastIndexOf("\n", maxLen);
    if (cut < maxLen * 0.4) cut = rest.lastIndexOf(" ", maxLen);
    if (cut < maxLen * 0.4) cut = maxLen;
    chunks.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) chunks.push(rest);
  return chunks;
}

async function translateChunkMyMemory(text, targetLanguage) {
  const target = LANG_CODES[targetLanguage] || "en";
  if (!text.trim()) return "";
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${target}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Free translation service unavailable.");
  const data = await response.json();
  const translated = data?.responseData?.translatedText;
  if (!translated) throw new Error("Empty translation response.");
  if (data?.responseStatus === 429) throw new Error("Translation rate limit reached. Try fewer pages or retry later.");
  return translated;
}

async function translatePageMyMemory(pageText, targetLanguage) {
  const chunks = chunkText(pageText);
  const parts = [];
  for (const chunk of chunks) {
    parts.push(await translateChunkMyMemory(chunk, targetLanguage));
    await new Promise((r) => setTimeout(r, 120));
  }
  return parts.join("\n");
}

export async function translatePagesMyMemory(pages, targetLanguage, onProgress) {
  const output = [];
  for (let i = 0; i < pages.length; i += 1) {
    output.push(await translatePageMyMemory(pages[i], targetLanguage));
    onProgress?.(Math.round(((i + 1) / pages.length) * 100));
  }
  return output;
}

async function translateViaApi(pages, targetLanguage) {
  const response = await fetch("/api/pdf-translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pages, targetLanguage }),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const msg =
      data.error ||
      (response.status === 503
        ? "Translation server is not configured."
        : response.status === 404
          ? "Translation API not found. Is the backend running?"
          : `Translation failed (${response.status}).`);
    throw new Error(msg);
  }

  if (!Array.isArray(data.pages)) {
    throw new Error("Translation API returned an invalid response.");
  }

  return {
    pages: normalizePages(data.pages, pages.length),
    via: data.via || "groq",
    note: data.note,
  };
}

/**
 * Translate PDF page text to Hindi, Telugu, or English.
 * Tries Groq backend first, then browser MyMemory fallback.
 */
export async function translatePdfPages(pages, targetLanguage, onProgress) {
  try {
    return await translateViaApi(pages, targetLanguage);
  } catch (apiError) {
    const fallbackPages = await translatePagesMyMemory(pages, targetLanguage, onProgress);
    return {
      pages: fallbackPages,
      via: "mymemory",
      note:
        apiError.message === "Translation server is not configured." ||
        /not found|backend|running|fetch/i.test(apiError.message)
          ? `Server translator unavailable (${apiError.message}). Used free browser translation—review Telugu output for accuracy.`
          : `Groq translator failed (${apiError.message}). Used free browser translation—review output for accuracy.`,
    };
  }
}
