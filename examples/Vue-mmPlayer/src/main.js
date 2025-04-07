// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'babel-polyfill'
// import '@/utils/hack'
import Icon from 'base/mm-icon/mm-icon'
import mmToast from 'base/mm-toast'
// import fastclick from 'fastclick'
import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import App from './App'
import { VERSION } from './config'
import router from './router'
import store from './store'
import '@/mock'
import defaultImg from '@/assets/img/default.png'
import '@/styles/index.less'

import SDK, { WS_FROM } from '@ifreeovo/track-link-sdk'

SDK.init({
  trackingClientURL: `http://${import.meta.env.VITE_SERVER_HOST}:8000`,
  socket: {
    devtoolURL: `ws://${import.meta.env.VITE_SERVER_HOST}:3000/api/v1/remote/devtool`,
    from: WS_FROM.CLIENT,
  },
})

const tracker = new __TRACK_CLIENT_SDK__({
  // 上报埋点
  serverURL: `http://${import.meta.env.VITE_SERVER_HOST}:3000/api/v1`, // 后端服务域名
  projectId: 1, // 项目id
  // 验证
  mode: 'reportAndValidate', // 上报模式。mode为validate时，仅验证。mode为report时，仅上报日志。mode为reportAndValidate时，既上报又验证
  trackingClientURL: `http://${import.meta.env.VITE_SERVER_HOST}:8000`, // 埋点客户端地址
})
tracker.start()

// 优化移动端300ms点击延迟
// fastclick.attach(document.body)

// 弹出层
Vue.use(mmToast)

// icon 组件
Vue.component(Icon.name, Icon)

// 懒加载
Vue.use(VueLazyload, {
  preLoad: 1,
  loading: defaultImg,
})

// 访问版本统计
window._hmt && window._hmt.push(['_setCustomVar', 1, 'version', VERSION, 1])

const redirectList = ['/music/details', '/music/comment']
router.beforeEach((to, from, next) => {
  window._hmt && to.path && window._hmt.push(['_trackPageview', '/#' + to.fullPath])
  if (redirectList.includes(to.path)) {
    next()
  } else {
    document.title =
      (to.meta.title && `${to.meta.title} - mmPlayer在线音乐播放器`) || 'mmPlayer在线音乐播放器'
    next()
  }
})

// 版权信息
window.mmPlayer = window.mmplayer = `欢迎使用 mmPlayer!
当前版本为：V${VERSION}
作者：茂茂
Github：https://github.com/maomao1996/Vue-mmPlayer
歌曲来源于网易云音乐 (https://music.163.com)`
// eslint-disable-next-line no-console
console.info(`%c${window.mmplayer}`, `color:blue`)

// eslint-disable-next-line no-new
new Vue({
  el: '#mmPlayer',
  store,
  router,
  render: (h) => h(App),
})
