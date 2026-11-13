# Comments

- Comments in JavaScript are **ignored by the interpreter**. 
- They help explain, document, or temporarily disable code without affecting execution.

## Single-Line Comments

Used to comment out one line of code or write short explanations.

**Syntax:**

```js
// comment text
```

**Example:**

```js
// This is a single-line comment
let x = 5; // Declare x with value 5
```

## Multi-Line (Block) Comments

Used for longer explanations or commenting out multiple lines.

**Syntax:**

```js
/* comment text */
```

**Example:**

```js
/*
  This is a multi-line comment.
  It spans multiple lines.
*/
let y = 10;
```

## JSDoc Comments (Documentation Comments)

Used for **documenting code**, especially functions, parameters, and return values. Tools like VS Code and documentation generators (e.g. JSDoc) recognize these.

**Syntax:**

```js
/** ... */
```

**Example:**

```js
/**
 * Adds two numbers.
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function add(a, b) {
  return a + b;
}
```
