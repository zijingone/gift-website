const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// 登录路由
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // 简单的用户验证
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    res.json({ token });
  } else {
    res.status(401).json({ message: '用户名或密码错误' });
  }
});

module.exports = router; 