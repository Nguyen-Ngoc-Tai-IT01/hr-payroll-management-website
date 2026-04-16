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
      let foundData = null;

      // 1. SỬA LỖI: TÌM TRONG LOCALSTORAGE TRƯỚC (Để lấy được nhân viên vừa thêm mới)
      const localData = localStorage.getItem('employeeData');
      if (localData) {
        const allEmployees = JSON.parse(localData);
        foundData = allEmployees.find(emp => String(emp.id) === String(id));
      }

      // 2. NẾU LOCALSTORAGE KHÔNG CÓ, MỚI ĐI ĐỌC FILE JSON
      if (!foundData) {
        const paths = ['/data/employees.json', '/backend/data/employees.json', './data/employees.json'];
        
        for (const path of paths) {
          try {
            const res = await fetch(path);
            if (res.ok) {
              const data = await res.json();
              foundData = data.find(emp => String(emp.id) === String(id));
              if (foundData) {
                  // Nếu tìm thấy trong JSON, lưu ngược lại vào LocalStorage để đồng bộ
                  localStorage.setItem('employeeData', JSON.stringify(data));
                  break; 
              }
            }
          } catch (err) {
            console.warn(`Không tìm thấy dữ liệu tại: ${path}`);
          }
        }
      }

      // 3. XỬ LÝ KẾT QUẢ CUỐI CÙNG
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

  if (loading) return <div className="emp-layout"><div className="emp-empty-state">⏳ Đang tải thông tin nhân viên...</div></div>;

  if (error || !employee) return (
    <div className="emp-layout">
      <div className="emp-error-card">
        <h2>Lỗi load dữ liệu ⚠️</h2>
        <p>{error}</p>
        <Link to="/employees" className="emp-btn-back">← Quay lại danh sách</Link>
      </div>
    </div>
  );

  return (
    <div className="emp-layout">
      <div className="emp-container">
        
        {/* HEADER CHI TIẾT */}
        <header className="emp-detail-header">
          <div>
            <Link to="/employees" className="emp-link-back">← Quay lại danh sách</Link>
            <h1>Hồ sơ: {employee.fullName}</h1>
          </div>
          <Link to={`/employees/edit/${employee.id}`} className="emp-btn-edit-large">
            ✏️ Sửa thông tin
          </Link>
        </header>

        {/* LAYOUT 2 CỘT */}
        <div className="emp-detail-grid">
          
          {/* CỘT TRÁI: PROFILE CARD */}
          <div className="emp-detail-card profile-card">
            <div className="emp-cover"></div>
            
            {/* VÙNG CHỨA THÔNG TIN AVATAR VÀ TÊN */}
            <div className="emp-profile-content" style={{ position: 'relative', paddingBottom: '30px', textAlign: 'center' }}>
              
              <div className="emp-big-avatar">
                {employee.fullName?.charAt(0).toUpperCase()}
              </div>
              
              {/* KHU VỰC CỨU HỘ: Khoảng đệm an toàn để đẩy chữ xuống, không bao giờ bị Avatar đè lên nữa */}
              <div style={{ height: '70px', width: '100%' }}></div>
              
              <h2 className="emp-big-name" style={{ margin: '0 0 5px 0' }}>{employee.fullName}</h2>
              <span className="emp-big-id">{employee.id}</span>
              
              <div className={`emp-status ${employee.status === "Đang làm việc" ? "active" : "inactive"}`}>
                {employee.status || "N/A"}
              </div>
              
              <div className="emp-contact-box" style={{ margin: '0 20px' }}>
                <div className="emp-contact-item">
                  <span>📧 Email</span>
                  <a href={`mailto:${employee.email}`}>{employee.email}</a>
                </div>
                <div className="emp-contact-item">
                  <span>📞 Điện thoại</span>
                  <strong>{employee.phone}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN TỔ CHỨC */}
          <div className="emp-detail-main">
            
            <div className="emp-detail-card">
              <h3 className="emp-section-title">🏢 Thông tin tổ chức</h3>
              <div className="emp-info-grid">
                <InfoItem label="Phòng ban" value={employee.department} />
                <InfoItem label="Chức vụ" value={employee.position} />
                <InfoItem label="Ngày vào làm" value={employee.joinDate} />
                <InfoItem label="Phân quyền hệ thống" value={employee.role || "Nhân viên tiêu chuẩn"} />
              </div>
            </div>

            <div className="emp-detail-card" style={{marginTop: '25px'}}>
              <h3 className="emp-section-title">💰 Tài chính & Thu nhập</h3>
              <div className="emp-salary-box">
                <div>
                  <span className="emp-salary-label">Lương cơ bản hàng tháng</span>
                  <div className="emp-salary-value">
                    {employee.baseSalary?.toLocaleString()} <small>VNĐ</small>
                  </div>
                </div>
                <div className="emp-salary-icon">💳</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="emp-info-block">
    <span className="emp-info-label">{label}</span>
    <p className="emp-info-value">{value || "Chưa cập nhật"}</p>
  </div>
);

export default EmployeeDetail;