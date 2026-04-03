import React from 'react';
import './Admin.css';

function Reports() {
  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2>Trung tâm Báo cáo</h2>
        <p>Xuất dữ liệu từ các phòng ban để phục vụ kiểm toán và tính lương</p>
      </div>

      <div className="report-grid">
        <div className="dash-card report-item-card">
          <div className="report-icon-box">👥</div>
          <h3>Dữ liệu Nhân sự (Hiệp)</h3>
          <p>Danh sách chi tiết hồ sơ nhân viên, chức vụ, phòng ban định dạng CSV.</p>
          <button className="p-btn p-btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
             Tải CSV
          </button>
        </div>

        <div className="dash-card report-item-card">
          <div className="report-icon-box" style={{ color: '#e67e22', backgroundColor: '#fff7ed' }}>📅</div>
          <h3>Dữ liệu Chấm công (Sêu)</h3>
          <p>Báo cáo giờ Check-in/Check-out, số ngày nghỉ phép trong tháng này.</p>
          <button className="p-btn p-btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
             Tải CSV
          </button>
        </div>

        <div className="dash-card report-item-card">
          <div className="report-icon-box" style={{ color: '#059669', backgroundColor: '#ecfdf5' }}>💰</div>
          <h3>Báo cáo Tiền lương (Vỹ)</h3>
          <p>Bảng lương chi tiết bao gồm lương cơ bản, phụ cấp và các khoản trừ.</p>
          <button className="p-btn p-btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
             Tải CSV
          </button>
        </div>
      </div>

      <div className="dash-card">
        <h3 className="card-title">Lịch sử xuất báo cáo</h3>
        <table className="p-table">
          <thead>
            <tr>
              <th>Loại báo cáo</th>
              <th>Người xuất</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bảng lương tổng Tháng 3/2026</td>
              <td>Nguyễn Ngọc Tài (Admin)</td>
              <td>30/03/2026 14:30</td>
              <td><span className="status-badge status-success">Thành công</span></td>
            </tr>
            <tr>
              <td>Danh sách nhân viên IT</td>
              <td>Nguyễn Ngọc Tài (Admin)</td>
              <td>28/03/2026 09:15</td>
              <td><span className="status-badge status-success">Thành công</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;