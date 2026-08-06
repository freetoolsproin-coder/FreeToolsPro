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

## Why JavaScript Inheritance Explained still matters

Most people do not need another abstract definition. They need a repeatable way to get a correct result under time pressure. This guide keeps the focus on decisions you can make today: what to check first, what to ignore, and which FreeToolsPro utilities shorten the path.

If you arrived from a search snippet, skim the headings, then follow the workflow section in order. Jumping to the last tip without fixing fundamentals is how small mistakes stack into frustrating rework.

## Practice loop that sticks

Reading alone rarely locks in mental models. Use a tight loop:

1. **Predict** what a tiny snippet will print or render.
2. **Run** it in the browser console, Node, or a playground.
3. **Change one variable** and predict again.
4. **Write one sentence** explaining the surprise in your own words.

For interviews, prefer explaining trade-offs over reciting trivia. Interviewers listen for whether you know when a pattern helps and when it hurts. Keep a personal gist of examples—event loop order, closure traps, React dependency arrays, CSS specificity fights—and rehearse them out loud once a week.

When debugging production issues, reproduce with the smallest fixture you can. Format payloads with a [JSON Formatter](/developer-tools/json-formatter), isolate regex with a [Regex Tester](/developer-tools/regex-tester), and only then reach for heavier tooling.

## Step-by-step approach

1. **Clarify the outcome** — what does “finished” look like (file delivered, page indexed, bug fixed, draft approved)?
2. **Gather inputs** — source files, URLs, error messages, constraints, and deadlines.
3. **Apply the smallest change** that could work; avoid parallel experiments that hide the cause.
4. **Validate** with a second device, a clean browser profile, or a fresh export.
5. **Document the winning path** in three bullets so next time is faster.

Useful FreeToolsPro pages for this topic: [Json Formatter](/developer-tools/json-formatter), [Regex Tester](/developer-tools/regex-tester), and [Timestamp Converter](/developer-tools/timestamp-converter).

## Common mistakes (and quick fixes)

- **Skipping the preview** — always open the final artifact before sharing.
- **Optimizing the wrong metric** — file size, rankings, or speed only matter relative to the real goal.
- **One giant edit** — smaller passes are easier to reverse when something breaks.
- **Ignoring mobile** — many PDF, SEO, and UI issues only appear on a phone viewport.
- **Trusting defaults** — export quality, crawl rules, and model temperature are not universal.

When something fails twice, change the method instead of retrying the same click pattern. Capture a screenshot or error string; future-you (or a teammate) will thank you.

## Checklist before you publish or hand off

- [ ] Primary goal stated in one sentence
- [ ] Inputs saved or linked
- [ ] Output opens correctly on a second device
- [ ] Sensitive data removed from drafts and prompts
- [ ] Follow-up link or owner noted if more work remains

Use this list as a gate. If any box is unchecked, pause. Ten careful minutes here usually beats an hour of cleanup later.

## FAQ

### How long should this take?
A focused first pass often fits in under an hour for a single page, file, or feature. Broader audits take longer—schedule them deliberately.

### Do I need paid software?
Not for the workflows covered here. Browser-based FreeToolsPro utilities handle many inspection, conversion, and drafting steps without installs.

### What if my case is weird?
Isolate the oddity (one page, one URL, one function). Reproduce it with minimal inputs, then widen scope only after you understand the failure.

### How do I keep improving?
Keep a short personal playbook: prompts that worked, compression settings you trust, SEO checks you never skip. Update it when reality contradicts the notes.
