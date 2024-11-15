import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import userLogin from "../views/auth/userLogin.vue"
import userRegister from "../views/auth/userRegister.vue"
import userLogout from "../views/auth/userLogout.vue"
import UserManageVIew from '../views/UserManageVIew.vue'
import addVenue from '../views/venue/addVenue.vue'
import manage from '../views/ManageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: "/login", component: userLogin },
    { path: "/register", component: userRegister },
    { path: "/logout", component: userLogout },
    { path: "/manage/user", component: UserManageVIew },
    // { path: "/manage/venue", component: addVenue },
    { path: "/manage/addVenue", component: addVenue },
    { path: "/manage", component: manage },
  ]
})

export default router
