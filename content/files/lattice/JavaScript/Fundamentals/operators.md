# Operators

## Arithmetic Operators (perform mathematical operations)

|Operator|Description|Example|Result|
|---|---|---|---|
|+|Addition|5 + 3|8|
|-|Subtraction|5 - 3|2|
|*|Multiplication|5 * 3|15|
|/|Division|15 / 3|5|
|%|Modulus (remainder)|5 % 3|2|
|++|Increment|++x|x + 1|
|--|Decrement|--x|x - 1|

## Assignment Operators (assign values to variables)

|Operator|Description|Example|Equivalent To|
|---|---|---|---|
|=|Simple assignment|x = 5|—|
|+=|Add and assign|x += 3|x = x + 3|
|-=|Subtract and assign|x -= 3|x = x - 3|
|*=|Multiply and assign|x *= 3|x = x * 3|
|/=|Divide and assign|x /= 3|x = x / 3|
|%=|Modulus and assign|x %= 3|x = x % 3|

## Comparison Operators (compare two values)

|Operator|Description|Example|Result Example|
|---|---|---|---|
|==|Equal to|5 == "5"|true|
|===|Strict equal to|5 === "5"|false|
|!=|Not equal|5 != "6"|true|
|!==|Strict not equal|5 !== "5"|true|
|>|Greater than|5 > 3|true|
|<|Less than|3 < 5|true|
|>=|Greater or equal|5 >= 5|true|
|<=|Less or equal|3 <= 5|true|

## Logical Operators (used with Boolean values)

| Operator | Description            | Example       | Result Example |
| -------- | ---------------------- | ------------- | -------------- |
| &&       | Logical AND            | true && false | false          |
| \|\|     | Logical OR             | true \|\| false| false         |
| !        | Logical NOT (negation) | !true         | false          |

## Bitwise Operators (operate on 32-bit binary numbers)

| Operator | Description          | Example | Result |
| -------- | -------------------- | ------- | ------ |
| &        | AND                  | 5 & 1   | 1      |
| \|       | OR                   | 5 \| 1  | 5      |
| ^        | XOR                  | 5 ^ 1   | 4      |
| ~        | NOT                  | ~5      | -6     |
| <<       | Left shift           | 5 << 1  | 10     |
| >>       | Signed right shift   | 5 >> 1  | 2      |
| >>>      | Unsigned right shift | 5 >>> 1 | 2      |

## String Operators

|Operator|Description|Example|Result Example|
|---|---|---|---|
|+|Concatenation|"Hello " + "JS"|"Hello JS"|
|+=|Append and assign|str += "World"|"Hello World"|

## Conditional (Ternary) Operator

|Operator|Description|Syntax|Example|
|---|---|---|---|
|? :|Shortcut for if-else|condition ? exprIfTrue : exprIfFalse|age >= 18 ? "Adult" : "Minor"|

## typeof Operator

|Operator|Description|Example|Result|
|---|---|---|---|
|typeof|Returns data type of operand|typeof 42|"number"|

## Comma Operator

|Operator|Description|Example|Result|
|---|---|---|---|
|,|Evaluates multiple operands, returns last|(a=1, b=2, a+b)|3|

## Unary Operators (operate on one operand)

|Operator|Description|Example|Result Example|
|---|---|---|---|
|+|Converts operand to number|+ "5"|5|
|-|Converts operand to number and negates it|- "5"|-5|
|++|Increment|++x|x + 1|
|--|Decrement|--x|x -1|
|!|Logical NOT|!true|false|
|typeof|Returns type of operand|typeof 'abc'|"string"|
|void|Evaluates expression, returns undefined|void(0)|undefined|
