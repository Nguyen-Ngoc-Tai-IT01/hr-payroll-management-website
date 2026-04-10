import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './Admin.css';

function Reports() {
  const [reportData, setReportData] = useState({
    total: 0,
    active: 0,
    employeesList: []
  });

  useEffect(() => {
    const loadEmployeeStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/employees');
        if (!response.ok) throw new Error('Không thể tải dữ liệu nhân sự.');

        const data = await response.json();
        const employees = Array.isArray(data) ? data : [];
        const activeCount = employees.filter((item) => item.status === 'Đang làm việc').length;

        setReportData({
          total: employees.length,
          active: activeCount,
          employeesList: employees
        });
      } catch (error) {
        console.error('Lỗi khi nạp dữ liệu nhân sự:', error);
        setReportData((current) => ({ ...current, employeesList: [] }));
      }
    };

    loadEmployeeStats();
  }, []);

  const formatPayrollMonth = (row) => {
    if (!row) return '';
    const { month, year } = row;
    if (typeof month === 'string' && month.includes('/')) return month;
    if (month !== undefined && year !== undefined) return `${String(month).padStart(2, '0')}/${year}`;
    return month || year || '';
  };

  const exportToCSV = (data, filename) => {
    if (!Array.isArray(data) || data.length === 0) {
      Swal.fire('Thông báo', 'Không có dữ liệu để xuất CSV.', 'info');
      return;
    }

    const headers = Object.keys(data[0]);
    const rows = data.map((item) =>
      headers
        .map((field) => {
          const value = item[field] ?? '';
          const stringValue = String(value).replace(/"/g, '""');
          return /[",\n]/.test(stringValue) ? `"${stringValue}"` : stringValue;
        })
        .join(',')
    );

    const csvContent = [`\uFEFF${headers.join(',')}`, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPayroll = async () => {
    try {
      Swal.fire({
        title: 'Đang tạo báo cáo...',
        text: 'Vui lòng chờ trong giây lát',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const res = await fetch('http://localhost:5000/api/payroll');
      if (!res.ok) throw new Error('Lỗi API Báo cáo Tiền lương');

      const payrollData = await res.json();
      const payrollRows = Array.isArray(payrollData) ? payrollData : [];

      const headers = [
        'Mã Phiếu',
        'Mã Nhân Viên',
        'Họ và Tên',
        'Phòng Ban',
        'Kỳ Lương',
        'Lương Cơ Bản',
        'Phụ Cấp',
        'Thưởng',
        'Khấu Trừ',
        'Thực Lãnh',
        'Trạng Thái'
      ];

      const rows = payrollRows.map((row) => [
        row.id || '',
        row.employeeId || '',
        row.name || '',
        row.department || '',
        formatPayrollMonth(row),
        row.baseSalary ?? '',
        row.allowance ?? '',
        row.bonus ?? '',
        row.deduction ?? '',
        row.netSalary ?? '',
        row.paymentStatus || ''
      ]);

      const escapedRow = (values) => values.map((value) => {
        const stringValue = String(value ?? '').replace(/"/g, '""');
        return /[",\n]/.test(stringValue) ? `"${stringValue}"` : stringValue;
      }).join(',');

      const csvContent = [headers.join(','), ...rows.map(escapedRow)].join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Bao_cao_Tien_luong.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.fire({ icon: 'success', title: 'Hoàn tất!', text: 'Đã tải xuống báo cáo Tiền lương', timer: 2000, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      Swal.fire('Lỗi!', 'Không thể tải báo cáo Tiền lương. Hãy kiểm tra lại Server!', 'error');
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2>Trung tâm Báo cáo</h2>
        <p>
          Xuất dữ liệu từ các phòng ban để phục vụ kiểm toán và tính lương. <br />
          <span style={{ color: '#059669', fontWeight: '500', fontSize: '14px', display: 'inline-block', marginTop: '5px' }}>
            📊 Dữ liệu Backend: Hệ thống đang ghi nhận {reportData.total} nhân sự ({reportData.active} người đang làm việc).
          </span>
        </p>
      </div>

      <div className="report-grid">
        <div className="dash-card report-item-card">
          <div className="report-icon-box">👥</div>
          <h3>Dữ liệu Nhân sự (Hiệp)</h3>
          <p>Danh sách chi tiết hồ sơ nhân viên, chức vụ, phòng ban định dạng CSV.</p>
          <button
            className="p-btn p-btn-outline"
            onClick={() => exportToCSV(reportData.employeesList, 'Bao_Cao_Nhan_Su')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            📥 Tải CSV Nhân Sự
          </button>
        </div>

        <div className="dash-card report-item-card">
          <div className="report-icon-box" style={{ color: '#e67e22', backgroundColor: '#fff7ed' }}>📅</div>
          <h3>Dữ liệu Chấm công (Sêu)</h3>
          <p>Báo cáo giờ Check-in/Check-out, số ngày nghỉ phép trong tháng này.</p>
          <button
            className="p-btn p-btn-outline"
            onClick={() => alert('Đang chờ Sêu hoàn thiện API Chấm công!')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            📥 Tải CSV Chấm Công
          </button>
        </div>

        <div className="dash-card report-item-card">
          <div className="report-icon-box" style={{ color: '#059669', backgroundColor: '#ecfdf5' }}>💰</div>
          <h3>Báo cáo Tiền lương (Vỹ)</h3>
          <p>Bảng lương chi tiết bao gồm lương cơ bản, phụ cấp và các khoản trừ.</p>
          <button
            onClick={handleExportPayroll}
            className="p-btn p-btn-outline"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
          >
            📥 Tải CSV Tiền Lương
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;
