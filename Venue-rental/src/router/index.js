import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import userLogin from "../components/auth/userLogin.vue"
import userRegister from "../components/auth/userRegister.vue"
import userLogout from "../components/auth/userLogout.vue"
import UserManageVIew from '../views/UserManageVIew.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/UserManageVIew.vue')
    },
    { path: "/login", component: userLogin },
    { path: "/register", component: userRegister },
    { path: "/logout", component: userLogout },
    { path: "/user/manage", component: UserManageVIew },
  ]
})

export default router
