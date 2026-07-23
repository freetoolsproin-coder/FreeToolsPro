---
title: "JavaScript Microtasks Explained"
description: "What microtasks are in JavaScript, how Promise callbacks queue, and why they run before timers and UI events."
slug: javascript-microtasks
category: javascript
date: 2026-05-04
updated: 2026-07-22
tags:
  - javascript
  - microtasks
  - promises
relatedTools:
  - /developer-tools/json-formatter
  - /developer-tools/regex-tester
  - /developer-tools/timestamp-converter
---

**Microtasks** are small jobs scheduled to run *as soon as* the current call stack is empty—before the next macrotask (timer, click handler, etc.).

## What enqueues a microtask?

Common sources:

- Promise reactions (`.then`, `.catch`, `.finally`)
- `queueMicrotask(fn)`
- `MutationObserver` callbacks (browser)
- (Node) `process.nextTick` is even more urgent than the Promise microtask queue—know the difference if you write Node

```js
queueMicrotask(() => console.log("micro A"));
Promise.resolve().then(() => console.log("micro B"));
console.log("sync");
// sync → micro A → micro B
```

## Drain until empty

After each stack turn, the engine keeps running microtasks until the queue is empty. That means a microtask can schedule another microtask that also runs *before* any `setTimeout`.

```js
Promise.resolve().then(() => {
  console.log("first");
  Promise.resolve().then(() => console.log("second"));
});
setTimeout(() => console.log("timeout"), 0);
// first → second → timeout
```

## Why this design?

Promises model “continue this async computation ASAP” without waiting for the next timer tick. That keeps `async/await` chains responsive and predictable relative to timers.

## Pitfalls

- Infinite microtask chains can freeze the page (no chance to paint)
- Mixing `await` in loops schedules many microtasks—usually fine, but watch hot paths
- Do not use microtasks as a substitute for proper batching of DOM writes

## Debugging tip

When order surprises you, log with labels and compare against the [Event Loop](/blog/javascript-event-loop) rules. For timestamp math in async logs, the [Timestamp Converter](/developer-tools/timestamp-converter) helps translate Unix times in fixtures.

## Related

- [Macrotasks](/blog/javascript-macrotasks)
- [Call Stack](/blog/javascript-call-stack)

