const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Đường dẫn đến các file dữ liệu
const leavesPath = path.join(__dirname, '../data/leaves.json');
const attendancePath = path.join(__dirname, '../data/attendance.json');

// Hàm bổ trợ: Đọc file JSON an toàn
const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data.trim().replace(/^\uFEFF/, ''));
    } catch (err) {
        console.error(`Lỗi đọc file tại ${filePath}:`, err);
        return [];
    }
};

// lấy danh sách
router.get('/', (req, res) => {
    const list = readJsonFile(leavesPath);
    res.json(list);
});

// tạo đơn mới
router.post('/', (req, res) => {
    try {
        let list = readJsonFile(leavesPath);
        const newRecord = { 
            ...req.body,
            id: Date.now(), // Tạo ID số duy nhất
            status: req.body.status || 'Chờ duyệt'
        };
        list.push(newRecord);
        fs.writeFileSync(leavesPath, JSON.stringify(list, null, 2));
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi tạo đơn mới" });
    }
});

// cập nhật và XỬ LÝ LOGIC TRỪ/CỘNG CÔNG
router.put('/:id', (req, res) => {
    try {
        const leaveId = req.params.id; 
        const updateData = req.body;
        
        let leavesList = readJsonFile(leavesPath);
        const leaveIndex = leavesList.findIndex(l => String(l.id) === String(leaveId));

        if (leaveIndex === -1) return res.status(404).json({ message: "Không tìm thấy đơn" });

        const oldRecord = leavesList[leaveIndex];
        const newStatus = updateData.status;

        // Tính toán số ngày nghỉ
        const start = new Date(oldRecord.fromDate);
        const end = new Date(oldRecord.toDate);
        const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;

        let attList = readJsonFile(attendancePath);
        const attIndex = attList.findIndex(a => String(a.employeeId) === String(oldRecord.employeeId));

        if (attIndex !== -1) {
            let currentDays = parseFloat(attList[attIndex].actualDays) || 0;

            // TRƯỜNG HỢP 1: Duyệt đơn -> Trừ công
            if (newStatus === 'Đã duyệt' && oldRecord.status !== 'Đã duyệt') {
                attList[attIndex].actualDays = Math.max(0, currentDays - diffDays);
                fs.writeFileSync(attendancePath, JSON.stringify(attList, null, 2));
            } 
            // TRƯỜNG HỢP 2: Hủy duyệt (Từ chối) -> Hoàn lại công
            else if (newStatus === 'Từ chối' && oldRecord.status === 'Đã duyệt') {
                attList[attIndex].actualDays = currentDays + diffDays;
                fs.writeFileSync(attendancePath, JSON.stringify(attList, null, 2));
            }
        }

        // Cập nhật dữ liệu nghỉ phép
        leavesList[leaveIndex] = { ...oldRecord, ...updateData };
        fs.writeFileSync(leavesPath, JSON.stringify(leavesList, null, 2));
        
        res.json(leavesList[leaveIndex]);
    } catch (err) {
        res.status(500).json({ message: "Lỗi hệ thống khi cập nhật" });
    }
});

// xoá
router.delete('/:id', (req, res) => {
    try {
        const idToDelete = req.params.id;
        let list = readJsonFile(leavesPath);
        
        const newList = list.filter(item => String(item.id) !== String(idToDelete));
        
        if (list.length === newList.length) {
            return res.status(404).json({ message: "Không tìm thấy ID để xóa" });
        }

        fs.writeFileSync(leavesPath, JSON.stringify(newList, null, 2));
        res.json({ message: "Đã xóa thành công" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi xóa đơn" });
    }
});

module.exports = router;