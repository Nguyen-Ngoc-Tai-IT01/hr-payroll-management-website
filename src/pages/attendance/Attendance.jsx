import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Leaves from './Leaves'; 
import './Attendance.css'; 

const initialFormState = { 
  employeeId: '', fullName: '', month: '04/2026', 
  standardDays: 22, actualDays: 0, lateCount: 0, overtimeHours: 0,
  todayStatus: 'Chưa chấm' 
};

const formatDateVN = (dateStringOrDateObj) => {
  const d = new Date(dateStringOrDateObj);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const getTodayYYYYMMDD = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [showHistory, setShowHistory] = useState(false);
  const [isCheckInActive, setIsCheckInActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayYYYYMMDD());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10); 
  const [currentTime, setCurrentTime] = useState(new Date());

  // KIỂM TRA CHÍNH XÁC 5 NGƯỜI CÓ QUYỀN XEM TẤT CẢ
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const VIP_ADMINS = ["EMP001", "EMP002", "EMP003", "EMP004", "EMP005"];
  const isPrivileged = VIP_ADMINS.includes(currentUser.id);

  useEffect(() => {
    loadData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    try {
      const attRes = await fetch('http://localhost:5000/api/attendance');
      const attData = await attRes.json();
      setAttendanceRecords(attData); 

      const localEmpData = localStorage.getItem('employeeData');
      if (localEmpData) {
        setEmployees(JSON.parse(localEmpData));
      } else {
        const empRes = await fetch('http://localhost:5000/api/employees');
        const empData = await empRes.json();
        setEmployees(empData);
        localStorage.setItem('employeeData', JSON.stringify(empData));
      }
    } catch (err) { 
      console.error(err);
    }
  };

  const renderName = (rec) => {
    if (rec.fullName) return rec.fullName;
    const emp = employees.find(e => e.id === rec.employeeId);
    return emp ? emp.fullName : `NV-${rec.employeeId}`;
  };

  const filteredRecords = (Array.isArray(attendanceRecords) ? attendanceRecords : []).filter(rec => {
    // BƯỚC LỌC DỮ LIỆU CÁ NHÂN: Nếu không phải 5 VIP, chỉ xem được của chính mình
    if (!isPrivileged && String(rec.employeeId) !== String(currentUser.id)) {
        return false;
    }

    const searchLower = searchTerm ? String(searchTerm).toLowerCase() : '';
    const name = renderName(rec) ? String(renderName(rec)).toLowerCase() : '';
    const empId = rec.employeeId ? String(rec.employeeId).toLowerCase() : '';
    return name.includes(searchLower) || empId.includes(searchLower);
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage) || 1;

  const handleAdd = () => { setFormData(initialFormState); setEditingId(null); setShowForm(true); };

  const checkStatusForDate = (record, dateString) => {
    const targetDateStr = formatDateVN(dateString);
    const targetObjDate = new Date(dateString);

    if (record.dailyRecords && record.dailyRecords.length > 0) {
      const targetLogs = record.dailyRecords.filter(log => log.dateStr === targetDateStr);
      if (targetLogs.length > 0) {
        const lastLog = targetLogs[targetLogs.length - 1];
        return { isCheckedIn: lastLog.action === 'CHECK_IN', isCancelled: lastLog.action === 'CANCEL' };
      }
    }
    
    if (record.checkInLogs && record.checkInLogs.length > 0) {
      const backendLogs = record.checkInLogs.filter(log => {
        if (!log.timestamp) return false;
        const d = new Date(log.timestamp);
        return d.getDate() === targetObjDate.getDate() && d.getMonth() === targetObjDate.getMonth() && d.getFullYear() === targetObjDate.getFullYear();
      });
      if (backendLogs.length > 0) {
        const lastBackendLog = backendLogs[backendLogs.length - 1];
        const isCheck = parseFloat(lastBackendLog.newDays) > parseFloat(lastBackendLog.oldDays);
        const isCancel = parseFloat(lastBackendLog.newDays) < parseFloat(lastBackendLog.oldDays);
        return { isCheckedIn: isCheck, isCancelled: isCancel };
      }
    }
    return { isCheckedIn: false, isCancelled: false };
  };

  const handleEdit = (record) => { /* Giữ nguyên của bạn */ };
  const handleDelete = async (id) => { /* Giữ nguyên của bạn */ };
  const handleSubmit = async (e) => { /* Giữ nguyên của bạn */ };
  const handleCheckIn = async (record) => { /* Giữ nguyên của bạn */ };
  const handleExport = () => { /* Giữ nguyên của bạn */ };
  const handleResetMonth = () => { /* Giữ nguyên của bạn */ };
  const getAllHistoryLogs = () => { return []; };
  const getLastGlobalCheckInDate = () => { return "Chưa có"; };

  return (
    <div className="attendance-wrapper">
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2 className="header-title">📅 Hệ Thống Quản Lý Chấm Công ({currentTime.toLocaleDateString('vi-VN')})</h2>
          <span className="time-badge">🕒 {currentTime.toLocaleTimeString('vi-VN')}</span>
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
            <h2 style={{ color: '#1e293b', margin: 0, fontSize: '24px' }}>{isPrivileged ? "Quản Lý Bảng Chấm Công" : "Chấm Công Của Tôi"}</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* Chỉ 5 VIP mới thấy các nút này */}
              {isPrivileged && (
                <>
                  <button onClick={handleExport} className="btn btn-success">Xuất báo cáo</button>
                  <button onClick={handleAdd} className="btn btn-primary">+ Thêm mới</button>
                  <button onClick={handleResetMonth} className="btn btn-primary">Thiết lập lại</button>
                </>
              )}
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Chỉ 5 VIP mới thấy ô tìm kiếm */}
              {isPrivileged ? (
                <input 
                  type="text" placeholder=" Tìm kiếm theo Mã NV hoặc Tên..." 
                  value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  style={{ width: '100%', maxWidth: '250px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              ) : <div />}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f1f5f9', padding: '5px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '14px', color: '#475569', fontWeight: 'bold' }}>Ngày:</span>
                  <input 
                    type="date" min={getTodayYYYYMMDD()} value={selectedDate}
                    onChange={(e) => { if(e.target.value) { setSelectedDate(e.target.value); setIsCheckInActive(false); } }}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 'bold', color: '#0f172a', outline: 'none', backgroundColor: 'white' }}
                  />
                </div>

                {/* Chỉ 5 VIP mới được thao tác Bắt đầu chấm công */}
                {isPrivileged && (
                  !isCheckInActive ? (
                    <button onClick={() => setIsCheckInActive(true)} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)' }}>Bắt đầu chấm công</button>
                  ) : (
                    <button onClick={() => { setIsCheckInActive(false); Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã đóng đợt chấm công!', showConfirmButton: false, timer: 1500 }); }} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)' }}>Lưu lại</button>
                  )
                )}

                {isPrivileged && (
                  <button onClick={() => setShowHistory(true)} style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Lịch sử chấm công</button>
                )}
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
                    {/* Ẩn cột Thao tác nếu là nhân viên */}
                    {isPrivileged && <th style={{ textAlign: 'center' }}>Thao tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.length > 0 ? currentRecords.map((rec) => {
                    const { isCheckedIn, isCancelled } = checkStatusForDate(rec, selectedDate);

                    return (
                      <tr key={rec.id} className="table-row" style={{ textAlign: 'center' }}>
                        <td style={{ fontWeight: 'bold', color: '#475569' }}>{rec.employeeId} </td>
                        <td style={{ textAlign: 'left', fontWeight: '500', color: '#0f172a' }}>{renderName(rec)}</td>
                        <td style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '18px' }}>{rec.actualDays} ngày </td>
                        <td style={{ color: rec.lateCount > 0 ? '#dc3545' : '#198754', fontWeight: 'bold' }}>{rec.lateCount} lần</td>
                        <td>{rec.overtimeHours} giờ</td>
                        
                        {/* Ẩn nút thao tác nếu là nhân viên */}
                        {isPrivileged && (
                          <td>
                            {isCheckedIn ? (
                              <span style={{ display: 'inline-block', marginRight: '5px', padding: '5px 12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đã chấm</span>
                            ) : isCancelled ? (
                              isCheckInActive ? (
                                <button onClick={() => handleCheckIn(rec)} className="btn btn-success btn-sm" style={{ display: 'inline-block', marginRight: '5px', backgroundColor: '#198754', fontWeight: 'bold' }}>Chấm công</button>
                              ) : (
                                <span style={{ display: 'inline-block', marginRight: '5px', padding: '5px 12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Hủy chấm</span>
                              )
                            ) : (
                              isCheckInActive && (
                                <button onClick={() => handleCheckIn(rec)} className="btn btn-success btn-sm" style={{ display: 'inline-block', marginRight: '5px', backgroundColor: '#198754', fontWeight: 'bold' }}>Chấm công</button>
                              )
                            )}

                            <button onClick={() => handleEdit(rec)} className="btn btn-primary btn-sm" style={{ display: 'inline-block', marginRight: '5px' }}>Sửa</button>
                            <button onClick={() => handleDelete(rec.id)} className="btn btn-danger btn-sm" style={{ display: 'inline-block' }}>Xóa</button>
                          </td>
                        )}
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan={isPrivileged ? "6" : "5"} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Không tìm thấy nhân viên!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Thanh phân trang giữ nguyên của bạn */}
          </div>
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 0.3s ease', marginTop: '10px' }}>
          <Leaves />
        </div>
      )}
    </div>
  );
};

export default Attendance;