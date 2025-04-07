# 埋点日志微服务

![Node.js](https://img.shields.io/badge/node->=18-brightgreen.svg)
![NestJS](https://img.shields.io/badge/nestjs-10.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)

基于NestJS的埋点日志收集与分析微服务，支持Kafka消息队列和TCP协议通信。

## 开发模式

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
# kafka 服务配置
kafka_brokers==192.xxx.x.xxx:xxxx
```

否则无法使用kafka消息队列。
