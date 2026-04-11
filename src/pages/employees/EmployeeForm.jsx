import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import './style.css'; 

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

  // ĐÃ SỬA LỖI: Cập nhật hàm fetch data thông minh (dò tìm nhiều đường dẫn)
  useEffect(() => {
    if (id) {
      const fetchEmployeeData = async () => {
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
          } catch (error) {
            // Bỏ qua lỗi và thử đường dẫn tiếp theo
          }
        }

        if (foundData) {
          // Nếu tìm thấy, tự động điền dữ liệu vào Form
          setFormData(foundData);
        } else {
          console.error("Không tìm thấy thông tin nhân viên để sửa!");
        }
      };

      fetchEmployeeData();
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
      setLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: `Đã cập nhật hồ sơ nhân sự.`,
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        navigate('/employees');
      });
    }, 800);
  };

  return (
    <div className="emp-layout">
      <div className="emp-form-container">
        <Link to="/employees" className="emp-link-back">← Quay lại danh sách</Link>
        
        <div className="emp-form-header">
          <h1>{isEditMode ? 'Chỉnh sửa Hồ sơ' : 'Thêm Nhân sự mới'}</h1>
          <p>{isEditMode ? `Cập nhật thông tin cho: ${formData.fullName}` : 'Điền thông tin chi tiết để tạo hồ sơ nhân viên mới.'}</p>
        </div>
        
        <div className="emp-form-card">
          <form onSubmit={handleSubmit}>
            <div className="emp-form-row">
              <div className="emp-input-group">
                <label>Mã định danh (ID)</label>
                <input 
                  type="text" name="id" 
                  value={formData.id} 
                  onChange={handleChange} 
                  required 
                  disabled={isEditMode}
                  className={isEditMode ? "disabled" : ""}
                />
              </div>
              <div className="emp-input-group">
                <label>Họ và tên đầy đủ</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>
            </div>

            <div className="emp-input-group">
              <label>Email liên hệ</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="emp-form-row">
              <div className="emp-input-group">
                <label>Số điện thoại</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="emp-input-group">
                <label>Phòng ban</label>
                <select name="department" value={formData.department} onChange={handleChange}>
                  <option value="Phòng IT">Phòng IT</option>
                  <option value="Phòng Nhân sự">Phòng Nhân sự</option>
                  <option value="Phòng Kế toán">Phòng Kế toán</option>
                  <option value="Ban Giám đốc">Ban Giám đốc</option>
                </select>
              </div>
            </div>

            <div className="emp-form-row">
              <div className="emp-input-group">
                <label>Chức vụ</label>
                <input type="text" name="position" value={formData.position} onChange={handleChange} />
              </div>
              <div className="emp-input-group">
                <label>Lương cơ bản (VNĐ)</label>
                <input type="number" name="baseSalary" value={formData.baseSalary} onChange={handleChange} />
              </div>
            </div>

            <div className="emp-form-row">
              <div className="emp-input-group">
                <label>Trạng thái</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Đang làm việc">Đang làm việc</option>
                  <option value="Đã nghỉ việc">Đã nghỉ việc</option>
                </select>
              </div>
              <div className="emp-input-group">
                <label>Ngày vào làm</label>
                <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} />
              </div>
            </div>

            <div className="emp-form-actions">
              <button type="button" className="emp-btn-cancel" onClick={() => navigate('/employees')}>Hủy bỏ</button>
              <button type="submit" className="emp-btn-submit" disabled={loading}>
                {loading ? '⏳ Đang xử lý...' : (isEditMode ? '💾 Lưu thay đổi' : '✨ Tạo hồ sơ')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;