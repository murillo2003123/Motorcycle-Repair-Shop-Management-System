# Week 7 — End-to-End Form Binding Test Log (`/docs/binding-tests.md`)

**Tested by:** Alvin Murillo (`customers`), Cabatingan (`repairs`), and Dagala (`parts`)

---

## Task 4 — End-to-End UI Form Binding Verification

| # | Module & Owner | Test Action in UI | HTTP Request Sent | Backend Response | UI Behavior Verified | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Customers (Murillo)** | Submit **New Customer** form with valid data (`Rico Blanco`, `09175556677`, `MTR-7788`, `Suzuki Raider R150`) | `POST /customers` | `201 Created` `{ status: 201, data: { id: 3, ... } }` | Submit button disabled & showed `"Saving..."` while pending; modal closed; new row #3 appeared in table without page reload; success toast displayed. | **PASS** |
| **2** | **Customers (Murillo)** | Click **Edit** on Customer #1 (`Juan Dela Cruz`), change model to `Honda ADV 160`, click **Save Changes** | `PUT /customers/1` | `200 OK` `{ status: 200, data: { id: 1, ... } }` | Form opened pre-filled with existing values; changes persisted; row #1 updated in-place in UI. | **PASS** |
| **3** | **Customers (Murillo)** | Submit **New Customer** with invalid plate `badplate` | `POST /customers` | `422 Unprocessable Entity` `{ status: 422, error: "...", field: "plateNumber" }` | Modal stayed open; `plateNumber` input highlighted red; inline error message displayed under the Plate Number field. | **PASS** |
| **4** | **Repairs (Cabatingan)** | Submit **New Repair Job** (`customerId: 1`, `issue: "Replace rear shock absorber"`, `mechanic: "Berto"`, `laborCost: 650`, `status: "pending"`) | `POST /repairs` | `201 Created` `{ status: 201, data: { id: 3, ... } }` | Button disabled during submit; new repair job row #3 rendered immediately; form reset; toast shown. | **PASS** |
| **5** | **Repairs (Cabatingan)** | Click **Edit** on Repair #2, update `status` to `completed` and `laborCost` to `550` | `PUT /repairs/2` | `200 OK` `{ status: 200, data: { id: 2, ... } }` | Form pre-filled; updated status badge (`completed`) and labor cost (`₱550.00`) reflected immediately. | **PASS** |
| **6** | **Repairs (Cabatingan)** | Submit **New Repair Job** with negative labor cost `-200` | `POST /repairs` | `422 Unprocessable Entity` `{ status: 422, error: "laborCost out of range", field: "laborCost" }` | Inline field error shown under `laborCost`: *"Please enter a labor cost between ₱0 and ₱100,000."* | **PASS** |
| **7** | **Parts (Dagala)** | Submit **Add Spare Part** (`name: "Drive Belt Click 125"`, `sku: "BLT-CLK125"`, `qty: 18`, `unitPrice: 780`, `category: "engine"`) | `POST /parts` | `201 Created` `{ status: 201, data: { id: 3, ... } }` | Button disabled while pending; new part row added to inventory table; form reset. | **PASS** |
| **8** | **Parts (Dagala)** | Click **Edit** on Part #1, update `qty` to `30` and `unitPrice` to `340` | `PUT /parts/1` | `200 OK` `{ status: 200, data: { id: 1, ... } }` | Edit form pre-filled; updated quantity and price persisted and rendered in table. | **PASS** |
| **9** | **Parts (Dagala)** | Submit **Add Spare Part** with `qty: 1500` (exceeds max 999) | `POST /parts` | `422 Unprocessable Entity` `{ status: 422, error: "qty out of range", field: "qty" }` | Inline field error displayed under `qty` field; button re-enabled. | **PASS** |
