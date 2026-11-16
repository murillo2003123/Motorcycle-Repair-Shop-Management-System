# Week 8 — Error Handling & Failure Path Test Log (`/docs/feedback-tests.md`)

**Tested by:** Alvin Murillo, Cabatingan, and Dagala

---

## Task 6 — Deliberate Failure Path Verification

| # | Failure Category | Action Tested | How Triggered | Observed UI Feedback | Pass / Fail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **422 Validation (Inline)** | Create Customer with empty `name` | Left Customer Name blank and clicked Save | `name` input border turned red; inline message appeared below field: *"Customer name is required (2–80 characters)."* No raw JSON or status code shown. | **PASS** |
| **2** | **422 Validation (Inline)** | Create Repair Order with non-existent `customerId: 999` | Entered `999` in Customer ID field | Inline error under Customer ID: *"Customer ID does not match any registered customer. Please select an existing customer."* | **PASS** |
| **3** | **422 Validation (Inline)** | Restock Spare Part with `addQty: 990` (overflows 999 cap) | Opened Restock on Part #1 (`qty: 25`) and entered `990` | Inline error under Restock Qty: *"Restock quantity would exceed maximum shelf capacity (999 units)."* | **PASS** |
| **4** | **404 Not Found State** | Request a deleted / non-existent record | Clicked "Inspect ID #999 (404 Test)" in QA Toolbar (or viewed deleted record) | Detail modal rendered clean **Not Found State**: *"We couldn't find that record. It may have already been deleted."* with a **[Back to List]** button. Never showed a blank screen. | **PASS** |
| **5** | **403 Forbidden Guard** | Delete a record while switched to **Guest / Customer** role | Selected Role: `Guest (Unauthorized)` in header and confirmed Delete on Customer #1 | Destructive confirmation modal closed and showed clear warning banner: *"Permission denied: Only the Shop Owner or Admin can delete records."* Record remained intact. | **PASS** |
| **6** | **Destructive Confirmation** | Click **Delete** on any Customer, Repair Order, or Part | Clicked `[Delete]` button on row | Confirmation dialog opened asking *"Are you sure you want to delete [Record]? This action cannot be undone."* Clicking **Cancel** aborted safely. | **PASS** |
| **7** | **500 / Network Failure + Retry** | Load list or submit form during simulated network outage | Enabled **"Simulate Network Failure"** toggle in QA bar and clicked Refresh / Save | Loading spinner appeared first, then cleanly transitioned to global error state: *"Unable to reach the shop server. Please check your connection and click Retry."* Clicking **[Retry]** recovered the list once turned off. UI never froze. | **PASS** |
