# Scope

Scope determines **where variables and functions are accessible** in your code. It defines the visibility and lifetime of variables.

## Types of Scope

|**Scope Type**|**Description**|**Keywords Affecting Scope**|**Accessibility**|
|---|---|---|---|
|**Global Scope**|Variables declared outside any function or block.|`var`, `let`, `const`|Accessible anywhere in the program.|
|**Function Scope**|Variables declared inside a function.|`var`, `let`, `const`|Accessible only within that function.|
|**Block Scope**|Variables declared inside `{}` (if, loops, etc.).|`let`, `const`|Accessible only within that block.|
|**Module Scope**|Scope of code inside an ES6 module file.|`let`, `const`, `function`|Accessible only within that module.|

## Key Details

- **`var`**    
    - Function-scoped or globally scoped (if declared outside any function).
    - _Not block-scoped_ : leaks out of `{}` blocks.        
    - Hoisted to the top of its scope and initialized as `undefined`.
        
- **`let` and `const`**
    - Block-scoped : exist only within `{}`.
    - Not initialized until their declaration line (Temporal Dead Zone).        
    - Cannot be redeclared in the same scope.
        
- **Local Scope**
    - Variables declared inside functions are local to them.
        
- **Lexical Scope**
    - Inner scopes can access variables from outer scopes.
        
- **Global Scope**
    - Accessible everywhere unless shadowed by a local variable with the same name.
        
- **ES6 Improvement**
    - Block scope was added to fix variable collisions common with `var`.
        
## Example

```js
var globalVar = "global"; // Global scope

function testFunc() {
  var funcVar = "function scope"; // Function scope

  if (true) {
    let blockVar = "block scope"; // Block scope
    console.log(blockVar); // Accessible here
  }

  // console.log(blockVar); // Error: blockVar not accessible here
  console.log(funcVar); // Accessible inside function
}

testFunc();
console.log(globalVar); // Accessible anywhere
```

## Summary

- `let` and `const` → block-scoped (recommended).    
- `var` → function-scoped (avoid in modern code).
- Functions create their own local scopes.
- Blocks (`{}`) create scopes only for `let` and `const`.
- Avoid too many global variables, they pollute the global namespace.    

## Concept Recap

| Concept           | Description                                                                         | Example                                                                     |
| ----------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Hoisting**      | Variable and function declarations move to the top of their scope before execution. | `console.log(a); var a = 5; // undefined`                                   |
| **Shadowing**     | Local variable overrides global variable with same name.                            | `let x = 10; function test(){ let x = 5; console.log(x); } // 5`            |
| **Lexical Scope** | Inner functions can access outer function variables.                                | `function outer(){ let a=1; function inner(){ console.log(a); } inner(); }` |