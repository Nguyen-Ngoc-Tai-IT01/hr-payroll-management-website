import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Cột 1: Giới thiệu */}
        <div className="footer-section brand-section">
          <h2 className="footer-brand">Workforce Manager</h2>
          <p className="footer-desc">
            Nền tảng quản trị Nhân sự và Tiền lương toàn diện, giúp doanh nghiệp tối ưu hóa quy trình vận hành và phát triển nguồn nhân lực.
          </p>
        </div>

        {/* Cột 2: Lối tắt */}
        <div className="footer-section links-section">
          <h3 className="footer-title">Lối tắt</h3>
          <ul className="footer-links">
            <li><Link to="/dashboard">Tổng quan (Dashboard)</Link></li>
            <li><Link to="/employees">Danh sách Nhân sự</Link></li>
            <li><Link to="/attendance">Bảng Chấm công</Link></li>
            <li><Link to="/payroll">Bảng Tiền lương</Link></li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ */}
        <div className="footer-section contact-section">
          <h3 className="footer-title">Hỗ trợ Kỹ thuật</h3>
          <ul className="footer-contact">
            <li>
              <img src="/mail.png" alt="Email" className="footer-icon" /> 
              Email: hotro@workforce.vn
            </li>
            <li>
              <img src="/phone.png" alt="Hotline" className="footer-icon" /> 
              Hotline: 0912.000.001
            </li>
            <li>
              <img src="/home.png" alt="Đơn vị" className="footer-icon" /> 
              Đơn vị: Nhóm Dev IT24B
            </li>
          </ul>
        </div>
      </div>

      {/* Dòng bản quyền */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} Workforce Manager. Developed by IT24B - Đại học Đông Á.</p>
      </div>
    </footer>
  );
};

export default Footer;