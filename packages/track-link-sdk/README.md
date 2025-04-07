# @ifreeovo/track-link-sdk

![node](https://img.shields.io/badge/node->=18-brightgreen.svg)
![npm](https://img.shields.io/badge/pnpm->=8.0.0-blue.svg)
![MIT License](https://img.shields.io/badge/license-MIT-brightgreen.svg)
![download](https://img.shields.io/npm/dw/@ifreeovo/track-link-sdk)

可视化埋点通讯SDK，提供DOM元素高亮、XPath生成、埋点截图、postmessage通讯和CDP协议通信功能。(需要配合[埋点后台](https://github.com/IFreeOvO/visual-event-tracking)使用)

## 功能特性

- 🔍 DOM元素高亮与检查
- 📝 自动生成元素XPath
- 🔗 基于CDP协议的通信能力
- 📱 支持iframe路由控制
- 🛠️ 自动截取埋点图片

## 安装

### 使用npm安装

```bash
npm install @ifreeovo/track-link-sdk
```

在`main.js`中引入：

```js
import SDK, { WS_FROM } from '@ifreeovo/track-link-sdk'

SDK.init({
    trackingClientURL: 'http://localhost:8000',
    socket: {
        devtoolURL: `ws://localhost:3000/api/v1/remote/devtool`,
        from: WS_FROM.CLIENT,
    },
})
```

## 配置选项

- **trackingClientURL** `{string}` [必填]  
  埋点客户端URL，用于postmessage跨域通信，例如：`http://localhost:8000`

- **socket** `{object}` [必填]  
  WebSocket连接配置：
    - `devtoolURL` - DevTool WebSocket服务地址，如：`ws://localhost:3000/api/v1/remote/devtool`
    - `from` - 客户端来源标识，使用`WS_FROM.CLIENT`常量

## 开源许可证

[MIT](./LICENSE)
