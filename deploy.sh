#!/bin/bash

# 设置环境变量
export NODE_ENV=production

# 前端构建
echo "构建前端应用..."
npm run build

# 创建必要的目录
echo "创建部署目录..."
sudo mkdir -p /var/www/gift-website
sudo mkdir -p /var/www/uploads

# 复制文件
echo "复制构建文件..."
sudo cp -r dist/* /var/www/gift-website/
sudo cp nginx.conf /etc/nginx/sites-available/gift-website
sudo ln -s /etc/nginx/sites-available/gift-website /etc/nginx/sites-enabled/

# 设置权限
echo "设置文件权限..."
sudo chown -R www-data:www-data /var/www/gift-website
sudo chown -R www-data:www-data /var/www/uploads
sudo chmod -R 755 /var/www/gift-website
sudo chmod -R 755 /var/www/uploads

# 重启服务
echo "重启服务..."
sudo systemctl restart nginx

# 启动后端服务
echo "启动后端服务..."
pm2 delete gift-website-api || true
pm2 start src/server.js --name gift-website-api

echo "部署完成！" 