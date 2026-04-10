import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, Link } from "react-router-dom";
import "./App.css";
import "./pages/admin/Admin.css";

// --- IMPORT để hiện thông báo đăng xuất ---
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// --- IMPORT LOGO ---
import logo from "./assets/logo.png";

// --- 1. IMPORT CÁC TRANG CỦA TÀI ---
import Settings from "./pages/admin/Settings";
import Profile from "./pages/admin/Profile";
import Reports from "./pages/admin/Reports";

// --- 2. IMPORT TRANG CỦA TEAM ---
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Register from "./pages/auth/Register"; // Tuyến
import EmployeeList from "./pages/employees/EmployeeList";
import EmployeeDetail from "./pages/employees/EmployeeDetail"; // Hiệp
import Attendance from "./pages/attendance/Attendance"; // Sêu
import Leaves from "./pages/attendance/Leaves"; // Sêu
import PayrollList from "./pages/payroll/PayrollList"; // Vỹ
import PayslipDetail from "./pages/payroll/Payslip"; // Vỹ (Sửa tên cho khớp)

// --- Trang Giới thiệu (Dành cho cả Team) ---
function Home() {
  return (
    <div
      className="dashboard-wrapper"
      style={{ minHeight: "calc(100vh - 70px)" }}
    >
      <div
        className="page-header"
        style={{ textAlign: "center", marginBottom: "40px", marginTop: "20px" }}
      >
        {/* Đưa Logo to ra giữa trang chủ */}
        <img
          src={logo}
          alt="Workforce Manager Logo"
          style={{
            height: "140px",
            objectFit: "contain",
            marginBottom: "15px",
            borderRadius: "10px",
          }}
        />
        <h1
          style={{ fontSize: "26px", color: "#0f172a", marginBottom: "10px" }}
        >
          Hệ thống Quản lý Nhân sự và Tiền lương
        </h1>
        <p>Nền tảng quản trị doanh nghiệp toàn diện</p>
      </div>

      {/* Khung chức năng */}
      <div
        className="dash-card"
        style={{
          maxWidth: "900px",
          width: "100%",
          padding: "40px",
          borderRadius: "16px",
          boxShadow:
            "0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)",
        }}
      >
        {/* Phân hệ chung */}
        <div style={{ marginBottom: "40px" }}>
          <h3
            style={{
              textAlign: "center",
              color: "#334155",
              fontSize: "18px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <span
              style={{ height: "1px", flex: "1", backgroundColor: "#e2e8f0" }}
            ></span>
            Lối tắt Phân hệ
            <span
              style={{ height: "1px", flex: "1", backgroundColor: "#e2e8f0" }}
            ></span>
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            <Link
              to="/dashboard"
              className="p-btn p-btn-outline"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "16px",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "24px" }}>📈</span> Tổng quan
            </Link>
            <Link
              to="/employees"
              className="p-btn p-btn-outline"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "16px",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "24px" }}>👥</span> Nhân sự
            </Link>
            <Link
              to="/attendance"
              className="p-btn p-btn-outline"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "16px",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "24px" }}>📅</span> Chấm công
            </Link>
            <Link
              to="/payroll"
              className="p-btn p-btn-outline"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "16px",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "24px" }}>💰</span> Tiền lương
            </Link>
          </div>
        </div>

        {/* Phân hệ Admin */}
        <div>
          <h3
            style={{
              textAlign: "center",
              color: "#059669",
              fontSize: "18px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <span
              style={{ height: "1px", flex: "1", backgroundColor: "#e2e8f0" }}
            ></span>
            Khu vực Quản trị (Admin)
            <span
              style={{ height: "1px", flex: "1", backgroundColor: "#e2e8f0" }}
            ></span>
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <Link
              to="/profile"
              className="p-btn p-btn-primary"
              style={{ padding: "12px 24px", borderRadius: "8px" }}
            >
              👤 Hồ sơ của tôi
            </Link>
            <Link
              to="/settings"
              className="p-btn p-btn-outline"
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                borderColor: "#94a3b8",
                color: "#475569",
              }}
            >
              ⚙️ Cài đặt hệ thống
            </Link>
            <Link
              to="/reports"
              className="p-btn p-btn-success"
              style={{ padding: "12px 24px", borderRadius: "8px" }}
            >
              📊 Xem báo cáo
            </Link>
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
      {/* --- THANH MENU ĐIỀU HƯỚNG --- */}
      <nav
        className="top-nav-modern"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div className="nav-brand">
          {/* Logo gắn trên góc trái của thanh Menu */}
          <img
            src={logo}
            alt="Logo"
            style={{ height: "45px", objectFit: "contain", cursor: "pointer" }}
            onClick={() => (window.location.href = "/")}
          />
        </div>

        <div className="nav-menu">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            🏠 Trang chủ
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            📈 Tổng quan
          </NavLink>
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            👥 Nhân sự
          </NavLink>
          <NavLink
            to="/attendance"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            📅 Chấm công
          </NavLink>
          <NavLink
            to="/payroll"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            💰 Lương
          </NavLink>

          <span
            style={{
              borderLeft: "2px solid #e2e8f0",
              margin: "0 10px",
              height: "24px",
            }}
          ></span>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            📊 Báo cáo
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            ⚙️ Cài đặt
          </NavLink>
        </div>

        <div className="nav-user">
          {user ? (
            <div className="user-profile-card">
              <div className="nav-avatar-circle">
                {user?.fullName?.split(" ").pop()?.charAt(0).toUpperCase() ||
                  "U"}
              </div>
              <span className="user-full-name">
                {user?.fullName?.split(" ").pop()}
              </span>
              <button
                className="logout-btn-minimal"
                onClick={() => {
                  Swal.fire({
                    title: "Đăng xuất?",
                    text: "Bạn có muốn rời khỏi hệ thống không?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3b82f6",
                    cancelButtonColor: "#64748b",
                    confirmButtonText: "Có, thoát",
                    cancelButtonText: "Không",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      localStorage.removeItem("user");
                      setUser(null); // Cập nhật state ngay lập tức
                      window.location.href = "/login";
                    }
                  });
                }}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/register" className="btn-register-nav">
                Đăng ký
              </Link>
              <Link to="/login" className="btn-login-nav">
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </nav>
      {/* --- KHU VỰC HIỂN THỊ NỘI DUNG TRANG CHÍNH --- */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* --- ROUTES CỦA TÀI (Đang hoạt động) --- */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<Reports />} />

          {/* route của sêu đang hoạt động */}
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leaves" element={<Leaves />} />

          {/* --- ROUTES CỦA VỸ (Đã được tích hợp thành công) --- */}
          <Route path="/payroll" element={<PayrollList />} />
          <Route path="/payroll/payslip/:id" element={<PayslipDetail />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          {/* --- ROUTES CHỜ HOÀN THIỆN --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/employees" element={<EmployeeList />} /> */}
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/payroll" element={<PayrollList />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
