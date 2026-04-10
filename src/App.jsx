import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, Link } from "react-router-dom";
import "./App.css";
import "./pages/admin/Admin.css";

// --- IMPORT để hiện thông báo đăng xuất ---
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// --- IMPORT LOGO ---
import logo from "./assets/logo.png";

// --- IMPORT CÁC TRANG ---
import Settings from "./pages/admin/Settings";
import Profile from "./pages/admin/Profile";
import Reports from "./pages/admin/Reports";

import EmployeeList from "./pages/employees/EmployeeList";
import EmployeeDetail from "./pages/employees/EmployeeDetail";
import EmployeeForm from "./pages/employees/EmployeeForm";   // ← Quan trọng: Form thêm/sửa

import Attendance from "./pages/attendance/Attendance";
import Leaves from "./pages/attendance/Leaves";

import PayrollList from "./pages/payroll/PayrollList";
import PayslipDetail from "./pages/payroll/Payslip";

// --- Trang Chủ ---
function Home() {
  return (
    <div className="dashboard-wrapper" style={{ minHeight: "calc(100vh - 70px)" }}>
      <div className="page-header" style={{ textAlign: "center", marginBottom: "40px", marginTop: "20px" }}>
        <img
          src={logo}
          alt="Workforce Manager Logo"
          style={{ height: "140px", objectFit: "contain", marginBottom: "15px", borderRadius: "10px" }}
        />
        <h1 style={{ fontSize: "26px", color: "#0f172a", marginBottom: "10px" }}>
          Hệ thống Quản lý Nhân sự và Tiền lương
        </h1>
        <p>Nền tảng quản trị doanh nghiệp toàn diện</p>
      </div>

      <div className="dash-card" style={{ maxWidth: "900px", width: "100%", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)" }}>
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ textAlign: "center", color: "#334155", fontSize: "18px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px" }}>
            Lối tắt Phân hệ
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <Link to="/dashboard" className="p-btn p-btn-outline">📈 Tổng quan</Link>
            <Link to="/employees" className="p-btn p-btn-outline">👥 Nhân sự</Link>
            <Link to="/attendance" className="p-btn p-btn-outline">📅 Chấm công</Link>
            <Link to="/payroll" className="p-btn p-btn-outline">💰 Tiền lương</Link>
          </div>
        </div>

        <div>
          <h3 style={{ textAlign: "center", color: "#059669", fontSize: "18px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px" }}>
            Khu vực Quản trị (Admin)
          </h3>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "16px" }}>
            <Link to="/profile" className="p-btn p-btn-primary">👤 Hồ sơ của tôi</Link>
            <Link to="/settings" className="p-btn p-btn-outline">⚙️ Cài đặt hệ thống</Link>
            <Link to="/reports" className="p-btn p-btn-success">📊 Xem báo cáo</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  // Hàm này để các nơi khác có thể gọi để cập nhật lại UI
  const checkUser = () => {
    try {
      const savedUser = localStorage.getItem("user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser(); // Kiểm tra lần đầu khi load
    
    // Lắng nghe sự kiện "userChanged" để cập nhật ngay lập tức
    window.addEventListener("userChanged", checkUser);
    return () => window.removeEventListener("userChanged", checkUser);
  }, []);
  return (
    <div className="app-container">
      {/* Thanh Menu */}
      <nav className="top-nav-modern" style={{ position: "sticky", top: 0, zIndex: 1000, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div className="nav-brand">
          <Link to="/">
            <img src={logo} alt="Logo" style={{ height: "40px", objectFit: "contain", cursor: "pointer" }} />
          </Link>
        </div>

        <div className="nav-menu">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>🏠 Trang chủ</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>📈 Tổng quan</NavLink>
          <NavLink to="/employees" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>👥 Nhân sự</NavLink>
          <NavLink to="/attendance" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>📅 Chấm công</NavLink>
          <NavLink to="/payroll" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>💰 Lương</NavLink>

          <span style={{ borderLeft: "2px solid #e2e8f0", margin: "0 10px", height: "24px" }}></span>

          <NavLink to="/reports" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>📊 Báo cáo</NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>⚙️ Cài đặt</NavLink>
        </div>

        <div className="nav-user" style={{ cursor: "pointer" }}>
          <div className="nav-avatar" style={{ backgroundColor: "#3b82f6", color: "white", fontWeight: "bold" }}>NT</div>
          <span style={{ fontWeight: "500", color: "#334155" }}>Xin chào, Admin!</span>
        </div>
      </nav>

      {/* Nội dung chính */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Routes của Tài */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<Reports />} />

          {/* Routes của Hiệp - Nhân sự */}
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/employees/edit/:id" element={<EmployeeForm />} />   {/* ← Route sửa nhân viên */}

          {/* Routes của Sêu */}
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leaves" element={<Leaves />} />

          {/* Routes của Vỹ */}
          <Route path="/payroll" element={<PayrollList />} />
          <Route path="/payroll/payslip/:id" element={<PayslipDetail />} />

          {/* 404 */}
          <Route path="*" element={
            <h2 style={{ textAlign: 'center', marginTop: '100px', color: '#ef4444' }}>
              404 - Không tìm thấy trang
            </h2>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;