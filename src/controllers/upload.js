const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

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

    try {
      // 上传到 Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'gift-website',
        use_filename: true,
        unique_filename: true
      });

      // 删除本地临时文件
      fs.unlinkSync(req.file.path);

      res.status(200).json({
        success: true,
        url: result.secure_url,
        fileName: result.original_filename
      });
    } catch (uploadError) {
      // 删除本地临时文件
      fs.unlinkSync(req.file.path);
      throw uploadError;
    }
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
    for (const file of req.files) {
      const mimeType = fileTypes.test(file.mimetype);
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

      if (!mimeType || !extname) {
        // 删除不符合类型的文件
        fs.unlinkSync(file.path);
        errors.push(`文件 ${file.originalname} 格式不支持`);
      } else {
        try {
          // 上传到 Cloudinary
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'gift-website',
            use_filename: true,
            unique_filename: true
          });

          uploadedFiles.push({
            fileName: result.original_filename,
            url: result.secure_url
          });
        } catch (uploadError) {
          errors.push(`文件 ${file.originalname} 上传失败: ${uploadError.message}`);
        } finally {
          // 删除本地临时文件
          fs.unlinkSync(file.path);
        }
      }
    }

    if (errors.length > 0 && uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    res.status(200).json({
      success: true,
      urls: uploadedFiles.map(file => file.url),
      fileNames: uploadedFiles.map(file => file.fileName),
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    next(err);
  }
}; 