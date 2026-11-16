# Week 10 — AI Prompt Log (`/docs/ai-notes/week-10.md`)

**Phase 4 Policy:** AI is permitted for test scaffolding only; QA matrix design and adversarial bug hunting were conducted by the team.

---

## Prompts & Human QA Review

1. **Alvin Murillo — Adversarial XSS & Referential Delete Test Scaffolding (`AI-modified`)**
   - **Prompt Used:**
     > "Scaffold Arrange-Act-Assert test cases in `tests/customers.test.js` that attempt to inject `<script>alert(1)</script>` into `name` and attempt to delete a customer who still has an existing repair order."
   - **Human Adjustments:**
     - Designed the referential integrity check in `deleteCustomer` so deleting a customer with linked repair orders returns `422 { status: 422, error: "cannot delete customer with existing repair orders", field: "id" }`, while a customer with no repair orders deletes cleanly (`200`).

2. **Cabatingan — Boundary & Whitespace Adversarial Tests (`Hand-written`)**
   - Designed boundary tests for `laborCost: 0`, `laborCost: 100000`, `laborCost: 100001`, and whitespace-only strings (`"   "`).

3. **Dagala — Duplicate SKU & Overflow Restock Tests (`AI-modified`)**
   - **Prompt Used:**
     > "Write unit test assertions for duplicate SKU rejection on `POST /parts` and `PUT /parts/:id`."
   - **Human Adjustments:**
     - Ensured `PUT /parts/:id` allows keeping the *same* SKU on the part being edited (`existing.id === Number(id)`), while rejecting collisions with *other* parts.
