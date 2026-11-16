# Week 4 — Validation Matrix & Break-It Test Log (`/docs/validation.md`)

**Standardized Error Response Envelope:**
```json
{
  "status": 422,
  "error": "qty out of range",
  "field": "qty"
}
```

**Authorization Error Envelope (Sensitive Actions):**
```json
{
  "status": 403,
  "error": "not allowed"
}
```

---

## Task 1 — Complete Validation Matrix

Every create and update route validates fields using guard clauses at the top of the pipeline before reaching the controller logic. Rules use the lecture vocabulary: **presence, type, length/range, format, allowed values, referential**.

### 1. Customers & Motorcycles (`POST /customers`, `PUT /customers/:id`, `GET /customers/plate/:plateNumber`) — Owner: Alvin Murillo

| Route | Field | Rules |
| :--- | :--- | :--- |
| `POST /customers`, `PUT /customers/:id` | `name` | **presence**: required; **type**: string (non-empty after trim); **length**: 2–80 chars |
| `POST /customers`, `PUT /customers/:id` | `phone` | **presence**: required; **type**: string; **format**: `^[0-9+\-\s]{7,15}$` (7–15 digits/phone chars) |
| `POST /customers`, `PUT /customers/:id` | `plateNumber` | **presence**: required; **type**: string; **format**: `^[A-Z0-9]{2,4}-[0-9A-Z]{3,5}$` (e.g., `ABC-1234`) |
| `POST /customers`, `PUT /customers/:id` | `motorcycleModel` | **presence**: required; **type**: string; **length**: 2–80 chars |
| `GET /customers/plate/:plateNumber` | `plateNumber` | **presence**: required; **type**: string; **format**: `^[A-Z0-9]{2,4}-[0-9A-Z]{3,5}$` |

### 2. Repair Job Orders (`POST /repairs`, `PUT /repairs/:id`, `PATCH /repairs/:id/status`) — Owner: Cabatingan

| Route | Field | Rules |
| :--- | :--- | :--- |
| `POST /repairs`, `PUT /repairs/:id` | `customerId` | **presence**: required; **type**: integer number (`> 0`); **referential**: must match an existing customer ID in `customersStore` |
| `POST /repairs`, `PUT /repairs/:id` | `issue` | **presence**: required; **type**: string; **length**: 5–200 chars |
| `POST /repairs`, `PUT /repairs/:id` | `mechanic` | **presence**: required; **type**: string; **length**: 2–60 chars |
| `POST /repairs`, `PUT /repairs/:id` | `laborCost` | **presence**: required; **type**: number (finite); **range**: `0` to `100000` |
| `POST /repairs`, `PUT /repairs/:id` | `status` | **presence**: required; **type**: string; **allowed values**: one of `pending`, `in_progress`, `completed`, `paid` |
| `PATCH /repairs/:id/status` | `status` | **presence**: required; **type**: string; **allowed values**: one of `pending`, `in_progress`, `completed`, `paid` |

### 3. Spare Parts Inventory (`POST /parts`, `PUT /parts/:id`, `POST /parts/:id/restock`) — Owner: Dagala

| Route | Field | Rules |
| :--- | :--- | :--- |
| `POST /parts`, `PUT /parts/:id` | `name` | **presence**: required; **type**: string; **length**: 2–100 chars |
| `POST /parts`, `PUT /parts/:id` | `sku` | **presence**: required; **type**: string; **format**: `^[A-Z0-9-]{3,20}$` (3–20 uppercase alphanumeric/hyphen chars) |
| `POST /parts`, `PUT /parts/:id` | `qty` | **presence**: required; **type**: integer number; **range**: `0` to `999` |
| `POST /parts`, `PUT /parts/:id` | `unitPrice` | **presence**: required; **type**: number (finite); **range**: `1` to `100000` |
| `POST /parts`, `PUT /parts/:id` | `category` | **presence**: required; **type**: string; **allowed values**: one of `engine`, `brakes`, `electrical`, `tires`, `lubricants`, `body` |
| `POST /parts/:id/restock` | `addQty` | **presence**: required; **type**: integer number; **range**: `1` to `500` (and resulting stock `qty + addQty <= 999`) |

---

## Task 4 — Authorization Guard Specification

Sensitive destructive routes (`DELETE /customers/:id`, `DELETE /repairs/:id`, `DELETE /parts/:id`) and locked repair edits check `currentUserCanManage(request)` in [`src/middleware/auth.js`](../src/middleware/auth.js):
- Requires `request.user.role` (or `x-user-role` header) to be `"owner"` or `"admin"`, OR `currentUserOwns(record, request.user)` to be true.
- If unauthorized, the guard immediately exits with:
  ```json
  { "status": 403, "error": "not allowed" }
  ```

---

## Task 5 — Break-It Test Log ("Try to Break Your Own App")

Each member deliberately sent bad requests to verify the server returns `422` or `403` cleanly and **never crashes with a `500`**.

| # | Tested By | Route | Bad Input Payload / Action | Expected | Actual Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Alvin Murillo** | `POST /customers` | `{ "phone": "09171234567", "plateNumber": "ABC-1234", "motorcycleModel": "Honda Click" }` *(Missing `name`)* | `422` | `{ "status": 422, "error": "name is required", "field": "name" }` |
| **2** | **Alvin Murillo** | `POST /customers` | `{ "name": "Juan", "phone": "09171234567", "plateNumber": "badplate", "motorcycleModel": "Honda Click" }` *(Invalid plate format)* | `422` | `{ "status": 422, "error": "plateNumber format is invalid (expected e.g. ABC-1234)", "field": "plateNumber" }` |
| **3** | **Alvin Murillo** | `DELETE /customers/1` | Request sent with `role: "guest"` (unauthorized delete) | `403` | `{ "status": 403, "error": "not allowed" }` |
| **4** | **Cabatingan** | `POST /repairs` | `{ "customerId": 1, "issue": "Brake fix", "mechanic": "Berto", "laborCost": "free", "status": "pending" }` *(Wrong type on `laborCost`)* | `422` | `{ "status": 422, "error": "laborCost must be a number", "field": "laborCost" }` |
| **5** | **Cabatingan** | `POST /repairs` | `{ "customerId": 1, "issue": "Brake fix", "mechanic": "Berto", "laborCost": -500, "status": "pending" }` *(Out-of-range `laborCost`)* | `422` | `{ "status": 422, "error": "laborCost out of range", "field": "laborCost" }` |
| **6** | **Cabatingan** | `POST /repairs` | `{ "customerId": 9999, "issue": "Brake fix", "mechanic": "Berto", "laborCost": 450, "status": "pending" }` *(Referential failure: customer does not exist)* | `422` | `{ "status": 422, "error": "customerId does not reference an existing customer", "field": "customerId" }` |
| **7** | **Cabatingan** | `PATCH /repairs/1/status` | `{ "status": "teleported" }` *(Disallowed enum value)* | `422` | `{ "status": 422, "error": "invalid status", "field": "status" }` |
| **8** | **Dagala** | `POST /parts` | `{ "name": "Spark Plug", "sku": "SPK-01", "qty": "cake", "unitPrice": 250, "category": "electrical" }` *(Wrong type `qty: "cake"`)* | `422` | `{ "status": 422, "error": "qty must be a number", "field": "qty" }` |
| **9** | **Dagala** | `POST /parts` | `{ "name": "Spark Plug", "sku": "SPK-01", "qty": 1500, "unitPrice": 250, "category": "electrical" }` *(Out-of-range `qty > 999`)* | `422` | `{ "status": 422, "error": "qty out of range", "field": "qty" }` |
| **10** | **Dagala** | `POST /parts/1/restock` | `{ "addQty": -5 }` *(Negative restock quantity)* | `422` | `{ "status": 422, "error": "addQty out of range", "field": "addQty" }` |
| **11** | **Dagala** | `DELETE /parts/1` | Request sent with `role: "customer"` (forbidden delete) | `403` | `{ "status": 403, "error": "not allowed" }` |
