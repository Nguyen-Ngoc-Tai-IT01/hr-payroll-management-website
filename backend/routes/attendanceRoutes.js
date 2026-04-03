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

// thêm
router.post('/', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        let list = JSON.parse(data.trim().replace(/^\uFEFF/, ''));
        const newRecord = { 
            ...req.body, 
            editCount: 0, // Khởi tạo lần sửa là 0
            lastEditDate: new Date().toLocaleString('vi-VN') // Ngày tạo
        };
        list.push(newRecord);
        fs.writeFile(dataPath, JSON.stringify(list, null, 2), () => res.status(201).json(newRecord));
    });
});

// cập nhật
router.put('/:id', (req, res) => {
    const recordId = req.params.id;
    fs.readFile(dataPath, 'utf8', (err, data) => {
        let list = JSON.parse(data.trim().replace(/^\uFEFF/, ''));
        const index = list.findIndex(item => item.id === recordId);
        
        if (index !== -1) {
            const currentEditCount = list[index].editCount || 0;
            list[index] = { 
                ...list[index], 
                ...req.body, 
                editCount: currentEditCount + 1, 
                lastEditDate: new Date().toLocaleString('vi-VN') 
            };
            
            fs.writeFile(dataPath, JSON.stringify(list, null, 2), () => res.json({ message: "OK" }));
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

module.exports = router;