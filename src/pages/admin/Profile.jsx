import React, { useState, useEffect } from 'react';
import './Admin.css';

function Profile() {
  // Dữ liệu của 5 thành viên trong nhóm (Chuẩn khớp với employees.json)
  const teamMembers = [
    { id: 'EMP001', fullName: 'Nguyễn Ngọc Tài', email: 'tai108742@donga.edu.vn', phone: '0912000001', role: 'System Admin (Báo cáo)', department: 'Phòng IT', avatar: 'NT' },
    { id: 'EMP005', fullName: 'Nguyễn Trọng Tuyến', email: 'tuyen.it@it24b.vn', phone: '0912000005', role: 'IT Helpdesk (Tổng quan)', department: 'Phòng IT', avatar: 'PT' },
    { id: 'EMP002', fullName: 'Huỳnh Công Hiệp', email: 'hiep.hr@it24b.vn', phone: '0912000002', role: 'Trưởng phòng (Nhân sự)', department: 'Phòng Nhân sự', avatar: 'NH' },
    { id: 'EMP003', fullName: 'Sêu', email: 'seu.admin@it24b.vn', phone: '0912000003', role: 'Chuyên viên (Chấm công)', department: 'Phòng Nhân sự', avatar: 'TS' },
    { id: 'EMP004', fullName: 'tăng Tấn Vỹ', email: 'vy.acc@it24b.vn', phone: '0912000004', role: 'Kế toán (Tiền lương)', department: 'Phòng Kế toán', avatar: 'LV' }
  ];

  // Trạng thái người đang được chọn xem (Mặc định là Tài - index 0)
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Trạng thái dữ liệu đang hiển thị trong Form
  const [profile, setProfile] = useState(teamMembers[0]);
  const [isEditing, setIsEditing] = useState(false);

  // Mỗi khi đổi tab chọn người khác, cập nhật lại form
  useEffect(() => {
    setProfile(teamMembers[selectedIndex]);
    setIsEditing(false); // Tắt chế độ sửa khi đổi người
  }, [selectedIndex]);

  const handleSave = () => {
    setIsEditing(false);
    alert(`✅ Đã cập nhật hồ sơ cho ${profile.fullName} thành công!`);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2>Hồ sơ Nhóm Phát triển</h2>
        <p>Thông tin tài khoản của các thành viên dự án IT24B</p>
      </div>

      {/* Thanh chọn thành viên (Tabs) */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {teamMembers.map((member, index) => (
          <button 
            key={member.id}
            onClick={() => setSelectedIndex(index)}
            style={{
              padding: '10px 20px',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s',
              backgroundColor: selectedIndex === index ? '#3b82f6' : '#e2e8f0',
              color: selectedIndex === index ? 'white' : '#475569',
              boxShadow: selectedIndex === index ? '0 4px 6px rgba(59, 130, 246, 0.3)' : 'none'
            }}
          >
            {member.avatar} - {member.fullName.split(' ').pop()}
          </button>
        ))}
      </div>

      {/* Khu vực hiển thị thông tin */}
      <div className="dash-card" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Cột trái: Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', minWidth: '200px', flex: '1 1 200px' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 'bold' }}>
            {profile.avatar}
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{profile.fullName}</h3>
            <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
              {profile.role}
            </span>
          </div>
        </div>

        {/* Cột phải: Form thông tin */}
        <div style={{ flex: '2 1 400px', width: '100%' }}>
          <div className="grid-2" style={{ gap: '20px' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontSize: '14px' }}>Mã Nhân viên</label>
              <input type="text" value={profile.id} disabled style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', fontWeight: 'bold' }} />
            </div>
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
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontSize: '14px' }}>Phòng ban trực thuộc</label>
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