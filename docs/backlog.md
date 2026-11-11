# Week 2 — Feature Backlog (Deliverable 1: Scoping & Wireframes)

Every story follows the standard user story format and maps directly to a RESTful CRUD operation in [`/docs/routes.md`](routes.md).

---

## Module 1: Customers & Motorcycles (`customers`) — Owner: Alvin Murillo

| Story ID | Operation | User Story | Acceptance Criteria | Route Mapped |
| :--- | :--- | :--- | :--- | :--- |
| **US-C1** | **Read (List)** | As a **shop receptionist**, I want to view all registered customers and their motorcycles so I can quickly look up returning riders. | Returns `200` with array of customer records in `{ status, data }` envelope. | `GET /customers` |
| **US-C2** | **Read (One)** | As a **mechanic**, I want to view a single customer's profile and motorcycle details by ID so I can verify their bike model and contact number. | Returns `200` with matching customer record, or `404` if not found. | `GET /customers/:id` |
| **US-C3** | **Create** | As a **shop receptionist**, I want to register a new customer with their name, phone number, plate number, and motorcycle model. | Validates fields; returns `201` with created record, or `422` on invalid input. | `POST /customers` |
| **US-C4** | **Update** | As a **shop receptionist**, I want to update a customer's phone number, motorcycle model, or plate number when their details change. | Validates fields; returns `200` with updated record, `404` if missing, `422` if invalid. | `PUT /customers/:id` |
| **US-C5** | **Delete** | As a **shop owner**, I want to delete an obsolete or duplicate customer profile so our records stay clean. | Requires shop owner/admin permission (`403` otherwise); returns `200` on deletion. | `DELETE /customers/:id` |
| **US-C6** *(Checkpoint)* | **Read by Plate** | As a **mechanic**, I want to look up a customer record by their motorcycle plate number so I can identify a bike parked in the bay. | Validates plate format; returns `200` with record or `404` if not registered. | `GET /customers/plate/:plateNumber` |

---

## Module 2: Repair Job Orders (`repairs`) — Owner: Cabatingan

| Story ID | Operation | User Story | Acceptance Criteria | Route Mapped |
| :--- | :--- | :--- | :--- | :--- |
| **US-R1** | **Read (List)** | As a **shop manager**, I want to view all repair job orders so I can monitor active work in the shop. | Returns `200` with array of repair job orders in `{ status, data }` envelope. | `GET /repairs` |
| **US-R2** | **Read (One)** | As a **mechanic**, I want to view a specific repair job order by ID so I can read the reported issue and labor estimate. | Returns `200` with the repair order, or `404` if ID does not exist. | `GET /repairs/:id` |
| **US-R3** | **Create** | As a **shop receptionist**, I want to create a new repair job order linked to an existing customer, specifying the issue, assigned mechanic, labor cost, and status. | Validates referential `customerId`, `issue`, `mechanic`, `laborCost`, `status`; returns `201` or `422`. | `POST /repairs` |
| **US-R4** | **Update** | As a **mechanic**, I want to edit a repair job order's diagnosis, labor cost, or status as work progresses. | Validates fields; returns `200` with updated order, `404` if missing, `422` if invalid. | `PUT /repairs/:id` |
| **US-R5** | **Delete** | As a **shop owner**, I want to delete a cancelled or mistakenly created repair job order. | Requires owner/admin authorization (`403` for unauthorized users); returns `200`. | `DELETE /repairs/:id` |
| **US-R6** *(Checkpoint)* | **Update Status** | As a **mechanic**, I want to update only the workflow status of a repair job order (`pending`, `in_progress`, `completed`, `paid`). | Validates `status` is one of allowed values; returns `200` or `422` / `404`. | `PATCH /repairs/:id/status` |

---

## Module 3: Spare Parts Inventory (`parts`) — Owner: Dagala

| Story ID | Operation | User Story | Acceptance Criteria | Route Mapped |
| :--- | :--- | :--- | :--- | :--- |
| **US-P1** | **Read (List)** | As a **parts clerk**, I want to list all spare parts in the inventory so I can check stock quantities and prices. | Returns `200` with array of parts in `{ status, data }` envelope. | `GET /parts` |
| **US-P2** | **Read (One)** | As a **mechanic**, I want to inspect a single spare part by ID so I can check its SKU, category, and unit price. | Returns `200` with part details, or `404` if not found. | `GET /parts/:id` |
| **US-P3** | **Create** | As a **parts clerk**, I want to add a new spare part with name, SKU, quantity, unit price, and category. | Validates all fields; returns `201` with created part or `422` on validation error. | `POST /parts` |
| **US-P4** | **Update** | As a **parts clerk**, I want to update a spare part's quantity, price, or category after physical stock counts. | Validates fields; returns `200` with updated part, `404` if missing, `422` if invalid. | `PUT /parts/:id` |
| **US-P5** | **Delete** | As a **shop owner**, I want to remove discontinued spare parts from the catalog. | Requires owner/admin authorization (`403` if forbidden); returns `200`. | `DELETE /parts/:id` |
| **US-P6** *(Checkpoint)* | **Restock Part** | As a **parts clerk**, I want to add incoming supplier stock (`addQty`) to an existing part's quantity. | Validates `addQty` (number, 1–500); increments `qty` and returns `200` or `422` / `404`. | `POST /parts/:id/restock` |
