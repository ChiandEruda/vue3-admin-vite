import { createRouter, createWebHistory } from 'vue-router'
import axios from '@/plugins/axios'
import store from '@/store'
import HomeView from '@/views/HomeView.vue'
import User from '@/views/sys/User.vue'
import Role from '@/views/sys/Role.vue'
import Menu from '@/views/sys/Menu.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/index',
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
      // {
      //   path: '/sys/user',
      //   name: 'SysUser',
      //   component: User
      // },
      // {
      //   path: '/sys/role',
      //   name: 'SysRole',
      //   component: Role
      // },
      // {
      //   path: '/sys/menu',
      //   name: 'SysMenu',
      //   component: Menu
      // }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // vite 配置
  routes: routes
})

router.beforeEach((to, from ,next) => {

  let hasRoute = store.state.menus.hasRoute

  if(!hasRoute) {
    axios.get('/sys/menu/nav', {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then( res => {
      // 拿到左侧导航
      store.commit('setMenuList', res.data.data.nav)
  
      // 拿到用户权限
      store.commit('setPermitList', res.data.data.permit)
  
      // 动态绑定路由
      let newRoutes = router.options.routes
  
      res.data.data.nav.forEach(menu => {
        if (menu.children) {
          menu.children.forEach(e => {
            // 将导航转换成路由
            let route = menuToRoute(e)
  
            // 添加到路由管理 Home 下面
            if(route)newRoutes[0].children.push(route);
          })
  
        }
      });
      
      // router.addRoute(newRoutes)
      newRoutes.forEach(r => {
        router.addRoute(r)
      })

      // console.log(router.getRoutes())
      hasRoute = true
      store.commit('setRoute', true)

      next ({...to, replace: true})
    })    

  } else {
    next()
  }

})

let modules = import.meta.glob('../views/**/*.vue')
let menuToRoute = menu => {
  if(!menu.component)return null;

  let route = {
    name: menu.name,
    path: menu.path,
    meta: {
      icon: menu.icon,
      title: menu.title
    }
  }
  
  route.component = modules[`../views/${menu.component}.vue`]
  // route.component = defineAsyncComponent(() => import(`@/views/${menu.component}.vue`))

  return route
}

export default router