// src/pages/payroll/PayslipDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PayslipDetail = () => {
  const { id } = useParams(); // Lấy ID (ví dụ: 1001) từ URL xuống
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Gọi API lấy chi tiết phiếu lương
    fetch(`http://localhost:5000/api/payroll/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error('Không tìm thấy phiếu lương này!');
          throw new Error('Lỗi kết nối máy chủ');
        }
        return res.json();
      })
      .then((data) => {
        setPayslip(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải dữ liệu...</h2>;
  
  if (error) return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2 style={{ color: '#dc2626' }}>{error}</h2>
      <Link to="/payroll" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Quay lại danh sách</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>Chi Tiết Phiếu Lương: PR{String(payslip.id).padStart(3, '0')}</h2>
        <Link to="/payroll" style={{ padding: '8px 16px', backgroundColor: '#64748b', color: 'white', textDecoration: 'none', borderRadius: '6px', fontSize: '14px' }}>
          &larr; Quay lại
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '16px', lineHeight: '1.6' }}>
        <div>
          <p><strong>Mã nhân viên:</strong> {payslip.employeeId}</p>
          <p><strong>Họ và tên:</strong> {payslip.name}</p>
          <p><strong>Phòng ban:</strong> {payslip.department}</p>
          <p><strong>Kỳ lương:</strong> {String(payslip.month).padStart(2, '0')}/{payslip.year}</p>
        </div>
        
        <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <p><strong>Lương cơ bản:</strong> {formatCurrency(payslip.baseSalary)}</p>
          <p style={{ color: '#16a34a' }}><strong>Phụ cấp (+):</strong> {formatCurrency(payslip.allowance || 0)}</p>
          <p style={{ color: '#dc2626' }}><strong>Khấu trừ (-):</strong> {formatCurrency(payslip.deduction || 0)}</p>
          <hr style={{ margin: '10px 0', borderColor: '#cbd5e1' }} />
          <p style={{ fontSize: '18px', margin: 0 }}>
            <strong>Thực lãnh: </strong> 
            <span style={{ color: '#16a34a', fontWeight: 'bold' }}>{formatCurrency(payslip.netSalary)}</span>
          </p>
          <p style={{ marginTop: '10px', margin: 0 }}>
            <strong>Trạng thái: </strong>
             <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', backgroundColor: payslip.paymentStatus === 'Đã thanh toán' ? '#dcfce7' : '#fef08a', color: payslip.paymentStatus === 'Đã thanh toán' ? '#166534' : '#854d0e' }}>
              {payslip.paymentStatus}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayslipDetail;