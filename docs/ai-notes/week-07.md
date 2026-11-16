# Week 7 — AI Prompt Log (`/docs/ai-notes/week-07.md`)

**Phase 3 Policy:** AI is ON and required. Prompts and human modifications are logged below.

---

## Key Prompts & Provenance Labels

### 1. Alvin Murillo — Async Fetch Helper & Customer Form Binding (`AI-modified`)
- **Prompt Used:**
  > "Write an async JavaScript helper `apiRequest(method, path, body)` using `fetch()` that disables a submit button while pending, parses our `{ status, data, error, field }` JSON envelope, and handles network failures without crashing."
- **Human Review & Fixes (`Alvin Murillo`):**
  - AI initially checked `if (res.ok)` and threw a generic `Error(res.statusText)` on `422` responses, which lost the `field` property from our Week 4 JSON error envelope.
  - Fixed the helper to always parse `await res.json()` first and return `{ status: res.status, ...json }` so `422`, `403`, and `404` envelopes are passed cleanly to the form handler.
  - Hand-wrote `bindCustomerForm()` (`POST /customers` and `PUT /customers/:id`).

### 2. Cabatingan — Repair Job Order Create/Edit Form & Status Binding (`Hand-written` / `AI-modified`)
- **Prompt Used:**
  > "Scaffold a pre-fill function `openEditRepairModal(repair)` that populates customerId, issue, mechanic, laborCost, and status into our form and submits to `PUT /repairs/:id`."
- **Human Review & Fixes (`Cabatingan`):**
  - Converted `customerId` and `laborCost` form string values to `Number(...)` before sending JSON so our strict backend type check (`typeof data.laborCost !== 'number'`) receives real numbers instead of strings.
  - Hand-wrote the quick status update binding (`PATCH /repairs/:id/status`).

### 3. Dagala — Spare Parts Create/Edit & Restock Form Binding (`Hand-written` / `AI-modified`)
- **Prompt Used:**
  > "Write a submit handler for `POST /parts` and `POST /parts/:id/restock` that prevents default form reload, shows a loading spinner on the submit button, and maps `response.field` to inline field error elements."
- **Human Review & Fixes (`Dagala`):**
  - Added a `try / finally` block around the `fetch` call so `button.disabled = false` and spinner cleanup always execute even if the network drops mid-request.

---

## Binding Provenance Table

| Binding / Module | Provenance Label | Owner |
| :--- | :--- | :--- |
| `apiRequest()` shared async wrapper | **AI-modified** | Alvin Murillo |
| `Customers` Create (`POST`) & Update (`PUT`) binding | **Hand-written** | Alvin Murillo |
| `Repairs` Create (`POST`), Update (`PUT`) & Status (`PATCH`) binding | **Hand-written** | Cabatingan |
| `Parts` Create (`POST`), Update (`PUT`) & Restock (`POST`) binding | **AI-modified** | Dagala |
| `showFieldErrors()` inline `422` mapper | **Hand-written** | Dagala |
