import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import userLogin from "../views/auth/userLogin.vue"
import userRegister from "../views/auth/userRegister.vue"
import userLogout from "../views/auth/userLogout.vue"
import UserManageVIew from '../views/UserManageVIew.vue'
import addVenue from '../views/venue/addVenue.vue'
import manage from '../views/ManageView.vue'
import VenueManage from '../views/venue/VenueManage.vue'
import Venuebrowse from "@/views/Venuebrowse.vue";
import VenueReserve  from "@/views/VenueReserve.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: "/login", component: userLogin },
    { path: "/register", component: userRegister },
    { path: "/logout", component: userLogout },
    {path: "/venue", component: Venuebrowse},
    {path:"/reserve", component: VenueReserve},

    // 後臺管理
    { path: "/manage", component: manage },
    { path: "/manage/user", component: UserManageVIew },
    { path: "/manage/venue", component: VenueManage },
    { path: "/manage/venue/add", component: addVenue },
    { path: "/manage/venue/edit/:venueId?", name: 'EditVenue',component: addVenue, props:true},


  ]
})

export default router
