# 使用 Node.js 18 作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 创建上传目录
RUN mkdir -p /var/www/uploads && \
    chown -R node:node /var/www/uploads && \
    chmod -R 755 /var/www/uploads

# 使用非 root 用户运行应用
USER node

# 暴露端口
EXPOSE 5000

# 启动应用
CMD ["npm", "start"] 