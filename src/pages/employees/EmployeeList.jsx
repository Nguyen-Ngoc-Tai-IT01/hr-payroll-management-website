// src/pages/employees/EmployeeList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/backend/data/employees.json')   // ← Đường dẫn quan trọng
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi load employees.json:", err);
        setLoading(false);
      });
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp =>
      emp.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase()) ||
      emp.department?.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  if (loading) return <div className="p-6 text-center">Đang tải dữ liệu nhân viên...</div>;

  // Phần render bảng giữ nguyên như trước (chỉ thay employeesData thành employees)
  return (
    <div className="p-6">
      {/* ... phần header và input tìm kiếm giữ nguyên ... */}

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full">
          {/* thead giữ nguyên */}
          <tbody className="divide-y">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{emp.id}</td>
                <td className="px-6 py-4">{emp.fullName}</td>
                <td className="px-6 py-4">{emp.email}</td>
                <td className="px-6 py-4">{emp.phone}</td>
                <td className="px-6 py-4">{emp.department}</td>
                <td className="px-6 py-4">{emp.position}</td>
                <td className="px-6 py-4 text-center space-x-4">
                  <Link to={`/employees/${emp.id}`} className="text-blue-600 hover:underline">Xem</Link>
                  <Link to={`/employees/edit/${emp.id}`} className="text-amber-600 hover:underline">Sửa</Link>
                  <button onClick={() => alert(`Xóa ${emp.fullName}`)} className="text-red-600 hover:underline">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;