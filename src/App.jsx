import React from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import './App.css'; 
import './pages/admin/Admin.css'; 

// --- IMPORT LOGO ---
import logo from './assets/logo.png';

// --- 1. IMPORT CÁC TRANG CỦA TÀI ---
import Settings from './pages/admin/Settings';
import Profile from './pages/admin/Profile';
import Reports from './pages/admin/Reports';

// --- 2. IMPORT TRANG CỦA TEAM ---
// import Login from './pages/auth/Login';
// import Dashboard from './pages/dashboard/Dashboard';         // Tuyến
import EmployeeList from './pages/employees/EmployeeList'; 
import EmployeeDetail from './pages/employees/EmployeeDetail';  // Hiệp
import Attendance from './pages/attendance/Attendance';      // Sêu
import Leaves from './pages/attendance/Leaves';              // Sêu
import PayrollList from './pages/payroll/PayrollList';       // Vỹ
import PayslipDetail from './pages/payroll/Payslip';     // Vỹ (Sửa tên cho khớp)


// --- TRANG CHỦ (Home) ---
function Home() {
  return (
    <div className="dashboard-wrapper" style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Header Trang Chủ - ĐÃ SỬA LỖI LỆCH NGANG */}
      <div 
        className="page-header" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', // Ép xếp dọc từ trên xuống dưới
          alignItems: 'center',    // Căn giữa tuyệt đối
          textAlign: 'center', 
          marginBottom: '40px', 
          maxWidth: '600px',
          margin: '0 auto 40px auto' // Ép khối này đứng giữa trang
        }}
      >
        <img 
          src={logo} 
          alt="Workforce Manager Logo" 
          style={{ height: '120px', objectFit: 'contain', marginBottom: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} 
        />
        <h1 style={{ fontSize: '32px', color: '#1e293b', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.5px', width: '100%' }}>
          Workforce Manager
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.5', width: '100%' }}>
          Hệ thống Quản trị Nhân sự & Tiền lương toàn diện dành cho Doanh nghiệp
        </p>
      </div>

      {/* Khung chức năng */}
      <div className="dash-card" style={{ maxWidth: '900px', width: '100%', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)' }}>
        
        {/* Phân hệ chung */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ textAlign: 'center', color: '#334155', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ height: '1px', flex: '1', backgroundColor: '#e2e8f0' }}></span>
            Lối tắt Phân hệ
            <span style={{ height: '1px', flex: '1', backgroundColor: '#e2e8f0' }}></span>
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <Link to="/dashboard" className="p-btn p-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>📈</span> Tổng quan
            </Link>
            <Link to="/employees" className="p-btn p-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>👥</span> Nhân sự
            </Link>
            <Link to="/attendance" className="p-btn p-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>📅</span> Chấm công
            </Link>
            <Link to="/payroll" className="p-btn p-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>💰</span> Tiền lương
            </Link>
          </div>
        </div>

        {/* Phân hệ Admin */}
        <div>
          <h3 style={{ textAlign: 'center', color: '#059669', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ height: '1px', flex: '1', backgroundColor: '#e2e8f0' }}></span>
            Khu vực Quản trị (Admin)
            <span style={{ height: '1px', flex: '1', backgroundColor: '#e2e8f0' }}></span>
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <Link to="/profile" className="p-btn p-btn-primary" style={{ padding: '12px 24px', borderRadius: '8px' }}>👤 Hồ sơ của tôi</Link>
            <Link to="/settings" className="p-btn p-btn-outline" style={{ padding: '12px 24px', borderRadius: '8px', borderColor: '#94a3b8', color: '#475569' }}>⚙️ Cài đặt hệ thống</Link>
            <Link to="/reports" className="p-btn p-btn-success" style={{ padding: '12px 24px', borderRadius: '8px' }}>📊 Xem báo cáo</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- COMPONENT APP CHÍNH ---
function App() {
  return (
    <div className="app-container">
      {/* --- THANH MENU ĐIỀU HƯỚNG --- */}
      <nav className="top-nav-modern" style={{ position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="nav-brand">
          <Link to="/">
            <img 
              src={logo} 
              alt="Logo"
              style={{ height: '40px', objectFit: 'contain', cursor: 'pointer', transition: 'transform 0.2s' }} 
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </Link>
        </div>
        
        <div className="nav-menu">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>🏠 Trang chủ</NavLink>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>📈 Tổng quan</NavLink>
          <NavLink to="/employees" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>👥 Nhân sự</NavLink>
          <NavLink to="/attendance" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>📅 Chấm công</NavLink>
          <NavLink to="/payroll" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>💰 Lương</NavLink>
          
          <span style={{ borderLeft: '2px solid #e2e8f0', margin: '0 10px', height: '24px' }}></span>
          
          <NavLink to="/reports" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>📊 Báo cáo</NavLink>
          <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>⚙️ Cài đặt</NavLink>
        </div>

        <div className="nav-user" style={{ cursor: 'pointer' }}>
          <div className="nav-avatar" style={{ backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold' }}>NT</div>
          <span style={{ fontWeight: '500', color: '#334155' }}>Xin chào, Admin!</span> 
        </div>
      </nav>

      {/* --- KHU VỰC HIỂN THỊ NỘI DUNG --- */}
      <div className="main-content" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* --- ROUTES CỦA TÀI --- */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<Reports />} />

          {/* --- ROUTES CỦA SÊU --- */}
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leaves" element={<Leaves />} />

          {/* --- ROUTES CỦA VỸ --- */}
          {/* Sửa lại tên component cho khớp với import (PayslipDetail thay vì Payslip) */}
          <Route path="/payroll" element={<PayrollList />} />
          <Route path="/payroll/payslip/:id" element={<PayslipDetail />} />
			<Route path="/employees/:id" element={<EmployeeDetail />} />
          {/* --- ROUTES CHỜ HOÀN THIỆN --- */}
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/employees" element={<EmployeeList />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
