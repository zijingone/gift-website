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
    required: [true, '礼物名称是必需的'],
    trim: true,
    maxlength: [100, '礼物名称不能超过100个字符']
  },
  description: {
    type: String,
    required: [true, '礼物描述是必需的'],
    trim: true,
    maxlength: [1000, '礼物描述不能超过1000个字符']
  },
  price: {
    type: Number,
    required: [true, '价格是必需的'],
    min: [0, '价格不能小于0']
  },
  coverImage: {
    type: String,
    required: [true, '封面图片是必需的'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: '封面图片必须是有效的URL'
    }
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: [true, '至少需要一个标签']
  }],
  background: {
    type: String,
    trim: true,
    maxlength: [2000, '背景故事不能超过2000个字符']
  },
  features: {
    type: String,
    trim: true,
    maxlength: [1000, '产品特点不能超过1000个字符']
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'published'],
      message: '状态必须是 draft 或 published'
    },
    default: 'draft',
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 创建索引
giftSchema.index({ name: 'text', description: 'text' });
giftSchema.index({ status: 1, createdAt: -1 });
giftSchema.index({ tags: 1 });

// 添加错误处理中间件
giftSchema.post('save', function(error, doc, next) {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    next(new Error(messages.join(', ')));
  } else {
    next(error);
  }
});

// 添加查询中间件
giftSchema.pre('find', function() {
  console.log('执行礼物查询:', this.getQuery());
});

module.exports = mongoose.model('Gift', giftSchema); 