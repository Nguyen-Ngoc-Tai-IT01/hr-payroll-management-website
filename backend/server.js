// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Cấu hình Middleware
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Giúp Backend hiểu được dữ liệu dạng JSON gửi lên từ form

// ==========================================
// KHU VỰC ĐĂNG KÝ API CHO CÁC THÀNH VIÊN
// ==========================================

// 1. API Báo cáo & Admin (Của Tài)
const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);

// 2. API của team (Tạm comment để anh em code sau)
// app.use('/api/auth', require('./routes/authRoutes'));       // Tuyến
// app.use('/api/employees', require('./routes/employeeRoutes')); // Hiệp
// app.use('/api/attendance', require('./routes/attendanceRoutes')); // Sêu
// app.use('/api/payroll', require('./routes/payrollRoutes'));    // Vỹ

// API kiểm tra Server có sống không
app.get('/', (req, res) => {
  res.send('Máy chủ HR & Payroll Backend đang hoạt động tưng bừng! 🚀');
});

// Khởi động Server
app.listen(PORT, () => {
  console.log(`✅ Backend đang chạy tại http://localhost:${PORT}`);
});