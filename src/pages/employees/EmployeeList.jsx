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

  if (loading) return <div className="layout-container"><div className="empty-state">⏳ Đang tải...</div></div>;

  return (
    <div className="layout-container">
      <div className="dashboard-full-width">
        
        {/* HEADER & SEARCH DÀN HÀNG NGANG */}
        <header className="page-header-flex">
          <div className="header-title">
            <h1>Nhân sự</h1>
            <p>Quản lý <span className="highlight-count">{employees.length}</span> nhân viên trong hệ thống</p>
          </div>
          
          <div className="header-actions">
            <div className="search-box-container">
              <input 
                type="text" 
                placeholder="Tìm tên, mã NV..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link to="/employees/new" className="p-btn p-btn-primary">+ Thêm mới</Link>
          </div>
        </header>

        {/* STATS DÀN ĐỀU 4 CỘT */}
        <div className="stats-grid">
          <div className="dash-card stat-card">
            <span className="stat-label">Tổng nhân viên</span>
            <span className="stat-value">{employees.length}</span>
          </div>
          <div className="dash-card stat-card">
            <span className="stat-label">Đang hiển thị</span>
            <span className="stat-value">{filtered.length}</span>
          </div>
          <div className="dash-card stat-card">
            <span className="stat-label">Phòng ban</span>
            <span className="stat-value">{[...new Set(employees.map(e => e.department))].length}</span>
          </div>
          <div className="dash-card stat-card">
            <span className="stat-label">Cập nhật lúc</span>
            <span className="stat-value" style={{fontSize: '16px'}}>{new Date().toLocaleTimeString('vi-VN')}</span>
          </div>
        </div>

        {/* TABLE DÀN FULL MÀN HÌNH */}
        <div className="dash-card main-table-card">
          <div className="table-responsive">
            <table>
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
                      <div className="emp-info-cell">
                        <div className="avatar-circle">{emp.fullName?.charAt(0)}</div>
                        <div>
                          <div className="emp-name">{emp.fullName}</div>
                          <div className="emp-id-tag">{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <span>{emp.email}</span>
                        <small>{emp.phone}</small>
                      </div>
                    </td>
                    <td><span className="dept-badge">{emp.department}</span></td>
                    <td className="pos-text">{emp.position}</td>
                    <td style={{textAlign: 'center'}}>
                      <div className="action-btns">
                        <Link to={`/employees/${emp.id}`} className="act-view">Xem</Link>
                        <Link to={`/employees/edit/${emp.id}`} className="act-edit">Sửa</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeList;