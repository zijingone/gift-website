const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 确保上传目录存在
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const mimeType = fileTypes.test(file.mimetype);
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extname) {
    cb(null, true);
  } else {
    cb(new Error('只支持 jpeg, jpg, png, gif 格式的图片'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// 上传单个文件
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '请选择要上传的文件'
      });
    }

    // 上传到 Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'gift-website',
      use_filename: true,
      unique_filename: true
    });

    // 删除本地临时文件
    fs.unlinkSync(req.file.path);

    // 确保返回正确的响应格式
    res.json({
      success: true,
      data: {
        fileName: result.original_filename,
        fileUrl: result.secure_url
      }
    });
  } catch (error) {
    console.error('上传失败:', error);
    // 如果文件存在，删除临时文件
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      error: error.message || '上传失败'
    });
  }
});

// 上传多个文件
router.post('/multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: '请选择要上传的文件'
      });
    }

    const uploadedFiles = [];
    const errors = [];

    // 处理每个文件
    for (const file of req.files) {
      try {
        // 上传到 Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'gift-website',
          use_filename: true,
          unique_filename: true
        });

        uploadedFiles.push({
          fileName: result.original_filename,
          fileUrl: result.secure_url
        });
      } catch (uploadError) {
        errors.push(`文件 ${file.originalname} 上传失败: ${uploadError.message}`);
      } finally {
        // 删除本地临时文件
        fs.unlinkSync(file.path);
      }
    }

    if (errors.length > 0 && uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    res.json({
      success: true,
      data: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('上传失败:', error);
    res.status(500).json({
      success: false,
      error: '上传失败'
    });
  }
});

module.exports = router; 