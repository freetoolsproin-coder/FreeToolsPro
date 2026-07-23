---
title: "JavaScript Event Loop Explained"
description: "A practical guide to the JavaScript event loop: call stack, task queues, rendering, and why async code order can surprise you."
slug: javascript-event-loop
category: javascript
date: 2026-05-03
updated: 2026-07-22
tags:
  - javascript
  - event-loop
  - async
relatedTools:
  - /developer-tools/json-formatter
  - /developer-tools/regex-tester
  - /developer-tools/timestamp-converter
---

JavaScript is single-threaded for your script’s main work, but browsers (and Node) still feel concurrent because of the **event loop**: a coordinator that runs stack work, then drains queues of waiting callbacks.

## The loop in one picture (words)

1. Run whatever is on the **call stack** until empty  
2. Drain **microtasks** (Promises, `queueMicrotask`) until empty  
3. Possibly render / paint (browsers)  
4. Take the next **macrotask** (`setTimeout`, I/O, UI events) and repeat  

## Why `setTimeout(fn, 0)` is not “immediate”

`0` means “as soon as the macrotask queue allows,” which is *after* the current stack clears **and** after pending microtasks.

```js
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
console.log("sync");
// sync → promise → timeout
```

## UI responsiveness

Long sync work blocks the stack → the loop cannot process clicks or paint. Break heavy work:

- Chunk with `requestAnimationFrame` / `setTimeout`
- Use Web Workers for CPU-heavy jobs
- Prefer streaming / pagination for large JSON (pretty-print samples in the [JSON Formatter](/developer-tools/json-formatter))

## Node vs browser

The idea is the same; queue names differ (`process.nextTick`, libuv phases). For front-end work, focus on browser microtask vs timer/event macrotasks.

## Mental rules that prevent bugs

- Never assume timer order equals wall-clock precision under load  
- Chain async with `async/await` and always handle rejection  
- Remember: emptying microtasks can starve rendering if you enqueue endless microtasks  

## Keep learning the pieces

- [Call Stack](/blog/javascript-call-stack)
- [Microtasks](/blog/javascript-microtasks)
- [Macrotasks](/blog/javascript-macrotasks)

