import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";
import "./pages/admin/Admin.css";

// --- IMPORT COMPONENTS CHUNG ---
import Header from "./components/Header";
import Footer from "./components/Footer";

// --- IMPORT LOGO ẢNH CỦA BẠN CHÍNH THỨC TRỞ LẠI ---
import logo from "./assets/logo.png";

// IMPORT CỦA TUYẾN
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";

// --- IMPORT CÁC TRANG ---
import Settings from "./pages/admin/Settings";
import Profile from "./pages/admin/Profile";
import Reports from "./pages/admin/Reports";

import EmployeeList from "./pages/employees/EmployeeList";
import EmployeeDetail from "./pages/employees/EmployeeDetail";
import EmployeeForm from "./pages/employees/EmployeeForm";

import Attendance from "./pages/attendance/Attendance";
import Leaves from "./pages/attendance/Leaves";

import PayrollList from "./pages/payroll/PayrollList";
import PayslipDetail from "./pages/payroll/Payslip";

// --- COMPONENT TRANG CHỦ (HOME) ---
function Home({ user }) {
  // =======================================================
  // 1. TRẠNG THÁI CHƯA ĐĂNG NHẬP: HIỆN TRANG GIỚI THIỆU
  // =======================================================
  if (!user) {
    return (
      <div
        className="landing-hero"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "calc(100vh - 75px)",
          background:
            "radial-gradient(circle at top, #e0f2fe 0%, #f8fafc 40%, #f1f5f9 100%)",
          padding: "80px 20px 100px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            background: "#dbeafe",
            color: "#1e40af",
            padding: "8px 20px",
            borderRadius: "30px",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "30px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>🚀</span> Giải pháp Chuyển đổi số Doanh nghiệp
        </div>

        {/* LOGO CHÍNH (Đã bỏ khung trắng, dùng class mới) */}
        <div className="home-logo-container">
          <img
            src={logo}
            alt="Workforce Manager Logo"
            className="home-logo-img"
          />
        </div>

        <h1
          style={{
            fontSize: "48px",
            color: "#0f172a",
            margin: "10px 0 24px",
            fontWeight: "900",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: "1.2",
            letterSpacing: "-1px",
          }}
        >
          Tối ưu hóa Nguồn nhân lực với{" "}
          <span style={{ color: "#2563eb" }}>Workforce</span>
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "#475569",
            maxWidth: "650px",
            marginBottom: "40px",
            lineHeight: "1.6",
            textAlign: "center",
          }}
        >
          Nền tảng toàn diện giúp doanh nghiệp tự động hóa quy trình chấm công,
          tính lương và quản lý hồ sơ nhân sự chính xác, bảo mật tuyệt đối.
        </p>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "80px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            to="/login"
            style={{
              padding: "16px 45px",
              fontSize: "16px",
              fontWeight: "700",
              background: "#2563eb",
              color: "white",
              borderRadius: "12px",
              textDecoration: "none",
              boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
              transition: "all 0.3s",
            }}
          >
            Đăng nhập hệ thống
          </Link>
          <Link
            to="/register"
            style={{
              padding: "16px 45px",
              fontSize: "16px",
              fontWeight: "700",
              background: "white",
              color: "#2563eb",
              border: "2px solid #e2e8f0",
              borderRadius: "12px",
              textDecoration: "none",
              transition: "all 0.3s",
            }}
          >
            Đăng ký sử dụng
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
            maxWidth: "1100px",
            width: "100%",
          }}
        >
          <div
            className="feature-card blue"
            style={{
              background: "white",
              padding: "40px 30px",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              textAlign: "center",
              borderTop: "4px solid #3b82f6",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚡</div>
            <h3
              style={{
                fontSize: "20px",
                color: "#1e293b",
                marginBottom: "12px",
                fontWeight: "800",
              }}
            >
              Tự động hóa 100%
            </h3>
            <p
              style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.6" }}
            >
              Loại bỏ sai sót con người. Giảm 80% thời gian tính lương và đối
              soát công thủ công mỗi tháng.
            </p>
          </div>
          <div
            className="feature-card green"
            style={{
              background: "white",
              padding: "40px 30px",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              textAlign: "center",
              borderTop: "4px solid #10b981",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🛡️</div>
            <h3
              style={{
                fontSize: "20px",
                color: "#1e293b",
                marginBottom: "12px",
                fontWeight: "800",
              }}
            >
              Bảo mật đa tầng
            </h3>
            <p
              style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.6" }}
            >
              Phân quyền truy cập nghiêm ngặt, bảo vệ an toàn tuyệt đối dữ liệu
              nhạy cảm của doanh nghiệp.
            </p>
          </div>
          <div
            className="feature-card purple"
            style={{
              background: "white",
              padding: "40px 30px",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              textAlign: "center",
              borderTop: "4px solid #8b5cf6",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>📊</div>
            <h3
              style={{
                fontSize: "20px",
                color: "#1e293b",
                marginBottom: "12px",
                fontWeight: "800",
              }}
            >
              Báo cáo trực quan
            </h3>
            <p
              style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.6" }}
            >
              Hệ thống Dashboard thông minh giúp ban lãnh đạo theo dõi chi phí
              và ra quyết định tức thời.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =======================================================
  // 2. TRẠNG THÁI ĐÃ ĐĂNG NHẬP: HIỆN BẢNG ĐIỀU KHIỂN
  // =======================================================
  return (
    <div
      style={{
        minHeight: "calc(100vh - 75px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "50px 20px",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* Lời chào */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* LOGO LỚN TRÊN BẢNG ĐIỀU KHIỂN (Đã bỏ khung, bo góc và phóng to) */}
        <img
          src={logo}
          alt="Workforce Manager Logo"
          style={{
            height: "120px" /* Phóng to chiều cao lên 120px */,
            width: "auto" /* Giữ nguyên tỷ lệ ảnh */,
            objectFit: "contain",
            marginBottom: "20px",
            borderRadius: "15px",
            overflow: "hidden",
            filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.06))",
          }}
        />

        <h1
          style={{
            fontSize: "28px",
            color: "#1e293b",
            marginBottom: "12px",
            fontWeight: "900",
          }}
        >
          Chào mừng trở lại,{" "}
          <span style={{ color: "#2563eb" }}>
            {user.fullName || "Quản trị viên"}
          </span>{" "}
          👋
        </h1>
        <p style={{ fontSize: "16px", color: "#64748b" }}>
          Bạn muốn làm việc với phân hệ nào hôm nay? Vui lòng chọn bên dưới.
        </p>
      </div>

      {/* Khu vực Các Module Chức năng */}
      <div style={{ maxWidth: "1000px", width: "100%", marginBottom: "50px" }}>
        <h3
          style={{
            color: "#475569",
            fontSize: "14px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            marginBottom: "24px",
            paddingLeft: "10px",
            borderLeft: "4px solid #3b82f6",
          }}
        >
          Phân hệ Nghiệp vụ
        </h3>
        <div
          className="module-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          <Link
            to="/dashboard"
            className="module-card"
            style={{
              background: "white",
              border: "1.5px solid #e2e8f0",
              borderRadius: "20px",
              padding: "30px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              textDecoration: "none",
              boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ fontSize: "36px" }}>📈</div>
            <span
              style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b" }}
            >
              Tổng quan
            </span>
          </Link>
          <Link
            to="/employees"
            className="module-card"
            style={{
              background: "white",
              border: "1.5px solid #e2e8f0",
              borderRadius: "20px",
              padding: "30px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              textDecoration: "none",
              boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ fontSize: "36px" }}>👥</div>
            <span
              style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b" }}
            >
              Nhân sự
            </span>
          </Link>
          <Link
            to="/attendance"
            className="module-card"
            style={{
              background: "white",
              border: "1.5px solid #e2e8f0",
              borderRadius: "20px",
              padding: "30px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              textDecoration: "none",
              boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ fontSize: "36px" }}>📅</div>
            <span
              style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b" }}
            >
              Chấm công
            </span>
          </Link>
          <Link
            to="/payroll"
            className="module-card"
            style={{
              background: "white",
              border: "1.5px solid #e2e8f0",
              borderRadius: "20px",
              padding: "30px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              textDecoration: "none",
              boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ fontSize: "36px" }}>💰</div>
            <span
              style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b" }}
            >
              Tiền lương
            </span>
          </Link>
        </div>
      </div>

      {/* Khu vực Quản trị Hệ thống */}
      <div style={{ maxWidth: "1000px", width: "100%" }}>
        <h3
          style={{
            color: "#475569",
            fontSize: "14px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            marginBottom: "24px",
            paddingLeft: "10px",
            borderLeft: "4px solid #10b981",
          }}
        >
          Quản trị Hệ thống
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 300px))",
            gap: "24px",
          }}
        >
          <Link
            to="/profile"
            className="module-card"
            style={{
              background: "white",
              border: "1.5px solid #e2e8f0",
              borderRadius: "20px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              textDecoration: "none",
              boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ fontSize: "28px" }}>👤</div>
            <span
              style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b" }}
            >
              Hồ sơ của tôi
            </span>
          </Link>
          <Link
            to="/settings"
            className="module-card"
            style={{
              background: "white",
              border: "1.5px solid #e2e8f0",
              borderRadius: "20px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              textDecoration: "none",
              boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ fontSize: "28px" }}>⚙️</div>
            <span
              style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b" }}
            >
              Cài đặt
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT APP CHÍNH ---
function App() {
  const [user, setUser] = useState(null);

  const checkUser = () => {
    try {
      const savedUser = localStorage.getItem("user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener("userChanged", checkUser);
    return () => window.removeEventListener("userChanged", checkUser);
  }, []);

  return (
    <div
      className="app-container"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header user={user} setUser={setUser} />

      <div
        className="main-content"
        style={{ backgroundColor: "#f1f5f9", flex: 1 }}
      >
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/employees"
            element={user ? <EmployeeList /> : <Navigate to="/" />}
          />
          <Route
            path="/employees/:id"
            element={user ? <EmployeeDetail /> : <Navigate to="/" />}
          />
          <Route
            path="/employees/edit/:id"
            element={user ? <EmployeeForm /> : <Navigate to="/" />}
          />
          <Route
            path="/attendance"
            element={user ? <Attendance /> : <Navigate to="/" />}
          />
          <Route
            path="/leaves"
            element={user ? <Leaves /> : <Navigate to="/" />}
          />
          <Route
            path="/payroll"
            element={user ? <PayrollList /> : <Navigate to="/" />}
          />
          <Route
            path="/payroll/payslip/:id"
            element={user ? <PayslipDetail /> : <Navigate to="/" />}
          />
          <Route
            path="/settings"
            element={user ? <Settings /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/" />}
          />
          <Route
            path="/reports"
            element={user ? <Reports /> : <Navigate to="/" />}
          />

          <Route
            path="*"
            element={
              <h2
                style={{
                  textAlign: "center",
                  marginTop: "100px",
                  color: "#ef4444",
                }}
              >
                404 - Không tìm thấy trang
              </h2>
            }
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
