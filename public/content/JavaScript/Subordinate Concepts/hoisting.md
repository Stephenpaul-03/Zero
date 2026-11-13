# Hoisting

- Hoisting is JavaScript's behavior of moving declarations (variables, functions, classes) to the top of their scope before code execution.
- This means you can use functions and variables before their actual declaration lines in code.

## Variable Hoisting

- `var` declarations are hoisted and initialized with `undefined`.    
- Example:

```js
console.log(x); // undefined (no error) 
var x = 5; // behaves like: // var x; // 
console.log(x); // x = 5;`
```

- `let` and `const` are hoisted but NOT initialized. Accessing them before declaration throws a `ReferenceError` due to Temporal Dead Zone (TDZ).
    
- Example:

```js
console.log(y); // ReferenceError let y = 10;
```

## Function Hoisting

- Function **declarations** are fully hoisted (including body).
- You can call function before its declaration line.
    
```js
sayHello(); // Works fine 
function sayHello() 
{   
	console.log("Hello"); 
}
```

- Function **expressions** using `var`, `let`, or `const` are not hoisted like declarations (only variable is hoisted, but not the assignment).
    
- Example:
    
```js
sayHi(); // TypeError: sayHi is not a function 
var sayHi = function() {   
console.log("Hi");
};
```

## Key Points

- Hoisting applies to declarations, not initializations.
- `var` variables are hoisted and initialized with `undefined`.
- `let` and `const` declared variables exist in TDZ until initialized.
- Functions declared with `function` are hoisted completely.
- Understanding hoisting helps prevent bugs from accessing variables/functions too early.
    