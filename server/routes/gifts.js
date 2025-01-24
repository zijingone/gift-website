const express = require('express');
const router = express.Router();
const Gift = require('../models/Gift');

/**
 * @route GET /api/gifts
 * @description 获取礼物列表
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    console.log('开始获取礼物列表，查询参数:', req.query);
    const { tags, keyword, status } = req.query;
    const query = {};

    // 默认只返回已发布的礼物
    query.status = 'published';

    // 根据标签筛选
    if (tags) {
      query.tags = { $in: tags.split(',') };
      console.log('添加标签筛选:', tags);
    }

    // 根据关键词搜索
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
      console.log('添加关键词搜索:', keyword);
    }

    console.log('最终查询条件:', JSON.stringify(query, null, 2));

    const gifts = await Gift.find(query)
      .populate('tags')
      .sort({ createdAt: -1 });

    console.log(`成功获取 ${gifts.length} 个礼物`);
    
    res.json(gifts);
  } catch (error) {
    console.error('获取礼物列表失败:', error);
    res.status(500).json({ 
      message: '获取礼物列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 