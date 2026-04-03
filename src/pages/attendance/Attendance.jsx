import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Leaves from './Leaves'; 

const initialFormState = { 
  employeeId: '', fullName: '', month: '03/2026', 
  standardDays: 22, actualDays: 0, lateCount: 0, overtimeHours: 0 
};

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  // logic phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10); // Mỗi trang hiện 10 dòng

  //lấy thời gian hiện tại
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

  // Tính toán dữ liệu cho trang hiện tại
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = attendanceRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(attendanceRecords.length / recordsPerPage);

  const renderName = (rec) => {
    if (rec.fullName) return rec.fullName;
    const emp = employees.find(e => e.id === rec.employeeId);
    return emp ? emp.fullName : "Nhân viên " + rec.employeeId;
  };

  const handleAdd = () => { setFormData(initialFormState); setEditingId(null); setShowForm(true); };

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

    if (res.ok) { setShowForm(false); loadData(); Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã lưu', showConfirmButton: false, timer: 1500 }); }
  };

  const handleExport = () => {
    const headers = ["Mã NV", "Họ và Tên", "Công thực", "Đi muộn", "Tăng ca"];
    const rows = attendanceRecords.map(rec => [rec.employeeId, renderName(rec), rec.actualDays, rec.lateCount, rec.overtimeHours + "h"]);
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.setAttribute("download", `Bao_cao_cham_cong.csv`); link.click();
  };

  return (
    <div style={{ padding: '25px', backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2 style={{ margin: 0, color: '#1e293b' }}>📅 Quản Lý Chấm Công ({currentTime.toLocaleDateString('vi-VN')})</h2>
          <span style={{ backgroundColor: '#e2e8f0', padding: '5px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>
            🕒 {currentTime.toLocaleTimeString('vi-VN')}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExport} style={{ padding: '10px 20px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
            📥 Xuất báo cáo chấm công
          </button>
          <button onClick={handleAdd} style={{ padding: '10px 20px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Thêm mới
          </button>
        </div>
      </div>

      {/* tabs xin phép và chấm công*/}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('attendance')} style={{ padding: '10px 20px', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer', backgroundColor: activeTab === 'attendance' ? '#fff' : '#e2e8f0', fontWeight: 'bold', color: activeTab === 'attendance' ? '#0d6efd' : '#64748b' }}>Bảng Chấm Công</button>
        <button onClick={() => setActiveTab('leaves')} style={{ padding: '10px 20px', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer', backgroundColor: activeTab === 'leaves' ? '#fff' : '#e2e8f0', fontWeight: 'bold', color: activeTab === 'leaves' ? '#0d6efd' : '#64748b' }}>Đơn Nghỉ Phép</button>
      </div>

      {activeTab === 'attendance' ? (
        <div style={{ backgroundColor: '#fff', borderRadius: '0 12px 12px 12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <tr style={{ textAlign: 'center' }}>
                <th style={{ padding: '15px' }}>Mã NV</th>
                <th style={{ textAlign: 'left' }}>Họ và Tên</th>
                <th>Công thực</th>
                <th>Đi muộn</th>
                <th>Tăng ca</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((rec, index) => (
                <tr key={rec.id} style={{ textAlign: 'center', borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfd' }} className="row-hover">
                  <td style={{ fontWeight: 'bold', color: '#475569', padding: '12px' }}>{rec.employeeId} </td>
                  <td style={{ textAlign: 'left', fontWeight: '500' }}>{renderName(rec)}</td>
                  <td style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '18px' }}>{rec.actualDays} ngày </td>
                  <td style={{ color: rec.lateCount > 0 ? '#dc3545' : '#198754', fontWeight: 'bold' }}>{rec.lateCount} lần</td>
                  <td>{rec.overtimeHours} giờ</td>
                  <td>
                    <button onClick={() => handleEdit(rec)} style={{ backgroundColor: '#0d6efd',color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontWeight: 'bold' }}>Sửa</button>
                    <button onClick={() => handleDelete(rec.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* phân trang */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', gap: '5px' }}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ddd', cursor: 'pointer' }}>Trước</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', backgroundColor: currentPage === i + 1 ? '#0d6efd' : '#e2e8f0', color: currentPage === i + 1 ? 'white' : '#333', cursor: 'pointer', fontWeight: 'bold' }}>
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ddd', cursor: 'pointer' }}>Sau</button>
          </div>
        </div>
      ) : (
        <Leaves />
      )}

      {/* form modal */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, textAlign: 'center', color: '#1e293b' }}>{editingId ? '📝 Sửa Chấm Công' : '🆕 Thêm Mới'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input required placeholder="Mã NV" disabled={editingId !== null} value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value.toUpperCase()})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input required placeholder="Tên nhân viên" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}><label>Công thực:</label><input type="number" step="0.5" value={formData.actualDays} onChange={e => setFormData({...formData, actualDays: e.target.value})} style={{ width: '100%', padding: '10px' }} /></div>
                <div style={{ flex: 1 }}><label>Đi muộn:</label><input type="number" value={formData.lateCount} onChange={e => setFormData({...formData, lateCount: e.target.value})} style={{ width: '100%', padding: '10px' }} /></div>
              </div>
              <label>Tăng ca (giờ):</label>
              <input type="number" value={formData.overtimeHours} onChange={e => setFormData({...formData, overtimeHours: e.target.value})} style={{ padding: '10px' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ddd' }}>Hủy</button>
                <button type="submit" style={{ padding: '10px 25px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Lưu dữ liệu</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`.row-hover:hover { background-color: #f1f5f9 !important; transition: 0.2s; }`}</style>
    </div>
  );
};

export default Attendance;