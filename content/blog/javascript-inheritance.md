---
title: "JavaScript Inheritance Explained"
description: "Prototype-based inheritance with extends/super, method overriding, and when to prefer composition over class hierarchies."
slug: javascript-inheritance
category: javascript
date: 2026-05-13
updated: 2026-07-22
tags:
  - javascript
  - inheritance
  - classes
relatedTools:
  - /developer-tools/json-formatter
  - /developer-tools/regex-tester
  - /developer-tools/timestamp-converter
---

JavaScript inheritance is **prototype-based**. `class Child extends Parent` wires `Child.prototype` to `Parent.prototype` and sets up `super` for constructors and methods.

## `extends` and `super`

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a noise`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // required before using this
    this.breed = breed;
  }
  speak() {
    return `${this.name} barks`;
  }
}
```

Call `super()` before touching `this` in a derived constructor.

## Overriding and `super.method`

```js
class LoudDog extends Dog {
  speak() {
    return super.speak() + "!";
  }
}
```

## instanceof and chains

```js
const d = new Dog("Rex", "indie");
d instanceof Dog; // true
d instanceof Animal; // true
```

`instanceof` walks the prototype chain ([Prototype Chain](/blog/javascript-prototype-chain)).

## Composition over deep hierarchies

Deep class trees become rigid. Often better:

```js
function withTimestamp(obj) {
  return { ...obj, createdAt: Date.now() };
}
```

Mix small behaviors instead of forcing unrelated types into one parent.

## Classic pitfalls

- Forgetting `super()`  
- Sharing mutable objects on `Parent.prototype` as default state  
- Using inheritance only to reuse one helper function—export a function instead  

Convert epoch values while experimenting with the [Timestamp Converter](/developer-tools/timestamp-converter).

## Related

- [Classes](/blog/javascript-classes)
- [Prototypes](/blog/javascript-prototypes)

