import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import User from '@/views/sys/User.vue'
import Role from '@/views/sys/Role.vue'
import Menu from '@/views/sys/Menu.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    children: [
      {
        path: '/index',
        name: 'Index',
        meta: {
          title: "首页"
        },
        component: () => import('@/views/IndexView.vue')
      },
      {
        path: '/userCenter',
        name: 'UserCenter',
        component: () => import('@/views/UserCenter.vue')
      },
      {
        path: '/sys/user',
        name: 'SysUser',
        component: User
      },
      {
        path: '/sys/role',
        name: 'SysRole',
        component: Role
      },
      {
        path: '/sys/menu',
        name: 'SysMenu',
        component: Menu
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  }
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // vite
  routes: routes
})
