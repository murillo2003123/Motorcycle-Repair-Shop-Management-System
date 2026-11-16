# Week 11 — AI Prompt Log (`/docs/ai-notes/week-11.md`)

**Phase 4 Policy:** AI is permitted with prompt logging; every AI-assisted bug fix was reviewed and verified with automated regression tests before merging.

---

## Bug Fixes & Technical Debt Paid Down

### 1. Alvin Murillo (`alvinmurillo2003@gmail.com`) — Fix P0 `BUG-01` (Referential Check on Customer Delete) & Env Config
- **Prompt Used:**
  > "Update `deleteCustomer` so that before deleting a customer, it checks `repairsStore.findAll()` for any repair order referencing `customerId === id` and returns a 422 error if active repairs exist."
- **Human Review & Verification:**
  - Verified that deleting Customer #1 (who has Repair #1) returns `422 { status: 422, error: "cannot delete customer with existing repair orders", field: "id" }`, while deleting a customer with no repair orders succeeds (`200`).
  - Added regression test in `tests/customers.test.js`.
  - Extracted environment config into `src/config.js` with `APP_DEBUG = false` in production.

### 2. John Angelo Cabatingan (`johnangelocabatingan2003@gmail.com`) — Fix P1 `BUG-02` & P2 `BUG-04` (XSS Tag Rejection & Whitespace Guard)
- **Prompt Used:**
  > "Refactor string validation in `src/middleware/validation.js` into a shared ` containsHtmlTags(value)` guard clause and trim strings before checking presence so whitespace-only inputs return `<field> is required`."
- **Human Review & Verification:**
  - Eliminated duplicate string-trim checks across `validateCustomerInput`, `validateRepairInput`, and `validatePartInput` (paying down technical debt).
  - Added regression tests in `tests/repairs.test.js` for `<script>` rejection and whitespace-only `"   "` rejection.

### 3. Keanu Dagala (`keanudagala2003@gmail.com`) — Fix P1 `BUG-03` (Unique SKU & Plate Number Enforcement)
- **Prompt Used:**
  > "Add a referential/uniqueness check in `validatePartInput` and `validateCustomerInput` so duplicate `sku` or duplicate `plateNumber` values return a 422 validation error on create or when colliding with another record on update."
- **Human Review & Verification:**
  - Verified `PUT /parts/:id` and `PUT /customers/:id` allow updating a record while keeping its own existing `sku` / `plateNumber`, and only return `422` when colliding with a *different* record's ID.
  - Added regression tests in `tests/parts.test.js`.
