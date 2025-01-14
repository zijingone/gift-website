const Tag = require('../models/Tag');

/**
 * @desc    获取所有标签
 * @route   GET /api/tags
 * @access  Public
 */
exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find().sort('category');

    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    创建标签
 * @route   POST /api/tags
 * @access  Private/Admin
 */
exports.createTag = async (req, res, next) => {
  try {
    const tag = await Tag.create(req.body);

    res.status(201).json({
      success: true,
      data: tag
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    更新标签
 * @route   PUT /api/tags/:id
 * @access  Private/Admin
 */
exports.updateTag = async (req, res, next) => {
  try {
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!tag) {
      return res.status(404).json({
        success: false,
        error: '未找到该标签'
      });
    }

    res.status(200).json({
      success: true,
      data: tag
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    删除标签
 * @route   DELETE /api/tags/:id
 * @access  Private/Admin
 */
exports.deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        error: '未找到该标签'
      });
    }

    // 检查标签是否被礼物使用
    const Gift = require('../models/Gift');
    const giftCount = await Gift.countDocuments({ 'tags.id': tag.id });
    
    if (giftCount > 0) {
      return res.status(400).json({
        success: false,
        error: '该标签正在被礼物使用,无法删除'
      });
    }

    await tag.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 