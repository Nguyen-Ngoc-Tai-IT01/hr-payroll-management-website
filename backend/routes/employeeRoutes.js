// sêu lấy danh sách nhân viên có gì hiệp thêm ở dưới nhé dòng này không xoá
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/employees.json');


router.get('/', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: "Lỗi đọc file employees" });

        // fix lỗi ký tự lạ giống hệt file attendance
        res.json(JSON.parse(data.trim().replace(/^\uFEFF/, '')));
    });
});

module.exports = router;