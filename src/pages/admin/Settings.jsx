import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Tận dụng luôn thư viện của Sêu!
import './Admin.css';

function Settings() {
  // Bổ sung thêm các cài đặt chuẩn Doanh nghiệp
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    maintenanceMode: false,
    sessionTimeout: true, // Tự động đăng xuất sau 30p
    notifications: true,
    autoBackup: true,
    darkMode: false, // Giao diện tối
  });

  const [isSaving, setIsSaving] = useState(false);

  // Hàm xử lý gạt công tắc thông minh
  const toggleSetting = (key) => {
    // Riêng Chế độ bảo trì là tính năng nguy hiểm -> Cần cảnh báo
    if (key === 'maintenanceMode' && !settings.maintenanceMode) {
      Swal.fire({
        title: 'Cảnh báo nguy hiểm!',
        text: "Bật chế độ bảo trì sẽ lập tức đăng xuất toàn bộ nhân viên (Tuyến, Hiệp, Sêu, Vỹ). Bạn có chắc chắn?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Vẫn bật!',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          setSettings({ ...settings, [key]: true });
          Swal.fire('Đã bật!', 'Hệ thống đang trong chế độ bảo trì.', 'success');
        }
      });
      return; // Dừng lại, không tự động gạt nút
    }

    // Các nút khác gạt bình thường
    setSettings({ ...settings, [key]: !settings[key] });
  };

  // Nút Lưu cấu hình
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Giả lập thời gian gửi API lên Backend mất 1.5 giây
    setTimeout(() => {
      setIsSaving(false);
      Swal.fire({
        title: 'Thành công!',
        text: 'Toàn bộ cấu hình hệ thống đã được lưu trữ an toàn.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        timer: 2000
      });
    }, 1500);
  };

  // Component Nút Toggle Switch siêu mượt
  const ToggleSwitch = ({ checked, onChange, disabled }) => (
    <div 
      onClick={disabled ? null : onChange}
      style={{
        width: '46px', height: '26px', 
        backgroundColor: checked ? '#10b981' : '#cbd5e1',
        borderRadius: '15px', position: 'relative', 
        cursor: disabled ? 'not-allowed' : 'pointer', 
        transition: 'background-color 0.3s',
        opacity: disabled ? 0.6 : 1
      }}
    >
      <div style={{
        width: '22px', height: '22px', backgroundColor: 'white', borderRadius: '50%',
        position: 'absolute', top: '2px', left: checked ? '22px' : '2px', 
        transition: 'left 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Hiệu ứng nảy (bounce)
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}/>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2>Thiết lập Hệ thống</h2>
          <p>Bảng điều khiển trung tâm dành riêng cho System Admin</p>
        </div>
        <button 
          className="p-btn p-btn-primary" 
          onClick={handleSaveSettings}
          disabled={isSaving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '15px' }}
        >
          {isSaving ? '⏳ Đang lưu...' : '💾 Lưu cấu hình'}
        </button>
      </div>

      <div className="grid-2" style={{ gap: '25px', marginTop: '20px' }}>
        
        {/* Cột 1: Bảo mật & Quyền truy cập */}
        <div className="dash-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '10px' }}>
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <h3 className="card-title" style={{ margin: 0 }}>Bảo mật & Truy cập</h3>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>Xác thực 2 lớp (2FA)</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Bắt buộc nhập mã OTP qua Email khi đăng nhập</p>
            </div>
            <ToggleSwitch checked={settings.twoFactorAuth} onChange={() => toggleSetting('twoFactorAuth')} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderTop: '1px dashed #e2e8f0' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>Tự động khóa phiên</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Đăng xuất nếu không thao tác trong 30 phút</p>
            </div>
            <ToggleSwitch checked={settings.sessionTimeout} onChange={() => toggleSetting('sessionTimeout')} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderTop: '1px dashed #e2e8f0', backgroundColor: settings.maintenanceMode ? '#fef2f2' : 'transparent', borderRadius: '8px', transition: 'all 0.3s' }}>
            <div style={{ paddingLeft: '10px' }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', color: settings.maintenanceMode ? '#dc2626' : 'inherit' }}>Chế độ Bảo trì (Danger)</h4>
              <p style={{ margin: 0, fontSize: '13px', color: settings.maintenanceMode ? '#ef4444' : '#64748b' }}>Tạm dừng hệ thống để cập nhật API</p>
            </div>
            <div style={{ paddingRight: '10px' }}>
              <ToggleSwitch checked={settings.maintenanceMode} onChange={() => toggleSetting('maintenanceMode')} />
            </div>
          </div>
        </div>

        {/* Cột 2: Vận hành & Giao diện */}
        <div className="dash-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '10px' }}>
            <span style={{ fontSize: '20px' }}>⚙️</span>
            <h3 className="card-title" style={{ margin: 0 }}>Vận hành & Cá nhân hóa</h3>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>Nhận thông báo hệ thống</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Nhận báo cáo lỗi máy chủ qua Email của Tài</p>
            </div>
            <ToggleSwitch checked={settings.notifications} onChange={() => toggleSetting('notifications')} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderTop: '1px dashed #e2e8f0' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>Auto Backup Database</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Sao lưu dữ liệu nhân sự vào lúc 02:00 sáng</p>
            </div>
            <ToggleSwitch checked={settings.autoBackup} onChange={() => toggleSetting('autoBackup')} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderTop: '1px dashed #e2e8f0' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>Giao diện Tối (Dark Mode)</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Bảo vệ mắt khi làm việc vào ban đêm</p>
            </div>
            <ToggleSwitch checked={settings.darkMode} onChange={() => toggleSetting('darkMode')} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;