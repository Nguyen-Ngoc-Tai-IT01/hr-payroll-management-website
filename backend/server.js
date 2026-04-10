// backend/server.js
const express = require('express');
const cors = require('cors');
const payrollRoutes = require('./routes/payrollRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- ROUTES CỦA CẢ NHÓM ĐÃ GỘP CHUNG ---
app.use('/api/payroll', payrollRoutes);       // Của Vỹ
app.use('/api/attendance', require('./routes/attendanceRoutes'));  // Của Sêu
app.use('/api/employees', require('./routes/employeeRoutes'));    // Của hiệp sêu lấy để dùng
app.use('/api/leaves', require('./routes/leaveRoutes'));          // Của Sêu

app.get('/', (req, res) => {
  res.send('HR Payroll Backend is running!');
});

// Chạy server
app.listen(PORT, () => {
  console.log(`Server Backend đang chạy tại http://localhost:${PORT}`);
});