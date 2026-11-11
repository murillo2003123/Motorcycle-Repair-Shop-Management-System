# Week 6 — Reusable UI Component Map (`/docs/components.md`)

**Prepared by:** Alvin Murillo, Cabatingan, and Dagala

---

## Task 1 — Shared Reusable Components

We broke our Week 2 wireframes into **8 reusable UI components** built once and shared across all three modules (`customers`, `repairs`, `parts`):

| Component ID | Component Name | Purpose & Semantic HTML Elements | Provenance Label | Owner |
| :--- | :--- | :--- | :--- | :--- |
| **C-01** | `AppHeaderNav` | Top navigation bar (`<header>`, `<nav>`, `<button role="tab">`) for switching between Customers, Repair Orders, and Spare Parts, plus active Role Switcher & QA Fault Simulator. | **AI-modified** | **Alvin Murillo** |
| **C-02** | `DataTableRow` | Reusable table row (`<tr>`, `<td>`) with action buttons (`View`, `Edit`, `Delete`, and module-specific quick action). Reused across all 3 record lists. | **Hand-written** | **Alvin Murillo** |
| **C-03** | `StatusBadge` | Semantic `<span class="badge">` displaying repair status (`pending`, `in_progress`, `completed`, `paid`) and stock health (`In Stock`, `Low Stock`). | **Hand-written** | **Cabatingan** |
| **C-04** | `RecordDetailCard` | Semantic `<article>` / `<dl>` modal showing full single-record details (`GET /:resource/:id`) or a clear `404 Not Found` state. | **AI-modified** | **Cabatingan** |
| **C-05** | `EntityFormModal` | Accessible `<form>` with `<label>`, `<input>`, `<select>`, inline `<p class="field-error" role="alert">` for `422` errors, and submit button with spinner (`Saving...`). | **Hand-written** | **Cabatingan** |
| **C-06** | `StateBanner` | Conditional container rendering **Empty State** (0 records), **Loading Skeleton/Spinner**, or **Global Network/500 Error State** with a **Retry** button. | **AI-modified** | **Dagala** |
| **C-07** | `ConfirmDeleteDialog` | Confirmation `<dialog>` / modal requiring explicit confirmation before any `DELETE` request is sent. | **Hand-written** | **Dagala** |
| **C-08** | `ToastNotification` | Polite `<div aria-live="polite">` banner confirming successful Create, Update, Restock, Status Change, or Delete actions. | **AI-generated** *(reviewed & fixed by Dagala)* | **Dagala** |

---

## Screen-to-Component Mapping

| Screen | Route(s) Bound | Composed Components | Screen Owner |
| :--- | :--- | :--- | :--- |
| **1. Customers & Motorcycles Index / List** | `GET /customers`, `GET /customers/plate/:plateNumber` | `AppHeaderNav`, `StateBanner` (Loading/Empty/Error), `DataTableRow`, `ToastNotification` | **Alvin Murillo** |
| **2. Customer Detail View** | `GET /customers/:id` | `RecordDetailCard`, `StateBanner` (404 Not Found / Loading) | **Alvin Murillo** |
| **3. Customer Create / Edit Form** | `POST /customers`, `PUT /customers/:id` | `EntityFormModal`, inline `422` field error slots, `ToastNotification` | **Alvin Murillo** |
| **4. Repair Job Orders Index / List** | `GET /repairs`, `PATCH /repairs/:id/status` | `AppHeaderNav`, `StateBanner`, `DataTableRow`, `StatusBadge`, `ToastNotification` | **Cabatingan** |
| **5. Repair Job Order Detail View** | `GET /repairs/:id` | `RecordDetailCard`, `StatusBadge`, `StateBanner` (404 Not Found / Loading) | **Cabatingan** |
| **6. Repair Job Create / Edit Form** | `POST /repairs`, `PUT /repairs/:id` | `EntityFormModal`, `StatusBadge`, inline `422` field error slots | **Cabatingan** |
| **7. Spare Parts Inventory Index / List** | `GET /parts`, `POST /parts/:id/restock` | `AppHeaderNav`, `StateBanner`, `DataTableRow`, `StatusBadge`, `ToastNotification` | **Dagala** |
| **8. Spare Part Detail & Create/Edit Form** | `GET /parts/:id`, `POST /parts`, `PUT /parts/:id` | `RecordDetailCard`, `EntityFormModal`, `ConfirmDeleteDialog`, `ToastNotification` | **Dagala** |
