# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 创建上传目录
RUN mkdir -p /var/www/uploads && \
    chown -R nginx:nginx /var/www/uploads && \
    chmod -R 755 /var/www/uploads

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 