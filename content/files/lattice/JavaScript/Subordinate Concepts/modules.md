# Modules

- Self-contained, reusable blocks of code that can be imported/exported between files.    
- Introduced in **ES6 (ECMAScript 2015)** to replace the messy global script loading era.
- Modules help organize projects, prevent naming conflicts, and improve maintainability.

## Core Syntax

### Exporting

- **Named export** , exports multiple values:
    
    ```js
    export const greet = () => console.log("Hi!");
    export const PI = 3.14;
    // or
    const sum = (a, b) => a + b;
    export { sum };
    ```
    
- **Default export** — exports a single main value:
    
    ```js
    export default function subtract(a, b) {
      return a - b;
    }
    ```
    
### Importing

- **Named import**:
    
    ```js
    import { greet, PI } from './utils.js';
    ```
    
- **Default import**:
    
    ```js
    import subtract from './math.js';
    ```
    
- **Combined import**:
    
    ```js
    import subtract, { PI } from './math.js';
    ```
    
- **Import all**:
    
    ```js
    import * as MathUtils from './math.js';
    console.log(MathUtils.PI);
    ```

### Example

```js
// math.js
export const add = (a, b) => a + b;
export default function multiply(a, b) {
  return a * b;
}

// main.js
import multiply, { add } from './math.js';

console.log(add(2, 3));      // 5
console.log(multiply(2, 3)); // 6
```

## Module Loading

- Modules must be imported through a web server (not directly via `file://`) due to **CORS** restrictions.    
- Use `<script type="module">` to enable module behavior in browsers:
    
    ```html
    <script type="module" src="main.js"></script>
    ```
    
- All imported modules run in **strict mode** by default.
- Module scripts are **deferred automatically**. they don’t block HTML parsing.
    
## Runtime Behavior

- Each module has its own **scope** (no pollution of `window`).    
- Imports are **live bindings**. if an exported variable changes, imports reflect it.
- Imports are **hoisted** and **loaded asynchronously** (executed only once, then cached).
 
## Benefits

|Feature|Description|
|---|---|
|**Encapsulation**|Keeps variables and functions scoped to their module.|
|**Reusability**|Functions and logic can be shared across files.|
|**Maintainability**|Easier to manage and scale large projects.|
|**Avoids Globals**|No variable collisions in the global namespace.|
|**Performance**|Browsers can cache and parallelize module loading.|

## Common Issues

- You **can’t use `require()`** in ES modules (that’s for CommonJS in Node.js).    
- Must include file extensions (e.g., `import './file.js'` not `./file`).
- Can’t use `import` or `export` inside conditional blocks - only at the top level.