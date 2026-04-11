const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/attendance.json');

// hàm hỗ trợ đọc và parse JSON an toàn
const getAttendanceList = (data) => {
    return JSON.parse(data.trim().replace(/^\uFEFF/, ''));
};

// lấy dữ liệu
router.get('/', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: "Lỗi đọc file" });
        try {
            res.json(getAttendanceList(data));
        } catch (e) {
            res.status(500).json({ message: "Dữ liệu JSON không hợp lệ" });
        }
    });
});

// thêm mới 
router.post('/', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: "Lỗi đọc file" });

        let list = JSON.parse(data.trim().replace(/^\uFEFF/, ''));
        
        // Tìm xem mã NV employeeId đã tồn tại trong list chưa
        const isExist = list.some(item => String(item.employeeId).toUpperCase() === String(req.body.employeeId).toUpperCase());
        
        if (isExist) {
            // Nếu đã có rồi, chặn lại và báo lỗi về cho giao diện React
            return res.status(400).json({ message: `Nhân viên có mã ${req.body.employeeId} đã có bảng chấm công!` });
        }

        // Nếu chưa có, tiến hành thêm mới bình thường
        const newRecord = { 
            ...req.body, 
            editCount: 0, 
            lastEditDate: new Date().toLocaleString('vi-VN') 
        };
        list.push(newRecord);
        fs.writeFile(dataPath, JSON.stringify(list, null, 2), () => res.status(201).json(newRecord));
    });
});

// cập nhật kể cả Check-in tự động và lưu lịch sử
router.put('/:id', (req, res) => {
    const recordId = req.params.id;
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: "Lỗi đọc file" });

        let list = JSON.parse(data.trim().replace(/^\uFEFF/, ''));
        const index = list.findIndex(item => item.id === recordId);
        
        if (index !== -1) {
            const oldRecord = list[index];
            const newRecord = req.body;
            
            // Lấy danh sách lịch sử cũ 
            let logs = oldRecord.checkInLogs || [];

            // Thì mình sẽ ghi log lại
            if (parseFloat(newRecord.actualDays) !== parseFloat(oldRecord.actualDays)) {
                const now = new Date();
                logs.push({
                    timestamp: now.toISOString(), 
                    dateStr: now.toLocaleDateString('vi-VN'),
                    timeStr: now.toLocaleTimeString('vi-VN'),
                    oldDays: oldRecord.actualDays,
                    newDays: newRecord.actualDays
                });
            }

            // Cập nhật lại toàn bộ cục dữ liệu
            list[index] = { 
                ...oldRecord, 
                ...newRecord, 
                checkInLogs: logs, 
                editCount: (oldRecord.editCount || 0) + 1, 
                lastEditDate: new Date().toLocaleString('vi-VN') 
            };
            
            fs.writeFile(dataPath, JSON.stringify(list, null, 2), () => res.json({ message: "OK" }));
        } else {
            res.status(404).json({ message: "Không tìm thấy dữ liệu" });
        }
    });
});

// xoá 
router.delete('/:id', (req, res) => {
    const recordId = req.params.id;
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: "Lỗi đọc file" });
        
        let attendanceList = getAttendanceList(data);
        const newList = attendanceList.filter(item => item.id !== recordId);
        
        if (attendanceList.length === newList.length) {
            return res.status(404).json({ message: "Không tìm thấy bản ghi để xóa" });
        }

        fs.writeFile(dataPath, JSON.stringify(newList, null, 2), (err) => {
            if (err) return res.status(500).json({ message: "Lỗi ghi file" });
            res.json({ message: "Xóa thành công" });
        });
    });
});

// reset tháng mới xóa ngày công và lịch sử
router.post('/reset-month', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: "Lỗi đọc file" });

        let list = JSON.parse(data.trim().replace(/^\uFEFF/, ''));
        const newMonth = req.body.month || "05/2026";

        list = list.map(item => ({
            ...item,
            month: newMonth,
            actualDays: 0,
            lateCount: 0,
            overtimeHours: 0,
            checkInLogs: [],
            editCount: 0,
            lastEditDate: new Date().toLocaleString('vi-VN')
        }));

        fs.writeFile(dataPath, JSON.stringify(list, null, 2), () => {
            res.json({ message: `Đã khởi tạo thành công cho tháng ${newMonth}` });
        });
    });
});

module.exports = router;