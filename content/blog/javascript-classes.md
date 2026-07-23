---
title: "JavaScript Classes Explained"
description: "Modern JavaScript classes: constructors, methods, getters, static members, and how they relate to prototypes."
slug: javascript-classes
category: javascript
date: 2026-05-12
updated: 2026-07-22
tags:
  - javascript
  - classes
  - es6
relatedTools:
  - /developer-tools/json-formatter
  - /developer-tools/regex-tester
  - /developer-tools/timestamp-converter
---

JS **classes** are primarily syntactic sugar over constructor functions + prototypes—but with stricter semantics (TDZ, non-callable without `new`, better inheritance ergonomics).

## Basic shape

```js
class Account {
  #balance = 0; // private field

  constructor(owner) {
    this.owner = owner;
  }

  deposit(amount) {
    this.#balance += amount;
  }

  get balance() {
    return this.#balance;
  }

  static sameOwner(a, b) {
    return a.owner === b.owner;
  }
}
```

## What happens with `new`

1. Create a new object whose prototype is `Account.prototype`  
2. Run `constructor` with `this` bound to that object  
3. Return the object (unless you explicitly return another object)

## Methods live on the prototype

Instance methods are shared—good for memory. Fields you assign in the constructor (or public fields) are typically **own** properties per instance.

## Private fields

`#name` is enforced by the language—not just a naming convention. They are not accessible from outside the class body.

## Classes are not hoisted like functions

```js
const x = new Thing(); // ReferenceError (TDZ)
class Thing {}
```

## When to use classes

- Clear entity types with identity and behavior  
- Framework components / error hierarchies  

Prefer plain functions + closures for simple utilities. Prefer composition when “is-a” inheritance gets awkward.

## Related

- [Inheritance](/blog/javascript-inheritance)
- [Prototypes](/blog/javascript-prototypes)

