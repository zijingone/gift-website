const express = require('express');
const router = express.Router();

// 暂时返回空数组
router.get('/', (req, res) => {
  res.json([]);
});

module.exports = router; 