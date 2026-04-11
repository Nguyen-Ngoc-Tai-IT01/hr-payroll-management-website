import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function Profile() {
  // 1. TỰ ĐỘNG LẤY THÔNG TIN NGƯỜI DÙNG ĐANG ĐĂNG NHẬP
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // 2. KHỞI TẠO STATE HỒ SƠ TỪ DỮ LIỆU ĐĂNG NHẬP (Kèm dữ liệu dự phòng nếu thiếu)
  const [profile, setProfile] = useState({
    id: currentUser.id || 'ADMIN-001',
    fullName: currentUser.fullName || 'Quản trị viên',
    email: currentUser.email || 'admin@it24b.vn',
    phone: currentUser.phone || '0909 123 456',
    department: currentUser.department || 'Ban Giám Đốc',
    role: currentUser.role || 'System Admin',
    // Lấy chữ cái đầu của tên làm Avatar
    avatar: currentUser.fullName ? currentUser.fullName.split(' ').pop().charAt(0).toUpperCase() : 'A',
    color: '#3b82f6' // Màu mặc định cho Avatar
  });

  const [isEditing, setIsEditing] = useState(false);

  // 3. HÀM XỬ LÝ LƯU THÔNG TIN THỰC TẾ
  const handleSave = () => {
    setIsEditing(false);
    
    // Cập nhật lại dữ liệu mới vào LocalStorage để các trang khác (như Header) cũng tự động cập nhật theo
    const updatedUser = { ...currentUser, ...profile };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    // Kích hoạt sự kiện để báo cho Header biết user đã thay đổi thông tin (đổi tên chẳng hạn)
    window.dispatchEvent(new Event("userChanged"));

    Swal.fire({
      icon: 'success',
      title: 'Tuyệt vời!',
      text: `Hồ sơ cá nhân của bạn đã được cập nhật thành công.`,
      timer: 2000,
      showConfirmButton: false
    });
  };

  return (
    <div style={{ padding: '40px 30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Tiêu đề trang */}
      <div style={{ marginBottom: '30px', backgroundColor: 'white', padding: '25px 30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        <h2 style={{ fontSize: '28px', color: '#1e293b', fontWeight: '800', margin: '0 0 8px 0' }}>Hồ sơ Cá nhân 👤</h2>
        <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Quản lý và cập nhật thông tin tài khoản làm việc của bạn.</p>
      </div>

      <div className="profile-layout" style={{ justifyContent: 'center' }}>
        
        {/* THẺ HIỂN THỊ CHI TIẾT HỒ SƠ (Đã được căn giữa và phóng to) */}
        <div className="profile-main-card" style={{ maxWidth: '800px', width: '100%' }}>
          
          {/* Cover Photo */}
          <div className="profile-cover">
             <div className="profile-avatar-large" style={{ backgroundColor: profile.color }}>
               {profile.avatar}
             </div>
          </div>
          
          {/* Tên và Chức vụ */}
          <div className="profile-header-info">
            <h3 style={{ margin: '0 0 5px 0', fontSize: '24px', color: '#0f172a', fontWeight: '800' }}>
              {profile.fullName}
            </h3>
            <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', border: '1px solid #e2e8f0' }}>
              {profile.role}
            </span>
          </div>

          {/* Form thông tin cá nhân */}
          <div className="profile-form">
            <div className="form-grid">
              
              <div className="input-group">
                <label>Mã Định Danh (ID)</label>
                {/* ID thường không được phép tự sửa */}
                <input type="text" value={profile.id} disabled className="input-disabled" />
              </div>
              
              <div className="input-group">
                <label>Phòng ban trực thuộc</label>
                {/* Phòng ban cũng do HR quyết định, không cho tự sửa */}
                <input type="text" value={profile.department} disabled className="input-disabled" />
              </div>

              <div className="input-group">
                <label>Họ và tên đầy đủ</label>
                <input 
                  type="text" 
                  value={profile.fullName} 
                  disabled={!isEditing} 
                  onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                  className={isEditing ? "input-active" : "input-disabled"}
                />
              </div>

              <div className="input-group">
                <label>Số điện thoại liên hệ</label>
                <input 
                  type="text" 
                  value={profile.phone} 
                  disabled={!isEditing} 
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className={isEditing ? "input-active" : "input-disabled"}
                />
              </div>

              <div className="input-group full-width">
                <label>Địa chỉ Email</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  disabled={!isEditing} 
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className={isEditing ? "input-active" : "input-disabled"}
                />
              </div>

            </div>

            {/* Các nút hành động */}
            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button className="btn-cancel" onClick={() => setIsEditing(false)}>Hủy bỏ</button>
                  <button className="btn-save" onClick={handleSave}>💾 Lưu thông tin</button>
                </>
              ) : (
                <button className="btn-edit" onClick={() => setIsEditing(true)}>✏️ Chỉnh sửa hồ sơ</button>
              )}
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}

export default Profile;