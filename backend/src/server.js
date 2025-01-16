const dotenv = require('dotenv');
// 加载环境变量
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// 路由
const authRoutes = require('./routes/auth');
const giftRoutes = require('./routes/gifts');
const uploadRoutes = require('./routes/upload');
const tagRoutes = require('./routes/tags');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/gifts', giftRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tags', tagRoutes);

// 数据库连接
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB 连接成功');
  })
  .catch((err) => {
    console.error('MongoDB 连接失败:', err);
  });

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 