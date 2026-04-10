import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Auth.css';        // Style chung cho Login và Register

const Register = () => {
    const [info, setInfo] = useState({ 
        fullName: '', 
        username: '', 
        password: '',
        email: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        let tempErrors = {};

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

        if (info.password.length < 6) tempErrors.password = "Mật khẩu tối thiểu 6 ký tự";
        
        setErrors(tempErrors);
        if (Object.keys(tempErrors).length > 0) return;

        setLoading(true);

        try {
            await axios.post('http://localhost:5000/api/auth/register', info);
            
            Swal.fire({
                title: "Đăng ký thành công!",
                text: "Bạn đã tạo tài khoản thành công.",
                icon: "success",
                confirmButtonColor: "#3b82f6",
                confirmButtonText: "Đăng nhập ngay"
            }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                    navigate('/login');
                }
            });

        } catch (err) {
            const serverMsg = err.response?.data?.message || "Tên đăng nhập, Email hoặc SĐT đã tồn tại!";
            setErrors({ server: serverMsg });
            
            Swal.fire({
                title: "Lỗi đăng ký",
                text: serverMsg,
                icon: "error",
                confirmButtonColor: "#ef4444"
            });
        } finally {
            setLoading(false);
        }
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
                            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                        </div>
                        <input 
                            className={`modern-input ${errors.fullName ? "input-error" : ""}`}
                            type="text" 
                            placeholder="Nhập họ và tên..."
                            value={info.fullName}
                            onChange={e => setInfo({...info, fullName: e.target.value})} 
                        />
                    </div>

                    <div className="input-group-modern">
                        <div className="label-row">
                            <label>Email</label>
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>
                        <input 
                            className={`modern-input ${errors.email ? "input-error" : ""}`}
                            type="email" 
                            placeholder="example@gmail.com"
                            value={info.email}
                            onChange={e => setInfo({...info, email: e.target.value})} 
                        />
                    </div>

                    <div className="input-group-modern">
                        <div className="label-row">
                            <label>Số điện thoại</label>
                            {errors.phone && <span className="error-text">{errors.phone}</span>}
                        </div>
                        <input 
                            className={`modern-input ${errors.phone ? "input-error" : ""}`}
                            type="text" 
                            placeholder="09xx xxx xxx"
                            value={info.phone}
                            onChange={e => setInfo({...info, phone: e.target.value})} 
                        />
                    </div>

                    <div className="input-group-modern">
                        <div className="label-row">
                            <label>Tên đăng nhập</label>
                            {errors.username && <span className="error-text">{errors.username}</span>}
                        </div>
                        <input 
                            className={`modern-input ${errors.username ? "input-error" : ""}`}
                            type="text" 
                            placeholder="Ví dụ: tuyen_admin"
                            value={info.username}
                            onChange={e => setInfo({...info, username: e.target.value})} 
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
                            placeholder="Tối thiểu 6 ký tự"
                            value={info.password}
                            onChange={e => setInfo({...info, password: e.target.value})} 
                        />
                    </div>

                    {errors.server && <div className="server-error-box">{errors.server}</div>}
                    
                    <button 
                        type="submit" 
                        className="btn-grad-modern"
                        disabled={loading}
                    >
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