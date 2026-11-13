# Error Handling

## `try...catch` Statement

- **try block:** Contains code that might throw an error.    
- **catch block:** Runs if an error is thrown, giving access to the error object.
- **Syntax:**

```js
try {
  // Code that may throw an error
} catch (error) {
  // Handle the error
}
```

### `try...catch...finally`

- **finally block:** Always executes, regardless of whether an error occurred or not.  
    Commonly used for cleanup tasks (like closing files, releasing resources, or resetting states).
- **Syntax:**

```js
try {
  // Code that may fail
} catch (error) {
  // Error handling
} finally {
  // Always runs
}
```

### `throw` Statement

- Used to manually trigger an error.
- Can throw any value (string, number, object), but throwing an `Error` object is best practice for clarity and consistency.
- **Syntax:**

```js
throw new Error("Custom error message");
```

- Example:

```js
if (!username) {
  throw new Error("Username is required");
}
```

### Error Object Properties

When an error occurs, JavaScript automatically creates an **error object** with useful details:
- `name`: The type of error (e.g., `ReferenceError`, `TypeError`).
- `message`: Description of what went wrong.

### Common Built-in Error Types

|**Error Type**|**Occurs When**|
|---|---|
|**Error**|Generic error, base type for all others.|
|**ReferenceError**|Refers to a variable that hasn’t been declared.|
|**TypeError**|Performs an invalid operation on a data type (e.g., calling a non-function).|
|**SyntaxError**|Code cannot be parsed (detected before execution).|
|**RangeError**|A numeric value is outside its allowed range (e.g., invalid array length).|
|**URIError**|`encodeURI()` or `decodeURI()` used incorrectly.|
|**EvalError**|Issues related to the `eval()` function (rare in modern JS).|
|**AggregateError**|Thrown when multiple errors are reported together (commonly in `Promise.any()`).|

### Example

```js
try {
  let result = 10 / 0;
  throw new Error("Division by zero is not allowed");
} catch (e) {
  console.log(e.name);    // Error
  console.log(e.message); // Division by zero is not allowed
} finally {
  console.log("This always runs");
}
```

### Important Notes

- `try...catch` only handles **runtime errors**, not **syntax errors**.
- Asynchronous errors (in `setTimeout`, `Promise`, etc.) must be handled inside the async code itself.
- The `catch` parameter gives access to an error object containing detailed info.
- `finally` always runs, even if there’s a `return` or `throw` inside the `try` or `catch`.
    
### Bonus: Handling Errors in Async Code

```js
setTimeout(() => {
  try {
    throw new Error("Async error!");
  } catch (e) {
    console.log(e.message); // Async error!
  }
}, 1000);
```
