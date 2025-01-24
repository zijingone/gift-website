const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('已经连接到数据库');
    return;
  }

  try {
    console.log('正在连接到数据库...');
    console.log('MongoDB URI:', process.env.MONGODB_URI?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    isConnected = true;
    console.log(`MongoDB 连接成功: ${conn.connection.host}`);
    console.log(`数据库名称: ${conn.connection.name}`);

    // 监听连接错误
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB 连接错误:', err);
      isConnected = false;
    });

    // 监听连接断开
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB 连接断开');
      isConnected = false;
      // 尝试重新连接
      setTimeout(connectDB, 5000);
    });

  } catch (error) {
    console.error('MongoDB 连接失败:', error);
    console.error('错误详情:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    
    // 如果连接失败，5秒后重试
    setTimeout(connectDB, 5000);
    
    throw error;
  }
};

module.exports = connectDB; 