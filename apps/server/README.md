# 埋点管理服务

![Node.js](https://img.shields.io/badge/node->=18-brightgreen.svg)
![NestJS](https://img.shields.io/badge/nestjs-10.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)

基于NestJS的埋点后台管理服务，提供埋点配置、数据验证、RBAC权限管理等功能。

## 开发模式

先启动微服务`log-microservice`，再启动后台管理服务

```bash
pnpm dev
```

## 生产部署

```bash
pnpm build
```

## 注意事项

使用时，请创建`.env.local`文件，在其中添加以下配置：

```bash
# 邮箱smtp
smtp_host = smtp.qq.com
smtp_port = 587
smtp_user = xxxxxxxxx@qq.com
smtp_pass = xxxxxxx
```

否则无法使用注册功能
