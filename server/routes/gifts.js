const express = require('express');
const router = express.Router();
const Gift = require('../models/Gift');
const auth = require('../middleware/auth');

/**
 * @route GET /api/gifts
 * @description 获取礼物列表
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const { tags, keyword, status } = req.query;
    const query = {};

    // 根据状态筛选
    if (status) {
      query.status = status;
    }

    // 根据标签筛选
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    // 根据关键词搜索
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    const gifts = await Gift.find(query)
      .populate('tags')
      .sort({ createdAt: -1 });

    res.json(gifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
router.post('/', auth, async (req, res) => {
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
router.put('/:id', auth, async (req, res) => {
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
router.delete('/:id', auth, async (req, res) => {
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