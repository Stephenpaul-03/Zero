# Closures

- A **closure** is a function that retains access to variables in its **lexical scope**, even after the outer function has finished executing.    
- In simpler terms: a closure “remembers” the environment where it was created.
- This lets inner functions access or modify variables defined outside of them; Long after those outer functions have returned.
    
## Working

- Closures are formed **when a function is defined inside another function**.
- The inner function keeps a **reference**, not a copy, to the variables of its parent scope.
- This allows for **persistent private state** that stays alive as long as the closure exists.
    
**Example:**

```js
function outer() {
  let count = 0;

  function inner() {
    count++;
    console.log(count);
  }

  return inner;
}

const counter = outer();
counter(); // 1
counter(); // 2
```

Here, `count` stays accessible to `inner()` even though `outer()` has finished executing. that’s a closure in action.

## Parameterized Closure Example

Closures can also capture parameters from their parent scope:

```js
function multiplier(factor) {
  return function(num) {
    return num * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

Each returned function “remembers” its own `factor` value.

## Common Use Cases

- **Data encapsulation / privacy:** Create private variables not directly accessible from outside.    
- **Maintaining state:** Track values between function calls (e.g., counters, accumulators).
- **Functional programming:** Enables currying, partial application, and composition.
- **Asynchronous logic:** Keep access to outer variables inside callbacks or promises.
- **Module pattern:** Group related functionality while keeping internal data hidden.

## Key Insights

- **Lexical scoping:** Variables are resolved based on **where** a function is defined, not **where it’s called**.    
- **Memory behavior:** Variables captured in closures stay in memory as long as the closure exists.
- **Pitfall:** Be cautious with closures in loops - all closures may share the same variable if not scoped properly.

**Example (loop fix using `let`):**

```js
for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Prints: 1, 2, 3
```

(`let` creates a new lexical scope per iteration, preserving each value of `i`.)

## Importance

Closures are one of JavaScript’s most powerful features. They make it possible to:
- Simulate private variables.
- Preserve data without polluting the global scope.
- Write modular, maintainable, and secure code.