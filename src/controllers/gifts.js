const Gift = require('../models/Gift');

/**
 * @desc    获取所有礼物
 * @route   GET /api/gifts
 * @access  Public
 */
exports.getGifts = async (req, res, next) => {
  try {
    const { tags, status, keyword } = req.query;
    const query = {};

    // 根据标签筛选
    if (tags) {
      query['tags.id'] = { $in: tags.split(',') };
    }

    // 根据状态筛选
    if (status && status !== 'all') {
      if (status === 'published') {
        query.status = 'published';
        query.publishTime = { $lte: new Date() };
      } else if (status === 'scheduled') {
        query.status = 'scheduled';
        query.publishTime = { $gt: new Date() };
      } else {
        query.status = status;
      }
    } else {
      // 公开API只返回已发布的礼物
      if (!req.user || req.user.role !== 'admin') {
        query.status = 'published';
        query.publishTime = { $lte: new Date() };
      }
    }

    // 关键词搜索
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    const gifts = await Gift.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gifts.length,
      data: gifts
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    获取单个礼物
 * @route   GET /api/gifts/:id
 * @access  Public
 */
exports.getGift = async (req, res, next) => {
  try {
    const gift = await Gift.findById(req.params.id);

    if (!gift) {
      return res.status(404).json({
        success: false,
        error: '未找到该礼物'
      });
    }

    // 检查非管理员是否可以访问未发布的礼物
    if ((!req.user || req.user.role !== 'admin') && 
        (gift.status !== 'published' || gift.publishTime > new Date())) {
      return res.status(404).json({
        success: false,
        error: '未找到该礼物'
      });
    }

    res.status(200).json({
      success: true,
      data: gift
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    创建礼物
 * @route   POST /api/gifts
 * @access  Private/Admin
 */
exports.createGift = async (req, res, next) => {
  try {
    const gift = await Gift.create(req.body);

    res.status(201).json({
      success: true,
      data: gift
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    更新礼物
 * @route   PUT /api/gifts/:id
 * @access  Private/Admin
 */
exports.updateGift = async (req, res, next) => {
  try {
    const gift = await Gift.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!gift) {
      return res.status(404).json({
        success: false,
        error: '未找到该礼物'
      });
    }

    res.status(200).json({
      success: true,
      data: gift
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    删除礼物
 * @route   DELETE /api/gifts/:id
 * @access  Private/Admin
 */
exports.deleteGift = async (req, res, next) => {
  try {
    const gift = await Gift.findById(req.params.id);

    if (!gift) {
      return res.status(404).json({
        success: false,
        error: '未找到该礼物'
      });
    }

    await gift.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 