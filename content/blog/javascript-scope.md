---
title: "JavaScript Scope Explained"
description: "Global, function, and block scope in JavaScript—how var/let/const differ and how to avoid accidental globals."
slug: javascript-scope
category: javascript
date: 2026-05-07
updated: 2026-07-22
tags:
  - javascript
  - scope
  - fundamentals
relatedTools:
  - /developer-tools/json-formatter
  - /developer-tools/regex-tester
  - /developer-tools/timestamp-converter
---

**Scope** answers: *where is this name visible?* JavaScript uses lexical (static) scope—visibility is determined by where you wrote the code, not by who called it.

## Scope kinds

1. **Global** — top-level in a script/module  
2. **Function** — parameters and `var` inside functions  
3. **Block** — `let`/`const`/`class` inside `{ }` (including `if`, loops, `switch`)

```js
function demo(flag) {
  if (flag) {
    let message = "yes";
    var legacy = "var leaks to function";
  }
  // console.log(message); // ReferenceError
  console.log(legacy); // "var leaks to function" if flag was true
}
```

## Modules have their own top-level scope

ES modules do not attach top-level `let`/`const` to `window`. That alone prevents many accidental globals.

## Shadowing

Inner scopes can reuse a name:

```js
const value = 1;
function inner() {
  const value = 2;
  console.log(value); // 2
}
```

Shadowing is legal; accidental shadowing is a readability bug—name clearly.

## Scope vs object properties

`obj.x` is not scope lookup; it is property access. Scope is about **identifiers**.

## Practical rules

- Keep functions small so scopes stay scanable  
- Prefer block-scoped bindings in loops  

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0,1,2
}
```

With `var i`, you would log `3,3,3`—a classic scope lesson.

## Related

- [Lexical Environment](/blog/javascript-lexical-environment)
- [Closures Explained](/blog/javascript-closures-explained)
- [Hoisting](/blog/javascript-hoisting)

