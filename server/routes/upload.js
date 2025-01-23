const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// 配置 multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 文件上传路由
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '没有文件被上传' });
  }
  res.json({
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
});

module.exports = router; 