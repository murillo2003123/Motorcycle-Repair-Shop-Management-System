# Week 8 — AI Prompt Log (`/docs/ai-notes/week-08.md`)

**Phase 3 Policy:** AI is ON and required. Prompts and human review notes are recorded below.

---

## Key Prompts & Provenance Log

### 1. Alvin Murillo — Human-Readable Error Translator (`Hand-written` / `AI-modified`)
- **Prompt Used:**
  > "Write a helper function `formatFriendlyError(field, rawError)` that converts backend validation strings like `plateNumber format is invalid` or `qty out of range` into clear, actionable sentences in a motorcycle shop tone without exposing status codes."
- **Human Review & Fixes (`Alvin Murillo`):**
  - Removed technical jargon (`422`, `enum`, `regex`) from AI suggestions and replaced them with specific fixes (e.g., *"Plate number must match format ABC-1234."* and *"Stock quantity must be between 0 and 999 units."*).

### 2. Cabatingan — 404 Not-Found State & Delete Confirmation Flow (`Hand-written`)
- **Prompt Used:**
  > "Create a reusable confirmation modal workflow before calling `DELETE` on `/customers/:id`, `/repairs/:id`, or `/parts/:id`, including a disabled `Deleting...` state."
- **Human Review & Fixes (`Cabatingan`):**
  - Hand-wrote the `404` fallback state inside `RecordDetailCard` so requesting a deleted or missing record ID displays a helpful card with a recovery button instead of an empty modal.

### 3. Dagala — Network / 500 Failure Banner & Retry Mechanism (`AI-modified`)
- **Prompt Used:**
  > "Add a global error state component with a Retry callback button that triggers whenever `fetch()` throws a network error or returns HTTP 500."
- **Human Review & Fixes (`Dagala`):**
  - Added a simulated network latency & failure toggle in the UI header so the team and instructor can test loading spinners, disabled buttons, and `500`/network retry recovery live on screen.
