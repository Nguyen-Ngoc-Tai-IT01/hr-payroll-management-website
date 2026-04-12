import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();

  // STATE NÀY LÀ BẢN NHÁP (Chỉ hiển thị nút gạt, chưa áp dụng thật)
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('appSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      twoFactorAuth: false,
      maintenanceMode: false,
      sessionTimeout: true,
      notifications: true,
      autoBackup: true,
      darkMode: false,
    };
  });

  const [isSaving, setIsSaving] = useState(false);

  // HÀM GẠT CÔNG TẮC (Chỉ thay đổi bản nháp, không gọi dark mode ở đây nữa)
  const toggleSetting = (key) => {
    if (key === 'maintenanceMode' && !settings.maintenanceMode) {
      Swal.fire({
        title: 'Cảnh báo nguy hiểm!',
        text: "Bật chế độ bảo trì sẽ lập tức đóng hệ thống. Toàn bộ nhân sự sẽ bị đăng xuất khi bạn ấn Lưu. Bạn chắc chắn chứ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Vẫn bật!',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          setSettings({ ...settings, [key]: true });
          Swal.fire('Đã bật!', 'Hãy nhớ ấn Lưu Cấu Hình để kích hoạt bảo trì.', 'info');
        }
      });
      return;
    }
    setSettings({ ...settings, [key]: !settings[key] });
  };

  // NÚT LƯU CẤU HÌNH (Áp dụng thật mọi thứ tại đây)
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      // 1. Lưu cấu hình vào bộ nhớ máy
      localStorage.setItem('appSettings', JSON.stringify(settings));
      setIsSaving(false);

      // 2. Kích hoạt Dark Mode TẠI ĐÂY (Chỉ khi đã bấm lưu)
      if (settings.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }

      // 3. Kích hoạt Chế độ bảo trì
      if (settings.maintenanceMode) {
        localStorage.removeItem('user'); 
        Swal.fire({
          title: 'Hệ thống Đóng!',
          text: 'Đã kích hoạt bảo trì. Đang đăng xuất...',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/login'); 
          window.location.reload(); 
        });
        return; 
      }

      // Thông báo lưu thành công bình thường
      Swal.fire({
        title: 'Thành công!',
        text: 'Toàn bộ cấu hình hệ thống đã được cập nhật và lưu trữ an toàn.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        timer: 2000
      });
    }, 1000);
  };

  // NÚT GẠT GIAO DIỆN
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
      
      <div style={{ marginBottom: '40px', backgroundColor: 'var(--card-bg, white)', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', transition: 'background-color 0.3s' }}>
        <div>
          <h2 style={{ fontSize: '28px', color: 'var(--text-main, #1e293b)', fontWeight: '800', margin: '0 0 10px 0' }}>Cài đặt Hệ thống ⚙️</h2>
          <p style={{ color: 'var(--text-muted, #64748b)', margin: 0, fontSize: '15px' }}>Bảng điều khiển trung tâm dành riêng cho System Admin.</p>
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
        <div className="settings-card" style={{ backgroundColor: 'var(--card-bg, white)' }}>
          <div className="settings-card-header">
            <div className="settings-icon-box blue">🛡️</div>
            <h3 className="settings-card-title" style={{ color: 'var(--text-main, #1e293b)' }}>Bảo mật & Truy cập</h3>
          </div>
          
          <div className="setting-item">
            <div>
              <h4 className="setting-name" style={{ color: 'var(--text-main, #334155)' }}>Xác thực 2 lớp (2FA)</h4>
              <p className="setting-desc" style={{ color: 'var(--text-muted, #64748b)' }}>Bắt buộc nhập mã OTP qua Email khi đăng nhập</p>
            </div>
            <ToggleSwitch checked={settings.twoFactorAuth} onChange={() => toggleSetting('twoFactorAuth')} />
          </div>

          <div className="setting-item">
            <div>
              <h4 className="setting-name" style={{ color: 'var(--text-main, #334155)' }}>Tự động khóa phiên</h4>
              <p className="setting-desc" style={{ color: 'var(--text-muted, #64748b)' }}>Đăng xuất nếu không thao tác trong 30 phút</p>
            </div>
            <ToggleSwitch checked={settings.sessionTimeout} onChange={() => toggleSetting('sessionTimeout')} />
          </div>

          <div className={`setting-item ${settings.maintenanceMode ? 'danger-active' : ''}`}>
            <div>
              <h4 className="setting-name" style={{ color: settings.maintenanceMode ? '#dc2626' : 'var(--text-main, inherit)' }}>Chế độ Bảo trì</h4>
              <p className="setting-desc" style={{ color: settings.maintenanceMode ? '#ef4444' : 'var(--text-muted, #64748b)' }}>Tạm dừng hệ thống để cập nhật API</p>
            </div>
            <ToggleSwitch checked={settings.maintenanceMode} onChange={() => toggleSetting('maintenanceMode')} />
          </div>
        </div>

        {/* Cột 2: Vận hành & Giao diện */}
        <div className="settings-card" style={{ backgroundColor: 'var(--card-bg, white)' }}>
          <div className="settings-card-header">
            <div className="settings-icon-box purple">🖥️</div>
            <h3 className="settings-card-title" style={{ color: 'var(--text-main, #1e293b)' }}>Vận hành & Cá nhân hóa</h3>
          </div>
          
          <div className="setting-item">
            <div>
              <h4 className="setting-name" style={{ color: 'var(--text-main, #334155)' }}>Nhận thông báo hệ thống</h4>
              <p className="setting-desc" style={{ color: 'var(--text-muted, #64748b)' }}>Nhận báo cáo lỗi máy chủ qua Email của Admin</p>
            </div>
            <ToggleSwitch checked={settings.notifications} onChange={() => toggleSetting('notifications')} />
          </div>

          <div className="setting-item">
            <div>
              <h4 className="setting-name" style={{ color: 'var(--text-main, #334155)' }}>Auto Backup Database</h4>
              <p className="setting-desc" style={{ color: 'var(--text-muted, #64748b)' }}>Sao lưu dữ liệu nhân sự vào lúc 02:00 sáng mỗi ngày</p>
            </div>
            <ToggleSwitch checked={settings.autoBackup} onChange={() => toggleSetting('autoBackup')} />
          </div>

          <div className="setting-item">
            <div>
              <h4 className="setting-name" style={{ color: 'var(--text-main, #334155)' }}>Giao diện Tối (Dark Mode)</h4>
              <p className="setting-desc" style={{ color: 'var(--text-muted, #64748b)' }}>Bảo vệ mắt khi làm việc vào ban đêm</p>
            </div>
            <ToggleSwitch checked={settings.darkMode} onChange={() => toggleSetting('darkMode')} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;