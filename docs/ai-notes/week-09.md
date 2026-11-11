# Week 9 — Peer Code Review & AI Prompt Log (`/docs/ai-notes/week-09.md`)

**Phase 4 Policy:** Nothing merges without passing automated tests and a substantive peer review using `[blocking]` / `[nit]` labels.

---

## Task 1 & Task 2 — AI-Assisted PRs & Substantive Peer Reviews

### PR #14 — Customer Search Filter & XSS Input Defense (Opened by Alvin Murillo, Reviewed by Cabatingan)
- **Prompt Used by Murillo:**
  > "Add a guard clause to `validateCustomerInput` and `validatePartInput` that rejects HTML/script tags (`<` or `>`) with a 422 error so stored XSS payloads cannot be saved."
- **Peer Review by Cabatingan:**
  - **What the code did well:** Clean regex check `/[<>]/` placed right at the guard-clause layer so controllers remain thin.
  - **[blocking]:** Make sure `validateRepairInput` also checks `issue` and `mechanic` for `<` and `>` characters so repair job notes are equally protected against stored XSS. *(Fixed by Murillo before merge)*
  - **[nit]:** Extract `containsHtmlTags(str)` into a shared helper in `src/middleware/validation.js` to avoid repeating the regex across all 3 validators. *(Addressed)*

### PR #15 — Repair Order Status Filter & Summary Metrics (Opened by Cabatingan, Reviewed by Dagala)
- **Prompt Used by Cabatingan:**
  > "Add optional query parameter filtering `GET /repairs?status=pending` so the shop manager can filter repair job orders by status."
- **Peer Review by Dagala:**
  - **What the code did well:** Preserved backward compatibility with `GET /repairs` when no query parameter is passed.
  - **[blocking]:** When an invalid status filter like `GET /repairs?status=invalid` is passed, it silently returned `200` with an empty array `[]`. It should return `422 { status: 422, error: "invalid status", field: "status" }` to stay consistent with our validation rules. *(Fixed by Cabatingan + unit test added)*
  - **[nit]:** Add a test case in `tests/repairs.test.js` covering `GET /repairs?status=in_progress`. *(Addressed)*

### PR #16 — Spare Parts Low-Stock Filter & Capacity Guard (Opened by Dagala, Reviewed by Alvin Murillo)
- **Prompt Used by Dagala:**
  > "Add a `GET /parts?category=brakes` filter and a unit test verifying that SKU uniqueness/normalization works on `POST /parts`."
- **Peer Review by Alvin Murillo:**
  - **What the code did well:** Clear Arrange–Act–Assert test structure in `tests/parts.test.js`.
  - **[blocking]:** Ensure `GET /parts?category=...` validates the category against `ALLOWED_PART_CATEGORIES` and returns `422` if an unknown category is queried. *(Fixed by Dagala before merge)*
  - **[nit]:** Document the query filter examples in `/docs/routes.md`. *(Addressed)*
