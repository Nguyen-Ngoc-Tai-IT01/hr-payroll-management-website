import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import './Header.css';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  // KIỂM TRA QUYỀN ĐỂ ẨN MENU
  const isPrivileged = user && ["EMP001", "EMP002", "EMP003", "EMP004", "EMP005"].includes(user.id);

  const handleLogout = () => {
    Swal.fire({
      title: "Đăng xuất?",
      text: "Bạn có muốn rời khỏi hệ thống không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Có, thoát",
      cancelButtonText: "Không",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        if (setUser) setUser(null);
        navigate('/');
      }
    });
  };

  return (
    <header className="glass-header">
      <div className="header-container">
        
        {/* LOGO */}
        <Link to="/" className="header-brand">
          <div className="brand-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">WORKFORCE</span>
            <span className="brand-subtitle">MANAGER</span>
          </div>
        </Link>

        {/* MENU ĐIỀU HƯỚNG */}
        {user ? (
          <>
            <nav className="header-nav">
              {/* CHỈ 5 VIP MỚI THẤY TỔNG QUAN VÀ NHÂN SỰ */}
              {isPrivileged && (
                <>
                  <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <img src="/overview.png" alt="Overview" className="nav-img-icon" /> Tổng quan
                  </NavLink>
                  <NavLink to="/employees" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <img src="/human_resources.png" alt="Employees" className="nav-img-icon" /> Nhân sự
                  </NavLink>
                </>
              )}

              <NavLink to="/attendance" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <img src="/calendar.png" alt="Attendance" className="nav-img-icon" /> Chấm công
              </NavLink>
              <NavLink to="/payroll" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <img src="/salary.png" alt="Payroll" className="nav-img-icon" /> Tiền lương
              </NavLink>
              
              {/* CHỈ 5 VIP MỚI THẤY BÁO CÁO VÀ CÀI ĐẶT */}
              {isPrivileged && (
                <>
                  <div className="nav-divider"></div>
                  <NavLink to="/reports" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <img src="/report.png" alt="Reports" className="nav-img-icon" /> Báo cáo
                  </NavLink>
                  <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <img src="/settings.png" alt="Settings" className="nav-img-icon" /> Cài đặt
                  </NavLink>
                </>
              )}
            </nav>

            {/* THÔNG TIN USER */}
            <div className="header-user">
              <Link to="/profile" className="user-info" style={{ textDecoration: 'none' }}>
                <div className="user-avatar">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-details">
                  <span className="user-name">{user.fullName || "Người dùng"}</span>
                  {/* THAY ĐỔI CHỮ QUẢN TRỊ VIÊN/NHÂN VIÊN THEO QUYỀN */}
                  <span className="user-role">{isPrivileged ? "Quản trị viên" : "Nhân viên"}</span>
                </div>
              </Link>
              
              <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
            </div>
          </>
        ) : (
          <div className="header-auth">
            <Link to="/login" className="btn-login">Đăng nhập</Link>
            <Link to="/register" className="btn-register">✨ Đăng ký ngay</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;