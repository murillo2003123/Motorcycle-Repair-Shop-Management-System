/**
 * HTTP Server & Interactive Web Application (Deliverables 2, 3 & 4 — Weeks 3–12)
 * Modern SaaS Dashboard UI: Dark Left Sidebar + Light Workspace + Analytics & Live Pipeline
 *
 * Team:
 * - Alvin Murillo (@murillo2003123 / alvinmurillo2003@gmail.com)
 * - John Angelo Cabatingan (@johnangelocabatingan2003-dot / johnangelocabatingan2003@gmail.com)
 * - Keanu Dagala (@keanudagala2003-blip / keanudagala2003@gmail.com)
 */

const http = require('http');
const config = require('./config');
const { handleRequest } = require('./router');

function renderAppHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MotoCare — ${config.shopName}</title>
  <style>
    :root {
      --sidebar-bg: #0f172a;
      --sidebar-card: #162033;
      --sidebar-active: #2563eb;
      --sidebar-text: #94a3b8;
      --sidebar-text-active: #ffffff;
      --bg-main: #f4f7fb;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --text-dark: #0f172a;
      --text-muted: #64748b;
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --success: #10b981;
      --danger: #ef4444;
      --shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.04);
      --shadow-md: 0 8px 24px rgba(15, 23, 42, 0.06);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg-main);
      color: var(--text-dark);
      line-height: 1.5;
      min-height: 100vh;
    }
    .app-layout {
      display: flex;
      min-height: 100vh;
    }

    /* ========= DARK LEFT SIDEBAR ========= */
    aside.sidebar {
      width: 245px;
      background: var(--sidebar-bg);
      color: #fff;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      height: 100vh;
      padding: 1.25rem 0.9rem;
      user-select: none;
    }
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.25rem 0.5rem 1.35rem;
    }
    .brand-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #38bdf8, #2563eb);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15rem;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
    }
    .brand-title {
      font-size: 1.2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #fff;
    }
    nav.sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      flex: 1;
    }
    nav.sidebar-nav button {
      width: 100%;
      background: transparent;
      border: none;
      color: var(--sidebar-text);
      padding: 0.7rem 0.9rem;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: left;
    }
    nav.sidebar-nav button svg {
      width: 18px;
      height: 18px;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
      flex-shrink: 0;
    }
    nav.sidebar-nav button:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
    }
    nav.sidebar-nav button.active {
      background: var(--sidebar-active);
      color: var(--sidebar-text-active);
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.45);
    }

    /* Bottom Profile Card in Sidebar */
    .sidebar-profile {
      margin-top: auto;
      background: var(--sidebar-card);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
    .avatar-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #2563eb;
      color: #fff;
      font-weight: 700;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .profile-meta {
      overflow: hidden;
      flex: 1;
    }
    .profile-name {
      font-size: 0.82rem;
      font-weight: 700;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .profile-role {
      font-size: 0.68rem;
      font-weight: 700;
      color: #60a5fa;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    /* ========= MAIN WORKSPACE (LIGHT) ========= */
    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      padding: 1.5rem 2.25rem 2.5rem;
      max-width: 1440px;
      margin: 0 auto;
      width: 100%;
    }

    /* Top Greeting & Utility Bar */
    .top-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .greeting-title {
      margin: 0;
      font-size: 1.55rem;
      font-weight: 800;
      color: var(--text-dark);
      letter-spacing: -0.02em;
    }
    .top-utilities {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-box input {
      width: 220px;
      padding: 0.52rem 0.85rem 0.52rem 2.1rem;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: #fff;
      color: var(--text-dark);
      font-size: 0.85rem;
      outline: none;
      box-shadow: var(--shadow-sm);
    }
    .search-box input:focus {
      border-color: var(--primary);
    }
    .search-box svg {
      position: absolute;
      left: 0.65rem;
      width: 15px;
      height: 15px;
      stroke: #94a3b8;
      stroke-width: 2;
      fill: none;
    }
    .icon-btn {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: #fff;
      color: #475569;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      box-shadow: var(--shadow-sm);
      transition: background 0.15s;
    }
    .icon-btn:hover { background: #f8fafc; }
    .notif-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #ef4444;
      color: #fff;
      font-size: 0.65rem;
      font-weight: 800;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 999px;
      padding: 0.28rem 0.85rem 0.28rem 0.35rem;
      box-shadow: var(--shadow-sm);
    }
    .user-pill select {
      border: none;
      background: transparent;
      font-size: 0.72rem;
      font-weight: 800;
      color: var(--primary);
      cursor: pointer;
      padding: 0;
      outline: none;
    }

    /* Action Pills Row (New Job Order, New Customer, Customer Site) */
    .quick-actions-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.65rem;
      margin-bottom: 1.5rem;
    }
    .action-pill {
      padding: 0.55rem 1.15rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid var(--border);
      background: #fff;
      color: var(--text-dark);
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      box-shadow: var(--shadow-sm);
      transition: all 0.15s;
    }
    .action-pill.primary {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.28);
    }
    .action-pill.primary:hover { background: var(--primary-hover); }
    .action-pill.soft-blue {
      color: var(--primary);
      background: #eff6ff;
      border-color: #bfdbfe;
    }

    /* 4 KPI Cards Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.15rem;
      margin-bottom: 1.5rem;
    }
    .kpi-card {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 1.35rem 1.4rem;
      box-shadow: var(--shadow-md);
      border: 1px solid rgba(226, 232, 240, 0.7);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 140px;
    }
    .kpi-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .kpi-label {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    .kpi-icon {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.95rem;
    }
    .kpi-icon.purple {
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      color: #fff;
    }
    .kpi-icon.blue {
      background: #eff6ff;
      color: #2563eb;
    }
    .kpi-value {
      font-size: 1.95rem;
      font-weight: 800;
      color: var(--text-dark);
      margin: 0.35rem 0 0.15rem;
      letter-spacing: -0.02em;
    }
    .kpi-sub {
      font-size: 0.78rem;
      color: #94a3b8;
      font-weight: 500;
    }

    /* Dashboard Lower Split Layout (Left Analytics + Right Pipeline/Fleet) */
    .dashboard-split {
      display: grid;
      grid-template-columns: 330px 1fr;
      gap: 1.25rem;
      align-items: start;
    }
    .white-card {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 1.4rem;
      box-shadow: var(--shadow-md);
      border: 1px solid rgba(226, 232, 240, 0.7);
    }
    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .card-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 800;
      color: var(--text-dark);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .pill-live {
      background: #dcfce7;
      color: #15803d;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.22rem 0.65rem;
      border-radius: 999px;
    }

    /* 5 Colorful Pipeline Stage Cards */
    .pipeline-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.75rem;
    }
    .stage-card {
      border-radius: 12px;
      padding: 1.15rem 0.65rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      cursor: pointer;
      transition: transform 0.15s;
    }
    .stage-card:hover { transform: translateY(-2px); }
    .stage-count {
      font-size: 1.65rem;
      font-weight: 800;
      line-height: 1.1;
    }
    .stage-name {
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .stage-tag {
      margin-top: 0.25rem;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.12rem 0.55rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.28);
    }
    .stage-intake { background: #2563eb; color: #fff; }
    .stage-diagnosis { background: #38bdf8; color: #0c4a6e; }
    .stage-repairing { background: #67e8f9; color: #0e7490; }
    .stage-testing { background: #c4b5fd; color: #4c1d95; }
    .stage-ready { background: #86efac; color: #14532d; }

    /* Mechanics & Fleet Banner List */
    .mechanic-banner {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 0.85rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.75rem;
    }
    .mechanic-info {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    /* ========= CRUD TABLE & MODULE SECTION ========= */
    .module-card {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 1.4rem;
      box-shadow: var(--shadow-md);
      border: 1px solid rgba(226, 232, 240, 0.7);
    }
    .module-toolbar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.1rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
    }
    th, td {
      padding: 0.85rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border);
      font-size: 0.88rem;
    }
    th {
      background: #f8fafc;
      color: var(--text-muted);
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    tr:hover td { background: #f8fafc; }
    .badge {
      display: inline-block;
      padding: 0.22rem 0.65rem;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-pending { background: #fef3c7; color: #b45309; }
    .badge-in_progress { background: #dbeafe; color: #1d4ed8; }
    .badge-completed { background: #d1fae5; color: #047857; }
    .badge-paid { background: #dcfce7; color: #15803d; }

    .btn {
      padding: 0.5rem 0.95rem;
      border-radius: 8px;
      border: 1px solid transparent;
      font-weight: 700;
      font-size: 0.84rem;
      cursor: pointer;
      background: var(--primary);
      color: #fff;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }
    .btn:hover:not(:disabled) { background: var(--primary-hover); }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-secondary {
      background: #f1f5f9;
      color: #334155;
      border-color: #cbd5e1;
    }
    .btn-secondary:hover:not(:disabled) { background: #e2e8f0; }
    .btn-danger { background: #fee2e2; color: #dc2626; border-color: #fecaca; }
    .btn-danger:hover:not(:disabled) { background: #ef4444; color: #fff; }
    .btn-sm { padding: 0.3rem 0.65rem; font-size: 0.78rem; }

    .state-banner {
      padding: 1.5rem;
      border-radius: 12px;
      background: #fff;
      border: 1px solid var(--border);
      text-align: center;
      margin: 1rem 0;
      box-shadow: var(--shadow-sm);
    }
    .state-error { border-color: #fca5a5; background: #fef2f2; color: #991b1b; }

    /* Modals */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(2px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 900;
      padding: 1rem;
    }
    .modal-backdrop.open { display: flex; }
    .modal {
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 16px;
      max-width: 500px;
      width: 100%;
      padding: 1.5rem;
      box-shadow: 0 20px 40px rgba(15, 23, 42, 0.18);
    }
    .modal h3 { margin-top: 0; color: var(--text-dark); font-size: 1.15rem; }
    .form-group { margin-bottom: 0.9rem; }
    .form-group label { display: block; font-size: 0.82rem; margin-bottom: 0.3rem; font-weight: 700; color: #334155; }
    .form-group input, .form-group select {
      width: 100%;
      padding: 0.55rem 0.75rem;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #fff;
      color: var(--text-dark);
      font-size: 0.9rem;
    }
    .form-group input.invalid, .form-group select.invalid { border-color: var(--danger); background: #fef2f2; }
    .field-error {
      color: var(--danger);
      font-size: 0.78rem;
      font-weight: 600;
      margin-top: 0.25rem;
      min-height: 1.1rem;
    }
    .toast {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      padding: 0.85rem 1.25rem;
      border-radius: 10px;
      background: #0f172a;
      color: #fff;
      font-weight: 700;
      font-size: 0.88rem;
      box-shadow: 0 10px 25px rgba(15, 23, 42, 0.25);
      z-index: 1000;
      display: none;
    }
    .toast.error { background: var(--danger); }
    dl { display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem 1rem; margin: 1rem 0; font-size: 0.9rem; }
    dt { color: var(--text-muted); font-weight: 700; }
    dd { margin: 0; font-weight: 600; }

    @media (max-width: 1024px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
      .dashboard-split { grid-template-columns: 1fr; }
      .pipeline-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .app-layout { flex-direction: column; }
      aside.sidebar { width: 100%; height: auto; position: static; }
      .kpi-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="app-layout">
    <!-- ========= LEFT DARK SIDEBAR ========= -->
    <aside class="sidebar" aria-label="Main Navigation Sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon">🏍️</div>
        <span class="brand-title">MotoCare</span>
      </div>

      <nav class="sidebar-nav" role="navigation" aria-label="Main Menu">
        <button type="button" class="active" data-tab="dashboard">
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
          <span>Dashboard</span>
        </button>
        <button type="button" data-tab="repairs">
          <svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h6"/></svg>
          <span>Job Orders</span>
        </button>
        <button type="button" data-tab="parts">
          <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          <span>Spare Parts</span>
        </button>
        <button type="button" data-tab="customers">
          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Customers</span>
        </button>
        <button type="button" data-tab="staff">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Mechanics &amp; Team</span>
        </button>
        <button type="button" data-tab="settings">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span>Settings &amp; QA</span>
        </button>
      </nav>

      <div class="sidebar-profile">
        <div class="avatar-circle">AM</div>
        <div class="profile-meta">
          <div class="profile-name">Alvin Murillo</div>
          <div class="profile-role" id="sidebar-role-label">ADMIN • OWNER</div>
        </div>
      </div>
    </aside>

    <!-- ========= RIGHT LIGHT WORKSPACE ========= -->
    <div class="main-area">
      <!-- Top Greeting Header -->
      <header class="top-header">
        <h1 class="greeting-title" id="greeting-heading">Good Morning, Alvin Murillo!</h1>

        <div class="top-utilities">
          <div class="search-box">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="plate-search-input" placeholder="Search Plate (ABC-1234)" />
          </div>
          <button type="button" class="icon-btn" id="plate-search-btn" title="Search Motorcycle by Plate">
            🔎
          </button>
          <button type="button" class="icon-btn" id="refresh-btn" title="Refresh Live Data">
            🔄
          </button>
          <button type="button" class="icon-btn" id="test-404-btn" title="Test 404 Record State">
            🔔
            <span class="notif-badge">3</span>
          </button>

          <div class="user-pill">
            <div class="avatar-circle" style="width:28px;height:28px;font-size:0.75rem;">A</div>
            <div>
              <div style="font-size:0.78rem; font-weight:800; line-height:1.1;">Alvin Murillo</div>
              <select id="role-select" aria-label="Switch Role">
                <option value="owner">ADMIN • SWITCH ROLE</option>
                <option value="guest">GUEST • READ/CREATE ONLY</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <!-- Action Pills Row -->
      <div class="quick-actions-row">
        <button type="button" class="action-pill primary" id="quick-new-repair-btn">
          + New Job Order
        </button>
        <button type="button" class="action-pill" id="quick-new-customer-btn">
          New Customer
        </button>
        <button type="button" class="action-pill soft-blue" id="quick-restock-btn">
          🌐 Spare Parts Stock
        </button>
      </div>

      <!-- ========= DASHBOARD VIEW ========= -->
      <section id="dashboard-view">
        <!-- 4 KPI Cards Row -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Total Shop Revenue</span>
              <div class="kpi-icon purple">₱</div>
            </div>
            <div class="kpi-value" id="kpi-revenue">₱1,300</div>
            <div class="kpi-sub">Settled &amp; Active Labor</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Active Repair Orders</span>
              <div class="kpi-icon blue">🔧</div>
            </div>
            <div class="kpi-value" id="kpi-repairs">2</div>
            <div class="kpi-sub">Total Job Orders</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Registered Motorcycles</span>
              <div class="kpi-icon blue">📅</div>
            </div>
            <div class="kpi-value" id="kpi-customers">2</div>
            <div class="kpi-sub">Active Riders Today</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Spare Parts in Stock</span>
              <div class="kpi-icon blue">🚚</div>
            </div>
            <div class="kpi-value" id="kpi-parts">37</div>
            <div class="kpi-sub">Live Inventory Units</div>
          </div>
        </div>

        <!-- Lower Split Section: Left Analytics Chart + Right Pipeline & Fleet -->
        <div class="dashboard-split">
          <!-- Left Card: Revenue & Repair Volume Analytics -->
          <div class="white-card">
            <div class="card-header-row">
              <h3 class="card-title" style="line-height:1.3;">Revenue &amp;<br/>Repair Volume<br/>Analytics</h3>
              <select style="border:1px solid #cbd5e1; border-radius:8px; padding:0.3rem 0.5rem; font-size:0.75rem; font-weight:600;">
                <option>Last 30 Days</option>
                <option>This Quarter</option>
              </select>
            </div>
            <div style="display:flex; gap:1.25rem; font-size:0.75rem; color:var(--text-muted); margin-bottom:1.25rem;">
              <div><span style="color:#2563eb;">●</span> Revenue Velocity</div>
              <div><span style="color:#38bdf8;">●</span> Job Order Volume</div>
            </div>

            <!-- Smooth Area Line SVG Chart -->
            <svg viewBox="0 0 300 150" style="width:100%; height:150px; overflow:visible;">
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2563eb" stop-opacity="0.32"/>
                  <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0"/>
                </linearGradient>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25"/>
                  <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <line x1="0" y1="35" x2="300" y2="35" stroke="#f1f5f9" stroke-width="1"/>
              <line x1="0" y1="75" x2="300" y2="75" stroke="#f1f5f9" stroke-width="1"/>
              <line x1="0" y1="115" x2="300" y2="115" stroke="#f1f5f9" stroke-width="1"/>
              <path d="M 0 120 Q 75 95, 150 80 T 300 45 L 300 140 L 0 140 Z" fill="url(#revGrad)"/>
              <path d="M 0 120 Q 75 95, 150 80 T 300 45" fill="none" stroke="#2563eb" stroke-width="2.5"/>
              <path d="M 0 130 Q 85 115, 165 95 T 300 68 L 300 140 L 0 140 Z" fill="url(#volGrad)"/>
              <path d="M 0 130 Q 85 115, 165 95 T 300 68" fill="none" stroke="#38bdf8" stroke-width="2"/>
            </svg>
            <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:#94a3b8; font-weight:600; margin-top:0.5rem;">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
              <span>Today</span>
            </div>
          </div>

          <!-- Right Column: Live Repair Processing Pipeline + Motorcycle Bay Dispatch -->
          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            <!-- Live Motorcycle Repair Processing Pipeline -->
            <div class="white-card">
              <div class="card-header-row">
                <h3 class="card-title">
                  <span style="color:#2563eb;">🕒</span> Live Motorcycle Repair Processing Pipeline
                </h3>
                <span class="pill-live">Live Active</span>
              </div>

              <div class="pipeline-grid">
                <div class="stage-card stage-intake" onclick="switchTab('repairs')">
                  <div class="stage-count" id="pipe-pending">1</div>
                  <div class="stage-name">RECEIVED</div>
                  <div class="stage-tag">Intake</div>
                </div>
                <div class="stage-card stage-diagnosis" onclick="switchTab('repairs')">
                  <div class="stage-count" id="pipe-inprogress">1</div>
                  <div class="stage-name">DIAGNOSIS</div>
                  <div class="stage-tag">In Bay</div>
                </div>
                <div class="stage-card stage-repairing" onclick="switchTab('parts')">
                  <div class="stage-count" id="pipe-parts">2</div>
                  <div class="stage-name">PARTS &amp; OIL</div>
                  <div class="stage-tag">Allocated</div>
                </div>
                <div class="stage-card stage-testing" onclick="switchTab('repairs')">
                  <div class="stage-count" id="pipe-completed">0</div>
                  <div class="stage-name">QUALITY TEST</div>
                  <div class="stage-tag">Road Test</div>
                </div>
                <div class="stage-card stage-ready" onclick="switchTab('repairs')">
                  <div class="stage-count" id="pipe-paid">0</div>
                  <div class="stage-name">RELEASED</div>
                  <div class="stage-tag">Paid &amp; Ready</div>
                </div>
              </div>
            </div>

            <!-- Motorcycle Shop Mechanics & Team Dispatch -->
            <div class="white-card">
              <div class="card-header-row" style="margin-bottom:0.25rem;">
                <div>
                  <h3 class="card-title">Motorcycle Repair Shop Team &amp; Mechanics</h3>
                  <p style="margin:0.15rem 0 0; font-size:0.78rem; color:var(--text-muted);">
                    Active Shop Contributors &amp; Assigned Bay Mechanics (Supabase &amp; Vercel)
                  </p>
                </div>
                <button type="button" class="btn btn-secondary btn-sm" onclick="switchTab('repairs')">View All →</button>
              </div>

              <div class="mechanic-banner">
                <div class="mechanic-info">
                  <div class="avatar-circle">AM</div>
                  <div>
                    <div style="font-weight:800; font-size:0.9rem;">Alvin Murillo (@murillo2003123)</div>
                    <div style="font-size:0.78rem; color:#2563eb; font-weight:600;">
                      🏍️ Customers &amp; Motorcycles Module Owner • Plate Lookup Checkpoint
                    </div>
                  </div>
                </div>
                <span class="pill-live">Active On Duty</span>
              </div>

              <div class="mechanic-banner">
                <div class="mechanic-info">
                  <div class="avatar-circle" style="background:#0284c7;">JC</div>
                  <div>
                    <div style="font-weight:800; font-size:0.9rem;">John Angelo Cabatingan (@johnangelocabatingan2003-dot)</div>
                    <div style="font-size:0.78rem; color:#2563eb; font-weight:600;">
                      🔧 Repair Job Orders Module Owner • Status Transition Checkpoint
                    </div>
                  </div>
                </div>
                <span class="pill-live">Active On Duty</span>
              </div>

              <div class="mechanic-banner">
                <div class="mechanic-info">
                  <div class="avatar-circle" style="background:#0d9488;">KD</div>
                  <div>
                    <div style="font-weight:800; font-size:0.9rem;">Keanu Dagala (@keanudagala2003-blip)</div>
                    <div style="font-size:0.78rem; color:#2563eb; font-weight:600;">
                      📦 Spare Parts Inventory Module Owner • Stock Restock Checkpoint
                    </div>
                  </div>
                </div>
                <span class="pill-live">Active On Duty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========= CRUD MODULE / STAFF / SETTINGS VIEW ========= -->
      <section id="module-view" style="display:none;">
        <div class="module-card">
          <div class="module-toolbar">
            <div>
              <h2 id="module-title" style="margin:0; font-size:1.25rem; font-weight:800;">Module</h2>
              <p id="module-subtitle" style="margin:0.2rem 0 0; font-size:0.82rem; color:var(--text-muted);"></p>
            </div>
            <div style="display:flex; gap:0.6rem; align-items:center;">
              <label style="font-size:0.8rem; font-weight:600; color:var(--text-muted); display:flex; align-items:center; gap:0.35rem; cursor:pointer;">
                <input type="checkbox" id="simulate-network-error" />
                Simulate 500 Error
              </label>
              <button type="button" class="btn" id="open-create-btn">+ New Record</button>
            </div>
          </div>

          <!-- Component C-06: StateBanner -->
          <div id="state-container"></div>

          <!-- Reusable CRUD Data Table -->
          <div id="table-wrapper" style="display:none;">
            <table aria-live="polite">
              <thead id="table-head"></thead>
              <tbody id="table-body"></tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- Component C-04: RecordDetailCard Modal -->
  <div class="modal-backdrop" id="detail-modal">
    <article class="modal" role="dialog" aria-labelledby="detail-title">
      <h3 id="detail-title">Record Details</h3>
      <div id="detail-content"></div>
      <div style="text-align:right; margin-top:1rem;">
        <button type="button" class="btn btn-secondary" id="close-detail-btn">Close</button>
      </div>
    </article>
  </div>

  <!-- Component C-05: EntityFormModal -->
  <div class="modal-backdrop" id="form-modal">
    <div class="modal" role="dialog" aria-labelledby="form-title">
      <h3 id="form-title">Create Record</h3>
      <div id="form-global-error" class="state-banner state-error" style="display:none; padding:0.75rem; margin-bottom:1rem;"></div>
      <form id="entity-form" novalidate>
        <div id="form-fields"></div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1rem;">
          <button type="button" class="btn btn-secondary" id="cancel-form-btn">Cancel</button>
          <button type="submit" class="btn" id="submit-form-btn">Save Record</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Component C-07: ConfirmDeleteDialog -->
  <div class="modal-backdrop" id="delete-modal">
    <div class="modal" role="dialog" aria-labelledby="delete-title">
      <h3 id="delete-title">Confirm Deletion</h3>
      <p id="delete-message" style="color:var(--text-muted); font-size:0.9rem;">Are you sure you want to delete this record? This action cannot be undone.</p>
      <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1rem;">
        <button type="button" class="btn btn-secondary" id="cancel-delete-btn">Cancel</button>
        <button type="button" class="btn btn-danger" id="confirm-delete-btn">Delete</button>
      </div>
    </div>
  </div>

  <!-- Component C-08: ToastNotification -->
  <div id="toast" class="toast" role="status" aria-live="polite"></div>

  <script>
    const state = {
      activeTab: 'dashboard',
      records: [],
      editingId: null,
      deletingId: null,
    };

    const FRIENDLY_FIELD_MESSAGES = {
      name: 'Please enter a valid name (2–80 characters, no HTML tags).',
      phone: 'Phone number must be 7–15 digits (e.g., 09171234567).',
      plateNumber: 'Plate number must match format ABC-1234.',
      motorcycleModel: 'Motorcycle model must be 2–80 characters.',
      customerId: 'Please enter an existing Customer ID (e.g., 1 or 2).',
      issue: 'Issue description must be 5–200 characters (no HTML tags).',
      mechanic: 'Mechanic name must be 2–60 characters.',
      laborCost: 'Labor cost must be a valid number between ₱0 and ₱100,000.',
      status: 'Status must be one of: pending, in_progress, completed, paid.',
      sku: 'SKU must be 3–20 uppercase letters/numbers/hyphens and unique.',
      qty: 'Stock quantity must be a whole number between 0 and 999.',
      unitPrice: 'Unit price must be between ₱1 and ₱100,000.',
      category: 'Category must be one of: engine, brakes, electrical, tires, lubricants, body.',
      addQty: 'Restock quantity must be 1–500 and total stock cannot exceed 999.',
    };

    function escapeHtml(val) {
      return String(val ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function showToast(message, isError = false) {
      const el = document.getElementById('toast');
      el.textContent = message;
      el.className = isError ? 'toast error' : 'toast';
      el.style.display = 'block';
      clearTimeout(window._toastTimer);
      window._toastTimer = setTimeout(() => { el.style.display = 'none'; }, 3500);
    }

    async function apiRequest(method, path, body = null) {
      const simulateFailure = document.getElementById('simulate-network-error').checked;
      if (simulateFailure) {
        await new Promise((r) => setTimeout(r, 300));
        throw new Error('Simulated network/server failure');
      }
      const role = document.getElementById('role-select').value;
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': role,
        },
      };
      if (body !== null) {
        options.body = JSON.stringify(body);
      }
      const res = await fetch(path, options);
      const json = await res.json();
      return { status: res.status, ...json };
    }

    function renderStateBanner(type, message, retryFn = null) {
      const container = document.getElementById('state-container');
      const tableWrapper = document.getElementById('table-wrapper');
      if (!type) {
        container.innerHTML = '';
        tableWrapper.style.display = 'block';
        return;
      }
      tableWrapper.style.display = 'none';
      const isErr = type === 'error';
      container.innerHTML = \`
        <div class="state-banner \${isErr ? 'state-error' : ''}" role="\${isErr ? 'alert' : 'status'}">
          <p style="margin:0 0 0.75rem; font-weight:700;">\${escapeHtml(message)}</p>
          \${retryFn ? '<button type="button" class="btn" id="retry-action-btn">Retry Connection</button>' : ''}
        </div>
      \`;
      if (retryFn) {
        document.getElementById('retry-action-btn').onclick = retryFn;
      }
    }

    function switchTab(tabName) {
      document.querySelectorAll('.sidebar-nav button[data-tab]').forEach((b) => {
        b.classList.toggle('active', b.dataset.tab === tabName);
      });
      state.activeTab = tabName;
      loadCurrentModule();
    }

    async function loadDashboardSummary() {
      document.getElementById('dashboard-view').style.display = 'block';
      document.getElementById('module-view').style.display = 'none';

      try {
        const [cRes, rRes, pRes] = await Promise.all([
          apiRequest('GET', '/customers'),
          apiRequest('GET', '/repairs'),
          apiRequest('GET', '/parts'),
        ]);
        const customers = cRes.data || [];
        const repairs = rRes.data || [];
        const parts = pRes.data || [];

        const totalRevenue = repairs.reduce((sum, item) => sum + Number(item.laborCost || 0), 0);
        const totalUnits = parts.reduce((sum, item) => sum + Number(item.qty || 0), 0);

        document.getElementById('kpi-revenue').textContent = '₱' + totalRevenue.toLocaleString();
        document.getElementById('kpi-repairs').textContent = repairs.length;
        document.getElementById('kpi-customers').textContent = customers.length;
        document.getElementById('kpi-parts').textContent = totalUnits;

        document.getElementById('pipe-pending').textContent = repairs.filter((r) => r.status === 'pending').length;
        document.getElementById('pipe-inprogress').textContent = repairs.filter((r) => r.status === 'in_progress').length;
        document.getElementById('pipe-parts').textContent = parts.length;
        document.getElementById('pipe-completed').textContent = repairs.filter((r) => r.status === 'completed').length;
        document.getElementById('pipe-paid').textContent = repairs.filter((r) => r.status === 'paid').length;
      } catch (_err) {
        showToast('Simulated network error: click Refresh after unchecking Simulate 500 Error.', true);
      }
    }

    async function loadCurrentModule() {
      const tab = state.activeTab;
      if (tab === 'dashboard') {
        await loadDashboardSummary();
        return;
      }

      document.getElementById('dashboard-view').style.display = 'none';
      document.getElementById('module-view').style.display = 'block';

      if (tab === 'staff' || tab === 'settings') {
        document.getElementById('open-create-btn').style.display = 'none';
        document.getElementById('module-title').textContent =
          tab === 'staff' ? 'Mechanics & Team Contributors' : 'System Settings & QA Verification';
        document.getElementById('module-subtitle').textContent =
          tab === 'staff'
            ? 'Equal module ownership across @murillo2003123, @johnangelocabatingan2003-dot, and @keanudagala2003-blip'
            : 'Supabase PostgreSQL + Vercel Production Configuration (APP_DEBUG=false)';
        renderStateBanner(null);
        const head = document.getElementById('table-head');
        const body = document.getElementById('table-body');
        if (tab === 'staff') {
          head.innerHTML = '<tr><th>GitHub Username</th><th>Full Name</th><th>Owned Resource Module</th><th>Solo Checkpoint Route</th><th>Status</th></tr>';
          body.innerHTML = \`
            <tr>
              <td><code>@murillo2003123</code></td>
              <td><strong>Alvin Murillo</strong></td>
              <td>Customers &amp; Motorcycles (<code>/customers</code>)</td>
              <td><code>GET /customers/plate/:plateNumber</code></td>
              <td><span class="badge badge-paid">Repo Owner</span></td>
            </tr>
            <tr>
              <td><code>@johnangelocabatingan2003-dot</code></td>
              <td><strong>John Angelo Cabatingan</strong></td>
              <td>Repair Job Orders (<code>/repairs</code>)</td>
              <td><code>PATCH /repairs/:id/status</code></td>
              <td><span class="badge badge-in_progress">Collaborator</span></td>
            </tr>
            <tr>
              <td><code>@keanudagala2003-blip</code></td>
              <td><strong>Keanu Dagala</strong></td>
              <td>Spare Parts Inventory (<code>/parts</code>)</td>
              <td><code>POST /parts/:id/restock</code></td>
              <td><span class="badge badge-in_progress">Collaborator</span></td>
            </tr>
          \`;
        } else {
          head.innerHTML = '<tr><th>Setting / Check</th><th>Value</th><th>Description</th></tr>';
          body.innerHTML = \`
            <tr><td><strong>Database Engine</strong></td><td><code>Supabase PostgreSQL</code></td><td>Connected via PostgREST &amp; RLS Policies</td></tr>
            <tr><td><strong>Cloud Hosting</strong></td><td><code>Vercel Production</code></td><td>Serverless Node.js HTTP Handler</td></tr>
            <tr><td><strong>Automated Test Suite</strong></td><td><code>51 / 51 Passing</code></td><td>Happy path, 422 validation, 403 auth guard, 404/405 edge cases</td></tr>
            <tr><td><strong>Production Debug Mode</strong></td><td><code>APP_DEBUG = false</code></td><td>Prevents stack trace leakage in production</td></tr>
          \`;
        }
        return;
      }

      document.getElementById('open-create-btn').style.display = 'inline-flex';
      const titles = {
        customers: 'Customers & Motorcycles',
        repairs: 'Repair Job Orders',
        parts: 'Spare Parts Inventory',
      };
      const subtitles = {
        customers: 'Owner: Alvin Murillo (@murillo2003123) — Full CRUD + Plate Lookup Checkpoint',
        repairs: 'Owner: John Angelo Cabatingan (@johnangelocabatingan2003-dot) — Full CRUD + Status Checkpoint',
        parts: 'Owner: Keanu Dagala (@keanudagala2003-blip) — Full CRUD + Restock Checkpoint',
      };
      document.getElementById('module-title').textContent = titles[tab];
      document.getElementById('module-subtitle').textContent = subtitles[tab];
      renderStateBanner('loading', 'Loading records from shop server...');

      try {
        const res = await apiRequest('GET', '/' + tab);
        state.records = res.data || [];
        if (state.records.length === 0) {
          renderStateBanner('empty', 'No records found in this module yet. Click "+ New Record" to create the first entry.');
          return;
        }
        renderStateBanner(null);
        renderTable();
      } catch (_err) {
        renderStateBanner(
          'error',
          'Unable to load records from the shop server. Please check your connection and click Retry Connection.',
          loadCurrentModule
        );
      }
    }

    function renderTable() {
      const head = document.getElementById('table-head');
      const body = document.getElementById('table-body');
      const tab = state.activeTab;

      if (tab === 'customers') {
        head.innerHTML = '<tr><th>ID</th><th>Customer Name</th><th>Phone</th><th>Plate No.</th><th>Motorcycle Model</th><th>Actions</th></tr>';
        body.innerHTML = state.records.map((r) => \`
          <tr>
            <td><strong>#\${r.id}</strong></td>
            <td>\${escapeHtml(r.name)}</td>
            <td>\${escapeHtml(r.phone)}</td>
            <td><code>\${escapeHtml(r.plateNumber)}</code></td>
            <td>\${escapeHtml(r.motorcycleModel)}</td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="viewRecord('customers', \${r.id})">View</button>
              <button class="btn btn-secondary btn-sm" onclick="openEditModal(\${r.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="openDeleteModal(\${r.id})">Delete</button>
            </td>
          </tr>
        \`).join('');
      } else if (tab === 'repairs') {
        head.innerHTML = '<tr><th>ID</th><th>Customer</th><th>Reported Issue</th><th>Mechanic</th><th>Labor Cost</th><th>Status</th><th>Actions</th></tr>';
        body.innerHTML = state.records.map((r) => \`
          <tr>
            <td><strong>#\${r.id}</strong></td>
            <td>Customer #\${r.customerId}</td>
            <td>\${escapeHtml(r.issue)}</td>
            <td>\${escapeHtml(r.mechanic)}</td>
            <td><strong>₱\${Number(r.laborCost).toFixed(2)}</strong></td>
            <td><span class="badge badge-\${escapeHtml(r.status)}">\${escapeHtml(r.status)}</span></td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="viewRecord('repairs', \${r.id})">View</button>
              <button class="btn btn-secondary btn-sm" onclick="openEditModal(\${r.id})">Edit</button>
              <button class="btn btn-secondary btn-sm" onclick="cycleRepairStatus(\${r.id}, '\${r.status}')">Next Stage</button>
              <button class="btn btn-danger btn-sm" onclick="openDeleteModal(\${r.id})">Delete</button>
            </td>
          </tr>
        \`).join('');
      } else if (tab === 'parts') {
        head.innerHTML = '<tr><th>ID</th><th>SKU Code</th><th>Part Name</th><th>Category</th><th>Stock Qty</th><th>Unit Price</th><th>Actions</th></tr>';
        body.innerHTML = state.records.map((r) => \`
          <tr>
            <td><strong>#\${r.id}</strong></td>
            <td><code>\${escapeHtml(r.sku)}</code></td>
            <td>\${escapeHtml(r.name)}</td>
            <td>\${escapeHtml(r.category)}</td>
            <td><strong>\${r.qty} units</strong></td>
            <td>₱\${Number(r.unitPrice).toFixed(2)}</td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="viewRecord('parts', \${r.id})">View</button>
              <button class="btn btn-secondary btn-sm" onclick="openEditModal(\${r.id})">Edit</button>
              <button class="btn btn-secondary btn-sm" onclick="quickRestockPart(\${r.id})">+10 Restock</button>
              <button class="btn btn-danger btn-sm" onclick="openDeleteModal(\${r.id})">Delete</button>
            </td>
          </tr>
        \`).join('');
      }
    }

    async function viewRecord(resource, id) {
      const targetResource = resource || (state.activeTab === 'dashboard' ? 'customers' : state.activeTab);
      const modal = document.getElementById('detail-modal');
      const content = document.getElementById('detail-content');
      content.innerHTML = '<p>Loading record details...</p>';
      modal.classList.add('open');

      try {
        const res = await apiRequest('GET', '/' + targetResource + '/' + id);
        if (res.status === 404) {
          content.innerHTML = \`
            <div class="state-banner state-error">
              <p><strong>Record Not Found (404)</strong></p>
              <p>We could not find record #\${escapeHtml(id)} in \${escapeHtml(targetResource)}. It may have been removed.</p>
            </div>
          \`;
          return;
        }
        const entries = Object.entries(res.data || {}).map(
          ([k, v]) => \`<dt>\${escapeHtml(k)}</dt><dd>\${escapeHtml(v)}</dd>\`
        ).join('');
        content.innerHTML = \`<dl>\${entries}</dl>\`;
      } catch (_err) {
        content.innerHTML = '<div class="state-banner state-error">Unable to reach server. Please try again.</div>';
      }
    }

    function buildFormFieldsHtml(record = {}, forceTab = null) {
      const tab = forceTab || state.activeTab;
      if (tab === 'customers') {
        return \`
          <div class="form-group">
            <label for="f-name">Customer Name *</label>
            <input id="f-name" name="name" value="\${escapeHtml(record.name || '')}" placeholder="Juan Dela Cruz" />
            <div class="field-error" data-error-for="name"></div>
          </div>
          <div class="form-group">
            <label for="f-phone">Phone Number *</label>
            <input id="f-phone" name="phone" value="\${escapeHtml(record.phone || '')}" placeholder="09171234567" />
            <div class="field-error" data-error-for="phone"></div>
          </div>
          <div class="form-group">
            <label for="f-plateNumber">Plate Number *</label>
            <input id="f-plateNumber" name="plateNumber" value="\${escapeHtml(record.plateNumber || '')}" placeholder="ABC-1234" />
            <div class="field-error" data-error-for="plateNumber"></div>
          </div>
          <div class="form-group">
            <label for="f-motorcycleModel">Motorcycle Model *</label>
            <input id="f-motorcycleModel" name="motorcycleModel" value="\${escapeHtml(record.motorcycleModel || '')}" placeholder="Honda Click 125i" />
            <div class="field-error" data-error-for="motorcycleModel"></div>
          </div>
        \`;
      }
      if (tab === 'repairs') {
        const st = record.status || 'pending';
        return \`
          <div class="form-group">
            <label for="f-customerId">Customer ID *</label>
            <input type="number" id="f-customerId" name="customerId" value="\${escapeHtml(record.customerId ?? 1)}" />
            <div class="field-error" data-error-for="customerId"></div>
          </div>
          <div class="form-group">
            <label for="f-issue">Reported Issue *</label>
            <input id="f-issue" name="issue" value="\${escapeHtml(record.issue || '')}" placeholder="Full CVT cleaning and oil change" />
            <div class="field-error" data-error-for="issue"></div>
          </div>
          <div class="form-group">
            <label for="f-mechanic">Assigned Mechanic *</label>
            <input id="f-mechanic" name="mechanic" value="\${escapeHtml(record.mechanic || '')}" placeholder="Berto" />
            <div class="field-error" data-error-for="mechanic"></div>
          </div>
          <div class="form-group">
            <label for="f-laborCost">Labor Cost (PHP) *</label>
            <input type="number" id="f-laborCost" name="laborCost" value="\${escapeHtml(record.laborCost ?? 450)}" />
            <div class="field-error" data-error-for="laborCost"></div>
          </div>
          <div class="form-group">
            <label for="f-status">Workflow Status *</label>
            <select id="f-status" name="status">
              <option value="pending" \${st === 'pending' ? 'selected' : ''}>pending</option>
              <option value="in_progress" \${st === 'in_progress' ? 'selected' : ''}>in_progress</option>
              <option value="completed" \${st === 'completed' ? 'selected' : ''}>completed</option>
              <option value="paid" \${st === 'paid' ? 'selected' : ''}>paid</option>
            </select>
            <div class="field-error" data-error-for="status"></div>
          </div>
        \`;
      }
      const cat = record.category || 'lubricants';
      return \`
        <div class="form-group">
          <label for="f-name">Part Name *</label>
          <input id="f-name" name="name" value="\${escapeHtml(record.name || '')}" placeholder="Synthetic Scooter Oil 10W-40" />
          <div class="field-error" data-error-for="name"></div>
        </div>
        <div class="form-group">
          <label for="f-sku">SKU Code *</label>
          <input id="f-sku" name="sku" value="\${escapeHtml(record.sku || '')}" placeholder="OIL-10W40" />
          <div class="field-error" data-error-for="sku"></div>
        </div>
        <div class="form-group">
          <label for="f-qty">Stock Quantity (0–999) *</label>
          <input type="number" id="f-qty" name="qty" value="\${escapeHtml(record.qty ?? 10)}" />
          <div class="field-error" data-error-for="qty"></div>
        </div>
        <div class="form-group">
          <label for="f-unitPrice">Unit Price (PHP) *</label>
          <input type="number" id="f-unitPrice" name="unitPrice" value="\${escapeHtml(record.unitPrice ?? 250)}" />
          <div class="field-error" data-error-for="unitPrice"></div>
        </div>
        <div class="form-group">
          <label for="f-category">Category *</label>
          <select id="f-category" name="category">
            <option value="lubricants" \${cat === 'lubricants' ? 'selected' : ''}>lubricants</option>
            <option value="brakes" \${cat === 'brakes' ? 'selected' : ''}>brakes</option>
            <option value="engine" \${cat === 'engine' ? 'selected' : ''}>engine</option>
            <option value="electrical" \${cat === 'electrical' ? 'selected' : ''}>electrical</option>
            <option value="tires" \${cat === 'tires' ? 'selected' : ''}>tires</option>
            <option value="body" \${cat === 'body' ? 'selected' : ''}>body</option>
          </select>
          <div class="field-error" data-error-for="category"></div>
        </div>
      \`;
    }

    function openCreateModal(targetModule = null) {
      if (targetModule && state.activeTab !== targetModule) {
        switchTab(targetModule);
      }
      const mod = targetModule || (state.activeTab === 'dashboard' ? 'repairs' : state.activeTab);
      state.editingId = null;
      document.getElementById('form-title').textContent = 'Create New ' + mod.slice(0, -1).toUpperCase();
      document.getElementById('form-global-error').style.display = 'none';
      document.getElementById('form-fields').innerHTML = buildFormFieldsHtml({}, mod);
      document.getElementById('form-modal').classList.add('open');
    }

    function openEditModal(id) {
      const record = state.records.find((r) => r.id === id);
      if (!record) return;
      state.editingId = id;
      document.getElementById('form-title').textContent = 'Edit Record #' + id;
      document.getElementById('form-global-error').style.display = 'none';
      document.getElementById('form-fields').innerHTML = buildFormFieldsHtml(record);
      document.getElementById('form-modal').classList.add('open');
    }

    function clearFormErrors() {
      document.getElementById('form-global-error').style.display = 'none';
      document.querySelectorAll('#entity-form .invalid').forEach((el) => el.classList.remove('invalid'));
      document.querySelectorAll('#entity-form .field-error').forEach((el) => { el.textContent = ''; });
    }

    document.getElementById('entity-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFormErrors();

      const submitBtn = document.getElementById('submit-form-btn');
      const formData = new FormData(e.target);
      const payload = Object.fromEntries(formData.entries());

      if (state.activeTab === 'repairs') {
        payload.customerId = payload.customerId === '' ? '' : Number(payload.customerId);
        payload.laborCost = payload.laborCost === '' ? '' : Number(payload.laborCost);
      } else if (state.activeTab === 'parts') {
        payload.qty = payload.qty === '' ? '' : Number(payload.qty);
        payload.unitPrice = payload.unitPrice === '' ? '' : Number(payload.unitPrice);
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';

      try {
        const isEdit = state.editingId !== null;
        const method = isEdit ? 'PUT' : 'POST';
        const path = isEdit ? \`/\${state.activeTab}/\${state.editingId}\` : \`/\${state.activeTab}\`;
        const res = await apiRequest(method, path, payload);

        if (res.status === 200 || res.status === 201) {
          document.getElementById('form-modal').classList.remove('open');
          showToast(isEdit ? 'Record updated successfully!' : 'Record created successfully!');
          await loadCurrentModule();
        } else if (res.status === 422) {
          const field = res.field;
          const errEl = document.querySelector(\`[data-error-for="\${field}"]\`);
          const inputEl = document.querySelector(\`[name="\${field}"]\`);
          const friendly = FRIENDLY_FIELD_MESSAGES[field] || res.error;
          if (inputEl) inputEl.classList.add('invalid');
          if (errEl) {
            errEl.textContent = \`\${res.error} — \${friendly}\`;
          } else {
            const globalErr = document.getElementById('form-global-error');
            globalErr.textContent = friendly;
            globalErr.style.display = 'block';
          }
        } else {
          const globalErr = document.getElementById('form-global-error');
          globalErr.textContent = res.error || 'Could not save record.';
          globalErr.style.display = 'block';
        }
      } catch (_err) {
        const globalErr = document.getElementById('form-global-error');
        globalErr.textContent = 'Network or server error while saving. Please check your connection and try again.';
        globalErr.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Record';
      }
    });

    function openDeleteModal(id) {
      state.deletingId = id;
      document.getElementById('delete-message').textContent =
        \`Are you sure you want to delete record #\${id} from \${state.activeTab}? This action cannot be undone.\`;
      document.getElementById('delete-modal').classList.add('open');
    }

    document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
      const btn = document.getElementById('confirm-delete-btn');
      btn.disabled = true;
      btn.textContent = 'Deleting...';

      try {
        const res = await apiRequest('DELETE', \`/\${state.activeTab}/\${state.deletingId}\`);
        document.getElementById('delete-modal').classList.remove('open');
        if (res.status === 200) {
          showToast('Record deleted successfully.');
          await loadCurrentModule();
        } else if (res.status === 403) {
          showToast('Permission denied (403): Only the Shop Owner can delete records.', true);
        } else {
          showToast(res.error || 'Could not delete record.', true);
        }
      } catch (_err) {
        showToast('Network failure while deleting record. Please try again.', true);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Delete';
      }
    });

    async function cycleRepairStatus(id, currentStatus) {
      const order = ['pending', 'in_progress', 'completed', 'paid'];
      const next = order[(order.indexOf(currentStatus) + 1) % order.length];
      try {
        const res = await apiRequest('PATCH', \`/repairs/\${id}/status\`, { status: next });
        if (res.status === 200) {
          showToast(\`Repair #\${id} status updated to "\${next}".\`);
          await loadCurrentModule();
        } else {
          showToast(res.error || 'Could not update status.', true);
        }
      } catch (_err) {
        showToast('Network error while updating repair status.', true);
      }
    }

    async function quickRestockPart(id) {
      try {
        const res = await apiRequest('POST', \`/parts/\${id}/restock\`, { addQty: 10 });
        if (res.status === 200) {
          showToast(\`Added +10 units to Part #\${id}.\`);
          await loadCurrentModule();
        } else {
          showToast(res.error || 'Restock failed.', true);
        }
      } catch (_err) {
        showToast('Network error while restocking part.', true);
      }
    }

    document.getElementById('plate-search-btn').addEventListener('click', async () => {
      const plate = document.getElementById('plate-search-input').value.trim();
      if (!plate) {
        showToast('Please enter a plate number in the search box (e.g. ABC-1234).', true);
        return;
      }
      try {
        const res = await apiRequest('GET', '/customers/plate/' + encodeURIComponent(plate));
        if (res.status === 200) {
          viewRecord('customers', res.data.id);
        } else {
          showToast(res.error || 'No matching plate found.', true);
        }
      } catch (_err) {
        showToast('Network error while searching plate.', true);
      }
    });

    document.getElementById('role-select').addEventListener('change', (e) => {
      const isOwner = e.target.value === 'owner';
      document.getElementById('sidebar-role-label').textContent = isOwner ? 'ADMIN • OWNER' : 'GUEST • READ ONLY';
      showToast('Switched active role to ' + (isOwner ? 'Shop Owner (Full Access)' : 'Guest (403 Delete Guard)'));
    });

    document.querySelectorAll('.sidebar-nav button[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    document.getElementById('open-create-btn').onclick = () => openCreateModal();
    document.getElementById('quick-new-repair-btn').onclick = () => openCreateModal('repairs');
    document.getElementById('quick-new-customer-btn').onclick = () => openCreateModal('customers');
    document.getElementById('quick-restock-btn').onclick = () => switchTab('parts');
    document.getElementById('refresh-btn').onclick = () => loadCurrentModule();
    document.getElementById('cancel-form-btn').onclick = () => document.getElementById('form-modal').classList.remove('open');
    document.getElementById('close-detail-btn').onclick = () => document.getElementById('detail-modal').classList.remove('open');
    document.getElementById('cancel-delete-btn').onclick = () => document.getElementById('delete-modal').classList.remove('open');
    document.getElementById('test-404-btn').onclick = () => viewRecord('customers', 999);

    loadCurrentModule();
  </script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderAppHtml());
    return;
  }

  let rawBody = '';
  req.on('data', (chunk) => {
    rawBody += chunk;
  });

  req.on('end', () => {
    let parsedBody = {};
    if (rawBody.trim().length > 0) {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch (_err) {
        const badJson = {
          status: 422,
          error: 'Invalid JSON request body',
          field: 'body',
        };
        res.writeHead(422, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(badJson));
        return;
      }
    }

    const result = handleRequest({
      method: req.method,
      path: req.url,
      body: parsedBody,
      headers: req.headers,
    });

    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result, null, 2));
  });
});

if (require.main === module) {
  server.listen(config.port, () => {
    console.log(
      `${config.shopName} listening on http://localhost:${config.port} (env: ${config.nodeEnv}, debug: ${config.appDebug})`
    );
  });
}

module.exports = server;
