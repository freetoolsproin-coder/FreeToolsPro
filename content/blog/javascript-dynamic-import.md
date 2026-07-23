---
title: "JavaScript Dynamic Import Explained"
description: "Use import() for on-demand loading, code splitting, and conditional modules—with error handling and practical patterns."
slug: javascript-dynamic-import
category: javascript
date: 2026-05-15
updated: 2026-07-22
tags:
  - javascript
  - dynamic-import
  - modules
relatedTools:
  - /developer-tools/json-formatter
  - /developer-tools/regex-tester
  - /developer-tools/timestamp-converter
---

Static `import` is hoisted and fixed at load time. **`import()`** is a function-like expression that returns a Promise for a module namespace—ideal for code splitting and conditional features.

## Basic usage

```js
button.addEventListener("click", async () => {
  const mod = await import("./heavy-chart.js");
  mod.renderChart(document.querySelector("#root"));
});
```

## Why use it?

- Load heavy UI only when needed  
- Route-based splitting in SPAs  
- Feature flags: import A or B  
- Plugins discovered at runtime (with care)

## Syntax notes

```js
const url = "./plugins/" + name + ".js";
const plugin = await import(/* webpackChunkName: "plugin" */ url);
```

Dynamic *paths* are powerful but must stay within trusted origins—never concatenate raw user input into module URLs without an allowlist.

## Error handling

```js
try {
  const { parse } = await import("./parser.js");
  parse(input);
} catch (err) {
  console.error("Failed to load parser", err);
}
```

Network failures and missing files reject the promise.

## Interop with default exports

```js
const mod = await import("./sum.js");
const sum = mod.default;
```

## Static vs dynamic—choose deliberately

Prefer static imports for core paths (better analysis, faster critical load). Use dynamic import for optional/large branches.

## Related

- [Modules](/blog/javascript-modules)
- [Event Loop](/blog/javascript-event-loop) (because `import()` is async)

When the dynamically loaded module fetches JSON, inspect samples with the [JSON Formatter](/developer-tools/json-formatter). Validate route params with patterns in the [Regex Tester](/developer-tools/regex-tester).

