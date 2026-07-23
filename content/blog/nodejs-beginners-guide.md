---
title: "Node.js Beginners Guide: JavaScript on the Server"
description: "Learn Node.js basics—runtime, modules, npm, async I/O, and env config—plus FreeToolsPro tools for JSON, JWT, and Base64 while building APIs."
slug: nodejs-beginners-guide
category: programming
date: 2026-06-18
updated: 2026-07-22
tags:
  - nodejs
  - javascript
  - backend
relatedTools:
  - /developer-tools/json-formatter
  - /developer-tools/jwt-decoder
  - /image-tools/base64-encoder
---

Node.js lets you run JavaScript **outside the browser**—building APIs, CLIs, workers, and tooling with one language across the stack.

## What Node is (and is not)

- **Is**: a runtime built on V8, with a strong async I/O model and a huge npm ecosystem
- **Is not**: a framework (Express, Fastify, Nest are frameworks on top of Node)

You write JS/TS files; Node executes them, exposes OS APIs (`fs`, `http`, `path`, `crypto`), and manages packages via npm/pnpm/yarn.

## Project skeleton

```text
my-api/
  package.json
  src/
    index.js
  .env.example
  .gitignore
```

Useful `package.json` scripts:

```json
{
  "type": "module",
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js"
  }
}
```

Prefer ES modules (`import`/`export`) for new projects unless a legacy CommonJS codebase forces otherwise.

## Async I/O mindset

Node shines when waiting on network and disk. Prefer `async`/`await` with proper error handling:

```js
import { readFile } from "node:fs/promises";

try {
  const raw = await readFile("./config.json", "utf8");
  const config = JSON.parse(raw);
} catch (err) {
  console.error("Failed to load config", err);
  process.exit(1);
}
```

Inspect messy JSON configs with the [JSON Formatter](/developer-tools/json-formatter) before wiring them into code.

## Environment and secrets

- Keep secrets in environment variables, not committed files
- Provide `.env.example` without real values
- Never log tokens or passwords

When integrating JWTs, decode sample tokens (redacted) with the [JWT Decoder](/developer-tools/jwt-decoder) to verify claims—signature verification still belongs in your app with a real secret/key.

## npm packages wisely

- Pin major versions intentionally; read changelogs before major bumps
- Prefer well-maintained packages with clear licenses
- Audit dependencies; fewer deps often means fewer surprises

## HTTP without a framework (mental model)

Understanding Node’s `http` module once makes Express clearer:

```js
import http from "node:http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true }));
});

server.listen(3000);
```

Then graduate to [Express](/blog/express-js-guide) for routing and middleware.

## Encoding and binary data

APIs often move Base64 payloads (images, files). Prototype encodings with the [Base64 Encoder](/image-tools/base64-encoder), then implement proper streaming uploads in production.

## Related reading

- [JavaScript fundamentals](/blog/javascript-fundamentals-guide)
- [Express.js guide](/blog/express-js-guide)
- [MongoDB basics](/blog/mongodb-basics-guide)
- [Git version control](/blog/git-version-control-guide)
