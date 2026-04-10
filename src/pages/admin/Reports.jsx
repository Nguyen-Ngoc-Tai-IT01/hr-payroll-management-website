import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './Admin.css';

function Reports() {
  const [reportData, setReportData] = useState({ total: 0, active: 0, employeesList: [] });
  
  const [exportHistory, setExportHistory] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/reports/employees')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setReportData({
            total: data.total,
            active: data.active,
            employeesList: data.list || []
          });
        }
      })
      .catch(error => console.error("Lỗi kết nối Backend:", error));
  }, []);

  const logExportHistory = (reportName) => {
    const now = new Date();
    const timeString = `${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
    
    const newRecord = {
      id: Date.now(),
      name: reportName,
      user: 'Nguyễn Ngọc Tài (Admin)',
      time: timeString,
      status: 'Thành công'
    };
    
    setExportHistory(prevHistory => [newRecord, ...prevHistory]);
  };

  const exportToCSV = (data, filename) => {
    if (!data || !data.length) {
      Swal.fire('Trống!', 'Chưa có dữ liệu để xuất!', 'warning');
      return false; 
    }
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => `"${val}"`).join(',')
    ).join('\n');
    
    // Thêm BOM (\uFEFF) để Excel đọc tiếng Việt không bị lỗi font
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

      <div className="report-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px'
      }}>
        
        {/* THẺ 1: NHÂN SỰ */}
        <div className="dash-card report-item-card" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div className="report-icon-box" style={{ fontSize: '24px', marginBottom: '15px' }}>👥</div>
          <h3 style={{ margin: '0 0 10px 0' }}>Dữ liệu Nhân sự (Hiệp)</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px', minHeight: '40px' }}>Danh sách chi tiết hồ sơ nhân viên, chức vụ, phòng ban định dạng CSV.</p>
          <button 
            className="p-btn p-btn-outline" 
            onClick={handleExportEmployees}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600', color: '#334155' }}>
             📥 Tải CSV Nhân Sự
          </button>
        </div>

        {/* THẺ 2: CHẤM CÔNG */}
        <div className="dash-card report-item-card" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div className="report-icon-box" style={{ fontSize: '24px', marginBottom: '15px' }}>📅</div>
          <h3 style={{ margin: '0 0 10px 0' }}>Dữ liệu Chấm công (Sêu)</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px', minHeight: '40px' }}>Báo cáo giờ Check-in/Check-out, số ngày nghỉ phép trong tháng này.</p>
          <button 
            className="p-btn p-btn-outline" 
            onClick={handleExportAttendance}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600', color: '#334155' }}>
             📥 Tải CSV Chấm Công
          </button>
        </div>

        {/* THẺ 3: TIỀN LƯƠNG */}
        <div className="dash-card report-item-card" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div className="report-icon-box" style={{ fontSize: '24px', marginBottom: '15px' }}>💰</div>
          <h3 style={{ margin: '0 0 10px 0' }}>Báo cáo Tiền lương (Vỹ)</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px', minHeight: '40px' }}>Bảng lương chi tiết bao gồm lương cơ bản, phụ cấp và các khoản trừ.</p>
          <button 
            className="p-btn p-btn-outline"
            onClick={handleExportPayroll} 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600', color: '#334155' }}>
             📥 Tải CSV Tiền Lương
          </button>
        </div>
      </div>
      
      {/* LỊCH SỬ BÁO CÁO */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e2e8f0',
        width: '100%',
        clear: 'both',
        display: 'block',
        marginTop: '50px' 
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', fontWeight: '700' }}>
          Lịch sử xuất báo cáo
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left', margin: '0' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '16px 20px', color: '#475569', fontSize: '13px', textTransform: 'uppercase', fontWeight: '700', width: '35%' }}>Loại báo cáo</th>
                <th style={{ padding: '16px 20px', color: '#475569', fontSize: '13px', textTransform: 'uppercase', fontWeight: '700', width: '25%' }}>Người xuất</th>
                <th style={{ padding: '16px 20px', color: '#475569', fontSize: '13px', textTransform: 'uppercase', fontWeight: '700', width: '25%' }}>Thời gian</th>
                <th style={{ padding: '16px 20px', color: '#475569', fontSize: '13px', textTransform: 'uppercase', fontWeight: '700', width: '15%' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {exportHistory.length > 0 ? (
                exportHistory.map((record) => (
                  <tr 
                    key={record.id} 
                    style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#1e293b' }}>{record.name}</td>
                    <td style={{ padding: '16px 20px', color: '#475569' }}>{record.user}</td>
                    <td style={{ padding: '16px 20px', color: '#475569' }}>{record.time}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' }}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', fontSize: '14px' }}>
                    Chưa có báo cáo nào được xuất trong phiên làm việc này. Bấm vào nút tải CSV ở trên để ghi nhận lịch sử.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Reports;