import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'

import LoginBasic from '../views/basic/LoginBasic.vue'
import DashBasic from '../views/basic/DashBasic.vue'

import LoginBearer from '../views/bearer/LoginBearer.vue'
import DashBearer from '../views/bearer/DashBearer.vue'

import LoginJwt from '../views/jwt/LoginJwt.vue'
import DashJwt from '../views/jwt/DashJwt.vue'

const routes = [
  { path: '/', name: 'home', component: Home },

  { path: '/basic/login', name: 'login_basic', component: LoginBasic },
  { path: '/basic/dashboard', name: 'dash_basic', component: DashBasic },

  { path: '/bearer/login', name: 'login_bearer', component: LoginBearer },
  { path: '/bearer/dashboard', name: 'dash_bearer', component: DashBearer },

  { path: '/jwt/login', name: 'login_jwt', component: LoginJwt },
  { path: '/jwt/dashboard', name: 'dash_jwt', component: DashJwt },

  { path: '/:pathMatch(.*)*', name: 'not_found', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
