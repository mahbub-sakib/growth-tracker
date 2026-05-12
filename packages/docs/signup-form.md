# Signup Form — Learner Guide

The signup form lives in `packages/client/src/pages/Signup.tsx`. It is your primary implementation exercise. It covers a range of real-world form patterns that you will encounter repeatedly in production apps. The backend is already built — your job is to implement the UI that collects and submits the data.

Use the Swagger UI at **http://localhost:8000/api/docs** to explore the API contract: what fields are required, what values are valid, and what the server returns.

---

## 1. Email and Password — Basic Controlled Inputs

**Fields:** `email`, `password`

The foundation of every React form. A controlled input means the input's value is always driven by React state — the component, not the browser, owns the truth.

**What to explore:**
- The difference between controlled (`value` + `onChange`) and uncontrolled (`ref`) inputs, and when you'd choose each
- How `type="email"` and `type="password"` give you browser-level behaviour for free
- The `autoComplete` attribute and why it matters for password managers and accessibility

---

## 2. Password Strength Indicator — Real-Time Derived State

**Field:** derived from `password`

The strength indicator (Weak / Fair / Good / Strong) is not stored in state — it is computed from the password on every render. This is one of the most important React patterns to understand: not everything needs to be state.

**What to explore:**
- The distinction between state and values derived from state — and why storing derived values in state creates bugs
- How to reflect real-time feedback (colour, label, progress bar) without adding extra event handlers
- Separating the scoring logic from the JSX so the function can be reasoned about and tested in isolation

**Scoring reference:**

| Score | Label | Conditions |
|---|---|---|
| 1 | Weak | Length ≥ 8 only |
| 2 | Fair | + uppercase or digit |
| 3 | Good | + uppercase and digit |
| 4 | Strong | + special character |

---

## 3. Role Selector — Radio Buttons as a Styled Toggle

**Field:** `role` (`LEARNER` | `MANAGER`)

Two mutually exclusive options. Native `<input type="radio">` is the semantically correct element, but it is almost always styled to look like something else — a toggle, pill selector, or tab strip. This is where you learn to style around the native input while keeping it accessible.

**What to explore:**
- Why wrapping an input in a `<label>` makes the entire area clickable without any JavaScript
- The `sr-only` pattern — visually hiding the native input while keeping it present for screen readers and keyboard navigation
- Managing a single string state value for a group of mutually exclusive options

---

## 4. Conditional Show/Hide — Team Name

**Field:** `teamName` (visible only when `role` is `MANAGER`)

This is the most important pattern in the form. Real forms constantly show or hide fields based on earlier answers — a billing address when "ship to different address" is ticked, extra fields when a specific payment method is chosen. The team name field only makes sense for a Manager, so it should only appear when that role is selected.

**What to explore:**
- The difference between conditionally rendering a field (unmounting it) vs hiding it with CSS — they behave differently when it comes to preserving state
- Why state for a hidden field should be cleared when the field disappears, so it does not get submitted with stale data
- How the backend enforces the same rule independently — the frontend condition is a UX guard, not the only safeguard

---

## 5. Department — Select / Dropdown

**Field:** `department`

A fixed list of options the user picks from. Simple on the surface, but there are real decisions to make around the default/empty state, placeholder text, and styling limitations of the native `<select>` element.

**Valid values:** `Engineering`, `Product`, `Design`, `Marketing`, `Operations`, `HR`, `Other`

**What to explore:**
- How to show a "please select" prompt that is not itself a valid choice (`value=""` + `disabled`)
- Why the list of options should live in a constant outside the component rather than inline in the JSX
- The trade-off between a native `<select>` (simple, accessible, hard to style) and a custom-built dropdown (full control, more code, accessibility is your responsibility)

---

## 6. Experience Level — Radio Group

**Field:** `experienceLevel` (`JUNIOR` | `MID` | `SENIOR`)

A radio group where each option has a label and a short description below it. The interaction is the same as the role selector, but the richer option content makes it a distinct challenge.

**What to explore:**
- Rendering a list of options from a data array rather than copy-pasting JSX for each one
- How the `name` attribute groups radio inputs so the browser enforces single-selection without any JavaScript
- Associating descriptive sub-text with a radio option in a way that is still accessible

---

## 7. Address Groups — Dynamic List

**Fields:** `addresses[]` — each entry has `label`, `street1`, `street2` (optional), `city`, `state`, `zipCode`, `country`

Users can add zero or more addresses. Each address is an object inside a state array. This pattern — a list where items can be added, removed, and individually edited — appears constantly in real apps: cart items, tags, team members, uploaded files.

**What to explore:**
- Why you must never mutate state arrays directly, and how to add, remove, and update items immutably
- Using a client-generated ID (e.g. `crypto.randomUUID()`) as the React `key` for each item — why the array index is a poor choice when items can be removed or reordered
- Stripping client-only fields (IDs, UI flags) before sending the data to the API

---

## 8. Collapsible Address Groups — Expand / Collapse

**Interaction:** each address group can be independently collapsed and expanded via a header toggle

Once a user adds multiple addresses the form gets long. Collapsing completed sections keeps it manageable. This pattern — per-item open/closed state stored alongside the item data — is the foundation of accordions, expandable table rows, and nested lists.

**What to explore:**
- Where to store the open/closed state: per-item inside the array, or separately — and why co-locating it with the item data is often cleaner
- `display: none` (via a `hidden` class) vs unmounting — `hidden` keeps the DOM node and preserves input values; unmounting discards them. Which is right here?
- Reflecting open/closed state in an icon (e.g. rotating a chevron) as a CSS-only micro-interaction driven by a class

---

## Submitting the Form

When the user submits:

1. Prevent the default browser form submission with `e.preventDefault()`
2. Sanitise the payload — strip any client-only fields (`id`, `isOpen`) that should not reach the server
3. `POST` to `http://localhost:8000/api/auth/signup` with `Content-Type: application/json` and `credentials: 'include'` so the refresh token cookie set by the server is accepted by the browser
4. Handle success: store the access token returned in the response, then navigate to `/`
5. Handle errors: display the `message` field from the API response

Check **http://localhost:8000/api/docs** for the exact shape of the request body and the possible error responses before you start wiring up the fetch call.
