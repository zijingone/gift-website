const mongoose = require('mongoose');

/**
 * 礼物模型
 * @typedef {Object} Gift
 * @property {string} name - 礼物名称
 * @property {string} description - 礼物描述
 * @property {number} price - 价格
 * @property {string} coverImage - 封面图片URL
 * @property {Array<string>} tags - 标签ID列表
 * @property {string} [background] - 背景故事（可选）
 * @property {string} [features] - 产品特点（可选）
 * @property {string} status - 状态（draft/published）
 * @property {Date} createdAt - 创建时间
 * @property {Date} updatedAt - 更新时间
 */
const giftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  coverImage: {
    type: String,
    required: true
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  background: {
    type: String,
    trim: true
  },
  features: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gift', giftSchema); 