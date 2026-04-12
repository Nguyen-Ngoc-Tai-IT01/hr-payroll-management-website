import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Leaves from './Leaves'; 
import './Attendance.css'; 

const initialFormState = { 
  employeeId: '', fullName: '', month: '04/2026', 
  standardDays: 22, actualDays: 0, lateCount: 0, overtimeHours: 0,
  todayStatus: 'Chưa chấm' 
};

// hàm ép kiểu ngày tháng chuẩn xác để không bao giờ bị lệch định dạng
const formatDateVN = (dateStringOrDateObj) => {
  const d = new Date(dateStringOrDateObj);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

// hàm lấy ngày hôm nay chuẩn yyyy-mm-dd để khóa lịch quá khứ
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
  
  // quản lý mở chốt
  const [isCheckInActive, setIsCheckInActive] = useState(false);

  // thêm state quản lý ngày đang chọn (mặc định hôm nay)
  const [selectedDate, setSelectedDate] = useState(getTodayYYYYMMDD());

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10); 
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ĐÃ SỬA: ĐỒNG BỘ DỮ LIỆU NHÂN SỰ TỪ LOCALSTORAGE
  const loadData = async () => {
    try {
      // 1. Tải dữ liệu chấm công từ Backend như bình thường
      const attRes = await fetch('http://localhost:5000/api/attendance');
      const attData = await attRes.json();
      setAttendanceRecords(attData); 

      // 2. Lấy dữ liệu Nhân viên từ LocalStorage (để thấy được người mới thêm)
      const localEmpData = localStorage.getItem('employeeData');
      if (localEmpData) {
        setEmployees(JSON.parse(localEmpData));
      } else {
        // Nếu bộ nhớ ảo rỗng thì mới gọi Backend
        const empRes = await fetch('http://localhost:5000/api/employees');
        const empData = await empRes.json();
        setEmployees(empData);
        localStorage.setItem('employeeData', JSON.stringify(empData)); // Lưu mồi vào LocalStorage
      }
    } catch (err) { 
      console.error("Lỗi:", err);
      Swal.fire('Lỗi!', 'Không thể kết nối API!', 'error');
    }
  };

  const renderName = (rec) => {
    if (rec.fullName) return rec.fullName;
    const emp = employees.find(e => e.id === rec.employeeId);
    return emp ? emp.fullName : `NV-${rec.employeeId}`;
  };

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

  const checkStatusForDate = (record, dateString) => {
    const targetDateStr = formatDateVN(dateString);
    const targetObjDate = new Date(dateString);

    if (record.dailyRecords && record.dailyRecords.length > 0) {
      const targetLogs = record.dailyRecords.filter(log => log.dateStr === targetDateStr);
      if (targetLogs.length > 0) {
        const lastLog = targetLogs[targetLogs.length - 1];
        return {
          isCheckedIn: lastLog.action === 'CHECK_IN',
          isCancelled: lastLog.action === 'CANCEL'
        };
      }
    }
    
    if (record.checkInLogs && record.checkInLogs.length > 0) {
      const backendLogs = record.checkInLogs.filter(log => {
        if (!log.timestamp) return false;
        const d = new Date(log.timestamp);
        return d.getDate() === targetObjDate.getDate() &&
               d.getMonth() === targetObjDate.getMonth() &&
               d.getFullYear() === targetObjDate.getFullYear();
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

  const handleEdit = (record) => {
    const { isCheckedIn } = checkStatusForDate(record, selectedDate);

    setFormData({ 
      ...record, 
      fullName: renderName(record),
      todayStatus: isCheckedIn ? 'Đã chấm' : 'Chưa chấm',
      _originalStatus: isCheckedIn ? 'Đã chấm' : 'Chưa chấm' 
    });
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
    
    let finalActualDays = parseFloat(formData.actualDays);
    let customLogs = formData.dailyRecords ? [...formData.dailyRecords] : [];
    const targetDateStr = formatDateVN(selectedDate);
    const now = new Date();

    if (formData.todayStatus === 'Đã chấm' && formData._originalStatus === 'Chưa chấm') {
      finalActualDays += 1;
      customLogs.push({ dateStr: targetDateStr, action: 'CHECK_IN', timestamp: now.toISOString() });
    } 
    else if (formData.todayStatus === 'Chưa chấm' && formData._originalStatus === 'Đã chấm') {
      finalActualDays = Math.max(0, finalActualDays - 1); 
      customLogs.push({ dateStr: targetDateStr, action: 'CANCEL', timestamp: now.toISOString() });
    }

    const url = isNew ? 'http://localhost:5000/api/attendance' : `http://localhost:5000/api/attendance/${editingId}`;
    const submitData = { 
      ...formData, 
      id: isNew ? `ATT_0326_${Date.now().toString().slice(-4)}` : editingId,
      actualDays: finalActualDays,
      lateCount: parseInt(formData.lateCount, 10),
      overtimeHours: parseFloat(formData.overtimeHours),
      dailyRecords: customLogs 
    };

    delete submitData.todayStatus;
    delete submitData._originalStatus;

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
    const currentDays = parseFloat(record.actualDays || 0);
    const targetDateStr = formatDateVN(selectedDate);
    const now = new Date();
    
    const newLog = {
      dateStr: targetDateStr,
      action: 'CHECK_IN',
      timestamp: now.toISOString()
    };

    const updatedRecord = {
      ...record,
      actualDays: currentDays + 1,
      dailyRecords: [...(record.dailyRecords || []), newLog] 
    };

    try {
      const res = await fetch(`http://localhost:5000/api/attendance/${record.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecord)
      });

      if (res.ok) { 
        loadData(); 
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: `Đã Chấm công cho ${renderName(record)}!`, showConfirmButton: false, timer: 1500 }); 
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
      title: 'Khởi tạo lại mới?',
      text: "Toàn bộ ngày công, đi muộn và lịch sử hiện tại sẽ bị thiệt lập lại về 0. Bạn có chắc chắn không?",
      icon: 'warning',
      input: 'text',
      inputPlaceholder: 'Nhập tháng mới (VD: 05/2026) để thiệt lập lại',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Đồng ý ',
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
          await fetch('http://localhost:5000/api/attendance/reset-month', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ month: result.value })
          });

          for (let rec of attendanceRecords) {
            if (rec.dailyRecords && rec.dailyRecords.length > 0) {
              await fetch(`http://localhost:5000/api/attendance/${rec.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  ...rec, 
                  actualDays: 0, 
                  lateCount: 0, 
                  overtimeHours: 0, 
                  checkInLogs: [], 
                  dailyRecords: [], 
                  month: result.value 
                })
              });
            }
          }

          loadData();
          Swal.fire('Thành công!', `Hệ thống đã sẵn sàng cho tháng ${result.value}`, 'success');
        } catch (err) {
          Swal.fire('Lỗi', 'Không thể reset dữ liệu', 'error');
        }
      }
    });
  };

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

  const getLastGlobalCheckInDate = () => {
    let latestTime = '';
    let latestTimestamp = 0;
    attendanceRecords.forEach(rec => {
      if (rec.checkInLogs && rec.checkInLogs.length > 0) {
        const last = rec.checkInLogs[rec.checkInLogs.length - 1];
        if (last.timestamp && new Date(last.timestamp).getTime() > latestTimestamp) {
          latestTimestamp = new Date(last.timestamp).getTime();
          latestTime = last.timeStr;
        }
      }
    });
    return latestTime || "Chưa có";
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
            <h2 style={{ color: '#1e293b', margin: 0, fontSize: '24px' }}> Quản Lý Bảng Chấm Công</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleExport} className="btn btn-success">
                Xuất báo cáo
              </button>
              <button onClick={handleAdd} className="btn btn-primary">
                + Thêm mới
              </button>
              <button onClick={handleResetMonth} className="btn btn-primary">
                Thiệt lập lại 
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder=" Tìm kiếm theo Mã NV hoặc Tên..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                style={{ width: '100%', maxWidth: '250px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
              />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f1f5f9', padding: '5px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '14px', color: '#475569', fontWeight: 'bold' }}>Ngày:</span>
                  <input 
                    type="date" 
                    min={getTodayYYYYMMDD()} 
                    value={selectedDate}
                    onChange={(e) => {
                      if(e.target.value) {
                        setSelectedDate(e.target.value);
                        setIsCheckInActive(false); 
                      }
                    }}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 'bold', color: '#0f172a', outline: 'none', backgroundColor: 'white' }}
                  />
                </div>

                <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                  Cập nhật: <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{getLastGlobalCheckInDate()}</span>
                </div>

                {!isCheckInActive ? (
                  <button 
                    onClick={() => setIsCheckInActive(true)}
                    style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)' }}>
                    Bắt đầu chấm công
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setIsCheckInActive(false); 
                      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã đóng đợt chấm công!', showConfirmButton: false, timer: 1500 });
                    }}
                    style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)' }}>
                    Lưu lại
                  </button>
                )}

                <button 
                  onClick={() => setShowHistory(true)}
                  style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                   Lịch sử chấm công
                </button>

                <div style={{ fontWeight: '500', color: '#475569', backgroundColor: '#f1f5f9', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  Tổng: <strong style={{ color: '#2563eb', fontSize: '16px' }}>{filteredRecords.length} nhân viên</strong>
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
                  {currentRecords.length > 0 ? currentRecords.map((rec) => {
                    const { isCheckedIn, isCancelled } = checkStatusForDate(rec, selectedDate);

                    return (
                      <tr key={rec.id} className="table-row" style={{ textAlign: 'center' }}>
                        <td style={{ fontWeight: 'bold', color: '#475569' }}>{rec.employeeId} </td>
                        <td style={{ textAlign: 'left', fontWeight: '500', color: '#0f172a' }}>{renderName(rec)}</td>
                        <td style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '18px' }}>{rec.actualDays} ngày </td>
                        <td style={{ color: rec.lateCount > 0 ? '#dc3545' : '#198754', fontWeight: 'bold' }}>{rec.lateCount} lần</td>
                        <td>{rec.overtimeHours} giờ</td>
                        <td>
                          
                          {isCheckedIn ? (
                            <span style={{ display: 'inline-block', marginRight: '5px', padding: '5px 12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                              Đã chấm
                            </span>
                          ) : isCancelled ? (
                            isCheckInActive ? (
                              <button onClick={() => handleCheckIn(rec)} className="btn btn-success btn-sm" style={{ display: 'inline-block', marginRight: '5px', backgroundColor: '#198754', fontWeight: 'bold' }}>
                                Chấm công
                              </button>
                            ) : (
                              <span style={{ display: 'inline-block', marginRight: '5px', padding: '5px 12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                                Hủy chấm
                              </span>
                            )
                          ) : (
                            isCheckInActive && (
                              <button onClick={() => handleCheckIn(rec)} className="btn btn-success btn-sm" style={{ display: 'inline-block', marginRight: '5px', backgroundColor: '#198754', fontWeight: 'bold' }}>
                                Chấm công
                              </button>
                            )
                          )}

                          <button onClick={() => handleEdit(rec)} className="btn btn-primary btn-sm" style={{ display: 'inline-block', marginRight: '5px' }}>Sửa</button>
                          <button onClick={() => handleDelete(rec.id)} className="btn btn-danger btn-sm" style={{ display: 'inline-block' }}>Xóa</button>
                        </td>
                      </tr>
                    );
                  }) : (
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
      
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginTop: 0, textAlign: 'center', color: '#1e293b' }}>
              {editingId ? 'Sửa Chấm Công' : 'Thêm Mới'}
            </h3>
            <form onSubmit={handleSubmit} className="form-group">
              
              {editingId === null ? (
                <div>
                  <label className="form-label">Chọn nhân viên :</label>
                  <select 
                    required 
                    className="form-input" 
                    value={formData.employeeId}
                    onChange={e => {
                      const selectedId = e.target.value;
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

              <div className="form-row" style={{ marginTop: '15px' }}>
                <div className="form-col">
                  <label className="form-label">Tăng ca (giờ):</label>
                  <input type="number" className="form-input" value={formData.overtimeHours} onChange={e => setFormData({...formData, overtimeHours: e.target.value})} />
                </div>
                
                {editingId !== null && (
                  <div className="form-col">
                    <label className="form-label">Trạng thái ({formatDateVN(selectedDate)}):</label>
                    <select 
                      className="form-input" 
                      value={formData.todayStatus} 
                      onChange={e => setFormData({...formData, todayStatus: e.target.value})}
                    >
                      <option value="Chưa chấm">Chưa chấm / Hủy chấm</option>
                      <option value="Đã chấm">Đã chấm (+1 ngày công)</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="form-row" style={{ justifyContent: 'flex-end', marginTop: '15px' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Hủy</button>
                <button type="submit" className="btn btn-success">Lưu dữ liệu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px', width: '90%' }}>
            <h3 style={{ marginTop: 0, textAlign: 'center', color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
              Lịch sử Check-in Toàn Hệ thống
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
                  {getAllHistoryLogs().length > 0 ? getAllHistoryLogs().map((log, index) => {
                    const isCancelled = parseFloat(log.newDays) < parseFloat(log.oldDays);
                    return (
                      <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ textAlign: 'center', padding: '12px' }}>
                          <div style={{ fontWeight: 'bold', color: '#334155' }}>{log.timeStr}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{log.dateStr}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: '600', color: '#0f172a' }}>{log.fullName}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{log.employeeId}</div>
                        </td>
                        <td style={{ textAlign: 'center', padding: '12px', fontWeight: 'bold', color: isCancelled ? '#dc3545' : '#059669' }}>
                          {isCancelled ? 'Hủy chấm: ' : ''} {log.oldDays} → {log.newDays} ngày
                        </td>
                      </tr>
                    );
                  }) : (
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