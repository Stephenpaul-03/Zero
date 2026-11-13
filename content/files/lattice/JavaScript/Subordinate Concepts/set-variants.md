# Set Variants

## `setTimeout()`

- Executes a function **once** after a specified delay (in milliseconds).    
- **Syntax:**
    
    ```js
    setTimeout(function, delay, ...args);
    ```
    
- **Returns:** a timer ID (used to cancel with `clearTimeout(id)`)
    
**Example:**

```js
setTimeout(() => {
  console.log("Executed after 2 seconds");
}, 2000);
```

**Use cases:**  
Delay execution, deferred actions, or simulating async behavior.

## `setInterval()`

- Executes a function **repeatedly** at fixed intervals (in milliseconds).
- **Syntax:**
    
    ```js
    setInterval(function, delay, ...args);
    ```
    
- **Returns:** a timer ID (used to cancel with `clearInterval(id)`)
    
**Example:**

```js
setInterval(() => {
  console.log("Runs every 3 seconds");
}, 3000);
```

**Use cases:**  
Periodic updates, animations, auto-refreshing data, continuous checks.

## `clearTimeout()` and `clearInterval()`

- Stop a scheduled timer before it executes or repeats.    

**Example:**

```js
let id = setTimeout(() => console.log("Hi"), 5000);
clearTimeout(id); // cancels before execution
```

**Tip:** Always clear intervals you no longer need to avoid memory leaks or runaway loops.

## Nested `setTimeout()` (Alternative to `setInterval()`)

- Allows scheduling next execution **after** the current one completes.    
- Useful for variable delays or avoiding overlap between executions.

**Example:**

```js
function repeat() {
  console.log("Repeated with dynamic delay");
  setTimeout(repeat, 1000); 
}
setTimeout(repeat, 1000);
```

**Why use this?**

- Provides **better timing accuracy** (waits until the previous task finishes).
- Prevents accumulation if the callback takes longer than the interval delay.
    
## Event Loop Behavior

- JavaScript timers are **not precise**; they rely on the **event loop**. 
- Actual delay can be longer due to:
    - Browser throttling (especially in background tabs)
    - Heavy computation blocking the main thread
    - Minimum enforced delays (typically 4ms or more for nested timeouts)
        
## Summary Table

|Method|Executes|Repeats|Cancel Method|Timing Precision|Typical Use Case|
|---|---|---|---|---|---|
|`setTimeout()`|Once after delay|No|`clearTimeout()`|Medium|Delayed single action|
|`setInterval()`|At fixed intervals|Yes|`clearInterval()`|Low (can drift)|Periodic or repeated actions|
|`Nested setTimeout`|After previous completion|Yes|`clearTimeout()`|High|Controlled or variable intervals|

### Notes

- **Delay values < 0 are treated as 0.** The function runs as soon as the stack is clear.    
- **Timers are asynchronous** : they run after current synchronous code finishes.
- Avoid using timers for precise timing (e.g., animations); use `requestAnimationFrame()` instead.
- Node.js timers work similarly but run on the libuv event loop.
