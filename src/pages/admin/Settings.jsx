import React, { useState } from 'react';
import Swal from 'sweetalert2';

function Settings() {
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    maintenanceMode: false,
    sessionTimeout: true,
    notifications: true,
    autoBackup: true,
    darkMode: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const toggleSetting = (key) => {
    if (key === 'maintenanceMode' && !settings.maintenanceMode) {
      Swal.fire({
        title: 'Cảnh báo nguy hiểm!',
        text: "Bật chế độ bảo trì sẽ lập tức đăng xuất toàn bộ nhân viên (Tuyến, Hiệp, Sêu, Vỹ). Bạn có chắc chắn?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Vẫn bật!',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          setSettings({ ...settings, [key]: true });
          Swal.fire('Đã bật!', 'Hệ thống đang trong chế độ bảo trì.', 'success');
        }
      });
      return;
    }
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
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

  const ToggleSwitch = ({ checked, onChange, disabled }) => (
    <div 
      onClick={disabled ? null : onChange}
      style={{
        width: '50px', height: '28px', 
        backgroundColor: checked ? '#10b981' : '#e2e8f0',
        borderRadius: '20px', position: 'relative', 
        cursor: disabled ? 'not-allowed' : 'pointer', 
        transition: 'background-color 0.3s ease',
        boxShadow: checked ? 'inset 0 2px 4px rgba(0,0,0,0.1)' : 'inset 0 2px 4px rgba(0,0,0,0.05)',
        opacity: disabled ? 0.6 : 1
      }}
    >
      <div style={{
        width: '22px', height: '22px', backgroundColor: 'white', borderRadius: '50%',
        position: 'absolute', top: '3px', left: checked ? '25px' : '3px', 
        transition: 'left 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}/>
    </div>
  );

  return (
    <div style={{ padding: '40px 30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Tiêu đề trang (Giống Header trang Reports) */}
      <div style={{ marginBottom: '40px', backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '28px', color: '#1e293b', fontWeight: '800', margin: '0 0 10px 0' }}>Cài đặt Hệ thống ⚙️</h2>
          <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Bảng điều khiển trung tâm dành riêng cho System Admin.</p>
        </div>
        <button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '10px', 
            padding: '12px 24px', fontSize: '15px', fontWeight: '700',
            backgroundColor: isSaving ? '#cbd5e1' : '#2563eb', color: 'white',
            border: 'none', borderRadius: '12px', cursor: isSaving ? 'wait' : 'pointer',
            boxShadow: isSaving ? 'none' : '0 6px 15px rgba(37, 99, 235, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          {isSaving ? '⏳ Đang lưu...' : '💾 Lưu cấu hình'}
        </button>
      </div>

      <div className="settings-grid">
        
        {/* Cột 1: Bảo mật & Quyền truy cập */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-box blue">🛡️</div>
            <h3 className="settings-card-title">Bảo mật & Truy cập</h3>
          </div>
          
          <div className="setting-item">
            <div>
              <h4 className="setting-name">Xác thực 2 lớp (2FA)</h4>
              <p className="setting-desc">Bắt buộc nhập mã OTP qua Email khi đăng nhập</p>
            </div>
            <ToggleSwitch checked={settings.twoFactorAuth} onChange={() => toggleSetting('twoFactorAuth')} />
          </div>

          <div className="setting-item">
            <div>
              <h4 className="setting-name">Tự động khóa phiên</h4>
              <p className="setting-desc">Đăng xuất nếu không thao tác trong 30 phút</p>
            </div>
            <ToggleSwitch checked={settings.sessionTimeout} onChange={() => toggleSetting('sessionTimeout')} />
          </div>

          <div className={`setting-item ${settings.maintenanceMode ? 'danger-active' : ''}`}>
            <div>
              <h4 className="setting-name" style={{ color: settings.maintenanceMode ? '#dc2626' : 'inherit' }}>Chế độ Bảo trì</h4>
              <p className="setting-desc" style={{ color: settings.maintenanceMode ? '#ef4444' : '#64748b' }}>Tạm dừng hệ thống để cập nhật API</p>
            </div>
            <ToggleSwitch checked={settings.maintenanceMode} onChange={() => toggleSetting('maintenanceMode')} />
          </div>
        </div>

        {/* Cột 2: Vận hành & Giao diện */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-box purple">🖥️</div>
            <h3 className="settings-card-title">Vận hành & Cá nhân hóa</h3>
          </div>
          
          <div className="setting-item">
            <div>
              <h4 className="setting-name">Nhận thông báo hệ thống</h4>
              <p className="setting-desc">Nhận báo cáo lỗi máy chủ qua Email của Admin</p>
            </div>
            <ToggleSwitch checked={settings.notifications} onChange={() => toggleSetting('notifications')} />
          </div>

          <div className="setting-item">
            <div>
              <h4 className="setting-name">Auto Backup Database</h4>
              <p className="setting-desc">Sao lưu dữ liệu nhân sự vào lúc 02:00 sáng mỗi ngày</p>
            </div>
            <ToggleSwitch checked={settings.autoBackup} onChange={() => toggleSetting('autoBackup')} />
          </div>

          <div className="setting-item">
            <div>
              <h4 className="setting-name">Giao diện Tối (Dark Mode)</h4>
              <p className="setting-desc">Bảo vệ mắt khi làm việc vào ban đêm</p>
            </div>
            <ToggleSwitch checked={settings.darkMode} onChange={() => toggleSetting('darkMode')} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;