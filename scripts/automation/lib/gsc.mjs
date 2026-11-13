// Google Search Console access with a service-account key (no extra packages).
import { readFileSync } from "node:fs";
import { createSign } from "node:crypto";

export const SCOPE_READ = "https://www.googleapis.com/auth/webmasters.readonly";
export const SCOPE_WRITE = "https://www.googleapis.com/auth/webmasters";

export async function gscToken(keyFile, scope = SCOPE_READ) {
  const key = JSON.parse(readFileSync(keyFile, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iss: key.client_email, scope, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
  const sig = createSign("RSA-SHA256").update(unsigned).sign(key.private_key).toString("base64url");
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${sig}` }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error(`Google sign-in failed: ${j.error_description || j.error || r.status}`);
  return { token: j.access_token, email: key.client_email };
}

/** Call a Search Console endpoint; retries rate-limit and server errors with backoff. */
export async function gscCall(token, url, { method = "GET", body } = {}) {
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(url, {
      method,
      headers: { authorization: `Bearer ${token}`, ...(body ? { "content-type": "application/json" } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const text = await r.text();
    const j = text ? JSON.parse(text) : {};
    if (r.ok) return j;
    if ((r.status === 429 || r.status >= 500) && attempt < 3) {
      await new Promise((res) => setTimeout(res, 2000 * 2 ** attempt));
      continue;
    }
    const e = new Error(`Search Console ${r.status}: ${j.error?.message || text.slice(0, 200)}`);
    e.status = r.status;
    throw e;
  }
}
