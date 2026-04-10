import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./style.css";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Load dữ liệu từ backend
  const loadEmployees = () => {
    fetch("http://localhost:5000/api/employees")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy dữ liệu:", err);
        Swal.fire("Lỗi", "Không thể kết nối server", "error");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Xóa nhân viên
  const handleDelete = (id) => {
    Swal.fire({
      title: "Xóa nhân viên?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/api/employees/${id}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (res.ok) {
              Swal.fire("Đã xóa!", "", "success");
              loadEmployees();
            } else {
              throw new Error();
            }
          })
          .catch(() => {
            Swal.fire("Lỗi", "Không thể xóa", "error");
          });
      }
    });
  };

  // Tìm kiếm
  const filteredEmployees = employees.filter((emp) => {
    const keyword = searchTerm.toLowerCase();
    return (
      emp.fullName?.toLowerCase().includes(keyword) ||
      emp.id?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="card">
      {/* HEADER */}
      <div className="card-header">
        <h2>👥 Danh sách nhân sự</h2>

        <Link to="/employees/new" className="btn btn-primary">
          + Thêm nhân viên
        </Link>
      </div>

      {/* SEARCH */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="🔍 Tìm theo mã hoặc tên..."
          className="input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <p>⏳ Đang tải...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Mã NV</th>
              <th>Họ tên</th>
              <th>Phòng ban</th>
              <th>Chức vụ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.fullName}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td>{emp.status}</td>
                  <td>
                    <Link
                      to={`/employees/${emp.id}`}
                      className="btn btn-sm"
                    >
                      Xem
                    </Link>

                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="btn btn-sm"
                      style={{ marginLeft: "5px", color: "red" }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmployeeList;