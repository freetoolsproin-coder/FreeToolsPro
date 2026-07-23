---
title: "JavaScript Prototype Chain Explained"
description: "Follow property lookup along the prototype chain, understand null prototypes, and avoid shadowing bugs."
slug: javascript-prototype-chain
category: javascript
date: 2026-05-11
updated: 2026-07-22
tags:
  - javascript
  - prototype-chain
  - objects
relatedTools:
  - /developer-tools/json-formatter
  - /developer-tools/regex-tester
  - /developer-tools/timestamp-converter
---

The **prototype chain** is the path the engine walks when resolving `obj.key`: own properties first, then `[[Prototype]]`, then that object’s prototype, until `null`.

## Lookup walk

```js
const a = { color: "grey" };
const b = Object.create(a);
const c = Object.create(b);
c.size = "sm";

console.log(c.size); // found on c
console.log(c.color); // walk c → b → a
console.log(c.toString); // eventually Object.prototype.toString
```

## End of the chain

`Object.prototype`'s prototype is `null`. You can also create **null-prototype** objects for safe dictionaries:

```js
const map = Object.create(null);
map.__proto__ = "ok"; // just a normal key, not the chain
```

Useful when keys come from user input and you do not want inherited traps.

## Shadowing

Assigning `c.color = "red"` creates an **own** property on `c`. It hides `a.color` for `c` without changing `a` (unless you mutate `a` directly).

## `in` vs own checks

```js
"color" in c; // true (inherited counts)
Object.hasOwn(c, "color"); // false until shadowed
```

## Performance intuition

Extremely deep chains or megamorphic shapes can hurt optimizations—but for normal app depth (a few levels), clarity beats micro-worry. Prefer [classes](/blog/javascript-classes) or composition over handmade deep trees.

## Related

- [Prototypes](/blog/javascript-prototypes)
- [Inheritance](/blog/javascript-inheritance)

