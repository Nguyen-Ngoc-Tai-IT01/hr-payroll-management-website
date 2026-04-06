// backend/routes/payrollRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const payrollPath = path.join(__dirname, '../data/payroll.json');
const employeesPath = path.join(__dirname, '../data/employees.json');

// Hàm đọc file JSON an toàn
const readJsonFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.warn(`[Cảnh báo] Không tìm thấy file: ${filePath}`);
    return [];
  }
  try {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    
    fileContent = fileContent.replace(/^\uFEFF/, '').trim();
    
    return JSON.parse(fileContent);
  } catch (err) {
    throw new Error(`File ${path.basename(filePath)} đang bị sai cú pháp JSON: ${err.message}`);
  }
};

router.get('/', (req, res) => {
  try {
    const payrolls = readJsonFile(payrollPath);
    const employees = readJsonFile(employeesPath);

    if (!Array.isArray(payrolls)) {
      throw new Error("Dữ liệu trong payroll.json không phải là một mảng (Array).");
    }
    
    const safeEmployees = Array.isArray(employees) ? employees : [];

    const mergedData = payrolls.map(payroll => {
      const emp = safeEmployees.find(e => String(e.id) === String(payroll.employeeId)) || {};
      return {
        ...payroll,
        name: emp.fullName || `Nhân viên #${payroll.employeeId}`,
        department: emp.department || "Chưa cập nhật"
      };
    });

    res.status(200).json(mergedData);
  } catch (error) {
    console.error(" [Lỗi API /api/payroll]:", error.message);
    
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
});

router.get('/:id', (req, res) => {
  try {
    const payslipId = req.params.id; // Lấy ID từ URL
    
    const payrolls = readJsonFile(payrollPath);
    const employees = readJsonFile(employeesPath);

    if (!Array.isArray(payrolls)) {
      throw new Error("Dữ liệu trong payroll.json không phải là một mảng (Array).");
    }
    
    const safeEmployees = Array.isArray(employees) ? employees : [];
    const payroll = payrolls.find(p => String(p.id) === String(payslipId));

    if (payroll) {
      const emp = safeEmployees.find(e => String(e.id) === String(payroll.employeeId)) || {};
      
      const mergedPayslip = {
        ...payroll,
        name: emp.fullName || `Nhân viên #${payroll.employeeId}`,
        department: emp.department || "Chưa cập nhật"
      };

      res.status(200).json(mergedPayslip);
    } else {
      res.status(404).json({ message: 'Không tìm thấy phiếu lương này trong hệ thống!' });
    }
  } catch (error) {
    console.error(` [Lỗi API /api/payroll/${req.params.id}]:`, error.message);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
});

module.exports = router;