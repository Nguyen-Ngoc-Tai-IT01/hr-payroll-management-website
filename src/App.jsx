import React from "react";
import { Routes, Route, NavLink, Link, Navigate } from "react-router-dom";
import "./App.css";

// IMPORT
import EmployeeList from "./pages/employees/EmployeeList";
import EmployeeDetail from "./pages/employees/EmployeeDetail";
import Dashboard from "./pages/dashboard/Dashboard";

// ================= HOME =================
function Home() {
  return (
    <div className="dashboard-wrapper">
      <div className="card center">
        <h1>🏠 Hệ thống Quản lý Nhân sự</h1>
        <p>Chào Hiệp 👋, chọn chức năng bên dưới để bắt đầu.</p>

        <div className="home-actions">
          <Link to="/dashboard" className="btn btn-primary">
            📊 Dashboard
          </Link>

          <Link to="/employees" className="btn btn-outline">
            👥 Quản lý Nhân sự
          </Link>
        </div>
      </div>
    </div>
  );
}

// ================= APP =================
function App() {
  return (
    <div className="app-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">HR</div>
          <h2>Admin</h2>
        </div>

        <nav className="sidebar-menu">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/employees"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            👥 Nhân sự
          </NavLink>
        </nav>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="main-section">
        {/* ===== TOP BAR ===== */}
        <header className="topbar">
          <h3>Hệ thống quản lý nhân sự</h3>

          <div className="user-info">
            <div className="avatar">H</div>
            <span>Hiệp</span>
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="content">
          <Routes>
            {/* Redirect mặc định */}
            <Route path="/" element={<Navigate to="/dashboard" />} />

            {/* Pages */}
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/new" element={<EmployeeDetail />} />
            <Route path="/employees/:id" element={<EmployeeDetail />} />

            {/* 404 */}
            <Route path="*" element={<h2>❌ Không tìm thấy trang</h2>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;