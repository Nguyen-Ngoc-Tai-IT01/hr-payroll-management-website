const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); 

// sêu
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));

app.get('/', (req, res) => {
    res.send('Server Node.js đang chạy mượt mà!');
});

app.listen(PORT, () => {
    console.log(`Server chạy tại: http://localhost:${PORT}`);
});