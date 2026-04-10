// src/pages/employees/EmployeeForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import employeesData from '../../data/employees.json';

const EmployeeForm = () => {
  const { id } = useParams();        // nếu có id → đang sửa
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    username: '',
    fullName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    role: 'Employee',
    baseSalary: '',
    joinDate: '',
    status: 'Đang làm việc'
  });

  // Nếu sửa → load dữ liệu cũ
  useEffect(() => {
    if (id) {
      const emp = employeesData.find(e => e.id === id);
      if (emp) setFormData(emp);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'baseSalary' ? Number(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      alert(`Cập nhật nhân viên ${formData.fullName} thành công! (mock)`);
    } else {
      alert(`Thêm nhân viên mới ${formData.fullName} thành công! (mock)`);
    }
    navigate('/employees');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        {id ? 'Chỉnh sửa Nhân viên' : 'Thêm Nhân viên Mới'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow space-y-6">
        {/* Các trường form tương tự như trước, nhưng dùng tên trường phù hợp với JSON */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Mã NV</label>
            <input type="text" name="id" value={formData.id} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Họ và tên</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Số điện thoại</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border rounded-lg" />
          </div>
        </div>

        {/* Thêm các trường khác: department, position, baseSalary, joinDate, status... */}

        <div className="flex gap-4 pt-6">
          <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            {id ? 'Cập nhật' : 'Thêm mới'}
          </button>
          <button type="button" onClick={() => navigate('/employees')} className="flex-1 border py-3 rounded-lg hover:bg-gray-50">
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;