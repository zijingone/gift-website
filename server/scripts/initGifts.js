require('dotenv').config();
const mongoose = require('mongoose');
const Gift = require('../models/Gift');
const Tag = require('../models/Tag');
const connectDB = require('../config/db');

const initGifts = async () => {
  try {
    // 连接数据库
    await connectDB();
    console.log('数据库连接成功');

    // 创建测试标签
    const tags = await Tag.create([
      { name: 'INFP', category: 'MBTI', description: '理想主义者' },
      { name: '创意', category: 'giftCategory', description: '富有创意的礼物' },
      { name: '实用', category: 'giftCategory', description: '实用性礼物' }
    ]);
    console.log('标签创建成功:', tags);

    // 创建测试礼物
    const gift = await Gift.create({
      name: '创意手工灯',
      description: '可以自定义图案的3D打印小夜灯，温暖又独特',
      price: 199,
      coverImage: 'https://res.cloudinary.com/dhwcfloyc/image/upload/v1703747711/gift-website/lamp.jpg',
      tags: tags.map(tag => tag._id),
      background: '送给喜欢独特和有创意的人',
      features: '可定制、环保材料、触控调光',
      status: 'published'
    });
    console.log('礼物创建成功:', gift);

    console.log('初始化数据完成');
    process.exit(0);
  } catch (error) {
    console.error('初始化数据失败:', error);
    process.exit(1);
  }
};

initGifts(); 