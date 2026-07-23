---
title: "JavaScript Macrotasks Explained"
description: "Learn JavaScript macrotasks (tasks): setTimeout, setInterval, UI events, and how they interact with the event loop and microtasks."
slug: javascript-macrotasks
category: javascript
date: 2026-05-05
updated: 2026-07-22
tags:
  - javascript
  - macrotasks
  - timers
relatedTools:
  - /developer-tools/json-formatter
  - /developer-tools/regex-tester
  - /developer-tools/timestamp-converter
---

In event-loop talk, a **macrotask** (often just “task”) is a queued unit of work such as a timer callback, message event, or many UI events. One macrotask runs, then microtasks drain, then the next macrotask may run.

## Common macrotask sources

- `setTimeout` / `setInterval`
- `setImmediate` (Node)
- I/O callbacks (environment-specific)
- UI events (click, keydown)—treated as tasks in the HTML event loop model
- `postMessage` / MessageChannel tricks used for yielding

```js
console.log("A");
setTimeout(() => console.log("C"), 0);
Promise.resolve().then(() => console.log("B"));
// A → B → C
```

## Timers are not clocks

Browsers clamp nested timers, background tabs throttle intervals, and a busy main thread delays callbacks. Treat delays as **minimum** waits, not guarantees.

## Yielding to the browser

To keep UI smooth during heavy sync work, schedule chunks as macrotasks:

```js
function processChunk(items, i = 0) {
  const end = Math.min(i + 100, items.length);
  for (; i < end; i++) {
    /* work */
  }
  if (i < items.length) setTimeout(() => processChunk(items, i), 0);
}
```

(`requestAnimationFrame` is better when work should align with paint.)

## Macrotask vs microtask—when to choose

| Need | Prefer |
|------|--------|
| Continue Promise/`async` chain ASAP | microtask |
| Give the browser a chance to render / handle input | macrotask / rAF |
| Debounce user typing | macrotask timer |

## Related reading

- [Microtasks](/blog/javascript-microtasks)
- [Event Loop](/blog/javascript-event-loop)

When validating date/time behavior around delayed jobs, pair this with the [Date Add/Subtract Calculator](/calculators/date-add-subtract-calculator) or [Timestamp Converter](/developer-tools/timestamp-converter).

