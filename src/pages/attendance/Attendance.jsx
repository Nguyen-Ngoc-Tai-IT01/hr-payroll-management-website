import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Leaves from './Leaves'; 
import './Attendance.css'; 

const initialFormState = { 
  employeeId: '', fullName: '', month: '04/2026', 
  standardDays: 22, actualDays: 0, lateCount: 0, overtimeHours: 0 
};

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10); 
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    try {
      const [attRes, empRes] = await Promise.all([
        fetch('http://localhost:5000/api/attendance'),
        fetch('http://localhost:5000/api/employees')
      ]);
      const attData = await attRes.json();
      const empData = await empRes.json();
      setAttendanceRecords(attData); 
      setEmployees(empData);
    } catch (err) { 
      console.error("Lỗi:", err);
      Swal.fire('Lỗi!', 'Không thể tải dữ liệu!', 'error');
    }
  };

  const filteredRecords = attendanceRecords.filter(rec => 
    rec.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage) || 1;

  const renderName = (rec) => {
    if (rec.fullName) return rec.fullName;
    const emp = employees.find(e => e.id === rec.employeeId);
    return emp ? emp.fullName : `NV-${rec.employeeId}`;
  };

  const handleAdd = () => { 
    setFormData(initialFormState); 
    setEditingId(null); 
    setShowForm(true); 
  };

  const handleEdit = (record) => {
    setFormData({ ...record, fullName: renderName(record) });
    setEditingId(record.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Xác nhận xóa?',
      text: "Dữ liệu này sẽ mất vĩnh viễn!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Xóa ngay',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`http://localhost:5000/api/attendance/${id}`, { method: 'DELETE' });
        if (res.ok) { loadData(); Swal.fire('Thành công', 'Đã xóa bản ghi.', 'success'); }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isNew = editingId === null;
    const url = isNew ? 'http://localhost:5000/api/attendance' : `http://localhost:5000/api/attendance/${editingId}`;
    const submitData = { 
      ...formData, 
      id: isNew ? `ATT_0326_${Date.now().toString().slice(-4)}` : editingId,
      actualDays: parseFloat(formData.actualDays),
      lateCount: parseInt(formData.lateCount, 10),
      overtimeHours: parseFloat(formData.overtimeHours)
    };

    const res = await fetch(url, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData)
    });

    if (res.ok) { 
      setShowForm(false); 
      loadData(); 
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã lưu', showConfirmButton: false, timer: 1500 }); 
    }
  };


  //  chek-in tự động 
  
  const handleCheckIn = async (record) => {
    // Tự động cộng 1 ngày vào Công thực hiện tại
    const updatedRecord = {
      ...record,
      actualDays: parseFloat(record.actualDays || 0) + 1
    };

    try {
      const res = await fetch(`http://localhost:5000/api/attendance/${record.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecord)
      });

      if (res.ok) { 
        loadData(); // Tải lại bảng ngay lập tức để thấy số ngày tăng lên
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: `Đã Check-in cho ${renderName(record)}!`, showConfirmButton: false, timer: 1500 }); 
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Lỗi', 'Không thể Check-in', 'error');
    }
  };

  const handleExport = () => {
    const headers = ["Mã NV", "Họ và Tên", "Công thực", "Đi muộn", "Tăng ca"];
    const rows = filteredRecords.map(rec => [rec.employeeId, renderName(rec), rec.actualDays, rec.lateCount, rec.overtimeHours + "h"]);
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; 
    link.setAttribute("download", `Bao_cao_cham_cong.csv`); 
    link.click();
  };

  return (
    <div className="attendance-wrapper">
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2 className="header-title">📅 Hệ Thống Quản Lý Chấm Công ({currentTime.toLocaleDateString('vi-VN')})</h2>
          <span className="time-badge">
            🕒 {currentTime.toLocaleTimeString('vi-VN')}
          </span>
        </div>
      </div>

      <div className="tabs-container">
        <button onClick={() => setActiveTab('attendance')} className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}>
          Bảng Chấm Công
        </button>
        <button onClick={() => setActiveTab('leaves')} className={`tab-btn ${activeTab === 'leaves' ? 'active' : ''}`}>
          Đơn Nghỉ Phép
        </button>
      </div>

      {activeTab === 'attendance' ? (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="page-header" style={{ marginTop: '10px', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h2 className="header-title" style={{ fontSize: '18px', color: '#3b82f6' }}>📋 Quản Lý Bảng Chấm Công</h2>
            <div className="btn-group" style={{ alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Nhập mã NV tìm nhanh..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="form-input"
                style={{ width: '220px', padding: '10px', borderRadius: '8px' }}
              />
              <button onClick={handleExport} className="btn btn-success">
                📥 Xuất báo cáo
              </button>
              <button onClick={handleAdd} className="btn btn-primary">
                + Thêm mới
              </button>
            </div>
          </div>

          <div className="table-card" style={{ marginTop: '20px' }}>
            <table className="custom-table">
              <thead>
                <tr style={{ textAlign: 'center' }}>
                  <th>Mã NV</th>
                  <th style={{ textAlign: 'left' }}>Họ và Tên</th>
                  <th>Công thực</th>
                  <th>Đi muộn</th>
                  <th>Tăng ca</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? currentRecords.map((rec) => (
                  <tr key={rec.id} className="table-row" style={{ textAlign: 'center' }}>
                    <td style={{ fontWeight: 'bold', color: '#475569' }}>{rec.employeeId} </td>
                    <td style={{ textAlign: 'left', fontWeight: '500' }}>{renderName(rec)}</td>
                    <td style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '18px' }}>{rec.actualDays} ngày </td>
                    <td style={{ color: rec.lateCount > 0 ? '#dc3545' : '#198754', fontWeight: 'bold' }}>{rec.lateCount} lần</td>
                    <td>{rec.overtimeHours} giờ</td>
                    <td>
                      <button onClick={() => handleCheckIn(rec)} className="btn btn-success btn-sm" style={{ display: 'inline-block', marginRight: '5px', backgroundColor: '#198754' }}>
                        Check-in
                      </button>
                      <button onClick={() => handleEdit(rec)} className="btn btn-primary btn-sm" style={{ display: 'inline-block', marginRight: '5px' }}>Sửa</button>
                      <button onClick={() => handleDelete(rec.id)} className="btn btn-danger btn-sm" style={{ display: 'inline-block' }}>Xóa</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Hệ thống không tìm thấy nhân viên nào khớp với mã NV này!</td></tr>
                )}
              </tbody>
            </table>

            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="page-btn">Trước</button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}>
                  {i + 1}
                </button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="page-btn">Sau</button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 0.3s ease', marginTop: '10px' }}>
          <Leaves />
        </div>
      )}
      
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginTop: 0, textAlign: 'center', color: '#1e293b' }}>
              {editingId ? '📝 Sửa Chấm Công' : '🆕 Thêm Mới'}
            </h3>
            <form onSubmit={handleSubmit} className="form-group">
              <div>
                <label className="form-label">Mã nhân viên:</label>
                <input required placeholder="Mã NV" className="form-input" disabled={editingId !== null} value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value.toUpperCase()})} />
              </div>
              <div>
                <label className="form-label">Tên nhân viên:</label>
                <input required placeholder="Tên nhân viên" className="form-input" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-col">
                  <label className="form-label">Công thực:</label>
                  <input type="number" step="0.5" className="form-input" value={formData.actualDays} onChange={e => setFormData({...formData, actualDays: e.target.value})} />
                </div>
                <div className="form-col">
                  <label className="form-label">Đi muộn:</label>
                  <input type="number" className="form-input" value={formData.lateCount} onChange={e => setFormData({...formData, lateCount: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="form-label">Tăng ca (giờ):</label>
                <input type="number" className="form-input" value={formData.overtimeHours} onChange={e => setFormData({...formData, overtimeHours: e.target.value})} />
              </div>
              <div className="form-row" style={{ justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Hủy</button>
                <button type="submit" className="btn btn-success">Lưu dữ liệu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;