import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import userLogin from "../views/auth/userLogin.vue"
import userRegister from "../views/auth/userRegister.vue"
import userLogout from "../views/auth/userLogout.vue"
import UserManageVIew from '../views/UserManageVIew.vue'
import addVenue from '../views/venue/addVenue.vue'
import manage from '../views/ManageView.vue'
import VenueManage from '../views/venue/VenueManage.vue'
import NewsView from '../views/news/NewsView.vue'
import addNews from '../views/news/addNews.vue'
import ordersearch from "@/views/Ordersearch.vue";
import OrdersManage from '@/views/orders/OrdersManage.vue'
import forgotPassword from "@/views/auth/forgotPassword.vue";
import Profile from "@/views/auth/Profile.vue";
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
    {path:"/search", component: ordersearch},
    {path:"/forgotPassword", component: forgotPassword},
    {path:"/profile", component: Profile},
    // 後臺管理
    { path: "/manage", component: manage },
    { path: "/manage/user", component: UserManageVIew },
    { path: "/manage/venue", component: VenueManage },
    { path: "/manage/venue/add", component: addVenue },
    { path: "/manage/venue/edit/:venueId?", name: 'EditVenue',component: addVenue, props:true},
    { path: "/manage/news", component: NewsView},
    { path: "/manage/news/add", component: addNews},
    { path: "/manage/news/edit/:newsId?", name: 'EditNews',component: addNews, props:true},
    { path: "/manage/orders", component: OrdersManage},

  ]
})

export default router
