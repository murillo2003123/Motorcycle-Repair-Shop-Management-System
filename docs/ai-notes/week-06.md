# Week 6 — AI Prompt Log (`/docs/ai-notes/week-06.md`)

**Phase 3 Policy:** AI is ON and required for scaffolding views/states, followed by human review and fixes.

---

## Prompts & Provenance Log

### 1. Alvin Murillo — Customers Views & Navigation Shell
- **Prompt Used:**
  > "Scaffold a semantic HTML5 section for a Motorcycle Repair Shop Customers table with columns ID, Name, Phone, Plate Number, Motorcycle Model, and Actions (View, Edit, Delete), plus a search-by-plate bar."
- **Review & Human Fixes Made (`AI-modified`):**
  - Added proper `<label for="plate-search-input">` and `aria-label` attributes on action buttons.
  - Replaced generic `<div>` wrappers with semantic `<header>`, `<nav>`, `<main>`, `<section>`, and `<table>` / `<thead>` / `<tbody>`.
  - Hand-wrote the `DataTableRow` renderer (`C-02`) to escape user strings against XSS before rendering.

### 2. Cabatingan — Repair Job Orders Views & Detail Card
- **Prompt Used:**
  > "Generate an accessible HTML form modal and detail description list (`<dl>`) for creating and editing a motorcycle repair job order with fields customerId, issue, mechanic, laborCost, and status."
- **Review & Human Fixes Made (`AI-modified` / `Hand-written`):**
  - Hand-wrote `EntityFormModal` (`C-05`) field containers so every input has a dedicated `<small class="field-error" data-error-for="...">` element matching our Week 4 `{ status: 422, error, field }` backend envelope.
  - Hand-wrote `StatusBadge` (`C-03`) color classes for `pending`, `in_progress`, `completed`, and `paid`.

### 3. Dagala — Spare Parts Views & Empty / Loading / Error States
- **Prompt Used:**
  > "Create reusable HTML/CSS state templates for an Empty list state, a Loading spinner state, and an Error state with a Retry button for a vanilla JS CRUD web app."
- **Review & Human Fixes Made (`AI-modified`):**
  - Added `role="status"` on the loading indicator and `role="alert"` on the error banner so screen readers announce state transitions.
  - Hand-wrote `ConfirmDeleteDialog` (`C-07`) to prevent accidental deletion of customers, repair orders, or parts.

---

## Component Provenance Summary

| Component / View | Label | Owner |
| :--- | :--- | :--- |
| `AppHeaderNav` & Customers Screen | **AI-modified** | Alvin Murillo |
| `DataTableRow` (`renderRow`) | **Hand-written** | Alvin Murillo |
| `StatusBadge` & `EntityFormModal` | **Hand-written** | Cabatingan |
| `RecordDetailCard` & Repairs Screen | **AI-modified** | Cabatingan |
| `StateBanner` (Empty / Loading / Error) | **AI-modified** | Dagala |
| `ConfirmDeleteDialog` | **Hand-written** | Dagala |
| `ToastNotification` | **AI-generated** (reviewed by Dagala) | Dagala |
