import React, { useState } from "react";
// import axios from 'axios'; // Tạm thời comment axios vì sử dụng Mock Data nội bộ
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./Auth.css"; // Style chung cho Login và Register

const Register = () => {
  const [info, setInfo] = useState({
    fullName: "",
    username: "",
    password: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    let tempErrors = {};

    // --- VALIDATION NGUYÊN BẢN CỦA NHÓM ---
    if (!info.fullName.trim()) tempErrors.fullName = "Nhập họ tên của bạn";
    if (!info.username.trim()) tempErrors.username = "Nhập tên đăng nhập";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!info.email.trim()) {
      tempErrors.email = "Nhập địa chỉ Email";
    } else if (!emailRegex.test(info.email)) {
      tempErrors.email = "Email không đúng định dạng";
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!info.phone.trim()) {
      tempErrors.phone = "Nhập số điện thoại";
    } else if (!phoneRegex.test(info.phone)) {
      tempErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (info.password.length < 6)
      tempErrors.password = "Mật khẩu tối thiểu 6 ký tự";

    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) return;

    setLoading(true);

    // --- GIẢ LẬP GỌI API BACKEND (MOCK DATA) ---
    setTimeout(() => {
      // Lấy danh sách user đã đăng ký tạm từ localStorage (nếu có)
      const existingUsers =
        JSON.parse(localStorage.getItem("mock_registered_users")) || [];

      // Kiểm tra xem username hoặc email đã bị trùng lặp chưa
      const isDuplicate = existingUsers.some(
        (user) => user.username === info.username || user.email === info.email,
      );

      if (isDuplicate) {
        const serverMsg = "Tên đăng nhập hoặc Email đã tồn tại trong hệ thống!";
        setErrors({ server: serverMsg });

        Swal.fire({
          title: "Lỗi đăng ký",
          text: serverMsg,
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
        setLoading(false);
        return; // Dừng lại nếu trùng lặp
      }

      // Nếu hợp lệ, tạo user mới với trạng thái Chờ duyệt
      const newUser = {
        ...info,
        id: `EMP_NEW_${Math.floor(Math.random() * 1000)}`,
        department: "Chưa phân bổ",
        position: "Nhân viên mới",
        role: "Employee",         // Sửa thành quyền Nhân viên
        status: "Đang làm việc",  // Sửa thành Đang làm việc để không bị khóa
        baseSalary: 10000000      // (Tùy chọn) Thêm mức lương cơ bản để tiện test bảng lương
      };

      // Lưu vào "Database giả" trên trình duyệt
      existingUsers.push(newUser);
      localStorage.setItem(
        "mock_registered_users",
        JSON.stringify(existingUsers),
      );

      // Hiển thị thông báo thành công
      Swal.fire({
        title: "Đăng ký thành công!",
        text: "Tài khoản của bạn đã được tạo và đang chờ Admin phê duyệt.",
        icon: "success",
        confirmButtonColor: "#3b82f6",
        confirmButtonText: "Đến trang Đăng nhập",
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          navigate("/login");
        }
      });

      setLoading(false);
    }, 800); // Giả lập mạng chậm 0.8 giây cho chân thực
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-modern">
        <div className="auth-header">
          <h2>ĐĂNG KÝ</h2>
          <p>Khởi tạo tài khoản của bạn</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="input-group-modern">
            <div className="label-row">
              <label>Họ và Tên</label>
              {errors.fullName && (
                <span className="error-text">{errors.fullName}</span>
              )}
            </div>
            <input
              className={`modern-input ${errors.fullName ? "input-error" : ""}`}
              type="text"
              placeholder="Nhập họ và tên..."
              value={info.fullName}
              onChange={(e) => setInfo({ ...info, fullName: e.target.value })}
            />
          </div>

          <div className="input-group-modern">
            <div className="label-row">
              <label>Email</label>
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>
            <input
              className={`modern-input ${errors.email ? "input-error" : ""}`}
              type="email"
              placeholder="example@gmail.com"
              value={info.email}
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
            />
          </div>

          <div className="input-group-modern">
            <div className="label-row">
              <label>Số điện thoại</label>
              {errors.phone && (
                <span className="error-text">{errors.phone}</span>
              )}
            </div>
            <input
              className={`modern-input ${errors.phone ? "input-error" : ""}`}
              type="text"
              placeholder="09xx xxx xxx"
              value={info.phone}
              onChange={(e) => setInfo({ ...info, phone: e.target.value })}
            />
          </div>

          <div className="input-group-modern">
            <div className="label-row">
              <label>Tên đăng nhập</label>
              {errors.username && (
                <span className="error-text">{errors.username}</span>
              )}
            </div>
            <input
              className={`modern-input ${errors.username ? "input-error" : ""}`}
              type="text"
              placeholder="Ví dụ: tuyen_admin"
              value={info.username}
              onChange={(e) => setInfo({ ...info, username: e.target.value })}
            />
          </div>

          <div className="input-group-modern">
            <div className="label-row">
              <label>Mật khẩu</label>
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>
            <input
              className={`modern-input ${errors.password ? "input-error" : ""}`}
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={info.password}
              onChange={(e) => setInfo({ ...info, password: e.target.value })}
            />
          </div>

          {errors.server && (
            <div className="server-error-box">{errors.server}</div>
          )}

          <button type="submit" className="btn-grad-modern" disabled={loading}>
            {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </button>
        </form>

        <p className="auth-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
