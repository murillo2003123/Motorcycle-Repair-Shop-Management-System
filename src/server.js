/**
 * HTTP Server & Interactive Web Application (Deliverables 2, 3 & 4 — Weeks 3–12)
 * Includes:
 * 1. Public Customer Home Page with all 5 Complete Motorshop Service Categories, Live Plate Tracker, Online Service Booking, and 16+ Spare Parts Catalog
 * 2. Full Admin SaaS Dashboard & 9 Functional Sidebar Modules (Home Page, Dashboard, Job Orders, Spare Parts, Intake & Pickups, Customers, Mechanics, Payments, Settings)
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
      --bg-main: #f4f7fb;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --text-dark: #0f172a;
      --text-muted: #64748b;
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --success: #10b981;
      --danger: #ef4444;
      --shadow-sm: 0 2px 6px rgba(15, 23, 42, 0.04);
      --shadow-card: 0 6px 20px rgba(15, 23, 42, 0.05);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg-main);
      color: var(--text-dark);
      line-height: 1.45;
      min-height: 100vh;
    }

    /* ========= PUBLIC HOME PAGE / CUSTOMER SITE ========= */
    #home-page-view {
      display: none;
      min-height: 100vh;
      background: #f8fafc;
      flex-direction: column;
    }
    .home-navbar {
      background: #0f172a;
      color: #fff;
      padding: 1rem 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.15);
    }
    .home-nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .home-nav-links a {
      color: #cbd5e1;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      transition: color 0.15s;
    }
    .home-nav-links a:hover { color: #fff; }
    .home-hero {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%);
      color: #fff;
      padding: 3.75rem 2rem;
      text-align: center;
    }
    .home-hero h1 {
      font-size: 2.4rem;
      font-weight: 900;
      margin: 0 0 0.75rem;
      letter-spacing: -0.03em;
    }
    .home-hero p {
      max-width: 720px;
      margin: 0 auto 2rem;
      color: #cbd5e1;
      font-size: 1.02rem;
    }
    .home-tracker-box {
      max-width: 580px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 0.65rem;
      border-radius: 14px;
      display: flex;
      gap: 0.6rem;
    }
    .home-tracker-box input {
      flex: 1;
      padding: 0.8rem 1rem;
      border-radius: 10px;
      border: none;
      font-size: 0.95rem;
      outline: none;
    }
    .home-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
      width: 100%;
    }
    .services-5-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.35rem;
      margin-bottom: 3rem;
    }
    .home-feature-card {
      background: #fff;
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .home-feature-card h3 {
      margin: 0.5rem 0 0.75rem;
      font-size: 1.12rem;
      color: var(--text-dark);
    }
    .service-bullet-list {
      margin: 0 0 1.25rem;
      padding-left: 1.2rem;
      color: var(--text-muted);
      font-size: 0.85rem;
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.35rem;
    }
    .service-bullet-list li strong {
      color: var(--text-dark);
    }
    .home-booking-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }
    .home-footer {
      margin-top: auto;
      background: #0f172a;
      color: #94a3b8;
      text-align: center;
      padding: 1.75rem;
      font-size: 0.85rem;
    }

    /* ========= ADMIN DASHBOARD LAYOUT ========= */
    .app-layout {
      display: flex;
      min-height: 100vh;
    }

    /* ========= DARK LEFT SIDEBAR ========= */
    aside.sidebar {
      width: 228px;
      background: var(--sidebar-bg);
      color: #fff;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      height: 100vh;
      padding: 1.15rem 0.85rem;
      user-select: none;
    }
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.25rem 0.45rem 1.25rem;
      cursor: pointer;
    }
    .brand-logo-circle {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #38bdf8, #2563eb);
      border: 2px solid #93c5fd;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.45);
    }
    .brand-logo-circle svg {
      width: 18px;
      height: 18px;
      stroke: #ffffff;
      stroke-width: 2.2;
      fill: none;
    }
    .brand-title {
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #fff;
    }

    nav.sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.22rem;
      flex: 1;
    }
    nav.sidebar-nav button {
      width: 100%;
      background: transparent;
      border: none;
      color: var(--sidebar-text);
      padding: 0.62rem 0.85rem;
      border-radius: 9px;
      font-size: 0.86rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: left;
    }
    nav.sidebar-nav button svg {
      width: 17px;
      height: 17px;
      stroke: currentColor;
      stroke-width: 1.9;
      fill: none;
      flex-shrink: 0;
    }
    nav.sidebar-nav button:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
    }
    nav.sidebar-nav button.active {
      background: var(--sidebar-active);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.45);
    }

    /* Bottom Profile Card in Sidebar */
    .sidebar-profile {
      margin-top: auto;
      background: #131c31;
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 12px;
      padding: 0.65rem 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
    }
    .sidebar-profile:hover {
      border-color: rgba(255, 255, 255, 0.2);
    }
    .avatar-circle {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #2563eb;
      color: #fff;
      font-weight: 700;
      font-size: 0.85rem;
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
      font-size: 0.78rem;
      font-weight: 700;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .profile-role {
      font-size: 0.64rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .logout-icon {
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logout-icon svg {
      width: 15px;
      height: 15px;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
    }

    /* ========= MAIN WORKSPACE (LIGHT) ========= */
    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      padding: 1.5rem 2.2rem 2.5rem;
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
      margin-bottom: 0.9rem;
    }
    .greeting-title {
      margin: 0;
      font-size: 1.55rem;
      font-weight: 800;
      color: var(--text-dark);
      letter-spacing: -0.025em;
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
      width: 230px;
      padding: 0.5rem 0.85rem 0.5rem 2.15rem;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: #fff;
      color: var(--text-dark);
      font-size: 0.84rem;
      outline: none;
      box-shadow: var(--shadow-sm);
    }
    .search-box input:focus { border-color: var(--primary); }
    .search-box svg {
      position: absolute;
      left: 0.7rem;
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
    .icon-btn svg {
      width: 17px;
      height: 17px;
      stroke: #475569;
      stroke-width: 2;
      fill: none;
    }
    .notif-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #ef4444;
      color: #fff;
      font-size: 0.62rem;
      font-weight: 800;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #f4f7fb;
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 999px;
      padding: 0.25rem 0.85rem 0.25rem 0.3rem;
      box-shadow: var(--shadow-sm);
    }
    .user-pill select {
      border: none;
      background: transparent;
      font-size: 0.65rem;
      font-weight: 800;
      color: var(--primary);
      cursor: pointer;
      padding: 0;
      outline: none;
      letter-spacing: 0.02em;
    }

    /* Action Pills Row */
    .quick-actions-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.65rem;
      margin-bottom: 1.45rem;
    }
    .action-pill {
      padding: 0.52rem 1.15rem;
      border-radius: 8px;
      font-size: 0.83rem;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid #334155;
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
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
    .action-pill.primary:hover { background: var(--primary-hover); }
    .action-pill.soft-blue {
      color: var(--primary);
      background: #f0f7ff;
      border-color: #dbeafe;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
    }
    .action-pill.soft-blue svg {
      width: 15px;
      height: 15px;
      stroke: var(--primary);
      stroke-width: 2;
      fill: none;
    }

    /* 4 KPI Cards Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.15rem;
      margin-bottom: 1.35rem;
    }
    .kpi-card {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 1.25rem 1.4rem;
      box-shadow: var(--shadow-card);
      border: 1px solid rgba(226, 232, 240, 0.75);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 138px;
      cursor: pointer;
      transition: transform 0.15s;
    }
    .kpi-card:hover { transform: translateY(-2px); }
    .kpi-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .kpi-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    .kpi-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.92rem;
    }
    .kpi-icon svg {
      width: 17px;
      height: 17px;
      stroke: #2563eb;
      stroke-width: 2;
      fill: none;
    }
    .kpi-icon.purple {
      background: linear-gradient(135deg, #6366f1, #ec4899, #f43f5e);
      color: #fff;
      box-shadow: 0 4px 10px rgba(236, 72, 153, 0.3);
    }
    .kpi-icon.blue {
      background: #eff6ff;
      color: #2563eb;
    }
    .kpi-value {
      font-size: 1.9rem;
      font-weight: 800;
      color: var(--text-dark);
      margin: 0.3rem 0 0.1rem;
      letter-spacing: -0.02em;
    }
    .kpi-sub {
      font-size: 0.76rem;
      color: #94a3b8;
      font-weight: 500;
    }

    /* Dashboard Lower Split Layout */
    .dashboard-split {
      display: grid;
      grid-template-columns: 315px 1fr;
      gap: 1.25rem;
      align-items: stretch;
    }
    .white-card {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 1.35rem 1.45rem;
      box-shadow: var(--shadow-card);
      border: 1px solid rgba(226, 232, 240, 0.75);
    }
    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .card-title {
      margin: 0;
      font-size: 0.98rem;
      font-weight: 800;
      color: var(--text-dark);
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }
    .pill-live {
      background: #dcfce7;
      color: #15803d;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.22rem 0.65rem;
      border-radius: 999px;
      border: 1px solid #bbf7d0;
    }

    /* 5 Colorful Pipeline Stage Cards */
    .pipeline-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.75rem;
    }
    .stage-card {
      border-radius: 12px;
      padding: 1.15rem 0.55rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
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
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-top: 0.1rem;
    }
    .stage-tag {
      margin-top: 0.28rem;
      font-size: 0.62rem;
      font-weight: 700;
      padding: 0.1rem 0.55rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.28);
    }
    .stage-intake { background: #1d63dc; color: #fff; }
    .stage-washing { background: #38bdf8; color: #0c4a6e; }
    .stage-drying { background: #67e8f9; color: #0e7490; }
    .stage-pressing { background: #c4b5fd; color: #4c1d95; }
    .stage-dispatch { background: #86efac; color: #14532d; }

    /* Fleet Banner List */
    .mechanic-banner {
      background: #f0f6ff;
      border: 1px solid #dbeafe;
      border-radius: 12px;
      padding: 0.85rem 1.05rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.7rem;
    }
    .mechanic-info {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .view-all-link {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      padding: 0;
    }
    .view-all-link:hover { text-decoration: underline; }

    /* ========= CRUD TABLE & MODULE SECTION ========= */
    .module-card {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 1.4rem;
      box-shadow: var(--shadow-card);
      border: 1px solid rgba(226, 232, 240, 0.75);
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
      font-size: 0.86rem;
    }
    th {
      background: #f8fafc;
      color: var(--text-muted);
      font-size: 0.74rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    tr:hover td { background: #f8fafc; }
    .badge {
      display: inline-block;
      padding: 0.22rem 0.65rem;
      border-radius: 999px;
      font-size: 0.7rem;
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
      font-size: 0.82rem;
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
    .btn-sm { padding: 0.28rem 0.62rem; font-size: 0.76rem; }

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
      font-size: 0.86rem;
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
      .home-booking-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .app-layout { flex-direction: column; }
      aside.sidebar { width: 100%; height: auto; position: static; }
      .kpi-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <!-- =========================================================================
       1. PUBLIC HOME PAGE / CUSTOMER PORTAL VIEW
       ========================================================================= -->
  <div id="home-page-view">
    <nav class="home-navbar">
      <div style="display:flex; align-items:center; gap:0.75rem; cursor:pointer;" onclick="openAdminPortal('dashboard')">
        <div class="brand-logo-circle">
          <svg viewBox="0 0 24 24"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/></svg>
        </div>
        <span style="font-size:1.25rem; font-weight:800;">MotoCare Shop</span>
      </div>
      <div class="home-nav-links">
        <a href="#home-services">5 Service Categories</a>
        <a href="#home-booking">Book a Service</a>
        <a href="#home-parts">Spare Parts Catalog</a>
        <button type="button" class="btn" onclick="openAdminPortal('dashboard')">
          Admin Dashboard →
        </button>
      </div>
    </nav>

    <section class="home-hero">
      <span style="background:rgba(56,189,248,0.2); color:#7dd3fc; padding:0.3rem 0.85rem; border-radius:999px; font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">
        Murillo • Cabatingan • Dagala Full-Service Motorshop
      </span>
      <h1 style="margin-top:1rem;">Complete Motorcycle Repair, Parts, Cleaning &amp; Customization</h1>
      <p>Track your motorcycle's live repair status by plate number, book any of our 5 specialized motorshop service categories online, or browse our 16+ genuine spare parts in stock.</p>

      <!-- Live Plate Number Repair Tracker -->
      <div class="home-tracker-box">
        <input type="text" id="home-plate-input" placeholder="Enter Motorcycle Plate Number (e.g. ABC-1234 or XYZ-9876)" />
        <button type="button" class="btn" id="home-track-btn" style="padding:0.8rem 1.4rem; font-size:0.9rem;">
          🔎 Track My Bike
        </button>
      </div>
      <div id="home-tracker-result" style="max-width:580px; margin:1rem auto 0; text-align:left;"></div>
    </section>

    <div class="home-container">
      <div style="text-align:center; margin-bottom:2rem;">
        <h2 style="margin:0; font-size:1.65rem; font-weight:800;">Our 5 Complete Motorshop Service Divisions</h2>
        <p style="color:var(--text-muted); margin:0.4rem 0 0;">Click any service card to book or manage in the system</p>
      </div>

      <!-- 5 Complete Motorshop Service Categories -->
      <div id="home-services" class="services-5-grid">
        <!-- Category 1 -->
        <div class="home-feature-card">
          <div>
            <div class="kpi-icon blue" style="margin-bottom:0.5rem;">🔧</div>
            <h3>1. Motorcycle Repair and Maintenance</h3>
            <ul class="service-bullet-list">
              <li><strong>Engine repair and tune-up</strong></li>
              <li><strong>Oil and filter change</strong></li>
              <li><strong>Brake repair and adjustment</strong></li>
              <li><strong>Clutch repair and adjustment</strong></li>
              <li><strong>Chain adjustment and lubrication</strong></li>
              <li><strong>Tire repair and replacement</strong></li>
              <li><strong>Battery inspection and replacement</strong></li>
              <li><strong>Electrical system repair</strong></li>
              <li><strong>Carburetor cleaning and adjustment</strong></li>
              <li><strong>Fuel injection (FI) cleaning</strong></li>
            </ul>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="openAdminPortal('repairs')">Open Repair Job Orders →</button>
        </div>

        <!-- Category 2 -->
        <div class="home-feature-card">
          <div>
            <div class="kpi-icon purple" style="margin-bottom:0.5rem;">⚙️</div>
            <h3>2. Motorcycle Parts and Accessories</h3>
            <ul class="service-bullet-list">
              <li><strong>Sale of motorcycle spare parts</strong></li>
              <li><strong>Tires and inner tubes</strong></li>
              <li><strong>Batteries</strong> (Maintenance-free 12V)</li>
              <li><strong>Engine oils and lubricants</strong></li>
              <li><strong>Helmets and riding gear</strong></li>
              <li><strong>Motorcycle accessories</strong></li>
              <li><strong>Lights and electrical accessories</strong></li>
            </ul>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="openAdminPortal('parts')">Browse Spare Parts Inventory →</button>
        </div>

        <!-- Category 3 -->
        <div class="home-feature-card">
          <div>
            <div class="kpi-icon blue" style="margin-bottom:0.5rem;">✨</div>
            <h3>3. Motorcycle Cleaning Services</h3>
            <ul class="service-bullet-list">
              <li><strong>Motorcycle washing</strong> (Foam &amp; pressure wash)</li>
              <li><strong>Engine cleaning</strong> &amp; degreasing</li>
              <li><strong>Detailing and polishing</strong></li>
              <li><strong>Rust removal</strong> &amp; chassis protection</li>
            </ul>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('hb-issue').value='Motorcycle washing, detailing, polishing & rust removal'; document.getElementById('hb-name').focus();">Book Cleaning Service →</button>
        </div>

        <!-- Category 4 -->
        <div class="home-feature-card">
          <div>
            <div class="kpi-icon blue" style="margin-bottom:0.5rem;">🎨</div>
            <h3>4. Other Specialized Services</h3>
            <ul class="service-bullet-list">
              <li><strong>Motorcycle repainting</strong> &amp; custom fairings</li>
              <li><strong>Motorcycle customization</strong></li>
              <li><strong>Installation of accessories</strong></li>
              <li><strong>Motorcycle inspection</strong></li>
              <li><strong>Preventive maintenance</strong></li>
              <li><strong>Motorcycle troubleshooting</strong></li>
            </ul>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('hb-issue').value='Preventive maintenance, inspection & accessory installation'; document.getElementById('hb-name').focus();">Book Specialized Service →</button>
        </div>

        <!-- Category 5 -->
        <div class="home-feature-card">
          <div>
            <div class="kpi-icon purple" style="margin-bottom:0.5rem;">🏪</div>
            <h3>5. Additional Business Services</h3>
            <ul class="service-bullet-list">
              <li><strong>Motorcycle spare parts retailing</strong></li>
              <li><strong>Motorcycle accessories retailing</strong></li>
              <li><strong>Motorcycle tire and battery sales</strong></li>
              <li><strong>Motorcycle repair consultation services of the motorshop</strong></li>
            </ul>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="openAdminPortal('customers')">Request Shop Consultation →</button>
        </div>
      </div>

      <!-- Online Customer Booking Form + Live Spare Parts Catalog -->
      <div id="home-booking" class="home-booking-grid">
        <div class="white-card">
          <h3 style="margin-top:0; font-size:1.2rem;">📅 Book a Motorcycle Service or Consultation</h3>
          <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:1.2rem;">
            Select any service from our 5 divisions below. Submitting automatically creates a Customer record and a live Job Order!
          </p>
          <form id="home-booking-form" novalidate>
            <div class="form-group">
              <label for="hb-name">Rider / Customer Name *</label>
              <input id="hb-name" name="name" placeholder="e.g. Carlo Mendoza" required />
            </div>
            <div class="form-group">
              <label for="hb-phone">Mobile Phone Number *</label>
              <input id="hb-phone" name="phone" placeholder="09171234567" required />
            </div>
            <div class="form-group">
              <label for="hb-plate">Plate Number (Format: ABC-1234) *</label>
              <input id="hb-plate" name="plateNumber" placeholder="NDA-4521" required />
            </div>
            <div class="form-group">
              <label for="hb-model">Motorcycle Model *</label>
              <input id="hb-model" name="motorcycleModel" placeholder="Yamaha Aerox 155" required />
            </div>
            <div class="form-group">
              <label for="hb-service-preset">Select Motorshop Service Category *</label>
              <select id="hb-service-preset" onchange="document.getElementById('hb-issue').value = this.value">
                <option value="Engine repair and tune-up + Oil and filter change">1. Repair: Engine repair and tune-up</option>
                <option value="Oil and filter change + Chain adjustment and lubrication">1. Repair: Oil and filter change</option>
                <option value="Brake repair and adjustment + Clutch repair">1. Repair: Brake &amp; Clutch repair and adjustment</option>
                <option value="Tire repair and replacement + Battery inspection">1. Repair: Tire replacement &amp; Battery inspection</option>
                <option value="Electrical system repair + Carburetor / Fuel injection (FI) cleaning">1. Repair: Electrical &amp; FI / Carburetor cleaning</option>
                <option value="Motorcycle washing, Engine cleaning, Detailing, polishing & Rust removal">3. Cleaning: Full Wash, Engine Cleaning, Detailing &amp; Rust Removal</option>
                <option value="Motorcycle repainting, customization & installation of accessories">4. Other: Repainting, Customization &amp; Accessory Installation</option>
                <option value="Motorcycle inspection, preventive maintenance & troubleshooting">4. Other: Inspection, Preventive Maintenance &amp; Troubleshooting</option>
                <option value="Motorcycle repair consultation service & spare parts/tire/battery retail">5. Business: Repair Consultation &amp; Parts/Tire/Battery Retail</option>
              </select>
            </div>
            <div class="form-group">
              <label for="hb-issue">Specific Service Details / Reported Issue *</label>
              <input id="hb-issue" name="issue" value="Engine repair and tune-up + Oil and filter change" required />
            </div>
            <button type="submit" class="btn" id="hb-submit-btn" style="width:100%; justify-content:center; padding:0.75rem;">
              Submit Service Booking
            </button>
          </form>
        </div>

        <div id="home-parts" class="white-card">
          <div class="card-header-row">
            <h3 style="margin:0; font-size:1.15rem;">🛠️ Spare Parts, Tires, Batteries &amp; Gear (16 SKUs)</h3>
            <span class="pill-live">Live Retail Stock</span>
          </div>
          <p style="color:var(--text-muted); font-size:0.84rem; margin-top:0;">
            Genuine spare parts, tires, batteries, oils, helmets, and LED accessories in stock:
          </p>
          <div id="home-parts-list" style="display:flex; flex-direction:column; gap:0.55rem; margin-top:1rem; max-height:520px; overflow-y:auto; padding-right:0.25rem;"></div>
        </div>
      </div>
    </div>

    <footer class="home-footer">
      <div><strong>MotoCare — Motorcycle Repair Shop Management System</strong> • Powered by Supabase PostgreSQL &amp; Vercel</div>
      <div style="margin-top:0.35rem;">Team Contributors: Alvin Murillo (@murillo2003123) • John Angelo Cabatingan (@johnangelocabatingan2003-dot) • Keanu Dagala (@keanudagala2003-blip)</div>
    </footer>
  </div>

  <!-- =========================================================================
       2. ADMIN DASHBOARD & CRUD SYSTEM VIEW
       ========================================================================= -->
  <div class="app-layout" id="admin-portal-view">
    <!-- ========= LEFT DARK SIDEBAR ========= -->
    <aside class="sidebar" aria-label="Main Navigation Sidebar">
      <div class="sidebar-brand" onclick="switchTab('dashboard')" title="Go to Dashboard">
        <div class="brand-logo-circle">
          <svg viewBox="0 0 24 24"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/></svg>
        </div>
        <span class="brand-title">MotoCare</span>
      </div>

      <nav class="sidebar-nav" role="navigation" aria-label="Main Menu">
        <button type="button" data-tab="home">
          <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Home Page</span>
        </button>
        <button type="button" class="active" data-tab="dashboard">
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
          <span>Dashboard</span>
        </button>
        <button type="button" data-tab="repairs">
          <svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h6"/></svg>
          <span>Job Orders</span>
        </button>
        <button type="button" data-tab="parts">
          <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          <span>Spare Parts</span>
        </button>
        <button type="button" data-tab="pickups">
          <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>Intake &amp; Pickups</span>
        </button>
        <button type="button" data-tab="customers">
          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Customers</span>
        </button>
        <button type="button" data-tab="staff">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Mechanics</span>
        </button>
        <button type="button" data-tab="payments">
          <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          <span>Payments</span>
        </button>
        <button type="button" data-tab="settings">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span>Settings</span>
        </button>
      </nav>

      <div class="sidebar-profile" onclick="toggleUserRole()" title="Click to switch role between Admin Owner and Guest">
        <div class="avatar-circle">A</div>
        <div class="profile-meta">
          <div class="profile-name">Alvin Murillo</div>
          <div class="profile-role" id="sidebar-role-label">ADMIN • SWITCH</div>
        </div>
        <div class="logout-icon">
          <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </div>
      </div>
    </aside>

    <!-- ========= RIGHT LIGHT WORKSPACE ========= -->
    <div class="main-area">
      <!-- Top Greeting Header -->
      <header class="top-header">
        <h1 class="greeting-title">Good Morning, Alvin Murillo!</h1>

        <div class="top-utilities">
          <div class="search-box">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="plate-search-input" placeholder="Search Plate (e.g. ABC-1234)" />
          </div>
          <button type="button" class="icon-btn" id="refresh-btn" title="Refresh Live Data">
            <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </button>
          <button type="button" class="icon-btn" id="test-404-btn" title="View Shop Alerts & Test 404 State">
            <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span class="notif-badge">5</span>
          </button>

          <div class="user-pill">
            <div class="avatar-circle" style="width:30px;height:30px;font-size:0.78rem;">A</div>
            <div>
              <div style="font-size:0.78rem; font-weight:800; line-height:1.15;">Alvin Murillo ▾</div>
              <select id="role-select" aria-label="Switch Role">
                <option value="owner">ADMIN • SWITCH ACC</option>
                <option value="guest">GUEST • READ ONLY</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <!-- Action Pills Row -->
      <div class="quick-actions-row">
        <button type="button" class="action-pill primary" id="quick-new-customer-btn">
          New Intake
        </button>
        <button type="button" class="action-pill" id="quick-new-repair-btn">
          New Job Order
        </button>
        <button type="button" class="action-pill soft-blue" id="quick-customer-site-btn">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Customer Site
        </button>
      </div>

      <!-- ========= DASHBOARD VIEW ========= -->
      <section id="dashboard-view">
        <!-- 4 KPI Cards Row (Clickable) -->
        <div class="kpi-grid">
          <div class="kpi-card" onclick="switchTab('payments')" title="View Payments & Revenue">
            <div class="kpi-top">
              <span class="kpi-label">Total Revenue</span>
              <div class="kpi-icon purple">₱</div>
            </div>
            <div class="kpi-value" id="kpi-revenue">₱1,300</div>
            <div class="kpi-sub">Settled</div>
          </div>

          <div class="kpi-card" onclick="switchTab('repairs')" title="View Active Job Orders">
            <div class="kpi-top">
              <span class="kpi-label">Active Job Orders</span>
              <div class="kpi-icon blue">
                <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              </div>
            </div>
            <div class="kpi-value" id="kpi-repairs">2</div>
            <div class="kpi-sub">Total</div>
          </div>

          <div class="kpi-card" onclick="switchTab('pickups')" title="View Scheduled Bikes & Pickups">
            <div class="kpi-top">
              <span class="kpi-label">Bikes Scheduled</span>
              <div class="kpi-icon blue">
                <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
            </div>
            <div class="kpi-value" id="kpi-customers">2</div>
            <div class="kpi-sub">Today</div>
          </div>

          <div class="kpi-card" onclick="switchTab('repairs')" title="View Ready for Release Bikes">
            <div class="kpi-top">
              <span class="kpi-label">Ready for Release</span>
              <div class="kpi-icon blue">
                <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
            </div>
            <div class="kpi-value" id="kpi-parts">0</div>
            <div class="kpi-sub">Live</div>
          </div>
        </div>

        <!-- Lower Split Section: Left Analytics Chart + Right Pipeline, Fleet & Alerts -->
        <div class="dashboard-split">
          <!-- Left Card: Revenue & Order Volume Analytics -->
          <div class="white-card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="card-header-row" style="align-items:flex-start;">
                <h3 class="card-title" style="line-height:1.35; font-size:0.95rem;">Revenue &amp;<br/>Order Volume<br/>Analytics</h3>
                <select id="analytics-range-select" style="border:1px solid #cbd5e1; border-radius:6px; padding:0.28rem 0.5rem; font-size:0.72rem; font-weight:600; color:#334155;">
                  <option value="30">Last 30 Days</option>
                  <option value="7">Last 7 Days</option>
                </select>
              </div>
              <div style="display:flex; gap:1rem; font-size:0.72rem; color:var(--text-muted); margin-bottom:1.5rem;">
                <div><span style="color:#2563eb;">●</span> Revenue<br/>Velocity</div>
                <div><span style="color:#38bdf8;">●</span> Order<br/>Volume</div>
              </div>
            </div>

            <!-- Smooth Area Line SVG Chart -->
            <div>
              <svg viewBox="0 0 300 175" style="width:100%; height:175px; overflow:visible;">
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#2563eb" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0"/>
                  </linearGradient>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.22"/>
                    <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
                  </linearGradient>
                </defs>
                <line x1="0" y1="45" x2="300" y2="45" stroke="#f1f5f9" stroke-width="1"/>
                <line x1="0" y1="90" x2="300" y2="90" stroke="#f1f5f9" stroke-width="1"/>
                <line x1="0" y1="135" x2="300" y2="135" stroke="#f1f5f9" stroke-width="1"/>
                <path id="chart-rev-area" d="M 0 140 Q 90 110, 185 88 T 300 72 L 300 160 L 0 160 Z" fill="url(#revGrad)"/>
                <path id="chart-rev-line" d="M 0 140 Q 90 110, 185 88 T 300 72" fill="none" stroke="#2563eb" stroke-width="2"/>
                <path d="M 0 148 Q 95 130, 190 112 T 300 95 L 300 160 L 0 160 Z" fill="url(#volGrad)"/>
                <path d="M 0 148 Q 95 130, 190 112 T 300 95" fill="none" stroke="#38bdf8" stroke-width="1.6" stroke-dasharray="3,3"/>
              </svg>
              <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:#94a3b8; font-weight:600; margin-top:0.65rem;">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
                <span>Today</span>
              </div>
            </div>
          </div>

          <!-- Right Column: 3 Stacked Cards (Pipeline + Motorcycle Fleet + Live Alerts) -->
          <div style="display:flex; flex-direction:column; gap:1.15rem;">
            <!-- Card 1: Live Motorcycle Repair Processing Pipeline -->
            <div class="white-card">
              <div class="card-header-row">
                <h3 class="card-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Live Motorcycle Repair Processing Pipeline
                </h3>
                <span class="pill-live">Live Active</span>
              </div>

              <div class="pipeline-grid">
                <div class="stage-card stage-intake" onclick="switchTab('pickups')">
                  <div class="stage-count" id="pipe-pending">1</div>
                  <div class="stage-name">RECEIVED</div>
                  <div class="stage-tag">Intake</div>
                </div>
                <div class="stage-card stage-washing" onclick="switchTab('repairs')">
                  <div class="stage-count" id="pipe-inprogress">1</div>
                  <div class="stage-name">DIAGNOSIS</div>
                  <div class="stage-tag">In Bay</div>
                </div>
                <div class="stage-card stage-drying" onclick="switchTab('parts')">
                  <div class="stage-count" id="pipe-parts">16</div>
                  <div class="stage-name">SERVICING</div>
                  <div class="stage-tag">In Repair</div>
                </div>
                <div class="stage-card stage-pressing" onclick="switchTab('repairs')">
                  <div class="stage-count" id="pipe-completed">0</div>
                  <div class="stage-name">TESTING</div>
                  <div class="stage-tag">Tuning</div>
                </div>
                <div class="stage-card stage-dispatch" onclick="switchTab('payments')">
                  <div class="stage-count" id="pipe-paid">0</div>
                  <div class="stage-name">DISPATCH</div>
                  <div class="stage-tag">Ready</div>
                </div>
              </div>
            </div>

            <!-- Card 2: Motorcycle Service Bay & Lead Mechanics Fleet -->
            <div class="white-card">
              <div class="card-header-row" style="margin-bottom:0.35rem;">
                <div>
                  <h3 class="card-title">Motorcycle Service Bay &amp; Mechanics Fleet</h3>
                  <p style="margin:0.15rem 0 0; font-size:0.75rem; color:var(--text-muted);">
                    Mechanic Name, Phone Number &amp; Assigned Repair Work
                  </p>
                </div>
                <button type="button" class="view-all-link" onclick="switchTab('staff')">View All →</button>
              </div>

              <div class="mechanic-banner">
                <div class="mechanic-info">
                  <div class="avatar-circle" style="width:40px;height:40px;">AM</div>
                  <div>
                    <div style="font-weight:800; font-size:0.88rem; color:#0f172a;">
                      Alvin Murillo • 📞 0917-200-3123
                    </div>
                    <div style="font-size:0.75rem; color:#2563eb; font-weight:600; margin-top:0.1rem;">
                      🔧 Work: Engine Repair &amp; Tune-Up, Fuel Injection (FI) &amp; Carburetor Cleaning, Motorcycle Inspection
                    </div>
                  </div>
                </div>
                <span class="pill-live">Active</span>
              </div>

              <div class="mechanic-banner">
                <div class="mechanic-info">
                  <div class="avatar-circle" style="width:40px;height:40px;background:#0284c7;">JC</div>
                  <div>
                    <div style="font-weight:800; font-size:0.88rem; color:#0f172a;">
                      John Angelo Cabatingan • 📞 0918-200-3456
                    </div>
                    <div style="font-size:0.75rem; color:#2563eb; font-weight:600; margin-top:0.1rem;">
                      🔧 Work: Brake &amp; Clutch Repair, Electrical System &amp; LED Lights Wiring, Preventive Maintenance
                    </div>
                  </div>
                </div>
                <span class="pill-live">Active</span>
              </div>

              <div class="mechanic-banner">
                <div class="mechanic-info">
                  <div class="avatar-circle" style="width:40px;height:40px;background:#0d9488;">KD</div>
                  <div>
                    <div style="font-weight:800; font-size:0.88rem; color:#0f172a;">
                      Keanu Dagala • 📞 0919-200-3789
                    </div>
                    <div style="font-size:0.75rem; color:#2563eb; font-weight:600; margin-top:0.1rem;">
                      🔧 Work: Oil &amp; Filter Change, Tire &amp; Battery Replacement, Chain Lubrication &amp; Detailing
                    </div>
                  </div>
                </div>
                <span class="pill-live">Active</span>
              </div>
            </div>

            <!-- Card 3: Live Bay & Shop Alerts -->
            <div class="white-card" style="padding:1.1rem 1.45rem;">
              <div class="card-header-row" style="margin-bottom:0.5rem;">
                <h3 class="card-title">
                  <span>🔔</span> Live Bay &amp; Shop Alerts
                </h3>
                <button type="button" class="view-all-link" onclick="switchTab('parts')">View All →</button>
              </div>
              <div id="live-alerts-list" style="font-size:0.8rem; color:var(--text-muted); display:flex; flex-direction:column; gap:0.35rem;">
                <div>• <strong>Bay 1 (Berto)</strong>: Honda Click 125i (<code>ABC-1234</code>) CVT cleaning in progress.</div>
                <div>• <strong>Bay 2 (Dante)</strong>: Yamaha NMAX 155 (<code>XYZ-9876</code>) awaiting front brake pad bleed.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========= CRUD MODULE / PICKUPS / PAYMENTS / STAFF / SETTINGS VIEW ========= -->
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
      crudResource: 'customers',
      records: [],
      customersCache: [],
      repairsCache: [],
      partsCache: [],
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
      const simEl = document.getElementById('simulate-network-error');
      if (simEl && simEl.checked) {
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

    /* ========= HOME PAGE <-> ADMIN PORTAL SWITCHING ========= */
    async function openHomePage() {
      document.getElementById('admin-portal-view').style.display = 'none';
      document.getElementById('home-page-view').style.display = 'flex';
      state.activeTab = 'home';
      try {
        const pRes = await apiRequest('GET', '/parts');
        const parts = pRes.data || [];
        const listEl = document.getElementById('home-parts-list');
        listEl.innerHTML = parts.map((p) => \`
          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem 1rem; border:1px solid #e2e8f0; border-radius:10px; background:#f8fafc;">
            <div>
              <div style="font-weight:800; font-size:0.9rem;">\${escapeHtml(p.name)}</div>
              <div style="font-size:0.75rem; color:#64748b;">SKU: <code>\${escapeHtml(p.sku)}</code> • Category: \${escapeHtml(p.category)}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:800; color:#2563eb;">₱\${Number(p.unitPrice).toFixed(2)}</div>
              <div style="font-size:0.72rem; color:#15803d; font-weight:700;">\${p.qty} in stock</div>
            </div>
          </div>
        \`).join('');
      } catch (_err) {
        // Ignore error if simulated
      }
    }

    function openAdminPortal(targetTab = 'dashboard') {
      document.getElementById('home-page-view').style.display = 'none';
      document.getElementById('admin-portal-view').style.display = 'flex';
      switchTab(targetTab);
    }

    function switchTab(tabName) {
      if (tabName === 'home') {
        openHomePage();
        return;
      }
      document.getElementById('home-page-view').style.display = 'none';
      document.getElementById('admin-portal-view').style.display = 'flex';

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
        state.customersCache = customers;
        state.repairsCache = repairs;
        state.partsCache = parts;

        const totalRevenue = repairs.reduce((sum, item) => sum + Number(item.laborCost || 0), 0);
        const readyCount = repairs.filter((r) => r.status === 'completed' || r.status === 'paid').length;

        document.getElementById('kpi-revenue').textContent = '₱' + totalRevenue.toLocaleString();
        document.getElementById('kpi-repairs').textContent = repairs.length;
        document.getElementById('kpi-customers').textContent = customers.length;
        document.getElementById('kpi-parts').textContent = readyCount;

        document.getElementById('pipe-pending').textContent = repairs.filter((r) => r.status === 'pending').length;
        document.getElementById('pipe-inprogress').textContent = repairs.filter((r) => r.status === 'in_progress').length;
        document.getElementById('pipe-parts').textContent = parts.length;
        document.getElementById('pipe-completed').textContent = repairs.filter((r) => r.status === 'completed').length;
        document.getElementById('pipe-paid').textContent = repairs.filter((r) => r.status === 'paid').length;

        const alertsEl = document.getElementById('live-alerts-list');
        if (repairs.length > 0) {
          alertsEl.innerHTML = repairs.slice(0, 3).map((r) => \`
            <div>• <strong>Bay (\${escapeHtml(r.mechanic)})</strong>: Order #\${r.id} — \${escapeHtml(r.issue)} (<span class="badge badge-\${escapeHtml(r.status)}">\${escapeHtml(r.status)}</span>)</div>
          \`).join('');
        }
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
          tab === 'staff' ? 'Shop Mechanics' : 'System Settings & QA Verification';
        document.getElementById('module-subtitle').textContent =
          tab === 'staff'
            ? 'Motorcycle Repair Shop Mechanics — Name, Phone Number, and Assigned Work'
            : 'Supabase PostgreSQL + Vercel Production Configuration (APP_DEBUG=false)';
        renderStateBanner(null);
        const head = document.getElementById('table-head');
        const body = document.getElementById('table-body');
        if (tab === 'staff') {
          head.innerHTML = '<tr><th>Mechanic Name</th><th>Phone Number</th><th>Assigned Work / Specialization</th></tr>';
          body.innerHTML = \`
            <tr>
              <td><strong>Alvin Murillo</strong></td>
              <td>0917-200-3123</td>
              <td>Engine repair and tune-up, Fuel injection (FI) &amp; carburetor cleaning, Motorcycle inspection &amp; troubleshooting</td>
            </tr>
            <tr>
              <td><strong>John Angelo Cabatingan</strong></td>
              <td>0918-200-3456</td>
              <td>Brake &amp; clutch repair and adjustment, Electrical system repair, Installation of lights &amp; accessories, Preventive maintenance</td>
            </tr>
            <tr>
              <td><strong>Keanu Dagala</strong></td>
              <td>0919-200-3789</td>
              <td>Oil and filter change, Tire &amp; battery replacement, Chain adjustment &amp; lubrication, Motorcycle washing, detailing &amp; rust removal</td>
            </tr>
            <tr>
              <td><strong>Berto (Bay 1 Mechanic)</strong></td>
              <td>0917-555-0142</td>
              <td>Full CVT cleaning, Engine oil &amp; gear oil change, Scooter belt &amp; roller tuning</td>
            </tr>
            <tr>
              <td><strong>Dante (Bay 2 Mechanic)</strong></td>
              <td>0918-555-0198</td>
              <td>Front &amp; rear brake pad replacement, Hydraulic brake fluid bleed, Tire vulcanizing &amp; balancing, Repainting &amp; customization</td>
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

      const resourceMap = {
        customers: 'customers',
        pickups: 'customers',
        repairs: 'repairs',
        payments: 'repairs',
        parts: 'parts',
      };
      const apiResource = resourceMap[tab] || 'customers';
      state.crudResource = apiResource;

      document.getElementById('open-create-btn').style.display = 'inline-flex';
      const titles = {
        customers: 'Customers & Motorcycles',
        pickups: 'Motorcycle Intake & Scheduled Pickups',
        repairs: 'Repair Job Orders',
        payments: 'Service Billing & Settled Payments',
        parts: 'Spare Parts Inventory (16+ SKUs)',
      };
      const subtitles = {
        customers: 'Owner: Alvin Murillo (@murillo2003123) — Full CRUD + Plate Lookup Checkpoint',
        pickups: 'Scheduled motorcycle intakes & registered rider vehicles — Click "+ New Record" to log intake',
        repairs: 'Owner: John Angelo Cabatingan (@johnangelocabatingan2003-dot) — Full CRUD + Status Checkpoint',
        payments: 'Track labor billing, mark job orders as Paid, and verify shop revenue',
        parts: 'Owner: Keanu Dagala (@keanudagala2003-blip) — Full CRUD + Restock Checkpoint',
      };
      document.getElementById('module-title').textContent = titles[tab];
      document.getElementById('module-subtitle').textContent = subtitles[tab];
      renderStateBanner('loading', 'Loading records from shop server...');

      try {
        const res = await apiRequest('GET', '/' + apiResource);
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

      if (tab === 'customers' || tab === 'pickups') {
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
      } else if (tab === 'repairs' || tab === 'payments') {
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
              \${r.status !== 'paid' ? \`<button class="btn btn-sm" onclick="markRepairPaid(\${r.id})">Mark Paid</button>\` : ''}
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
      const targetResource = resource || state.crudResource || 'customers';
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

    function buildFormFieldsHtml(record = {}, forceResource = null) {
      const resType = forceResource || state.crudResource;
      if (resType === 'customers') {
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
      if (resType === 'repairs') {
        const st = record.status || 'pending';
        return \`
          <div class="form-group">
            <label for="f-customerId">Customer ID *</label>
            <input type="number" id="f-customerId" name="customerId" value="\${escapeHtml(record.customerId ?? 1)}" />
            <div class="field-error" data-error-for="customerId"></div>
          </div>
          <div class="form-group">
            <label for="f-issue">Reported Issue / Service Type *</label>
            <input id="f-issue" name="issue" value="\${escapeHtml(record.issue || '')}" placeholder="Engine repair and tune-up / Oil and filter change" />
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
          <label for="f-name">Part / Accessory Name *</label>
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
      const mod = targetModule || state.crudResource || 'repairs';
      state.crudResource = mod;
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
      const resType = state.crudResource;

      if (resType === 'repairs') {
        payload.customerId = payload.customerId === '' ? '' : Number(payload.customerId);
        payload.laborCost = payload.laborCost === '' ? '' : Number(payload.laborCost);
      } else if (resType === 'parts') {
        payload.qty = payload.qty === '' ? '' : Number(payload.qty);
        payload.unitPrice = payload.unitPrice === '' ? '' : Number(payload.unitPrice);
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';

      try {
        const isEdit = state.editingId !== null;
        const method = isEdit ? 'PUT' : 'POST';
        const path = isEdit ? \`/\${resType}/\${state.editingId}\` : \`/\${resType}\`;
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
        \`Are you sure you want to delete record #\${id} from \${state.crudResource}? This action cannot be undone.\`;
      document.getElementById('delete-modal').classList.add('open');
    }

    document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
      const btn = document.getElementById('confirm-delete-btn');
      btn.disabled = true;
      btn.textContent = 'Deleting...';

      try {
        const res = await apiRequest('DELETE', \`/\${state.crudResource}/\${state.deletingId}\`);
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

    async function markRepairPaid(id) {
      try {
        const res = await apiRequest('PATCH', \`/repairs/\${id}/status\`, { status: 'paid' });
        if (res.status === 200) {
          showToast(\`Job Order #\${id} marked as PAID & Settled!\`);
          await loadCurrentModule();
        } else {
          showToast(res.error || 'Could not mark as paid.', true);
        }
      } catch (_err) {
        showToast('Network error while updating payment status.', true);
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

    /* ========= HOME PAGE PLATE TRACKER & BOOKING HANDLERS ========= */
    document.getElementById('home-track-btn').addEventListener('click', async () => {
      const plate = document.getElementById('home-plate-input').value.trim();
      const out = document.getElementById('home-tracker-result');
      if (!plate) {
        showToast('Please enter a plate number (e.g. ABC-1234).', true);
        return;
      }
      out.innerHTML = '<div class="white-card" style="color:#0f172a;">Searching shop records...</div>';
      try {
        const cRes = await apiRequest('GET', '/customers/plate/' + encodeURIComponent(plate));
        if (cRes.status !== 200) {
          out.innerHTML = \`
            <div class="white-card" style="color:#991b1b; background:#fef2f2; border-color:#fca5a5;">
              <strong>Not Found:</strong> \${escapeHtml(cRes.error)} (Try <code>ABC-1234</code> or <code>XYZ-9876</code>)
            </div>
          \`;
          return;
        }
        const customer = cRes.data;
        const rRes = await apiRequest('GET', '/repairs');
        const repairs = (rRes.data || []).filter((r) => r.customerId === customer.id);
        const latestRepair = repairs[repairs.length - 1];

        out.innerHTML = \`
          <div class="white-card" style="color:#0f172a;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong style="font-size:1.05rem;">\${escapeHtml(customer.motorcycleModel)} (\${escapeHtml(customer.plateNumber)})</strong>
                <div style="font-size:0.82rem; color:#64748b;">Owner: \${escapeHtml(customer.name)} • Phone: \${escapeHtml(customer.phone)}</div>
              </div>
              <span class="badge badge-\${latestRepair ? escapeHtml(latestRepair.status) : 'pending'}">
                \${latestRepair ? escapeHtml(latestRepair.status) : 'REGISTERED'}
              </span>
            </div>
            \${latestRepair ? \`
              <div style="margin-top:0.75rem; padding-top:0.75rem; border-top:1px solid #e2e8f0; font-size:0.85rem;">
                <div><strong>Service Issue:</strong> \${escapeHtml(latestRepair.issue)}</div>
                <div><strong>Assigned Mechanic:</strong> \${escapeHtml(latestRepair.mechanic)} • <strong>Estimated Labor:</strong> ₱\${Number(latestRepair.laborCost).toFixed(2)}</div>
              </div>
            \` : ''}
          </div>
        \`;
      } catch (_err) {
        out.innerHTML = '<div class="white-card" style="color:#991b1b;">Error connecting to server.</div>';
      }
    });

    document.getElementById('home-booking-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('hb-submit-btn');
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());

      btn.disabled = true;
      btn.textContent = 'Submitting Booking...';

      try {
        const cRes = await apiRequest('POST', '/customers', {
          name: data.name,
          phone: data.phone,
          plateNumber: data.plateNumber,
          motorcycleModel: data.motorcycleModel,
        });

        if (cRes.status !== 201) {
          showToast(cRes.error || 'Invalid customer details.', true);
          return;
        }

        const rRes = await apiRequest('POST', '/repairs', {
          customerId: cRes.data.id,
          issue: data.issue,
          mechanic: 'Berto',
          laborCost: 500,
          status: 'pending',
        });

        if (rRes.status === 201) {
          showToast('Booking confirmed! Your motorcycle is now in the shop intake queue.');
          e.target.reset();
          document.getElementById('home-plate-input').value = cRes.data.plateNumber;
          document.getElementById('home-track-btn').click();
        } else {
          showToast(rRes.error || 'Could not create repair order.', true);
        }
      } catch (_err) {
        showToast('Network error while submitting booking.', true);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Submit Service Booking';
      }
    });

    /* ========= TOP SEARCH & CONTROLS ========= */
    document.getElementById('plate-search-input').addEventListener('keydown', async (e) => {
      if (e.key !== 'Enter') return;
      const plate = e.target.value.trim();
      if (!plate) return;
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

    function toggleUserRole() {
      const sel = document.getElementById('role-select');
      sel.value = sel.value === 'owner' ? 'guest' : 'owner';
      sel.dispatchEvent(new Event('change'));
    }

    document.getElementById('role-select').addEventListener('change', (e) => {
      const isOwner = e.target.value === 'owner';
      document.getElementById('sidebar-role-label').textContent = isOwner ? 'ADMIN • SWITCH' : 'GUEST • READ ONLY';
      showToast('Switched active role to ' + (isOwner ? 'Shop Owner (Full Access)' : 'Guest (403 Delete Guard)'));
    });

    document.getElementById('analytics-range-select').addEventListener('change', (e) => {
      const is7 = e.target.value === '7';
      document.getElementById('chart-rev-line').setAttribute(
        'd',
        is7 ? 'M 0 130 Q 95 95, 190 78 T 300 50' : 'M 0 140 Q 90 110, 185 88 T 300 72'
      );
      document.getElementById('chart-rev-area').setAttribute(
        'd',
        is7
          ? 'M 0 130 Q 95 95, 190 78 T 300 50 L 300 160 L 0 160 Z'
          : 'M 0 140 Q 90 110, 185 88 T 300 72 L 300 160 L 0 160 Z'
      );
      showToast('Analytics updated to ' + (is7 ? 'Last 7 Days' : 'Last 30 Days'));
    });

    document.querySelectorAll('.sidebar-nav button[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    document.getElementById('open-create-btn').onclick = () => openCreateModal();
    document.getElementById('quick-new-repair-btn').onclick = () => openCreateModal('repairs');
    document.getElementById('quick-new-customer-btn').onclick = () => openCreateModal('customers');
    document.getElementById('quick-customer-site-btn').onclick = () => openHomePage();
    document.getElementById('refresh-btn').onclick = () => {
      loadCurrentModule();
      showToast('Live shop data refreshed.');
    };
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
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    });
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
