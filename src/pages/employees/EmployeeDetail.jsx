import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function EmployeeDetail() {
  // 1. Lấy ID nhân viên từ URL (Ví dụ: /employees/EMP001 -> id = EMP001)
  const { id } = useParams(); 
  
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Gọi API để lấy dữ liệu khi trang vừa load
  useEffect(() => {
    // Lưu ý: Hiệp cần đảm bảo Backend đã có API lấy nhân viên theo ID
    fetch(`http://localhost:5000/api/employees/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Không tìm thấy thông tin nhân viên này!');
        }
        return res.json();
      })
      .then(data => {
        // Tùy theo API trả về (có thể data nằm trong data.data hoặc trực tiếp)
        setEmployee(data.data || data);
        setLoading(false);
      })
      .catch(err => {
        // Fallback: Nếu API theo ID chưa có, thử lấy từ danh sách tổng
        fetch('http://localhost:5000/api/employees')
          .then(res => res.json())
          .then(allData => {
            const list = allData.data || allData.list || allData;
            const foundEmp = list.find(e => e.id === id);
            if (foundEmp) {
              setEmployee(foundEmp);
              setLoading(false);
            } else {
              setError('Không tìm thấy nhân viên trong hệ thống.');
              setLoading(false);
            }
          })
          .catch(() => {
            setError(err.message);
            setLoading(false);
          });
      });
  }, [id]);

  if (loading) return <h3 style={{ textAlign: 'center', marginTop: '50px', color: '#64748b' }}>⏳ Đang tải hồ sơ...</h3>;
  
  if (error) return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h3 style={{ color: '#dc2626' }}>❌ {error}</h3>
      <Link to="/employees" className="p-btn p-btn-outline" style={{ marginTop: '10px', display: 'inline-block' }}>
        &larr; Quay lại danh sách
      </Link>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#1e293b' }}>Hồ sơ Nhân viên</h2>
        <Link to="/employees" style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', color: '#475569', textDecoration: 'none', borderRadius: '6px', fontWeight: '600' }}>
          &larr; Trở về
        </Link>
      </div>

      {/* Thẻ hiển thị thông tin */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '30px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* Cột trái: Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', minWidth: '200px' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}>
            {/* Lấy chữ cái đầu của tên làm Avatar */}
            {employee.fullName ? employee.fullName.split(' ').pop().charAt(0) : 'NV'}
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'inline-block', backgroundColor: employee.status === 'Đang làm việc' ? '#dcfce7' : '#fee2e2', color: employee.status === 'Đang làm việc' ? '#16a34a' : '#dc2626', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
              {employee.status || 'Đang làm việc'}
            </span>
          </div>
        </div>

        {/* Cột phải: Chi tiết */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '24px', color: '#0f172a' }}>{employee.fullName}</h3>
          <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '15px' }}>{employee.role || 'Nhân viên'} - {employee.department}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', fontWeight: '600' }}>Mã Nhân Viên</p>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#1e293b' }}>{employee.id}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', fontWeight: '600' }}>Ngày gia nhập</p>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#1e293b' }}>{employee.joinDate || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', fontWeight: '600' }}>Email</p>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#1e293b' }}>{employee.email}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', fontWeight: '600' }}>Số điện thoại</p>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#1e293b' }}>{employee.phone || 'Chưa cập nhật'}</p>
            </div>
          </div>

          <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
            <button className="p-btn p-btn-primary" style={{ flex: 1 }}>✏️ Chỉnh sửa thông tin</button>
            <button className="p-btn p-btn-outline" style={{ flex: 1, borderColor: '#dc2626', color: '#dc2626' }}>🗑️ Xóa nhân viên</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default EmployeeDetail;