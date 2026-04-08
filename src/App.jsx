import React from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import './App.css'; 
import './pages/admin/Admin.css'; 

// --- IMPORT LOGO TỪ THƯ MỤC ASSETS ---
import logo from './assets/logo.png';

// --- 1. IMPORT CÁC TRANG CỦA TÀI (Đã code xong) ---
import Settings from './pages/admin/Settings';
import Profile from './pages/admin/Profile';
import Reports from './pages/admin/Reports';

// --- 2. IMPORT TRANG CỦA TEAM (Tạm ẩn chờ anh em code xong) ---
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';         // Tuyến
import EmployeeList from './pages/employees/EmployeeList';   // Hiệp
import Attendance from './pages/attendance/Attendance';      // Sêu
import PayrollList from './pages/payroll/PayrollList';       // Vỹ


// --- Trang Giới thiệu (Dành cho cả Team) ---
function Home() {
  return (
    <div className="dashboard-wrapper" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
        {/* Đưa Logo to ra giữa trang chủ */}
        <img 
          src={logo} 
          alt="Workforce Manager Logo" 
          style={{ height: '140px', objectFit: 'contain', marginBottom: '15px', borderRadius: '10px' }} 
        />
        <h1 style={{ fontSize: '26px', color: '#0f172a', marginBottom: '10px' }}>
          Hệ thống Quản lý Nhân sự và Tiền lương
        </h1>
        <p>Nền tảng quản trị doanh nghiệp toàn diện</p>
      </div>

      <div className="dash-card" style={{ maxWidth: '850px', margin: '0 auto', padding: '35px' }}>
        <h3 className="card-title" style={{ textAlign: 'center', color: '#3b82f6', fontSize: '20px' }}>
          Lối tắt truy cập các Phân hệ
        </h3>
        
        {/* Lưới nút bấm cho cả 5 người */}
        <div className="grid-2" style={{ marginBottom: '30px' }}>
          <Link to="/dashboard" className="p-btn p-btn-outline" style={{ textAlign: 'center' }}>📈 Tổng quan (Tuyến)</Link>
          <Link to="/employees" className="p-btn p-btn-outline" style={{ textAlign: 'center' }}>👥 Quản lý Nhân sự (Hiệp)</Link>
          <Link to="/attendance" className="p-btn p-btn-outline" style={{ textAlign: 'center' }}>📅 Quản lý Chấm công (Sêu)</Link>
          <Link to="/payroll" className="p-btn p-btn-outline" style={{ textAlign: 'center' }}>💰 Quản lý Tiền lương (Vỹ)</Link>
        </div>

        <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '20px 0' }}/>

        <h3 className="card-title" style={{ textAlign: 'center', color: '#059669', fontSize: '18px' }}>
          Khu vực dành cho Quản trị viên
        </h3>
        <div className="home-actions">
          <Link to="/profile" className="p-btn p-btn-primary">👤 Hồ sơ của tôi</Link>
          <Link to="/settings" className="p-btn p-btn-outline">⚙️ Cài đặt hệ thống</Link>
          <Link to="/reports" className="p-btn p-btn-success">📊 Xem báo cáo</Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app-container">
      {/* --- THANH MENU ĐIỀU HƯỚNG DÙNG CHUNG CẢ TEAM --- */}
      <nav className="top-nav-modern">
        <div className="nav-brand">
          {/* Logo gắn trên góc trái của thanh Menu */}
          <img 
            src={logo} 
            alt="Logo" 
            style={{ height: '45px', objectFit: 'contain', cursor: 'pointer' }} 
            onClick={() => window.location.href = '/'}
          />
        </div>
        
        <div className="nav-menu">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>🏠 Trang chủ</NavLink>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>📈 Tổng quan</NavLink>
          <NavLink to="/employees" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>👥 Nhân sự</NavLink>
          <NavLink to="/attendance" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>📅 Chấm công</NavLink>
          <NavLink to="/payroll" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>💰 Lương</NavLink>
          
          {/* Vạch kẻ phân cách menu Admin */}
          <span style={{ borderLeft: '1px solid #e2e8f0', margin: '0 5px' }}></span>
          
          <NavLink to="/reports" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>📊 Báo cáo</NavLink>
          <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>⚙️ Cài đặt</NavLink>
        </div>

        <div className="nav-user">
          <div className="nav-avatar">NT</div>
          {/* Tạm thời để tên chung, sau này Tuyến sẽ đổi thành tên động */}
          <span>Xin chào, Admin!</span> 
        </div>
      </nav>

      {/* --- KHU VỰC HIỂN THỊ NỘI DUNG TRANG --- */}
      <div className="main-content">
        <Routes>
          {/* Trang chủ */}
          <Route path="/" element={<Home />} />

          {/* --- ROUTES CỦA TÀI (Đang hoạt động) --- */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<Reports />} />

          {/* --- ROUTES CỦA TEAM (Các bạn khác sẽ tự mở comment khi code xong) --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/payroll" element={<PayrollList />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;