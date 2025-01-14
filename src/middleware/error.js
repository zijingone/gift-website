/**
 * 错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  console.error(err);

  let error = { ...err };
  error.message = err.message;

  // Mongoose 错误处理
  if (err.name === 'CastError') {
    error.message = '无效的ID格式';
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  if (err.code === 11000) {
    error.message = '该记录已存在';
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || '服务器内部错误'
  });
};

module.exports = errorHandler; 