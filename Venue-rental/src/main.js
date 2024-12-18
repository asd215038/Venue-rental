import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import './index.css'

library.add(fas, far, fab);

const app = createApp(App)

store.dispatch('initAuth'); // 初始化 Firebase 登入監聽

app.use(router).use(store)
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app')
