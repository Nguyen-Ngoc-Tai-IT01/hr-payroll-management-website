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

  // State cho phần hiển thị Lịch sử
  const [showHistory, setShowHistory] = useState(false);

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

  const renderName = (rec) => {
    if (rec.fullName) return rec.fullName;
    const emp = employees.find(e => e.id === rec.employeeId);
    return emp ? emp.fullName : `NV-${rec.employeeId}`;
  };

  // Lọc dữ liệu tìm kiếm 
  const filteredRecords = (Array.isArray(attendanceRecords) ? attendanceRecords : []).filter(rec => {
    const searchLower = searchTerm ? String(searchTerm).toLowerCase() : '';
    const name = renderName(rec) ? String(renderName(rec)).toLowerCase() : '';
    const empId = rec.employeeId ? String(rec.employeeId).toLowerCase() : '';
    
    return name.includes(searchLower) || empId.includes(searchLower);
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage) || 1;

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

  const handleCheckIn = async (record) => {
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
        loadData(); 
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

  const handleResetMonth = () => {
    Swal.fire({
      title: 'Khởi tạo tháng mới?',
      text: "Toàn bộ ngày công, đi muộn và lịch sử hiện tại sẽ bị reset về 0. Bạn có chắc chắn không?",
      icon: 'warning',
      input: 'text',
      inputPlaceholder: 'Nhập tháng mới (VD: 05/2026)',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Đồng ý Reset',
      cancelButtonText: 'Hủy',
      preConfirm: (inputValue) => {
        if (!inputValue) {
          Swal.showValidationMessage('Vui lòng nhập tháng mới!');
        }
        return inputValue;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch('http://localhost:5000/api/attendance/reset-month', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ month: result.value })
          });
          if (res.ok) {
            loadData();
            Swal.fire('Thành công!', `Hệ thống đã sẵn sàng cho tháng ${result.value}`, 'success');
          }
        } catch (err) {
          Swal.fire('Lỗi', 'Không thể reset dữ liệu', 'error');
        }
      }
    });
  };

  // Gom tất cả log lịch sử 
  const getAllHistoryLogs = () => {
    let allLogs = [];
    if (Array.isArray(attendanceRecords)) {
      attendanceRecords.forEach(rec => {
        if (rec.checkInLogs && Array.isArray(rec.checkInLogs)) {
          rec.checkInLogs.forEach(log => {
            allLogs.push({
              employeeId: rec.employeeId || 'N/A',
              fullName: renderName(rec) || 'Chưa cập nhật',
              ...log
            });
          });
        }
      });
    }
    return allLogs.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
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
        <div style={{ animation: 'fadeIn 0.3s ease', marginTop: '10px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#1e293b', margin: 0, fontSize: '24px' }}>📋 Quản Lý Bảng Chấm Công</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleExport} className="btn btn-success">
                📥 Xuất báo cáo
              </button>
              <button onClick={handleResetMonth} className="btn btn-primary">
                🔄 Reset Tháng
              </button>
              <button onClick={handleAdd} className="btn btn-primary">
                + Thêm mới
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="🔍 Tìm kiếm theo Mã NV hoặc Tên..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                style={{ width: '100%', maxWidth: '400px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
              />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                  onClick={() => setShowHistory(true)}
                  style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  🕒 Lịch sử Check-in
                </button>
                <div style={{ fontWeight: '500', color: '#475569', backgroundColor: '#f1f5f9', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  Tổng số: <strong style={{ color: '#2563eb', fontSize: '16px' }}>{filteredRecords.length}</strong> nhân viên
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }}>Mã NV</th>
                    <th style={{ textAlign: 'left' }}>Họ và Tên</th>
                    <th style={{ textAlign: 'center' }}>Công thực</th>
                    <th style={{ textAlign: 'center' }}>Đi muộn</th>
                    <th style={{ textAlign: 'center' }}>Tăng ca</th>
                    <th style={{ textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.length > 0 ? currentRecords.map((rec) => (
                    <tr key={rec.id} className="table-row" style={{ textAlign: 'center' }}>
                      <td style={{ fontWeight: 'bold', color: '#475569' }}>{rec.employeeId} </td>
                      <td style={{ textAlign: 'left', fontWeight: '500', color: '#0f172a' }}>{renderName(rec)}</td>
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
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Không tìm thấy nhân viên nào khớp với dữ liệu tìm kiếm!</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination" style={{ backgroundColor: 'transparent', paddingBottom: 0 }}>
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
      
      {/* thêm và sửa */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginTop: 0, textAlign: 'center', color: '#1e293b' }}>
              {editingId ? '📝 Sửa Chấm Công' : '🆕 Thêm Mới'}
            </h3>
            <form onSubmit={handleSubmit} className="form-group">
              
              {/* chọn nhân viên từ ds*/}
              {editingId === null ? (
                <div>
                  <label className="form-label">Chọn nhân viên :</label>
                  <select 
                    required 
                    className="form-input" 
                    value={formData.employeeId}
                    onChange={e => {
                      const selectedId = e.target.value;
                      // Tìm người được chọn trong danh sách nhân sự
                      const selectedEmp = employees.find(emp => emp.id === selectedId);
                      setFormData({
                        ...formData,
                        employeeId: selectedId,
                        fullName: selectedEmp ? selectedEmp.fullName : ''
                      });
                    }}
                  >
                    <option value="">Bấm để chọn nhân viên mới</option>
                    {employees
                      // Lọc: Chỉ hiện những người chưa có bảng chấm công trong tháng này
                      .filter(emp => !attendanceRecords.some(rec => rec.employeeId === emp.id))
                      .map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.id} - {emp.fullName}
                        </option>
                      ))
                    }
                  </select>
                </div>
              ) : (
                // khi sửa chỉ không hiển thị sửa tên và mã
                <div className="form-row">
                  <div className="form-col">
                    <label className="form-label">Mã NV:</label>
                    <input disabled className="form-input" value={formData.employeeId} style={{ backgroundColor: '#f1f5f9' }} />
                  </div>
                  <div className="form-col">
                    <label className="form-label">Họ và Tên:</label>
                    <input disabled className="form-input" value={formData.fullName} style={{ backgroundColor: '#f1f5f9' }} />
                  </div>
                </div>
              )}
              {/* hết vùng chỉnh sửa*/}

              <div className="form-row" style={{ marginTop: '15px' }}>
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
              <div className="form-row" style={{ justifyContent: 'flex-end', marginTop: '15px' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Hủy</button>
                <button type="submit" className="btn btn-success">Lưu dữ liệu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* hiển thị lịch sử check in*/}
      {showHistory && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px', width: '90%' }}>
            <h3 style={{ marginTop: 0, textAlign: 'center', color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
              🕒 Lịch sử Check-in Toàn Hệ thống
            </h3>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '15px' }}>
              <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: '0', backgroundColor: '#f8fafc', zIndex: 1 }}>
                  <tr>
                    <th style={{ textAlign: 'center' }}>Thời gian</th>
                    <th style={{ textAlign: 'left' }}>Nhân viên</th>
                    <th style={{ textAlign: 'center' }}>Thay đổi công</th>
                  </tr>
                </thead>
                <tbody>
                  {getAllHistoryLogs().length > 0 ? getAllHistoryLogs().map((log, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ textAlign: 'center', padding: '12px' }}>
                        <div style={{ fontWeight: 'bold', color: '#334155' }}>{log.timeStr}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{log.dateStr}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{log.fullName}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{log.employeeId}</div>
                      </td>
                      <td style={{ textAlign: 'center', padding: '12px', fontWeight: 'bold', color: '#059669' }}>
                        {log.oldDays} → {log.newDays} ngày
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Chưa có bản ghi lịch sử nào!</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button onClick={() => setShowHistory(false)} className="btn btn-outline" style={{ padding: '10px 30px' }}>Đóng lại</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;