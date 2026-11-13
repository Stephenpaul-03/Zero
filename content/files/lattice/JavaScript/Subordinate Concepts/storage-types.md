# Storage Types

### LocalStorage

- Stores data with **no expiration date**.    
- Data persists even after browser restart or system reboot.
- Stores only **string values** - objects must be serialized using `JSON.stringify()` and parsed with `JSON.parse()`.
    
**Syntax:**

```js
// Save data
localStorage.setItem("key", "value");

// Retrieve data
let val = localStorage.getItem("key");

// Remove one item
localStorage.removeItem("key");

// Clear all data
localStorage.clear();

// For objects
localStorage.setItem("user", JSON.stringify({ name: "V", age: 22 }));
let user = JSON.parse(localStorage.getItem("user"));
```

### SessionStorage

- Stores data for the **lifetime of a browser tab or window**.    
- Data is lost once the tab or window is closed.
- Follows the same API as LocalStorage.

**Syntax:**

```js
sessionStorage.setItem("key", "value");
let val = sessionStorage.getItem("key");
sessionStorage.removeItem("key");
sessionStorage.clear();
```

### Cookies

- Small, limited (~4KB), and designed for **server communication**.
- Sent with every HTTP request to the same domain
- Can be **session-based** or **persistent** (via expiration date).
- Should be used sparingly - mainly for server-side state or authentication.
    
**Syntax:**

```js
// Set cookie
document.cookie = "username=John; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";

// Read all cookies
console.log(document.cookie);

// Delete cookie
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
```

| **Storage Type**   | **Storage Capacity** | **Persistence**                                 | **Scope**                                         | **Accessibility**                              | **Data Sent to Server** | **Usage Example**                                    |
| ------------------ | -------------------- | ----------------------------------------------- | ------------------------------------------------- | ---------------------------------------------- | ----------------------- | ---------------------------------------------------- |
| **LocalStorage**   | 5–10 MB              | Persistent until manually cleared               | Shared across all tabs/windows of the same origin | Accessible by all scripts from the same origin | No                      | Store user preferences, theme settings, offline data |
| **SessionStorage** | ~5 MB                | Cleared when tab/window closes                  | Unique to each browser tab/window                 | Accessible only within the same tab/window     | No                      | Store session-specific data like form inputs         |
| **Cookies**        | ~4 KB                | Session-based or persistent (if expiration set) | Shared across all tabs/windows of the same origin | Accessible by both client and server           | Yes                     | Store authentication tokens, user sessions           |

### Summary

- Use **LocalStorage** for long-term, client-only data (settings, saved items, etc.).    
- Use **SessionStorage** for temporary session data (form states, one-time interactions).
- Use **Cookies** when the server needs access to small pieces of stored data (authentication, tracking).
