// src/pages/payroll/PayrollList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './Payroll.module.css';

const PayrollList = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // LẤY DATA TỪ BACKEND
  useEffect(() => {
    fetch('http://localhost:5000/api/payroll')
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Lỗi Backend (${res.status}): ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPayrolls(data);
          setErrorMsg('');
        } else {
          console.error("Dữ liệu không phải là mảng:", data);
          setPayrolls([]);
          setErrorMsg('Dữ liệu từ Backend trả về không đúng định dạng mảng.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi fetch data:", err);
        setPayrolls([]);
        setErrorMsg('Không thể kết nối đến Backend hoặc Backend đang bị lỗi. Vui lòng kiểm tra Terminal của Backend.');
        setLoading(false);
      });
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const formatMonthYear = (month, year) => {
    if (typeof month === 'string') {
      const trimmed = month.trim();
      if (trimmed.includes('/')) {
        return trimmed;
      }
      if (trimmed.length === 1 || trimmed.length === 2) {
        return `${trimmed.padStart(2, '0')}/${year ?? ''}`.replace(/\/$/, '');
      }
      return trimmed;
    }

    if (typeof month === 'number' || (typeof month === 'string' && /^\\\d+\\b$/.test(month))) {
      const monthNumber = Number(month);
      if (!Number.isNaN(monthNumber)) {
        return `${String(monthNumber).padStart(2, '0')}/${year ?? ''}`.replace(/\/$/, '');
      }
    }

    if (year) {
      return `${month || ''}/${year}`;
    }

    return month || '';
  };

  // TÌM KIẾM & LỌC
  const filteredPayrolls = useMemo(() => {
    if (!Array.isArray(payrolls)) return [];

    return payrolls.filter((row) => {
      const safeEmployeeId = String(row.employeeId || '');
      const safeName = String(row.name || '').toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      const matchSearch = safeEmployeeId.includes(searchLower) || safeName.includes(searchLower);
      
      const rowMonthStr = formatMonthYear(row.month, row.year);
      const matchMonth = filterMonth === '' || rowMonthStr === filterMonth;

      return matchSearch && matchMonth;
    });
  }, [payrolls, searchTerm, filterMonth]);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px', color: '#64748b' }}>Đang tải dữ liệu từ Backend...</h2>;

  return (
    <div className={styles.container} style={{ maxWidth: 'none', width: '100%', padding: '10px 24px', boxSizing: 'border-box' }}>
      {/* Đã di chuyển dòng ghi chú vào bên trong div gốc để không bị lỗi */}
      <h2 className={styles.title}>Bảng Lương Tổng Hợp</h2>
      
      {/* HIỂN THỊ LỖI BACKEND */}
      {errorMsg && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>
          {errorMsg}
        </div>
      )}

      <div className={styles.filterContainer}>
        <input 
          type="text" 
          placeholder="Tìm theo Mã hoặc Tên NV..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          className={styles.filterSelect}
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        >
          <option value="">-- Tất cả các tháng --</option>
          <option value="02/2026">Tháng 02/2026</option>
          <option value="03/2026">Tháng 03/2026</option>
          <option value="04/2026">Tháng 04/2026</option>
        </select>
      </div>

      {/* WRAPPER GIÚP BẢNG CUỘN NGANG KHI MÀN HÌNH NHỎ */}
      <div className={styles.tableWrapper}>
        <table className={styles.payrollTable}>
          <thead>
            <tr>
              <th>Mã Phiếu</th>
              <th>Tên Nhân Viên</th>
              <th>Phòng Ban</th>
              <th>Tháng</th>
              <th>Lương Cơ Bản</th>
              <th>Thực Lãnh</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayrolls.length > 0 ? (
              filteredPayrolls.map((row) => (
                <tr key={row.id}>
                  <td>PR{String(row.id).padStart(3, '0')}</td>
                  <td style={{ fontWeight: 'bold', color: '#334155' }}>{row.name}</td>
                  <td>{row.department}</td>
                  <td>{formatMonthYear(row.month, row.year)}</td>
                  <td>{formatCurrency(row.baseSalary)}</td>
                  <td className={styles.netSalaryText}>
                    {formatCurrency(row.netSalary)}
                  </td>
                  <td>
                    <span style={{
                      padding: '6px 10px', 
                      borderRadius: '6px', 
                      fontSize: '12px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      backgroundColor: row.paymentStatus === 'Đã thanh toán' ? '#dcfce7' : '#fef08a',
                      color: row.paymentStatus === 'Đã thanh toán' ? '#166534' : '#854d0e'
                    }}>
                      {row.paymentStatus}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Link to={`/payroll/payslip/${row.id}`} className={styles.actionBtn}>
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className={styles.noData}>
                  {errorMsg ? "Không có dữ liệu do lỗi Backend." : "Không tìm thấy dữ liệu phù hợp."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollList;