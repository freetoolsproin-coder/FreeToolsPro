---
title: "JavaScript Hoisting Explained"
description: "Clear explanation of hoisting for var, function declarations, let, and const—including the Temporal Dead Zone with examples."
slug: javascript-hoisting
category: javascript
date: 2026-05-06
updated: 2026-07-22
tags:
  - javascript
  - hoisting
  - variables
relatedTools:
  - /developer-tools/json-formatter
  - /developer-tools/regex-tester
  - /developer-tools/timestamp-converter
---

**Hoisting** means declarations are processed during the creation phase of an [execution context](/blog/javascript-execution-context)—before the code runs line by line. It is not literally “moving code to the top” of your file, even if that metaphor helps beginners.

## `var` and function declarations

```js
console.log(a); // undefined (binding exists)
var a = 1;

sayHi(); // works
function sayHi() {
  console.log("hi");
}
```

`var` bindings initialize as `undefined`. Function *declarations* are fully initialized and callable.

## `let` and `const` — Temporal Dead Zone (TDZ)

```js
console.log(x); // ReferenceError
let x = 1;
```

The binding exists in the lexical environment early, but you cannot access it until initialization. That gap is the TDZ.

## Function expressions are different

```js
fn(); // TypeError or ReferenceError depending on var/let
var fn = function () {};
```

Only the variable is hoisted (`undefined` for `var`), not the function value.

## Best practices

- Prefer `const` by default, `let` when reassignment is needed  
- Avoid `var` in modern code  
- Declare functions before use *or* use `function` declarations deliberately  
- Keep modules small so declaration order stays obvious  

## Why people still get surprised

Bundlers, `import` bindings, and class declarations have their own rules. Classes are also TDZ-protected:

```js
const p = new Person(); // ReferenceError
class Person {}
```

## Related

- [Scope](/blog/javascript-scope)
- [Lexical Environment](/blog/javascript-lexical-environment)

Trim messy pasted snippets while experimenting with the [Trim Text](/text-tools/trim-text) tool, then paste into your editor.

