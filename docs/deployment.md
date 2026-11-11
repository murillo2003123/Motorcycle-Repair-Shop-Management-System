# Week 11 — Supabase Database & Vercel Deployment Log (`/docs/deployment.md`)

**Deployment Team:**
- **Alvin Murillo** (`alvinmurillo2003@gmail.com`) — Repo Lead & Builder (`customers` table & Vercel config)
- **John Angelo Cabatingan** (`johnangelocabatingan2003@gmail.com`) — Board Lead & Builder (`repairs` table & Supabase schema)
- **Keanu Dagala** (`keanudagala2003@gmail.com`) — Scribe & Builder (`parts` table & Smoke-Test verification)

---

## Task 3 — Environment Variables & Security Hygiene

- All environment-specific values (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `PORT`, `NODE_ENV`, `APP_DEBUG`, `SHOP_NAME`) are read from `process.env` in [`src/config.js`](../src/config.js).
- `.env` is ignored in [`.gitignore`](../.gitignore); [`.env.example`](../.env.example) documents all required keys.
- `APP_DEBUG` is explicitly set to `false` in production so internal details or stack traces never leak to clients.

---

## Task 4 — Live Production Deployment Details (Supabase & Vercel)

- **Live Public Vercel URL (Primary):** https://motorcycle-repair-shop-management-s.vercel.app
- **Live Public Vercel URL (Team Alias):** https://motorcycle-repair-shop-management-system-murillo-50c6.vercel.app
- **Vercel Project ID:** `prj_9d36yaXLunFCONkiGrs61c1AiclT`
- **Supabase Project ID & URL:** `mgufmvpujhojyccbcdlb` (`https://mgufmvpujhojyccbcdlb.supabase.co`, region `ap-southeast-1`)
- **GitHub Repository URL:** `https://github.com/murillo2003123/Motorcycle-Repair-Shop-Management-System`
- **Production Environment Variables Configured on Vercel:**
  - `NODE_ENV` = `production`
  - `APP_DEBUG` = `false`
  - `SUPABASE_URL` = `https://mgufmvpujhojyccbcdlb.supabase.co`
  - `SUPABASE_ANON_KEY` = *(encrypted in Vercel project settings)*

---

## Task 5 — Live Production Smoke-Test Results

| # | Smoke Test Case | Tested By | Action Performed | Result |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Happy Path — Create & View Customer** | **Alvin Murillo** | Created Customer `Pedro Penduko` (`09178889900`, `MTR-2026`, `Yamaha Sniper 155`) at the live Vercel URL | `201 Created`; persisted and rendered immediately in the Customers table. |
| **2** | **Happy Path — Create, Edit & Update Repair Status** | **John Angelo Cabatingan** | Created Repair Order for Customer #1, edited labor cost to `₱950`, updated status to `completed` | `201` on create, `200` on edit and status update; badges updated live. |
| **3** | **Happy Path — Create, Restock & Delete Spare Part** | **Keanu Dagala** | Created part `Brake Fluid DOT4` (`BRK-DOT4`), restocked `+10` units, then deleted test part as Shop Owner | `201` on create, `200` on restock and delete. |
| **4** | **Failure Path — Submit Bad Data (`422`)** | **All Members** | Submitted negative `qty: -5` and invalid plate `badplate` | Returned `422`; inline field-level error message displayed cleanly with zero crash. |
| **5** | **Failure Path — Unauthorized Delete (`403`)** | **All Members** | Switched role to `Guest` and attempted to delete Customer #1 | Returned `403`; permission warning banner displayed; record preserved. |
