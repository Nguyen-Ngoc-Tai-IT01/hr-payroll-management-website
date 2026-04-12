import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function Reports() {
  const [reportData, setReportData] = useState({ total: 0, active: 0, employeesList: [] });
  const [exportLogs, setExportLogs] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const exporterName = currentUser.fullName || "Quản trị viên";

  // ==========================================
  // ĐỌC DỮ LIỆU ĐÚNG THEO CODE CỦA HIỆP
  // ==========================================
  useEffect(() => {
    const fetchEmployeeData = async () => {
      const paths = ['/data/employees.json', '/backend/data/employees.json', './data/employees.json'];
      
      for (const path of paths) {
        try {
          const res = await fetch(path);
          if (res.ok) {
            const data = await res.json();
            
            // Đếm số người đang làm việc
            const activeCount = data.filter(emp => emp.status === 'Đang làm việc').length;
            
            setReportData({
              total: data.length,
              active: activeCount,
              employeesList: data // Lưu lại toàn bộ list của Hiệp để xuất CSV
            });
            return; // Lấy được data rồi thì dừng vòng lặp
          }
        } catch (e) { 
          console.warn(`Lỗi tải dữ liệu từ ${path}`);
        }
      }
    };

    fetchEmployeeData();
  }, []);

  const addLog = (reportName, status, message) => {
    const newLog = {
      id: Date.now(),
      user: exporterName,
      reportName: reportName,
      status: status,
      message: message,
      time: new Date().toLocaleTimeString('vi-VN') + ' - ' + new Date().toLocaleDateString('vi-VN')
    };
    setExportLogs(prevLogs => [newLog, ...prevLogs]);
  };

  const exportToCSV = (data, filename) => {
    if (!data || !data.length) return false;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => `"${val}"`).join(',')
    ).join('\n');
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers + '\n' + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true; 
  };

  // ==========================================
  // 1. XUẤT BÁO CÁO NHÂN SỰ (Dữ liệu của Hiệp)
  // ==========================================
  const handleExportEmployees = () => {
    if (!reportData.employeesList || reportData.employeesList.length === 0) {
      Swal.fire('Chờ chút', 'Không tìm thấy file employees.json của Hiệp.', 'warning');
      addLog('Nhân sự', 'warning', 'Thất bại: Dữ liệu rỗng');
      return;
    }

    // Bật hiệu ứng Loading
    Swal.fire({ title: 'Đang tạo báo cáo...', text: 'Vui lòng chờ trong giây lát', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    
    // Giả lập thời gian chờ 800ms cho mượt mà
    setTimeout(() => {
      const formattedData = reportData.employeesList.map(emp => ({
        "Mã NV": emp.id || 'N/A',
        "Họ và Tên": emp.fullName || 'N/A',
        "Email": emp.email || 'N/A',
        "Số điện thoại": emp.phone || 'N/A',
        "Phòng ban": emp.department || 'N/A',
        "Chức vụ": emp.position || 'N/A',
        "Ngày vào làm": emp.joinDate || 'N/A',
        "Trạng thái": emp.status || 'N/A',
        "Lương cơ bản": emp.baseSalary || 0,
        "Người xuất file": exporterName
      }));

      const isSuccess = exportToCSV(formattedData, 'Bao_Cao_Nhan_Su');
      if (isSuccess) {
        Swal.fire({ icon: 'success', title: 'Hoàn tất!', text: 'Đã tải xuống báo cáo Nhân sự', timer: 2000, showConfirmButton: false });
        addLog('Nhân sự', 'success', 'Xuất file CSV thành công');
      }
    }, 800);
  };

  // ==========================================
  // 2. XUẤT BÁO CÁO CHẤM CÔNG (Của Sêu)
  // ==========================================
  const handleDownloadAttendance = async () => {
    try {
      // Bật hiệu ứng Loading
      Swal.fire({ title: 'Đang tạo báo cáo...', text: 'Vui lòng chờ trong giây lát', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      const res = await fetch('http://localhost:5000/api/attendance');
      const data = await res.json();

      if (data.length === 0) {
        Swal.fire('Thông báo', 'Chưa có dữ liệu chấm công nào!', 'info');
        addLog('Chấm công', 'warning', 'Thất bại: Không có dữ liệu để xuất');
        return;
      }

      const formattedData = data.map(rec => ({
        "Mã NV": rec.employeeId,
        "Họ và Tên": rec.fullName || `NV-${rec.employeeId}`,
        "Công thực": `${rec.actualDays} ngày`,
        "Đi muộn": `${rec.lateCount} lần`,
        "Tăng ca": `${rec.overtimeHours} giờ`,
        "Người xuất file": exporterName
      }));
      
      const isSuccess = exportToCSV(formattedData, 'Bao_Cao_Cham_Cong');
      if (isSuccess) {
        Swal.fire({ icon: 'success', title: 'Hoàn tất!', text: 'Đã tải xuống báo cáo Chấm công', timer: 2000, showConfirmButton: false });
        addLog('Chấm công', 'success', 'Xuất file CSV thành công');
      }
      
    } catch (error) {
      console.error(error);
      Swal.fire('Lỗi', 'Không thể kết nối đến API Chấm công của hệ thống', 'error');
      addLog('Chấm công', 'error', 'Lỗi: Mất kết nối API Backend');
    }
  };

  // ==========================================
  // 3. XUẤT BÁO CÁO TIỀN LƯƠNG (Của Vỹ)
  // ==========================================
  const handleExportPayroll = async () => {
    try {
      // Bật hiệu ứng Loading
      Swal.fire({ title: 'Đang tạo báo cáo...', text: 'Vui lòng chờ trong giây lát', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      const res = await fetch('http://localhost:5000/api/payroll');
      if (!res.ok) throw new Error('Lỗi API Báo cáo Tiền lương');

      const payrollData = await res.json();
      const payrollRows = Array.isArray(payrollData) ? payrollData : [];

      if (payrollRows.length === 0) {
        Swal.fire('Thông báo', 'Chưa có bảng lương nào được tạo!', 'info');
        addLog('Tiền lương', 'warning', 'Thất bại: Bảng lương trống');
        return;
      }

      const formattedData = payrollRows.map(row => ({
        "Mã Phiếu": row.id || 'N/A',
        "Mã Nhân Viên": row.employeeId || 'N/A',
        "Họ và Tên": row.name || 'N/A',
        "Phòng Ban": row.department || 'N/A',
        "Lương Cơ Bản (VND)": row.baseSalary || 0,
        "Phụ Cấp (VND)": row.allowance || 0,
        "Khấu Trừ (VND)": row.deduction || 0,
        "Thực Lãnh (VND)": row.netSalary || 0,
        "Trạng Thái": row.paymentStatus || 'N/A',
        "Người xuất file": exporterName
      }));

      exportToCSV(formattedData, 'Bao_Cao_Tien_Luong');
      Swal.fire({ icon: 'success', title: 'Hoàn tất!', text: 'Đã tải xuống báo cáo Tiền lương', timer: 2000, showConfirmButton: false });
      addLog('Tiền lương', 'success', 'Xuất file CSV thành công');

    } catch (err) {
      console.error(err);
      Swal.fire('Lỗi!', 'Không thể tải báo cáo Tiền lương. Hãy kiểm tra lại Server!', 'error');
      addLog('Tiền lương', 'error', 'Lỗi: Server từ chối kết nối');
    }
  };

  return (
    <div style={{ padding: '40px 30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '40px', backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        <h2 style={{ fontSize: '28px', color: '#1e293b', fontWeight: '800', margin: '0 0 10px 0' }}>Trung tâm Báo cáo</h2>
        <p style={{ color: '#64748b', margin: '0 0 15px 0', fontSize: '16px', lineHeight: '1.5' }}>
          Xuất dữ liệu từ các phòng ban để phục vụ kiểm toán và tính lương.
        </p>

        <span style={{ 
          color: reportData.total > 0 ? '#059669' : '#dc2626', 
          fontWeight: '600', fontSize: '14px', 
          background: reportData.total > 0 ? '#ecfdf5' : '#fef2f2', 
          padding: '10px 16px', borderRadius: '8px', 
          border: `1px solid ${reportData.total > 0 ? '#a7f3d0' : '#fecaca'}`,
          display: 'inline-block'
        }}>
          📊 Dữ liệu Backend: Hệ thống đang ghi nhận {reportData.total} nhân sự ({reportData.active} người đang làm việc).
        </span>
      </div>

      <div className="report-grid-modern">
        <div className="report-card blue">
          <div className="report-icon">👥</div>
          <h3 className="report-title">Dữ liệu Nhân sự (Hiệp)</h3>
          <p className="report-desc">Danh sách chi tiết hồ sơ nhân viên, chức vụ, phòng ban định dạng CSV.</p>
          <button className="btn-export blue-btn" onClick={handleExportEmployees}>
            <span style={{ fontSize: '18px' }}>📥</span> Tải CSV Nhân Sự
          </button>
        </div>

        <div className="report-card orange">
          <div className="report-icon">📅</div>
          <h3 className="report-title">Dữ liệu Chấm công (Sêu)</h3>
          <p className="report-desc">Báo cáo giờ Check-in/Check-out, số ngày làm việc và tăng ca.</p>
          <button className="btn-export orange-btn" onClick={handleDownloadAttendance}>
            <span style={{ fontSize: '18px' }}>📥</span> Tải CSV Chấm Công
          </button>
        </div>

        <div className="report-card green">
          <div className="report-icon">💰</div>
          <h3 className="report-title">Báo cáo Tiền lương (Vỹ)</h3>
          <p className="report-desc">Bảng lương chi tiết bao gồm lương cơ bản, phụ cấp và các khoản trừ.</p>
          <button className="btn-export green-btn" onClick={handleExportPayroll}>
            <span style={{ fontSize: '18px' }}>📥</span> Tải CSV Tiền Lương
          </button>
        </div>
      </div>

      {/* KHU VỰC NHẬT KÝ */}
      <div className="audit-log-container">
        <h3 className="audit-log-title">
          📝 Nhật ký thao tác
        </h3>
        
        {exportLogs.length === 0 ? (
          <div className="audit-log-empty">
            Chưa có hoạt động xuất báo cáo nào trong phiên làm việc này.
          </div>
        ) : (
          <div className="audit-log-list">
            {exportLogs.map((log) => (
              <div key={log.id} className={`audit-log-item ${log.status}`}>
                <div className="log-content">
                  <span className="log-icon">
                    {log.status === 'success' ? '✅' : (log.status === 'error' ? '❌' : '⚠️')}
                  </span>
                  <div>
                    <div className="log-main-text">
                      <strong>{log.user}</strong> đã yêu cầu xuất <strong>Báo cáo {log.reportName}</strong>
                    </div>
                    <div className={`log-sub-text ${log.status}`}>
                      ↳ {log.message}
                    </div>
                  </div>
                </div>
                <div className="log-time">
                  {log.time}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Reports;