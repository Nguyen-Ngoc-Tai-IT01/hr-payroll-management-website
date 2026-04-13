import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import './Auth.css'; 

// IMPORT DỮ LIỆU TỪ BACKEND CỦA BẠN (Sửa lại số lượng '../' cho khớp với vị trí file Login.jsx)
import employeesData from '../../../backend/data/employees.json';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/");
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    let tempErrors = {};
    if (!credentials.username.trim()) tempErrors.username = "Nhập tên đăng nhập";
    if (!credentials.password.trim()) tempErrors.password = "Nhập mật khẩu";

    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) return;

    setLoading(true);
    setErrors({});

    setTimeout(() => {
      // Gộp người dùng từ file JSON và người dùng mới tự đăng ký
      const localUsers = JSON.parse(localStorage.getItem('mock_registered_users')) || [];
      const allUsers = [...employeesData, ...localUsers];

      // Tìm user khớp tài khoản và mật khẩu
      const foundUser = allUsers.find(
        (user) => user.username === credentials.username && String(user.password) === String(credentials.password)
      );

      if (foundUser) {
        const { password, ...userToSave } = foundUser;
        localStorage.setItem("user", JSON.stringify(userToSave));
        
        window.dispatchEvent(new Event("userChanged"));

        Swal.fire({
          title: `Chào mừng, ${foundUser.fullName}!`,
          text: "Đăng nhập hệ thống thành công.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => navigate("/"));
      } else {
        const errorMsg = "Tài khoản hoặc mật khẩu không chính xác!";
        setErrors({ server: errorMsg });

        Swal.fire({
          title: "Đăng nhập thất bại",
          text: errorMsg,
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-modern">
        <div className="auth-header">
          <h2>ĐĂNG NHẬP</h2>
        </div>

        {errors.server && (
          <div className="server-error-box">
            <span>⚠️</span> {errors.server}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group-modern">
            <div className="label-row">
              <label>Tên đăng nhập</label>
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>
            <input
              className={`modern-input ${errors.username ? "input-error" : ""}`}
              type="text"
              placeholder="Nhập tài khoản của bạn..."
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </div>

          <div className="input-group-modern">
            <div className="label-row">
              <label>Mật khẩu</label>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            <input
              className={`modern-input ${errors.password ? "input-error" : ""}`}
              type="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-grad-modern" disabled={loading}>
            {loading ? "Đang xử lý..." : "Vào hệ thống"}
          </button>
        </form>

        <p className="auth-footer">
          Chưa có tài khoản? <Link to="/register">Đăng ký thành viên</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;