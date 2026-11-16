# Week 12 — Team Retrospective, Presentation & Oral Defense Guide (`/docs/retrospective.md`)

**Team Members:**
- **Alvin Murillo** (`alvinmurillo2003@gmail.com`) — Repo Lead & Builder (`customers` module)
- **John Angelo Cabatingan** (`johnangelocabatingan2003@gmail.com`) — Board Lead & Builder (`repairs` module)
- **Keanu Dagala** (`keanudagala2003@gmail.com`) — Scribe & Builder (`parts` module)

---

## Task 1 — Blameless Team Retrospective

### What Went Well
1. **Standardized Envelopes Early (Week 3 & 4):** Agreeing on `{ status, data }` for success and `{ status: 422, error, field }` for validation failures in Week 3 saved hours in Week 7 & 8 when binding forms to inline field errors.
2. **Clear Module Ownership Across All 3 Members:** Splitting the domain into **Customers & Motorcycles (Alvin Murillo)**, **Repair Job Orders (John Angelo Cabatingan)**, and **Spare Parts Inventory (Keanu Dagala)** meant zero merge conflicts and clear accountability on the task board.
3. **Guard-Clause Validation + Thin Controllers:** Keeping validation in `src/middleware/validation.js` and persistence in `src/data/*Store.js` made the controllers in `src/controllers/*.js` under 20 lines each and trivial to unit-test with Arrange–Act–Assert.

### What Didn't Go Well (Challenges Encountered)
1. **Cross-Record Referential Integrity Gaps Found in Week 10 QA:** Initially, deleting a customer did not check whether repair orders still referenced that `customerId`, and creating a part didn't check for duplicate `sku` codes. Our Week 10 Test Matrix caught both (`BUG-01` and `BUG-03`) and we fixed them in Week 11.
2. **String Coercion from HTML Form Inputs:** In Week 7, HTML `<input type="number">` fields returned strings (`"450"`) which failed our strict `typeof data.laborCost !== 'number'` backend validator until we explicitly converted numeric form fields before sending JSON.

### What We Would Change Next Time
1. **Enforce Uniqueness & Foreign-Key Rules in Week 4:** Add uniqueness (`plateNumber`, `sku`) and delete-constraint rules directly to the Week 4 validation matrix from day one instead of waiting for Week 10 adversarial QA.
2. **Write Shared Validation Helpers Earlier:** Extracting shared string-trim and HTML-tag guards in Week 4 would have prevented minor duplication before our Week 11 refactor.

---

## Task 2 — Final Presentation Deck Outline (Problem → Solution → Architecture → Live Demo → Lessons)

1. **Slide 1 — The Problem (Alvin Murillo):** Neighborhood motorcycle repair shops ("talyer") lose track of customer bikes, ongoing repair statuses, and spare part stock when relying on paper logbooks.
2. **Slide 2 — The Solution (John Angelo Cabatingan):** A unified CRUD web application managing **Customers & Motorcycles**, **Repair Job Orders**, and **Spare Parts Inventory** with defensive validation and role-based permissions.
3. **Slide 3 — Architecture by Following a Request (Keanu Dagala):**
   `Browser Form Submit` → `Router (src/router.js)` → `Auth Guard (403)` → `Guard-Clause Validator (422)` → `Thin Controller` → `Data Store` → `Standardized JSON Response ({ status, data })` → `Inline UI Feedback`.
4. **Slide 4 — Live Demo Click-Path (All 3 Members):**
   - **Murillo:** Register a customer & motorcycle (`POST /customers`), search by plate (`GET /customers/plate/:plateNumber`), trigger an inline `422` error with an invalid plate.
   - **Cabatingan:** Create a repair job order linked to that customer (`POST /repairs`), advance status (`PATCH /repairs/:id/status`), demonstrate `403` guard when a guest tries to delete.
   - **Dagala:** Add a spare part (`POST /parts`), restock inventory (`POST /parts/:id/restock`), trigger `422` shelf capacity overflow (`> 999`), and demonstrate `500`/network error retry recovery.
5. **Slide 5 — What We Learned (All 3 Members):** Why building routing, guard-clause validation, and automated tests by hand in Weeks 3–5 gave us the foundation to review and fix AI-generated code in Weeks 6–11.

---

## Task 5 — Individual Oral Defense Guide (Unassisted Defense Reference)

### 1. Alvin Murillo (`alvinmurillo2003@gmail.com`) — Customers & Motorcycles (`customers`)
- **Files Owned:** `src/controllers/customersController.js`, `src/data/customersStore.js`, `validateCustomerInput` & `validatePlateParam` in `src/middleware/validation.js`, `src/middleware/auth.js`, `tests/customers.test.js`.
- **How a request flows:** When `POST /customers` arrives, `src/router.js` runs `validateCustomerInput(request)` first. It checks `name`, `phone`, `plateNumber` (regex `^[A-Z0-9]{2,4}-[0-9A-Z]{3,5}$` and uniqueness), and `motorcycleModel`. If any check fails, it immediately returns `{ status: 422, error, field }`. If valid, it sets `request.validatedBody` and calls `createCustomer(request)`, which calls `customersStore.save(data)` and returns `{ status: 201, data: customer }`.
- **What happens on missing record / delete with active repairs:** `showCustomer` / `updateCustomer` return `404 { status: 404, error: "customer not found" }`. `deleteCustomer` checks `requireAuthorized` (`403` if not owner/admin) and checks if the customer has linked repair orders (`422` if active repairs exist).

### 2. John Angelo Cabatingan (`johnangelocabatingan2003@gmail.com`) — Repair Job Orders (`repairs`)
- **Files Owned:** `src/controllers/repairsController.js`, `src/data/repairsStore.js`, `validateRepairInput` & `validateRepairStatusInput` in `src/middleware/validation.js`, `tests/repairs.test.js`.
- **How a request flows:** When `POST /repairs` or `PUT /repairs/:id` arrives, `validateRepairInput(request)` validates `customerId` (must be an integer and exist in `customersStore.findById(customerId)` — referential integrity), `issue` (5–200 chars, no HTML tags), `mechanic` (2–60 chars), `laborCost` (`0` to `100,000`), and `status` (`pending`, `in_progress`, `completed`, `paid`). Validated data is saved via `repairsStore.save(data)`.
- **Solo Checkpoint (`PATCH /repairs/:id/status`):** Validates `status` via `validateRepairStatusInput`, updates the status in `repairsStore.updateStatus(id, status)`, and returns `200` or `404`.

### 3. Keanu Dagala (`keanudagala2003@gmail.com`) — Spare Parts Inventory (`parts`)
- **Files Owned:** `src/controllers/partsController.js`, `src/data/partsStore.js`, `validatePartInput` & `validateRestockInput` in `src/middleware/validation.js`, `tests/parts.test.js`.
- **How a request flows:** When `POST /parts` arrives, `validatePartInput(request)` checks `name` (2–100 chars), `sku` (uppercase `^[A-Z0-9-]{3,20}$` and unique across parts), `qty` (integer `0–999`), `unitPrice` (`1–100,000`), and `category` (`engine`, `brakes`, `electrical`, `tires`, `lubricants`, `body`).
- **Solo Checkpoint (`POST /parts/:id/restock`):** Validates `addQty` (`1–500`), checks if the part exists (`404` if not), verifies `existing.qty + addQty <= 999` (`422` if shelf capacity is exceeded), and increments the stock count.
