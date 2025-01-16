/**
 * 环境配置文件
 * @module config
 */

const config = {
  /**
   * MongoDB 配置
   * 注意：MONGODB_URI 应该从环境变量获取
   * 本地开发时可以使用 mongodb://localhost:27017/gift_website
   */
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gift_website',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },

  /**
   * JWT 配置
   */
  jwt: {
    secret: process.env.JWT_SECRET || 'gift_website_secure_key_8x9y2z_2024_!@#$%^',
    expiresIn: '7d' // Token 有效期为 7 天
  },

  /**
   * Cloudinary 配置
   * 注意：这些值应该从环境变量获取
   */
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  },

  /**
   * 服务器配置
   */
  server: {
    port: process.env.PORT || 3000,
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true
    }
  }
};

module.exports = config; 