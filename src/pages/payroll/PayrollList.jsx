import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./Payroll.module.css";

const PayrollList = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const VIP_ADMINS = ["EMP001", "EMP002", "EMP003", "EMP004", "EMP005"];
  const isPrivileged = VIP_ADMINS.includes(currentUser.id);

  useEffect(() => {
    fetch("http://localhost:5000/api/payroll")
      .then(async (res) => {
        if (!res.ok) throw new Error("Lỗi Backend");
        return res.json();
      })
      .then((data) => {
        setPayrolls(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setPayrolls([]);
        setErrorMsg("Không thể kết nối đến Backend.");
        setLoading(false);
      });
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);
  };

  const formatMonthYear = (month, year) => {
    if (typeof month === 'string' && month.includes('/')) return month;
    const monthStr = String(month).padStart(2, '0');
    return year ? `${monthStr}/${year}` : monthStr;
  };

  // HÀM CHUẨN HÓA ID THÔNG MINH: Chuyển "EMP008" -> 8 để so sánh khớp với dữ liệu JSON
  const isMatchingId = (id1, id2) => {
    const num1 = parseInt(String(id1).replace(/[^0-9]/g, ''), 10);
    const num2 = parseInt(String(id2).replace(/[^0-9]/g, ''), 10);
    return num1 === num2;
  };

  const filteredPayrolls = useMemo(() => {
    if (!Array.isArray(payrolls)) return [];

    return payrolls.filter((row) => {
      // KIỂM TRA QUYỀN BẰNG HÀM CHUẨN HÓA ID
      if (!isPrivileged) {
        const matchId = isMatchingId(row.employeeId, currentUser.id);
        const matchName = String(row.name || "").trim().toLowerCase() === String(currentUser.fullName || "").trim().toLowerCase();
        
        if (!matchId && !matchName) return false;
      }

      const safeEmployeeId = String(row.employeeId || "");
      const safeName = String(row.name || "").toLowerCase();
      const searchLower = searchTerm.toLowerCase();

      const matchSearch = safeEmployeeId.includes(searchLower) || safeName.includes(searchLower);
      const rowMonthStr = formatMonthYear(row.month, row.year);
      const matchMonth = filterMonth === "" || rowMonthStr === filterMonth;

      return matchSearch && matchMonth;
    });
  }, [payrolls, searchTerm, filterMonth, currentUser.id, currentUser.fullName, isPrivileged]);

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px", color: "#64748b" }}>Đang tải dữ liệu...</h2>;

  return (
    <div className={styles.container} style={{ maxWidth: "none", width: "100%", padding: "10px 24px", boxSizing: "border-box" }}>
      <h2 className={styles.title}>{isPrivileged ? "Bảng Lương Tổng Hợp" : "Phiếu Lương Cá Nhân"}</h2>

      {errorMsg && <div style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "15px", borderRadius: "8px", marginBottom: "20px", fontWeight: "bold" }}>{errorMsg}</div>}

      <div className={styles.filterContainer}>
        {isPrivileged && (
          <input
            type="text"
            placeholder="Tìm theo Mã hoặc Tên NV..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}

        <select className={styles.filterSelect} value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
          <option value="">-- Tất cả các tháng --</option>
          <option value="02/2026">Tháng 02/2026</option>
          <option value="03/2026">Tháng 03/2026</option>
          <option value="04/2026">Tháng 04/2026</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.payrollTable}>
          <thead>
            <tr>
              <th>Mã Phiếu</th>
              <th>Mã NV</th>
              <th>Phòng Ban</th>
              <th>Tháng</th>
              <th>Lương Cơ Bản</th>
              <th>Thực Lãnh</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: "center" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayrolls.length > 0 ? (
              filteredPayrolls.map((row) => (
                <tr key={row.id}>
                  <td>PR{String(row.id).padStart(3, "0")}</td>
                  {/* Hiển thị Mã NV thay vì Tên vì JSON của bạn đang thiếu trường Name */}
                  <td style={{ fontWeight: "bold", color: "#334155" }}>EMP{String(row.employeeId).replace(/[^0-9]/g, '').padStart(3, "0")}</td>
                  <td>{row.department || 'Chưa cập nhật'}</td>
                  <td>{formatMonthYear(row.month, row.year)}</td>
                  <td>{formatCurrency(row.baseSalary)}</td>
                  <td className={styles.netSalaryText}>{formatCurrency(row.netSalary)}</td>
                  <td>
                    <span style={{ padding: "6px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", backgroundColor: row.paymentStatus === "Đã thanh toán" ? "#dcfce7" : "#fef08a", color: row.paymentStatus === "Đã thanh toán" ? "#166534" : "#854d0e" }}>
                      {row.paymentStatus}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Link to={`/payroll/payslip/${row.id}`} className={styles.actionBtn}>Xem chi tiết</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" className={styles.noData}>{errorMsg ? "Không có dữ liệu do lỗi Backend." : "Chưa có dữ liệu phiếu lương của bạn."}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollList;