const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * 验证JWT Token的中间件
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 从请求头获取token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 检查token是否存在
    if (!token) {
      return res.status(401).json({
        success: false,
        error: '未授权访问'
      });
    }

    try {
      // 验证token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 获取用户信息
      req.user = await User.findById(decoded.id);
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: '无效的token'
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
};

/**
 * 验证用户角色的中间件
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: '无权限执行此操作'
      });
    }
    next();
  };
}; 