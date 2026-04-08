import React, { useState } from 'react';
import './Admin.css';

function Settings() {
  // Quản lý trạng thái các công tắc
  const [settings, setSettings] = useState({
    notifications: true,
    twoFactorAuth: false,
    autoBackup: true,
    maintenanceMode: false
  });

  // Hàm xử lý khi gạt công tắc
  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  // Nút Toggle Switch tự chế (Giao diện cực đẹp)
  const ToggleSwitch = ({ checked, onChange }) => (
    <div 
      onClick={onChange}
      style={{
        width: '44px', height: '24px', backgroundColor: checked ? '#10b981' : '#cbd5e1',
        borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
      }}
    >
      <div style={{
        width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%',
        position: 'absolute', top: '2px', left: checked ? '22px' : '2px', transition: 'all 0.3s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
      }}/>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2>Cài đặt Hệ thống</h2>
        <p>Cấu hình các tham số bảo mật và vận hành cho toàn hệ thống</p>
      </div>

      <div className="grid-2" style={{ gap: '25px' }}>
        
        {/* Cột 1: Cài đặt Bảo mật */}
        <div className="dash-card">
          <h3 className="card-title" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Bảo mật & Phân quyền</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>Xác thực 2 lớp (2FA)</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Yêu cầu nhập mã OTP khi đăng nhập</p>
            </div>
            <ToggleSwitch checked={settings.twoFactorAuth} onChange={() => toggleSetting('twoFactorAuth')} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderTop: '1px dashed #e2e8f0' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>Chế độ Bảo trì</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Tạm khóa hệ thống đối với nhân viên</p>
            </div>
            <ToggleSwitch checked={settings.maintenanceMode} onChange={() => toggleSetting('maintenanceMode')} />
          </div>
        </div>

        {/* Cột 2: Cài đặt Hệ thống */}
        <div className="dash-card">
          <h3 className="card-title" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Vận hành Hệ thống</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>Thông báo qua Email</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Gửi mail khi có báo cáo lương mới</p>
            </div>
            <ToggleSwitch checked={settings.notifications} onChange={() => toggleSetting('notifications')} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderTop: '1px dashed #e2e8f0' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>Tự động sao lưu (Auto Backup)</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Sao lưu Database vào lúc 00:00 mỗi ngày</p>
            </div>
            <ToggleSwitch checked={settings.autoBackup} onChange={() => toggleSetting('autoBackup')} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;