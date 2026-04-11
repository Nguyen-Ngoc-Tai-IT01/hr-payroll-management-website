import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import './Header.css';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

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
        
        {/* LOGO SIÊU NÉT */}
        <Link to="/" className="header-brand">
          <div className="brand-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

        {/* NỘI DUNG Ở GIỮA VÀ BÊN PHẢI */}
        {user ? (
          <>
            {/* MENU ĐIỀU HƯỚNG MỚI (DẠNG PILL BẮT MẮT) */}
            <nav className="header-nav">
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <span className="nav-icon">📈</span> Tổng quan
              </NavLink>
              <NavLink to="/employees" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <span className="nav-icon">👥</span> Nhân sự
              </NavLink>
              <NavLink to="/attendance" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <span className="nav-icon">📅</span> Chấm công
              </NavLink>
              <NavLink to="/payroll" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <span className="nav-icon">💰</span> Tiền lương
              </NavLink>
              
              <div className="nav-divider"></div>
              
              <NavLink to="/reports" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Báo cáo</NavLink>
              <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Cài đặt</NavLink>
            </nav>

            {/* THÔNG TIN USER & ĐĂNG XUẤT */}
            <div className="header-user">
              
              {/* ĐÃ CHUYỂN DIV THÀNH LINK ĐỂ DẪN TỚI TRANG /profile */}
              <Link to="/profile" className="user-info" style={{ textDecoration: 'none' }}>
                <div className="user-avatar">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-details">
                  <span className="user-name">{user.fullName || "Admin"}</span>
                  <span className="user-role">Quản trị viên</span>
                </div>
              </Link>
              
              {/* NÚT ĐĂNG XUẤT NỔI BẬT HƠN */}
              <button className="btn-logout" onClick={handleLogout}>
                <span style={{ marginRight: '6px' }}>🚪</span> Đăng xuất
              </button>
            </div>
          </>
        ) : (
          /* TRẠNG THÁI CHƯA ĐĂNG NHẬP - NÚT BẤM TO RÕ */
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