import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import './style.css';

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
        } catch (err) {}
      }

      if (foundData) {
        setEmployee(foundData);
      } else {
        setError("Không tìm thấy nhân viên.");
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="layout-container">
        <div className="empty-state">⏳ Đang tải...</div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="layout-container">
        <div className="dash-card" style={{ textAlign: "center", padding: "40px" }}>
          <h2 style={{ color: "red" }}>❌ Lỗi</h2>
          <p>{error}</p>
          <Link className="p-btn p-btn-primary" to="/employees">
            Quay lại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-container">
      <div className="dashboard-full-width">

        {/* HEADER */}
        <div className="detail-header">
          <Link to="/employees" className="back-link">
            ← Danh sách nhân sự
          </Link>

          <Link to={`/employees/edit/${employee.id}`} className="p-btn p-btn-primary">
            ✏️ Chỉnh sửa
          </Link>
        </div>

        {/* MAIN CARD */}
        <div className="employee-detail-grid">

          {/* LEFT PROFILE */}
          <div className="dash-card profile-card">
            <div className="avatar-big">
              {employee.fullName?.charAt(0).toUpperCase()}
            </div>

            <h2 className="emp-name">{employee.fullName}</h2>
            <p className="emp-id">ID: {employee.id}</p>

            <span className={`status ${employee.status === "Đang làm việc" ? "active" : "off"}`}>
              {employee.status || "N/A"}
            </span>

            <div className="contact-box">
              <p><b>Email:</b> {employee.email}</p>
              <p><b>Phone:</b> {employee.phone}</p>
            </div>
          </div>

          {/* RIGHT INFO */}
          <div className="detail-right">

            <div className="dash-card info-card">
              <h3>📌 Thông tin công việc</h3>

              <div className="info-grid">
                <Info label="Phòng ban" value={employee.department} />
                <Info label="Chức vụ" value={employee.position} />
                <Info label="Ngày vào làm" value={employee.joinDate} />
                <Info label="Vai trò" value={employee.role || "Nhân viên"} />
              </div>
            </div>

            <div className="dash-card salary-card">
              <h3>💰 Thu nhập</h3>

              <div className="salary-value">
                {employee.baseSalary?.toLocaleString() || 0} VNĐ
              </div>

              <p className="salary-note">Lương cơ bản hàng tháng</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="info-item">
    <span>{label}</span>
    <b>{value || "—"}</b>
  </div>
);

export default EmployeeDetail;