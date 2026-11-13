# Functions

Functions are **reusable blocks of code** designed to perform a specific task. They help make programs modular, readable, and maintainable.

## Function Declaration

- Defines a named function using the `function` keyword.
- Function declarations are hoisted, meaning they can be called **before** their definition in the code.

**Syntax:**

```js
function functionName(parameters) {
  // code block
}
```

**Example:**

```js
function greet(name) {
  console.log("Hello " + name);
}
greet("Alice"); // Hello Alice
```

## Function Expression

- Function declarations are hoisted, meaning they can be called **before** their definition in the code.
- Assigns a function to a variable, optionally anonymous.

```js
const greet = function(name) {
  console.log("Hello " + name);
};
greet("Bob");
```

## Arrow Function (ES6+)

Provides a shorter syntax and a **lexical `this` binding**.

```js
const greet = (name) => `Hello ${name}`;
console.log(greet("Carol")); // Hello Carol
```

**Notes:**

- Parentheses optional for a single parameter.
- Return is implicit for single-line expressions.

**Example:**

```js
const square = x => x * x;
console.log(square(4)); // 16
```

## Function Parameters & Arguments

**Parameters** are placeholders in function definitions.  
**Arguments** are actual values passed during the call.

```js
function log(msg = "Default message") {
  console.log(msg);
}
log(); // Default message
log("Custom message"); // Custom message
```

## Return Statement

Functions can return a value using `return`.  
By default, functions return `undefined`.

```js
function square(x) {
  return x * x;
}
let result = square(4); // 16
```

## Function Types

|Type|Description|Example|
|---|---|---|
|**Named Function**|Regular function with a name; can be reused|`function foo(){}`|
|**Anonymous Function**|Function without a name, often assigned to variables|`const f = function() {}`|
|**Arrow Function**|Shorter syntax; doesn’t have its own `this` or `arguments`|`const f = () => {}`|
|**Generator Function**|Can pause/resume execution using `yield`|`function* gen() { yield 1; }`|
|**Recursive Function**|Calls itself to solve repetitive problems|`function fact(n){ if(n<=1)return 1; return n*fact(n-1); }`|

## Function Scope & Closures

- A closure “remembers” the environment in which it was created, even after that scope has finished executing.
- Functions create their own **local scope**.
- Variables declared inside a function are not accessible outside it.
- **Closures** allow functions to access variables from their outer scope.

**Example:**

```js
function makeCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}
const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

## Parameters

- Variables declared inside the function definition’s parentheses.    
- They act as placeholders for values that will be passed in later.
- Example:
    
```js
function greet(name, greeting = "Hello") {
  console.log(`${greeting}, ${name}`);
}
```

## Arguments

- The actual values you pass into a function when calling it.    
- These values are matched to parameters in the order they appear.
- Example:

```js
greet("Alice");         // Uses default greeting → "Hello, Alice"
greet("Bob", "Welcome"); // Custom greeting → "Welcome, Bob"
```

## Default Parameter Values

- Allow parameters to fall back to a given value if no argument (or `undefined`) is provided.
- This prevents `undefined` outputs when a value isn’t passed.
- Syntax:

```js
function sayHello(name = "Guest") {
  console.log(`Hello, ${name}`);
}
```

- Usage:
    
```js
sayHello();       // Hello, Guest
sayHello("John"); // Hello, John
```

## Rest Parameters (`...`)

- Gathers remaining arguments into a single array.
- Perfect for handling variable numbers of inputs.
- Syntax:

```js
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

sum(1, 2, 3); // 6
```

## Key Notes

- Functions encapsulate logic into reusable components.    
- They can be **declared**, **assigned**, or **returned** from other functions.
- Call functions using `functionName()` syntax.
- JavaScript treats functions as **first-class citizens**, meaning they can be passed as arguments or stored in variables.
- **Parameters** are variable names inside the function definition.
- **Arguments** are the actual values passed during function invocation.
- **Default values** kick in when an argument is missing or explicitly `undefined`.
- **Rest parameters** let you handle an unlimited number of arguments elegantly.
- JavaScript doesn’t enforce argument count: extra arguments are ignored, and missing ones become `undefined` (unless given defaults).
