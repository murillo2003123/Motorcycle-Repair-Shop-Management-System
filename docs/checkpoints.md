# Week 5 — Individual AI-Off Checkpoints (`Task 4`)

Each team member built one complete route end-to-end (**route + guard-clause validation + thin controller + automated Arrange–Act–Assert tests**) against a short specification.

---

## 1. Alvin Murillo — Solo Checkpoint

- **Spec:** Build `GET /customers/plate/:plateNumber` so a mechanic can look up a customer and motorcycle record by plate number.
- **Validation Rules (`validatePlateParam`):**
  - `plateNumber` parameter is required and must match `^[A-Z0-9]{2,4}-[0-9A-Z]{3,5}$` (returns `422` `{ status: 422, error: "plateNumber format is invalid (expected e.g. ABC-1234)", field: "plateNumber" }` if malformed).
- **Controller (`findCustomerByPlate` in `src/controllers/customersController.js`):**
  - Calls `customersStore.findByPlate(plateNumber)` and returns `200` `{ status: 200, data: customer }` or `404` `{ status: 404, error: "customer not found" }`.
- **Automated Tests (`tests/customers.test.js`):**
  - Happy path (`200` when plate `ABC-1234` exists)
  - Validation failure (`422` when plate format is invalid e.g. `bad_plate`)
  - Edge case (`404` when valid plate `ZZZ-9999` is not found)

---

## 2. Cabatingan — Solo Checkpoint

- **Spec:** Build `PATCH /repairs/:id/status` to update a repair job order's status along the shop workflow (`pending` → `in_progress` → `completed` → `paid`).
- **Validation Rules (`validateRepairStatusInput`):**
  - `status` is required, must be a string, and must be one of `pending`, `in_progress`, `completed`, `paid` (returns `422` `{ status: 422, error: "invalid status", field: "status" }`).
- **Controller (`updateRepairStatus` in `src/controllers/repairsController.js`):**
  - Reads `request.params.id` and `request.validatedBody.status`, calls `repairsStore.updateStatus(id, status)`, and returns `200` `{ status: 200, data: updatedRepair }` or `404` if the repair order does not exist.
- **Automated Tests (`tests/repairs.test.js`):**
  - Happy path (`200` when updating status to `"completed"`)
  - Validation failure (`422` when status is `"cancelled_invalid"` or missing)
  - Edge case (`404` when repair order `:id` does not exist)

---

## 3. Dagala — Solo Checkpoint

- **Spec:** Build `POST /parts/:id/restock` to add incoming supplier units (`addQty`) to an existing spare part's inventory count without exceeding the shop shelf capacity (`999`).
- **Validation Rules (`validateRestockInput`):**
  - `addQty` is required, must be an integer number, and must be between `1` and `500` (`422` `{ status: 422, error: "addQty out of range", field: "addQty" }`).
- **Controller (`restockPart` in `src/controllers/partsController.js`):**
  - Reads `request.params.id` and `request.validatedBody.addQty`, checks if part exists (`404` if missing) and ensures `part.qty + addQty <= 999` (`422` if shelf capacity exceeded), then calls `partsStore.restock(id, addQty)` and returns `200` `{ status: 200, data: updatedPart }`.
- **Automated Tests (`tests/parts.test.js`):**
  - Happy path (`200` when adding `10` units to an existing part)
  - Validation failure (`422` when `addQty` is negative or non-numeric)
  - Edge case (`422` when restock exceeds max capacity `999`, and `404` when part ID does not exist)
