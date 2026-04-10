const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Đường dẫn đến file dữ liệu chung của nhóm
const DATA_PATH = path.join(__dirname, '..', 'data', 'employees.json');

/**
 * Hàm đọc dữ liệu từ file JSON
 * Đã xử lý các lỗi về ký tự đặc biệt (BOM) và khoảng trắng
 */
const readData = () => {
    try {
        if (!fs.existsSync(DATA_PATH)) return [];
        let data = fs.readFileSync(DATA_PATH, 'utf8');

        // Xóa ký tự BOM và dọn dẹp dữ liệu thừa
        data = data.replace(/^\uFEFF/, '').trim();
        
        if (!data) return [];
        return JSON.parse(data);
    } catch (error) {
        console.error("❌ Lỗi cấu trúc file JSON:", error.message);
        return [];
    }
};

/**
 * --- ĐĂNG KÝ (REGISTER) ---
 */
router.post('/register', (req, res) => {
    const { fullName, username, password } = req.body;
    try {
        const users = readData();

        if (!fullName || !username || !password) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }

        // Kiểm tra trùng lặp tài khoản
        if (users.find(u => u.username === username)) {
            return res.status(409).json({ message: "Tên đăng nhập đã tồn tại!" });
        }

        const newUser = {
            id: `EMP${Date.now().toString().slice(-3)}`,
            username,
            password: String(password),
            fullName,
            email: `${username}@it24b.vn`,
            phone: "Chưa cập nhật",
            department: "Chưa phân phòng",
            position: "Nhân viên mới",
            role: "Employee",
            baseSalary: 10000000,
            joinDate: new Date().toISOString().split('T')[0],
            status: "Đang làm việc"
        };

        users.push(newUser);
        fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2), 'utf8');

        res.status(201).json({ success: true, message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống khi lưu nhân viên mới!" });
    }
});

/**
 * --- ĐĂNG NHẬP (LOGIN) ---
 * Đã sửa lại để trả về Object User trực tiếp
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    try {
        const users = readData();
        
        // Tìm user khớp username và password
        const user = users.find(u => 
            u.username && 
            u.username === username && 
            String(u.password) === String(password)
        );

        if (!user) {
            return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không chính xác!" });
        }

        // Loại bỏ password trước khi gửi về Frontend để bảo mật
        const { password: _, ...userData } = user;

        res.json(userData); 

    } catch (error) {
        console.error("🔥 Login Error:", error);
        res.status(500).json({ message: "Lỗi hệ thống khi xác thực!" });
    }
});

module.exports = router;