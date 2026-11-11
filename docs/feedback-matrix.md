# Week 8 — UI Feedback Matrix (`/docs/feedback-matrix.md`)

**Prepared by:** Alvin Murillo, Cabatingan, and Dagala (Deliverable 3: Interface & View Binding)

Every user action in the **Motorcycle Repair Shop Management System** defines three explicit, consistent UI states: **Loading**, **Success**, and **Error** (`422` validation, `403` permission, `404` not found, and `500`/network failure).

---

## Task 1 — Complete Action Feedback Matrix

| Action | Route | Loading State | Success State | Error States (`422` / `403` / `404` / `500` & Network) | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Load Customers List** | `GET /customers` | Table skeleton & `"Loading customers..."` spinner | Customer rows render (or Empty State if 0 records) | **Network / 500:** Error banner *"Could not load customer records. Please check your connection and try again."* + **[Retry]** button | **Alvin Murillo** |
| **View Customer Detail** | `GET /customers/:id` | Detail modal shows `"Loading customer details..."` | Customer & motorcycle details render in `<dl>` card | **404:** Clear *"Customer record not found — it may have been removed."* state inside modal | **Alvin Murillo** |
| **Create Customer** | `POST /customers` | Submit button disabled + spinner `"Saving..."` | New row appears in table; form closes & resets; toast *"Customer registered successfully."* | **422:** Field highlighted + friendly inline fix (e.g. *"Plate number must match format ABC-1234."*)<br>**500/Network:** Form banner *"Could not save customer right now. Please try again."* | **Alvin Murillo** |
| **Update Customer** | `PUT /customers/:id` | Submit button disabled + spinner `"Saving..."` | Row updates in-place; modal closes; toast *"Customer profile updated."* | **422:** Inline field error next to offending input<br>**404:** *"This customer no longer exists. Refreshing list..."* | **Alvin Murillo** |
| **Delete Customer** | `DELETE /customers/:id` | Confirmation modal button disabled + `"Deleting..."` | Row removed from table; toast *"Customer deleted."* | **403:** Banner *"Action restricted: Only the Shop Owner or Admin can delete records."*<br>**404:** *"Customer was already removed."* | **Alvin Murillo** |
| **Search by Plate** | `GET /customers/plate/:plateNumber` | Search button disabled + `"Searching..."` | Matching customer detail card opens | **422:** Inline hint *"Enter a valid plate like ABC-1234."*<br>**404:** *"No customer found with plate number [PLATE]."* | **Alvin Murillo** |
| **Load Repairs List** | `GET /repairs` | Table skeleton & `"Loading repair job orders..."` spinner | Repair order rows render with status badges | **Network / 500:** Error banner *"Could not load repair job orders."* + **[Retry]** button | **Cabatingan** |
| **View Repair Detail** | `GET /repairs/:id` | Modal shows `"Loading repair job order..."` | Full repair order diagnosis & labor details render | **404:** Clear *"Repair job order not found."* state | **Cabatingan** |
| **Create Repair Job** | `POST /repairs` | Submit button disabled + spinner `"Saving..."` | New job order row added; form resets; toast *"Repair job order created."* | **422:** Inline error next to field (e.g. *"Labor cost must be between ₱0 and ₱100,000."* or *"Selected Customer ID does not exist."*) | **Cabatingan** |
| **Update Repair Job** | `PUT /repairs/:id` | Submit button disabled + spinner `"Saving..."` | Row updates in-place; toast *"Repair job order updated."* | **422:** Inline field error<br>**404:** *"Repair job order not found."* | **Cabatingan** |
| **Quick Status Change** | `PATCH /repairs/:id/status` | Status control disabled + `"Updating..."` | Status badge updates; toast *"Job status updated to [STATUS]."* | **422:** *"Please select a valid workflow status."*<br>**404:** *"Repair job order no longer exists."* | **Cabatingan** |
| **Delete Repair Job** | `DELETE /repairs/:id` | Confirm button disabled + `"Deleting..."` | Row removed; toast *"Repair job order deleted."* | **403:** *"Action restricted: You can only delete repair orders you own or manage."* | **Cabatingan** |
| **Load Parts Inventory** | `GET /parts` | Table skeleton & `"Loading spare parts..."` spinner | Spare part rows render with stock badges | **Network / 500:** Error banner *"Could not load spare parts inventory."* + **[Retry]** button | **Dagala** |
| **View Part Detail** | `GET /parts/:id` | Modal shows `"Loading part details..."` | Part SKU, category, stock, and price render | **404:** Clear *"Spare part not found."* state | **Dagala** |
| **Create Spare Part** | `POST /parts` | Submit button disabled + spinner `"Saving..."` | New part row added; form closes; toast *"Spare part added to inventory."* | **422:** Inline field error (e.g. *"Quantity must be a whole number between 0 and 999."*) | **Dagala** |
| **Update Spare Part** | `PUT /parts/:id` | Submit button disabled + spinner `"Saving..."` | Row updates in-place; toast *"Spare part updated."* | **422:** Inline field error<br>**404:** *"Spare part not found."* | **Dagala** |
| **Restock Spare Part** | `POST /parts/:id/restock` | Restock button disabled + `"Restocking..."` | Quantity increments; toast *"Added [N] units to stock."* | **422:** Inline field error *"Restock quantity must be 1–500 and total stock cannot exceed 999."* | **Dagala** |
| **Delete Spare Part** | `DELETE /parts/:id` | Confirm button disabled + `"Deleting..."` | Row removed; toast *"Spare part removed from catalog."* | **403:** *"Action restricted: Only the Shop Owner or Admin can delete inventory items."* | **Dagala** |
