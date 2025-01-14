# 礼品信息网站

这是一个用于展示和管理礼品信息的网站系统，包含前台展示和后台管理功能。

## 功能特点

### 前台功能
- 礼物列表展示（图片、名称、价格、标签、内容预览）
- 收藏功能
- 标签筛选系统（MBTI、年龄、性别、关系、日用品、奢侈品等）
- 礼物详情页
- 关键词搜索
- 标签搜索

### 后台功能
- 礼物信息管理（添加、编辑、删除）
- 图片上传
- 标签管理
- 模板化内容编辑

## 项目结构

```
gift-website/
├── frontend/           # 前端项目
│   ├── src/
│   │   ├── components/ # 可复用组件
│   │   ├── pages/     # 页面组件
│   │   ├── assets/    # 静态资源
│   │   ├── utils/     # 工具函数
│   │   └── services/  # API 服务
│   └── public/        # 公共资源
└── backend/           # 后端项目
    ├── src/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   └── utils/
    └── uploads/       # 文件上传目录
```

## 技术栈

### 前端
- React
- React Router
- Ant Design
- Axios

### 后端
- Node.js
- Express
- MongoDB
- Multer (文件上传)

## 开发环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0
- MongoDB >= 4.0.0

## 安装步骤

1. 安装 Node.js 和 npm
   - 访问 https://nodejs.org/ 下载并安装最新的 LTS 版本

2. 安装项目依赖
   ```bash
   # 前端
   cd frontend
   npm install

   # 后端
   cd ../backend
   npm install
   ```

3. 配置环境变量
   - 复制 `.env.example` 到 `.env`
   - 根据实际情况修改配置

4. 启动开发服务器
   ```bash
   # 前端
   npm run dev

   # 后端
   npm run start
   ```

## 部署说明

1. 构建前端项目
   ```bash
   cd frontend
   npm run build
   ```

2. 配置后端服务器
   - 确保 MongoDB 服务已启动
   - 配置环境变量
   - 启动后端服务

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交改动
4. 发起 Pull Request

## 许可证

MIT 