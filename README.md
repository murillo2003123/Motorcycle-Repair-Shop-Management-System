# Motorcycle Repair Shop Management System

**One-line description:** A full-stack CRUD management system that helps local motorcycle repair shops track customers and their motorcycles, manage repair job orders from intake to completion, and monitor spare parts inventory.

- **Live Deployed App (Vercel):** https://motorcycle-repair-shop-management-s.vercel.app
- **GitHub Repository:** https://github.com/murillo2003123/Motorcycle-Repair-Shop-Management-System

---

## Team Roster & Roles (Weeks 1–12)

| Member Name | GitHub Username | Email | Role | Owned Module, Views & Solo Checkpoint |
| :--- | :--- | :--- | :--- | :--- |
| **Alvin Murillo** | `@murillo2003123` | `alvinmurillo2003@gmail.com` | **Repo Lead & Builder** — Owns branch protection settings, merge hygiene, and Customers/Motorcycles module | **Customers & Motorcycles (`customers`)** + Checkpoint: `GET /customers/plate/:plateNumber` |
| **John Angelo Cabatingan** | `@johnangelocabatingan2003-dot` | `johnangelocabatingan2003@gmail.com` | **Board Lead & Builder** — Owns the task board, keeps tickets current, and builds the Repair Job Orders module | **Repair Job Orders (`repairs`)** + Checkpoint: `PATCH /repairs/:id/status` |
| **Keanu Dagala** | `@keanudagala2003-blip` | `keanudagala2003@gmail.com` | **Scribe & Builder** — Records team decisions, validation logs, retrospective notes, and builds the Spare Parts module | **Spare Parts Inventory (`parts`)** + Checkpoint: `POST /parts/:id/restock` |

---

## Problem Statement (Week 1 — Task 2)

Local neighborhood motorcycle repair shops ("talyer") handle dozens of daily tune-ups, oil changes, brake replacements, and electrical repairs using paper logbooks or scattered text messages. Mechanics frequently lose track of which customer owns which motorcycle plate number, whether a repair job order is still pending or ready for pickup, and whether critical spare parts (such as spark plugs, brake pads, and engine oil) are still in stock. The **Motorcycle Repair Shop Management System** solves this problem by providing a centralized, defensive, and tested web application where shop staff can create, view, update, and delete **Customer & Motorcycle profiles**, **Repair Job Orders**, and **Spare Parts Inventory** with strict input validation, role-based authorization guards, and complete loading/success/error UI feedback.

### Core Record Types Managed

1. **`customers` (Customers & Motorcycles)** — Stores customer contact details (`name`, `phone`) together with their registered motorcycle (`plateNumber`, `motorcycleModel`). Owned by **Alvin Murillo (`@murillo2003123`)**.
2. **`repairs` (Repair Job Orders)** — Tracks service orders linked to a customer (`customerId`), describing the issue (`issue`), assigned mechanic (`mechanic`), labor cost (`laborCost`), and workflow status (`pending`, `in_progress`, `completed`, `paid`). Owned by **John Angelo Cabatingan (`@johnangelocabatingan2003-dot`)**.
3. **`parts` (Spare Parts Inventory)** — Manages shop spare parts catalog (`name`, `sku`, `qty`, `unitPrice`, `category`) used during repairs. Owned by **Keanu Dagala (`@keanudagala2003-blip`)**.

---

## Deliverables & Documentation Index (Weeks 1–12)

| Week / Deliverable | Document / Code Path | Description |
| :--- | :--- | :--- |
| **Week 1** | [`docs/week1-ai-note.md`](docs/week1-ai-note.md) | Brainstorming prompt and 5 candidate local business problems |
| **Week 1–12** | [`docs/task-board.md`](docs/task-board.md) | Team Task Board (`Backlog → To Do → In Progress → In Review → Done`) with ticket owners |
| **Week 2 (Deliverable 1)** | [`docs/backlog.md`](docs/backlog.md) | Full CRUD Feature Backlog & User Stories per record type |
| **Week 2 (Deliverable 1)** | [`docs/wireframes.md`](docs/wireframes.md) | Screen-by-screen Wireframes for all CRUD views |
| **Week 3 (Deliverable 2)** | [`docs/routes.md`](docs/routes.md) | RESTful Routing Table + Example Request/Response per route |
| **Week 4 (Deliverable 2)** | [`docs/validation.md`](docs/validation.md) | Validation Matrix (`presence`, `type`, `length/range`, `format`, `allowed values`, `referential`) + Break-It Test Log |
| **Week 5 (Deliverable 2)** | [`docs/checkpoints.md`](docs/checkpoints.md) & [`docs/ai-notes/deliverable-2.md`](docs/ai-notes/deliverable-2.md) | Individual AI-Off Checkpoints & Deliverable 2 AI-off statement |
| **Week 6 (Deliverable 3)** | [`docs/components.md`](docs/components.md) & [`docs/ai-notes/week-06.md`](docs/ai-notes/week-06.md) | Reusable UI Component Map & Week 6 AI Prompt Log |
| **Week 7 (Deliverable 3)** | [`docs/binding-tests.md`](docs/binding-tests.md) & [`docs/ai-notes/week-07.md`](docs/ai-notes/week-07.md) | Async Create/Update Form Binding Test Log & Week 7 AI Prompt Log |
| **Week 8 (Deliverable 3)** | [`docs/feedback-matrix.md`](docs/feedback-matrix.md), [`docs/feedback-tests.md`](docs/feedback-tests.md) & [`docs/ai-notes/week-08.md`](docs/ai-notes/week-08.md) | Action Feedback Matrix (Loading/Success/Error), Failure Path Tests & Week 8 AI Log |
| **Week 9 (Deliverable 4)** | [`docs/find-the-flaw.md`](docs/find-the-flaw.md) & [`docs/ai-notes/week-09.md`](docs/ai-notes/week-09.md) | AI Planted-Bug Analysis & Substantive Peer Code Reviews (`[blocking]` / `[nit]`) |
| **Week 10 (Deliverable 4)** | [`docs/test-matrix.md`](docs/test-matrix.md) & [`docs/ai-notes/week-10.md`](docs/ai-notes/week-10.md) | Manual QA Feature × Scenario Test Matrix, Adversarial Testing & Triaged P0/P1/P2 Bug List |
| **Week 11 (Deliverable 4)** | [`docs/deployment.md`](docs/deployment.md), [`.env.example`](.env.example) & [`docs/ai-notes/week-11.md`](docs/ai-notes/week-11.md) | P0/P1 Bug Fixes, Supabase Schema, Environment Config (`APP_DEBUG=false`), Live Vercel Deployment |
| **Week 12 (Deliverable 4)** | [`docs/retrospective.md`](docs/retrospective.md) | Blameless Team Retrospective, Presentation Deck Outline & Individual Oral Defense Guide |

---

## Running the App & Automated Tests

```bash
# Run the full automated test suite (51/51 Arrange-Act-Assert tests)
npm test

# Start the interactive web application (defaults to http://localhost:3000)
npm start
```

> **Merge Rule:** No code merges to `main` with a failing test. A red test suite blocks the pull request.
