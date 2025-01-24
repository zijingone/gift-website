const mongoose = require('mongoose');

/**
 * 标签模型
 * @typedef {Object} Tag
 * @property {string} name - 标签名称
 * @property {string} category - 标签分类
 * @property {string} [description] - 标签描述（可选）
 * @property {Date} createdAt - 创建时间
 * @property {Date} updatedAt - 更新时间
 */
const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '标签名称是必需的'],
    trim: true,
    maxlength: [50, '标签名称不能超过50个字符']
  },
  category: {
    type: String,
    required: [true, '标签分类是必需的'],
    trim: true,
    enum: ['MBTI', 'gender', 'age', 'relationship', 'price', 'giftCategory', 'zodiac']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, '标签描述不能超过200个字符']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 创建复合索引
tagSchema.index({ category: 1, name: 1 }, { unique: true });

// 添加错误处理中间件
tagSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('标签名称在该分类下已存在'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Tag', tagSchema); 