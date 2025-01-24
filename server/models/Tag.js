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
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tag', tagSchema); 