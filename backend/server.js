const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');

const payrollRoutes = require('./routes/payrollRoutes');
const authRoutes = require('./routes/authRoutes');


const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// --- ROUTES CỦA CẢ NHÓM ĐÃ GỘP CHUNG ---
app.use('/api/auth', authRoutes);             // Của Tuyến
app.use('/api/payroll', payrollRoutes);       // Của Vỹ
app.use('/api/attendance', require('./routes/attendanceRoutes'));  // Của Sêu
app.use('/api/employees', require('./routes/employeeRoutes'));    // Của hiệp sêu lấy để dùng
app.use('/api/leaves', require('./routes/leaveRoutes'));          // Của Sêu

app.get('/', (req, res) => {
    res.send('Server Node.js đang chạy mượt mà!');
});

app.listen(PORT, () => {
    console.log(`Server chạy tại: http://localhost:${PORT}`);
});