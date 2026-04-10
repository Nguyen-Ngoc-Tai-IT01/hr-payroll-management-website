import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/backend/data/employees.json')
      .then(res => res.json())
      .then(data => {
        const found = data.find(emp => emp.id === id);
        setEmployee(found);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-10 text-center">Đang tải...</div>;
  if (!employee) return <div className="p-10 text-center text-red-500">Không tìm thấy nhân viên mã {id}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold mb-2">{employee.fullName}</h1>
        <p className="text-gray-600 mb-6">{employee.position} • {employee.department}</p>

        <div className="grid grid-cols-2 gap-6 text-lg">
          <div><strong>Mã NV:</strong> {employee.id}</div>
          <div><strong>Email:</strong> {employee.email}</div>
          <div><strong>SĐT:</strong> {employee.phone}</div>
          <div><strong>Lương cơ bản:</strong> {employee.baseSalary?.toLocaleString()} VNĐ</div>
          <div><strong>Ngày vào làm:</strong> {employee.joinDate}</div>
          <div><strong>Trạng thái:</strong> 
            <span className={employee.status === "Đang làm việc" ? "text-green-600" : "text-red-600"}>
              {employee.status}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/employees" className="text-blue-600 hover:underline">← Quay lại danh sách</Link>
      </div>
    </div>
  );
};

export default EmployeeDetail;