---
title: "JavaScript Execution Context Explained"
description: "Learn what an execution context is, how Global and Function contexts are created, and why this/variable environments matter—with clear examples."
slug: javascript-execution-context
category: javascript
date: 2026-05-01
updated: 2026-07-22
tags:
  - javascript
  - execution-context
  - fundamentals
relatedTools:
  - /developer-tools/json-formatter
  - /developer-tools/regex-tester
  - /developer-tools/timestamp-converter
---

Every time JavaScript runs code, it does so inside an **execution context**—an environment that tracks where you are, which variables exist, and what `this` refers to.

## The three kinds of context

1. **Global Execution Context (GEC)** — created once when a script starts. Holds top-level `var`/`function` bindings and the global `this` (often `window` in browsers, or `globalThis`).
2. **Function Execution Context** — created each time a function is invoked. Gets its own variable environment, lexical environment, and `this` binding.
3. **Eval Execution Context** — rare; prefer avoiding `eval`.

## What lives inside a context

When a function runs, the engine roughly prepares:

- **Variable Environment** — `var` bindings and function declarations
- **Lexical Environment** — `let`/`const` and nested scopes
- **Outer reference** — link to the parent lexical environment (this powers closures)
- **`this` binding** — depends on *how* the function was called

```js
const user = {
  name: "Ada",
  greet() {
    // Function context: this === user when called as user.greet()
    console.log(this.name);
  },
};

user.greet();
```

## Creation vs execution phases

For each context, engines typically:

1. **Create** bindings (hoisting / TDZ for `let`/`const`)
2. **Execute** statements line by line

That split explains bugs like accessing `let` before its line (Temporal Dead Zone) versus `var` appearing as `undefined`.

## Why it matters day to day

- Debugging “wrong `this`” is usually a calling-style problem, not magic
- Nested functions close over their outer lexical environment, not a snapshot of values unless you capture them
- Async callbacks often run in a *new* turn of the event loop with a different stack—but they still close over the same lexical environment

## Quick mental model

Think of execution context as the **frame** the engine is currently evaluating. The [Call Stack](/blog/javascript-call-stack) holds those frames; when the stack empties, the [Event Loop](/blog/javascript-event-loop) can pull the next task.

When you inspect API payloads while learning these concepts, the [JSON Formatter](/developer-tools/json-formatter) helps keep example data readable.

## Practice checklist

- Can you explain Global vs Function context in one sentence each?
- What determines `this` inside a method vs an arrow function?
- Why does a nested function still “see” outer variables after the outer function returned?

