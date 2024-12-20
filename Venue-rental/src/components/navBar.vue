<template>
  <nav class="bg-[#39B3E3] p-4 text-bg text-white">
    <div class=" flex flex-wrap items-center grid grid-cols-10 gap-4">
      <!-- Logo and Brand -->
      <div class="col-span-2 flex justify-end">
        <div class="flex items-center">
          <font-awesome-icon :icon="['fas', 'person-running']" class="text-yellow-400 mr-5 text-2xl" />
          <router-link to="/" class="text-white text-lg font-semibold">
            Playground
          </router-link>
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <button class="lg:hidden block text-white hover:text-yellow-300 focus:outline-none" @click="isOpen = !isOpen">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-16 6h16" />
        </svg>
      </button>

      <!-- Navigation Links -->
      <div :class="[isOpen ? 'block' : 'hidden', 'lg:flex lg:items-center w-full lg:w-auto']"
        class="mt-4 ml-2 lg:mt-0 col-span-6">
        <ul class="lg:flex space-y-2 lg:space-y-0 lg:space-x-1">
          <li>
            <router-link to="/venue"
              class="block px-1 py-2 text-white hover:text-yellow-300 rounded transition duration-150"
              active-class="font-bold underline">
              場地查詢
            </router-link>
          </li>
          <li>
            <router-link to="/reserve"
              class="block px-1 py-2 text-white hover:text-yellow-300 rounded transition duration-150"
              active-class="font-bold underline">
              場地租借
            </router-link>
          </li>
          <li>
            <router-link to="/search"
              class="block px-1 py-2 text-white hover:text-yellow-300 rounded transition duration-150"
              active-class="font-bold underline">
              訂單查詢
            </router-link>
          </li>
          <li v-if="isAdmin">
            <router-link to="/manage"
              class="block px-1 py-2 text-white hover:text-yellow-300 rounded transition duration-150"
              active-class="font-bold underline">
              後臺管理
            </router-link>
          </li>
        </ul>

      </div>
      <!-- Auth Buttons -->
      <div class="lg:ml-4 mt-4 lg:mt-0 flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 col-span-2">
        <router-link to="/" class="px-4 py-2 text-white hover:text-yellow-300 transition duration-150">
          首頁
        </router-link>

        <div v-if="isLoggedIn" class="flex items-center px-4">
          <p class="text-white">{{ user.displayName }}</p>
        </div>

        <router-link v-if="isLoggedIn" to="/logout"
          class="px-4 py-2 text-white hover:text-yellow-300 transition duration-150">
          登出
        </router-link>

        <router-link v-else to="/login" class="px-4 py-2 text-white hover:text-yellow-300 transition duration-150">
          登入 / 註冊
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { mapGetters } from 'vuex'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'user', 'isAdmin']), // 添加 isAdmin
  },
  methods: {
    logout() {
      this.$store.dispatch('logOut');
    }
  },
  mounted() {
    console.log('isAdmin:', this.isAdmin);
    console.log('user:', this.user);
    console.log('isLoggedIn:', this.isLoggedIn);
    // 手動觸發檢查
    this.$store.dispatch('checkAdminStatus');
  }
}
</script>