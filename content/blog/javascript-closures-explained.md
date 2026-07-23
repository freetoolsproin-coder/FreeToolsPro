---
title: "JavaScript Closures Explained"
description: "Closures in plain language: functions that remember their lexical environment—with patterns, pitfalls, and examples."
slug: javascript-closures-explained
category: javascript
date: 2026-05-09
updated: 2026-07-22
tags:
  - javascript
  - closures
  - functions
relatedTools:
  - /developer-tools/json-formatter
  - /developer-tools/regex-tester
  - /developer-tools/timestamp-converter
---

A **closure** is a function bundled with its surrounding [lexical environment](/blog/javascript-lexical-environment). In practice: inner functions can use outer variables even after the outer function has returned.

## Minimal example

```js
function makeCounter() {
  let count = 0;
  return function next() {
    count += 1;
    return count;
  };
}

const c = makeCounter();
c(); // 1
c(); // 2
```

`count` is private state. Nothing outside `makeCounter` can touch it unless you expose it.

## Everyday closures

- Event handlers that read props from surrounding scope  
- `setTimeout` callbacks  
- Partial application / factory functions  
- Module pattern (before ES modules were common)

```js
function onClickFactory(id) {
  return () => {
    console.log("clicked", id);
  };
}
```

## Pitfall: loop + `var`

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3,3,3
}
```

All callbacks share one binding. Fix with `let` or an IIFE/factory per iteration.

## Pitfall: accidental retention

Closures keep referenced data alive. A handler that closes over a huge object can delay GC. Null out references or remove listeners when components unmount.

## Closures ≠ copying values

They close over **bindings**. If the outer variable changes before the callback runs, the callback sees the updated value (unless you captured a primitive copy into a local `const`).

## Related

- [Scope](/blog/javascript-scope)
- [Event Loop](/blog/javascript-event-loop)

Test small pure helpers thoroughly; use the [Regex Tester](/developer-tools/regex-tester) when closures wrap validation patterns.

