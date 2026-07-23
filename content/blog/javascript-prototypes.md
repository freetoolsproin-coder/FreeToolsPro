---
title: "JavaScript Prototypes Explained"
description: "What prototypes are in JavaScript, how own vs inherited properties differ, and how to use Object.create safely."
slug: javascript-prototypes
category: javascript
date: 2026-05-10
updated: 2026-07-22
tags:
  - javascript
  - prototypes
  - objects
relatedTools:
  - /developer-tools/json-formatter
  - /developer-tools/regex-tester
  - /developer-tools/timestamp-converter
---

Almost every object in JavaScript has an internal link to another object: its **prototype**. Property lookup walks that link when a key is missing on the object itself.

## Own vs inherited

```js
const animal = { eats: true };
const rabbit = Object.create(animal);
rabbit.jumps = true;

console.log(rabbit.jumps); // own
console.log(rabbit.eats); // inherited from animal
console.log(Object.hasOwn(rabbit, "eats")); // false
```

Prefer `Object.hasOwn(obj, key)` (or `Object.prototype.hasOwnProperty.call`) when you must distinguish.

## `[[Prototype]]` vs `.prototype`

- **`obj`'s prototype** — usually reachable via `Object.getPrototypeOf(obj)`  
- **`Fn.prototype`** — the object that becomes the prototype of instances created with `new Fn()`

```js
function User(name) {
  this.name = name;
}
User.prototype.hello = function () {
  return `Hi, ${this.name}`;
};

const u = new User("Lin");
u.hello();
```

## Why prototypes exist

They enable shared methods without copying functions onto every instance—memory-friendly and the foundation of JS “inheritance.”

## Mutating built-in prototypes

Avoid extending `Array.prototype` / `Object.prototype` in app code—collisions and brittle enumeration await you. Library authors have historical exceptions; application code almost never should.

## Serialization warning

`JSON.stringify` only sees own enumerable data properties—not prototype methods. When debugging payloads, use the [JSON Formatter](/developer-tools/json-formatter).

## Related

- [Prototype Chain](/blog/javascript-prototype-chain)
- [Classes](/blog/javascript-classes)

