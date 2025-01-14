const mongoose = require('mongoose');

/**
 * 礼物数据模型
 */
const giftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '请输入礼物名称'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, '请输入价格']
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: [true, '请上传图片']
  },
  tags: [{
    id: String,
    name: String
  }],
  modules: [{
    title: String,
    content: String,
    images: [String],
    layout: {
      type: String,
      enum: ['single', 'double', 'triple'],
      default: 'single'
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'draft'
  },
  publishTime: {
    type: Date
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

module.exports = mongoose.model('Gift', giftSchema); 