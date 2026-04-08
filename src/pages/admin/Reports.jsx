import React, { useState, useEffect } from 'react';
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