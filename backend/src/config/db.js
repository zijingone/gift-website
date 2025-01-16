const mongoose = require('mongoose');

/**
 * 连接数据库
 * @returns {Promise} 数据库连接Promise
 */
const connectDB = async () => {
  try {
    console.log('正在连接到数据库...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'gift-website' // 显式指定数据库名称
    });

    console.log(`MongoDB 连接成功: ${conn.connection.host}`);
    console.log(`当前数据库: ${conn.connection.name}`);
    console.log('连接详情:', {
      host: conn.connection.host,
      name: conn.connection.name,
      port: conn.connection.port,
      user: conn.connection.user
    });
  } catch (error) {
    console.error(`MongoDB 连接失败: ${error.message}`);
    console.error('错误详情:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 