# Week 9 — Find the Flaw: AI Code Review Analysis (`/docs/find-the-flaw.md`)

**Reviewed by:** Alvin Murillo, Cabatingan, and Dagala

Each team member analyzed AI-generated backend/frontend snippets containing planted bugs and documented **what is wrong**, **why it is dangerous**, and **the exact fix**.

---

## Snippet 1 — Planted Bug in AI-Generated Customer Creation Handler (Reviewed by Alvin Murillo)

### AI-Generated Flawed Code
```javascript
function createCustomerAI(req) {
  const customer = db.customers.insert(req.body); // Planted Flaw 1 & 2
  return { status: 200, customer };               // Planted Flaw 3 & 4
}
```

### Flaws Identified by Alvin Murillo
1. **[Blocking — Missing Input Validation & Mass Assignment]:** `req.body` is passed straight into `db.customers.insert()` with zero guard-clause validation. Missing `name`, invalid `plateNumber`, or injected fields like `{ isAdmin: true, id: 1 }` corrupt the store or crash with a `500`.
2. **[Blocking — Hallucinated Data Layer Method]:** AI called `db.customers.insert(...)`, which does not exist in `customersStore.js` (our store exposes `customersStore.save(data)`). Calling `.insert()` throws `TypeError: db.customers.insert is not a function`.
3. **[Blocking — Wrong HTTP Status Code]:** Returns `200` instead of `201 Created` for a `POST` creation route.
4. **[Blocking — Broken Response Envelope]:** Returns `{ status: 200, customer }` instead of our team's standardized `{ status: 201, data: customer }` envelope, breaking the frontend table update.

### Corrected Fix
```javascript
function createCustomer(request) {
  if (!request.validatedBody) {
    const validationErr = validateCustomerInput(request);
    if (validationErr) return validationErr;
  }
  const customer = customersStore.save(request.validatedBody);
  return response(201, { data: customer });
}
```

---

## Snippet 2 — Planted Bug in AI-Generated Repair Update & Delete Handler (Reviewed by Cabatingan)

### AI-Generated Flawed Code
```javascript
function deleteRepairAI(req) {
  const id = req.params.id;
  repairsStore.remove(id); // Planted Flaw 1 & 2
  return { status: 200, data: { deleted: true } };
}
```

### Flaws Identified by Cabatingan
1. **[Blocking — Missing Authorization Guard (Security Hole)]:** Any unauthenticated guest or another mechanic can delete any repair order because `requireAuthorized(req, existing)` is completely missing (violates Week 4 Task 4 `403` guard).
2. **[Blocking — Unhandled 404 Not Found]:** The return value of `repairsStore.remove(id)` is ignored. Deleting non-existent ID `9999` falsely returns `200 OK` instead of `404 { status: 404, error: "repair order not found" }`.

### Corrected Fix
```javascript
function deleteRepair(request) {
  const id = Number(request && request.params && request.params.id);
  const existing = repairsStore.findById(id);
  const authErr = requireAuthorized(request, existing);
  if (authErr) return authErr;
  if (!existing) return notFoundError('repair order not found');
  repairsStore.remove(id);
  return response(200, { data: { deleted: true, id } });
}
```

---

## Snippet 3 — Planted Bug in AI-Generated Frontend Row Renderer & Restock Handler (Reviewed by Dagala)

### AI-Generated Flawed Code
```javascript
function renderPartRowAI(part) {
  row.innerHTML = `<td>${part.name}</td><td>${part.qty}</td>`; // Planted Flaw 1 (XSS)
}

function restockPartAI(req) {
  const part = partsStore.findById(req.params.id);
  part.qty = part.qty + req.body.addQty; // Planted Flaw 2 & 3
  return { status: 200, data: part };
}
```

### Flaws Identified by Dagala
1. **[Blocking — Cross-Site Scripting (XSS) Vulnerability]:** Interpolating `part.name` directly into `innerHTML` without HTML escaping allows `<script>alert(1)</script>` or `<img src=x onerror=...>` payloads to execute in the browser.
2. **[Blocking — Type Coercion Bug (`"25" + "10" = "2510"`)]:** Without guard-clause validation ensuring `addQty` is an integer between `1` and `500`, passing `addQty: "10"` concatenates strings or allows negative restocks (`addQty: -999`).
3. **[Blocking — Unchecked Null Reference (`500` Crash on Missing ID)]:** If `partsStore.findById(req.params.id)` returns `null`, accessing `part.qty` immediately crashes the server with `TypeError: Cannot read properties of null (reading 'qty')` instead of returning `404`.

### Corrected Fix
- Use `escapeHtml(part.name)` (or `textContent`) in the UI renderer and disallow `<` / `>` script tags in validation.
- Check `if (!existing) return notFoundError('part not found')`, validate `addQty` is an integer `1..500`, and verify `existing.qty + addQty <= 999` before calling `partsStore.restock(id, addQty)`.
