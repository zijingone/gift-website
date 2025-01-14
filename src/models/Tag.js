const mongoose = require('mongoose');

/**
 * 标签数据模型
 */
const tagSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, '请输入标签名称'],
    trim: true
  },
  category: {
    type: String,
    required: [true, '请选择标签分类'],
    enum: ['MBTI', '节日', '生日', '纪念日', '礼物', '标签']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tag', tagSchema); 