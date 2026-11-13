# Variables

### Introduction

- Variables are containers for storing data values
- Variables can be declared in three main ways:
    - **let** 
	    - Block-scoped
	    - Mutable
	    - Not redeclarable in same scope
    - **const**
	    - Block-scoped
	    - Immutable (but objects/arrays can be changed internally)
	    - not redeclarable in same scope
    - **var** 
	    - Function or global scoped
	    - redeclarable
	    - hoisted (not recommended)
	
### Declaration Syntax:
    
``` js
let name = "Alice"; 
const PI = 3.14; 
var age = 25;
```

### Scope Table:

| Keyword | Scope    | Redeclare | Reassign | Hoisting | Block | Recommended |
| ------- | -------- | --------- | -------- | -------- | ----- | ----------- |
| var     | Function | Yes       | Yes      | Yes      | No    | No          |
| let     | Block    | No        | Yes      | No       | Yes   | Yes         |
| const   | Block    | No        | No*      | No       | Yes   | Yes         |
(*const objects/arrays can be mutated: only binding is constant.)

### Naming Rules:
    
- Can contain letters, digits, underscores, and dollar signs	
- Must begin with a letter, underscore, or $
- Case-sensitive
- Cannot use reserved keywords
        
### Dynamic Typing:
    
- Variables can change type at runtime:
	
```js

let value = 10; 
value = "A string";
```     

### Good Practices:
    
- Always use let or const (prefer const for values not meant to change)
- Avoid var unless you understand function scope and hoisting
  