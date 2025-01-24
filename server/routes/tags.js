const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

/**
 * @route GET /api/tags
 * @description 获取所有标签
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    console.log('开始获取标签列表');
    const tags = await Tag.find().sort({ category: 1, name: 1 });
    console.log(`成功获取 ${tags.length} 个标签`);
    res.json(tags);
  } catch (error) {
    console.error('获取标签列表失败:', error);
    res.status(500).json({ 
      message: '获取标签列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 