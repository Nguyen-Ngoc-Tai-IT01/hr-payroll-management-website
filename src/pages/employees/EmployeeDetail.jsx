import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function EmployeeDetail() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/employees/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy nhân viên!");
        return res.json();
      })
      .then((data) => {
        setEmployee(data.data || data);
        setLoading(false);
      })
      .catch(() => {
        // fallback
        fetch("http://localhost:5000/api/employees")
          .then((res) => res.json())
          .then((allData) => {
            const list = allData.data || allData;
            const found = list.find((e) => e.id === id);

            if (found) {
              setEmployee(found);
            } else {
              setError("Không tìm thấy nhân viên");
            }
            setLoading(false);
          })
          .catch(() => {
            setError("Lỗi kết nối server");
            setLoading(false);
          });
      });
  }, [id]);

  if (loading)
    return <h3 style={{ textAlign: "center" }}>⏳ Đang tải...</h3>;

  if (error)
    return (
      <div style={{ textAlign: "center" }}>
        <h3 style={{ color: "red" }}>{error}</h3>
        <Link to="/employees">← Quay lại</Link>
      </div>
    );

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h2>👤 Hồ sơ nhân viên</h2>

      <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "10px" }}>
        <p><b>ID:</b> {employee.id}</p>
        <p><b>Tên:</b> {employee.fullName}</p>
        <p><b>Phòng ban:</b> {employee.department}</p>
        <p><b>Chức vụ:</b> {employee.position}</p>
        <p><b>Email:</b> {employee.email}</p>
        <p><b>SĐT:</b> {employee.phone}</p>
        <p><b>Trạng thái:</b> {employee.status}</p>
      </div>

      <br />

      <Link to="/employees">← Quay lại danh sách</Link>
    </div>
  );
}

export default EmployeeDetail;