// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Hàm đọc file JSON tự động
function readJsonFile(filename) {
    const filePath = path.join(__dirname, '../data', filename);
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
}

// API 1: Lấy dữ liệu tổng quan cho trang Dashboard (http://localhost:5000/api/reports/dashboard)
router.get('/dashboard', (req, res) => {
    try {
        const dashboardData = readJsonFile('dashboard.json');
        res.json({
            success: true,
            data: dashboardData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi đọc file dữ liệu báo cáo" });
    }
});

// API 2: Lấy dữ liệu nhân sự (http://localhost:5000/api/reports/employees)
router.get('/employees', (req, res) => {
    try {
        const employees = readJsonFile('employees.json');
        
        const activeCount = employees.filter(emp => emp.status === "Đang làm việc").length;
        
        res.json({
            success: true,
            total: employees.length,
            active: activeCount,
            list: employees
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi lấy dữ liệu nhân sự" });
    }
});

module.exports = router;