require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const giftRoutes = require('./routes/gifts');
const uploadRoutes = require('./routes/upload');
const tagRoutes = require('./routes/tags');

const app = express();
const PORT = process.env.PORT || 3000;

// 连接数据库
connectDB();

// 中间件
app.use(cors());
app.use(express.json());

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/gifts', giftRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tags', tagRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' });
});

// 静态文件路由 - 确保在通配符路由之前
app.use(express.static(path.join(__dirname, '../dist')));

// 所有其他请求返回 index.html
app.get('*', (req, res) => {
  console.log('Serving index.html for path:', req.path);
  res.sendFile(path.join(__dirname, '../dist/index.html'), err => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error loading page');
    }
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: '服务器错误' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`静态文件目录: ${path.join(__dirname, '../dist')}`);
}); 