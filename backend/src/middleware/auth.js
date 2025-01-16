const jwt = require('jsonwebtoken');

/**
 * 验证 JWT Token 的中间件
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 * @param {Function} next - Express next 函数
 */
module.exports = function(req, res, next) {
  // 从请求头获取 token
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // 检查 token 是否存在
  if (!token) {
    return res.status(401).json({ message: '无访问权限，请先登录' });
  }

  try {
    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 将用户信息添加到请求对象
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token 无效' });
  }
}; 