# @ifreeovo/track-client-sdk

![node](https://img.shields.io/badge/node->=18-brightgreen.svg)
![npm](https://img.shields.io/badge/pnpm->=8.0.0-blue.svg)
![MIT License](https://img.shields.io/badge/license-MIT-brightgreen.svg)
![download](https://img.shields.io/npm/dw/@ifreeovo/track-client-sdk)

自动上报埋点日志的客户端SDK，支持曝光和点击事件采集，提供数据验证功能。(需要配合[埋点后台](https://github.com/IFreeOvO/visual-event-tracking)使用)

## 功能特性

- 📊 自动采集页面曝光事件
- 🖱️ 自动采集元素点击事件
- 🔍 支持数据验证功能
- 🚀 支持多种上报方式（Beacon/Gif）
- 🔄 自动监听路由变化，加载当前路由埋点信息

## 用法

### 使用npm安装

```bash
npm install @ifreeovo/track-client-sdk
```

在`main.js`中引入：

```js
import Tracker from '@ifreeovo/track-client-sdk'
const tracker = new Tracker({
    serverURL: 'http://localhost:3000/api/v1',
    projectId: 1,
})
tracker.start()
```

### 使用cdn安装

```html
<script src="https://unpkg.com/@ifreeovo/track-client-sdk@1.0.0/dist/umd/index.umd.js"></script>
<script>
    const tracker = new __TRACK_CLIENT_SDK__({
        serverURL: 'http://localhost:3000/api/v1',
        projectId: 1,
    })
    tracker.start()
</script>
```

## 配置选项

- **serverURL** `{string}` [必填] - 埋点服务端地址，例如：`http://localhost:3000/api/v1`。用于请求页面的埋点配置。使用时注意跨域，建议后台开启cors
- **projectId** `{number}` [必填] - 项目ID，从埋点后台获取。用于请求页面的埋点配置
- **sendType** `{string}` [可选] - 上报方式，可选值：
    - `beacon` (默认) - 使用navigator.sendBeacon上报
    - `gif` - 使用图片打点上报
- **mode** `{string}` [可选] - 运行模式，可选值：
    - `report` (默认) - 仅上报数据。会将数据存入clickhouse
    - `validate` - 仅验证数据。数据仅通过postmessage传递给埋点后台进行验证，不会存储数据到数据库
    - `reportAndValidate` - 同时上报和验证数据
- **trackingClientURL** `{string}` [可选] - 埋点后台URL，用于postmessage跨域通信
- **accuracy** `{number}` [可选] - 验证标记精度，默认0.85。这个值越小，验证通过率越高，但是误报概率也会增大
- **intersectionObserverOptions** `{object}` [可选] - 曝光检测配置：
    - `threshold` - 曝光阈值(0-1)，默认0.5

## 埋点验证时，推荐配置

```js
const tracker = new __TRACK_CLIENT_SDK__({
    serverURL: 'http://localhost:3000/api/v1',
    projectId: 1,
    mode: 'validate',
    trackingClientURL: 'http://localhost:8000',
})
tracker.start()
```

埋点验证时，另外需要额外引入`@ifreeovo/track-link-sdk`包配合使用。埋点后台才能监控iframe路由变化。代码如下

```js
import SDK from '@ifreeovo/track-link-sdk'
SDK.init({
    trackingClientURL: 'http://localhost:8000',
})
```

## 生产环境，自动上报埋点推荐配置

```js
const tracker = new __TRACK_CLIENT_SDK__({
    serverURL: 'http://localhost:3000/api/v1',
    projectId: 1,
})
tracker.start()
```

## 开源许可证

[MIT](./LICENSE)
