import React, { useState } from 'react';
import './Admin.css';

function Profile() {
  // Trạng thái lưu thông tin cá nhân của Admin
  const [profile, setProfile] = useState({
    fullName: 'Nguyễn Ngọc Tài',
    email: 'tai108742@donga.edu.vn',
    phone: '0912000001',
    role: 'System Admin',
    department: 'Phòng IT',
    joinDate: '15/01/2023'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    alert('✅ Đã cập nhật hồ sơ thành công!');
  };

  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2>Hồ sơ Quản trị viên</h2>
        <p>Quản lý thông tin cá nhân và tài khoản của bạn</p>
      </div>

      <div className="dash-card" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* Cột trái: Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', minWidth: '200px' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 'bold' }}>
            NT
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{profile.fullName}</h3>
            <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
              {profile.role}
            </span>
          </div>
        </div>

        {/* Cột phải: Form thông tin */}
        <div style={{ flex: 1, width: '100%' }}>
          <div className="grid-2" style={{ gap: '20px' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontSize: '14px' }}>Họ và tên</label>
              <input type="text" value={profile.fullName} disabled={!isEditing} 
                     onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                     style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontSize: '14px' }}>Email</label>
              <input type="email" value={profile.email} disabled={!isEditing}
                     onChange={(e) => setProfile({...profile, email: e.target.value})}
                     style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontSize: '14px' }}>Số điện thoại</label>
              <input type="text" value={profile.phone} disabled={!isEditing}
                     onChange={(e) => setProfile({...profile, phone: e.target.value})}
                     style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontSize: '14px' }}>Phòng ban</label>
              <input type="text" value={profile.department} disabled style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9' }} />
            </div>
          </div>

          <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            {isEditing ? (
              <>
                <button className="p-btn p-btn-outline" onClick={() => setIsEditing(false)}>Hủy</button>
                <button className="p-btn p-btn-primary" onClick={handleSave}>💾 Lưu thay đổi</button>
              </>
            ) : (
              <button className="p-btn p-btn-primary" onClick={() => setIsEditing(true)}>✏️ Chỉnh sửa hồ sơ</button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;