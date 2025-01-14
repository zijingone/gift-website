const path = require('path');
const fs = require('fs');

/**
 * @desc    上传单个文件
 * @route   POST /api/upload
 * @access  Private/Admin
 */
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '请选择要上传的文件'
      });
    }

    // 检查文件类型
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(req.file.mimetype);
    const extname = fileTypes.test(path.extname(req.file.originalname).toLowerCase());

    if (!mimeType || !extname) {
      // 删除不符合类型的文件
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: '只支持 jpeg, jpg, png, gif 格式的图片'
      });
    }

    // 生成文件URL
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      data: {
        fileName: req.file.filename,
        fileUrl
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    上传多个文件
 * @route   POST /api/upload/multiple
 * @access  Private/Admin
 */
exports.uploadMultipleFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: '请选择要上传的文件'
      });
    }

    const fileTypes = /jpeg|jpg|png|gif/;
    const uploadedFiles = [];
    const errors = [];

    // 处理每个文件
    req.files.forEach(file => {
      const mimeType = fileTypes.test(file.mimetype);
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

      if (!mimeType || !extname) {
        // 删除不符合类型的文件
        fs.unlinkSync(file.path);
        errors.push(`文件 ${file.originalname} 格式不支持`);
      } else {
        uploadedFiles.push({
          fileName: file.filename,
          fileUrl: `/uploads/${file.filename}`
        });
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    res.status(200).json({
      success: true,
      data: uploadedFiles
    });
  } catch (err) {
    next(err);
  }
}; 