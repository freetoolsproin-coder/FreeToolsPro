---
title: "JavaScript Modules Explained"
description: "ES modules vs scripts: import/export, module scope, strict mode, circular dependencies, and practical project structure."
slug: javascript-modules
category: javascript
date: 2026-05-14
updated: 2026-07-22
tags:
  - javascript
  - modules
  - esmodules
relatedTools:
  - /developer-tools/json-formatter
  - /developer-tools/regex-tester
  - /developer-tools/timestamp-converter
---

**ES modules** (`import`/`export`) are the standard way to split JavaScript. Each module has its own top-level [scope](/blog/javascript-scope), runs in strict mode, and is cached after first evaluation.

## Export styles

```js
// utils.js
export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export default function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}
```

```js
import sum, { clamp } from "./utils.js";
```

## Live bindings

Imported values are live read-only views of the exported binding (for `let`/`const` exports). Reassigning an import in the importer is illegal; mutating an imported object’s properties is possible—but often unwise.

## Scripts vs modules

| Classic script | ES module |
|----------------|-----------|
| `var` can become global | top-level stays module-private |
| `this` at top-level may be `window` | top-level `this` is `undefined` |
| duplicate loads re-execute | cached singleton evaluation |

In browsers: `<script type="module">`. In Node: `"type": "module"` or `.mjs`.

## Circular dependencies

A ↔ B imports can yield partial exports (`undefined` temporarily). Prefer redesign: extract shared constants to module C both import.

## Project structure tips

- Keep pure helpers free of DOM  
- One responsibility per file when reasonable  
- Prefer named exports for greppability; default export for a clear primary API  

## Related

- [Dynamic Import](/blog/javascript-dynamic-import)
- [Closures Explained](/blog/javascript-closures-explained)

Pretty-print config JSON with the [JSON Formatter](/developer-tools/json-formatter) while wiring module-loaded settings.

