# Control Flow

## Conditional Statements (Decision Making)

Used to make decisions based on conditions (true/false).

### if

Executes a block of code **only if** the condition is true.

```js
if (condition) {
  // code runs if condition is true
}
```

### if...else

Executes one block if the condition is true, and another if false.

```js
if (condition) {
  // runs if true
} else {
  // runs if false
}
```

### if...else if...else

Used to test **multiple conditions** in sequence.

```js
if (condition1) {
  // block1
} else if (condition2) {
  // block2
} else {
  // else block
}
```

### switch

Used to perform different actions based on different values of an expression.

```js
switch (expression) {
  case value1:
    // code block
    break;
  case value2:
    // code block
    break;
  default:
    // code block
}
```

### Ternary Operator (`?:`)

A compact form of `if...else` that returns a value based on a condition.

```js
condition ? exprIfTrue : exprIfFalse;
```

---

## Looping Statements (Repetition Control)

Used to **execute code repeatedly** as long as a condition is true.

### for loop

Used when the number of iterations is known.

```js
for (initialization; condition; increment) {
  // repeated code
}
```

### while loop

Executes code **while** the condition remains true.

```js
while (condition) {
  // repeated code
}
```

### do...while loop

Executes code **at least once**, then repeats while the condition remains true.

```js
do {
  // repeated code
} while (condition);
```

---

## Jump Statements (Flow Control)

Used to **alter the normal flow** of loops or functions.

|Statement|Definition|
|---|---|
|**break**|Exits the current loop or switch statement immediately.|
|**continue**|Skips the rest of the current loop iteration and moves to the next one.|
|**return**|Exits from a function and optionally returns a value.|
|**throw**|Raises a custom error that can be handled using `try...catch`.|

---

## Function Flow

Defines a **reusable block of code** that runs when called.

```js
function greet(name) {
  return "Hello, " + name;
}
```

---

## Asynchronous Flow

JavaScript executes code sequentially by default, but asynchronous flow allows handling long-running operations (like fetching data) **without blocking** the rest of the code.

|Technique|Definition|
|---|---|
|**Callbacks**|Functions passed as arguments, called after an operation completes.|
|**Promises**|Objects representing future completion or failure of an async task.|
|**async/await**|Cleaner syntax for writing asynchronous code that looks synchronous.|

Example:

```js
async function fetchData() {
  const data = await fetch(url);
  return data.json();
}
```

---

## Notes

- JavaScript executes code **sequentially** (top to bottom).    
- Control flow statements **change the natural execution order**.
- **Asynchronous control** prevents blocking when performing network or time-based operations.
- JavaScript is **single-threaded**, meaning one operation runs at a time, but async features simulate concurrency.
