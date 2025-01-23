const express = require('express');
const router = express.Router();

// 获取礼物列表
router.get('/', (req, res) => {
  res.json([]);  // 暂时返回空数组
});

module.exports = router; 