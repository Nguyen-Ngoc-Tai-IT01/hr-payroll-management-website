import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import './Auth.css';   // ← Import style chung

const Login = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        let tempErrors = {};
        if (!credentials.username.trim()) tempErrors.username = "Nhập tên đăng nhập";
        if (!credentials.password.trim()) tempErrors.password = "Nhập mật khẩu";

        setErrors(tempErrors);
        if (Object.keys(tempErrors).length > 0) return;

        setLoading(true);
        setErrors({});

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", credentials, {
                timeout: 10000,
            });

            if (res.data) {
                localStorage.setItem("user", JSON.stringify(res.data));
                
                // --- DÒNG QUAN TRỌNG NHẤT ---
                // Phát tín hiệu thông báo cho App.js biết là user đã thay đổi
                window.dispatchEvent(new Event("userChanged"));

                Swal.fire({
                    title: "Đăng nhập thành công!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => navigate("/dashboard"));
            }

        } catch (err) {
            let serverMsg = "Lỗi: Không thể kết nối đến máy chủ!";

            if (err.response?.status === 404) {
                serverMsg = "Không tìm thấy API. Backend chưa chạy.";
            } else if (err.response?.status === 401 || err.response?.status === 400) {
                serverMsg = err.response?.data?.message || "Sai tên đăng nhập hoặc mật khẩu!";
            }

            setErrors({ server: serverMsg });

            Swal.fire({
                title: "Đăng nhập thất bại",
                text: serverMsg,
                icon: "error",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setLoading(false);
        }
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

                    <button 
                        type="submit" 
                        className="btn-grad-modern"
                        disabled={loading}
                    >
                        {loading ? "Đang đăng nhập..." : "Vào hệ thống"}
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