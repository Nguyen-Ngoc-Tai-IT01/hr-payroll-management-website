import React from 'react';
import Swal from 'sweetalert2';
import './Admin.css';

function Reports() {

  // hàm thông báo chấm công của sêu
  const handleExportAttendance = async () => {
    try {
      // Hiện thông báo đang xử lý
      Swal.fire({
        title: 'Đang tạo báo cáo...',
        text: 'Vui lòng chờ trong giây lát',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });

      // Lấy dữ liệu từ Backend
      const [attRes, empRes] = await Promise.all([
        fetch('http://localhost:5000/api/attendance'),
        fetch('http://localhost:5000/api/employees')
      ]);

      if (!attRes.ok || !empRes.ok) throw new Error("Lỗi API");

      const attData = await attRes.json();
      const empData = await empRes.json();

      // Tiêu đề cột
      const headers = ["Mã NV", "Họ và Tên", "Công thực", "Đi muộn", "Tăng ca"];
      
      // Xử lý dữ liệu từng dòng
      const rows = attData.map(rec => {
        // Tìm tên nhân viên
        let name = rec.fullName;
        if (!name) {
          const emp = empData.find(e => String(e.id) === String(rec.employeeId));
          name = emp ? emp.fullName : `NV-${rec.employeeId}`;
        }

        return [
          rec.employeeId, 
          name, 
          `${rec.actualDays} ngày`, 
          `${rec.lateCount} lần`, 
          `${rec.overtimeHours} giờ`
        ];
      });

      // Gộp thành chuẩn CSV
      const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
      
      // Tạo file và tự động tải về
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Bao_cao_Cham_cong_Seu.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Thông báo thành công
      Swal.fire({ icon: 'success', title: 'Hoàn tất!', text: 'Đã tải xuống báo cáo Chấm công', timer: 2000, showConfirmButton: false });

    } catch (err) {
      console.error(err);
      Swal.fire('Lỗi!', 'Không thể tải báo cáo. Hãy kiểm tra lại Server!', 'error');
    }
  };

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
          <button className="p-btn p-btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
             Tải CSV
          </button>
        </div>

        {/* card chấm công của sêu đã gắn sự kiện onClick */}
        <div className="dash-card report-item-card">
          <div className="report-icon-box" style={{ color: '#e67e22', backgroundColor: '#fff7ed' }}>📅</div>
          <h3>Dữ liệu Chấm công (Sêu)</h3>
          <p>Báo cáo giờ Check-in/Check-out, số ngày nghỉ phép trong tháng này.</p>
          <button 
            onClick={handleExportAttendance} 
            className="p-btn p-btn-outline" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', backgroundColor: '#e67e22', color: 'white', border: 'none' }}
          >
             Tải CSV
          </button>
        </div>

        <div className="dash-card report-item-card">
          <div className="report-icon-box" style={{ color: '#059669', backgroundColor: '#ecfdf5' }}>💰</div>
          <h3>Báo cáo Tiền lương (Vỹ)</h3>
          <p>Bảng lương chi tiết bao gồm lương cơ bản, phụ cấp và các khoản trừ.</p>
          <button className="p-btn p-btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
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