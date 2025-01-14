# 部署检查清单

## 1. 环境准备
- [ ] 购买域名（推荐：阿里云/腾讯云）
- [ ] 购买服务器（建议配置：2核4G以上）
- [ ] 域名备案（国内服务器必须）
- [ ] 配置域名解析（A记录指向服务器IP）
- [ ] 申请SSL证书（推荐：Let's Encrypt）

## 2. 服务器环境配置
- [ ] 安装 Docker 和 Docker Compose
```bash
curl -fsSL https://get.docker.com | sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## 3. 部署前检查
- [ ] 确认所有环境变量已配置
  - 检查 .env.production 文件
  - 设置数据库连接信息
  - 配置七牛云存储信息
- [ ] 确认数据库备份方案
- [ ] 检查文件上传配置
- [ ] 确认日志收集方案

## 4. 部署步骤
1. 克隆代码到服务器
```bash
git clone [your-repository-url]
cd gift-website
```

2. 配置环境变量
```bash
cp .env.example .env.production
# 编辑 .env.production 填入实际的配置信息
```

3. 使用 Docker Compose 部署
```bash
docker-compose up -d
```

4. 检查服务状态
```bash
docker-compose ps
docker-compose logs
```

## 5. 部署后检查
- [ ] 验证网站可访问性
- [ ] 测试用户注册/登录功能
- [ ] 验证图片上传功能
- [ ] 检查数据库连接
- [ ] 确认日志正常记录
- [ ] 测试后台管理功能
- [ ] 验证 HTTPS 证书生效

## 6. 监控和维护
- [ ] 设置服务器监控（CPU、内存、磁盘）
- [ ] 配置日志轮转
- [ ] 设置数据库定时备份
- [ ] 配置告警通知

## 7. 安全检查
- [ ] 确认防火墙规则
- [ ] 检查文件权限
- [ ] 验证 SSL/TLS 配置
- [ ] 确认敏感信息加密存储
- [ ] 检查 XSS/CSRF 防护

## 8. 性能优化
- [ ] 配置 Nginx 缓存
- [ ] 开启 Gzip 压缩
- [ ] 配置静态资源 CDN
- [ ] 检查数据库索引

## 紧急情况处理
1. 回滚步骤
```bash
# 使用旧版本镜像
docker-compose down
docker-compose up -d --no-deps [service_name]

# 或者回滚数据库
mongorestore --uri "[mongodb-uri]" backup/
```

2. 常用调试命令
```bash
# 查看容器日志
docker-compose logs -f [service_name]

# 进入容器
docker-compose exec [service_name] sh

# 检查网络连接
docker-compose exec [service_name] ping [target]
``` 