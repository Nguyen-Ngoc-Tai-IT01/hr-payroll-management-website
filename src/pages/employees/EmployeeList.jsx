import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './style.css'; 

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const paths = ['/data/employees.json', '/backend/data/employees.json'];
      for (const path of paths) {
        try {
          const res = await fetch(path);
          if (res.ok) {
            const data = await res.json();
            setEmployees(data);
            setLoading(false);
            return;
          }
        } catch (e) { console.error("Lỗi tải dữ liệu"); }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return employees.filter(e => 
      e.fullName?.toLowerCase().includes(s) || e.id?.toLowerCase().includes(s)
    );
  }, [employees, search]);

  if (loading) return <div className="emp-layout"><div className="emp-empty-state">⏳ Đang tải dữ liệu nhân sự...</div></div>;

  return (
    <div className="emp-layout">
      <div className="emp-container">
        
        {/* HEADER & SEARCH DÀN HÀNG NGANG */}
        <header className="emp-header">
          <div className="emp-header-title">
            <h1>Quản lý Nhân sự 👥</h1>
            <p>Hệ thống đang quản lý <span className="emp-highlight">{employees.length}</span> nhân viên</p>
          </div>
          
          <div className="emp-header-actions">
            <div className="emp-search-box">
              <span className="emp-search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Tìm tên, mã NV..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link to="/employees/new" className="emp-btn-add">
              <span style={{ fontSize: '18px', marginRight: '4px' }}>+</span> Thêm mới
            </Link>
          </div>
        </header>

        {/* STATS DÀN ĐỀU 4 CỘT */}
        <div className="emp-stats-grid">
          <div className="emp-stat-card">
            <span className="emp-stat-label">Tổng nhân viên</span>
            <span className="emp-stat-value">{employees.length}</span>
          </div>
          <div className="emp-stat-card">
            <span className="emp-stat-label">Đang hiển thị</span>
            <span className="emp-stat-value text-blue">{filtered.length}</span>
          </div>
          <div className="emp-stat-card">
            <span className="emp-stat-label">Phòng ban</span>
            <span className="emp-stat-value text-purple">{[...new Set(employees.map(e => e.department))].length}</span>
          </div>
          <div className="emp-stat-card">
            <span className="emp-stat-label">Cập nhật lúc</span>
            <span className="emp-stat-value text-small">{new Date().toLocaleTimeString('vi-VN')}</span>
          </div>
        </div>

        {/* TABLE DÀN FULL MÀN HÌNH */}
        <div className="emp-table-card">
          <div className="emp-table-responsive">
            <table className="emp-table">
              <thead>
                <tr>
                  <th width="30%">Nhân viên</th>
                  <th width="25%">Liên hệ</th>
                  <th width="20%">Phòng ban</th>
                  <th width="15%">Chức vụ</th>
                  <th width="10%" style={{textAlign: 'center'}}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="emp-user-info">
                        <div className="emp-avatar">{emp.fullName?.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="emp-name">{emp.fullName}</div>
                          <div className="emp-id">{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="emp-contact">
                        <span className="emp-email">📧 {emp.email}</span>
                        <span className="emp-phone">📞 {emp.phone}</span>
                      </div>
                    </td>
                    <td><span className="emp-badge-dept">{emp.department}</span></td>
                    <td className="emp-position">{emp.position}</td>
                    <td style={{textAlign: 'center'}}>
                      <div className="emp-actions">
                        <Link to={`/employees/${emp.id}`} className="emp-btn-view">Xem</Link>
                        <Link to={`/employees/edit/${emp.id}`} className="emp-btn-edit">Sửa</Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="emp-no-data">Không tìm thấy nhân viên nào phù hợp với từ khóa "{search}".</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeList;