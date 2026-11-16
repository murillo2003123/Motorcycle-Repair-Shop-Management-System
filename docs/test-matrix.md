# Week 10 — Manual QA Test Matrix & Bug Triage Log (`/docs/test-matrix.md`)

**QA Team:** Alvin Murillo, Cabatingan, and Dagala

---

## Task 1 & Task 2 — Feature × Scenario Test Matrix

Every feature was tested across **6 scenarios**: Happy Path, Boundary Values, Invalid Data (`422`), Empty State, Permissions (`403`), and Adversarial Input (XSS / SQLi / Out-of-Order).

| Feature / Route | Owner | Happy Path | Boundary (`min`/`max`) | Invalid Input (`422`) | Empty / `404` State | Permissions (`403`) | Adversarial (`<script>`, huge nums) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`GET /customers`** (List Customers) | **Murillo** | PASS (`200`) | PASS (100+ rows) | N/A | PASS (Empty state UI) | PASS (Public read) | PASS (Escaped HTML) |
| **`GET /customers/:id`** (Show Customer) | **Murillo** | PASS (`200`) | PASS (`id=1`) | N/A | PASS (`404` card shown) | PASS | PASS (`id=abc` → `404`) |
| **`POST /customers`** (Create Customer) | **Murillo** | PASS (`201`) | PASS (2 & 80 char name) | PASS (`422` inline error) | PASS (Empty body → `422`) | PASS | PASS (`<script>` rejected `422`) |
| **`PUT /customers/:id`** (Update Customer) | **Murillo** | PASS (`200`) | PASS (80 char model) | PASS (`422` inline error) | PASS (`404` on missing ID) | PASS | PASS (`<script>` rejected `422`) |
| **`DELETE /customers/:id`** (Delete Customer) | **Murillo** | PASS (`200`) | PASS | N/A | PASS (`404` on double-delete) | PASS (`403` for Guest) | PASS (Referential check) |
| **`GET /customers/plate/:plate`** (Checkpoint) | **Murillo** | PASS (`200`) | PASS (`AB-123`) | PASS (`422` bad plate) | PASS (`404` unknown plate) | PASS | PASS (URL-encoded specials) |
| **`GET /repairs`** (List Repairs) | **Cabatingan** | PASS (`200`) | PASS (`?status=paid`) | PASS (`422` bad filter) | PASS (Empty state UI) | PASS | PASS |
| **`GET /repairs/:id`** (Show Repair) | **Cabatingan** | PASS (`200`) | PASS (`id=1`) | N/A | PASS (`404` card shown) | PASS | PASS |
| **`POST /repairs`** (Create Repair) | **Cabatingan** | PASS (`201`) | PASS (`laborCost: 0` & `100000`) | PASS (`422` inline error) | PASS (Missing body → `422`) | PASS | PASS (`Infinity`/`NaN`/`<script>` → `422`) |
| **`PUT /repairs/:id`** (Update Repair) | **Cabatingan** | PASS (`200`) | PASS (5 & 200 char issue) | PASS (`422` inline error) | PASS (`404` on missing ID) | PASS | PASS (`<script>` rejected `422`) |
| **`PATCH /repairs/:id/status`** (Checkpoint) | **Cabatingan** | PASS (`200`) | PASS (All 4 statuses) | PASS (`422` bad status) | PASS (`404` on missing ID) | PASS | PASS |
| **`DELETE /repairs/:id`** (Delete Repair) | **Cabatingan** | PASS (`200`) | PASS | N/A | PASS (`404` on missing ID) | PASS (`403` other mechanic) | PASS (Double-delete → `404`) |
| **`GET /parts`** (List Parts) | **Dagala** | PASS (`200`) | PASS (`?category=brakes`) | PASS (`422` bad filter) | PASS (Empty state UI) | PASS | PASS |
| **`GET /parts/:id`** (Show Part) | **Dagala** | PASS (`200`) | PASS (`id=1`) | N/A | PASS (`404` card shown) | PASS | PASS |
| **`POST /parts`** (Create Part) | **Dagala** | PASS (`201`) | PASS (`qty: 0` & `999`) | PASS (`422` `qty: "cake"`) | PASS (Empty body → `422`) | PASS | PASS (`<script>` & duplicate SKU → `422`) |
| **`PUT /parts/:id`** (Update Part) | **Dagala** | PASS (`200`) | PASS (`unitPrice: 1` & `100000`) | PASS (`422` inline error) | PASS (`404` on missing ID) | PASS | PASS |
| **`POST /parts/:id/restock`** (Checkpoint) | **Dagala** | PASS (`200`) | PASS (`addQty: 1` & `500`) | PASS (`422` `addQty: -5`) | PASS (`404` on missing ID) | PASS | PASS (Overflow `> 999` → `422`) |
| **`DELETE /parts/:id`** (Delete Part) | **Dagala** | PASS (`200`) | PASS | N/A | PASS (`404` on missing ID) | PASS (`403` for Customer) | PASS |

---

## Task 5 — Triaged Bug Log (Found in Week 10 QA, Resolved in Week 11)

| Bug ID | Severity | Title | Steps to Reproduce | Expected vs. Actual | Owner | Status (Week 11) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | **P0** | Deleting a Customer leaves orphaned Repair Job Orders referencing deleted `customerId` | 1. Create Repair for Customer #1.<br>2. Delete Customer #1.<br>3. View Repair #1 customer reference. | **Expected:** Prevent deleting a customer who still has active repair orders (`422` referential integrity error).<br>**Actual:** Customer deleted while repair still pointed to `customerId: 1`. | **Alvin Murillo** | **FIXED & TESTED** (`week11/bugfix-murillo`) |
| **BUG-02** | **P1** | Stored XSS tags (`<script>`) in `name`, `issue`, or `part.name` were accepted by backend validation | 1. Send `POST /customers` with `name: "<script>alert(1)</script>"`.<br>2. Observe `201` response. | **Expected:** Reject strings containing HTML/script tags (`<` or `>`) with `422`.<br>**Actual:** Saved string if length was 2–80 chars. | **Cabatingan** | **FIXED & TESTED** (`week11/bugfix-cabatingan`) |
| **BUG-03** | **P1** | Duplicate `plateNumber` on `POST /customers` or duplicate `sku` on `POST /parts` allowed two records with identical unique identifiers | 1. Send `POST /parts` with existing `sku: "OIL-10W40"`.<br>2. Observe second part created with duplicate SKU. | **Expected:** Return `422 { status: 422, error: "sku already exists", field: "sku" }`.<br>**Actual:** Created duplicate SKU. | **Dagala** | **FIXED & TESTED** (`week11/bugfix-dagala`) |
| **BUG-04** | **P2** | Whitespace-only strings (e.g. `"   "`) produced generic length error instead of `"is required"` | 1. Send `POST /repairs` with `issue: "     "`. | **Expected:** `"issue is required"` (`422`).<br>**Actual:** Returned `"issue is too short"`. | **Cabatingan** | **FIXED & TESTED** (`week11/bugfix-cabatingan`) |
