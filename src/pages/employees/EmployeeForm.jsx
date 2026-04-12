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

  // MÓC NỐI VỚI BỘ NHỚ ẢO ĐỂ TỰ ĐỘNG TẠO ID & LẤY DATA
  useEffect(() => {
    const fetchEmployeeData = async () => {
      let allEmployees = [];
      const localData = localStorage.getItem('employeeData');

      if (localData) {
        allEmployees = JSON.parse(localData);
      } else {
        const paths = ['/data/employees.json', '/backend/data/employees.json', './data/employees.json'];
        for (const path of paths) {
          try {
            const res = await fetch(path);
            if (res.ok) {
              allEmployees = await res.json();
              if (allEmployees.length > 0) {
                localStorage.setItem('employeeData', JSON.stringify(allEmployees));
                break;
              }
            }
          } catch (error) {}
        }
      }

      if (isEditMode) {
        const foundData = allEmployees.find(emp => String(emp.id) === String(id));
        if (foundData) setFormData(foundData);
      } else {
        if (allEmployees.length > 0) {
          const idNumbers = allEmployees.map(emp => {
            const match = emp.id.match(/\d+/);
            return match ? parseInt(match[0], 10) : 0;
          });
          const nextIdNumber = Math.max(...idNumbers) + 1;
          const nextIdString = `EMP${String(nextIdNumber).padStart(3, '0')}`;
          setFormData(prev => ({ ...prev, id: nextIdString }));
        } else {
          setFormData(prev => ({ ...prev, id: 'EMP001' }));
        }
      }
    };

    fetchEmployeeData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'baseSalary' ? Number(value) || '' : value
    }));
  };

  // SỬA LỖI: LƯU DATA VÀO LOCALSTORAGE THAY VÌ BỎ ĐI
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      // 1. Lấy danh sách cũ ra
      const localData = localStorage.getItem('employeeData');
      let currentList = localData ? JSON.parse(localData) : [];

      if (isEditMode) {
        // NẾU SỬA: Tìm và ghi đè
        currentList = currentList.map(emp => String(emp.id) === String(formData.id) ? formData : emp);
      } else {
        // NẾU THÊM MỚI: Đẩy nhân viên mới lên đầu danh sách
        currentList.unshift(formData); 
      }

      // 2. Nhét danh sách mới vào lại bộ nhớ
      localStorage.setItem('employeeData', JSON.stringify(currentList));

      setLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: `Đã ${isEditMode ? 'cập nhật' : 'tạo mới'} hồ sơ nhân sự.`,
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
                  disabled
                  className="disabled"
                  style={{ backgroundColor: '#f8fafc', fontWeight: 'bold', color: '#3b82f6' }}
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
              <button type="submit" className="emp-btn-submit" disabled={loading || !formData.id}>
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