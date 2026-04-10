import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './Admin.css';

function Reports() {
  const [reportData, setReportData] = useState({ total: 0, active: 0, employeesList: [] });

  useEffect(() => {
    // Gọi API lấy dữ liệu nhân viên
    fetch('http://localhost:5000/api/reports/employees')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setReportData({
            total: data.total,
            active: data.active,
            employeesList: data.list // Lưu lại danh sách để xuất CSV
          });
        }
      })
      .catch(error => console.error("Lỗi kết nối Backend:", error));
  }, []);

  // --- HÀM XUẤT FILE CSV ---
  const exportToCSV = (data, filename) => {
    if (!data || !data.length) {
      alert("Chưa có dữ liệu để xuất!");
      return;
    }
    
    // Lấy tiêu đề cột
    const headers = Object.keys(data[0]).join(',');
    // Trích xuất dữ liệu từng dòng
    const rows = data.map(obj => 
      Object.values(obj).map(val => `"${val}"`).join(',')
    ).join('\n');
    
    // Gộp tiêu đề và dữ liệu
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers + '\n' + rows;
    
    // Tạo link ảo để ép trình duyệt tải xuống
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true; 
  };

  // --- 1. XUẤT BÁO CÁO NHÂN SỰ ---
  const handleExportEmployees = () => {
    if (!reportData.employeesList || reportData.employeesList.length === 0) {
      Swal.fire('Chờ chút', 'Dữ liệu nhân sự đang tải hoặc bị rỗng.', 'info');
      return;
    }
    
    // Lọc lại các cột cần thiết cho đẹp
    const formattedData = reportData.employeesList.map(emp => ({
      "Mã NV": emp.id,
      "Họ và Tên": emp.fullName,
      "Email": emp.email,
      "Số điện thoại": emp.phone,
      "Phòng ban": emp.department,
      "Chức vụ": emp.role || 'Nhân viên'
    }));

    const isSuccess = exportToCSV(formattedData, 'Bao_Cao_Nhan_Su');
    if (isSuccess) {
      logExportHistory('Danh sách chi tiết nhân sự');
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã tải báo cáo nhân sự', showConfirmButton: false, timer: 2000 });
    }
  };

  // --- 2. XUẤT BÁO CÁO CHẤM CÔNG ---
  const handleExportAttendance = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/attendance');
      const result = await response.json();
      const attData = result.data || result; 

      if (!attData || attData.length === 0) {
        Swal.fire('Thông báo', 'Tháng này chưa có dữ liệu chấm công nào!', 'info');
        return;
      }

      const formattedData = attData.map(record => {
        const emp = reportData.employeesList.find(e => e.id === record.employeeId);
        return {
          "Mã Nhân Viên": record.employeeId,
          "Họ và Tên": record.fullName || (emp ? emp.fullName : "Chưa cập nhật"),
          "Tháng": record.month || "04/2026",
          "Số ngày công": record.actualDays,
          "Số lần đi muộn": record.lateCount,
          "Giờ tăng ca": record.overtimeHours
        };
      });

      const isSuccess = exportToCSV(formattedData, 'Bao_Cao_Cham_Cong_Thang_4');
      if (isSuccess) {
        logExportHistory('Báo cáo Chấm công Tháng 4/2026'); 
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã tải báo cáo chấm công', showConfirmButton: false, timer: 2000 });
      }
      
    } catch (error) {
      console.error("Lỗi khi tải chấm công:", error);
      Swal.fire('Lỗi!', 'Không thể kết nối đến Server để lấy dữ liệu chấm công.', 'error');
    }
  };

  // --- 3. XUẤT BÁO CÁO TIỀN LƯƠNG (MỚI THÊM) ---
  const handleExportPayroll = async () => {
    try {
      // Gọi API của Vỹ
      const response = await fetch('http://localhost:5000/api/payroll');
      const result = await response.json();
      
      // Tùy theo API của bạn trả về array trực tiếp hay nằm trong object (như Vỹ viết là trả về object có chứa mảng data)
      const payrollData = result.data || result;

      if (!payrollData || payrollData.length === 0) {
        Swal.fire('Thông báo', 'Chưa có dữ liệu bảng lương!', 'info');
        return;
      }

      // Xào nấu dữ liệu: Định dạng tiền tệ cho Excel dễ đọc
      const formattedData = payrollData.map(record => {
        return {
          "Mã Phiếu": `PR${String(record.id).padStart(3, '0')}`,
          "Mã Nhân Viên": record.employeeId || "N/A",
          "Họ và Tên": record.name,
          "Phòng Ban": record.department,
          "Kỳ Lương": `${String(record.month).padStart(2, '0')}/${record.year}`,
          "Lương Cơ Bản (VND)": record.baseSalary,
          "Phụ Cấp (VND)": record.allowance || 0,
          "Khấu Trừ (VND)": record.deduction || 0,
          "Thực Lãnh (VND)": record.netSalary,
          "Trạng Thái": record.paymentStatus
        };
      });

      const isSuccess = exportToCSV(formattedData, 'Bang_Luong_Tong_Hop');
      if (isSuccess) {
        logExportHistory('Bảng lương tổng hợp'); 
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã tải báo cáo tiền lương', showConfirmButton: false, timer: 2000 });
      }
      
    } catch (error) {
      console.error("Lỗi khi tải báo cáo lương:", error);
      Swal.fire('Lỗi!', 'Không thể kết nối đến Server để lấy dữ liệu tiền lương.', 'error');
    }
  };
  // hàm lấy chấm công của sêu 
  const handleDownloadAttendance = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/attendance');
      const data = await res.json();

      if (data.length === 0) {
        alert("Chưa có dữ liệu chấm công nào!");
        return;
      }

      const headers = ["Mã NV", "Họ và Tên", "Công thực", "Đi muộn", "Tăng ca"];
      const rows = data.map(rec => [
        rec.employeeId, 
        rec.fullName || `NV-${rec.employeeId}`, 
        rec.actualDays, 
        rec.lateCount, 
        rec.overtimeHours + "h"
      ]);
      
      const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
      
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; 
      link.setAttribute("download", `Bao_cao_Cham_cong_Hoan_Chinh.csv`); 
      link.click();
      
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối đến API Chấm công của Sêu");
    }
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
    <div className="dashboard-wrapper" style={{ paddingBottom: '50px' }}>
      
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h2>Trung tâm Báo cáo</h2>
        <p>
          Xuất dữ liệu từ các phòng ban để phục vụ kiểm toán và tính lương. <br />
          <span style={{ color: reportData.total > 0 ? '#059669' : '#dc2626', fontWeight: '500', fontSize: '14px', display: 'inline-block', marginTop: '5px' }}>
            📊 Dữ liệu Backend: Hệ thống đang ghi nhận {reportData.total} nhân sự ({reportData.active} người đang làm việc).
          </span>
        </p>
      </div>

      <div className="report-grid">
        {/* Thẻ Báo cáo Nhân sự */}
        <div className="dash-card report-item-card">
          <div className="report-icon-box">👥</div>
          <h3>Dữ liệu Nhân sự (Hiệp)</h3>
          <p>Danh sách chi tiết hồ sơ nhân viên, chức vụ, phòng ban định dạng CSV.</p>
          <button 
            className="p-btn p-btn-outline" 
            onClick={() => exportToCSV(reportData.employeesList, 'Bao_Cao_Nhan_Su')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
             📥 Tải CSV Nhân Sự
          </button>
        </div>

        {/* Các thẻ khác tạm thời hiện Alert chờ Sêu và Vỹ đẩy API lên */}
        <div className="dash-card report-item-card">
          <div className="report-icon-box" style={{ color: '#e67e22', backgroundColor: '#fff7ed' }}>📅</div>
          <h3>Dữ liệu Chấm công (Sêu)</h3>
          <p>Báo cáo giờ Check-in/Check-out, số ngày nghỉ phép trong tháng này.</p>
          <button 
            className="p-btn p-btn-outline" 
            onClick={() => alert("Đang chờ Sêu hoàn thiện API Chấm công!")}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
             📥 Tải CSV Chấm Công
          </button>
        </div>

        <div className="dash-card report-item-card">
          <div className="report-icon-box" style={{ color: '#059669', backgroundColor: '#ecfdf5' }}>💰</div>
          <h3>Báo cáo Tiền lương (Vỹ)</h3>
          <p>Bảng lương chi tiết bao gồm lương cơ bản, phụ cấp và các khoản trừ.</p>
          <button 
            className="p-btn p-btn-outline"
            onClick={() => alert("Đang chờ Vỹ hoàn thiện API Tiền lương!")} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
             📥 Tải CSV Tiền Lương
          </button>
        </div>
      </div>
      
      {/* (Phần Table Lịch sử xuất báo cáo giữ nguyên bên dưới...) */}
    </div>
  );
}

export default Reports;
