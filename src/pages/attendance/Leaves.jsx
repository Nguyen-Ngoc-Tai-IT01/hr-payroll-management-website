import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const initialFormState = {
  employeeId: '', 
  fullName: '', 
  type: 'Nghỉ phép năm', 
  fromDate: '', 
  toDate: '', 
  reason: '', 
  status: 'Chờ duyệt'
};

const Leaves = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  const loadData = async () => {
    try {
      const [resL, resE] = await Promise.all([
        fetch('http://localhost:5000/api/leaves'),
        fetch('http://localhost:5000/api/employees')
      ]);
      const dataL = await resL.json();
      const dataE = await resE.json();
      setLeaveRequests(dataL);
      setEmployees(dataE);
    } catch (err) { 
      console.error(err);
      Swal.fire('Lỗi', 'Không thể kết nối dữ liệu server!', 'error');
    }
  };

  useEffect(() => { loadData(); }, []);

  // Hàm màu sắc trạng thái
  const getStatusStyle = (status) => {
    const s = status ? status.trim() : "Chờ duyệt";
    if (s === 'Đã duyệt') return { bg: '#dcfce7', text: '#166534' }; // Xanh lá
    if (s === 'Từ chối') return { bg: '#fee2e2', text: '#991b1b' }; // Đỏ
    return { bg: '#fef3c7', text: '#92400e' }; // Vàng cho Chờ duyệt
  };

  const renderEmployeeName = (req) => {
    if (req.fullName) return req.fullName;
    const emp = employees.find(e => String(e.id) === String(req.employeeId));
    return emp ? emp.fullName : `NV-${req.employeeId}`;
  };

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = leaveRequests.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(leaveRequests.length / recordsPerPage);

  // Xuất csv
  const handleExport = () => {
    const headers = ["Mã NV", "Họ Tên", "Loại nghỉ", "Từ ngày", "Đến ngày", "Lý do", "Trạng thái"];
    const rows = leaveRequests.map(req => [
      req.employeeId, renderEmployeeName(req), req.type, req.fromDate, req.toDate, req.reason, req.status
    ]);
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Bao_cao_Nghi_phep_IT24B.csv`);
    link.click();
  };

  const handleEdit = (req) => {
    setFormData({ ...req, fullName: renderEmployeeName(req) });
    setEditingId(req.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Xác nhận xóa đơn?',
      text: "Dữ liệu sẽ bị mất vĩnh viễn!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Xóa ngay',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`http://localhost:5000/api/leaves/${id}`, { method: 'DELETE' });
        if (res.ok) { loadData(); Swal.fire('Đã xóa!', '', 'success'); }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isNew = editingId === null;
    const url = isNew ? 'http://localhost:5000/api/leaves' : `http://localhost:5000/api/leaves/${editingId}`;
    
    const res = await fetch(url, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isNew ? { ...formData, id: Date.now() } : formData)
    });

    if (res.ok) {
      setShowForm(false);
      loadData();
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã lưu thành công', showConfirmButton: false, timer: 1500 });
    }
  };

  const updateStatus = async (id, newStatus) => {
    const record = leaveRequests.find(r => r.id === id);
    const res = await fetch(`http://localhost:5000/api/leaves/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...record, status: newStatus })
    });
    if (res.ok) {
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: `Đã ${newStatus}`, showConfirmButton: false, timer: 1000 });
      loadData();
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease', padding: '10px' }}>
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ margin: 0, color: '#1e293b' }}>📝 Quản lý Đơn Nghỉ Phép</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExport} style={{ padding: '10px 20px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
             📥 Xuất báo cáo nghỉ phép
          </button>
          <button onClick={() => { setFormData(initialFormState); setEditingId(null); setShowForm(true); }} 
            style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            + Tạo đơn mới
          </button>
        </div>
      </div>

      {/* bảng */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
              <th style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>Nhân viên</th>
              <th style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>Loại nghỉ</th>
              <th style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>Thời gian</th>
              <th style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>Lý do</th>
              <th style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>Trạng thái</th>
              <th style={{ padding: '16px', color: '#64748b', fontSize: '13px', textAlign: 'center' }}>Thao tác</th>
              <th style={{ padding: '16px', color: '#64748b', fontSize: '13px', textAlign: 'center' }}>Phê duyệt</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map(req => {
              const statusStyle = getStatusStyle(req.status);
              return (
                <tr key={req.id} style={{ borderBottom: '1px solid #f8fafc' }} className="table-row">
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{renderEmployeeName(req)}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{req.employeeId}</div>
                  </td>
                  <td style={{ padding: '16px', color: '#475569' }}>{req.type}</td>
                  <td style={{ padding: '16px', fontSize: '13px', color: '#64748b' }}>{req.fromDate} → {req.toDate}</td>
                  <td style={{ padding: '16px', color: '#64748b', fontSize: '13px', maxWidth: '180px' }}>{req.reason}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: statusStyle.bg, color: statusStyle.text
                    }}>
                      {req.status || 'Chờ duyệt'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <button onClick={() => handleEdit(req)} style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Sửa</button>
                      <button onClick={() => handleDelete(req.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Xóa</button>
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <button onClick={() => updateStatus(req.id, 'Đã duyệt')} style={{ backgroundColor: '#198754', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Duyệt</button>
                      <button onClick={() => updateStatus(req.id, 'Từ chối')} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Từ chối</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* phân trang */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', gap: '5px', backgroundColor: '#f8fafc' }}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ddd', cursor: 'pointer' }}>Trước</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', backgroundColor: currentPage === i + 1 ? '#0d6efd' : '#e2e8f0', color: currentPage === i + 1 ? 'white' : '#333', cursor: 'pointer', fontWeight: 'bold' }}>
              {i + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ddd', cursor: 'pointer' }}>Sau</button>
        </div>
      </div>

      {/* form modal */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '420px', boxShadow: '0 20px 25px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, textAlign: 'center', color: '#0f172a' }}>{editingId ? '✍️ Sửa đơn nghỉ' : '🆕 Tạo đơn mới'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Mã nhân viên:</label>
              <input required placeholder="VD: EMP001" disabled={editingId !== null} value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value.toUpperCase()})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />

              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Tên nhân viên:</label>
              <input required placeholder="Tên nhân viên" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />

              <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Loại nghỉ:</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <option value="Nghỉ phép năm">Nghỉ phép năm</option>
                <option value="Nghỉ ốm">Nghỉ ốm</option>
                <option value="Việc riêng">Việc riêng</option>
              </select>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}><label style={{ fontSize: '11px', fontWeight: 'bold' }}>Từ ngày:</label><input required type="date" value={formData.fromDate} onChange={e => setFormData({...formData, fromDate: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius:'8px', border:'1px solid #e2e8f0' }} /></div>
                <div style={{ flex: 1 }}><label style={{ fontSize: '11px', fontWeight: 'bold' }}>Đến ngày:</label><input required type="date" value={formData.toDate} onChange={e => setFormData({...formData, toDate: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius:'8px', border:'1px solid #e2e8f0' }} /></div>
              </div>

              <textarea placeholder="Lý do nghỉ..." value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} rows="3"></textarea>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '10px 25px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Lưu đơn</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`.table-row:hover { background-color: #f1f5f9 !important; transition: 0.2s; }`}</style>
    </div>
  );
};

export default Leaves;