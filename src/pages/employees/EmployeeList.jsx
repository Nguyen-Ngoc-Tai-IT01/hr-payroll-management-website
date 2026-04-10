import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Gọi API lấy danh sách nhân viên
  const loadEmployees = () => {
    fetch('http://localhost:5000/api/employees')
      .then(res => res.json())
      .then(data => {
        // Tùy theo cấu trúc JSON backend trả về
        setEmployees(data.data || data.list || data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi lấy dữ liệu nhân viên:", err);
        Swal.fire('Lỗi Server', 'Không thể kết nối đến Backend', 'error');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Xóa nhân viên
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Xóa nhân viên?',
      text: "Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Vâng, xóa ngay!',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        // Gọi API xóa (Cần Backend hỗ trợ phương thức DELETE)
        fetch(`http://localhost:5000/api/employees/${id}`, { method: 'DELETE' })
          .then(res => {
            if (res.ok) {
              Swal.fire('Đã xóa!', 'Hồ sơ nhân viên đã bị xóa.', 'success');
              loadEmployees(); // Tải lại danh sách
            } else {
              throw new Error('Xóa thất bại');
            }
          })
          .catch(() => Swal.fire('Lỗi', 'Không thể xóa nhân viên này', 'error'));
      }
    });
  };

  // Lọc dữ liệu tìm kiếm
  const filteredEmployees = employees.filter(emp => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (emp.fullName && emp.fullName.toLowerCase().includes(searchLower)) ||
      (emp.id && emp.id.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>👥 Quản lý Nhân sự</h2>
        <button className="p-btn p-btn-primary" onClick={() => Swal.fire('Tính năng', 'Form Thêm nhân viên đang được phát triển', 'info')}>
          + Thêm nhân viên mới
        </button>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        
        {/* Thanh tìm kiếm */}
        <div style={{ marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="🔍 Tìm kiếm theo Mã NV hoặc Tên..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', maxWidth: '400px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        </div>

        {/* Bảng dữ liệu */}
        {loading ? (
          <h3 style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>⏳ Đang tải dữ liệu...</h3>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px', color: '#475569' }}>Mã NV</th>
                  <th style={{ padding: '12px', color: '#475569' }}>Họ và Tên</th>
                  <th style={{ padding: '12px', color: '#475569' }}>Phòng ban</th>
                  <th style={{ padding: '12px', color: '#475569' }}>Chức vụ</th>
                  <th style={{ padding: '12px', color: '#475569', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map(emp => (
                    <tr key={emp.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{emp.id}</td>
                      <td style={{ padding: '12px', color: '#0f172a', fontWeight: '500' }}>{emp.fullName}</td>
                      <td style={{ padding: '12px' }}>{emp.department}</td>
                      <td style={{ padding: '12px' }}>{emp.role || 'Nhân viên'}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <Link to={`/employees/${emp.id}`} className="p-btn p-btn-primary" style={{ padding: '6px 12px', fontSize: '12px', marginRight: '5px' }}>
                          Xem
                        </Link>
                        <button onClick={() => handleDelete(emp.id)} className="p-btn p-btn-outline" style={{ padding: '6px 12px', fontSize: '12px', borderColor: '#dc2626', color: '#dc2626' }}>
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Không tìm thấy nhân viên nào!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeList;