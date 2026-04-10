import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './style.css'; // Đảm bảo bạn đã import file css này

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    id: '', fullName: '', email: '', phone: '',
    department: 'Phòng IT', position: '',
    baseSalary: '', joinDate: '', status: 'Đang làm việc'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetch('/data/employees.json')
        .then(res => res.json())
        .then(data => {
          const found = data.find(emp => String(emp.id) === String(id));
          if (found) setFormData(found);
        })
        .catch(() => console.error("Lỗi load dữ liệu"));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'baseSalary' ? Number(value) || '' : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert(`✅ ${isEditMode ? 'Cập nhật' : 'Thêm'} thành công!`);
      navigate('/employees');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="form-container">
      <Link to="/employees" className="back-btn">← Quay lại danh sách</Link>
      <h1 className="form-title">{isEditMode ? `Chỉnh sửa: ${formData.fullName}` : 'Thêm nhân viên mới'}</h1>
      
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Mã nhân viên</label>
              <input 
                type="text" name="id" 
                value={formData.id} 
                onChange={handleChange} 
                required 
                disabled={isEditMode}
                className={isEditMode ? "input-disabled" : ""}
              />
            </div>
            <div className="form-group">
              <label>Họ và tên</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Email liên hệ</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Phòng ban</label>
              <select name="department" value={formData.department} onChange={handleChange}>
                <option value="Phòng IT">Phòng IT</option>
                <option value="Phòng Nhân sự">Phòng Nhân sự</option>
                <option value="Phòng Kế toán">Phòng Kế toán</option>
                <option value="Ban Giám đốc">Ban Giám đốc</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Chức vụ</label>
              <input type="text" name="position" value={formData.position} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Lương cơ bản (VNĐ)</label>
              <input type="number" name="baseSalary" value={formData.baseSalary} onChange={handleChange} />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Trạng thái</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Đang làm việc">Đang làm việc</option>
                <option value="Đã nghỉ việc">Đã nghỉ việc</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ngày vào làm</label>
              <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Đang xử lý...' : isEditMode ? 'Lưu thay đổi' : 'Tạo mới'}
            </button>
            <button type="button" className="btn-cancel" onClick={() => navigate('/employees')}>Hủy bỏ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;