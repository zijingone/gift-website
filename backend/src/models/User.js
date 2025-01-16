const mongoose = require('mongoose');

/**
 * 用户模型
 * @typedef {Object} User
 * @property {string} username - 用户名
 * @property {string} password - 加密后的密码
 * @property {string} role - 用户角色
 * @property {Date} createdAt - 创建时间
 * @property {Date} updatedAt - 更新时间
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名是必需的'],
    unique: true,
    trim: true,
    minlength: [3, '用户名至少需要3个字符'],
    maxlength: [50, '用户名不能超过50个字符']
  },
  password: {
    type: String,
    required: [true, '密码是必需的'],
    minlength: [6, '密码至少需要6个字符']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true,
  collection: 'users' // 显式指定集合名称
});

module.exports = mongoose.model('User', userSchema, 'users'); 