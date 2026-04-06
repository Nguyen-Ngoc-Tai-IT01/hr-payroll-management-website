// backend/server.js
const express = require('express');
const cors = require('cors'); 
const payrollRoutes = require('./routes/payrollRoutes'); 

const app = express();
const PORT = 5000;


app.use(cors());
<<<<<<< Updated upstream
app.use(bodyParser.json());
app.use(express.json()); 

// sêu
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
=======


app.use(express.json()); 

app.use('/api/payroll', payrollRoutes);
>>>>>>> Stashed changes

app.get('/', (req, res) => {
  res.send('HR Payroll Backend is running!');
});

// Chạy server
app.listen(PORT, () => {
  console.log(`Server Backend đang chạy tại http://localhost:${PORT}`);
});