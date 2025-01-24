const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');
const auth = require('../middleware/auth');

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
    console.error('错误堆栈:', error.stack);
    res.status(500).json({ 
      message: '获取标签列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/tags
 * @description 创建新标签
 * @access Private
 */
router.post('/', auth, async (req, res) => {
  try {
    const tag = new Tag({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description
    });
    const newTag = await tag.save();
    res.status(201).json(newTag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route PUT /api/tags/:id
 * @description 更新标签
 * @access Private
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    if (req.body.name) tag.name = req.body.name;
    if (req.body.category) tag.category = req.body.category;
    if (req.body.description !== undefined) tag.description = req.body.description;

    const updatedTag = await tag.save();
    res.json(updatedTag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route DELETE /api/tags/:id
 * @description 删除标签
 * @access Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }
    await tag.deleteOne();
    res.json({ message: '标签已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 