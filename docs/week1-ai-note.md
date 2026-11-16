# Week 1 — AI Brainstorming Note

> **AI Use Policy (Week 1):** Allowed for brainstorming candidate local business problems only. Weeks 3–5 (Fundamentals Wall) were built with AI OFF.

## Prompt Used

```text
We are a 3-person student software engineering team (Murillo, Cabatingan, Dagala) looking for a small, real, local community business problem that is CRUD-shaped and solvable in 12 weeks. Suggest 5 candidate problems that each have at least 3 related record types and can be explained in one sentence.
```

## 5 Candidate Ideas Produced

1. **Local Motorcycle Repair Shop Management System ("Talyer" Tracker)** *(Selected by Team)*
   - **One-sentence summary:** Helps a neighborhood motorcycle repair shop track customer bikes, repair job orders, and spare parts stock.
   - **Record types:** `customers` (with motorcycle plate & model), `repairs` (job orders), `parts` (spare parts inventory).
2. **Barangay Sari-Sari Store Inventory & Utang Log**
   - **One-sentence summary:** Tracks daily retail products, customer credit accounts, and restock deliveries for a neighborhood convenience store.
   - **Record types:** `products`, `customers`, `transactions`.
3. **Barbershop Appointment & Barber Schedule Tracker**
   - **One-sentence summary:** Lets a local barbershop schedule customer haircuts, assign barbers, and log completed services.
   - **Record types:** `appointments`, `barbers`, `services`.
4. **Community Water Refilling Station Delivery Tracker**
   - **One-sentence summary:** Tracks household gallon orders, delivery riders, and container return logs for a local water station.
   - **Record types:** `households`, `orders`, `deliveries`.
5. **Tutoring Center Session & Student Progress Scheduler**
   - **One-sentence summary:** Manages student enrollments, tutor schedules, and session attendance logs for an after-school review center.
   - **Record types:** `students`, `tutors`, `sessions`.

## Team Decision (Recorded by Scribe: Dagala)

Our team selected **Candidate #1: Motorcycle Repair Shop Management System** because:
- Every team member interacts with local motorcycle repair shops and understands the workflow first-hand.
- It naturally splits into **3 clean, related CRUD modules** (`customers`, `repairs`, `parts`), allowing **Murillo**, **Cabatingan**, and **Dagala** to each take end-to-end ownership of one core module across routing (Week 3), guard-clause validation (Week 4), and thin controllers + automated tests (Week 5).
