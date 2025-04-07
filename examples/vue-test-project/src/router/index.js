import {  createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../views/home.vue'
import AboutView from '../views/about.vue'

const routes = [
  { path: '/home', component: HomeView },
  { path: '/about', component: AboutView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router