import React from 'react';
import './Admin.css';

function Settings() {
  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2>Cài đặt Hệ thống</h2>
        <p>Quản lý toàn diện cấu hình doanh nghiệp, luật nhân sự và phân quyền bảo mật</p>
      </div>

      <div className="grid-2">
        {/* === CỘT TRÁI === */}
        <div className="settings-left-col">
          
          {/* Block 1: Thông tin doanh nghiệp */}
          <div className="dash-card">
            <h3 className="card-title">🏢 Hồ sơ Doanh nghiệp</h3>
            <div className="p-form-group">
              <label>Tên công ty / Tổ chức</label>
              <input type="text" className="p-input" defaultValue="Công ty Cổ phần Công nghệ IT24B" />
            </div>
            <div className="grid-2">
              <div className="p-form-group">
                <label>Email hệ thống (Gửi thông báo)</label>
                <input type="email" className="p-input" defaultValue="noreply@it24b-hr.vn" />
              </div>
              <div className="p-form-group">
                <label>Hotline Hỗ trợ (Admin)</label>
                <input type="text" className="p-input" defaultValue="1900 1234" />
              </div>
            </div>
            <div className="p-form-group">
              <label>Mã số thuế</label>
              <input type="text" className="p-input" defaultValue="0401234567" />
            </div>
          </div>

          {/* Block 2: Khu vực & Giao diện */}
          <div className="dash-card">
            <h3 className="card-title">🌍 Khu vực & Hiển thị</h3>
            <div className="grid-2">
              <div className="p-form-group">
                <label>Ngôn ngữ mặc định</label>
                <select className="p-select">
                  <option>Tiếng Việt (Việt Nam)</option>
                  <option>English (United States)</option>
                </select>
              </div>
              <div className="p-form-group">
                <label>Đơn vị tiền tệ (Vỹ dùng tính lương)</label>
                <select className="p-select">
                  <option>VNĐ (Việt Nam Đồng)</option>
                  <option>USD (Đô la Mỹ)</option>
                </select>
              </div>
            </div>
            <div className="p-form-group">
              <label>Múi giờ hệ thống</label>
              <select className="p-select">
                <option>(GMT+07:00) Giờ Đông Dương (Hà Nội, TP.HCM)</option>
                <option>(GMT+00:00) Giờ Phối hợp Quốc tế (UTC)</option>
              </select>
            </div>
          </div>

        </div>

        {/* === CỘT PHẢI === */}
        <div className="settings-right-col">
          
          {/* Block 3: Cấu hình Nghiệp vụ (Nhân sự - Tiền lương) */}
          <div className="dash-card">
            <h3 className="card-title">⚙️ Luật Nhân sự & Tiền lương</h3>
            <div className="grid-2">
              <div className="p-form-group">
                <label>Ngày chốt công hàng tháng</label>
                <select className="p-select">
                  <option>Ngày cuối cùng của tháng</option>
                  <option>Ngày 25 hàng tháng</option>
                </select>
              </div>
              <div className="p-form-group">
                <label>Ngày thanh toán lương</label>
                <select className="p-select">
                  <option>Ngày 05 tháng tiếp theo</option>
                  <option>Ngày 10 tháng tiếp theo</option>
                </select>
              </div>
            </div>
            
            <div className="setting-panel" style={{ marginTop: '10px' }}>
              <div className="setting-info">
                <h4>Tự động duyệt phép năm</h4>
                <p>Hệ thống tự duyệt đơn nghỉ phép dưới 2 ngày (Module của Sêu)</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-panel">
              <div className="setting-info">
                <h4>Cảnh báo Quỹ lương</h4>
                <p>Báo động cho Admin khi tổng lương tháng vượt quá 1 tỷ VNĐ</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          {/* Block 4: Bảo mật Hệ thống */}
          <div className="dash-card">
            <h3 className="card-title">🛡️ Bảo mật Hệ thống</h3>
            
            <div className="setting-panel">
              <div className="setting-info">
                <h4>Xác thực 2 bước (2FA)</h4>
                <p>Bắt buộc toàn bộ nhân viên dùng mã OTP khi đăng nhập</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-panel">
              <div className="setting-info">
                <h4>Chế độ bảo trì (Maintenance)</h4>
                <p>Khóa tạm thời, chỉ Admin mới có quyền truy cập hệ thống</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
          </div>

        </div>
      </div>

      {/* === NÚT LƯU CÀI ĐẶT === */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '10px' }}>
        <button type="button" className="p-btn p-btn-outline">Khôi phục mặc định</button>
        <button type="button" className="p-btn p-btn-primary" style={{ padding: '12px 30px' }}>💾 Lưu toàn bộ Cài đặt</button>
      </div>

    </div>
  );
}

export default Settings;