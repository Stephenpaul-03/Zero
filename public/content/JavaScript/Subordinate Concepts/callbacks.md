# Callbacks

- A callback is a function passed as an argument to another function.    
- The receiving function executes (calls back) this function at a specific time.
- Enables control over execution order, especially for asynchronous tasks.

## Basic Syntax

```js
function mainFunction(callback) {   
	console.log("Main function running...");   
	callback(); // Execute callback 
} 

function callbackFunction() {
   console.log("Callback executed."); 
}
 
mainFunction(callbackFunction);`
```

## Parameters with Callback

```js
function greet(name, callback) {   
	console.log(`Hello, ${name}!`);   
	callback(); 
} 

greet("Alice", () => console.log("Greeting completed."));
```

## Use in Asynchronous Code

- Delays or waits execute without blocking main thread.

```js
console.log("Start"); 
setTimeout(() => {   
	console.log("Callback after 2 seconds"); 
}, 2000); 
console.log("End");`
```

## Common Use Cases

- Event listeners
- Async operations (e.g., network requests)
- Animation callbacks
- Iteration methods like `.forEach()`, `.map()`