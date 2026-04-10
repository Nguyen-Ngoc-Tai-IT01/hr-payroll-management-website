// src/components/Header.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css'; // Gọi file CSS

const Header = () => {
  return (
    <header className="app-header">
      {/* Cụm Logo */}
      <div className="header-logo">
        <div className="logo-circle">
          <span className="logo-icon">📈</span>
        </div>
        <div className="logo-text">
          <span className="logo-title">WORKFORCE</span>
          <span className="logo-subtitle">MANAGER</span>
        </div>
      </div>

      {/* Menu Điều hướng */}
      {/* Dùng NavLink để tự động bắt trạng thái "active" khi đang ở đúng trang */}
      <nav className="header-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
        <NavLink to="/employees" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Employees</NavLink>
        <NavLink to="/attendance" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Attendance</NavLink>
        <NavLink to="/payroll" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Payroll</NavLink>
        <NavLink to="/reports" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Reports</NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Settings</NavLink>
      </nav>

      {/* Thông tin User */}
      <div className="header-user">
        <div className="user-avatar">NT</div>
        <span className="user-name">Nguyễn Ngọc Tài (Admin)</span>
      </div>
    </header>
  );
};

export default Header;