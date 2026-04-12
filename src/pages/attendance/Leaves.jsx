import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './Attendance.css';

const initialFormState = {
  employeeId: '', fullName: '', type: 'Nghỉ phép năm', 
  fromDate: '', toDate: '', reason: '', status: 'Chờ duyệt'
};

const Leaves = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  
  // tìm kiếm và phân trang
  const [searchTerm, setSearchTerm] = useState('');
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

  const getStatusStyle = (status) => {
    const s = status ? status.trim() : "Chờ duyệt";
    if (s === 'Đã duyệt') return { bg: '#dcfce7', text: '#166534' }; 
    if (s === 'Từ chối') return { bg: '#fee2e2', text: '#991b1b' }; 
    return { bg: '#fef3c7', text: '#92400e' }; 
  };

  const renderEmployeeName = (req) => {
    if (req.fullName) return req.fullName;
    const emp = employees.find(e => String(e.id) === String(req.employeeId));
    return emp ? emp.fullName : `NV-${req.employeeId}`;
  };

  // lọc dữ liệu theo mã nhân viên hoặc tên
  const filteredRecords = leaveRequests.filter(req => {
    const searchLower = searchTerm.toLowerCase();
    const name = renderEmployeeName(req);
    return (
      (name && name.toLowerCase().includes(searchLower)) ||
      (req.employeeId && req.employeeId.toLowerCase().includes(searchLower))
    );
  });

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage) || 1;

  const handleExport = () => {
    const headers = ["Mã NV", "Họ Tên", "Loại nghỉ", "Từ ngày", "Đến ngày", "Lý do", "Trạng thái"];
    const rows = filteredRecords.map(req => [
      req.employeeId, renderEmployeeName(req), req.type, req.fromDate, req.toDate, req.reason, req.status
    ]);
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Bao_cao_Nghi_phep.csv`);
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
    <div style={{ marginTop: '10px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1e293b', margin: 0, fontSize: '24px' }}>Quản lý Đơn Nghỉ Phép</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExport} className="btn btn-success">
            Xuất báo cáo
          </button>
          <button onClick={() => { setFormData(initialFormState); setEditingId(null); setShowForm(true); }} className="btn btn-primary">
            + Tạo đơn mới
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Tìm kiếm theo Mã NV hoặc Tên..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); 
            }}
            style={{ width: '100%', maxWidth: '400px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
          />
          <div style={{ fontWeight: '500', color: '#475569', backgroundColor: '#f1f5f9', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            Tổng số: <strong style={{ color: '#2563eb', fontSize: '16px' }}>{filteredRecords.length}</strong> đơn nghỉ phép
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th>Nhân viên</th>
                <th>Loại nghỉ</th>
                <th>Thời gian</th>
                <th>Lý do</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'center' }}>Thao tác</th>
                <th style={{ textAlign: 'center' }}>Phê duyệt</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? currentRecords.map(req => {
                const statusStyle = getStatusStyle(req.status);
                
                // Kiểm tra xem đơn đã được duyệt/từ chối chưa
                const isProcessed = req.status === 'Đã duyệt' || req.status === 'Từ chối';

                return (
                  <tr key={req.id} className="table-row">
                    <td>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{renderEmployeeName(req)}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{req.employeeId}</div>
                    </td>
                    <td>{req.type}</td>
                    <td>{req.fromDate} → {req.toDate}</td>
                    <td style={{ maxWidth: '180px' }}>{req.reason}</td>
                    <td>
                      <span style={{ 
                        padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', 
                        backgroundColor: statusStyle.bg, color: statusStyle.text 
                      }}>
                        {req.status || 'Chờ duyệt'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => handleEdit(req)} className="btn btn-primary btn-sm" style={{ display: 'inline-block', marginRight: '5px' }}>Sửa</button>
                      <button onClick={() => handleDelete(req.id)} className="btn btn-danger btn-sm" style={{ display: 'inline-block' }}>Xóa</button>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {/* KHÓA NÚT NẾU ĐÃ XỬ LÝ */}
                      <button 
                        onClick={() => updateStatus(req.id, 'Đã duyệt')} 
                        className="btn btn-success btn-sm" 
                        disabled={isProcessed}
                        style={{ 
                          display: 'inline-block', 
                          marginRight: '5px',
                          opacity: isProcessed ? 0.5 : 1,
                          cursor: isProcessed ? 'not-allowed' : 'pointer'
                        }}>
                        Duyệt
                      </button>
                      <button 
                        onClick={() => updateStatus(req.id, 'Từ chối')} 
                        className="btn btn-danger btn-sm" 
                        disabled={isProcessed}
                        style={{ 
                          display: 'inline-block',
                          opacity: isProcessed ? 0.5 : 1,
                          cursor: isProcessed ? 'not-allowed' : 'pointer'
                        }}>
                        Từ chối
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Không tìm thấy đơn nghỉ phép nào!</td></tr>
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

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginTop: 0, textAlign: 'center', color: '#0f172a' }}>
              {editingId ? 'Sửa đơn nghỉ' : 'Tạo đơn mới'}
            </h3>
            <form onSubmit={handleSubmit} className="form-group">
              
              {/* Ô NHẬP MÃ THÔNG MINH - CÓ GỢI Ý VÀ TỰ ĐIỀN TÊN */}
              <div>
                <label className="form-label">Mã nhân viên (Gõ hoặc chọn):</label>
                <input 
                  required 
                  list="employee-suggestions"
                  placeholder="VD: EMP001" 
                  className="form-input" 
                  disabled={editingId !== null} 
                  value={formData.employeeId} 
                  onChange={e => {
                    const val = e.target.value.toUpperCase();
                    // Tìm xem mã NV vừa gõ có khớp với ai trong danh sách không
                    const matchedEmp = employees.find(emp => String(emp.id) === val || String(emp.employeeId) === val);
                    
                    setFormData({
                      ...formData, 
                      employeeId: val,
                      // Nếu tìm thấy, tự động điền tên người đó. Nếu không, giữ nguyên tên đang gõ.
                      fullName: matchedEmp ? matchedEmp.fullName : formData.fullName 
                    });
                  }} 
                />
                <datalist id="employee-suggestions">
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                  ))}
                </datalist>
              </div>

              <div>
                <label className="form-label">Tên nhân viên:</label>
                <input required placeholder="Tên nhân viên" className="form-input" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              
              <div>
                <label className="form-label">Loại nghỉ:</label>
                <select className="form-input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="Nghỉ phép năm">Nghỉ phép năm</option>
                  <option value="Nghỉ ốm">Nghỉ ốm</option>
                  <option value="Việc riêng">Việc riêng</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-col">
                  <label className="form-label">Từ ngày:</label>
                  <input required type="date" className="form-input" value={formData.fromDate} onChange={e => setFormData({...formData, fromDate: e.target.value})} />
                </div>
                <div className="form-col">
                  <label className="form-label">Đến ngày:</label>
                  <input required type="date" className="form-input" value={formData.toDate} onChange={e => setFormData({...formData, toDate: e.target.value})} />
                </div>
              </div>
              <div>
                <textarea className="form-input" placeholder="Lý do nghỉ..." value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} rows="3"></textarea>
              </div>
              <div className="form-row" style={{ justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Hủy</button>
                <button type="submit" className="btn btn-success">Lưu đơn</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaves;