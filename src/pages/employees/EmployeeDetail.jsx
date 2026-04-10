import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import './style.css'; // Đảm bảo import file CSS chung

const EmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const paths = ['/data/employees.json', '/backend/data/employees.json', './data/employees.json'];
      let foundData = null;

      for (const path of paths) {
        try {
          const res = await fetch(path);
          if (res.ok) {
            const data = await res.json();
            foundData = data.find(emp => String(emp.id) === String(id));
            if (foundData) break; 
          }
        } catch (err) {
          console.warn(`Không tìm thấy dữ liệu tại: ${path}`);
        }
      }

      if (foundData) {
        setEmployee(foundData);
        setError(null);
      } else {
        setError("Không tìm thấy nhân viên trong hệ thống.");
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return (
    <div className="layout-container">
      <div className="empty-state">⏳ Đang tải thông tin nhân viên...</div>
    </div>
  );

  if (error || !employee) return (
    <div className="layout-container">
      <div className="dash-card" style={{padding: '40px', textAlign: 'center', maxWidth: '500px'}}>
        <h2 style={{color: 'var(--danger)'}}>Lỗi load dữ liệu</h2>
        <p>{error}</p>
        <Link to="/employees" className="p-btn p-btn-primary" style={{marginTop: '20px', display: 'inline-block'}}>
          ← Quay lại danh sách
        </Link>
      </div>
    </div>
  );

  return (
    <div className="layout-container">
      <div className="dashboard-full-width">
        
        {/* THANH ĐIỀU HƯỚNG TRÊN CÙNG */}
        <header className="page-header-flex">
          <div className="header-title">
            <Link to="/employees" className="back-link">← Quay lại danh sách</Link>
            <h1>Hồ sơ: {employee.fullName}</h1>
          </div>
          <div className="header-actions">
            <Link to={`/employees/edit/${employee.id}`} className="p-btn p-btn-primary">
              Sửa thông tin
            </Link>
          </div>
        </header>

        {/* LAYOUT CHI TIẾT CHIA 2 CỘT */}
        <div className="detail-grid">
          
          {/* CỘT TRÁI: THẺ PROFILE CHÍNH */}
          <div className="dash-card profile-main-card">
            <div className="profile-decoration-bg"></div>
            <div className="profile-content">
              <div className="big-avatar-box">
                {employee.fullName?.charAt(0).toUpperCase()}
              </div>
              <h2 className="profile-name">{employee.fullName}</h2>
              <span className="profile-id-tag">{employee.id}</span>
              <div className={`status-badge ${employee.status === "Đang làm việc" ? "status-active" : "status-off"}`}>
                {employee.status || "N/A"}
              </div>
              
              <div className="quick-contact-list">
                <div className="q-item">
                  <span className="q-label">Email cá nhân</span>
                  <a href={`mailto:${employee.email}`} className="q-value">{employee.email}</a>
                </div>
                <div className="q-item">
                  <span className="q-label">Điện thoại</span>
                  <span className="q-value">{employee.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CHI TIẾT CÔNG VIỆC & LƯƠNG */}
          <div className="detail-info-area">
            
            <div className="dash-card info-section">
              <h3 className="section-title">Thông tin tổ chức</h3>
              <div className="info-item-grid">
                <InfoItem label="Phòng ban" value={employee.department} />
                <InfoItem label="Chức vụ" value={employee.position} />
                <InfoItem label="Ngày vào làm" value={employee.joinDate} />
                <InfoItem label="Vai trò hệ thống" value={employee.role || "Nhân viên"} />
              </div>
            </div>

            <div className="dash-card info-section" style={{marginTop: '25px'}}>
              <h3 className="section-title">Tài chính & Thu nhập</h3>
              <div className="salary-highlight-box">
                <div className="salary-info">
                  <span className="salary-label">Lương cơ bản hàng tháng</span>
                  <div className="salary-value">
                    {employee.baseSalary?.toLocaleString()} <small>VNĐ</small>
                  </div>
                </div>
                <div className="salary-icon">💸</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="info-block">
    <span className="info-label">{label}</span>
    <p className="info-value">{value || "Chưa cập nhật"}</p>
  </div>
);

export default EmployeeDetail;