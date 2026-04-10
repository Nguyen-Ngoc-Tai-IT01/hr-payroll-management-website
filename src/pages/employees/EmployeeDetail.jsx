// src/pages/employees/EmployeeDetail.jsx
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

  if (loading) return <div className="text-center py-20">Đang tải...</div>;
  if (!employee) return <div className="text-center py-20 text-red-500">Không tìm thấy nhân viên mã {id}</div>;

  // Phần hiển thị chi tiết giữ nguyên như mình hướng dẫn trước
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* ... nội dung chi tiết nhân viên ... */}
    </div>
  );
};

export default EmployeeDetail;