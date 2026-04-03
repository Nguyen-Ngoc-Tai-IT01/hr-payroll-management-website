import React from 'react';
import './Admin.css';

function Profile() {
  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2>Hồ sơ Quản trị viên</h2>
        <p>Hồ sơ cá nhân và thông tin tài khoản của bạn trên hệ thống</p>
      </div>

      <div className="grid-2">
        {/* Cột trái: Thẻ thông tin nhanh */}
        <div className="dash-card profile-card-left">
          <div className="avatar-large">NT</div>
          <h2 style={{ fontSize: '22px', margin: '0 0 5px' }}>Nguyễn Ngọc Tài</h2>
          <p style={{ margin: '0 0 15px', color: '#64748b' }}> tai108742@donga.edu.vn </p>
          <span className="p-tag"> Quản trị viên hệ thống (SA)</span>
          <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #edf2f9' }} />
          
          <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' }}>
            <span>Phòng ban:</span> <strong>Lớp IT24B - Trưởng nhóm</strong>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span>Quyền hạn:</span> <strong style={{ color: '#059669' }}>Tất cả các quyền</strong>
          </p>
          <button type="button" className="p-btn p-btn-primary" style={{ marginTop: '24px', width: '100%' }}> Đổi ảnh đại diện </button>
        </div>

        {/* Cột phải: Form cập nhật */}
        <div className="dash-card">
          <h3 className="card-title">Cập nhật thông tin</h3>
          <form>
            <div className="grid-2">
              <div className="p-form-group">
                <label>Họ và tên</label>
                <input type="text" className="p-input" defaultValue="Nguyễn Ngọc Tài" placeholder="Nhập họ và tên..." />
              </div>
              <div className="p-form-group">
                <label>Email liên hệ</label>
                <input type="email" className="p-input" defaultValue="admin.tai@company.com" placeholder="Email công việc..." />
              </div>
              <div className="p-form-group">
                <label>Tên đăng nhập (Username)</label>
                <input type="text" className="p-input" value="admin_tai" readOnly />
              </div>
              <div className="p-form-group">
                <label>Số điện thoại</label>
                <input type="text" className="p-input" defaultValue="0912 345 678" placeholder="0912..." />
              </div>
            </div>
            
            <div className="p-form-group" style={{ marginTop: '10px' }}>
              <label>Đổi mật khẩu (Bỏ trống nếu không muốn đổi)</label>
              <input type="password" className="p-input" placeholder="Mật khẩu mới..." />
            </div>

            <button type="button" className="p-btn p-btn-success" style={{ marginTop: '10px' }}> Lưu thay đổi </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;