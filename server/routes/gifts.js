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

/**
 * @route GET /api/gifts/:id
 * @description 获取单个礼物详情
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id).populate('tags');
    if (!gift) {
      return res.status(404).json({ message: '礼物不存在' });
    }
    res.json(gift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route POST /api/gifts
 * @description 创建新礼物
 * @access Private
 */
router.post('/', async (req, res) => {
  try {
    const gift = new Gift({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      coverImage: req.body.coverImage,
      tags: req.body.tags,
      background: req.body.background,
      features: req.body.features,
      status: req.body.status || 'draft'
    });
    const newGift = await gift.save();
    res.status(201).json(newGift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route PUT /api/gifts/:id
 * @description 更新礼物
 * @access Private
 */
router.put('/:id', async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift) {
      return res.status(404).json({ message: '礼物不存在' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        gift[key] = req.body[key];
      }
    });

    const updatedGift = await gift.save();
    res.json(updatedGift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route DELETE /api/gifts/:id
 * @description 删除礼物
 * @access Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift) {
      return res.status(404).json({ message: '礼物不存在' });
    }
    await gift.deleteOne();
    res.json({ message: '礼物已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 