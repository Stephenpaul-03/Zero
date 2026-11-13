# Data Types

## Types

- **Primitive:** String, Number, BigInt, Boolean, Undefined, Null, Symbol 
- **Non-Primitive:** Object (includes Arrays, Functions, Dates, Maps, Sets, etc.)

## Overview

| Data Type       | Description                                        | Example                             |
| --------------- | -------------------------------------------------- | ----------------------------------- |
| **String**      | Textual data enclosed by quotes                    | `"hello"`, `'world'`                |
| **Number**      | Integer or floating-point numbers                  | `123`, `3.14`, `2e10`               |
| **BigInt**      | Integers of arbitrary length                       | `900719925124740999n`               |
| **Boolean**     | True or false                                      | `true`, `false`                     |
| **Undefined**   | Variable declared but not assigned a value         | `let x;`                            |
| **Null**        | Represents intentional absence of any object value | `null`                              |
| **Symbol**      | Unique and immutable identifiers                   | `Symbol('id')`                      |
| **Object**      | Collection of key-value pairs or complex data      | `{ name: "John" }`                  |
| **Array**       | Ordered list-like collection of elements           | `[1, 2, 3]`, `["a", "b", "c"]`      |
| **Function**    | Block of code designed to perform a task           | `function greet() { return "hi"; }` |
| **Date**        | Represents date and time information               | `new Date()`                        |
| **RegExp**      | Used for pattern matching                          | `/ab+c/`, `new RegExp('ab+c')`      |
| **Map**         | Stores key-value pairs (keys can be any type)      | `new Map()`                         |
| **Set**         | Stores unique values                               | `new Set([1, 2, 3])`                |
| **WeakMap**     | Map with weakly held object keys                   | `new WeakMap()`                     |
| **WeakSet**     | Set with weakly held object references             | `new WeakSet()`                     |
| **Error**       | Represents runtime errors                          | `new Error("Oops!")`                |
| **Promise**     | Represents async operation results                 | `new Promise((res,rej)=>{})`        |
| **Proxy**       | Used to intercept and redefine object behavior     | `new Proxy(target, handler)`        |
| **ArrayBuffer** | Represents fixed-length raw binary data            | `new ArrayBuffer(8)`                |
| **TypedArray**  | Typed views for binary data (`Uint8Array`, etc.)   | `new Uint8Array(4)`                 |
| **DataView**    | Low-level binary data manipulation                 | `new DataView(buffer)`              |
| **JSON**        | Utility for parsing and stringifying JSON          | `JSON.parse()`, `JSON.stringify()`  |
| **Math**        | Provides math constants and functions              | `Math.PI`, `Math.sqrt(16)`          |
| **Reflect**     | Object introspection utilities                     | `Reflect.get(obj, key)`             |
| **Intl**        | Internationalization utilities                     | `Intl.DateTimeFormat()`             |

## Key Methods per Data Type

### String Methods

|Method|Description|Example|Output|
|---|---|---|---|
|`length`|Property showing number of characters|`"hello".length`|`5`|
|`charAt(index)`|Returns character at position|`"hey".charAt(1)`|`'e'`|
|`charCodeAt(index)`|Unicode of char at index|`"ABC".charCodeAt(0)`|`65`|
|`concat(str)`|Joins strings|`"Hi".concat(" there")`|`'Hi there'`|
|`includes(sub)`|Checks if substring exists|`"hello".includes("he")`|`true`|
|`indexOf(sub)`|Finds first index of substring|`"banana".indexOf("na")`|`2`|
|`lastIndexOf(sub)`|Finds last index of substring|`"banana".lastIndexOf("na")`|`4`|
|`slice(start,end)`|Extracts part of string|`"abcdef".slice(1,4)`|`'bcd'`|
|`substring(start,end)`|Similar to slice but swaps if start > end|`"abcdef".substring(4,1)`|`'bcd'`|
|`substr(start,length)`|Returns substring of given length|`"abcdef".substr(1,3)`|`'bcd'`|
|`split(sep)`|Splits string into array|`"a,b,c".split(",")`|`['a','b','c']`|
|`replace(old,new)`|Replaces substring|`"hi hi".replace("hi","hey")`|`'hey hi'`|
|`repeat(n)`|Repeats string n times|`"ha".repeat(3)`|`'hahaha'`|
|`trim()`|Removes whitespace from both ends|`" hi ".trim()`|`'hi'`|
|`toLowerCase()`|Converts to lowercase|`"HeLLo".toLowerCase()`|`'hello'`|
|`toUpperCase()`|Converts to uppercase|`"hey".toUpperCase()`|`'HEY'`|
|`startsWith(sub)`|Checks prefix|`"hello".startsWith("he")`|`true`|
|`endsWith(sub)`|Checks suffix|`"hello".endsWith("lo")`|`true`|
|`padStart(len, pad)`|Pads start with given chars|`"5".padStart(3,"0")`|`'005'`|
|`padEnd(len, pad)`|Pads end with given chars|`"5".padEnd(3,"0")`|`'500'`|

### Number Methods

|Method|Description|Example|Output|
|---|---|---|---|
|`toFixed(n)`|Rounds to n decimals|`(3.14159).toFixed(2)`|`'3.14'`|
|`toExponential(n)`|Exponential form|`(1234).toExponential(2)`|`'1.23e+3'`|
|`toPrecision(n)`|n significant digits|`(3.14159).toPrecision(3)`|`'3.14'`|
|`valueOf()`|Returns primitive value|`(42).valueOf()`|`42`|
|`isFinite()`|Checks if finite|`Number.isFinite(10)`|`true`|
|`isNaN()`|Checks if NaN|`Number.isNaN(NaN)`|`true`|
|`parseInt(str)`|Parses integer|`Number.parseInt("10px")`|`10`|
|`parseFloat(str)`|Parses float|`Number.parseFloat("3.14")`|`3.14`|

### BigInt

|Method|Description|Example|Output|
|---|---|---|---|
|_(No built-in methods)_|Use normal arithmetic|`10n + 20n`|`30n`|

### Boolean

|Method|Description|Example|Output|
|---|---|---|---|
|_(No methods)_|Primitive true/false|`Boolean(0)`|`false`|

### Undefined / Null

|Type|Description|
|---|---|
|`undefined`|Declared but not assigned|
|`null`|Explicit “no value”|

### Symbol

|Property / Method|Description|Example|Output|
|---|---|---|---|
|`description`|Returns description|`Symbol("id").description`|`'id'`|
|`toString()`|Converts to string|`Symbol("id").toString()`|`'Symbol(id)'`|

### Object Methods

|Method|Description|Example|Output|
|---|---|---|---|
|`keys()`|Array of keys|`Object.keys({a:1,b:2})`|`['a','b']`|
|`values()`|Array of values|`Object.values({a:1,b:2})`|`[1,2]`|
|`entries()`|Array of key-value pairs|`Object.entries({a:1})`|`[['a',1]]`|
|`hasOwnProperty()`|Checks property existence|`obj.hasOwnProperty('x')`|`true`|
|`assign()`|Copies properties|`Object.assign({}, {a:1})`|`{a:1}`|
|`freeze()`|Makes immutable|`Object.freeze(obj)`|—|
|`isFrozen()`|Checks frozen state|`Object.isFrozen(obj)`|`true/false`|
|`seal()`|Prevents adding/removing|`Object.seal(obj)`|—|
|`isSealed()`|Checks sealed state|`Object.isSealed(obj)`|`true/false`|
|`toString()`|Converts to string|`({x:1}).toString()`|`'[object Object]'`|

### Array Methods

|Method|Description|Example|Output|
|---|---|---|---|
|`push()`|Add to end|`[1,2].push(3)`|`[1,2,3]`|
|`pop()`|Remove last|`[1,2,3].pop()`|`3`|
|`shift()`|Remove first|`[1,2,3].shift()`|`1`|
|`unshift()`|Add to start|`[1,2].unshift(0)`|`[0,1,2]`|
|`splice()`|Add/remove items|`arr.splice(1,1,'x')`|modifies array|
|`slice()`|Copy portion|`[1,2,3].slice(1,3)`|`[2,3]`|
|`concat()`|Merge arrays|`[1,2].concat([3,4])`|`[1,2,3,4]`|
|`join()`|Join elements as string|`[1,2,3].join('-')`|`'1-2-3'`|
|`forEach()`|Iterate items|`[1,2,3].forEach(console.log)`|`undefined`|
|`map()`|Transform array|`[1,2,3].map(x=>x*2)`|`[2,4,6]`|
|`filter()`|Filter elements|`[1,2,3].filter(x=>x>1)`|`[2,3]`|
|`reduce()`|Reduce to single value|`[1,2,3].reduce((a,b)=>a+b)`|`6`|
|`find()`|First match|`[1,2,3].find(x=>x>1)`|`2`|
|`findIndex()`|Index of first match|`[1,2,3].findIndex(x=>x>1)`|`1`|
|`some()`|Any passes test|`[1,2,3].some(x=>x>2)`|`true`|
|`every()`|All pass test|`[1,2,3].every(x=>x>0)`|`true`|
|`sort()`|Sorts array|`[3,1,2].sort()`|`[1,2,3]`|
|`reverse()`|Reverses array|`[1,2,3].reverse()`|`[3,2,1]`|
|`includes()`|Checks for value|`[1,2,3].includes(2)`|`true`|
|`indexOf()`|Finds index of value|`[1,2,3].indexOf(2)`|`1`|
|`flat()`|Flattens nested arrays|`[1,[2,[3]]].flat(2)`|`[1,2,3]`|
|`flatMap()`|Map then flatten|`[1,2].flatMap(x=>[x,x*2])`|`[1,2,2,4]`|

### Function Methods

|Method|Description|Example|Output|
|---|---|---|---|
|`call(thisArg, ...args)`|Call function with specific context|`fn.call(obj, a,b)`|Result of fn|
|`apply(thisArg, argsArray)`|Same as call but args in array|`fn.apply(obj,[a,b])`|Result of fn|
|`bind(thisArg)`|Returns new bound function|`const g = fn.bind(obj)`|New function|
|`toString()`|Source code of function|`function hi(){}`.toString()|`'function hi(){}'`|

### Date Methods

|Method|Description|Example|Output|
|---|---|---|---|
|`getDate()`|Day of month|`d.getDate()`|`15`|
|`getDay()`|Day of week|`d.getDay()`|`2`|
|`getFullYear()`|Full year|`d.getFullYear()`|`2025`|
|`getMonth()`|Month (0–11)|`d.getMonth()`|`10`|
|`getHours()`|Hour|`d.getHours()`|`14`|
|`getMinutes()`|Minutes|`d.getMinutes()`|`30`|
|`getSeconds()`|Seconds|`d.getSeconds()`|`45`|
|`getTime()`|Timestamp (ms since 1970)|`d.getTime()`|`1730467200000`|
|`setDate(day)`|Set day of month|`d.setDate(5)`|timestamp|
|`setFullYear(year)`|Set year|`d.setFullYear(2030)`|timestamp|
|`toISOString()`|ISO date string|`d.toISOString()`|`'2025-11-01T18:30:00.000Z'`|
|`toLocaleString()`|Local date & time|`d.toLocaleString()`|`'11/1/2025, 11:00 PM'`|

### RegExp Methods

|Method|Description|Example|Output|
|---|---|---|---|
|`test()`|Tests match, returns boolean|`/a/.test('cat')`|`true`|
|`exec()`|Executes search, returns match array|`/a/.exec('cat')`|`['a']`|

### Map Methods

|Method|Description|Example|Output|
|---|---|---|---|
|`set(key, val)`|Adds key-value pair|`map.set('a',1)`|`Map`|
|`get(key)`|Retrieves value|`map.get('a')`|`1`|
|`has(key)`|Checks existence|`map.has('a')`|`true`|
|`delete(key)`|Removes entry|`map.delete('a')`|`true`|
|`clear()`|Removes all|`map.clear()`|—|
|`keys()`|Returns iterator of keys|`map.keys()`|Iterator|
|`values()`|Returns iterator of values|`map.values()`|Iterator|
|`entries()`|Iterator of [key,value]|`map.entries()`|Iterator|
|`forEach(fn)`|Loops through map|`map.forEach(v=>console.log(v))`|—|

### Set Methods

|Method|Description|Example|Output|
|---|---|---|---|
|`add(val)`|Adds unique value|`set.add(1)`|`Set`|
|`has(val)`|Checks if exists|`set.has(1)`|`true`|
|`delete(val)`|Removes value|`set.delete(1)`|`true`|
|`clear()`|Removes all|`set.clear()`|—|
|`values()`|Iterator of values|`set.values()`|Iterator|
|`forEach(fn)`|Iterates set|`set.forEach(console.log)`|—|

### WeakMap / WeakSet

|Type|Methods|
|---|---|
|**WeakMap**|`set()`, `get()`, `has()`, `delete()`|
|**WeakSet**|`add()`, `has()`, `delete()`|

### Error

|Property / Method|Description|Example|
|---|---|---|
|`message`|Error message|`err.message`|
|`name`|Error type|`err.name`|
|`stack`|Stack trace|`err.stack`|

### Promise

|Method|Description|Example|
|---|---|---|
|`.then()`|Runs on resolve|`p.then(res=>{})`|
|`.catch()`|Runs on reject|`p.catch(err=>{})`|
|`.finally()`|Runs after settle|`p.finally(()=>{})`|
|`Promise.all()`|Wait for all|`Promise.all([p1,p2])`|
|`Promise.race()`|First settled|`Promise.race([p1,p2])`|
|`Promise.any()`|First fulfilled|`Promise.any([p1,p2])`|
|`Promise.resolve()`|Creates resolved promise|`Promise.resolve(5)`|
|`Promise.reject()`|Creates rejected promise|`Promise.reject("error")`|

### Math (Static Only)

|Method|Example|
|---|---|
|`Math.abs(-5)`|`5`|
|`Math.round(4.6)`|`5`|
|`Math.floor(4.9)`|`4`|
|`Math.ceil(4.1)`|`5`|
|`Math.random()`|random 0–1|
|`Math.max(1,2,3)`|`3`|
|`Math.min(1,2,3)`|`1`|
|`Math.pow(2,3)`|`8`|
|`Math.sqrt(16)`|`4`|
|`Math.trunc(3.99)`|`3`|

### JSON (Static Only)

|Method|Description|Example|Output|
|---|---|---|---|
|`parse(str)`|Parses JSON to object|`JSON.parse('{"a":1}')`|`{a:1}`|
|`stringify(obj)`|Converts object to JSON|`JSON.stringify({a:1})`|`'{"a":1}'`|

### Reflect

|Method|Description|Example|
|---|---|---|
|`Reflect.get(obj,key)`|Get property|`Reflect.get({a:1},'a')`|
|`Reflect.set(obj,key,val)`|Set property|`Reflect.set(obj,'a',2)`|
|`Reflect.has(obj,key)` | Like `in` | `Reflect.has(obj,'a')` |

### Intl

|Method|Description|Example|
|---|---|---|
|`Intl.DateTimeFormat()`|Localized date formatting|`new Intl.DateTimeFormat('en-US').format(new Date())`|
|`Intl.NumberFormat()`|Localized number formatting|`new Intl.NumberFormat('de-DE').format(1234567.89)`|
