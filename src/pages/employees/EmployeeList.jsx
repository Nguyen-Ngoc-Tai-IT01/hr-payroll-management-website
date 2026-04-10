import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/backend/data/employees.json')
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi load dữ liệu:", err);
        setLoading(false);
      });
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp =>
      emp.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase()) ||
      emp.department?.toLowerCase().includes(search.toLowerCase()) ||
      emp.position?.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  if (loading) {
    return (
      <div className="layout-container">
        <div className="dashboard-wrapper" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <p className="text-muted">Đang tải danh sách nhân viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-container">
      <div className="dashboard-wrapper">
        {/* Header Section */}
        <div className="page-header">
          <div>
            <h1>Danh sách Nhân viên</h1>
            <p>
              Quản lý thông tin nhân sự • <span className="highlight-count">{employees.length}</span> người
            </p>
          </div>
          <Link to="/employees/new" className="p-btn p-btn-primary">
            <span>+</span> Thêm nhân viên mới
          </Link>
        </div>

        {/* Search Section */}
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên, email, phòng ban, chức vụ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table Card */}
        <div className="dash-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>Mã NV</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>SĐT</th>
                  <th style={{ width: '180px' }}>Phòng ban</th>
                  <th>Chức vụ</th>
                  <th style={{ width: '150px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id}>
                      <td className="emp-id">{emp.id}</td>
                      <td className="emp-name">{emp.fullName}</td>
                      <td className="text-muted">{emp.email}</td>
                      <td className="text-muted">{emp.phone}</td>
                      <td>
                        <span className="department-tag">{emp.department}</span>
                      </td>
                      <td>{emp.position}</td>
                      <td>
                        <div className="action-group">
                          <Link to={`/employees/${emp.id}`} className="action-link link-view">Xem</Link>
                          <Link to={`/employees/edit/${emp.id}`} className="action-link link-edit">Sửa</Link>
                          <button 
                            onClick={() => alert(`Xóa nhân viên ${emp.fullName}`)}
                            className="action-link link-delete"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      Không tìm thấy nhân viên phù hợp với từ khóa "<b>{search}</b>"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        {filteredEmployees.length > 0 && (
          <div className="table-footer">
            Hiển thị {filteredEmployees.length} / {employees.length} nhân viên
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;