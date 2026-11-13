# Events

- Events are **actions or occurrences** that happen in the browser and can be detected by JavaScript.    
- Common examples:
    - User clicks a button
    - A key is pressed
    - The page finishes loading
    - A form is submitted
    - The mouse moves or touches the screen

Events are the backbone of interactivity in web pages.

## Event Handling

- Event handling means writing **functions (event handlers)** that run when a specific event occurs.    
- The browser automatically passes an **event object** to these handlers, which holds details about the event.

## Ways to Attach Event Handlers

1. **Inline HTML attribute (old-school)**
    
    ```html
    <button onclick="alert('Clicked!')">Click me</button>
    ```
    
    - Quick, but mixes JS and HTML (not ideal for scalability).
        
2. **DOM property**
    
    ```js
    const btn = document.getElementById('btn');
    btn.onclick = function() {
      alert('Clicked!');
    };
    ```
    
    - Cleaner, but only one handler per event type per element.
        
3. **addEventListener() (recommended)**
    
    ```js
    const btn = document.getElementById('btn');
    btn.addEventListener('click', () => alert('Clicked!'));
    ```
    
    - Preferred modern approach.    
    - Allows multiple listeners for the same event and fine control over propagation.
        
## Common Event Types

|**Category**|**Examples**|
|---|---|
|**Mouse Events**|`click`, `dblclick`, `mouseenter`, `mouseleave`, `mousemove`|
|**Keyboard Events**|`keydown`, `keyup`, `keypress`|
|**Form Events**|`submit`, `change`, `focus`, `blur`, `input`|
|**Window Events**|`load`, `resize`, `scroll`, `unload`|
|**Touch Events**|`touchstart`, `touchend`, `touchmove`|

## Event Object

- When an event occurs, the browser passes an **event object** to the handler.    
- It includes information such as:
    - `type`: The event type (`click`, `keydown`, etc.)
    - `target`: The element that triggered the event        
    - `key`: Which key was pressed (for keyboard events)
    - `clientX`, `clientY`: Mouse position
        
- Example:
    
    ```js
    document.addEventListener('click', (event) => {
      console.log(event.type);   // "click"
      console.log(event.target); // The element clicked
    });
    ```
    
## Event Propagation

Events in the DOM go through **two main phases**:

1. **Capturing phase:** Event moves from the root (document) down to the target.
2. **Bubbling phase:** Event moves back up from the target to the root.

- By default, most events **bubble** up.    
- You can stop propagation at any point:
    
    ```js
    event.stopPropagation();
    ```
    
## Event Delegation

- Instead of attaching event listeners to every element, attach one to a **common parent** and let events bubble up.    
- Useful for dynamic or large sets of elements.
- Example:
    
    ```js
    document.querySelector('#list').addEventListener('click', (e) => {
      if (e.target.tagName === 'LI') {
        console.log(`Clicked on ${e.target.textContent}`);
      }
    });
    ```
    
## Preventing Default Behavior

- Some actions have built-in browser behavior (like links navigating or forms submitting).
- Use `event.preventDefault()` to stop them:
    
    ```js
    document.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Form submission stopped');
    });
    ```
    
## Example

```js
document.getElementById('btn').addEventListener('click', (event) => {
  event.preventDefault();
  alert('Button clicked!');
});
```